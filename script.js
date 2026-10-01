// MOBILE NAV TOGGLE

// Grab the hamburger button (☰) that only shows up on small screens
const toggle = document.getElementById('menu-toggle');

// Grab the <ul> that holds all the nav links (Home, About Us, etc.)
const menu = document.getElementById('nav-menu');

// Listen for clicks on the hamburger button
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    // Add/remove the "open" class on the menu each time it's clicked.
    // When "open" is present, CSS shows the menu as a dropdown list (see styles.css).
    // When "open" is absent, the menu stays hidden (mobile default).
    menu.classList.toggle('open');
  });
}


//SCROLL TO TOP BUTTON 

// Grab the round orange arrow button fixed at the bottom-right of the page
const scrollTopBtn = document.getElementById('scroll-top');

// Listen for clicks on that button
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


//CONTACT FORM VALIDATION

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const fields = {
    name: contactForm.elements.name,
    email: contactForm.elements.email,
    phone: contactForm.elements.phone,
    subject: contactForm.elements.subject,
    message: contactForm.elements.message,
  };

  const getErrorMessage = (fieldName, value) => {
    const trimmedValue = value.trim();

    if (fieldName !== 'phone' && !trimmedValue) {
      const labels = {
        name: 'full name',
        email: 'email address',
        subject: 'subject',
        message: 'message',
      };
      return `Please enter your ${labels[fieldName]}.`;
    }

    if (fieldName === 'name' && trimmedValue.length < 2) {
      return 'Please enter at least 2 characters for your name.';
    }

    if (fieldName === 'email' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return 'Please enter a valid email address.';
    }

    if (fieldName === 'phone' && trimmedValue) {
      const digits = trimmedValue.replace(/\D/g, '');
      const hasValidCharacters = /^\+?[\d\s()-]+$/.test(trimmedValue);

      if (!hasValidCharacters || digits.length < 7 || digits.length > 15) {
        return 'Please enter a valid phone number.';
      }
    }

    if (fieldName === 'subject' && trimmedValue.length < 3) {
      return 'Please enter a subject of at least 3 characters.';
    }

    if (fieldName === 'message' && trimmedValue.length < 10) {
      return 'Please enter a message of at least 10 characters.';
    }

    return '';
  };

  const validateField = (fieldName) => {
    const field = fields[fieldName];
    const error = document.getElementById(`${fieldName}-error`);
    const message = getErrorMessage(fieldName, field.value);

    error.textContent = message;
    field.classList.toggle('input-error', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));

    return !message;
  };

  Object.keys(fields).forEach((fieldName) => {
    fields[fieldName].addEventListener('blur', () => validateField(fieldName));
    fields[fieldName].addEventListener('input', () => {
      if (fields[fieldName].classList.contains('input-error')) {
        validateField(fieldName);
      }
    });
  });

  contactForm.addEventListener('submit', (event) => {
    const fieldNames = Object.keys(fields);
    const validationResults = fieldNames.map((fieldName) =>
      validateField(fieldName),
    );
    const firstInvalidIndex = validationResults.indexOf(false);

    if (firstInvalidIndex !== -1) {
      event.preventDefault();
      fields[fieldNames[firstInvalidIndex]].focus();
    }
  });
}


//CAMPAIGNS & EVENTS PAGE

const eventsGrid = document.getElementById('events-grid');

