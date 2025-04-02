document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.category');
    const categoryHeadings = Array.from(document.querySelectorAll('.category-heading'));
    const mainContent = document.querySelector('.main-content');
    
    // Click handling for categories
    categories.forEach(category => {
        category.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            const categoryId = category.dataset.category;
            const heading = document.getElementById(categoryId);
            
            if (heading) {
                // Calculate offset considering the sticky header on mobile
                const isMobile = window.innerWidth <= 1024;
                const offset = isMobile ? -60 : 0; // Adjust this value based on your sticky header height
                
                const headingPosition = heading.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: headingPosition + offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // More responsive scroll tracking
    let ticking = false;
    let lastKnownScrollPosition = 0;

    function updateActiveCategory() {
        const viewportHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportMiddle = scrollTop + (viewportHeight / 3); // Bias towards upper third

        // Find the section closest to the viewport middle
        let closestSection = null;
        let closestDistance = Infinity;

        categoryHeadings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            const absoluteTop = scrollTop + rect.top;
            const distance = Math.abs(absoluteTop - viewportMiddle);

            // Only consider headings that are above the bottom of the viewport
            // or not too far below it
            const isBelowBottom = rect.top > viewportHeight + 100;
            const isWayAboveTop = rect.bottom < -100;
            
            if (!isBelowBottom && !isWayAboveTop && distance < closestDistance) {
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
                
                // Ensure the active category is visible in the scrolling container
                const categoryContainer = document.querySelector('.category-container');
                if (categoryContainer && window.innerWidth <= 1024) {
                    const containerRect = categoryContainer.getBoundingClientRect();
                    const activeRect = activeCategory.getBoundingClientRect();
                    
                    if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
                        activeCategory.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }
                }
            }
        }

        ticking = false;
    }

    // Intersection Observer for better performance
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    };

    const headingObserver = new IntersectionObserver((entries) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveCategory();
                ticking = false;
            });
            ticking = true;
        }
    }, observerOptions);

    // Observe all category headings
    categoryHeadings.forEach(heading => {
        headingObserver.observe(heading);
    });

    // Throttled scroll handler for smoother updates
    function onScroll() {
        lastKnownScrollPosition = window.pageYOffset;
        
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

    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateActiveCategory, 100);
    });
});