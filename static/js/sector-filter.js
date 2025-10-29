// Sector filtering for Linux in Our Lives page
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.sector-filter-btn');
    const sectorSections = document.querySelectorAll('.sector-section');
    const loadMoreBtns = document.querySelectorAll('.load-more-btn');
    
    // Filter button functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedSector = this.getAttribute('data-sector');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide sectors
            if (selectedSector === 'all') {
                sectorSections.forEach(section => {
                    section.classList.remove('hidden');
                });
            } else {
                sectorSections.forEach(section => {
                    const sectorId = section.getAttribute('data-sector');
                    if (sectorId === selectedSector) {
                        section.classList.remove('hidden');
                    } else {
                        section.classList.add('hidden');
                    }
                });
            }
            
            // Smooth scroll to first visible section
            if (selectedSector !== 'all') {
                const targetSection = document.querySelector(`#sector-${selectedSector}`);
                if (targetSection) {
                    setTimeout(() => {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        });
    });
    
    // Load More button functionality
    loadMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sector = this.getAttribute('data-sector');
            const sectionList = document.querySelector(`[data-sector-list="${sector}"]`);
            const hiddenCards = sectionList.querySelectorAll('.hidden-card');
            
            let loadedCount = 0;
            const loadBatchSize = 6;
            
            hiddenCards.forEach((card, index) => {
                if (loadedCount < loadBatchSize && card.style.display === 'none') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        card.style.transition = 'opacity 0.3s, transform 0.3s';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    }, index * 50);
                    loadedCount++;
                }
            });
            
            // Check if there are more hidden cards
            const remainingHidden = Array.from(hiddenCards).filter(card => card.style.display === 'none');
            if (remainingHidden.length === 0) {
                this.style.display = 'none';
            } else {
                this.textContent = `Load More (${remainingHidden.length} more)`;
            }
        });
    });
});
