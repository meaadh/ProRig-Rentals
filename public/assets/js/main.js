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

  // Intro carousel
  var heroCarousel = $("#heroCarousel");
  var heroCarouselIndicators = $("#hero-carousel-indicators");
  heroCarousel.find(".carousel-inner").children(".carousel-item").each(function(index) {
    (index === 0) ?
    heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "' class='active'></li>"):
      heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "'></li>");
  });

  heroCarousel.on('slid.bs.carousel', function(e) {
    $(this).find('h2').addClass('animate__animated animate__fadeInDown');
    $(this).find('p, .btn-get-started').addClass('animate__animated animate__fadeInUp');
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
})(jQuery);