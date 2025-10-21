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

    // Render tag cloud with size classes based on frequency
    const tagsSorted = Object.keys(tagCounts).sort();
    const counts = tagsSorted.map(t => tagCounts[t]);
    const maxCount = Math.max(...counts, 1);
    tagsSorted.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'tag-btn';
      // map count to 1..5
      const size = Math.max(1, Math.round((tagCounts[tag] / maxCount) * 4) + 1);
      btn.classList.add(`tag-size-${size}`);
      btn.textContent = tag;
      btn.dataset.tag = tag;
      btn.setAttribute('aria-pressed', 'false');
      tagCloud.appendChild(btn);
    });

    function filterPosts(category, tag) {
      const lowerCategory = category ? category.toLowerCase() : null;
      const lowerTag = tag ? tag.toLowerCase() : null;
      posts.forEach(post => {
        const postCat = (post.dataset.category || '').toLowerCase();
        const postTags = (post.dataset.tags || '').toLowerCase();
        let show = true;
        if (lowerCategory && lowerCategory !== 'all') {
          show = postCat === lowerCategory;
        }
        if (show && lowerTag) {
          show = postTags.split(',').map(t=>t.trim()).includes(lowerTag);
        }
        if (show) {
          post.classList.remove('filtered-out');
        } else {
          post.classList.add('filtered-out');
        }
      });
      // update pagination after filtering
      if (window.homePagination && typeof window.homePagination.showRange === 'function') {
        window.homePagination.showRange(window.homePagination.current);
      }
    }

    // Tab click
    // Read category from query params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category') || localStorage.getItem('homepage-category') || 'all';
    const initialTag = urlParams.get('tag') || null;

    function setActiveTab(cat) {
      tabs.forEach(t => {
        t.classList.toggle('active', t.dataset.cat === cat);
        t.setAttribute('aria-pressed', t.dataset.cat === cat);
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.cat;
        // update UI
        setActiveTab(category);
        // update URL and localStorage
        const params = new URLSearchParams(window.location.search);
        params.set('category', category);
        history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
        localStorage.setItem('homepage-category', category);
        // clear tag selection
        Array.from(document.querySelectorAll('.tag-btn')).forEach(b=>b.classList.remove('active'));
        filterPosts(category, null);
      });
    });

    // Tag click
    tagCloud.addEventListener('click', e => {
      if (e.target && e.target.matches('.tag-btn')) {
        const tag = e.target.dataset.tag;
        // set active state for tag
        Array.from(document.querySelectorAll('.tag-btn')).forEach(b=> b.classList.toggle('active', b.dataset.tag === tag));
        // update URL
        const params = new URLSearchParams(window.location.search);
        params.set('tag', tag);
        history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
        // remove active from tabs
        setActiveTab('all');
        filterPosts('all', tag);
      }
    });

    // Initialize initial filters
    if (initialTag) {
      const btn = document.querySelector(`.tag-btn[data-tag="${initialTag}"]`);
      if (btn) btn.classList.add('active');
    }
    setActiveTab(initialCategory);
    filterPosts(initialCategory, initialTag);
  });
})();
