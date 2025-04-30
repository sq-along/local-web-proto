document.addEventListener('DOMContentLoaded', () => {
    console.log('Menu time sheet script loaded');
    
    const menuTimeSheet = document.getElementById('menuTimeSheet');
    const menuTimeButton = document.getElementById('menuTimeButton');
    const closeButton = document.getElementById('closeMenuTimeSheet');
    const cancelButton = document.getElementById('cancelMenuTimeSheet');
    const confirmButton = document.getElementById('confirmMenuTime');
    const menuTimeOptions = document.querySelectorAll('input[name="menu-time"]');
    const menuTimeDisplay = document.getElementById('menuTimeDisplay');
    const menuHeading = document.getElementById('menuHeading');

    // Log elements to verify they're found
    console.log('Elements found:', {
        menuTimeSheet: !!menuTimeSheet,
        menuTimeButton: !!menuTimeButton,
        closeButton: !!closeButton,
        cancelButton: !!cancelButton,
        confirmButton: !!confirmButton,
        menuTimeOptions: menuTimeOptions.length,
        menuTimeDisplay: !!menuTimeDisplay,
        menuHeading: !!menuHeading
    });

    function openMenuTimeSheet() {
        console.log('Opening menu time sheet');
        if (!menuTimeSheet) {
            console.error('Menu time sheet element not found');
            return;
        }
        menuTimeSheet.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenuTimeSheet() {
        console.log('Closing menu time sheet');
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

    // Add event listeners with direct click handler
    if (menuTimeButton) {
        console.log('Adding click handler to menu time button');
        menuTimeButton.onclick = openMenuTimeSheet;
    }

    if (closeButton) {
        closeButton.onclick = closeMenuTimeSheet;
    }

    if (cancelButton) {
        cancelButton.onclick = closeMenuTimeSheet;
    }
    
    menuTimeOptions.forEach(option => {
        option.addEventListener('change', () => {
            updateMenuTime(option);
        });
    });

    if (confirmButton) {
        confirmButton.onclick = () => {
            const selectedOption = document.querySelector('input[name="menu-time"]:checked');
            if (selectedOption) {
                updateMenuTime(selectedOption);
            }
        };
    }

    // Close on backdrop click
    if (menuTimeSheet) {
        menuTimeSheet.onclick = (e) => {
            if (e.target.classList.contains('sheet-backdrop')) {
                closeMenuTimeSheet();
            }
        };
    }
});