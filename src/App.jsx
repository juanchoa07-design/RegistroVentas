import { useMemo, useState } from 'react'
import './App.css'
import NuevaJornada from './components/NuevaJornada'
import VentaForm from './components/VentaForm'
import VentasList from './components/VentasList'
import ResumenFinal from './components/ResumenFinal'
import { useJornada } from './lib/useJornada'
import { compartirOPescargarPDF, generarPDF, nombreArchivoPDF } from './lib/pdf'
import { linkWhatsAppImpresion } from './lib/whatsapp'
import { formatearMoneda } from './lib/format'

export default function App() {
  const { cargando, jornada, ventas, crearJornada, agregarVenta, eliminarVenta, finalizarJornada, nuevaJornada } =
    useJornada()
  const [finalizando, setFinalizando] = useState(false)
  const [resumen, setResumen] = useState(null) // { jornada, ventas, total }
  const [estadoEnvio, setEstadoEnvio] = useState('')

  const total = useMemo(() => ventas.reduce((acc, v) => acc + v.total, 0), [ventas])

  async function handleFinalizar() {
    if (ventas.length === 0) {
      alert('Agregá al menos una venta antes de finalizar.')
      return
    }
    if (!window.confirm(`¿Finalizar la jornada con un total de $${formatearMoneda(total)}? No vas a poder agregar más ventas.`)) {
      return
    }
    setFinalizando(true)
    try {
      const datosJornada = jornada
      const datosVentas = ventas
      await finalizarJornada(total)
      setResumen({ jornada: datosJornada, ventas: datosVentas, total })
      await generarYEnviarPDF(datosJornada, datosVentas)
    } finally {
      setFinalizando(false)
    }
  }

  async function generarYEnviarPDF(datosJornada, datosVentas) {
    const doc = generarPDF(datosJornada, datosVentas)
    const filename = nombreArchivoPDF(datosJornada)
    const resultado = await compartirOPescargarPDF(doc, filename)
    if (resultado === 'compartido') {
      setEstadoEnvio('PDF compartido correctamente.')
    } else if (resultado === 'descargado') {
      setEstadoEnvio('PDF descargado. Tocá el botón de abajo para enviarlo por WhatsApp.')
    } else {
      setEstadoEnvio('')
    }
  }

  function handleNuevaJornada() {
    setResumen(null)
    setEstadoEnvio('')
    nuevaJornada()
  }

  if (cargando) {
    return (
      <div className="pantalla-centrada">
        <p className="subtexto">Cargando…</p>
      </div>
    )
  }

  if (resumen) {
    return (
      <>
        <ResumenFinal
          jornada={resumen.jornada}
          ventas={resumen.ventas}
          total={resumen.total}
          estadoEnvio={estadoEnvio}
          onReenviar={() => generarYEnviarPDF(resumen.jornada, resumen.ventas)}
          onNuevaJornada={handleNuevaJornada}
        />
        <div className="pantalla-centrada" style={{ paddingTop: 0 }}>
          <a
            className="enlace-whatsapp"
            href={linkWhatsAppImpresion(nombreArchivoPDF(resumen.jornada))}
            target="_blank"
            rel="noreferrer"
          >
            Abrir WhatsApp para enviar a imprimir
          </a>
        </div>
      </>
    )
  }

  if (!jornada) {
    return <NuevaJornada onCrear={crearJornada} />
  }

  return (
    <div className="contenedor-app">
      <header className="encabezado">
        <div>
          <h1>{jornada.nombreReparto || 'Jornada de ventas'}</h1>
          <span className="subtexto">{jornada.fecha}</span>
        </div>
        <div className="total-barra">
          <span>Total</span>
          <strong>${formatearMoneda(total)}</strong>
        </div>
      </header>

      <main className="contenido">
        <VentaForm onAgregar={agregarVenta} />
        <section className="tarjeta">
          <h2>Ventas de hoy</h2>
          <VentasList ventas={ventas} onEliminar={eliminarVenta} />
        </section>
      </main>

      <footer className="pie">
        <button type="button" className="boton-finalizar" onClick={handleFinalizar} disabled={finalizando}>
          {finalizando ? 'Finalizando…' : 'Finalizar ventas'}
        </button>
      </footer>
    </div>
  )
}
