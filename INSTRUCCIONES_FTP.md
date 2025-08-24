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

## 🔧 Configuración del Servidor (.htaccess)

**IMPORTANTE**: Para resolver las advertencias de seguridad de Chrome, usa esta configuración mejorada.

Crea un archivo `.htaccess` en la raíz de tu dominio con el siguiente contenido:

```apache
# Configuración de seguridad para Skyflow Studios
RewriteEngine On
RewriteBase /

# Forzar HTTPS (CRÍTICO para evitar advertencias de seguridad)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Configuración para aplicaciones SPA
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Headers de seguridad estrictos
<IfModule mod_headers.c>
    # Forzar HTTPS por 1 año
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Prevenir ataques XSS
    Header always set X-XSS-Protection "1; mode=block"
    
    # Prevenir MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Prevenir clickjacking
    Header always set X-Frame-Options "DENY"
    
    # Política de referrer
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Content Security Policy (CSP)
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self';"
    
    # Remover headers que revelan información del servidor
    Header unset Server
    Header unset X-Powered-By
</IfModule>

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
    ExpiresByType video/mp4 "access plus 1 year"
</IfModule>

# Bloquear acceso a archivos sensibles
<FilesMatch "\.(htaccess|htpasswd|ini|log|sh|inc|bak|env)$">
    Require all denied
</FilesMatch>
```

## 🛡️ Solución a Advertencias de Seguridad de Chrome

Si Chrome muestra "Sitio peligroso" o advertencias de seguridad:

### Causas Comunes:
1. **SSL no configurado correctamente** - Verifica que tu certificado SSL esté activo
2. **Contenido mixto HTTP/HTTPS** - El archivo .htaccess incluido fuerza HTTPS
3. **Headers de seguridad faltantes** - La configuración incluye todos los headers necesarios
4. **Configuración de servidor** - Asegúrate de que tu hosting soporte .htaccess

### Pasos para Resolver:
1. **Verifica SSL en SiteGround**:
   - Ve a cPanel → SSL/TLS
   - Asegúrate de que "Force HTTPS Redirect" esté activado
   - Verifica que el certificado Let's Encrypt esté instalado y válido

2. **Sube el archivo .htaccess**:
   - El archivo ya está incluido en la carpeta `dist/`
   - Asegúrate de que se suba a la raíz de tu dominio
   - Verifica que los permisos sean 644

3. **Limpia caché**:
   - Limpia el caché de tu navegador
   - Si usas Cloudflare, purga el caché
   - En SiteGround, limpia el caché del servidor

4. **Verifica configuración**:
   - Usa herramientas como SSL Labs (ssllabs.com/ssltest/)
   - Verifica headers de seguridad en securityheaders.com

### Si el problema persiste:
- Contacta al soporte de SiteGround
- Verifica que no haya archivos maliciosos en tu servidor
- Considera usar Cloudflare para seguridad adicional

## 🌐 Verificación
Después de subir los archivos:
1. Ve a tu dominio en el navegador (usa HTTPS)
2. Verifica que la página carga correctamente sin advertencias
3. Prueba la navegación entre páginas
4. Verifica que las imágenes y videos se muestran
5. Comprueba que no hay errores de consola en DevTools

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