# Registro de Ventas

App web para registrar ventas por reparto. Cada celular carga sus ventas del
día (cliente, producto, cantidad y precio final acordado), ve el total en
vivo, y al terminar la jornada toca **Finalizar ventas** para generar un PDF
y enviarlo por WhatsApp a imprimir.

Las ventas se guardan en la nube (Firebase Firestore) apenas se cargan, así
que cerrar el navegador o el celular **no borra nada**.

## Configuración inicial (una sola vez)

### 1. Crear el proyecto de Firebase

1. Entrá a https://console.firebase.google.com y creá un proyecto nuevo (gratis, plan Spark).
2. En **Compilación > Firestore Database**, creá una base de datos (modo producción, la región más cercana).
3. En **Compilación > Authentication > Sign-in method**, habilitá el proveedor **Anónimo**.
4. En **Configuración del proyecto > Tus apps**, agregá una app web (ícono `</>`) y copiá el objeto `firebaseConfig`.
5. Pegá esos valores en [src/firebase.js](src/firebase.js), reemplazando los `TU_...`.
6. En **Firestore Database > Reglas**, pegá el contenido de [firestore.rules](firestore.rules) y publicá.

### 2. Cargar tus productos

Editá [src/config/productos.js](src/config/productos.js) con la lista real de productos.

### 3. Número de WhatsApp para imprimir

Editá [src/config/config.js](src/config/config.js) y poné el número (con código de país, sin `+`, sin espacios) en `NUMERO_IMPRESION`.

### 4. PIN del panel de administración

En el mismo archivo, cambiá `ADMIN_PIN` por un PIN propio (no dejes `1234`). Es
el que vas a compartir con quien vea el panel (ver más abajo). No es una
seguridad fuerte (cualquiera que mire el código fuente lo puede ver), pero
evita que alguien entre por accidente al link.

### 5. Publicar en GitHub Pages

1. En GitHub, andá a **Settings > Pages** y elegí como *Source* la opción **GitHub Actions**.
2. Hacé `git push` a `main`. El workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) compila y publica solo.
3. Tu link va a quedar en `https://juanchoa07-design.github.io/RegistroVentas/`. Compartilo con los repartidores (pueden agregarlo a la pantalla de inicio del celular como si fuera una app).

## Desarrollo local

```bash
npm install
npm run dev
```

## Cómo funciona

- Al abrir la app, se crea (o retoma) una **jornada** del día en Firestore.
- Cada venta que se agrega o elimina se guarda al instante en la base de datos.
- **Finalizar ventas** cierra la jornada, genera el PDF y lo comparte
  (usa el selector nativo de "Compartir" del celular si está disponible,
  para adjuntarlo directo a WhatsApp; si no, lo descarga y abre un enlace de
  WhatsApp para reenviarlo manualmente).
- Al iniciar una nueva jornada se empieza de cero, sin perder el historial
  anterior (queda guardado en Firestore, visible desde la consola de Firebase).

## Panel de administración

En `https://juanchoa07-design.github.io/RegistroVentas/?admin=1` hay un panel
que muestra, en vivo, todas las jornadas ya finalizadas de cualquier reparto
(fecha, nombre y total), con un botón para descargar o compartir el PDF de
cada una. Pide el PIN configurado en `ADMIN_PIN` la primera vez y después lo
recuerda en ese navegador.

Está pensado para no depender de que el PDF llegue por WhatsApp: los datos ya
están guardados apenas se cargan, así que quien tenga el link + PIN puede
entrar cuando quiera y ver todo, sin que nadie tenga que "enviar" nada.
