// ============================================================
// Abdia Elema — portfolio scripts
// ============================================================

// Current year in footer
document.getElementById('curr-year').textContent = new Date().getFullYear();

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// Contact form: submit via fetch so the visitor stays on the page
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  // Status message element, inserted after the submit button
  const status = document.createElement('p');
  status.className = 'form-status';
  contactForm.appendChild(status);

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = '';
    status.classList.remove('success', 'error');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        status.textContent = "Message sent. Thanks for reaching out, I'll get back to you soon.";
        status.classList.add('success');
        contactForm.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        status.textContent =
          data.errors?.map((e) => e.message).join(', ') ||
          'Something went wrong. Please try again or email me directly.';
        status.classList.add('error');
      }
    } catch (err) {
      status.textContent = 'Network error. Please try again or email me directly.';
      status.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
