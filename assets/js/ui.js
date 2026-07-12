// UI Utilities
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  
  reveals.forEach(el => observer.observe(el));
}

// Run on load
document.addEventListener('DOMContentLoaded', initScrollReveal);