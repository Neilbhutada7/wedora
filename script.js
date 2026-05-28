/**
 * Maheshwari Wedding Website - "Roots & Royalty"
 * Core Interaction Script
 */

function initPlanButtons() {
  const buttons = document.querySelectorAll('.plan-btn');
  const lists = document.querySelectorAll('.plan-list');
  // Hide all lists initially
  lists.forEach(l => l.style.display = 'none');
  // Activate first button by default
  if (buttons.length > 0) {
    buttons[0].classList.add('active');
    const firstDate = buttons[0].dataset.date;
    const firstList = document.getElementById(`plan-${firstDate}`);
    if (firstList) firstList.style.display = 'block';
  }
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const date = btn.dataset.date;
      // Update active button styles
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Show corresponding list
      lists.forEach(l => {
        if (l.id === `plan-${date}`) {
          l.style.display = 'block';
        } else {
          l.style.display = 'none';
        }
      });
    });
  });
}
// Register initPlanButtons
function initAll() {
  initNavbar();
  initCountdown();
  initRsvpForm();
  initScrollReveal();
  initPlanButtons();
}
document.addEventListener('DOMContentLoaded', initAll);


/**
 * Header Scroll Effect & Mobile Drawer
 */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change header styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile drawer
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close mobile drawer when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/**
 * Future Countdown Clock
 */
function initCountdown() {
  // Set target wedding date: November 21, 2026 at 10:00 AM
  const weddingDate = new Date('Nov 21, 2026 10:00:00').getTime();
  
  const dVal = document.getElementById('days');
  const hVal = document.getElementById('hours');
  const mVal = document.getElementById('minutes');
  const sVal = document.getElementById('seconds');

  if (!dVal || !hVal || !mVal || !sVal) return;

  function updateClock() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      // If date is passed, show celebration text
      const countdownBox = document.querySelector('.countdown-container');
      if (countdownBox) {
        countdownBox.innerHTML = `
          <div style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.25rem; letter-spacing: 0.1em; text-align: center; border: 1px solid rgba(250,249,246,0.2); padding: 1.5rem; width: 100%;">
            CELEBRATING OUR HAPPILY EVER AFTER
          </div>
        `;
      }
      return;
    }

    // Calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Render with leading zeros
    dVal.innerText = days.toString().padStart(2, '0');
    hVal.innerText = hours.toString().padStart(2, '0');
    mVal.innerText = minutes.toString().padStart(2, '0');
    sVal.innerText = seconds.toString().padStart(2, '0');
  }

  // Initial call and set interval
  updateClock();
  setInterval(updateClock, 1000);
}



/**
 * RSVP Submission Handler
 */
function initRsvpForm() {
  const rsvpForm = document.getElementById('wedding-rsvp-form');
  const rsvpCard = document.querySelector('.rsvp-form-card');
  const successMsg = document.querySelector('.rsvp-success-message');
  const guestNameSpan = document.getElementById('success-guest-name');

  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect inputs
    const guestNameInput = document.getElementById('guest-name');
    const guestName = guestNameInput ? guestNameInput.value.trim() : '';
    const guestCount = document.getElementById('guest-count') ? document.getElementById('guest-count').value : '1';
    
    // Check events selected
    const checkedEvents = [];
    document.querySelectorAll('input[name="event-attendance"]:checked').forEach(cb => {
      checkedEvents.push(cb.value);
    });

    // Validation check
    if (!guestName) {
      alert('Please enter your name to complete the RSVP.');
      return;
    }

    if (checkedEvents.length === 0) {
      alert('Please select at least one wedding event you will be attending.');
      return;
    }

    // Mock visual loading state
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'SAVING RSVP...';
    submitBtn.disabled = true;

    // Simulate network delay (1 second) for realistic demonstration
    setTimeout(() => {
      // Save locally to simulate persistence
      const rsvpData = {
        name: guestName,
        count: guestCount,
        events: checkedEvents,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('wedding_rsvp_' + Date.now(), JSON.stringify(rsvpData));

      // Display custom thank you
      if (guestNameSpan) {
        guestNameSpan.innerText = guestName;
      }

      // Smoothly hide form card and reveal success content
      rsvpForm.style.transition = 'opacity 0.4s ease';
      rsvpForm.style.opacity = '0';
      
      setTimeout(() => {
        rsvpForm.style.display = 'none';
        successMsg.style.display = 'block';
        
        // Adjust spacing of container decoration
        const formHeading = rsvpCard.querySelector('.section-header');
        if (formHeading) {
          formHeading.style.display = 'none';
        }
      }, 400);

    }, 1200);
  });
}

/**
 * Scroll Reveal Animations (Subtle fade-in up)
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length === 0) return;

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animated to prevent repeat jumps on bounce
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // trigger when 10% of element is in view
    rootMargin: '0px 0px -50px 0px' // offset to feel more natural
  });

  reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
  });
}
