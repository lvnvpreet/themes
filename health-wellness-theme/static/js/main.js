// =============================================================================
// StarDentic Hugo Theme - Complete JavaScript
// Enhanced version with improved functionality, accessibility, and performance
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initFAQ();
    initSmoothScrolling();
    initForms();
    initTestimonialSlider();
    initLazyLoading();
    initSearch();
    initScrollAnimations();
    initScrollToTop();
    initDropdownMenus();
    initTOC();
    initContactMap();
    initAccessibility();
    initPerformanceMonitoring();
    
    // Initialize sticky header with debounced scroll
    window.addEventListener('scroll', debounce(handleScroll, 10));
    
    // Initialize resize handler
    window.addEventListener('resize', debounce(handleResize, 250));
});

// =============================================================================
// MOBILE MENU & NAVIGATION
// =============================================================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.main-navigation');
    const body = document.body;
    
    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Update ARIA attributes
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle classes
            this.classList.toggle('active');
            navigation.classList.toggle('mobile-active');
            body.classList.toggle('mobile-menu-open');
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (this.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
            
            // Handle focus trapping
            if (!isExpanded) {
                trapFocus(navigation);
            } else {
                removeFocusTrap();
                menuToggle.focus();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navigation.classList.contains('mobile-active')) {
                menuToggle.click();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && 
                !navigation.contains(e.target) && 
                navigation.classList.contains('mobile-active')) {
                menuToggle.click();
            }
        });
    }
}

// Dropdown Menus with enhanced accessibility
function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!trigger || !menu) return;
        
        // Add ARIA attributes
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('role', 'menu');
        
        // Desktop hover behavior
        if (window.innerWidth > 768) {
            dropdown.addEventListener('mouseenter', function() {
                trigger.setAttribute('aria-expanded', 'true');
                this.classList.add('open');
            });
            
            dropdown.addEventListener('mouseleave', function() {
                trigger.setAttribute('aria-expanded', 'false');
                this.classList.remove('open');
            });
        }
        
        // Mobile click behavior
        trigger.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const isOpen = dropdown.classList.contains('open');
                
                // Close all other dropdowns
                dropdowns.forEach(d => {
                    d.classList.remove('open');
                    d.querySelector('a').setAttribute('aria-expanded', 'false');
                });
                
                // Toggle current dropdown
                if (!isOpen) {
                    dropdown.classList.add('open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            }
        });
        
        // Keyboard navigation
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// =============================================================================
// FOCUS MANAGEMENT & ACCESSIBILITY
// =============================================================================

function initAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }
    
    // Enhance focus indicators
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Announce page changes for screen readers
    announcePageChange();
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    if (!firstFocusableElement) return;
    
    element.setAttribute('data-focus-trapped', 'true');
    
    element.addEventListener('keydown', handleFocusTrap);
    
    function handleFocusTrap(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
    
    firstFocusableElement.focus();
}

function removeFocusTrap() {
    const trappedElement = document.querySelector('[data-focus-trapped="true"]');
    if (trappedElement) {
        trappedElement.removeAttribute('data-focus-trapped');
        trappedElement.removeEventListener('keydown', handleFocusTrap);
    }
}

function announcePageChange() {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = `Page loaded: ${document.title}`;
    document.body.appendChild(announcer);
    
    setTimeout(() => {
        document.body.removeChild(announcer);
    }, 1000);
}

