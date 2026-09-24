// ===== MOBILE NAV TOGGLE =====

// Grab the hamburger button (☰) that only shows up on small screens
const toggle = document.getElementById('menu-toggle');

// Grab the <ul> that holds all the nav links (Home, About Us, etc.)
const menu = document.getElementById('nav-menu');

// Listen for clicks on the hamburger button
toggle.addEventListener('click', () => {
  // Add/remove the "open" class on the menu each time it's clicked.
  // When "open" is present, CSS shows the menu as a dropdown list (see styles.css).
  // When "open" is absent, the menu stays hidden (mobile default).
  menu.classList.toggle('open');
});


// ===== SCROLL TO TOP BUTTON =====

// Grab the round orange arrow button fixed at the bottom-right of the page
const scrollTopBtn = document.getElementById('scroll-top');

// Listen for clicks on that button
scrollTopBtn.addEventListener('click', () => {
  // Scroll the whole page back to the very top (0px from the top)
  // behavior: 'smooth' animates the scroll instead of jumping instantly
  window.scrollTo({ top: 0, behavior: 'smooth' });
});