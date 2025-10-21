// Client-side view counter for posts
// Sends a POST to /.netlify/functions/views to increment and then can fetch top trending

(function(){
  function getPostKey() {
    // use pathname as key
    return window.location.pathname.replace(/\/$/, '');
  }

  async function pingView() {
    const key = getPostKey();
    if (!key) return;
    try {
      await fetch('/.netlify/functions/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
    } catch (e) {
      // gracefully ignore
      console.debug('view ping failed', e);
    }
  }

  // only ping on article pages (simple heuristic: body contains .post-single-container)
  document.addEventListener('DOMContentLoaded', function(){
    if (document.querySelector('.post-single-container')) {
      // debounce to avoid counting bounces
      setTimeout(pingView, 1500);
    }
  });
})();
