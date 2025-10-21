// Homepage filters: category tabs and tag cloud
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const tabs = document.querySelectorAll('.category-tabs .tab');
    const postsGrid = document.getElementById('homepagePosts');
    const posts = Array.from(document.querySelectorAll('.post-card'));
    const tagCloud = document.querySelector('.tag-cloud');

    // Collect tags
    const tagCounts = {};
    posts.forEach(post => {
      const tags = (post.dataset.tags || '').split(',').map(t=>t.trim()).filter(Boolean);
      tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
    });

    // Render tag cloud
    Object.keys(tagCounts).sort().forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'tag-btn';
      btn.textContent = tag;
      btn.dataset.tag = tag;
      tagCloud.appendChild(btn);
    });

    function filterPosts(category, tag) {
      posts.forEach(post => {
        const postCat = (post.dataset.category || '').toLowerCase();
        const postTags = (post.dataset.tags || '').toLowerCase();
        let show = true;
        if (category && category !== 'all') {
          show = postCat === category.toLowerCase();
        }
        if (show && tag) {
          show = postTags.split(',').map(t=>t.trim()).includes(tag.toLowerCase());
        }
        post.style.display = show ? '' : 'none';
      });
    }

    // Tab click
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const category = tab.dataset.cat;
        filterPosts(category, null);
      });
    });

    // Tag click
    tagCloud.addEventListener('click', e => {
      if (e.target && e.target.matches('.tag-btn')) {
        const tag = e.target.dataset.tag;
        // remove active from tabs
        tabs.forEach(t => t.classList.remove('active'));
        // show only posts matching tag
        filterPosts('all', tag);
      }
    });
  });
})();
