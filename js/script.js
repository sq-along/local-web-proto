document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.category');
    const categoryHeadings = Array.from(document.querySelectorAll('.category-heading'));
    
    // Click handling for categories
    categories.forEach(category => {
        category.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            const categoryId = category.dataset.category;
            const heading = document.getElementById(categoryId);
            
            if (heading) {
                heading.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // More responsive scroll tracking
    let ticking = false;
    let lastKnownScrollPosition = 0;

    function updateActiveCategory() {
        const viewportHeight = window.innerHeight;
        const viewportMiddle = window.scrollY + (viewportHeight / 3); // Bias towards upper third

        // Find the section closest to the viewport middle
        let closestSection = null;
        let closestDistance = Infinity;

        categoryHeadings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            const absoluteTop = window.scrollY + rect.top;
            const distance = Math.abs(absoluteTop - viewportMiddle);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = heading;
            }
        });

        if (closestSection) {
            const categoryId = closestSection.id;
            const activeCategory = document.querySelector(`.category[data-category="${categoryId}"]`);
            
            if (activeCategory && !activeCategory.classList.contains('active')) {
                categories.forEach(c => c.classList.remove('active'));
                activeCategory.classList.add('active');
            }
        }

        ticking = false;
    }

    // Throttled scroll handler
    function onScroll() {
        lastKnownScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveCategory();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial check
    updateActiveCategory();
});