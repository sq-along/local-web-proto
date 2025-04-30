document.addEventListener('DOMContentLoaded', () => {
    const segmentButtons = document.querySelectorAll('.segment-button');
    
    segmentButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            segmentButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
        });
    });
});