// =============================================================================
// FAQ ACCORDION
// =============================================================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const button = question.querySelector('button') || question;
        
        if (!question || !answer) return;
        
        // Add ARIA attributes
        const questionId = `faq-question-${index}`;
        const answerId = `faq-answer-${index}`;
        
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', answerId);
        button.setAttribute('id', questionId);
        answer.setAttribute('id', answerId);
        answer.setAttribute('aria-labelledby', questionId);
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');
            
            // Close other items (accordion behavior)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherButton = otherItem.querySelector('.faq-question button') || otherItem.querySelector('.faq-question');
                    otherButton.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            button.setAttribute('aria-expanded', !isOpen);
            
            // Smooth scroll if needed
            if (!isOpen) {
                setTimeout(() => {
                    const rect = item.getBoundingClientRect();
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    if (rect.top < headerHeight) {
                        window.scrollTo({
                            top: window.pageYOffset + rect.top - headerHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
        
        // Keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// =============================================================================
// SMOOTH SCROLLING
// =============================================================================

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just a hash
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });
}

// =============================================================================
// FORM HANDLING & VALIDATION
// =============================================================================

function initForms() {
    // Appointment Forms
    const appointmentForms = document.querySelectorAll('.appointment-form form, .quick-booking-form');
    appointmentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAppointmentSubmission(this);
        });
    });
    
    // Contact Form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission(this);
        });
    }
    
    // Newsletter Forms
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmission(this);
        });
    });
    
    // Search Forms
    const searchForms = document.querySelectorAll('.search-form');
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearch(this);
        });
    });
    
    // Form validation
    initFormValidation();
}

