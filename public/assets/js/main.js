// Auto-fill cardholder name in Add Payment Info form
document.addEventListener('DOMContentLoaded', function() {
  // Only run on equipment-reservation.html
  if (window.location.pathname.endsWith('equipment-reservation.html')) {
    fetch('/api/userinfo')
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          var cardholderField = document.getElementById('payment_cardholder_name');
          if (cardholderField) cardholderField.value = data.name;
        }
      });
  }
});
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
  // Mark current page as route-active
  function markRouteActive() {
    const path = location.pathname.split("/").pop() || "index.html";
    const lists = document.querySelectorAll(".nav-menu, .mobile-nav ul");
    lists.forEach(list => {
      if (!list) return;
      // clear previous route-active (if any)
      list.querySelectorAll(".route-active").forEach(li => li.classList.remove("route-active","active"));
      list.querySelectorAll("a[href]").forEach(a => {
        const href = a.getAttribute("href");
        if (!href || href.startsWith("#")) return; // only real page links
        const file = href.split("/").pop();
        if (file === path) {
          a.closest("li")?.classList.add("route-active","active");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", markRouteActive);

  // Navigation active state on scroll
  var nav_sections = $("section");
  var main_nav = $(".nav-menu, .mobile-nav");

  $(window).on("scroll", function () {
    // If no in-page sections, don't touch active state
    if (nav_sections.length === 0) return;

    var cur_pos = $(this).scrollTop() + 200;

    // Only toggle active for in-page hash links; leave .route-active alone
    main_nav.find('a[href^="#"]').parent("li").removeClass("active");

    nav_sections.each(function () {
      var top = $(this).offset().top,
          bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('a[href="#' + $(this).attr("id") + '"]').parent("li").addClass("active");
      }
    });

    // Remove this old fallback; it overrides your page active
    // if (cur_pos < 300) { $(".nav-menu ul:first li:first").addClass('active'); }
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
          
          // Sort equipment by category first (Heavy Equipment on top), then by name
          data.sort((a, b) => {
            // Priority order for categories
            const categoryPriority = {
              "Heavy Equipment": 0,
              "Carpet Cleaners & Pressure Washers": 1,
              "Ladder & Lifts": 2,
              "Landscaping Tools": 3,
              "Light Equipment": 4
            };
            
            if (a.category !== b.category) {
              const priorityA = categoryPriority[a.category] !== undefined ? categoryPriority[a.category] : 999;
              const priorityB = categoryPriority[b.category] !== undefined ? categoryPriority[b.category] : 999;
              return priorityA - priorityB;
            }
            return a.name.localeCompare(b.name);
          });
          
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
          $('.event-container').empty().append('<div class="col-12"><p style="color:red;font-weight:bold;text-align: center;">Access to the inventory is available to signed-in users only. Please sign in to continue.</p></div>');
        });
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
  fetch('/userdetail')
    .then(res => res.json())
    .then(data => {
      if (data && data.name) {
        document.getElementById('user-welcome-name').textContent = data.name;
      }
    })
    .catch(() => {
      // fallback: do nothing, default is "Customer"
    });
  });
  
document.addEventListener('DOMContentLoaded', function () {
  fetch('/userdetail', {credentials: 'include'})
    .then(res => res.json())
    .then(data => {
      const userType=data?.user_type;
      // Change login text
      const loginLink = document.getElementById('login-link');
      const loginLink2 = document.getElementById('login-link-2');
      
      if (loginLink) {
        loginLink.innerHTML = '<i class="icofont-logout"></i> | Logout';
        loginLink.href = '/logout';
      }
      if (loginLink2) {
        loginLink2.innerHTML = '<i class="icofont-logout"></i> | Logout';
        loginLink2.href = '/logout';
      }
      
      // Define desktop and mobile nav targets
      const navTargets = [
        document.getElementById('main-navbar-list'),
        document.querySelector('.mobile-nav ul')
      ];

      navTargets.forEach(nav => {
        if (!nav) return;

        // Remove old versions if they exist
        ['customer-page-link', 'return-page-link', 'account-dropdown','managment','admin-page'].forEach(id => {
          const old = nav.querySelector(`#${id}`);
          if (old) old.remove();
        });
        if(userType==="customer")
        {
          // Create dropdown container
          const dropdownLi = document.createElement('li');
          dropdownLi.classList.add('drop-down');
          dropdownLi.id = 'account-dropdown';
          dropdownLi.innerHTML = `
            <a href="#" class="account-toggle">My Account<i class="icofont-simple-down dropdown-arrow"></i></a>
            <ul>
              <li id="dashboard-page-link">
                <a href="account.html" id="dashboard-page-link-anchor">Dashboard</a>
              </li>
              <li id="customer-page-link">
                <a href="equipment-reservation.html" id="customer-page-link-anchor">Rent Equipment</a>
              </li>
              <li id="return-page-link">
                <a href="account.html#return" id="return-page-link-anchor">Return Equipment</a>
              </li>
            </ul>
          `;

          const logoutLi = nav.querySelector('#login-link-li');
          if (logoutLi) {
            nav.insertBefore(dropdownLi, logoutLi);
          } else {
            nav.appendChild(dropdownLi);
          }
        }
        else if(userType === "maintenance")
        {
          const dropdownLi = document.createElement('li');
          dropdownLi.id = 'management';
          dropdownLi.innerHTML = `
            <a href="maintainancePage.html">Managment</a>
          `;

          const logoutLi = nav.querySelector('#login-link-li');
          if (logoutLi) {
            nav.insertBefore(dropdownLi, logoutLi);
          } else {
            nav.appendChild(dropdownLi);
          }
        }
        else if(userType === "admin")
        {
          const dropdownLi = document.createElement('li');
          dropdownLi.id = 'admin-page';
          dropdownLi.innerHTML = `
            <a href="adminPage.html">Admin</a>
          `;

          const logoutLi = nav.querySelector('#login-link-li');
          if (logoutLi) {
            nav.insertBefore(dropdownLi, logoutLi);
          } else {
            nav.appendChild(dropdownLi);
          }
        }
      });

      // Highlight correct link
      const current = window.location.pathname+ window.location.hash;
      if (current.endsWith('account.html')) {
        document.querySelectorAll('#dashboard-page-link-anchor').forEach(a => a.parentElement.classList.add('active'));
      }
      if (current.endsWith('equipment-reservation.html')) {
        document.querySelectorAll('#customer-page-link-anchor').forEach(a => a.parentElement.classList.add('active'));
      }
      if (current.endsWith('account.html#return')) {
        document.querySelectorAll('#return-page-link-anchor').forEach(a => a.parentElement.classList.add('active'));
      }
      if (current.endsWith('adminPage.html')) {
        document.querySelectorAll('a[href$="adminPage.html"]').forEach(a => a.parentElement.classList.add('active'));
      }
      if (current.endsWith('maintainancePage.html')) {
        document.querySelectorAll('a[href$="maintainancePage.html"]').forEach(a => a.parentElement.classList.add('active'));
      }
    });
});
  fetch('/userdetail', {credentials:"include"})
  .then(res => {if(!res.ok)throw new Error("Not Logged in"); return res.json();})
  .then(data => {
    if (data?.name) {
      // Hide hero login button if logged in
      const heroLoginBtn = document.getElementById('login-link-3');
      if (heroLoginBtn) heroLoginBtn.style.display = 'none';
    }
  })
  .catch(() => { /* not logged in, do nothing */ });
  let allEquipment = [];
  let selectedEquipmentSet = new Set();

  function renderEquipment(category) {
    const list = document.getElementById('equipment-list');
    // Only show equipment with quantity_available > 0
    let filtered = allEquipment.filter(eq => (eq.quantity_available || 0) > 0);
    if (category) {
      filtered = filtered.filter(eq =>
        (eq.category || eq.type || '').toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply the same sorting logic to filtered results
    filtered.sort((a, b) => {
      // Priority order for categories
      const categoryPriority = {
        "Heavy Equipment": 0,
        "Carpet Cleaners & Pressure Washers": 1,
        "Ladder & Lifts": 2,
        "Landscaping Tools": 3,
        "Light Equipment": 4
      };
      
      if (a.category !== b.category) {
        const priorityA = categoryPriority[a.category] !== undefined ? categoryPriority[a.category] : 999;
        const priorityB = categoryPriority[b.category] !== undefined ? categoryPriority[b.category] : 999;
        return priorityA - priorityB;
      }
      return a.name.localeCompare(b.name);
    });
    
    if (!filtered.length) {
      list.innerHTML = '<div class="col-12"><p>No equipment available for this category.</p></div>';
      return;
    }
    list.innerHTML = filtered.map(eq => {
      // Use eq.image if present, fallback to eq.image_url, then fallback to no-image.png
      const imgUrl = (eq.image && eq.image.trim() !== "")
        ? eq.image
        : (eq.image_url && eq.image_url.trim() !== ""
          ? eq.image_url
          : "assets/img/no-image.png");
      return `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${imgUrl}" class="card-img-top" alt="${eq.name || eq.equipmentName || 'Equipment'}">
          <div class="card-body">
            <h5 class="card-title">${eq.name || eq.equipmentName || 'Equipment'}</h5>
            <p class="card-text">${eq.description || ''}</p>
            <div style="font-weight:bold;margin-bottom:5px;">
              Price: $${eq.rental_rate_per_day ? Number(eq.rental_rate_per_day).toFixed(2) : 'N/A'} per day
            </div>
            <div style="font-size:0.98em;margin-bottom:5px;">
              <b>Quantity Available:</b> ${eq.quantity_available || 0}
            </div>
            <div>
              <input type="checkbox" class="equipment-checkbox" value="${eq._id}" id="equip_${eq._id}" ${selectedEquipmentSet.has(eq._id) ? 'checked' : ''}>
              <label for="equip_${eq._id}">Select this equipment</label>
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('');

    // Added  event listeners to checkboxes to update selectedEquipmentSet
  document.querySelectorAll('.equipment-checkbox').forEach(cb => {
    cb.addEventListener('change', function() {
      if (this.checked) {
        selectedEquipmentSet.add(this.value);
      } else {
        selectedEquipmentSet.delete(this.value);
      }
    });
  });
}

fetch('/api/equipments')
  .then(res => res.json())
  .then(data => {
    // Sort equipment by category first (Heavy Equipment on top), then by name
    data.sort((a, b) => {
      // Priority order for categories
      const categoryPriority = {
        "Heavy Equipment": 0,
        "Carpet Cleaners & Pressure Washers": 1,
        "Ladder & Lifts": 2,
        "Landscaping Tools": 3,
        "Light Equipment": 4
      };
      
      if (a.category !== b.category) {
        const priorityA = categoryPriority[a.category] !== undefined ? categoryPriority[a.category] : 999;
        const priorityB = categoryPriority[b.category] !== undefined ? categoryPriority[b.category] : 999;
        return priorityA - priorityB;
      }
      return a.name.localeCompare(b.name);
    });
    
    allEquipment = data;
    renderEquipment(""); // Show nothing until category is picked
  })
  .catch(() => {
    document.getElementById('equipment-list').innerHTML = '<div class="col-12"><p>Access to the inventory is available to signed-in users only. Please sign in to continue.</p></div>';
  });

document.getElementById('equipment-category').addEventListener('change', function() {
  renderEquipment(this.value);
});

// Helper to calculate days between two dates (inclusive)
function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Added  1 to include the end date as a full day
  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
}

// Show modal with price and payment prompt
function showPaymentModal(totalPrice, onConfirm) {
  const taxRate = 0.06;
  const taxAmount = totalPrice * taxRate;
  const totalWithTax = totalPrice + taxAmount;
  document.getElementById('reservation-modal-title').textContent = "Reservation Summary";
  document.getElementById('reservation-modal-body').innerHTML = `
    <p style="font-size:1.2em;">Subtotal: <b>$${totalPrice.toFixed(2)}</b></p>
    <p style="font-size:1.1em;">Tax (6%): <b>$${taxAmount.toFixed(2)}</b></p>
    <p style="font-size:1.2em;">Total Price: <b>$${totalWithTax.toFixed(2)}</b></p>
    <p style="margin-top:10px;">Please proceed to payment to complete your reservation.</p>
    <button id="pay-now-btn" style="padding:8px 24px; font-size:1.1em; border:none; background:#28a745; color:#fff; border-radius:5px; cursor:pointer; margin-top:10px;">Pay Now</button>
  `;
  document.getElementById('reservation-modal').style.display = 'flex';
  document.getElementById('pay-now-btn').onclick = function() {
    document.getElementById('reservation-modal').style.display = 'none';
    onConfirm();
    // Set flag to show success modal after reload
    localStorage.setItem('showReservationModal', '1');
    window.location.reload();
  };
    // No "Okay" button here, only Pay Now
  }

  // Collect selected equipment IDs on form submit
  document.getElementById('reservation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('reservation-error').textContent = '';
    document.getElementById('reservation-success').textContent = '';
    document.getElementById('selected-equipment').value = JSON.stringify(Array.from(selectedEquipmentSet));
    if (selectedEquipmentSet.size === 0) {
      document.getElementById('reservation-error').textContent = "Please select at least one equipment to reserve.";
      return;
    }
    // Calculate total price
    const selectedIds = Array.from(selectedEquipmentSet);
    const endDate = document.getElementById('end_date').value;
    if (!endDate) {
      document.getElementById('reservation-error').textContent = "Please select a return date.";
      return;
    }
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const days = calculateDays(todayStr, endDate);
    let totalPrice = 0;
    selectedIds.forEach(id => {
      const eq = allEquipment.find(eq => eq._id == id);
      if (eq && eq.rental_rate_per_day) {
        totalPrice += Number(eq.rental_rate_per_day) * days;
      }
    });
    // Set total cost in hidden input before showing modal and submitting
    const taxRate = 0.06;
    const taxAmount = totalPrice * taxRate;
    const totalWithTax = totalPrice + taxAmount;
    document.getElementById('total-cost').value = totalWithTax.toFixed(2);
    // Show modal and only submit if user confirms
    showPaymentModal(totalPrice, () => {
      // AJAX submit to show error/success without page reload
      const form = document.getElementById('reservation-form');
      const formData = new FormData(form);
      formData.delete('start_date');
      fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams([...formData])
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          document.getElementById('reservation-error').textContent = data.error;
          document.getElementById('reservation-success').textContent = '';
        } else {
          // Show modal with "Okay" button for success
          let msg = "";
          if (data.unavailable_equipment_ids && data.unavailable_equipment_ids.length > 0) {
            msg = `<div style="color:green;font-weight:bold;">Reservation successful for available equipment only.</div>
                    <div style="color:red;font-weight:bold;">Some equipment was already booked and not reserved.</div>`;
          } else {
            msg = `<div style="color:green;font-weight:bold;">Reservation successful!</div>`;
          }
          document.getElementById('reservation-modal-title').textContent = "Reservation successful!";
          document.getElementById('reservation-modal_body').innerHTML = `
            ${msg}
            <button id="close-modal-btn" style="padding:8px 24px; font-size:1.1em; border:none; background:#007bff; color:#fff; border-radius:5px; cursor:pointer; margin-top:10px;">Okay</button>
          `;
          document.getElementById('reservation-modal').style.display = 'flex';
          document.getElementById('close-modal-btn').onclick = function() {
            document.getElementById('reservation-modal').style.display = 'none';
            window.location.reload();
          };
          document.getElementById('reservation-success').textContent = '';
          document.getElementById('reservation-error').textContent = '';
          selectedEquipmentSet.clear();
          renderEquipment(document.getElementById('equipment-category').value);
        }
      })
      .catch(() => {
        document.getElementById('reservation-error').textContent = "Reservation failed. Please try again.";
        document.getElementById('reservation-success').textContent = '';
      });
    });
  });
  /*
  document.getElementById('Payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('payment-error').textContent = '';
    document.getElementById('payment-success').textContent = '';
  });
    document.getElementById('Address-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('address-error').textContent = '';
    document.getElementById('address-success').textContent = '';
  });*/
  // Function to populate payment dropdown with user's saved payment methods
  function populatePaymentDropdown() {
    fetch('/api/mypayments')
      .then(res => res.json())
      .then(payments => {
        const paymentSelect = document.getElementById('payment');
        if (paymentSelect && payments && payments.length > 0) {
          // Clear existing options except the default
          paymentSelect.innerHTML = '<option value="" disabled selected>-- Choose Payment --</option>';
          
          // Add user's saved payment methods
          payments.forEach((payment, index) => {
            const option = document.createElement('option');
            option.value = payment.payment_nickname || `payment_${index}`;
            option.textContent = `${payment.card_type} ending in ${payment.last4} (${payment.payment_nickname || 'Card ' + (index + 1)})`;
            paymentSelect.appendChild(option);
          });
        }
      })
      .catch(err => {
        console.log('Could not load payment methods:', err);
        // Keep default options if API fails
      });
  }

  // Function to populate address dropdown with user's saved addresses
  function populateAddressDropdown() {
    fetch('/api/myaddress')
      .then(res => res.json())
      .then(addresses => {
        const addressSelect = document.getElementById('address');
        if (addressSelect && addresses && addresses.length > 0) {
          // Clear existing options except the default
          addressSelect.innerHTML = '<option value="" disabled selected>-- Choose Billing address--</option>';
          
          // Add user's saved addresses
          addresses.forEach((address, index) => {
            const option = document.createElement('option');
            option.value = address.address_nickname || `address_${index}`;
            option.textContent = `${address.address_line1}, ${address.city}, ${address.state} ${address.zip_code} (${address.address_nickname || 'Address ' + (index + 1)})`;
            addressSelect.appendChild(option);
          });
        }
      })
      .catch(err => {
        console.log('Could not load addresses:', err);
        // Keep default options if API fails
      });
  }

  // Replace sessionStorage logic with API call to get user's name from server
  document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/userinfo')
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          const customerNameField = document.getElementById('customer_name');
          const welcomeNameField = document.getElementById('user-welcome-name');
          if (customerNameField) customerNameField.value = data.name;
          if (welcomeNameField) welcomeNameField.textContent = data.name;
        }
      })
      .catch(() => {
        // fallback: do nothing, default is "Customer"
      });

    // Load user's payment and address information for equipment reservation page
    if (window.location.pathname.endsWith('equipment-reservation.html')) {
      populatePaymentDropdown();
      populateAddressDropdown();
      
      // Add event listeners for "Add New" buttons
      const addPaymentBtn = document.getElementById('add-payment-btn');
      const addAddressBtn = document.getElementById('add-address-btn');
      const paymentForm = document.getElementById('Payment-form');
      const addressForm = document.getElementById('Address-form');
      
      if (addPaymentBtn && paymentForm) {
        addPaymentBtn.addEventListener('click', function() {
          paymentForm.classList.toggle('hidden-form');
          addPaymentBtn.textContent = paymentForm.classList.contains('hidden-form') 
            ? '+ Add New Payment Method' 
            : '- Hide Payment Form';
        });
      }
      
      if (addAddressBtn && addressForm) {
        addAddressBtn.addEventListener('click', function() {
          addressForm.classList.toggle('hidden-form');
          addAddressBtn.textContent = addressForm.classList.contains('hidden-form') 
            ? '+ Add New Address' 
            : '- Hide Address Form';
        });
      }
      
      // Handle payment form submission and refresh dropdowns
      if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
          e.preventDefault();
          // Custom validation for card number, zip code, and cvv
          const cardNumber = paymentForm.card_number.value.trim();
          const zipCode = paymentForm.zip_code.value.trim();
          const cvv = paymentForm.cvv.value.trim();
          let errorMsg = '';
          if (!/^\d{16}$/.test(cardNumber)) {
            errorMsg = 'Card number must be exactly 16 digits.';
          } else if (!/^\d{5}$/.test(zipCode)) {
            errorMsg = 'Zip code must be exactly 5 digits.';
          } else if (!/^\d{3,4}$/.test(cvv)) {
            errorMsg = 'CVV must be 3 or 4 digits.';
          }
          if (errorMsg) {
            document.getElementById('payments-error').textContent = errorMsg;
            document.getElementById('payments-success').textContent = '';
            return;
          }
          const formData = new FormData(paymentForm);
          fetch('/payments', {
            method: 'POST',
            body: new URLSearchParams([...formData])
          })
          .then(res => res.json())
          .then(data => {
            if (data.message || data.success || !data.error) {
              document.getElementById('payments-success').textContent = 'Payment method added successfully!';
              document.getElementById('payments-error').textContent = '';
              paymentForm.reset();
              // Refresh payment dropdown
              setTimeout(() => {
                populatePaymentDropdown();
                paymentForm.classList.add('hidden-form');
                addPaymentBtn.textContent = '+ Add New Payment Method';
              }, 1000);
            } else {
              document.getElementById('payments-error').textContent = data.error || 'Failed to add payment method';
              document.getElementById('payments-success').textContent = '';
            }
          })
          .catch(err => {
            document.getElementById('payments-error').textContent = 'Failed to add payment method';
            document.getElementById('payments-success').textContent = '';
          });
        });

        // Enforce numeric input for card number, zip code, and cvv fields
        ['card_number', 'zip_code', 'cvv'].forEach(function(fieldId) {
          const field = document.getElementById(fieldId);
          if (field) {
            field.addEventListener('input', function(e) {
              this.value = this.value.replace(/[^\d]/g, '');
            });
          }
        });
      }
      
      // Handle address form submission and refresh dropdowns
      if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const formData = new FormData(addressForm);
          
          fetch('/addresses', {
            method: 'POST',
            body: new URLSearchParams([...formData])
          })
          .then(res => res.json())
          .then(data => {
            if (data.message || data.success || !data.error) {
              document.getElementById('address-success').textContent = 'Address added successfully!';
              document.getElementById('address-error').textContent = '';
              addressForm.reset();
              // Refresh address dropdown
              setTimeout(() => {
                populateAddressDropdown();
                addressForm.classList.add('hidden-form');
                addAddressBtn.textContent = '+ Add New Address';
              }, 1000);
            } else {
              document.getElementById('address-error').textContent = data.error || 'Failed to add address';
              document.getElementById('address-success').textContent = '';
            }
          })
          .catch(err => {
            document.getElementById('address-error').textContent = 'Failed to add address';
            document.getElementById('address-success').textContent = '';
          });
        });
      }
    }

    // Show success modal with "Okay" after reload if flag is set
    if (localStorage.getItem('showReservationModal') === '1') {
      document.getElementById('reservation-modal-title').textContent = "Reservation successful!";
      document.getElementById('reservation-modal-body').innerHTML = `
        <div style="color:green;font-weight:bold;">Reservation successful!</div>
        <button id="close-modal-btn" style="padding:8px 24px; font-size:1.1em; border:none; background:#007bff; color:#fff; border-radius:5px; cursor:pointer; margin-top:10px;">Okay</button>
      `;
      document.getElementById('reservation-modal').style.display = 'flex';
      document.getElementById('close-modal-btn').onclick = function() {
        document.getElementById('reservation-modal').style.display = 'none';
        window.location.reload();
      };
      localStorage.removeItem('showReservationModal');
    }
    // ...existing code...
  });    
})(jQuery);