// pwa.js - Service Worker Registrierung

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Prompt für Installation (optional)
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  // Verhindere, dass das Mini-Infobar automatisch angezeigt wird
  e.preventDefault();
  // Speichere das Event für später
  deferredPrompt = e;
  // Zeige Install-Button (falls vorhanden)
  if (installButton) {
    installButton.style.display = 'block';
  }
});

if (installButton) {
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
      return;
    }
    // Zeige Installations-Prompt
    deferredPrompt.prompt();
    // Warte auf Benutzerentscheidung
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // Reset
    deferredPrompt = null;
    installButton.style.display = 'none';
  });
}

// Prüfen ob App installiert ist
window.addEventListener('appinstalled', (evt) => {
  console.log('Switchmate wurde installiert');
  // Google Analytics o.ä. könnte hier rein
});
