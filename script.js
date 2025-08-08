// Global Variables
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
let slideInterval;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeHeroSlideshow();
    initializeGallery();
    initializeContactForm();
    initializeAnimations();
});

// Navigation Functions
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
            // Toggle body class to prevent scrolling when menu is open
            document.body.classList.toggle('mobile-menu-open');
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('show');
                document.body.classList.remove('mobile-menu-open');
            });
        });
        
        // Close mobile menu with close button
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                mobileMenu.classList.remove('show');
                document.body.classList.remove('mobile-menu-open');
            });
        }
    }
    
    // Navbar scroll effect (only for home page)
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Hero Slideshow Functions
function initializeHeroSlideshow() {
    if (!slides.length) return;
    
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    
    // Start automatic slideshow
    startSlideshow();
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopSlideshow();
            previousSlide();
            startSlideshow();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopSlideshow();
            nextSlide();
            startSlideshow();
        });
    }
    
    // Indicator buttons
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopSlideshow();
            goToSlide(index);
            startSlideshow();
        });
    });
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 6000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlides();
}

function updateSlides() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Gallery Functions
function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Add animation on scroll
    observeGalleryItems();
}

function observeGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    galleryItems.forEach(item => {
        item.classList.add('fade-in');
        observer.observe(item);
    });
}

// Lightbox Functions
function openLightbox(imageSrc, title, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    
    if (lightbox && lightboxImage && lightboxTitle && lightboxDescription) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = title;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Before/After Slider
const sliders = document.querySelectorAll('.before-after-slider');
sliders.forEach(slider => {
    const before = slider.querySelector('.before');
    const sliderInput = slider.querySelector('.slider');
    
    sliderInput.addEventListener('input', (e) => {
        before.style.width = e.target.value + '%';
    });
});
// Close lightbox when clicking outside the content
document.addEventListener('click', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Contact Form Functions
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showNotification('Thank you for your message! We will get back to you soon.', 'success');
                    this.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            showNotification(data["errors"].map(error => error["message"]).join(", "), 'error');
                        } else {
                            showNotification('Oops! There was a problem submitting your form', 'error');
                        }
                    })
                }
            }).catch(error => {
                showNotification('Oops! There was a problem submitting your form', 'error');
            });
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 600;
        z-index: 9999;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;
    
    if (type === 'success') {
        notification.style.background = '#10B981';
    } else {
        notification.style.background = '#EF4444';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Animation Functions
function initializeAnimations() {
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.value-item, .stat-item, .team-member, .service-card, .benefit-item, .process-step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some interactive features
// document.addEventListener('mousemove', debounce(function(e) {
//     // Add subtle parallax effect to hero section
//     const hero = document.querySelector('.hero-section');
//     if (hero && window.scrollY < window.innerHeight) {
//         const mouseX = e.clientX / window.innerWidth;
//         const mouseY = e.clientY / window.innerHeight;
        
//         const slides = hero.querySelectorAll('.hero-slide');
//         slides.forEach(slide => {
//             const offsetX = (mouseX - 0.5) * 20;
//             const offsetY = (mouseY - 0.5) * 20;
//             slide.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
//         });
//     }
// }, 16));

// Loading animation
// window.addEventListener('load', function() {
//     const preloader = document.querySelector('.preloader');
//     if (preloader) {
//         preloader.classList.add('fade-out');
//         setTimeout(() => {
//             preloader.style.display = 'none';
//         }, 500);
//     }


 
    
//     document.body.classList.add('loaded');
    
//     // Trigger initial animations
//     const initialElements = document.querySelectorAll('.fade-in');
//     initialElements.forEach((element, index) => {
//         setTimeout(() => {
//             if (isElementInViewport(element)) {
//                 element.classList.add('visible');
//             }
//         }, index * 100);
//     });
// });

   window.addEventListener('load', function() {
            const preloader = document.querySelector('.preloader');
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1500);
    });




// // Gallery Load More Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const hiddenItems = document.querySelectorAll('.gallery-item.hidden-item');
    let itemsToShow = 6; // Number of items to reveal per click

    if (loadMoreBtn && hiddenItems.length > 0) {
        loadMoreBtn.addEventListener('click', function() {
            // Show the next batch of hidden items
            const itemsLeft = hiddenItems.length;
            const nextItems = Math.min(itemsToShow, itemsLeft);

            for (let i = 0; i < nextItems; i++) {
                if (hiddenItems[i]) {
                    hiddenItems[i].classList.remove('hidden-item');
                }
            }

            // Hide button if no more items left
            const remainingItems = document.querySelectorAll('.gallery-item.hidden-item');
            if (remainingItems.length === 0) {
                loadMoreBtn.style.display = 'none';
            }
        });
    } else if (loadMoreBtn && hiddenItems.length === 0) {
        // Hide button if no hidden items exist
        loadMoreBtn.style.display = 'none';
    }
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
