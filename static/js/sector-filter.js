// Sector filtering for Linux in Our Lives page
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.sector-filter-btn');
    const sectorSections = document.querySelectorAll('.sector-section');
    
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
});
