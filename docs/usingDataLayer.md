# Guía de Uso de Eventos del Widget de Chat con Google Analytics 4

Este documento explica cómo implementar y utilizar los eventos que emite el widget de chat a través del dataLayer para su análisis en Google Analytics 4 (GA4).

## Eventos Disponibles

El widget emite los siguientes eventos al dataLayer:

1. `chat_session_started`
2. `chat_widget_opened`
3. `chat_widget_closed`
4. `chat_message_sent`

## Detalles de Cada Evento

### 1. chat_session_started
Se dispara cuando un usuario inicia una nueva sesión de chat por primera vez.

```javascript
{
    event: 'chat_session_started',
    chat_session_id: 'uuid-unico-de-sesion',
    chat_source: 'user_initiated'
}
```

### 2. chat_widget_opened
Se dispara cuando el usuario abre el widget de chat.

```javascript
{
    event: 'chat_widget_opened',
    chat_is_expanded: true
}
```

### 3. chat_widget_closed
Se dispara cuando el usuario cierra el widget de chat.

```javascript
{
    event: 'chat_widget_closed',
    chat_is_expanded: false
}
```

### 4. chat_message_sent
Se dispara cada vez que el usuario envía un mensaje.

```javascript
{
    event: 'chat_message_sent',
    chat_session_id: 'uuid-de-sesion-actual',
    chat_message_length: 123,
    chat_message_type: 'text'
}
```

## Implementación en Google Tag Manager (GTM)

### 1. Configuración de Activadores (Triggers)

Para cada evento, necesitas crear un activador personalizado en GTM:

1. Ve a "Triggers" > "New"
2. Selecciona "Custom Event"
3. En "Event name", ingresa el nombre del evento (ej: `chat_session_started`)
4. Guarda el activador

### 2. Configuración de Etiquetas (Tags)

Para cada evento, crea una etiqueta GA4:

1. Ve a "Tags" > "New"
2. Selecciona "Google Analytics: GA4 Event"
3. Configura tu ID de medición de GA4
4. En "Event Name", usa el mismo nombre del evento
5. En "Event Parameters", mapea los parámetros del evento:
   - Para `chat_session_started`:
     - `chat_session_id`
     - `chat_source`
   - Para `chat_widget_opened` y `chat_widget_closed`:
     - `chat_is_expanded`
   - Para `chat_message_sent`:
     - `chat_session_id`
     - `chat_message_length`
     - `chat_message_type`
6. Asocia el activador correspondiente
7. Guarda la etiqueta

## Consideraciones Importantes

1. **Verificación del dataLayer**
   - El widget verifica automáticamente si el dataLayer existe antes de emitir eventos
   - No es necesario inicializar el dataLayer manualmente si ya tienes GTM instalado

2. **Persistencia de Sesión**
   - El `chat_session_id` se mantiene consistente usando localStorage
   - Una nueva sesión solo se crea cuando el usuario no tiene un ID de sesión previo

3. **Eventos de Widget**
   - Los eventos `chat_widget_opened` y `chat_widget_closed` son mutuamente excluyentes
   - Se emiten en respuesta a la interacción directa del usuario

4. **Mensajes**
   - El evento `chat_message_sent` incluye la longitud del mensaje para análisis de engagement
   - Actualmente solo soporta mensajes de tipo 'text'

## Ejemplo de Implementación en GA4

### 1. Crear Eventos Personalizados

En GA4, ve a:
1. Configure > Events
2. "Create custom event"
3. Crea eventos para cada tipo de interacción

### 2. Configurar Conversiones

Para eventos importantes como `chat_session_started`:
1. Ve a Configure > Events
2. Marca el evento como "Mark as conversion"

### 3. Crear Informes Personalizados

Ejemplo de métricas útiles:
- Tasa de conversión de sesiones de chat
- Tiempo promedio entre apertura del widget y primer mensaje
- Longitud promedio de los mensajes
- Frecuencia de uso del chat por sesión

## Ejemplo de Código para Acceder a los Eventos

```javascript
// Verificar si un evento específico ocurrió
window.dataLayer.push(function() {
    return {
        event: 'gtm.load',
        callback: function() {
            // Acceder a los eventos del chat
            const chatEvents = window.dataLayer.filter(item => 
                item.event && item.event.startsWith('chat_')
            );
            console.log('Eventos de chat:', chatEvents);
        }
    };
});
```

## Solución de Problemas

1. **Eventos no aparecen en GA4**
   - Verifica que GTM esté correctamente instalado
   - Confirma que los activadores estén correctamente configurados
   - Usa el modo de vista previa de GTM para depurar

2. **Sesiones duplicadas**
   - Verifica que el `chat_session_id` se esté manteniendo consistente
   - Revisa la configuración de persistencia en localStorage

3. **Eventos faltantes**
   - Asegúrate de que el widget esté cargado completamente antes de la interacción
   - Verifica que no haya errores en la consola del navegador

## Mejores Prácticas

1. **Implementación**
   - Instala GTM antes de cargar el widget
   - Verifica la implementación en modo de vista previa
   - Prueba todos los eventos en un entorno de desarrollo

2. **Análisis**
   - Configura objetivos claros para cada evento
   - Crea segmentos de usuarios basados en el comportamiento del chat
   - Monitorea regularmente las métricas de engagement

3. **Mantenimiento**
   - Revisa periódicamente la configuración de GTM
   - Actualiza los eventos según sea necesario
   - Mantén un registro de cambios en la implementación 