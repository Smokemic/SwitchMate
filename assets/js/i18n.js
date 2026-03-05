// i18n.js – Sprachumschalter und Textersetzung
let currentLanguage = 'en';

document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('switchmate-language');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'de') {
            setLanguage('de');
        } else {
            setLanguage('en');
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setLanguage(this.dataset.lang);
        });
    });
});

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('switchmate-language', lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    fetch(`assets/lang/${lang}.json`)
        .then(response => response.json())
        .then(translations => {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.dataset.i18n;
                const text = key.split('.').reduce((obj, i) => obj[i], translations);
                if (text) {
                    element.textContent = text;
                }
            });
        })
        .catch(error => console.error('Translation error:', error));
}
