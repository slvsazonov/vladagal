/**
 * Vgfal Fit x Rahen Crew Landing Page
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initTestimonialSlider();
    initStickyButton();
    initContactForm();
    initPaymentModal();
});

/**
 * Mobile Navigation Toggle
 */
function initNavbar() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });
    
    // Change navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * FAQ Section
 * FAQ is now static and requires no JavaScript
 */

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!slider || !dotsContainer) return;
    
    const testimonials = slider.querySelectorAll('.testimonial-item');
    
    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            scrollToTestimonial(index);
            updateActiveDot(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    // Scroll to testimonial
    function scrollToTestimonial(index) {
        const testimonial = testimonials[index];
        slider.scrollTo({
            left: testimonial.offsetLeft,
            behavior: 'smooth'
        });
    }
    
    // Update active dot
    function updateActiveDot(index) {
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Handle scroll events to update active dot
    slider.addEventListener('scroll', () => {
        const scrollPosition = slider.scrollLeft;
        
        testimonials.forEach((testimonial, index) => {
            const testimonialPosition = testimonial.offsetLeft;
            const testimonialWidth = testimonial.offsetWidth;
            
            if (
                scrollPosition >= testimonialPosition - 50 &&
                scrollPosition < testimonialPosition + testimonialWidth - 50
            ) {
                updateActiveDot(index);
            }
        });
    });
    
    // Auto scroll every 5 seconds
    let currentIndex = 0;
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        scrollToTestimonial(currentIndex);
        updateActiveDot(currentIndex);
    }, 5000);
}

/**
 * Sticky CTA Button
 */
function initStickyButton() {
    const stickyCta = document.querySelector('.sticky-cta');
    
    if (!stickyCta) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Animation on Scroll
 * Simple implementation to add fade-in animations as elements come into view
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('animated');
        }
    });
}

// Initialize animations
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

/**
 * Payment Modal Functionality
 */
function initPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const modalClose = document.querySelector('.payment-modal-close');
    const selectedPlanName = document.getElementById('selectedPlanName');
    const selectedPlanPrice = document.getElementById('selectedPlanPrice');
    const paymentButtons = document.querySelectorAll('.open-payment');
    
    if (!paymentModal || !paymentButtons.length) return;
    
    // Open payment modal when clicking on payment buttons
    paymentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const price = this.getAttribute('data-price');
            
            // Set plan details in the modal
            selectedPlanName.textContent = plan;
            selectedPlanPrice.textContent = price;
            
            // Show the modal
            paymentModal.classList.add('active');
        });
    });
    
    // Close payment modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            paymentModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            paymentModal.classList.remove('active');
        }
    });
}