function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            // Real-time validation on blur
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear errors on input
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
            
            // Add required indicator
            const label = input.closest('.form-group')?.querySelector('label');
            if (label && input.hasAttribute('required')) {
                if (!label.textContent.includes('*')) {
                    label.innerHTML += ' <span class="required-indicator" aria-label="required">*</span>';
                }
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous states
    removeFieldStates(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required.`;
    }
    
    // Type-specific validation
    if (value && isValid) {
        switch (field.type) {
            case 'email':
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number (at least 10 digits).';
                }
                break;
                
            case 'url':
                try {
                    new URL(value);
                } catch {
                    isValid = false;
                    errorMessage = 'Please enter a valid URL.';
                }
                break;
        }
        
        // Name validation
        if ((field.name === 'name' || field.id === 'name') && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
        }
        
        // Password validation (if applicable)
        if (field.type === 'password' && value.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters long.';
        }
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.add('success');
        addFieldIcon(field, 'success');
        // Announce success to screen readers
        announceValidationResult(field, 'Valid input');
    } else {
        field.classList.add('error');
        addFieldIcon(field, 'error');
        showErrorMessage(field, errorMessage);
        // Announce error to screen readers
        announceValidationResult(field, errorMessage);
    }
    
    return isValid;
}

function removeFieldStates(field) {
    field.classList.remove('error', 'success');
    removeErrorMessage(field);
    removeFieldIcon(field);
}

function getFieldLabel(field) {
    const label = field.closest('.form-group')?.querySelector('label');
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    return field.placeholder || field.name || 'This field';
}

function addFieldIcon(field, type) {
    removeFieldIcon(field);
    const icon = document.createElement('i');
    icon.className = `fas ${type === 'success' ? 'fa-check' : 'fa-exclamation-circle'} field-icon ${type}-icon`;
    icon.setAttribute('aria-hidden', 'true');
    field.parentNode.appendChild(icon);
}

function removeFieldIcon(field) {
    const existingIcon = field.parentNode.querySelector('.field-icon');
    if (existingIcon) {
        existingIcon.remove();
    }
}

function showErrorMessage(field, message) {
    removeErrorMessage(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'polite');
    
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function announceValidationResult(field, message) {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    
    setTimeout(() => {
        if (document.body.contains(announcer)) {
            document.body.removeChild(announcer);
        }
    }, 1000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    let firstErrorField = null;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
            if (!firstErrorField) {
                firstErrorField = field;
            }
        }
    });
    
    if (!isValid && firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return isValid;
}

// =============================================================================
// FORM SUBMISSION HANDLERS
// =============================================================================

function handleAppointmentSubmission(form) {
    if (!validateForm(form)) return;
    
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    setButtonLoading(submitBtn, 'Booking...');
    
    // Simulate API call - replace with your actual endpoint
    fetch('/api/appointments', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        showNotification('Appointment booked successfully! We will contact you within 2 hours to confirm your appointment.', 'success');
        resetForm(form);
        
        // Track successful booking
        trackEvent('appointment_booking', 'engagement', 'successful_booking');
    })
    .catch(error => {
        console.error('Booking error:', error);
        const phone = document.querySelector('[href^="tel:"]')?.textContent || '+1-234-567-8900';
        showNotification(`Sorry, there was an error booking your appointment. Please call us directly at ${phone} or try again later.`, 'error');
    })
    .finally(() => {
        resetButton(submitBtn, originalText);
    });
}

function handleContactSubmission(form) {
    if (!validateForm(form)) return;
    
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    setButtonLoading(submitBtn, 'Sending...');
    
    // Simulate API call - replace with your actual endpoint
    fetch('/api/contact', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        showNotification('Message sent successfully! We will get back to you within 24 hours.', 'success');
        resetForm(form);
        
        trackEvent('contact_form', 'engagement', 'message_sent');
    })
    .catch(error => {
        console.error('Contact error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
    })
    .finally(() => {
        resetButton(submitBtn, originalText);
    });
}

function handleNewsletterSubmission(form) {
    const emailField = form.querySelector('input[type="email"]');
    const email = emailField.value.trim();
    
    if (!validateField(emailField)) return;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    setButtonLoading(submitBtn, 'Subscribing...');
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Thank you for subscribing to our newsletter! Check your email for confirmation.', 'success');
        form.reset();
        removeFieldStates(emailField);
        resetButton(submitBtn, originalText);
        
        trackEvent('newsletter_signup', 'engagement', 'email_subscription');
    }, 1500);
}

function handleSearch(form) {
    const queryField = form.querySelector('input[name="q"]');
    const query = queryField.value.trim();
    
    if (!query) {
        queryField.focus();
        showNotification('Please enter a search term.', 'error');
        return;
    }
    
    // Redirect to search results page
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
}

// =============================================================================
// FORM UTILITY FUNCTIONS
// =============================================================================

function setButtonLoading(button, text) {
    button.textContent = text;
    button.classList.add('loading');
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
}

function resetButton(button, originalText) {
    button.textContent = originalText;
    button.classList.remove('loading');
    button.disabled = false;
    button.setAttribute('aria-busy', 'false');
}

function resetForm(form) {
    form.reset();
    
    // Clear all validation states
    form.querySelectorAll('.error, .success').forEach(field => {
        removeFieldStates(field);
    });
    
    // Focus first field
    const firstField = form.querySelector('input, textarea, select');
    if (firstField) {
        firstField.focus();
    }
}

// =============================================================================
// TESTIMONIAL SLIDER
// =============================================================================

function initTestimonialSlider() {
    const sliders = document.querySelectorAll('.testimonials-slider');
    
    sliders.forEach(slider => {
        const cards = slider.querySelectorAll('.testimonial-card');
        if (cards.length <= 1) return;
        
        let currentIndex = 0;
        let autoRotateInterval;
        let isPaused = false;
        
        // Create navigation dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        dotsContainer.setAttribute('role', 'tablist');
        dotsContainer.setAttribute('aria-label', 'Testimonial navigation');
        
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            dot.setAttribute('tabindex', index === 0 ? '0' : '-1');
            
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => goToSlide(index));
            dot.addEventListener('keydown', handleDotKeydown);
            
            dotsContainer.appendChild(dot);
        });
        
        slider.parentNode.appendChild(dotsContainer);
        
        // Create previous/next buttons
        const prevBtn = createSliderButton('previous', '‹', () => goToSlide(currentIndex - 1));
        const nextBtn = createSliderButton('next', '›', () => goToSlide(currentIndex + 1));
        
        slider.appendChild(prevBtn);
        slider.appendChild(nextBtn);
        
        function createSliderButton(type, text, onClick) {
            const button = document.createElement('button');
            button.className = `slider-btn slider-btn-${type}`;
            button.textContent = text;
            button.setAttribute('aria-label', `${type} testimonial`);
            button.addEventListener('click', onClick);
            return button;
        }
        
        function goToSlide(index) {
            // Handle wrap around
            if (index < 0) index = cards.length - 1;
            if (index >= cards.length) index = 0;
            
            // Hide current slide
            cards[currentIndex].style.display = 'none';
            cards[currentIndex].setAttribute('aria-hidden', 'true');
            
            // Update dots
            const currentDot = dotsContainer.children[currentIndex];
            const newDot = dotsContainer.children[index];
            
            currentDot.classList.remove('active');
            currentDot.setAttribute('aria-selected', 'false');
            currentDot.setAttribute('tabindex', '-1');
            
            newDot.classList.add('active');
            newDot.setAttribute('aria-selected', 'true');
            newDot.setAttribute('tabindex', '0');
            
            // Show new slide
            currentIndex = index;
            cards[currentIndex].style.display = 'block';
            cards[currentIndex].setAttribute('aria-hidden', 'false');
            
            // Announce change to screen readers
            announceSlideChange(currentIndex, cards.length);
        }
        
        function handleDotKeydown(e) {
            const dots = Array.from(dotsContainer.children);
            const currentDotIndex = dots.indexOf(e.target);
            let targetIndex;
            
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    targetIndex = currentDotIndex > 0 ? currentDotIndex - 1 : dots.length - 1;
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    targetIndex = currentDotIndex < dots.length - 1 ? currentDotIndex + 1 : 0;
                    break;
                case 'Home':
                    targetIndex = 0;
                    break;
                case 'End':
                    targetIndex = dots.length - 1;
                    break;
                default:
                    return;
            }
            
            e.preventDefault();
            dots[targetIndex].focus();
            goToSlide(targetIndex);
        }
        
        // Hide all cards except first
        cards.forEach((card, index) => {
            if (index !== 0) {
                card.style.display = 'none';
                card.setAttribute('aria-hidden', 'true');
            } else {
                card.setAttribute('aria-hidden', 'false');
            }
        });
        
        // Auto-rotate functionality
        function startAutoRotate() {
            if (isPaused) return;
            autoRotateInterval = setInterval(() => {
                if (!isPaused) {
                    goToSlide(currentIndex + 1);
                }
            }, 5000);
        }
        
        function stopAutoRotate() {
            clearInterval(autoRotateInterval);
        }
        
        // Pause on hover/focus
        slider.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoRotate();
        });
        
        slider.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoRotate();
        });
        
        slider.addEventListener('focusin', () => {
            isPaused = true;
            stopAutoRotate();
        });
        
        slider.addEventListener('focusout', () => {
            isPaused = false;
            startAutoRotate();
        });
        
        // Start auto-rotation
        startAutoRotate();
    });
}

function announceSlideChange(currentIndex, totalSlides) {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = `Showing testimonial ${currentIndex + 1} of ${totalSlides}`;
    document.body.appendChild(announcer);
    
    setTimeout(() => {
        if (document.body.contains(announcer)) {
            document.body.removeChild(announcer);
        }
    }, 1000);
}

// =============================================================================
// LAZY LOADING
// =============================================================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(loadImage);
    }
    
    function loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        img.onload = function() {
            img.classList.remove('lazy');
            img.classList.add('loaded');
        };
        
        img.onerror = function() {
            img.classList.add('error');
            console.error('Failed to load image:', src);
        };
        
        img.src = src;
        img.removeAttribute('data-src');
    }
}

// =============================================================================
// SEARCH FUNCTIONALITY
// =============================================================================

function initSearch() {
    const searchInputs = document.querySelectorAll('.search-form input[type="search"]');
    
    searchInputs.forEach(input => {
        let searchTimeout;
        let currentRequest = null;
        
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            // Cancel previous request
            if (currentRequest) {
                currentRequest.abort();
            }
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    showSearchSuggestions(query, this);
                }, 300);
            } else {
                hideSearchSuggestions(this);
            }
        });
        
        // Hide suggestions when field loses focus
        input.addEventListener('blur', function() {
            setTimeout(() => {
                hideSearchSuggestions(this);
            }, 200);
        });
        
        // Keyboard navigation for suggestions
        input.addEventListener('keydown', function(e) {
            const suggestions = this.parentNode.querySelector('.search-suggestions');
            if (!suggestions) return;
            
            const items = suggestions.querySelectorAll('.suggestion-item');
            const currentFocus = suggestions.querySelector('.suggestion-item.focused');
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentFocus) {
                        currentFocus.classList.remove('focused');
                        const next = currentFocus.nextElementSibling || items[0];
                        next.classList.add('focused');
                    } else if (items.length > 0) {
                        items[0].classList.add('focused');
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentFocus) {
                        currentFocus.classList.remove('focused');
                        const prev = currentFocus.previousElementSibling || items[items.length - 1];
                        prev.classList.add('focused');
                    } else if (items.length > 0) {
                        items[items.length - 1].classList.add('focused');
                    }
                    break;
                    
                case 'Enter':
                    if (currentFocus) {
                        e.preventDefault();
                        currentFocus.click();
                    }
                    break;
                    
                case 'Escape':
                    hideSearchSuggestions(this);
                    break;
            }
        });
    });
}

function showSearchSuggestions(query, input) {
    // Sample suggestions - replace with actual search API
    const suggestions = [
        'Dental Cleaning',
        'Teeth Whitening',
        'Root Canal',
        'Dental Implants',
        'Orthodontics',
        'Pediatric Dentistry',
        'Emergency Dental Care',
        'Cosmetic Dentistry',
        'Dental Crowns',
        'Tooth Extraction'
    ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
    
    if (suggestions.length === 0) return;
    
    hideSearchSuggestions(input);
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'search-suggestions';
    suggestionsDiv.setAttribute('role', 'listbox');
    suggestionsDiv.setAttribute('aria-label', 'Search suggestions');
    
    suggestions.slice(0, 6).forEach((suggestion, index) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.setAttribute('role', 'option');
        suggestionItem.setAttribute('aria-selected', 'false');
        suggestionItem.textContent = suggestion;
        
        suggestionItem.addEventListener('click', () => {
            input.value = suggestion;
            hideSearchSuggestions(input);
            input.closest('form').dispatchEvent(new Event('submit'));
        });
        
        suggestionItem.addEventListener('mouseenter', () => {
            // Remove focus from other items
            suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
                item.classList.remove('focused');
            });
            suggestionItem.classList.add('focused');
        });
        
        suggestionsDiv.appendChild(suggestionItem);
    });
    
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(suggestionsDiv);
    input.setAttribute('aria-expanded', 'true');
}

function hideSearchSuggestions(input) {
    const existingSuggestions = input.parentNode.querySelector('.search-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
    input.setAttribute('aria-expanded', 'false');
}

// =============================================================================
// SCROLL ANIMATIONS
// =============================================================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .team-card, .news-card, .post-card, .feature-card, .offer-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// =============================================================================
// SCROLL TO TOP
// =============================================================================

function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.setAttribute('title', 'Scroll to top');
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus on skip link or main heading after scrolling
        setTimeout(() => {
            const target = document.querySelector('.skip-link, h1');
            if (target) {
                target.focus();
            }
        }, 500);
    });
    
    document.body.appendChild(scrollToTopBtn);
}

// =============================================================================
// TABLE OF CONTENTS
// =============================================================================

function initTOC() {
    const tocContainer = document.querySelector('.toc-content');
    const contentArea = document.querySelector('.post-content, .service-article');
    
    if (tocContainer && contentArea) {
        const headings = contentArea.querySelectorAll('h2, h3, h4');
        
        if (headings.length > 0) {
            const tocList = document.createElement('ul');
            tocList.setAttribute('role', 'list');
            
            headings.forEach((heading, index) => {
                // Add ID to heading if it doesn't have one
                if (!heading.id) {
                    heading.id = `heading-${index}`;
                }
                
                const tocItem = document.createElement('li');
                tocItem.setAttribute('role', 'listitem');
                
                const tocLink = document.createElement('a');
                tocLink.href = `#${heading.id}`;
                tocLink.textContent = heading.textContent;
                tocLink.className = `toc-${heading.tagName.toLowerCase()}`;
                
                // Add click tracking
                tocLink.addEventListener('click', () => {
                    trackEvent('toc_navigation', 'engagement', heading.textContent);
                });
                
                tocItem.appendChild(tocLink);
                tocList.appendChild(tocItem);
            });
            
            tocContainer.appendChild(tocList);
            
            // Highlight current section on scroll
            initTOCHighlighting(headings);
        } else {
            // Hide TOC if no headings
            const tocWidget = tocContainer.closest('.sidebar-widget');
            if (tocWidget) {
                tocWidget.style.display = 'none';
            }
        }
    }
}