if (eventsGrid) {
  const now = new Date();
  const cards = Array.from(eventsGrid.querySelectorAll('.event-card'));

  // Mark events whose end date has passed, so they show as "Past" automatically
  cards.forEach((card) => {
    const isPast = new Date(card.dataset.end) < now;
    card.classList.toggle('is-past', isPast);
    if (isPast) {
      const tag = document.createElement('span');
      tag.className = 'event-tag past';
      tag.textContent = 'Past';
      card.querySelector('.event-tag').after(tag);
      // Past events can't be registered for or added to a calendar
      card.querySelectorAll('[data-register], [data-calendar]').forEach((btn) => btn.remove());
    }
  });

  // Upcoming events first (soonest first), then past events (most recent first)
  cards
    .sort((a, b) => {
      const aPast = a.classList.contains('is-past');
      const bPast = b.classList.contains('is-past');
      if (aPast !== bPast) return aPast ? 1 : -1;
      const diff = new Date(a.dataset.start) - new Date(b.dataset.start);
      return aPast ? -diff : diff;
    })
    .forEach((card) => eventsGrid.appendChild(card));

  // FILTER BUTTONS
  const filterButtons = document.querySelectorAll('.filter-btn');
  const emptyMessage = document.getElementById('events-empty');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((b) => {
        b.classList.toggle('active', b === button);
        b.setAttribute('aria-selected', String(b === button));
      });

      let visibleCount = 0;
      cards.forEach((card) => {
        const isPast = card.classList.contains('is-past');
        const visible =
          filter === 'all' ||
          (filter === 'upcoming' && !isPast) ||
          (filter === 'past' && isPast) ||
          card.dataset.type === filter;
        card.hidden = !visible;
        if (visible) visibleCount++;
      });

      emptyMessage.hidden = visibleCount > 0;
    });
  });

  // ADD TO CALENDAR - downloads an .ics file that works with Google, Outlook and Apple calendars
  const toIcsDate = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  eventsGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-calendar]');
    if (!button) return;

    const card = button.closest('.event-card');
    const title = card.querySelector('h3').textContent;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Khutsong Empowerment Centre//Events//EN',
      'BEGIN:VEVENT',
      `UID:${toIcsDate(new Date(card.dataset.start))}-${title.replace(/\W+/g, '')}@khutsong`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(new Date(card.dataset.start))}`,
      `DTEND:${toIcsDate(new Date(card.dataset.end))}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${card.querySelector('p').textContent}`,
      `LOCATION:${card.querySelector('[data-location]').textContent}, Khutsong`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    link.download = `${title.replace(/[^\w]+/g, '-')}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

// FEATURED CAMPAIGN COUNTDOWN
const countdown = document.getElementById('countdown');

if (countdown) {
  const target = new Date(countdown.dataset.target);
  const units = {
    days: 86400000,
    hours: 3600000,
    minutes: 60000,
    seconds: 1000,
  };

  const updateCountdown = () => {
    let remaining = Math.max(0, target - new Date());
    Object.entries(units).forEach(([unit, ms]) => {
      countdown.querySelector(`[data-unit="${unit}"]`).textContent = Math.floor(remaining / ms);
      remaining %= ms;
    });
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// EVENT REGISTRATION MODAL
const registerModal = document.getElementById('register-modal');

if (registerModal) {
  const registerForm = document.getElementById('register-form');
  const registerStep = document.getElementById('register-step');
  const successStep = document.getElementById('register-success');
  const errorText = document.getElementById('register-error');
  let lastTrigger = null;

  const openModal = (eventName) => {
    document.getElementById('modal-title').textContent = 'Register';
    document.getElementById('modal-event').textContent = eventName;
    registerForm.reset();
    errorText.textContent = '';
    registerForm.querySelectorAll('input').forEach((input) => input.classList.remove('input-error'));
    registerStep.hidden = false;
    successStep.hidden = true;
    registerModal.hidden = false;
    document.body.style.overflow = 'hidden';
    registerForm.elements.name.focus();
  };

  const closeModal = () => {
    registerModal.hidden = true;
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-register]');
    if (trigger) {
      lastTrigger = trigger;
      const card = trigger.closest('.event-card');
      openModal(trigger.dataset.register || card.querySelector('h3').textContent);
      return;
    }
    if (event.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !registerModal.hidden) closeModal();
  });

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const { name, email, phone, guests } = registerForm.elements;
    const checks = [
      [name, name.value.trim().length >= 2, 'Please enter your full name.'],
      [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), 'Please enter a valid email address.'],
      [phone, !phone.value.trim() || /^\+?[\d\s()-]{7,20}$/.test(phone.value.trim()), 'Please enter a valid phone number.'],
      [guests, guests.value >= 1 && guests.value <= 20, 'Attendees must be between 1 and 20.'],
    ];

    checks.forEach(([input, valid]) => input.classList.toggle('input-error', !valid));
    const failed = checks.find(([, valid]) => !valid);

    if (failed) {
      errorText.textContent = failed[2];
      failed[0].focus();
      return;
    }

    document.getElementById('success-text').textContent =
      `Thank you, ${name.value.trim().split(' ')[0]}! Your spot for "${document.getElementById('modal-event').textContent}" is reserved. We'll email ${email.value.trim()} with more details closer to the date.`;
    registerStep.hidden = true;
    successStep.hidden = false;
  });
}
