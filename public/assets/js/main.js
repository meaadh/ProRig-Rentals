/**
* Template Name: Mamba - v2.3.0
* Template URL: https://bootstrapmade.com/mamba-one-page-bootstrap-template-free/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Stick the header at top on scroll
  $("#header").sticky({
    topSpacing: 0,
    zIndex: '50'
  });

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $('#header').outerHeight() - 2;
  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top - scrolltoOffset;

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, .mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 200;
    if (nav_sections.length === 0) 
    {
    main_nav.find('li').removeClass('active');
    return;
    }
    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300) {
         $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the venobox plugin
  $(window).on('load', function() {
    $('.venobox').venobox();
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // event details carousel
  $(".event-details-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out-back",
      once: true
    });
  }
  $(window).on('load', function() {
    aos_init();
  });
  // Initialize Isotope
  var $grid = $('.event-container').isotope({
    itemSelector: '.event-item'
  });

  // Store filters
  var filters = {
    event: '*', // default is All
    type: ''    // default is none
  };

  // Event filters
  $('#event-flters').on('click', 'li', function() {
    var $this = $(this);
    var filterValue = $this.attr('data-filter');
    
    filters['event'] = filterValue;

    var combinedFilter = concatValues(filters);
    $grid.isotope({ filter: combinedFilter });

    // Update active class
    $this.addClass('filter-active').siblings().removeClass('filter-active');
  });

  // Type filters (toggleable)
  $('#type-flters').on('click', 'li', function() {
    var $this = $(this);
    var filterValue = $this.attr('data-filter');

    // Toggle logic:
    if ($this.hasClass('filter-active')) {
      // If already active, unselect
      filters['type'] = '';
      $this.removeClass('filter-active');
    } else {
      // Select new filter
      filters['type'] = filterValue;
      $this.addClass('filter-active').siblings().removeClass('filter-active');
    }

    var combinedFilter = concatValues(filters);
    $grid.isotope({ filter: combinedFilter });
  });

  // Combine filter values
  function concatValues(obj) {
    var allFilters = [];
    for (var key in obj) {
      if (obj[key] && obj[key] !== '*') {
        allFilters.push(obj[key]);
      }
    }
    return allFilters.length ? allFilters.join('') : '*';
  }
  // Dynamically load equipment data
  $(document).ready(function() {
    // Only run if .event-container exists
    if ($('.event-container').length) {
      fetch('/api/equipments')
        .then(res => res.json())
        .then(data => {
          console.log("Fetched equipment data:", data); // DEBUG: See what comes from the API
          const $container = $('.event-container');
          $container.empty();
          if (!Array.isArray(data) || data.length === 0) {
            $container.append('<div class="col-12"><p style="color:red;font-weight:bold;">No equipment found. Check your API or database.</p></div>');
            return;
          }
          data.forEach(item => {
            let filters = [];
            // Use quantity_available for availability
            if (item.quantity_available > 0) filters.push("filter-Available");
            else filters.push("filter-Booked");
            if (item.category === "Heavy Equipment") filters.push("filter-Heavy");
            if (item.category === "Landscaping Tools") filters.push("filter-Landscaping");
            if (item.category === "Light Equipment") filters.push("filter-Light");
            if (item.category === "Ladder & Lifts") filters.push("filter-Ladder");
            if (item.category === "Carpet Cleaners & Pressure Washers") filters.push("filter-Cleaner");
            // Use item.image if present, fallback to item.image_url, then fallback to no-image.png
            const imgUrl = (item.image && item.image.trim() !== "") 
              ? item.image 
              : (item.image_url && item.image_url.trim() !== "" 
                ? item.image_url 
                : "assets/img/no-image.png");
            $container.append(`
              <div class="col-lg-4 col-md-6 event-item ${filters.join(' ')}">
                <div class="card">
                  <img src="${imgUrl}" class="img-fluid" alt="${item.name || item.category}" />
                  <div class="card-text">
                    <h2>${item.name || item.category}</h2>
                    <h3>Available: ${item.quantity_available > 0 ? "Yes" : "No"} (${item.quantity_available || 0} in stock)</h3>
                    <p>${item.description || ""}</p>
                    <p>Rate: $${item.rental_rate_per_day} / day</p>
                  </div>
                </div>
              </div>
            `);
          });
          if ($container.data('isotope')) {
            $container.isotope('reloadItems').isotope();
          } else if (typeof Isotope !== "undefined") {
            $container.isotope({ itemSelector: '.event-item' });
          }
        })
        .catch(err => {
          console.error("Error fetching equipment:", err);
          $('.event-container').empty().append('<div class="col-12"><p style="color:red;font-weight:bold;">Failed to load equipment data.</p></div>');
        });
    }
  });
  document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/userinfo')
      .then(res => res.json())
      .then(data => {
        if (data && data.name && data.name !== "Customer") {

          // Change login text
          const loginLink = document.getElementById('login-link');
          if (loginLink) {
            loginLink.innerHTML = '<i class="icofont-logout"></i> | Logout';
            loginLink.href = '/logout';
          }

          // Define desktop and mobile nav targets
          const navTargets = [
            document.getElementById('main-navbar-list'),
            document.querySelector('.mobile-nav ul')
          ];

          navTargets.forEach(nav => {
            if (!nav) return;

            // Remove old if exists
            ['customer-page-link', 'return-page-link'].forEach(id => {
              const old = nav.querySelector(`#${id}`);
              if (old) old.remove();
            });

            // Create and insert new links
            const rentLi = document.createElement('li');
            rentLi.id = 'customer-page-link';
            rentLi.innerHTML = '<a href="customer.html" id="customer-page-link-anchor">Rent Equipment</a>';

            const returnLi = document.createElement('li');
            returnLi.id = 'return-page-link';
            returnLi.innerHTML = '<a href="return.html" id="return-page-link-anchor">Return Equipment</a>';

            const logoutLi = nav.querySelector('#login-link-li');
            if (logoutLi) {
              nav.insertBefore(rentLi, logoutLi);
              nav.insertBefore(returnLi, logoutLi);
            } else {
              nav.appendChild(rentLi);
              nav.appendChild(returnLi);
            }
          });

          // Highlight links when on specific pages
          const current = window.location.pathname;
          if (current.endsWith('customer.html')) {
            document.querySelectorAll('#customer-page-link-anchor').forEach(a => a.parentElement.classList.add('active'));
          }
          if (current.endsWith('return.html')) {
            document.querySelectorAll('#return-page-link-anchor').forEach(a => a.parentElement.classList.add('active'));
          }
        }
      })
      .catch(() => { /* Not logged in, ignore */ });
  });

  fetch('/api/userinfo')
    .then(res => res.json())
    .then(data => {
      if (data && data.name && data.name !== "Customer"||data && data.name && data.name !== "admin") {
        // Hide hero login button if logged in
        const heroLoginBtn = document.getElementById('hero-login-btn');
        if (heroLoginBtn) heroLoginBtn.style.display = 'none';
      }
    })
    .catch(() => { /* not logged in, do nothing */ });
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      } 
    });
  }
  // Prevent navbar from lifting up when clicking "Return Equipment" on this page
  document.addEventListener('DOMContentLoaded', function() {
    const returnLink = document.getElementById('return-page-link-anchor');
    if (returnLink && window.location.pathname.endsWith('return.html')) {
      returnLink.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
  });
  // Fetch user's rented equipment and populate the select
  function loadUserEquipment() {
    fetch('/api/myrentals')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        const select = document.getElementById('equipmentSelect');
        const noMsg = document.getElementById('no-equipment-message');
        select.innerHTML = '';
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(item => {
            const option = document.createElement('option');
            // Show quantity if available
            option.value = item.id;
            option.textContent = (item.name ? item.name + ' - ' : '') + item.id + (item.quantity_available !== undefined ? ` (Available: ${item.quantity_available})` : '');
            select.appendChild(option);
          });
          select.required = true;
          select.style.display = '';
          noMsg.style.display = 'none';
        } else {
          select.style.display = 'none';
          noMsg.textContent = 'You have no equipment to return.';
          noMsg.style.display = '';
        }
      })
      .catch(() => {
        const select = document.getElementById('equipmentSelect');
        const noMsg = document.getElementById('no-equipment-message');
        select.style.display = 'none';
        noMsg.textContent = 'Unable to load your rentals. Please make sure you are logged in and have active rentals.';
        noMsg.style.display = '';
      });
  }
  loadUserEquipment();

  // Handle return form submission
  document.getElementById('return-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const select = document.getElementById('equipmentSelect');
    const equipmentId = select.value;
    document.getElementById('return-success').style.display = 'none';
    document.getElementById('return-error').style.display = 'none';
    if (!equipmentId) {
      document.getElementById('return-error').textContent = 'Please select equipment to return.';
      document.getElementById('return-error').style.display = 'block';
      return;
    }
    fetch('/api/return', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ equipmentId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById('return-success').textContent = 'Equipment returned successfully!';
        document.getElementById('return-success').style.display = 'block';
        document.getElementById('return-form').reset();
        loadUserEquipment();
      } else {
        document.getElementById('return-error').textContent = data.error || 'Failed to return equipment.';
        document.getElementById('return-error').style.display = 'block';
      }
    })
    .catch(() => {
      document.getElementById('return-error').textContent = 'Server error. Please try again.';
      document.getElementById('return-error').style.display = 'block';
    });
  });
  
})(jQuery);