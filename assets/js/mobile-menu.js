// Mobile menu functionality
console.log('Mobile menu script loading...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('Mobile menu script DOM loaded');
  
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const menu = document.getElementById('menu');
  
  console.log('Found hamburger:', hamburgerMenu);
  console.log('Found menu:', menu);
  
  if (!hamburgerMenu || !menu) {
    console.error('Menu elements not found!');
    return;
  }

  function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Toggle menu called');
    
    menu.classList.toggle('show');
    hamburgerMenu.classList.toggle('is-active');
    
    const isExpanded = menu.classList.contains('show');
    hamburgerMenu.setAttribute('aria-expanded', isExpanded);
    
    console.log('Menu is now:', isExpanded ? 'visible' : 'hidden');
  }

  // Add click handlers
  hamburgerMenu.addEventListener('click', toggleMenu);
  hamburgerMenu.addEventListener('touchend', toggleMenu);
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburgerMenu.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('show');
      hamburgerMenu.classList.remove('is-active');
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    }
  });
  
  console.log('Mobile menu initialized');
});