function initTOCHighlighting(headings) {
    const tocLinks = document.querySelectorAll('.toc-content a');
    
    if ('IntersectionObserver' in window && tocLinks.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const tocLink = document.querySelector(`.toc-content a[href="#${id}"]`);
                
                if (tocLink) {
                    if (entry.isIntersecting) {
                        // Remove active class from all links
                        tocLinks.forEach(link => link.classList.remove('active'));
                        // Add active class to current link
                        tocLink.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: '-20% 0px -60% 0px'
        });
        
        headings.forEach(heading => observer.observe(heading));
    }
}

// =============================================================================
// CONTACT MAP
// =============================================================================

function initContactMap() {
    const mapContainer = document.querySelector('.map-placeholder');
    if (mapContainer) {
        // Improve mobile experience
        mapContainer.addEventListener('click', function() {
            this.style.pointerEvents = 'auto';
        });
        
        // Add keyboard support
        mapContainer.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.style.pointerEvents = 'auto';
                this.focus();
            }
        });
    }
}

// =============================================================================
// SCROLL HANDLER
// =============================================================================

function handleScroll() {
    const header = document.querySelector('.main-header');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const scrollY = window.pageYOffset;
    
    // Sticky header
    if (scrollY > 100) {
        header?.classList.add('scrolled');
        scrollToTopBtn?.classList.add('visible');
    } else {
        header?.classList.remove('scrolled');
        scrollToTopBtn?.classList.remove('visible');
    }
    
    // Update scroll progress for long pages
    updateScrollProgress();
}

function updateScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
}

// =============================================================================
// RESIZE HANDLER
// =============================================================================

function handleResize() {
    // Reinitialize dropdowns for screen size changes
    if (window.innerWidth > 768) {
        // Close mobile menu if open
        const mobileNav = document.querySelector('.main-navigation.mobile-active');
        const menuToggle = document.querySelector('.mobile-menu-toggle.active');
        
        if (mobileNav && menuToggle) {
            menuToggle.click();
        }
    }
    
    // Update mobile-specific functionality
    updateMobileFeatures();
}

function updateMobileFeatures() {
    const isMobile = window.innerWidth <= 768;
    const searchInputs = document.querySelectorAll('.search-form input');
    
    searchInputs.forEach(input => {
        if (isMobile) {
            input.style.width = '120px';
        } else {
            input.style.width = '';
        }
    });
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        setTimeout(() => {
            if ('performance' in window) {
                const performanceEntries = performance.getEntriesByType('navigation')[0];
                if (performanceEntries) {
                    const loadTime = performanceEntries.loadEventEnd - performanceEntries.loadEventStart;
                    console.log(`Page load time: ${loadTime}ms`);
                    
                    // Track slow loading pages
                    if (loadTime > 3000) {
                        console.warn('Slow page load detected');
                        trackEvent('performance', 'slow_load', Math.round(loadTime));
                    }
                }
            }
        }, 0);
    });
    
    // Monitor viewport size for analytics
    trackViewportSize();
}

