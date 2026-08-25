import { useState } from 'react'
import { CATEGORIAS_PRODUCTOS } from '../config/productos'

const itemVacio = { producto: '', cantidad: 1 }

export default function VentaForm({ onAgregar }) {
  const [cliente, setCliente] = useState('')
  const [items, setItems] = useState([])
  const [itemDraft, setItemDraft] = useState(itemVacio)
  const [precioVenta, setPrecioVenta] = useState('')
  const [guardando, setGuardando] = useState(false)

  function actualizarItem(campo, valor) {
    setItemDraft((f) => ({ ...f, [campo]: valor }))
  }

  function handleAgregarItem(e) {
    e.preventDefault()
    const cantidad = Number(itemDraft.cantidad)
    if (!itemDraft.producto || !cantidad) return

    setItems((prev) => [...prev, { producto: itemDraft.producto, cantidad, key: crypto.randomUUID() }])
    setItemDraft(itemVacio)
  }

  function quitarItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  async function handleGuardarVenta() {
    const total = Number(precioVenta)
    if (!cliente.trim() || items.length === 0 || !total || total <= 0) return
    setGuardando(true)
    try {
      await onAgregar({
        cliente: cliente.trim(),
        items: items.map(({ producto, cantidad }) => ({ producto, cantidad })),
        total,
      })
      setCliente('')
      setItems([])
      setItemDraft(itemVacio)
      setPrecioVenta('')
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
                    <option key={p} value={p}>
                      {p}
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
        <button type="submit" className="boton-secundario">
          + Agregar producto a la venta
        </button>
      </form>

      {items.length > 0 && (
        <div className="campo">
          <label htmlFor="precioVenta">Precio final de la venta ($)</label>
          <input
            id="precioVenta"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
          />
        </div>
      )}

      <button
        type="button"
        className="boton-primario"
        disabled={guardando || !cliente.trim() || items.length === 0 || !Number(precioVenta)}
        onClick={handleGuardarVenta}
      >
        {guardando ? 'Guardando…' : 'Guardar venta'}
      </button>
    </div>
  )
}
