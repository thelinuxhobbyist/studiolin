// Simple and direct mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Mobile menu script loaded');
  
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const menu = document.getElementById('menu');
  
  console.log('Hamburger menu element:', hamburgerMenu);
  console.log('Menu element:', menu);
  
  if (!hamburgerMenu || !menu) {
    console.error('Mobile menu elements not found');
    return;
  }
  
  // Toggle menu when clicking the hamburger button
  hamburgerMenu.addEventListener('click', function(e) {
    console.log('Hamburger clicked');
    e.preventDefault();
    this.classList.toggle('is-active');
    menu.classList.toggle('show');
    
    // Set aria-expanded attribute for accessibility
    const expanded = menu.classList.contains('show');
    this.setAttribute('aria-expanded', expanded);
    console.log('Menu visible:', expanded);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && 
        !hamburgerMenu.contains(event.target) && 
        menu.classList.contains('show')) {
      menu.classList.remove('show');
      hamburgerMenu.classList.remove('is-active');
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu when resizing to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && menu.classList.contains('show')) {
      menu.classList.remove('show');
      hamburgerMenu.classList.remove('is-active');
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Add swipe gestures for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    // Right swipe to open menu
    if (touchEndX > touchStartX + 100) {
      if (!menu.classList.contains('show')) {
        menu.classList.add('show');
        hamburgerMenu.classList.add('is-active');
        hamburgerMenu.setAttribute('aria-expanded', 'true');
      }
    }
    
    // Left swipe to close menu
    if (touchEndX < touchStartX - 100) {
      if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        hamburgerMenu.classList.remove('is-active');
        hamburgerMenu.setAttribute('aria-expanded', 'false');
      }
    }
  }
  
  // Add active class to current page in menu
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll('#menu a');
  menuLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});
