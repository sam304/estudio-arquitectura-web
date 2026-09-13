# Estudio de arquitectura — versión de prueba

Sitio multipágina en HTML, CSS y JavaScript nativo. Sin frameworks, paquetes, compilación ni servicios externos.

## Estado
Primera implementación. No publicada ni verificada en navegador. El entorno de ejecución local no estaba disponible al crearla.
Logo original pendiente de recuperar. Nombre, fotografías y credenciales pendientes de validación.
Formularios desactivados: no reciben datos ni simulan envíos. No hay PDFs publicados.
Esta versión NO constituye un MVP comercial terminado.

## Ejecución
Servir la raíz con cualquier servidor HTTP estático; abrir index.html mediante ese servidor. Revisar todas las rutas tanto directamente como desde la navegación.
La etiqueta base permite alojar el sitio en la raíz o en una subcarpeta.

## Organización
- index.html: inicio
- servicios/, proyectos/, regularizacion/, recursos/, nosotros/, contacto/, privacidad/: páginas
- assets/css/styles.css: estilos compartidos
- assets/js/main.js: menú accesible y bloqueo preventivo del formulario
- .htaccess: cabeceras para hosting Apache compatible
- robots.txt: bloqueo de rastreo en pruebas

## Edición
Editar textos en HTML. Cabecera y pie son HTML estático repetido para mantener navegación sin JavaScript: cualquier cambio global debe aplicarse a todas las páginas. Revisar consistencia antes de publicar.
No introducir paquetes o compilación sin revisar la decisión con el propietario.

## Publicación en Hostinger
Confirmar plan y directorio de destino. Desplegar los archivos del repositorio conservando .htaccess.
Verificar soporte de directivas y cabeceras: no asumir que el servidor las aplica.
Configurar HTTPS en hosting, comprobar redirección HTTP→HTTPS y luego evaluar HSTS.
Mantener dominio en Spaceship y preservar registros de correo.
La conexión Hostinger-GitHub requiere configuración propia; este repositorio no activa el despliegue automáticamente.
Para revisión privada, exigir autenticación en hosting. robots/noindex NO restringen acceso.

## Puertas de lanzamiento
1. Incorporar logo y contenido autorizado; retirar placeholders y aviso de prueba.
2. Implementar recepción segura y almacenamiento privado, validación del servidor, límites de solicitudes y protección contra abuso.
3. Incorporar PDFs verificados y entrega controlada tras registro; no poner documentos restringidos en carpeta pública.
4. Completar privacidad, conservación, responsables y opción promocional separada.
5. Adaptar CSP/connect-src/form-action únicamente a la integración elegida.
6. Configurar dominio final, canonical, Open Graph completo, sitemap y datos estructurados veraces.
7. Retirar noindex de HTML, X-Robots-Tag y bloqueo robots SOLO al publicar.
8. Añadir y configurar 404 según raíz/subcarpeta del hosting.
9. Revisar móvil/escritorio, teclado, contraste, enlaces, consola y rendimiento.
10. Probar rechazos del servidor, ausencia de exposición de leads, copias y restauración.

## Seguridad y credenciales
No hay secretos ni variables de entorno en esta versión estática.
No incorporar secretos en JavaScript. Configurar credenciales futuras solo en servidor o secretos del despliegue.
Activar 2FA y protecciones de rama en GitHub según capacidades de la cuenta; todavía no configuradas.
Las cabeceras incluidas son una base, no una auditoría ni certificación de seguridad.
