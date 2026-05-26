/**
 * PreciRel Vaimanik Solutions - Client Side Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // STICKY HEADER & SCROLL HANDLING
  // ==========================================================================
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  };

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });


  // ==========================================================================
  // COMPACT RFQ WIDGET - DRAG AND DROP FILE UPLOAD
  // ==========================================================================
  const uploadZone = document.getElementById('rfq-upload-zone');
  const fileInput = document.getElementById('rfq-file');
  const filePreview = document.getElementById('rfq-file-preview');
  const fileNameDisplay = document.getElementById('rfq-file-name');
  const fileRemoveBtn = document.getElementById('rfq-file-remove');

  // Prevent defaults for drag-and-drop events
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Highlight upload zone on dragover
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadZone.addEventListener(eventName, () => {
      uploadZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, () => {
      uploadZone.classList.remove('dragover');
    }, false);
  });

  // Handle dropped files
  uploadZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  });

  // Handle file select via browse dialog
  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  });

  function handleFiles(files) {
    const file = files[0];
    const allowedExtensions = /(\.pdf|\.dxf|\.step|\.stp|\.igs|\.png|\.jpg|\.jpeg)$/i;
    
    if (!allowedExtensions.exec(file.name)) {
      showToast('Invalid File Type', 'Please upload PDF, DXF, STEP, IGS, or PNG drawings.', true);
      clearFileSelection();
      return;
    }

    // Standardize file size formatting
    let sizeStr = '';
    if (file.size > 1024 * 1024) {
      sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
    }

    fileNameDisplay.textContent = `${file.name} (${sizeStr})`;
    filePreview.style.display = 'flex';
    uploadZone.style.display = 'none';
  }

  function clearFileSelection() {
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    filePreview.style.display = 'none';
    uploadZone.style.display = 'block';
  }

  fileRemoveBtn.addEventListener('click', clearFileSelection);


  // ==========================================================================
  // CATALOG FILTERING
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const catalogGrid = document.getElementById('catalog-grid');
  const catalogCards = document.querySelectorAll('.catalog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all filter buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter catalog cards
      catalogCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Add fade out animation first, then display
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // ==========================================================================
  // SELECTION INTERACTION (LINK CATALOG TO RFQ)
  // ==========================================================================
  const catalogQuoteBtns = document.querySelectorAll('.catalog-btn');
  const rfqMaterialSelect = document.getElementById('rfq-material');
  const rfqQtyInput = document.getElementById('rfq-qty');

  catalogQuoteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const componentName = btn.getAttribute('data-component');
      
      // Auto-fill material select based on the catalog choice
      if (componentName.includes('Titanium')) {
        rfqMaterialSelect.value = 'titanium-gr5';
      } else if (componentName.includes('Inconel')) {
        rfqMaterialSelect.value = 'inconel-718';
      } else if (componentName.includes('Hammellc')) {
        rfqMaterialSelect.value = 'alloy-4140';
      } else if (componentName.includes('Socket')) {
        rfqMaterialSelect.value = 'ss-316';
      } else {
        rfqMaterialSelect.value = 'other';
      }

      // Default quantity helper
      if (!rfqQtyInput.value) {
        rfqQtyInput.value = '100'; // Standard procurement test quantity
      }

      // Smooth scroll to the RFQ widget (which is part of the hero grid)
      const rfqWidget = document.getElementById('rfq-widget');
      window.scrollTo({
        top: rfqWidget.getBoundingClientRect().top + window.scrollY - 120,
        behavior: 'smooth'
      });

      // Visual pulse effect to draw user's attention to the form
      rfqWidget.style.transform = 'scale(1.02)';
      rfqWidget.style.borderColor = 'var(--accent-orange)';
      
      setTimeout(() => {
        rfqWidget.style.transform = '';
        rfqWidget.style.borderColor = '';
      }, 1000);

      showToast('Component Selected', `${componentName} loaded into RFQ parameters.`, false);
    });
  });


  // ==========================================================================
  // STATISTICS COUNTER ANIMATION
  // ==========================================================================
  const statsSection = document.getElementById('technical');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const targetStr = stat.getAttribute('data-target');
      if (!targetStr) return; // Skip non-integer values like "0.005mm" or "0 PPM"
      
      const target = parseInt(targetStr, 10);
      let current = 0;
      const duration = 2000; // 2 seconds animation
      const intervalTime = 30; // ms
      const step = Math.ceil(target / (duration / intervalTime));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        // Custom formatting
        if (targetStr === '500000') {
          stat.textContent = `${Math.floor(current / 1000)}K+`;
        } else {
          stat.textContent = `${current}%`;
        }
      }, intervalTime);
    });
  };

  // Intersection observer to trigger animation when scrolled to stats
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateStats();
        animated = true;
      }
    });
  }, { threshold: 0.25 });

  statsObserver.observe(statsSection);


  // ==========================================================================
  // FORM SUBMISSION HANDLERS
  // ==========================================================================
  const rfqForm = document.getElementById('rfq-form');
  const contactForm = document.getElementById('contact-form');

  rfqForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate API request loading
    const submitBtn = rfqForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Revert button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      // Show Success Toast
      showToast('RFQ Submitted Successfully', 'Our metallurgical & procurement division will email your quote within 24 hours.', false);
      
      // Reset form
      rfqForm.reset();
      clearFileSelection();
    }, 1500);
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      showToast('Inquiry Sent', 'Thank you! A technical engineer will contact you shortly.', false);
      
      contactForm.reset();
    }, 1200);
  });


  // ==========================================================================
  // TOAST NOTIFICATION UTILITY
  // ==========================================================================
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer;

  function showToast(title, message, isError = false) {
    // Clear any active timers
    clearTimeout(toastTimer);

    // Set text
    toastTitle.textContent = title;
    toastMessage.textContent = message;

    // Handle styling for errors
    if (isError) {
      toast.style.borderLeftColor = '#EF4444';
      toast.querySelector('.toast-icon').innerHTML = '<i class="fas fa-exclamation-circle" style="color: #EF4444;"></i>';
    } else {
      toast.style.borderLeftColor = 'var(--accent-orange)';
      toast.querySelector('.toast-icon').innerHTML = '<i class="fas fa-check-circle" style="color: var(--accent-orange);"></i>';
    }

    // Toggle display class
    toast.classList.add('show');

    // Slide out after 4.5 seconds
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
});
