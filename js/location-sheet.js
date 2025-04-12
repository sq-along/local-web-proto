// Helper function to calculate overlay color
function overlayWithBlack(baseColor, opacity) {
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1,3), 16);
    const g = parseInt(baseColor.slice(3,5), 16);
    const b = parseInt(baseColor.slice(5,7), 16);
    
    // Calculate overlay
    const black = 0;
    const overlayR = Math.round(r * (1 - opacity) + black * opacity);
    const overlayG = Math.round(g * (1 - opacity) + black * opacity);
    const overlayB = Math.round(b * (1 - opacity) + black * opacity);
    
    // Convert back to hex
    return '#' + [overlayR, overlayG, overlayB]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

const LocationSheet = {
    init() {
        this.locationButton = document.getElementById('locationButton');
        this.locationSheet = document.getElementById('locationSheet');
        this.closeButton = document.getElementById('closeLocationSheet');
        this.backdrop = this.locationSheet?.querySelector('.sheet-backdrop');
        this.locationOptions = document.querySelectorAll('.location-option input');
        this.metaThemeColor = document.querySelector('meta[id="metaThemeColorDefault"]');
        
        this.isMobile = window.innerWidth <= 800;
        this.bindEvents();
        
        // Handle resize events
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 800;
        });
    },

    bindEvents() {
        if (!this.locationButton || !this.locationSheet) return;

        this.locationButton.addEventListener('click', (e) => this.open(e));
        this.closeButton?.addEventListener('click', () => this.close());
        this.backdrop?.addEventListener('click', () => this.close());

        this.locationOptions?.forEach(option => {
            option.addEventListener('change', (e) => this.handleSelection(e));
        });
    },

    open(e) {
        e.preventDefault();
        e.stopPropagation();
        this.locationSheet.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Handle theme color on mobile
        if (this.isMobile && this.metaThemeColor) {
            // Get the current color (whether it's brand color or white)
            this.originalColor = this.metaThemeColor.getAttribute('content');
            const overlaidColor = overlayWithBlack(this.originalColor, 0.25);
            this.metaThemeColor.setAttribute('content', overlaidColor);
        }
    },

    close() {
        this.locationSheet.classList.remove('active');
        document.body.style.overflow = '';

        // Restore original theme color on mobile
        if (this.isMobile && this.metaThemeColor && this.originalColor) {
            this.metaThemeColor.setAttribute('content', this.originalColor);
            this.originalColor = null; // Clear the stored color
        }
    },

    handleSelection(e) {
        const label = e.target.closest('.location-option');
        const locationAddress = label.querySelector('.location-details p').textContent;
        
        this.selectedLocation = {
            address: locationAddress,
            value: e.target.value
        };

        // On mobile, select and close after a short delay
        if (this.isMobile) {
            this.updateLocationButton(locationAddress);
            setTimeout(() => {
                this.close();
            }, 300); // 300ms delay for a more noticeable pause
        }
    },

    updateLocationButton(address) {
        this.locationButton.innerHTML = `
            ${address}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LocationSheet.init());
} else {
    LocationSheet.init();
}