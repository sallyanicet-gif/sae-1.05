/* ===================================
   MARËIS - JavaScript
   Theme persistence & Navigation
   =================================== */

// ===================================
// IMMEDIATELY: Apply theme BEFORE DOM loads (no flash)
// ===================================
(function() {
    // Get saved theme from BOTH possible keys (for compatibility)
    const savedTheme = localStorage.getItem('mareis-theme') || localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeToApply = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', themeToApply);
    
    // Save with both keys for compatibility
    localStorage.setItem('mareis-theme', themeToApply);
    localStorage.setItem('theme', themeToApply);
})();

// ===================================
// Wait for DOM
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('DOM loaded - MARËIS script starting');
    
    // ===================================
    // Theme Toggle - Dark/Light Mode
    // ===================================
    const themeToggle = document.getElementById('theme-toggle');
    
    console.log('Theme toggle button found:', !!themeToggle);
    
    if (themeToggle) {
        // Update button label based on current theme
        const updateThemeLabel = function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const isEnglish = document.documentElement.lang === 'en';
            
            if (currentTheme === 'dark') {
                themeToggle.setAttribute('aria-label', isEnglish ? 'Switch to light mode' : 'Activer le mode clair');
            } else {
                themeToggle.setAttribute('aria-label', isEnglish ? 'Switch to dark mode' : 'Activer le mode sombre');
            }
        };
        
        // Set initial label
        updateThemeLabel();
        
        // Handle click
        themeToggle.addEventListener('click', function(e) {
            console.log('Theme toggle clicked!');
            
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log('Changing theme from', currentTheme, 'to', newTheme);
            
            // Apply new theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save to localStorage with BOTH keys
            localStorage.setItem('mareis-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update label
            updateThemeLabel();
            
            console.log('Theme changed successfully to:', newTheme);
        });
        
        console.log('Theme toggle event listener attached');
    } else {
        console.error('Theme toggle button NOT FOUND!');
    }
    
    // ===================================
    // Active Navigation Link
    // ===================================
    const setActiveNavLink = function() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        console.log('Current page:', currentPage);
        
        navLinks.forEach(link => {
            // Remove existing active class
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            // Get the href filename
            const linkPage = link.getAttribute('href').split('/').pop();
            
            // Check if this link matches current page
            if (linkPage === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                console.log('Active link set:', linkPage);
            }
        });
    };
    
    // Set active link on page load
    setActiveNavLink();
    
    // ===================================
    // Mobile Navigation Toggle
    // ===================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            const isActive = navLinks.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isActive);
            
            // Burger animation
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (isActive) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
    
    // ===================================
    // Header Shadow on Scroll
    // ===================================
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                header.style.boxShadow = '0 4px 20px rgba(10, 61, 92, 0.15)';
            } else {
                header.style.boxShadow = '0 4px 20px rgba(10, 61, 92, 0.1)';
            }
        });
    }
    
    // ===================================
    // Scroll Animations (Intersection Observer)
    // ===================================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.action-card, .stat-item, .join-card, .news-card, .about-content, .about-image, .value-card, .context-card, .team-card, .program-card, .event-card, .hours-card, .pricing-card, .faq-item, .contact-card');
        
        if (elements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };
    
    animateOnScroll();
    
    // ===================================
    // Number Counter Animation
    // ===================================
    const animateNumbers = function() {
        const numbers = document.querySelectorAll('.stat-number');
        
        if (numbers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalNumber = parseInt(target.textContent.replace(/\D/g, ''));
                    const suffix = target.textContent.replace(/[0-9]/g, '');
                    let current = 0;
                    const increment = finalNumber / 50;
                    const stepTime = 40;
                    
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= finalNumber) {
                            target.textContent = finalNumber + suffix;
                            clearInterval(counter);
                        } else {
                            target.textContent = Math.floor(current) + suffix;
                        }
                    }, stepTime);
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        numbers.forEach(num => observer.observe(num));
    };
    
    animateNumbers();
    
    // ===================================
    // Smooth Scroll for Anchors
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===================================
    // Hero Parallax Effect
    // ===================================
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }
        });
    }
    
    // ===================================
    // Contact Form Handling
    // ===================================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                const isEnglish = document.documentElement.lang === 'en';
                
                submitBtn.textContent = isEnglish ? 'Sending...' : 'Envoi en cours...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    const message = isEnglish 
                        ? 'Thank you for your message! We will respond as soon as possible.'
                        : 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.';
                    alert(message);
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }
    
    // ===================================
    // FAQ Accordion (if present)
    // ===================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // Open clicked item if it wasn't open
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // ===================================
    // Tabs Navigation (Nos Actions page)
    // ===================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Update buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Update panels
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.setAttribute('hidden', '');
                });
                
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    targetPanel.removeAttribute('hidden');
                }
            });
        });
    }
    
    console.log('MARËIS script fully loaded');
    
});