/**
 * Scroll-Based Animations Module
 * Handles intersection observer for scroll animations and parallax effects
 */

class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.parallaxElements = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupIntersectionObserver();
        this.setupParallax();
        this.addScrollListener();
        this.enhanceExistingElements();
    }

    /**
     * Setup Intersection Observer for scroll animations
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optionally unobserve after animation
                    // this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all elements with scroll-animate class
        this.observeElements();
    }

    /**
     * Observe elements for scroll animations
     */
    observeElements() {
        const elements = document.querySelectorAll('.scroll-animate');
        elements.forEach(el => {
            this.observer.observe(el);
            this.elements.push(el);
        });
    }

    /**
     * Setup parallax effects
     */
    setupParallax() {
        this.parallaxElements = Array.from(document.querySelectorAll('.parallax-bg'));
    }

    /**
     * Add scroll listener for parallax
     */
    addScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Handle parallax effect on scroll
     */
    handleParallax() {
        const scrolled = window.pageYOffset;

        this.parallaxElements.forEach(el => {
            const speed = el.dataset.parallaxSpeed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    /**
     * Enhance existing elements with animation classes
     */
    enhanceExistingElements() {
        // Add animations to sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (!section.classList.contains('scroll-animate')) {
                section.classList.add('scroll-animate', 'fade-in-up');
                if (index % 2 === 0) {
                    section.classList.add('stagger-1');
                }
            }
        });

        // Add animations to cards
        const cards = document.querySelectorAll('.card, .test-card, .learning-card, .profile-card');
        cards.forEach((card, index) => {
            if (!card.classList.contains('enhanced-card')) {
                card.classList.add('enhanced-card', 'smooth-hover');
            }
        });

        // Add hover effects to buttons
        const buttons = document.querySelectorAll('button, .btn, .test-button');
        buttons.forEach(btn => {
            if (!btn.classList.contains('button-hover-effect')) {
                btn.classList.add('button-hover-effect', 'ripple');
            }
        });

        // Re-observe new elements
        this.observeElements();
    }

    /**
     * Manually trigger animation for specific element
     */
    animateElement(element, animationType = 'fade-in-up') {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            element.classList.add('scroll-animate', animationType);
            this.observer.observe(element);
        }
    }

    /**
     * Add stagger delay to a group of elements
     */
    staggerElements(selector, baseDelay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.transitionDelay = `${baseDelay * index}ms`;
        });
    }

    /**
     * Smooth scroll to element
     */
    scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Add entrance animation to dynamically created elements
     */
    animateNewElement(element, animation = 'fade-in-up') {
        element.classList.add('scroll-animate', animation);
        
        // Trigger reflow
        void element.offsetWidth;
        
        // Add active class with slight delay
        setTimeout(() => {
            element.classList.add('active');
        }, 50);
    }

    /**
     * Create notification with animation
     */
    createAnimatedNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} scroll-animate fade-in-down`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
        `;
        
        document.body.appendChild(notification);
        this.animateNewElement(notification, 'fade-in-down');
        
        setTimeout(() => {
            notification.classList.remove('active');
            notification.classList.add('fade-in-up');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.elements = [];
        this.parallaxElements = [];
    }
}

// Initialize when ready
const scrollAnimations = new ScrollAnimations();

// Expose globally for access from other scripts
window.scrollAnimations = scrollAnimations;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollAnimations;
}
