/**
 * Vgfal Fit x Rahen Crew
 * Stripe Payment Integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Stripe payment functionality
    initStripePayment();
});

/**
 * Initialize Stripe Payment
 */
function initStripePayment() {
    // Payment modal elements
    const paymentModal = document.getElementById('paymentModal');
    const modalClose = document.querySelector('.payment-modal-close');
    const selectedPlanName = document.getElementById('selectedPlanName');
    const selectedPlanPrice = document.getElementById('selectedPlanPrice');
    const paymentButtons = document.querySelectorAll('.open-payment');
    
    // Stripe elements
    let stripe = null;
    let elements = null;
    let card = null;
    let clientSecret = null;
    
    // Initialize Stripe with your publishable key
    // Replace 'pk_test_your_key' with your actual Stripe publishable key
    const stripePublishableKey = 'pk_test_your_key';
    
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
            
            // Initialize Stripe elements if not already initialized
            if (!stripe) {
                initializeStripe();
            }
        });
    });
    
    // Close payment modal
    modalClose.addEventListener('click', function() {
        paymentModal.classList.remove('active');
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            paymentModal.classList.remove('active');
        }
    });
    
    /**
     * Initialize Stripe Elements
     */
    function initializeStripe() {
        // Initialize Stripe
        stripe = Stripe(stripePublishableKey);
        
        // Create Elements instance
        elements = stripe.elements();
        
        // Create and mount the Card Element
        card = elements.create('card', {
            style: {
                base: {
                    color: '#333333',
                    fontFamily: '"Montserrat", sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            }
        });
        
        // Mount the Card Element to the DOM
        card.mount('#card-element');
        
        // Handle real-time validation errors from the card Element
        card.on('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        // Handle form submission
        const form = document.getElementById('payment-form');
        form.addEventListener('submit', handleSubmit);
    }
    
    /**
     * Handle the payment form submission
     */
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Get customer information
        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;
        const planName = selectedPlanName.textContent;
        const planPrice = selectedPlanPrice.textContent;
        
        // Disable the submit button to prevent multiple submissions
        setLoading(true);
        
        try {
            // In a real implementation, you would make an API call to your server to create a PaymentIntent
            // For this example, we'll simulate the API response
            
            // Simulate API call to create PaymentIntent
            const paymentIntentResponse = await simulateCreatePaymentIntent(planName, planPrice, customerEmail);
            clientSecret = paymentIntentResponse.clientSecret;
            
            // Confirm the card payment with the client secret
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: customerName,
                        email: customerEmail
                    }
                }
            });
            
            if (result.error) {
                // Show error to customer
                showMessage(result.error.message, 'error');
            } else {
                // The payment succeeded!
                if (result.paymentIntent.status === 'succeeded') {
                    // Show success message and redirect to success page
                    showMessage('Payment successful! Redirecting to your program...', 'success');
                    
                    // In a real implementation, you would redirect to a success page or member area
                    setTimeout(() => {
                        // Redirect to a success page
                        // window.location.href = '/success.html';
                        
                        // For this example, we'll just close the modal
                        paymentModal.classList.remove('active');
                        
                        // Reset the form
                        document.getElementById('payment-form').reset();
                    }, 3000);
                }
            }
        } catch (error) {
            showMessage(error.message, 'error');
        }
        
        setLoading(false);
    }
    
    /**
     * Simulate creating a PaymentIntent on the server
     * In a real implementation, this would be an API call to your server
     */
    function simulateCreatePaymentIntent(planName, planPrice, email) {
        // Remove currency symbol and convert to cents
        const priceInCents = parseInt(planPrice.replace(/[^0-9.]/g, '')) * 100;
        
        // Simulate API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    clientSecret: 'pi_test_secret_' + Math.random().toString(36).substring(2, 15),
                    amount: priceInCents,
                    currency: 'usd'
                });
            }, 1000);
        });
    }
    
    /**
     * Show a message in the payment modal
     */
    function showMessage(messageText, type) {
        const messageElement = document.getElementById('payment-message');
        messageElement.classList.remove('hidden', 'success', 'error');
        messageElement.textContent = messageText;
        
        if (type) {
            messageElement.classList.add(type);
        }
    }
    
    /**
     * Set the payment button to a loading state
     */
    function setLoading(isLoading) {
        const submitButton = document.getElementById('submit-button');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');
        
        if (isLoading) {
            // Disable the button and show spinner
            submitButton.disabled = true;
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            // Enable the button and hide spinner
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }
}

/**
 * IMPORTANT IMPLEMENTATION NOTES:
 * 
 * 1. This is a client-side implementation for demonstration purposes.
 * 
 * 2. In a production environment, you MUST implement a server-side component to:
 *    - Create PaymentIntents securely
 *    - Store customer information
 *    - Handle webhooks for payment events
 *    - Validate payments before granting access
 * 
 * 3. Never expose your Stripe secret key in client-side code.
 * 
 * 4. Replace 'pk_test_your_key' with your actual Stripe publishable key.
 * 
 * 5. For a complete implementation, you would need:
 *    - A server endpoint to create PaymentIntents
 *    - A webhook endpoint to handle Stripe events
 *    - A success page to redirect after payment
 *    - A customer dashboard to manage subscriptions
 */
