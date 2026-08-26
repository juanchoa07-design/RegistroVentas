import { useEffect, useState } from 'react'
import './App.css'

export default function Splash({ children }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return children

  return (
    <div className="splash">
      <img src="logo.jpg" alt="Doña Sol" className="splash-logo" />
    </div>
  )
}
