// Simple client-side pagination for homepage
(function(){
  document.addEventListener('DOMContentLoaded', function(){
  const posts = Array.from(document.querySelectorAll('.posts-grid .post-card'));
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const pageSize = 6;
    let current = pageSize;

    function showRange(count){
      let shown = 0;
      posts.forEach((p) => {
        if (p.classList.contains('filtered-out')) { p.style.display = 'none'; return; }
        if (shown < count) { p.style.display = ''; shown++; } else { p.style.display = 'none'; }
      });
      if (shown >= posts.filter(p => !p.classList.contains('filtered-out')).length) loadMoreBtn.style.display = 'none';
    }

    showRange(current);

    loadMoreBtn.addEventListener('click', function(){
      current += pageSize;
      showRange(current);
      // Persist count
      localStorage.setItem('homepage-count', current);
    });

    // Restore count
    const saved = Number(localStorage.getItem('homepage-count') || 0);
    if (saved && saved > pageSize) {
      current = saved;
      showRange(current);
    }
    // Expose API for filter script
    window.homePagination = { showRange, current };
  });
})();
