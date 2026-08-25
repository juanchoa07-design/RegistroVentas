import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { NOMBRE_APP } from '../config/config'
import { formatearMoneda } from './format'

export function generarPDF(jornada, ventas) {
  const doc = new jsPDF()
  const total = ventas.reduce((acc, v) => acc + v.total, 0)

  doc.setFontSize(16)
  doc.text(NOMBRE_APP, 14, 18)

  doc.setFontSize(11)
  doc.text(`Fecha: ${jornada.fecha}`, 14, 27)
  if (jornada.nombreReparto) {
    doc.text(`Reparto: ${jornada.nombreReparto}`, 14, 33)
  }

  autoTable(doc, {
    startY: jornada.nombreReparto ? 39 : 33,
    head: [['Cliente', 'Productos', 'Total venta']],
    body: ventas.map((v) => [
      v.cliente,
      v.items.map((i) => `${i.producto} x${i.cantidad} - $${formatearMoneda(i.precioFinal)}`).join('\n'),
      `$${formatearMoneda(v.total)}`,
    ]),
    foot: [['', 'TOTAL GENERAL', `$${formatearMoneda(total)}`]],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] },
    footStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontStyle: 'bold' },
  })

  return doc
}

export function nombreArchivoPDF(jornada) {
  const base = jornada.nombreReparto ? jornada.nombreReparto.replace(/\s+/g, '_') : 'reparto'
  return `ventas_${base}_${jornada.fecha}.pdf`
}

export async function compartirOPescargarPDF(doc, filename) {
  try {
    const blob = doc.output('blob')
    const file = new File([blob], filename, { type: 'application/pdf' })
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Registro de ventas',
        text: 'Registro de ventas del día',
      })
      return 'compartido'
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return 'cancelado'
    console.error('Error al compartir el PDF:', err)
  }

  doc.save(filename)
  return 'descargado'
}
