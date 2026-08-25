import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

// Estos valores NO son secretos: identifican tu proyecto de Firebase y están
// protegidos por las reglas de seguridad de Firestore (ver firestore.rules).
// Reemplazalos por los datos de TU proyecto: Firebase Console > Configuración
// del proyecto > Tus apps > Configuración del SDK.
const firebaseConfig = {
  apiKey: 'AIzaSyDbCKmqrQILDlGi2JImw2GcQzFwGY-FVZI',
  authDomain: 'registroventas-a667e.firebaseapp.com',
  projectId: 'registroventas-a667e',
  storageBucket: 'registroventas-a667e.firebasestorage.app',
  messagingSenderId: '405555596880',
  appId: '1:405555596880:web:3f2aedd3f2474f29e6cb55',
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
