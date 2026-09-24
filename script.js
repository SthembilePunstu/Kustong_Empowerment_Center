// ===== MOBILE NAV TOGGLE =====

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


// ===== SCROLL TO TOP BUTTON =====

// Grab the round orange arrow button fixed at the bottom-right of the page
const scrollTopBtn = document.getElementById('scroll-top');

// Listen for clicks on that button
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ===== CONTACT FORM VALIDATION =====

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
