import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

// Estos valores NO son secretos: identifican tu proyecto de Firebase y están
// protegidos por las reglas de seguridad de Firestore (ver firestore.rules).
// Reemplazalos por los datos de TU proyecto: Firebase Console > Configuración
// del proyecto > Tus apps > Configuración del SDK.
const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROYECTO',
  storageBucket: 'TU_PROYECTO.appspot.com',
  messagingSenderId: 'TU_SENDER_ID',
  appId: 'TU_APP_ID',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
const auth = getAuth(app)

// Autenticación anónima: no requiere que el repartidor inicie sesión, pero
// evita que cualquiera en internet pueda leer/escribir la base de datos.
let authReadyResolve
export const authReady = new Promise((resolve) => {
  authReadyResolve = resolve
})

onAuthStateChanged(auth, (user) => {
  if (user) {
    authReadyResolve(user)
  } else {
    signInAnonymously(auth).catch((err) => {
      console.error('Error de autenticación anónima:', err)
    })
  }
})
