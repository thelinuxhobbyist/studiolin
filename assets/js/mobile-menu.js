// Mobile menu functionality
console.log('Mobile menu script loading...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('Mobile menu script DOM loaded');
  
  // Get menu elements
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const menu = document.getElementById('menu');
  
  console.log('Hamburger menu element:', hamburgerMenu);
  console.log('Menu element:', menu);
  
  if (!hamburgerMenu || !menu) {
    console.error('Required menu elements not found!');
    return;
  }

  // Add click handler to hamburger menu
  hamburgerMenu.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Hamburger menu clicked');
    
    // Toggle menu visibility
    menu.classList.toggle('show');
    hamburgerMenu.classList.toggle('is-active');
    
    // Update aria-expanded for accessibility
    const isExpanded = menu.classList.contains('show');
    hamburgerMenu.setAttribute('aria-expanded', isExpanded);
    
    console.log('Menu is now:', isExpanded ? 'visible' : 'hidden');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburgerMenu.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('show')) {
      menu.classList.remove('show');
      hamburgerMenu.classList.remove('is-active');
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu when window is resized to desktop size
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
  
  console.log('Mobile menu initialized successfully');
});