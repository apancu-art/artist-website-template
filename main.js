document.addEventListener("DOMContentLoaded", function () {

    let navLinks = document.querySelectorAll('.navbar-right a');
    let sections = document.querySelectorAll('main > section');

    function showSection(hash) {
        sections.forEach(section => {
            section.hidden = (hash !== '#' + section.id);
        });
    }

    // Initial display: show first section or section from hash
    let initialHash = window.location.hash || '#' + sections[0].id;
    showSection(initialHash);

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            let targetHash = this.getAttribute('href');
            window.location.hash = targetHash;
            showSection(targetHash);
        });
    });

    // Handle browser navigation (back/forward)
    window.addEventListener('hashchange', function () {
        showSection(window.location.hash);
    });

    // Burger menu toggle for mobile view
    let burgerMenu = document.querySelector('.burger-menu');
    burgerMenu.addEventListener('click', function () {
        let mobileMenu = document.querySelector('.mobile-menu');
        mobileMenu.classList.toggle('active');
        burgerMenu.classList.toggle('is-active');
    });

    // Select all the links inside the mobile menu
    let mobileMenu = document.querySelector('.mobile-menu');
    let menuLinks = mobileMenu.querySelectorAll('a');

    // Add a click event listener to each link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {

            mobileMenu.classList.remove('active');
            burgerMenu.classList.remove('is-active');
        });
    });
});
