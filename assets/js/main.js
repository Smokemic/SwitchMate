// main.js - Hauptfunktionen für Switchmate

// Copy-Funktion für Befehle
window.copyCommand = function(btn) {
    const code = btn.previousElementSibling.textContent;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        // Fallback für ältere Browser
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
};

// Zoom-Funktion für Bilder
window.zoomImage = function(imgElement) {
    imgElement.classList.toggle('zoomed');
    const btn = imgElement.nextElementSibling;
    if (btn && btn.classList.contains('zoom-btn')) {
        btn.textContent = imgElement.classList.contains('zoomed') ? '🔍 Zoom out' : '🔍 Zoom';
    }
};

// Hilfe/Panik-Button toggle
window.toggleHelp = function(helpId) {
    const helpElement = document.getElementById(helpId);
    if (helpElement) {
        helpElement.classList.toggle('hidden');
    }
};

// Step Completion
window.completeStep = function(step, nextUrl) {
    localStorage.setItem(step, 'true');
    if (nextUrl) {
        window.location.href = nextUrl;
    }
};

// Check if step is completed
window.isStepCompleted = function(step) {
    return localStorage.getItem(step) === 'true';
};

// Progress für Modul berechnen
window.getModuleProgress = function(moduleName, totalSteps) {
    let completed = 0;
    for (let i = 1; i <= totalSteps; i++) {
        if (localStorage.getItem(`${moduleName}-step${i}-complete`) === 'true') {
            completed++;
        }
    }
    return {
        completed: completed,
        total: totalSteps,
        percentage: (completed / totalSteps) * 100
    };
};

// Dark Mode Check (optional)
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// Smooth Scrolling für Ankerlinks
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu Toggle (falls benötigt)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.toggle('active');
    });
}

// Console Willkommensnachricht
console.log('%c🔥 Switchmate - Dein Weg zu Bazzite', 'font-size: 20px; color: #0066CC;');
console.log('Schritt für Schritt, Bild für Bild, ohne Fachchinesisch.');
