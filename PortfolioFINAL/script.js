document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');

  burger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll-spy nav ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');

  const setActive = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => spy.observe(section));

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.section .wrap > *, .ticket, .prose, .panel-panel, .contact-card, .contact-form'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- CV viewer / import ---------- */
  const cvObject = document.getElementById('cvObject');
  const cvInput = document.getElementById('cvInput');
  const cvDownload = document.getElementById('cvDownload');

  // Vérifie si cv.pdf existe réellement ; sinon on laisse le message de secours natif de <object>.
  fetch('cv.pdf', { method: 'HEAD' })
    .then(res => {
      if (!res.ok) throw new Error('cv.pdf introuvable');
    })
    .catch(() => {
      // pas de cv.pdf : le contenu de secours affiché dans <object> reste visible.
      cvDownload.setAttribute('aria-disabled', 'true');
      cvDownload.style.opacity = '0.5';
      cvDownload.style.pointerEvents = 'none';
    });

  cvInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Merci de choisir un fichier PDF.');
      return;
    }
    const url = URL.createObjectURL(file);
    cvObject.data = url;
    cvDownload.href = url;
    cvDownload.setAttribute('download', file.name || 'cv.pdf');
    cvDownload.style.opacity = '1';
    cvDownload.style.pointerEvents = 'auto';
    cvDownload.removeAttribute('aria-disabled');
  });

  /* ---------- Contact form -> mailto ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactEmailLink = document.getElementById('contactEmailLink');
  const contactEmail = contactEmailLink ? contactEmailLink.getAttribute('href').replace('mailto:', '') : '';

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const nom = data.get('nom') || '';
    const email = data.get('email') || '';
    const message = data.get('message') || '';

    const subject = encodeURIComponent(`Contact portfolio — ${nom}`);
    const body = encodeURIComponent(`${message}\n\n— ${nom} (${email})`);

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  });

});
