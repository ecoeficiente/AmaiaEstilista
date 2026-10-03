# Amaia Estilista - Web Oficial

Sitio web corporativo y responsive para **Amaia Estilista**, peluquería en Trintxerpe, Pasaia (Gipuzkoa).

## Características principales

- **Diseño Responsive:** Adaptado para móviles, tablets y pantallas de escritorio.
- **Bilingüe (Castellano / Euskera):** 
  - Versión en castellano en la raíz (`/index.html`).
  - Versión en euskera en `/eu/index.html`.
  - Redirección canónica/alias en `/hasiera/index.html`.
- **Optimización SEO Local:** 
  - Marcado estructurado Schema.org (`HairSalon` / `LocalBusiness`) con datos de contacto, horarios y geolocalización.
  - Etiquetas Open Graph y Twitter Cards.
  - Archivos `sitemap.xml` y `robots.txt`.
- **Rendimiento y Accesibilidad:**
  - Código limpio en HTML5 semántico, CSS3 y JavaScript nativo sin dependencias pesadas.
  - Iconos SVG inline y tipografía optimizada con precargas (`preconnect`).

## Estructura del Proyecto

```text
├── index.html              # Página principal en castellano
├── eu/
│   └── index.html          # Página principal en euskera
├── hasiera/
│   └── index.html          # Redirección amigable euskera
├── assets/
│   ├── css/
│   │   └── style.css       # Hojas de estilo globales
│   ├── js/
│   │   └── main.js         # Lógica interactiva (menú, acordeones, etc.)
│   └── img/                # Logotipos e imágenes optimizadas
├── favicon.png             # Icono de favoritos
├── robots.txt              # Directivas para rastreadores
├── sitemap.xml             # Mapa del sitio XML
└── test_suite.py           # Suite de comprobaciones locales
```
