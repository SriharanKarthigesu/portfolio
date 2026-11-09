// Sriharan Karthigesu - Portfolio Interactive Script

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year in Footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. Navbar scroll effect
  const navbar = document.getElementById('navbar');
  const scrollProgressBar = document.getElementById('scroll-progress');

  function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar appearance
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Apple-style Scroll Progress Bar
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${progress}%`;
    }

    // Apple-style subtle parallax on hero elements
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    if (scrollY < 900) {
      if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
      if (heroVisual) heroVisual.style.transform = `translateY(${scrollY * 0.06}px)`;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // 4. Apple-Style Scroll Reveal System (Fade, Float, Blur, Stagger)
  const revealTargets = document.querySelectorAll(
    '.section-header, .about-card, .skill-category, .project-card, .timeline-item, .contact-info-card, .contact-form-card, .code-terminal-card'
  );

  // Group items by container to apply stagger delay classes
  const grids = document.querySelectorAll('.about-grid, .skills-wrapper, .projects-grid, .timeline');
  grids.forEach(grid => {
    const children = Array.from(grid.children);
    children.forEach((child, idx) => {
      const staggerClass = `stagger-${(idx % 6) + 1}`;
      child.classList.add('apple-reveal', staggerClass);
    });
  });

  revealTargets.forEach(el => {
    if (!el.classList.contains('apple-reveal')) {
      el.classList.add('apple-reveal');
    }
  });

  // IntersectionObserver for fluid viewport entrance
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Reveal once smoothly
      }
    });
  }, observerOptions);

  document.querySelectorAll('.apple-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // 5. Apple-style 3D Tilt Card Interaction
  const tiltElements = document.querySelectorAll('.project-card, .about-card, .code-terminal-card');
  tiltElements.forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate percentage inside element
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${xPercent}%`);
      card.style.setProperty('--mouse-y', `${yPercent}%`);

      // Calculate subtle tilt angle (-6 to +6 deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
    });
  });

  // 4. Scroll Spy - Highlight active section in navigation
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // 5. Project Filter Tabs
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Copy Email to Clipboard Feature
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-address');
  const copyBtnText = document.getElementById('copy-btn-text');

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        copyBtnText.textContent = 'Copied! ✓';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = '#fff';
        copyBtn.style.borderColor = '#10b981';

        setTimeout(() => {
          copyBtnText.textContent = 'Copy';
          copyBtn.style.background = '';
          copyBtn.style.color = '';
          copyBtn.style.borderColor = '';
        }, 2200);
      }).catch(err => {
        console.error('Failed to copy email: ', err);
      });
    });
  }

  // 6b. Copy Phone to Clipboard Feature
  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  const phoneText = document.getElementById('phone-number');
  const copyPhoneText = document.getElementById('copy-phone-text');

  if (copyPhoneBtn && phoneText) {
    copyPhoneBtn.addEventListener('click', () => {
      const phone = phoneText.textContent.trim();
      navigator.clipboard.writeText(phone).then(() => {
        copyPhoneText.textContent = 'Copied! ✓';
        copyPhoneBtn.style.background = '#10b981';
        copyPhoneBtn.style.color = '#fff';
        copyPhoneBtn.style.borderColor = '#10b981';

        setTimeout(() => {
          copyPhoneText.textContent = 'Copy';
          copyPhoneBtn.style.background = '';
          copyPhoneBtn.style.color = '';
          copyPhoneBtn.style.borderColor = '';
        }, 2200);
      }).catch(err => {
        console.error('Failed to copy phone: ', err);
      });
    });
  }
});

// 7. Contact Form Handler
function handleFormSubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const feedback = document.getElementById('form-feedback');

  if (!nameInput.value || !emailInput.value || !messageInput.value) {
    feedback.textContent = 'Please fill out all fields.';
    feedback.style.color = '#ef4444';
    return;
  }

  // Pre-fill mailto link and trigger
  const subject = encodeURIComponent(`Portfolio Inquiry from ${nameInput.value}`);
  const body = encodeURIComponent(`Name: ${nameInput.value}\nEmail: ${emailInput.value}\n\nMessage:\n${messageInput.value}`);
  const recipient = 'karthi.sriharan@gmail.com';

  feedback.textContent = 'Thank you! Opening your email client to send message...';
  feedback.className = 'form-notice success';

  // Open default mail client
  setTimeout(() => {
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  }, 400);

  // Reset form
  setTimeout(() => {
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';
  }, 1000);
}
