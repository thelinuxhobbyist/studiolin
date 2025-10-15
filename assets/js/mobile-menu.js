// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create the menu trigger button
  const nav = document.querySelector('.nav');
  const menuTrigger = document.createElement('button');
  menuTrigger.className = 'menu-trigger';
  menuTrigger.setAttribute('aria-label', 'Toggle menu');
  menuTrigger.innerHTML = '<span></span>';
  
  // Insert the button into the navigation
  const logo = nav.querySelector('.logo');
  logo.appendChild(menuTrigger);
  
  // Get the menu element
  const menu = document.getElementById('menu');
  
  // Toggle menu when clicking the trigger
  menuTrigger.addEventListener('click', function() {
    this.classList.toggle('is-active');
    menu.classList.toggle('show');
    
    // Set aria-expanded attribute for accessibility
    const expanded = menu.classList.contains('show');
    menuTrigger.setAttribute('aria-expanded', expanded);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !menuTrigger.contains(event.target) && menu.classList.contains('show')) {
      menu.classList.remove('show');
      menuTrigger.classList.remove('is-active');
      menuTrigger.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu when resizing to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && menu.classList.contains('show')) {
      menu.classList.remove('show');
      menuTrigger.classList.remove('is-active');
      menuTrigger.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Add swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    // Right swipe
    if (touchEndX > touchStartX + 100) {
      if (!menu.classList.contains('show')) {
        menu.classList.add('show');
        menuTrigger.classList.add('is-active');
        menuTrigger.setAttribute('aria-expanded', 'true');
      }
    }
    
    // Left swipe
    if (touchEndX < touchStartX - 100) {
      if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        menuTrigger.classList.remove('is-active');
        menuTrigger.setAttribute('aria-expanded', 'false');
      }
    }
  }
});
