document.addEventListener("DOMContentLoaded", function () {

    let homeLink = document.querySelector('.artist-name');
    let navLinks = document.querySelectorAll('.navbar-right a');
    let sections = document.querySelectorAll('main > section');

    function showSection(hash) {
        if (hash) {
            document.body.classList.remove('bg-image');
        }        
        sections.forEach(section => {
            section.hidden = (hash !== '#' + section.id);
        });
    }

    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.add('bg-image');
        window.location.hash = '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            for (let link of this.parentNode.children) {
                link.style.color = link == this ? 'black' : '';
                link.style.fontWeight = link == this ? 300 : '';
            }
            let targetHash = this.getAttribute('href');
            window.location.hash = targetHash;
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

    showSection(window.location.hash);
});
