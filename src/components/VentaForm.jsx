import { useState } from 'react'
import { CATEGORIAS_PRODUCTOS } from '../config/productos'
import { formatearMoneda } from '../lib/format'

const itemVacio = { producto: '', cantidad: 1, precioFinal: '' }

export default function VentaForm({ onAgregar }) {
  const [cliente, setCliente] = useState('')
  const [items, setItems] = useState([])
  const [itemDraft, setItemDraft] = useState(itemVacio)
  const [guardando, setGuardando] = useState(false)

  const totalVenta = items.reduce((acc, i) => acc + i.precioFinal, 0)

  function actualizarItem(campo, valor) {
    setItemDraft((f) => ({ ...f, [campo]: valor }))
  }

  function handleAgregarItem(e) {
    e.preventDefault()
    const cantidad = Number(itemDraft.cantidad)
    const precioFinal = Number(itemDraft.precioFinal)
    if (!itemDraft.producto || !cantidad || precioFinal <= 0) return

    setItems((prev) => [...prev, { ...itemDraft, cantidad, precioFinal, key: crypto.randomUUID() }])
    setItemDraft(itemVacio)
  }

  function quitarItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  async function handleGuardarVenta() {
    if (!cliente.trim() || items.length === 0) return
    setGuardando(true)
    try {
      await onAgregar({
        cliente: cliente.trim(),
        items: items.map(({ producto, cantidad, precioFinal }) => ({ producto, cantidad, precioFinal })),
        total: totalVenta,
      })
      setCliente('')
      setItems([])
      setItemDraft(itemVacio)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="tarjeta">
      <h2>Nueva venta</h2>
      <div className="campo">
        <label htmlFor="cliente">Cliente</label>
        <input
          id="cliente"
          type="text"
          placeholder="Nombre del cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>

      {items.length > 0 && (
        <ul className="lista-items-borrador">
          {items.map((it) => (
            <li key={it.key}>
              <span>
                {it.producto} · x{it.cantidad}
              </span>
              <span className="lista-items-borrador-precio">
                ${formatearMoneda(it.precioFinal)}
                <button
                  type="button"
                  className="boton-eliminar"
                  aria-label={`Quitar ${it.producto}`}
                  onClick={() => quitarItem(it.key)}
                >
                  🗑
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAgregarItem}>
        <div className="fila-campos">
          <div className="campo">
            <label htmlFor="producto">Producto</label>
            <select
              id="producto"
              value={itemDraft.producto}
              onChange={(e) => actualizarItem('producto', e.target.value)}
            >
              <option value="" disabled>
                Elegir producto…
              </option>
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
              value={itemDraft.cantidad}
              onChange={(e) => actualizarItem('cantidad', e.target.value)}
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
              value={itemDraft.precioFinal}
              onChange={(e) => actualizarItem('precioFinal', e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="boton-secundario">
          + Agregar producto a la venta
        </button>
      </form>

      {items.length > 0 && (
        <p className="subtotal-borrador">
          Total de esta venta: <strong>${formatearMoneda(totalVenta)}</strong>
        </p>
      )}

      <button
        type="button"
        className="boton-primario"
        disabled={guardando || !cliente.trim() || items.length === 0}
        onClick={handleGuardarVenta}
      >
        {guardando ? 'Guardando…' : 'Guardar venta'}
      </button>
    </div>
  )
}
