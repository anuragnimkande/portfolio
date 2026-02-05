// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const backToTop = document.getElementById('backToTop');
const toast = document.getElementById('toast');
const profileImage = document.getElementById('profileImage');

// ===========================================
// Theme Management
// ===========================================

// Initialize theme from localStorage or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
  
  // Add animation effect
  themeToggle.style.transform = 'scale(1.1)';
  setTimeout(() => {
    themeToggle.style.transform = 'scale(1)';
  }, 200);
});

// Update theme icon based on current theme
function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===========================================
// Mobile Navigation
// ===========================================

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  mobileToggle.innerHTML = navLinks.classList.contains('active') 
    ? '<i class="fas fa-times"></i>' 
    : '<i class="fas fa-bars"></i>';
  
  // Toggle aria-expanded for accessibility
  const isExpanded = navLinks.classList.contains('active');
  mobileToggle.setAttribute('aria-expanded', isExpanded);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 576) {
      navLinks.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// ===========================================
// Smooth Scrolling
// ===========================================

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Calculate header height for offset
      const headerHeight = document.querySelector('nav').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update active nav link
      updateActiveNavLink(this);
    }
  });
});

// Update active nav link based on scroll position
function updateActiveNavLink(clickedLink = null) {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (clickedLink) {
    // If link was clicked, update based on clicked link
    navLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
  } else {
    // Update based on scroll position
    let current = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
}

// ===========================================
// Back to Top Button
// ===========================================

// Show/hide back to top button
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.style.display = 'flex';
  } else {
    backToTop.style.display = 'none';
  }
});

// Scroll to top functionality
backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ===========================================
// Contact Form
// ===========================================

// Form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
    timestamp: new Date().toISOString()
  };
  
  // Show loading state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;
  
  try {
    // Simulate API call (replace with actual API endpoint)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log form data (in production, send to backend)
    console.log('Form submitted:', formData);
    
    // Show success message
    showToast('Message sent successfully!');
    
    // Reset form
    contactForm.reset();
    
  } catch (error) {
    console.error('Error submitting form:', error);
    showToast('Failed to send message. Please try again.', 'error');
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Toast notification
function showToast(message, type = 'success') {
  const toastIcon = toast.querySelector('.toast-icon');
  const toastMessage = toast.querySelector('.toast-message');
  
  // Update toast content
  toastMessage.textContent = message;
  
  // Update icon based on type
  if (type === 'error') {
    toastIcon.className = 'fas fa-exclamation-circle toast-icon';
    toastIcon.style.color = '#ef4444';
  } else {
    toastIcon.className = 'fas fa-check-circle toast-icon';
    toastIcon.style.color = '#10b981';
  }
  
  // Show toast
  toast.classList.add('show');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===========================================
// Animations and Effects
// ===========================================

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.section-header, .card, .project-card, .contact-card, .timeline-item, .skills-category, .education-card').forEach(el => {
  observer.observe(el);
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  const currentScroll = window.pageYOffset;
  
  // Add shadow when scrolled
  if (currentScroll > 50) {
    nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  } else {
    nav.style.boxShadow = 'none';
  }
  
  // Hide/show navbar on scroll (optional)
  if (currentScroll > lastScroll && currentScroll > 100) {
    nav.style.transform = 'translateY(-100%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }
  
  lastScroll = currentScroll;
  
  // Update active nav link based on scroll
  updateActiveNavLink();
});

// ===========================================
// Profile Picture Upload (Optional)
// ===========================================

// Enable profile picture upload (uncomment to enable)
/*
profileImage.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        profileImage.src = event.target.result;
        
        // Save to localStorage
        localStorage.setItem('profileImage', event.target.result);
        
        showToast('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };
  
  input.click();
});

// Load saved profile picture from localStorage
const savedProfileImage = localStorage.getItem('profileImage');
if (savedProfileImage) {
  profileImage.src = savedProfileImage;
}
*/

// ===========================================
// Skills Progress Animation
// ===========================================

// Animate skill bars when they come into view
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBars = entry.target.querySelectorAll('.skill-progress');
      progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
          bar.style.transition = 'width 1.5s ease-in-out';
          bar.style.width = width;
        }, 300);
      });
    }
  });
}, { threshold: 0.5 });

// Observe skills containers
document.querySelectorAll('.skills-category').forEach(category => {
  skillObserver.observe(category);
});

// ===========================================
// Initialize on DOM Load
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio website loaded successfully!');
  
  // Initialize active nav link
  updateActiveNavLink();
  
  // Add hover effect to project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
  
  // Add keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Focus trap for mobile menu
    if (e.key === 'Tab' && navLinks.classList.contains('active')) {
      const focusableElements = navLinks.querySelectorAll('a, button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
});

// ===========================================
// Performance Optimization
// ===========================================

// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // Update active nav link with debounce
    updateActiveNavLink();
  }, 100);
});

// Lazy load images (if you add more images)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}