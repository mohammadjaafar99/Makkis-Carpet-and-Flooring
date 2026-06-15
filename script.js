/**
 * Makki's Carpet & Flooring - Premium Luxury Interactions Script
 * Bespoke Agency-Grade Vanilla Javascript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  emailjs.init("viq1wSgQkyrM7Gudm");
  // Initialize lucide icons if loaded from CDN
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Initialize all core engines
  initCustomCursor();
  initPreloader();
  initScrollAnimations();
  initStatsCounters();
  initBeforeAfterSlider();
  initTestimonialsSlider();
  initTiltCards();
  initPortfolioFilters();
  initContactForm();
  initMobileMenu();
  initCanvasParticles();
  initBackToTop();
});

/* ==========================================================================
   1. Dynamic Custom Cursor
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  const speed = 0.15; // Delay multiplier for smooth lag

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot instantly
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Animate outline with follow-lag
  function animateOutline() {
    const distX = mouseX - outlineX;
    const distY = mouseY - outlineY;
    
    outlineX += distX * speed;
    outlineY += distY * speed;
    
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Highlight cursor on premium clickable targets
  const interactiveSelector = 'a, button, .filter-btn, .service-card, .area-card, .portfolio-item, .ba-handle';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('custom-cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('custom-cursor-hover');
    });
  });
}

/* ==========================================================================
   2. Preloader Animation
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  
  const fadeOut = () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 1200);
  };

  if (document.readyState === 'complete') {
    fadeOut();
  } else {
    window.addEventListener('load', fadeOut);
  }
}

/* ==========================================================================
   3. Back To Top Component
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   4. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  // Toggle Header styles on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Reveal triggers
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .scale-on-scroll, .reveal-group');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to monitor again
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   5. Scroll-Triggered Animated Stats Counters
   ========================================================================== */
function initStatsCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length === 0) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetNum = parseInt(target.getAttribute('data-target'), 10);
        let currentNum = 0;
        const duration = 2000; // 2 seconds total animation
        const steps = 60;
        const increment = targetNum / steps;
        const stepTime = duration / steps;
        
        const counterInterval = setInterval(() => {
          currentNum += increment;
          if (currentNum >= targetNum) {
            target.textContent = targetNum;
            clearInterval(counterInterval);
          } else {
            target.textContent = Math.floor(currentNum);
          }
        }, stepTime);

        observer.unobserve(target);
      }
    });
  }, {
    threshold: 0.5
  });

  statNums.forEach(num => counterObserver.observe(num));
}

/* ==========================================================================
   6. Before and After Image comparator
   ========================================================================== */
function initBeforeAfterSlider() {
  const showcases = document.querySelectorAll('.ba-showcase');
  if (showcases.length === 0) return;

  showcases.forEach(showcase => {
    const wrapper = showcase.querySelector('.ba-wrapper');
    const afterImgContainer = showcase.querySelector('.ba-after');
    const handle = showcase.querySelector('.ba-handle');
    
    if (!wrapper || !afterImgContainer || !handle) return;

    let isDragging = false;

    function moveSlider(clientX) {
      const rect = wrapper.getBoundingClientRect();
      const positionX = clientX - rect.left;
      let percentage = (positionX / rect.width) * 100;
      
      // Bounds boundaries
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      
      afterImgContainer.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
      
      alignImageWidths();
    }

    function alignImageWidths() {
      const rect = wrapper.getBoundingClientRect();
      const images = wrapper.querySelectorAll('.ba-img-container img');
      images.forEach(img => {
        img.style.width = `${rect.width}px`;
        img.style.maxWidth = 'none';
      });
    }

    // Initialize widths and listen to resizing
    alignImageWidths();
    window.addEventListener('resize', alignImageWidths);
    setTimeout(alignImageWidths, 300); // delay alignment in case layout shifted on load

    // Mouse drag handlers
    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    // Touch handlers
    handle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches[0]) {
        moveSlider(e.touches[0].clientX);
      }
    });

    // Click direct move
    wrapper.addEventListener('click', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      moveSlider(e.clientX);
    });
  });
}

/* ==========================================================================
   7. Customer Testimonials Slider Carousel
   ========================================================================== */
function initTestimonialsSlider() {
  const track = document.querySelector('.slider-track');
  const dotsContainer = document.querySelector('.slider-dots');
  
  if (!track || !dotsContainer) return;

  const slides = Array.from(track.children);
  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  // Render dots indicators
  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to testimonial slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function goToSlide(index) {
    // Reset range bounds
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Toggle dot state
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    resetAutoplay();
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }

  function resetAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
    startAutoplay();
  }

  // Interactive swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    if (touchStartX - touchEndX > threshold) {
      goToSlide(currentIndex + 1); // Left swipe -> next
    } else if (touchEndX - touchStartX > threshold) {
      goToSlide(currentIndex - 1); // Right swipe -> prev
    }
  }

  // Set-off cycle
  startAutoplay();
}

/* ==========================================================================
   8. Luxury 3D Card Hover-Tilt Effect
   ========================================================================== */
function initTiltCards() {
  const tiltCards = document.querySelectorAll('.service-card, .area-card, .contact-card');
  
  if (window.innerWidth <= 1024) return; // Skip on touch/tablet platforms for ergonomic reasons

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside element
      const y = e.clientY - rect.top;  // y coordinate inside element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate incline ratio (-10deg to 10deg range)
      const rotateX = -(y - centerY) / (centerY / 8); 
      const rotateY = (x - centerX) / (centerX / 8);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   9. Masonry Category Filters (Portfolio)
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  
  if (filterBtns.length === 0 || items.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active designator
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      items.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          // Transition entry
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Hide transition
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 350);
        }
      });
    });
  });
}

/* ==========================================================================
   10. Custom Luxury Floating Particles background
   ========================================================================== */
function initCanvasParticles() {
  const container = document.getElementById('particles-js');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let numberOfParticles = 70;

  // Gold theme color values
  const colors = [
    'rgba(197, 168, 128, 0.1)',
    'rgba(229, 204, 170, 0.15)',
    'rgba(161, 130, 86, 0.08)',
    'rgba(218, 165, 32, 0.06)'
  ];

  // Adjust coordinates on resize
  function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 4 + 1; // Subtle small floating dots
      this.speedX = Math.random() * 0.4 - 0.2; // Slow sideways drift
      this.speedY = Math.random() * -0.6 - 0.1; // Gentle upwards float
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Handle wrapping of particles
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
      if (this.x < 0 || this.x > canvas.width) {
        this.x = Math.random() * canvas.width;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

/* ==========================================================================
   11. Contact Form Submit Interactions (With visual indicators)
   ========================================================================== */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const feedback = document.querySelector('.contact-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const email = form.querySelector('[name="email"]').value;
    const location = form.querySelector('[name="location"]')?.value || '';
    const message = form.querySelector('[name="message"]').value;

    if (!name || !phone || !email) {
      feedback.textContent = "Please fill out required fields.";
      feedback.style.color = "#ff6b6b";
      feedback.style.display = "block";
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "SENDING...";

    emailjs.send("service_wpqe6bj", "template_a0abthu", {
      name,
      phone,
      email,
      location,
      message
    })
    .then(() => {
      feedback.textContent = "Message sent successfully!";
      feedback.style.color = "#2ed573";
      feedback.style.display = "block";
      form.reset();
    })
    .catch(() => {
      feedback.textContent = "Failed to send message.";
      feedback.style.color = "#ff6b6b";
      feedback.style.display = "block";
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
  });
}