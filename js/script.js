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
        category.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            const categoryId = category.dataset.category;
            const heading = document.getElementById(categoryId);
            
            if (heading) {
                lastClickTime = Date.now();
                heading.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    let ticking = false;
    let lastKnownScrollPosition = 0;

    function updateActiveCategory() {
        if (Date.now() - lastClickTime < SCROLL_LOCK_DURATION) {
            ticking = false;
            return;
        }

        const viewportHeight = window.innerHeight;
        const viewportMiddle = window.scrollY + (viewportHeight / 3);

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

    window.addEventListener('scroll', onScroll, { passive: true });
});