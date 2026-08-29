import { formatearMoneda } from '../lib/format'

export default function VentasList({ ventas, onEliminar }) {
  if (ventas.length === 0) {
    return <p className="subtexto centrado">Todavía no cargaste ninguna venta.</p>
  }

  function confirmarEliminar(v) {
    if (window.confirm(`¿Eliminar la venta de ${v.cliente} por $${formatearMoneda(v.total ?? 0)}? No se puede deshacer.`)) {
      onEliminar(v.id)
    }
  }

  return (
    <ul className="lista-ventas">
      {ventas.map((v) => (
        <li key={v.id} className="item-venta">
          <div className="item-venta-info">
            <strong>{v.cliente}</strong>
            <ul className="detalle-productos">
              {(v.items ?? []).map((it, idx) => (
                <li key={idx}>
                  {it.producto} · x{it.cantidad}
                  {it.precioUnitario != null ? ` · $${formatearMoneda(it.precioUnitario)} c/u` : ''}
                </li>
              ))}
            </ul>
          </div>
          <div className="item-venta-precio">
            <span>${formatearMoneda(v.total ?? 0)}</span>
            <button
              type="button"
              className="boton-eliminar"
              aria-label={`Eliminar venta de ${v.cliente}`}
              onClick={() => confirmarEliminar(v)}
            >
              🗑
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
