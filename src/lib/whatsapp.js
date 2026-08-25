import { NUMERO_IMPRESION } from '../config/config'

export function linkWhatsAppImpresion(filename) {
  const texto = encodeURIComponent(
    `Hola! Te envío el registro de ventas del día (${filename}) para imprimir. Adjunto el PDF que se descargó.`
  )
  return `https://wa.me/${NUMERO_IMPRESION}?text=${texto}`
}
