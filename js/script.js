// Helper function to scroll to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    // Set active nav link based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes('#')) {
                const id = href.split('#')[1];
                if (id === current) {
                    link.classList.add('active');
                }
            }
        });
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const formMessage = document.getElementById('formMessage');

            // Simple validation
            if (name && email && subject && message) {
                // Show success message
                formMessage.textContent = '✓ Thank you for your message! We will get back to you soon.';
                formMessage.classList.add('success');
                formMessage.classList.remove('error');
                
                // Reset form
                contactForm.reset();
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formMessage.classList.remove('success');
                }, 5000);
            } else {
                formMessage.textContent = '⚠ Please fill in all fields.';
                formMessage.classList.add('error');
                formMessage.classList.remove('success');
            }
        });
    }

    // Newsletter subscription
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            if (input && input.value) {
                alert('Thank you for subscribing! Check your email for confirmation.');
                input.value = '';
            }
        });
    });

    // Navbar shadow on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.pageYOffset > 100) {
            navbar.style.boxShadow = '0 5px 30px rgba(233, 30, 99, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(233, 30, 99, 0.1)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('.article-card, .value-card, .stat-item, .testimonial-card, .info-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Animate numbers
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            if (!num.classList.contains('animated')) {
                let count = 0;
                const increment = target / 30;
                
                const counter = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        num.textContent = target + '+';
                        clearInterval(counter);
                        num.classList.add('animated');
                    } else {
                        num.textContent = Math.floor(count);
                    }
                }, 50);
            }
        });
    };

    // Trigger number animation when section is visible
    const statsSection = document.querySelector('.statistics-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        statsObserver.observe(statsSection);
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
