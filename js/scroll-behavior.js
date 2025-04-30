document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    const restaurantInfo = document.querySelector('.restaurant-info');
    const menuCategories = document.querySelector('.menu-categories');
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    let isFixed = false;
    let initialMenuCategoriesTop = 0;
    
    // Calculate initial positions
    function initializePositions() {
        const menuRect = menuCategories.getBoundingClientRect();
        initialMenuCategoriesTop = menuRect.top + window.scrollY;
    }

    // Handle scroll behavior
    function updateScrollBehavior() {
        const scrollY = window.scrollY;
        const menuRect = menuCategories.getBoundingClientRect();
        const infoRect = restaurantInfo.getBoundingClientRect();
        
        // When scroll reaches menu categories
        if (scrollY >= initialMenuCategoriesTop && !isFixed) {
            mainContent.classList.add('is-fixed');
            isFixed = true;
        }
        
        // When restaurant info is scrolled out of view
        if (infoRect.bottom <= 0 && isFixed) {
            const offset = scrollY - initialMenuCategoriesTop;
            mainContent.style.setProperty('--scroll-offset', `${offset}px`);
            mainContent.classList.remove('is-fixed');
            mainContent.classList.add('is-released');
            isFixed = false;
        }
        
        // Reset when scrolling back up
        if (scrollY < initialMenuCategoriesTop) {
            mainContent.classList.remove('is-fixed', 'is-released');
            mainContent.style.removeProperty('--scroll-offset');
            isFixed = false;
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    // Throttle scroll events
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollBehavior();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Initialize
    initializePositions();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', initializePositions, { passive: true });
});