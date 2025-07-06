let gaInitialized = false;

// Detecta si hay GTM en la página
export function isGTMActive() {
  return !!(
    window.dataLayer &&
    window.dataLayer.push &&
    window.google_tag_manager
  );
}

// Empuja eventos al dataLayer
export function pushToDataLayer(eventObject) {
  if (
    typeof window.dataLayer !== "undefined" &&
    window.dataLayer instanceof Array
  ) {
    window.dataLayer.push(eventObject);
  }
}

// Inicializa GA4 solo si no hay GTM
export function initializeGoogleAnalytics(trackingId) {
  if (!trackingId || isGTMActive()) return;
  if (window.gtag) {
    window.gtag("config", trackingId);
    gaInitialized = true;
    return;
  }
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.head.appendChild(script);
  script.onload = () => {
    window.gtag("js", new Date());
    window.gtag("config", trackingId);
    gaInitialized = true;
  };
}

// Envía evento a GA4 si no hay GTM, si hay GTM solo pushToDataLayer
export function sendFlexibleEvent(eventName, params) {
  pushToDataLayer({ event: eventName, ...params });
  if (window.gtag && !isGTMActive()) {
    window.gtag("event", eventName, params);
  }
}

// Event names as constants to avoid typos
export const CHAT_EVENTS = {
  SESSION_STARTED: "chat_session_started",
  WIDGET_OPENED: "chat_widget_opened",
  WIDGET_CLOSED: "chat_widget_closed",
  MESSAGE_SENT_CLIENT: "chat_message_sent_client",
  LEAD_REGISTERED: "chat_lead_registered",
  SCHEDULED_APPOINTMENT: "chat_scheduled_appointment",
};
