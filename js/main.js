if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker
    .register("../service-worker.js")
    .then(function (registration) {
      console.log("Service Worker registrado con éxito:", registration);
    })
    .catch(function (error) {
      console.error("Error al registrar el Service Worker:", error);
    });
}

Notification.requestPermission().then(function (permission) {
  if (permission === "granted") {
    subscribeToPushNotifications();
  }
});

function sendNotification(title, body) {
  navigator.serviceWorker.ready.then(function (registration) {
    registration.showNotification(title, {
      body: body,
      icon: "/images/android-chrome-512x512.png",
      badge: "/images/badge-128x128.png",
    });
  });
}

function subscribeToPushNotifications() {
  navigator.serviceWorker.ready.then(function (registration) {
    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BIWuK6InmsQ47o25F37l6ejXFUgKeQUa0DeXHVJWmhAacNftN4juHMJI9vmJbjKaE9G81OJaMi6PFFxzv7mY05s"
        ),
      })
      .then(function (subscription) {
        fetch("https://socket-io-4ed0.onrender.com/push/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });
      })
      .catch(function (error) {
        console.error("Error al suscribirse a notificaciones push:", error);
      });
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
