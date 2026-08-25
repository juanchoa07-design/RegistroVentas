import { useState } from 'react'
import { CATEGORIAS_PRODUCTOS, PRODUCTOS } from '../config/productos'

const vacio = { cliente: '', producto: PRODUCTOS[0] || '', cantidad: 1, precioFinal: '' }

export default function VentaForm({ onAgregar }) {
  const [form, setForm] = useState(vacio)
  const [enviando, setEnviando] = useState(false)

  function actualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const cantidad = Number(form.cantidad)
    const precioFinal = Number(form.precioFinal)
    if (!form.cliente.trim() || !form.producto || !cantidad || precioFinal <= 0) return

    setEnviando(true)
    try {
      await onAgregar({
        cliente: form.cliente.trim(),
        producto: form.producto,
        cantidad,
        precioFinal,
      })
      setForm(vacio)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="tarjeta" onSubmit={handleSubmit}>
      <h2>Nueva venta</h2>
      <div className="fila-campos">
        <div className="campo">
          <label htmlFor="cliente">Cliente</label>
          <input
            id="cliente"
            type="text"
            placeholder="Nombre del cliente"
            value={form.cliente}
            onChange={(e) => actualizar('cliente', e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="producto">Producto</label>
          <select id="producto" value={form.producto} onChange={(e) => actualizar('producto', e.target.value)}>
            {CATEGORIAS_PRODUCTOS.map((cat) => (
              <optgroup key={cat.categoria} label={cat.categoria}>
                {cat.productos.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
      <div className="fila-campos">
        <div className="campo campo-chico">
          <label htmlFor="cantidad">Cantidad</label>
          <input
            id="cantidad"
            type="number"
            min="1"
            step="1"
            value={form.cantidad}
            onChange={(e) => actualizar('cantidad', e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="precioFinal">Precio final ($)</label>
          <input
            id="precioFinal"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.precioFinal}
            onChange={(e) => actualizar('precioFinal', e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className="boton-primario" disabled={enviando}>
        {enviando ? 'Agregando…' : '+ Agregar venta'}
      </button>
    </form>
  )
}
