import { useState } from 'react'

export default function NuevaJornada({ onCrear }) {
  const [nombreReparto, setNombreReparto] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    try {
      await onCrear(nombreReparto.trim())
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="pantalla-centrada">
      <form className="tarjeta" onSubmit={handleSubmit}>
        <h1>Iniciar jornada</h1>
        <p className="subtexto">Se va a guardar cada venta automáticamente, aunque cierres esta app.</p>
        <label htmlFor="nombreReparto">Nombre del reparto (opcional)</label>
        <input
          id="nombreReparto"
          type="text"
          placeholder="Ej: Reparto Zona Norte"
          value={nombreReparto}
          onChange={(e) => setNombreReparto(e.target.value)}
          autoFocus
        />
        <button type="submit" className="boton-primario" disabled={enviando}>
          {enviando ? 'Iniciando…' : 'Comenzar a vender'}
        </button>
      </form>
    </div>
  )
}
