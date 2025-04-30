document.addEventListener('DOMContentLoaded', () => {
    const menuTimeSheet = document.getElementById('menuTimeSheet');
    const menuTimeButton = document.getElementById('menuTimeButton');
    const closeMenuTimeSheet = document.getElementById('closeMenuTimeSheet');
    const cancelMenuTimeSheet = document.getElementById('cancelMenuTimeSheet');
    const confirmMenuTime = document.getElementById('confirmMenuTime');
    const menuTimeOptions = document.querySelectorAll('input[name="menu-time"]');
    const menuTimeDisplay = document.getElementById('menuTimeDisplay');
    const menuHeading = document.getElementById('menuHeading');

    function openMenuTimeSheet() {
        if (!menuTimeSheet) return;
        menuTimeSheet.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenuTimeSheet() {
        if (!menuTimeSheet) return;
        menuTimeSheet.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateMenuTime(option) {
        const details = option.closest('.menu-option').querySelector('.menu-details');
        const name = details.querySelector('h4').textContent;
        const time = details.querySelector('p').textContent;
        
        menuTimeDisplay.textContent = time;
        menuHeading.textContent = name;
        closeMenuTimeSheet();
    }

    // Add event listeners
    menuTimeButton?.addEventListener('click', openMenuTimeSheet);
    closeMenuTimeSheet?.addEventListener('click', closeMenuTimeSheet);
    cancelMenuTimeSheet?.addEventListener('click', closeMenuTimeSheet);
    
    menuTimeOptions.forEach(option => {
        option.addEventListener('change', () => {
            updateMenuTime(option);
        });
    });

    confirmMenuTime?.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="menu-time"]:checked');
        if (selectedOption) {
            updateMenuTime(selectedOption);
        }
    });

    // Close on backdrop click
    menuTimeSheet?.addEventListener('click', (e) => {
        if (e.target.classList.contains('sheet-backdrop')) {
            closeMenuTimeSheet();
        }
    });
});