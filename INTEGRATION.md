# Activación de consultas y Recursos

La actualización conserva el sitio estático, sin dependencias ni backend nuevo. Los formularios contextuales y las cuatro fichas de recursos están preparados, pero permanecen desactivados. No existen documentos aprobados ni un correo receptor confirmado. No se simulan envíos ni descargas.

## Activación posterior

1. Confirmar y crear el correo receptor en Hostinger. Elegir el servicio de backend y configurar sus credenciales exclusivamente en el servidor.
2. Implementar un endpoint POST del mismo origen. Validar datos, tamaño de entrada y listas permitidas de servicios/recursos; proteger contra abuso, aplicar límites y evitar registros con datos personales. Confirmar almacenamiento o recepción real antes de responder `ok: true`. Considerar deduplicación para reintentos tras un timeout.
3. Completar y revisar las páginas de privacidad en ambos idiomas: responsable, finalidades, proveedores, conservación y canal de solicitudes. El formulario de recursos no solicita evaluación ni suscripción promocional.
4. Cambiar `connect-src 'none'` por `connect-src 'self'` en `.htaccess` al desplegar el endpoint. Conservar las demás protecciones. `form-action 'none'` evita envíos HTML accidentales; el adaptador utiliza fetch. Probar las cabeceras en el hosting real.
5. En cada formulario autorizado, establecer `data-endpoint="api/consultas"` o la ruta relativa real desde la raíz del sitio definida por `<base>`. El navegador habilita únicamente endpoints del mismo origen. Sin JavaScript, los campos permanecen desactivados y las consultas disponen de teléfono/WhatsApp.
6. Para recursos, incorporar documentos revisados, título y descripción definitivos, contenido, audiencia y fecha real; sustituir el estado «Próximamente» y los textos pendientes en biblioteca y ficha. Solo entonces establecer `data-available="true"` y el endpoint. Si un recurso no necesita captación, puede ofrecerse mediante un enlace público explícito.
7. Los documentos sujetos a captación deben almacenarse fuera de la carpeta pública. El servidor entrega una URL temporal, autorizada y del mismo origen. La descarga debe verificar autorización/caducidad del lado servidor: ocultar un enlace en JavaScript no protege un archivo.
8. Probar el flujo completo en español e inglés: éxito, error, timeout, reintento, doble clic, validación, registro real y descarga autorizada. Los formularios generales de Contacto conservan su estado previo y requieren su propia integración.

## Contrato del adaptador del frontend

Solicitud JSON de servicio: `kind: "service"`, `language`, `service` (ruta del catálogo), `name`, `phone`, `message`, y `location` salvo Asesoría.

Solicitud JSON de recurso: `kind: "resource"`, `language`, `resource` (identificador de la ficha), `name`, `email`, `phone` opcional. No se solicitan documentos ni datos de evaluación profesional.

Respuesta confirmada de consulta: HTTP 2xx y `{"ok":true}`.

Respuesta confirmada de recurso: HTTP 2xx y `{"ok":true,"downloadUrl":"ruta-temporal-autorizada"}`. Solo esta respuesta revela el enlace; errores HTTP, JSON inválido, respuestas no confirmadas o URLs de otro origen mantienen la descarga oculta. El usuario realiza la descarga explícitamente.

Se conservan los campos durante errores/reintentos; no se persisten datos personales en almacenamiento del navegador. No hay analítica ni suscripciones añadidas. Los enlaces directos a teléfono y WhatsApp existentes permanecen disponibles; el formulario nunca envía datos por WhatsApp automáticamente.

## Rutas

- `servicios/`: índice de cinco servicios.
- `servicios/diseno-arquitectonico/`, `servicios/construccion/`, `servicios/tramitacion-permisos/`, `servicios/asesoria/`: páginas nuevas.
- `regularizacion/`: ruta existente preservada.
- `recursos/`: biblioteca de temas previstos.
- `recursos/permisos-construccion/`, `recursos/regularizar-construccion/`, `recursos/iniciar-proyecto/`, `recursos/normativas-referencias/`: fichas pendientes de documentos.
- Versiones inglesas equivalentes bajo `en/`.
