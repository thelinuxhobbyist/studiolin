// Mobile menu and theme toggle functionality
console.log('Mobile menu and theme script loading...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('Script DOM loaded');
  
  // Mobile menu functionality
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const menu = document.getElementById('menu');
  
  console.log('Hamburger menu element:', hamburgerMenu);
  console.log('Menu element:', menu);
  
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  console.log('Theme toggle element:', themeToggle);
  
  if (!hamburgerMenu || !menu) {
    console.error('Mobile menu elements not found! Attempting alternative selector...');
    
    // Try alternative selectors
    const alternativeMenu = document.querySelector('.menu');
    const alternativeHamburger = document.querySelector('[aria-label="Toggle menu"]');
    
    console.log('Alternative hamburger:', alternativeHamburger);
    console.log('Alternative menu:', alternativeMenu);
    
    if (!alternativeHamburger && !alternativeMenu) {
      console.error('No menu elements found at all!');
      return;
    }
  }
  
  // Force add click handler to all possible menu buttons
  document.addEventListener('click', function(e) {
    if (e.target && (e.target.classList.contains('hamburger-menu') || 
                     e.target.closest('.hamburger-menu') || 
                     e.target.getAttribute('aria-label') === 'Toggle menu')) {
      console.log('Hamburger clicked via global handler');
      e.preventDefault();
      
      const clickedHamburger = e.target.classList.contains('hamburger-menu') ? 
                               e.target : 
                               e.target.closest('.hamburger-menu') || e.target;
      
      clickedHamburger.classList.toggle('is-active');
      menu.classList.toggle('show');
      
      // Set aria-expanded attribute for accessibility
      const expanded = menu.classList.contains('show');
      clickedHamburger.setAttribute('aria-expanded', expanded);
      console.log('Menu visible:', expanded);
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!hamburgerMenu || !menu) return;
    
    const isClickInsideMenu = menu.contains(event.target);
    const isClickOnHamburger = hamburgerMenu.contains(event.target);
    
    if (menu.classList.contains('show') && !isClickInsideMenu && !isClickOnHamburger) {
      menu.classList.remove('show');
      hamburgerMenu.classList.remove('is-active');
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu when resizing to desktop
  window.addEventListener('resize', function() {
    if (!hamburgerMenu || !menu) return;
    
    if (window.innerWidth > 768 && menu.classList.contains('show')) {
      menu.classList.remove('show');
      hamburgerMenu.classList.remove('is-active');
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Fix theme toggle functionality
  if (themeToggle) {
    console.log('Setting up theme toggle event listener');
    themeToggle.addEventListener('click', function() {
      console.log('Theme toggle clicked');
      document.body.classList.toggle('dark');
      
      const isDark = document.body.classList.contains('dark');
      console.log('Dark mode:', isDark);
      
      localStorage.setItem('pref-theme', isDark ? 'dark' : 'light');
    });
  }
});
