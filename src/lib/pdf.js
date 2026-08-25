import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { NOMBRE_APP } from '../config/config'
import { formatearMoneda } from './format'

export function generarPDF(jornada, ventas) {
  const doc = new jsPDF()
  const total = ventas.reduce((acc, v) => acc + (v.total ?? 0), 0)

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
      (v.items ?? []).map((i) => `${i.producto} x${i.cantidad} - $${formatearMoneda(i.precioFinal)}`).join('\n'),
      `$${formatearMoneda(v.total ?? 0)}`,
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

export function descargarPDF(doc, filename) {
  doc.save(filename)
}
