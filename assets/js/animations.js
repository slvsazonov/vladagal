// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

// FAQ Accordion functionality
function toggleFaq(element) {
    // Get the answer element (next sibling)
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    // Toggle active class on the question
    element.classList.toggle('active');
    
    // If the answer is open, close it
    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        answer.style.maxHeight = '0px';
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    } else {
        // Close all other answers first
        const allAnswers = document.querySelectorAll('.faq-answer');
        const allIcons = document.querySelectorAll('.faq-question i');
        
        allAnswers.forEach(item => {
            item.style.maxHeight = '0px';
        });
        
        allIcons.forEach(item => {
            item.classList.remove('fa-minus');
            item.classList.add('fa-plus');
        });
        
        // Open the clicked answer
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    }
}

// Start observing elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .slide-left, .slide-right');
    animatedElements.forEach(el => observer.observe(el));
});
