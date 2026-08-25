import { formatearMoneda } from '../lib/format'

export default function VentasList({ ventas, onEliminar }) {
  if (ventas.length === 0) {
    return <p className="subtexto centrado">Todavía no cargaste ninguna venta.</p>
  }

  return (
    <ul className="lista-ventas">
      {ventas.map((v) => (
        <li key={v.id} className="item-venta">
          <div className="item-venta-info">
            <strong>{v.cliente}</strong>
            <ul className="detalle-productos">
              {v.items.map((it, idx) => (
                <li key={idx}>
                  {it.producto} · x{it.cantidad} — ${formatearMoneda(it.precioFinal)}
                </li>
              ))}
            </ul>
          </div>
          <div className="item-venta-precio">
            <span>${formatearMoneda(v.total)}</span>
            <button
              type="button"
              className="boton-eliminar"
              aria-label={`Eliminar venta de ${v.cliente}`}
              onClick={() => onEliminar(v.id)}
            >
              🗑
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
