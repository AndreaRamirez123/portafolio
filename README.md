# Portafolio — Andrea Paola Ramírez Torres

Sitio estático de una sola página. Sin build tools ni dependencias.

## Estructura

```
Portafolio/
├── index.html     # punto de entrada
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── img/       # foto de perfil (foto-andrea.jpg)
│   └── cv/        # hoja de vida en PDF
└── README.md
```

## Ver en local

Abrir `index.html` directamente en el navegador funciona, pero para que
`IntersectionObserver` y las animaciones se comporten igual que en producción
es mejor servirlo con un servidor local:

```bash
# con Python
python -m http.server 8080

# o con Node
npx serve .
```

Luego abrir `http://localhost:8080`.

## Desplegar

Al ser HTML/CSS/JS puro, se puede subir la carpeta tal cual a cualquier
hosting estático (Firebase Hosting, GitHub Pages, Netlify, Vercel, etc.)
apuntando `index.html` como raíz del sitio.

### GitHub Pages (automático)

El repo ya trae `.github/workflows/deploy-pages.yml`: cada vez que subas
cambios a la rama `main`, GitHub construye y publica el sitio solo.

Pasos únicos (la primera vez):

1. Crea un repositorio vacío en GitHub (sin README, sin .gitignore —
   ya los tenemos aquí). Por ejemplo `AndreaRamirez123/portafolio`.
2. Conéctalo y sube el código:
   ```bash
   git remote add origin https://github.com/AndreaRamirez123/portafolio.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source** y
   selecciona **GitHub Actions** (no "Deploy from a branch"). El workflow
   ya subido se encarga del resto en cuanto detecte el push.
4. Revisa la pestaña **Actions** del repo: cuando el workflow termine en
   verde, la URL del sitio queda en **Settings → Pages**
   (algo como `https://andrearamirez123.github.io/portafolio/`).

De ahí en adelante, cada `git push` a `main` vuelve a desplegar solo.

## Formulario de contacto (Web3Forms)

El formulario de la sección "Contacto" envía el mensaje directo al correo
`andrearamirezt1992@gmail.com` usando [Web3Forms](https://web3forms.com/)
(gratis, sin backend propio).

1. Entra a https://web3forms.com/, pon tu correo en "Create Access Key
   using Email" y confírmalo. En segundos te llega la access key.
2. Abre `index.html`, busca `REEMPLAZA_CON_TU_ACCESS_KEY` (dentro del
   `<form id="apr-contact-form">`) y pégala ahí.
3. Vuelve a subir el archivo si ya está desplegado.

Mientras no se reemplace la clave, el formulario avisa en pantalla que
falta configurarla en lugar de fallar en silencio.

## Foto de perfil

La sección "Inicio" tiene un marco de foto (donde antes estaba el panel
"SYSTEM STATUS"). Mientras no exista el archivo, se ve un recuadro punteado
indicando dónde colocarla.

1. Guarda tu foto como `assets/img/foto-andrea.jpg` (cuadrada o casi
   cuadrada, ideal 800×800px o más, ideal peso liviano — JPG/WebP
   comprimido para que cargue rápido).
2. Recarga la página: el marco la recorta automáticamente para llenar el
   espacio (`object-fit: cover`), sin deformarla.

Si prefieres otro nombre o formato de archivo, cambia el `src` del `<img>`
dentro de `.apr-photo-frame` en `index.html`.

## Hoja de vida (CV)

En "Inicio", junto a los botones "Contactar" y "Ver proyectos", hay un
botón **"Descargar CV"**. Mientras no exista el archivo, el botón se ve
atenuado y no hace nada al hacer clic (evita un enlace roto).

1. Guarda tu hoja de vida como
   `assets/cv/hoja-de-vida-andrea-ramirez.pdf`.
2. Recarga la página: el botón se activa solo (lo detecta automáticamente
   al cargar) y al hacer clic descarga el PDF.

Si prefieres otro nombre de archivo, cambia el `href` del botón
`#apr-cv-btn` en `index.html`.
