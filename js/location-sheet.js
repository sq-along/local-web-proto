const LocationSheet = {
    init() {
        this.locationButton = document.getElementById('locationButton');
        this.locationSheet = document.getElementById('locationSheet');
        this.closeButton = document.getElementById('closeLocationSheet');
        this.cancelButton = document.getElementById('cancelLocationSheet');
        this.confirmButton = document.getElementById('confirmLocation');
        this.backdrop = this.locationSheet?.querySelector('.sheet-backdrop');
        this.locationOptions = document.querySelectorAll('.location-option input');

        this.bindEvents();
    },

    bindEvents() {
        if (!this.locationButton || !this.locationSheet) return;

        this.locationButton.addEventListener('click', (e) => this.open(e));
        this.closeButton?.addEventListener('click', () => this.close());
        this.cancelButton?.addEventListener('click', () => this.close());
        this.backdrop?.addEventListener('click', () => this.close());

        this.locationOptions?.forEach(option => {
            option.addEventListener('change', (e) => this.handleSelection(e));
        });

        this.confirmButton?.addEventListener('click', () => this.handleConfirm());
    },

    open(e) {
        e.preventDefault();
        e.stopPropagation();
        this.locationSheet.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.locationSheet.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleSelection(e) {
        const label = e.target.closest('.location-option');
        const locationName = label.querySelector('h4').textContent;
        
        this.selectedLocation = {
            name: locationName,
            value: e.target.value
        };
    },

    handleConfirm() {
        if (this.selectedLocation) {
            this.locationButton.innerHTML = `
                ${this.selectedLocation.name}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            this.close();
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LocationSheet.init());
} else {
    LocationSheet.init();
}