const config = {
  currentLanguage: localStorage.getItem('language') === 'de' ? 'de' : 'en'
};

const menu = document.getElementById('navMenu');
const menuToggle = document.querySelector('.menu-toggle');
const languageToggle = document.querySelector('.lang-toggle');
const consultationForm = document.getElementById('consultation-form');
const formStatus = document.getElementById('form-status');
let revealObserver;

function toggleMenu() {
  const isOpen = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
}

function closeMenu() {
  menu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

function toggleLanguage() {
  config.currentLanguage = config.currentLanguage === 'en' ? 'de' : 'en';
  localStorage.setItem('language', config.currentLanguage);
  updateLanguage();
}

function updateLanguage() {
  document.documentElement.lang = config.currentLanguage;
  document.querySelectorAll('[data-en][data-de]').forEach(element => {
    const value = element.getAttribute(`data-${config.currentLanguage}`);
    if (element.matches('input, textarea')) element.placeholder = value;
    else element.textContent = value;
  });
  languageToggle.setAttribute(
    'aria-label',
    config.currentLanguage === 'en' ? 'Switch website to German' : 'Website auf Englisch umstellen'
  );
}

function setFormStatus(message, state = '') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.dataset.state = state;
}

async function handleForm(event) {
  event.preventDefault();
  setFormStatus('');
  if (!consultationForm.reportValidity()) return;
  if (consultationForm.elements._gotcha.value) return;

  const endpoint = consultationForm.dataset.endpoint.trim();
  if (!endpoint) {
    setFormStatus(
      config.currentLanguage === 'en'
        ? 'Online delivery is not connected yet. Add the secure form endpoint described in the repository README before publishing the contact form.'
        : 'Die Online-Übermittlung ist noch nicht verbunden. Hinterlegen Sie vor der Veröffentlichung den im Repository-README beschriebenen sicheren Formular-Endpunkt.',
      'error'
    );
    return;
  }

  const submitButton = consultationForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  setFormStatus(config.currentLanguage === 'en' ? 'Sending…' : 'Wird gesendet…');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(consultationForm),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`Submission failed: ${response.status}`);
    consultationForm.reset();
    setFormStatus(
      config.currentLanguage === 'en' ? 'Thank you. Your request has been sent.' : 'Vielen Dank. Ihre Anfrage wurde gesendet.',
      'success'
    );
  } catch (error) {
    console.error(error);
    setFormStatus(
      config.currentLanguage === 'en'
        ? 'The request could not be sent. Please try again later or use the published practice contact details.'
        : 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder verwenden Sie die veröffentlichten Kontaktdaten der Praxis.',
      'error'
    );
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
  }
}

function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const willOpen = button.getAttribute('aria-expanded') !== 'true';
  document.querySelectorAll('.faq-item').forEach(otherItem => {
    otherItem.classList.remove('open');
    const otherButton = otherItem.querySelector('.faq-question');
    if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
  });
  if (willOpen) {
    item.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
  }
}

function initializeRevealObserver() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(element => element.classList.add('in'));
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(element => revealObserver.observe(element));
}

function fixProgramsCalloutLayout() {
  document.querySelectorAll('.contact h2[data-en]').forEach(heading => {
    if (!heading.dataset.en.startsWith('The first call clarifies whether BetterHealth can add value')) return;
    heading.style.maxWidth = 'none';
    heading.style.width = '100%';
    heading.style.writingMode = 'horizontal-tb';
    heading.style.wordBreak = 'normal';
    heading.style.overflowWrap = 'normal';
  });
}

document.addEventListener('click', event => {
  const faqButton = event.target.closest('.faq-question');
  if (faqButton) toggleFaq(faqButton);
});
menuToggle.addEventListener('click', toggleMenu);
languageToggle.addEventListener('click', toggleLanguage);
if (consultationForm) consultationForm.addEventListener('submit', handleForm);
window.addEventListener('resize', () => { if (window.innerWidth > 940) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

fixProgramsCalloutLayout();
updateLanguage();
initializeRevealObserver();
