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

function initializeAboutSection() {
  const isHome = document.querySelector('.hero') && document.querySelector('#method');
  const aboutHref = isHome ? '#about' : '../#about';

  if (menu && !menu.querySelector('[data-about-link]')) {
    const link = document.createElement('a');
    link.href = aboutHref;
    link.dataset.aboutLink = 'true';
    link.innerHTML = '<i>05</i><span data-en="About Us" data-de="Über uns">About Us</span>';
    const callButton = menu.querySelector('a.btn');
    menu.insertBefore(link, callButton || languageToggle);
    link.addEventListener('click', closeMenu);
  }

  if (!isHome || document.getElementById('about')) return;

  const section = document.createElement('section');
  section.className = 'thesis';
  section.id = 'about';
  section.innerHTML = `
    <div class="wrap">
      <span class="cap" data-en="About BetterHealth" data-de="Über BetterHealth">About BetterHealth</span>
      <div>
        <p data-en="BetterHealth exists to make complex psychiatric and brain-health problems more understandable—and therefore more treatable." data-de="BetterHealth wurde gegründet, um komplexe psychiatrische und gehirnbezogene Beschwerden verständlicher und dadurch gezielter behandelbar zu machen.">BetterHealth exists to make complex psychiatric and brain-health problems more understandable—and therefore more treatable.</p>
        <p data-en="We are a physician-led medical practice in Aarau. Our work brings psychiatry, psychotherapy, applied neuroscience and relevant physiology into one clinical process. We begin with the person’s history and current difficulties, use measurement selectively, and take responsibility for turning complex findings into clear priorities and a proportionate treatment plan." data-de="Wir sind eine ärztlich geleitete medizinische Praxis in Aarau. Unsere Arbeit verbindet Psychiatrie, Psychotherapie, angewandte Neurowissenschaften und relevante Physiologie in einem klinischen Prozess. Ausgangspunkt sind die Geschichte des Menschen und seine aktuellen Beschwerden. Messungen setzen wir gezielt ein und übernehmen die Verantwortung dafür, komplexe Befunde in klare Prioritäten und einen angemessenen Behandlungsplan zu übersetzen.">We are a physician-led medical practice in Aarau. Our work brings psychiatry, psychotherapy, applied neuroscience and relevant physiology into one clinical process. We begin with the person’s history and current difficulties, use measurement selectively, and take responsibility for turning complex findings into clear priorities and a proportionate treatment plan.</p>
        <p data-en="Our aim is not to generate more data. It is to make better clinical decisions: what matters now, what can be changed, what should be monitored and what does not need further investigation." data-de="Unser Ziel ist nicht, mehr Daten zu erzeugen. Es geht um bessere klinische Entscheidungen: Was ist jetzt relevant, was lässt sich verändern, was sollte beobachtet werden und was muss nicht weiter untersucht werden?">Our aim is not to generate more data. It is to make better clinical decisions: what matters now, what can be changed, what should be monitored and what does not need further investigation.</p>
      </div>
    </div>`;

  const firstThesis = document.querySelector('section.thesis');
  if (firstThesis) firstThesis.insertAdjacentElement('afterend', section);

  const learnColumn = Array.from(document.querySelectorAll('.fcol')).find(column =>
    column.querySelector('h4')?.dataset.en === 'Learn'
  );
  if (learnColumn && !learnColumn.querySelector('[data-about-footer]')) {
    const footerLink = document.createElement('a');
    footerLink.href = '#about';
    footerLink.dataset.aboutFooter = 'true';
    footerLink.dataset.en = 'About Us';
    footerLink.dataset.de = 'Über uns';
    footerLink.textContent = 'About Us';
    learnColumn.querySelector('h4')?.insertAdjacentElement('afterend', footerLink);
  }
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

initializeAboutSection();
fixProgramsCalloutLayout();
updateLanguage();
initializeRevealObserver();
