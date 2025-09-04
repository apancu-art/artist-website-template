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

    loadArtworks();

});

// Load artworks from images/works folder
async function loadArtworks() {
    const artworkGrid = document.getElementsByClassName('artwork-grid');

    try {
        const response = await fetch('/images/works/manifest.json');
        const entries = await response.json();

        for (const entry of entries) {
            createArtworkElement(entry.filename, entry.info, artworkGrid[0]);
        }
    } catch (error) {
        console.error('Error loading artworks:', error);
    }
}

function createArtworkElement(filename, artworkInfo, container) {

    const baseName = filename.replace(/\.(jpg|png)$/i, '');

    const artworkOuterContainer = document.createElement('div');
    artworkOuterContainer.className = 'artwork-outer-container';

    const artworkContainer = document.createElement('div');
    artworkContainer.className = 'artwork-container';

    const artworkFrame = document.createElement('div');
    artworkFrame.className = 'artwork-frame';

    const artworkImage = document.createElement('img');
    artworkImage.src = `/images/works/${filename}`;
    artworkImage.alt = baseName;
    artworkImage.className = 'artwork-image';

    artworkFrame.appendChild(artworkImage);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'artwork-info';
    infoDiv.textContent = `${artworkInfo.title}, ${artworkInfo.year}. ${artworkInfo.medium} - ${artworkInfo.dimensions}.`;


    artworkContainer.appendChild(artworkFrame);
    artworkOuterContainer.appendChild(artworkContainer);
    artworkOuterContainer.appendChild(infoDiv);

    container.appendChild(artworkOuterContainer);
}
