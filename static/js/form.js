document.addEventListener('DOMContentLoaded', function() {
    // Get pricing model radio buttons
    const workstationRadio = document.querySelector('input[value="workstation"]');
    const userRadio = document.querySelector('input[value="user"]');
    
    // Get pricing detail sections
    const workstationPricing = document.getElementById('workstation-pricing');
    const userPricing = document.getElementById('user-pricing');
    
    // Function to toggle pricing sections
    function togglePricingSections() {
        if (workstationRadio.checked) {
            workstationPricing.classList.add('active');
            userPricing.classList.remove('active');
        } else if (userRadio.checked) {
            userPricing.classList.add('active');
            workstationPricing.classList.remove('active');
        }
    }
    
    // Add event listeners to radio buttons
    workstationRadio.addEventListener('change', togglePricingSections);
    userRadio.addEventListener('change', togglePricingSections);
    
    // Initialize on page load
    togglePricingSections();
    
    // Form validation enhancement
    const form = document.querySelector('.msa-form');
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    
    // Add real-time validation
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Validation function
    function validateField(field) {
        const value = field.value.trim();
        const isValid = value !== '';
        
        if (field.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }
        
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            field.classList.add('error');
            field.classList.remove('valid');
        }
        
        return isValid;
    }
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
        let isFormValid = true;
        
        // Validate all required fields
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        // Check if a pricing model is selected
        const pricingModel = form.querySelector('input[name="pricing_model"]:checked');
        if (!pricingModel) {
            isFormValid = false;
            alert('Please select a pricing model.');
        }
        
        // Validate pricing data based on selected model
        if (pricingModel && isFormValid) {
            if (pricingModel.value === 'workstation') {
                const count = parseInt(document.getElementById('workstation_count').value);
                const price = parseFloat(document.getElementById('workstation_price').value);
                if (count < 1 || price <= 0) {
                    isFormValid = false;
                    alert('Please enter valid workstation count and price.');
                }
            } else if (pricingModel.value === 'user') {
                const count = parseInt(document.getElementById('user_count').value);
                const price = parseFloat(document.getElementById('user_price').value);
                if (count < 1 || price <= 0) {
                    isFormValid = false;
                    alert('Please enter valid user count and price.');
                }
            }
        }
        
        if (!isFormValid) {
            e.preventDefault();
            // Scroll to first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        } else {
            // Show loading state
            const submitBtn = form.querySelector('.btn-primary');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="icon">⏳</i> Generating Document...';
            submitBtn.disabled = true;
            
            // Re-enable button after 30 seconds as fallback
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 30000);
        }
    });
    
    // Auto-format phone number
    const phoneField = document.getElementById('client_phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/(\d{1,3})/, '($1');
            }
            this.value = value;
        });
    }
    
    // Add smooth animations to form sections
    const formSections = document.querySelectorAll('.form-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initialize form sections with animation styles
    formSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Show first section immediately
    if (formSections.length > 0) {
        formSections[0].style.opacity = '1';
        formSections[0].style.transform = 'translateY(0)';
    }
});

// Add CSS for field validation states
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ef4444;
        background-color: #fef2f2;
    }
    
    .form-group input.valid,
    .form-group textarea.valid {
        border-color: #22c55e;
        background-color: #f0fdf4;
    }
    
    .form-group input.error:focus,
    .form-group textarea.error:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .form-group input.valid:focus,
    .form-group textarea.valid:focus {
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
`;
document.head.appendChild(style);
