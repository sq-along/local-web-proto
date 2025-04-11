document.addEventListener('DOMContentLoaded', () => {
    // Header Shadow on Scroll
    const menuHeader = document.querySelector('.menu-header');
    let headerScrolled = false;

    function updateHeaderShadow() {
        const shouldShowShadow = window.scrollY > 0;
        
        if (shouldShowShadow !== headerScrolled) {
            headerScrolled = shouldShowShadow;
            menuHeader.classList.toggle('scrolled', headerScrolled);
        }
    }

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateHeaderShadow);
    }, { passive: true });

    // Location Popover
    const locationButton = document.getElementById('locationButton');
    const locationPopover = document.getElementById('locationPopover');
    const locationOptions = document.querySelectorAll('.location-option input');

    // Toggle popover
    locationButton.addEventListener('click', (e) => {
        e.stopPropagation();
        locationPopover.classList.toggle('active');
    });

    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
        if (!locationPopover.contains(e.target) && e.target !== locationButton) {
            locationPopover.classList.remove('active');
        }
    });

    // Handle location selection
    locationOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            const label = e.target.closest('.location-option');
            const locationName = label.querySelector('h4').textContent;
            
            // Update button text
            locationButton.innerHTML = `
                <img src="icons/location-icon.svg" alt="Location" class="header-icon">
                ${locationName}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            // Close popover
            locationPopover.classList.remove('active');
        });
    });

    // Cart Blade
    const cartButton = document.querySelector('.cart-button');
    const cartBlade = document.getElementById('cartBlade');
    const closeCartButton = document.getElementById('closeCartBlade');
    const bladeOverlay = document.getElementById('bladeOverlay');

    function openCartBlade() {
        cartBlade.classList.add('active');
        bladeOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCartBlade() {
        cartBlade.classList.remove('active');
        bladeOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartButton.addEventListener('click', openCartBlade);
    closeCartButton.addEventListener('click', closeCartBlade);
    bladeOverlay.addEventListener('click', closeCartBlade);

    // Category navigation
    const categories = document.querySelectorAll('.category');
    const categoryHeadings = Array.from(document.querySelectorAll('.category-heading'));
    let lastClickTime = 0;
    const SCROLL_LOCK_DURATION = 1000;

    if (categories.length > 0) {
        categories[0].classList.add('active');
    }
    
    categories.forEach(category => {
        const handler = (e) => {
            e.preventDefault();
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            const categoryId = category.dataset.category;
            const heading = document.getElementById(categoryId);
            
            if (heading) {
                lastClickTime = Date.now();
                // Special handling for first category to ensure we scroll to the very top
                if (categoryId === 'thoke') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    heading.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        };

        // Add both click and touch events
        category.addEventListener('click', handler);
        category.addEventListener('touchend', handler);
    });

    let ticking = false;
    let lastKnownScrollPosition = 0;

    function updateActiveCategory() {
        if (Date.now() - lastClickTime < SCROLL_LOCK_DURATION) {
            ticking = false;
            return;
        }

        // Find all headings and their positions
        const headingPositions = categoryHeadings.map(heading => {
            const rect = heading.getBoundingClientRect();
            return {
                id: heading.id,
                top: rect.top,
                bottom: rect.bottom,
                height: rect.height
            };
        });

        // Find the first heading that's at or near the top of the viewport
        const activeHeading = headingPositions.find(pos => 
            pos.top <= 100 && pos.bottom > 0
        );

        if (activeHeading) {
            const categoryId = activeHeading.id;
            const activeCategory = document.querySelector(`.category[data-category="${categoryId}"]`);
            
            if (activeCategory && !activeCategory.classList.contains('active')) {
                categories.forEach(c => c.classList.remove('active'));
                activeCategory.classList.add('active');

                // Only scroll the category into view on mobile
                if (window.innerWidth <= 800) {
                    activeCategory.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest'
                    });
                }
            }
        }

        ticking = false;
    }

    function onScroll() {
        lastKnownScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveCategory();
                updateThemeColor();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Theme color update
    const logoContainer = document.querySelector('.logo-container');
    const metaThemeColor = document.querySelector('meta[id="metaThemeColorDefault"]');
    let isWhiteTheme = false;

    function updateThemeColor() {
        if (!logoContainer || !metaThemeColor) return;
        
        const rect = logoContainer.getBoundingClientRect();
        const shouldBeWhite = rect.bottom <= 0;
        
        if (shouldBeWhite !== isWhiteTheme) {
            isWhiteTheme = shouldBeWhite;
            metaThemeColor.setAttribute('content', shouldBeWhite ? '#fff' : '#450CF5');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
});