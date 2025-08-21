# 📁 Instrucciones para Subir tu Proyecto Skyflow a Servidor FTP

## ✅ Paso 1: Compilación Completada
Tu proyecto ya ha sido compilado exitosamente. Los archivos de producción están en la carpeta `dist/`.

## 📂 Archivos a Subir
Debes subir **TODO EL CONTENIDO** de la carpeta `dist/` (no la carpeta dist en sí, sino su contenido):

```
dist/
├── index.html                    ← Archivo principal (OBLIGATORIO)
├── assets/                       ← Carpeta con CSS y JS compilados
│   ├── hero-studio-BxlINL1-.jpg
│   ├── index-BOt57onT.js        ← JavaScript compilado
│   └── index-DoTD91zb.css       ← CSS compilado
├── favicon.ico
├── logo.png
├── fotografia.png
├── produccion.png
├── video.png
├── collage.png
├── placeholder.svg
├── robots.txt
├── videos/                       ← Carpeta con videos
│   ├── Recap_fotos.mp4
│   ├── recap_marcas.mp4
│   └── recap_musical.mp4
└── Picsart_25-08-11_13-56-32-786.jpg
```

## 🚀 Proceso de Subida FTP

### Opción 1: FileZilla (Recomendado)
1. **Abre FileZilla**
2. **Conecta a tu servidor FTP:**
   - Host: `tu-servidor-ftp.com`
   - Usuario: `tu-usuario`
   - Contraseña: `tu-contraseña`
   - Puerto: `21` (o el que te hayan proporcionado)

3. **Navega a la carpeta web de tu servidor** (usualmente `public_html/`, `www/`, o `htdocs/`)

4. **Selecciona TODO el contenido de la carpeta `dist/`:**
   - Ve a la carpeta `C:\laragon\www\skyflow\dist\`
   - Selecciona TODOS los archivos y carpetas (Ctrl+A)
   - Arrastra y suelta al panel derecho de FileZilla

### Opción 2: Copiar y Pegar (Si tienes acceso directo)
Si tu servidor FTP está montado como una unidad de red:
1. Abre la carpeta `C:\laragon\www\skyflow\dist\`
2. Selecciona todo el contenido (Ctrl+A)
3. Copia (Ctrl+C)
4. Ve a la carpeta de tu servidor web
5. Pega (Ctrl+V)

## ⚠️ Puntos Importantes

### ✅ QUÉ SUBIR:
- **TODO el contenido de la carpeta `dist/`**
- Mantén la estructura de carpetas exactamente igual
- El archivo `index.html` debe estar en la raíz de tu dominio

### ❌ QUÉ NO SUBIR:
- **NO subas la carpeta `src/`** (código fuente)
- **NO subas `node_modules/`** (dependencias)
- **NO subas archivos de configuración** como `package.json`, `vite.config.ts`, etc.
- **NO subas la carpeta `dist/` en sí**, solo su contenido

## 🔧 Configuración del Servidor

### Archivo .htaccess (Para Apache)
Si tu servidor usa Apache, crea un archivo `.htaccess` en la raíz con este contenido:

```apache
RewriteEngine On
RewriteBase /

# Handle Angular and React Router
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## 🌐 Verificación
Después de subir los archivos:
1. Ve a tu dominio en el navegador
2. Verifica que la página carga correctamente
3. Prueba la navegación entre páginas
4. Verifica que las imágenes y videos se muestran

## 🔄 Actualizaciones Futuras
Cada vez que hagas cambios:
1. Ejecuta `npm run build` en tu proyecto local
2. Sube solo los archivos que cambiaron en `dist/`
3. O reemplaza todo el contenido si prefieres

## 📞 Soporte
Si tienes problemas:
- Verifica que el archivo `index.html` esté en la raíz
- Revisa que todas las carpetas `assets/` y `videos/` se subieron
- Comprueba los permisos de archivos (644 para archivos, 755 para carpetas)
- Verifica la configuración de tu servidor web

---
**¡Tu proyecto Skyflow está listo para producción! 🚀**