// Mobile menu and theme toggle functionality
console.log('Mobile menu and theme script loading...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('Script DOM loaded');
  
  // Mobile menu functionality
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  
  console.log('Hamburger menu element:', hamburgerMenu);
  console.log('Menu element:', menu);
  
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  console.log('Theme toggle element:', themeToggle);
  
  if (!btn || !nav) {
    console.error('Mobile menu elements not found — aborting mobile menu setup.');
    return;
  }
  // Ensure the nav is closed when loading on desktop
  if (window.innerWidth > 768) {
    nav.classList.remove('active');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  }
  
  // Toggle the menu on button click
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.toggle('active');
    nav.classList.toggle('active');
    const expanded = btn.classList.contains('active');
    btn.setAttribute('aria-expanded', expanded);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!btn || !nav) return;
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnBtn = btn.contains(event.target);
    if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnBtn) {
      nav.classList.remove('active');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu when resizing to desktop
  window.addEventListener('resize', function() {
    if (!btn || !nav) return;
    if (window.innerWidth > 768 && nav.classList.contains('active')) {
      nav.classList.remove('active');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
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
