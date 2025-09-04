document.addEventListener("DOMContentLoaded", function () {

    let homeLink = document.querySelector('.artist-name');
    let navLinks = document.querySelectorAll('.navbar a');
    let sections = document.querySelectorAll('main > .sections > section');

    function showSection(hash) {
        if (hash) {
            document.body.classList.remove('bg-image');
        }
        navLinks.forEach(link => {
            link.style.fontWeight = hash ? '' : link.classList.contains('artist-name') ? 500 : 400;
        });             
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
                link.style.fontWeight = link == this ? 400 : '';
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
        if (mobileMenu.classList.contains('active')) {
            sections.forEach(section => {
                section.hidden = true;
            });
        } else {
            showSection(window.location.hash);
        }
    });

    // Select all the links inside the mobile menu
    let mobileMenu = document.querySelector('.mobile-menu');
    let menuLinks = mobileMenu.querySelectorAll('a');

    // Add a click event listener to each link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            burgerMenu.classList.remove('is-active');
            showSection(window.location.hash);
        });
    });

    showSection(window.location.hash);

    window.addEventListener('resize', function () {
        if (window.location.hash == '#cv') {
            let navbarRight = document.querySelector('.navbar-right');
            let lastCol = document.querySelector('.column-grid > div:last-child');
            if (navbarRight && lastCol) {
                navbarRight.style.marginRight -= (lastCol.offsetLeft  - navbarRight.offsetLeft) + 'px';
            }
        }
    });

    // A sample array of artwork data
    const artworks = [
        {
            title: "Abstract Composition",
            year: 2023,
            medium: "Oil on canvas",
            dimensions: "24x36 in",
            placeholderColor: "#555555" // Dark grey
        },
        {
            title: "Untitled",
            year: 2022,
            medium: "Acrylic on wood panel",
            dimensions: "18x24 in",
            placeholderColor: "#000000" // Black
        },
        {
            title: "Morning Glow",
            year: 2024,
            medium: "Mixed media",
            dimensions: "30x40 in",
            placeholderColor: "#FFC0CB" // Pink
        },
        {
            title: "Deep Sea",
            year: 2021,
            medium: "Digital print",
            dimensions: "16x20 in",
            placeholderColor: "#008080" // Teal
        },
        {
            title: "Earth Tones",
            year: 2023,
            medium: "Oil on canvas",
            dimensions: "20x20 in",
            placeholderColor: "#6B4226" // Brown
        },
        {
            title: "Starry Night",
            year: 2020,
            medium: "Acrylic on linen",
            dimensions: "36x48 in",
            placeholderColor: "#000080" // Navy Blue
        }
    ];

    // Get the grid container element
    const artworkGrid = document.getElementsByClassName('artwork-grid');

    // Loop through the artworks array and create an element for each
    artworks.forEach(artwork => {
        // Create the main container for a single artwork
        const artworkContainer = document.createElement('div');
        artworkContainer.className = 'artwork-container';

        // Create the frame and placeholder
        const artworkFrame = document.createElement('div');
        artworkFrame.className = 'artwork-frame';

        const artworkPlaceholder = document.createElement('div');
        artworkPlaceholder.className = 'artwork-placeholder';
        artworkPlaceholder.textContent = 'Artwork Placeholder';
        artworkPlaceholder.style.backgroundColor = artwork.placeholderColor; // Set the color dynamically

        artworkFrame.appendChild(artworkPlaceholder);

        // Create the info text
        const artworkInfo = document.createElement('div');
        artworkInfo.className = 'artwork-info';
        artworkInfo.textContent = `${artwork.title}, ${artwork.year}. ${artwork.medium} — ${artwork.dimensions}.`;

        // Append all parts to the main container
        artworkContainer.appendChild(artworkFrame);
        artworkContainer.appendChild(artworkInfo);

        // Append the complete artwork container to the grid
        artworkGrid[0].appendChild(artworkContainer);
    });
});