function trackViewportSize() {
    const width = window.innerWidth;
    let deviceType = 'desktop';
    
    if (width < 768) {
        deviceType = 'mobile';
    } else if (width < 1024) {
        deviceType = 'tablet';
    }
    
    trackEvent('viewport', 'device_type', deviceType);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

function trackEvent(action, category, label) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Alternative analytics can be added here
    console.log('Event tracked:', { action, category, label });
}

function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${iconMap[type]} notification-icon" aria-hidden="true"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after specified duration
    setTimeout(() => {
        if (document.body.contains(notification)) {
            removeNotification(notification);
        }
    }, duration);
    
    function removeNotification(notif) {
        notif.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notif)) {
                document.body.removeChild(notif);
            }
        }, 300);
    }
}

// =============================================================================
// CSS INJECTION (Dynamic Styles)
// =============================================================================

function injectDynamicStyles() {
    const styles = `
        /* Screen reader only content */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        /* Keyboard navigation focus */
        .keyboard-navigation *:focus {
            outline: 2px solid #007bff !important;
            outline-offset: 2px !important;
        }

        /* Form validation styles */
        .field-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            pointer-events: none;
            z-index: 1;
        }

        .success-icon { color: #28a745; }
        .error-icon { color: #dc3545; }

        .form-group { position: relative; }

        .form-group input.success,
        .form-group textarea.success {
            border-color: #28a745;
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
        }

        .required-indicator {
            color: #dc3545;
            font-weight: bold;
        }

        /* Notification styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            z-index: 9999;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease-out;
        }

        .notification-success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .notification-error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        .notification-warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
        .notification-info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }

        .notification-content {
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .notification-message { flex: 1; }

        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
            margin-left: 10px;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }

        .notification-close:hover { opacity: 1; }

        /* Lazy loading styles */
        .lazy {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .lazy.loaded { opacity: 1; }
        .lazy.error { opacity: 0.5; filter: grayscale(100%); }

        /* Search suggestions */
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 8px 8px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .suggestion-item {
            padding: 12px 15px;
            cursor: pointer;
            border-bottom: 1px solid #f8f9fa;
            transition: all 0.3s ease;
        }

        .suggestion-item:hover,
        .suggestion-item.focused {
            background: #f8f9fa;
            color: #007bff;
        }

        .suggestion-item:last-child { border-bottom: none; }

        /* Slider enhancements */
        .slider-dots {
            text-align: center;
            margin-top: 30px;
        }

        .slider-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background: #ddd;
            margin: 0 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .slider-dot.active,
        .slider-dot:hover,
        .slider-dot:focus {
            background: #007bff;
            transform: scale(1.2);
        }

        .slider-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            z-index: 2;
            transition: all 0.3s ease;
        }

        .slider-btn:hover { background: rgba(0,0,0,0.7); }
        .slider-btn-previous { left: 10px; }
        .slider-btn-next { right: 10px; }

        /* TOC highlighting */
        .toc-content a.active {
            color: #007bff;
            font-weight: 600;
        }

        /* Mobile menu body lock */
        .mobile-menu-open {
            overflow: hidden;
        }

        /* Scroll progress bar */
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: #007bff;
            z-index: 9999;
            transition: width 0.3s ease;
        }

        /* Animation keyframes */
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile specific styles */
        @media (max-width: 480px) {
            .notification {
                left: 10px;
                right: 10px;
                max-width: none;
                top: 10px;
            }

            .slider-btn {
                width: 35px;
                height: 35px;
                font-size: 16px;
            }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .notification,
            .lazy,
            .slider-dot,
            .suggestion-item,
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initialize dynamic styles
injectDynamicStyles();

// =============================================================================
// ERROR HANDLING
// =============================================================================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', 'error', e.error?.message || 'Unknown error');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    trackEvent('promise_rejection', 'error', e.reason?.message || 'Unknown rejection');
});

// =============================================================================
// INITIALIZATION COMPLETE
// =============================================================================

console.log('StarDentic theme JavaScript initialized successfully');