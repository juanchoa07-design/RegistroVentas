import { useState } from 'react'
import { CATEGORIAS_PRODUCTOS, obtenerPrecio } from '../config/productos'
import { formatearMoneda } from '../lib/format'

const itemVacio = { producto: '', cantidad: 1, precioManual: '' }

export default function VentaForm({ onAgregar }) {
  const [cliente, setCliente] = useState('')
  const [items, setItems] = useState([])
  const [itemDraft, setItemDraft] = useState(itemVacio)
  const [guardando, setGuardando] = useState(false)

  const precioDraft = obtenerPrecio(itemDraft.producto)
  const total = items.reduce((acc, it) => acc + it.precioUnitario * it.cantidad, 0)

  function actualizarItem(campo, valor) {
    setItemDraft((f) => ({ ...f, [campo]: valor }))
  }

  function handleAgregarItem(e) {
    e.preventDefault()
    const cantidad = Number(itemDraft.cantidad)
    if (!itemDraft.producto || !cantidad) return

    const precioUnitario = precioDraft ?? Number(itemDraft.precioManual)
    if (!precioUnitario || precioUnitario <= 0) return

    setItems((prev) => [
      ...prev,
      { producto: itemDraft.producto, cantidad, precioUnitario, key: crypto.randomUUID() },
    ])
    setItemDraft(itemVacio)
  }

  function quitarItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  async function handleGuardarVenta() {
    if (!cliente.trim() || items.length === 0 || total <= 0) return
    setGuardando(true)
    try {
      await onAgregar({
        cliente: cliente.trim(),
        items: items.map(({ producto, cantidad, precioUnitario }) => ({ producto, cantidad, precioUnitario })),
        total,
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
                {it.producto} · x{it.cantidad} · ${formatearMoneda(it.precioUnitario * it.cantidad)}
              </span>
              <button
                type="button"
                className="boton-eliminar"
                aria-label={`Quitar ${it.producto}`}
                onClick={() => quitarItem(it.key)}
              >
                🗑
              </button>
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
                    <option key={p.nombre} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
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
        </div>

        {itemDraft.producto && precioDraft == null && (
          <div className="campo">
            <label htmlFor="precioManual">Precio unitario ($) · sin precio de lista cargado</label>
            <input
              id="precioManual"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={itemDraft.precioManual}
              onChange={(e) => actualizarItem('precioManual', e.target.value)}
            />
          </div>
        )}

        <button type="submit" className="boton-secundario">
          + Agregar producto a la venta
        </button>
      </form>

      {items.length > 0 && (
        <div className="total-venta-borrador">
          <span>Total de la venta</span>
          <strong>${formatearMoneda(total)}</strong>
        </div>
      )}

      <button
        type="button"
        className="boton-primario"
        disabled={guardando || !cliente.trim() || items.length === 0 || total <= 0}
        onClick={handleGuardarVenta}
      >
        {guardando ? 'Guardando…' : 'Guardar venta'}
      </button>
    </div>
  )
}
