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
    const body = document.body;

    // Create the modal HTML elements once
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';

    const closeButton = document.createElement('span');
    closeButton.className = 'close-btn';
    closeButton.innerHTML = 'X'; // HTML entity for 'x'

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-artwork-container';

    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn prev-btn';
    prevBtn.innerHTML = '&lt;'; // HTML entity for <

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn next-btn';
    nextBtn.innerHTML = '&gt;'; // HTML entity for >

    modalBackdrop.appendChild(prevBtn);
    modalBackdrop.appendChild(nextBtn);
    modalBackdrop.appendChild(modalContainer);
    modalBackdrop.appendChild(closeButton);
    body.appendChild(modalBackdrop);

    closeButton.addEventListener('click', () => {
        modalBackdrop.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalBackdrop) {
            modalBackdrop.style.display = 'none';
        }
    });

    prevBtn.addEventListener('click', (event) => {
        let index = event.target.getAttribute("index");
        const artworkGrid = document.getElementsByClassName('artwork-grid');
        let element = artworkGrid[0].children[index].getElementsByClassName('artwork-container');;
        updateModalContent(element[0]);
    });

    nextBtn.addEventListener('click', (event) => {
        let index = event.target.getAttribute("index");
        const artworkGrid = document.getElementsByClassName('artwork-grid');
        let element = artworkGrid[0].children[index].getElementsByClassName('artwork-container');;
        updateModalContent(element[0]);
    });

    try {
        const response = await fetch('/images/works/manifest.json');
        const entries = await response.json();

        for (const entry of entries) {
            if (entry.works) {
                for (const work of entry.works) {
                    createArtworkElement(work.filename, work.info, artworkGrid[0]);
                }
            } else if (entry.cv) {
                if (entry.cv.bio) {
                    const bio = document.getElementsByClassName('bio');
                    for (const part of entry.cv.bio) {
                        const element = document.createElement('p');
                        element.className = 'pb-1';
                        element.textContent = part;
                        bio[0].appendChild(element);
                    }
                    const location = document.getElementsByClassName('location');
                    let element = document.createElement('p');
                    element.textContent = `Born in ${entry.cv.birthyear} in ${entry.cv.birthplace}`;
                    location[0].appendChild(element);
                    element = document.createElement('p');
                    element.textContent = `Resides and works in ${entry.cv.residence}`;
                    location[0].appendChild(element);

                    const education = document.getElementsByClassName('education');
                    for (const edu of entry.cv.education) {
                        const element = document.createElement('p');
                        element.textContent = edu;
                        education[0].appendChild(element);
                    }
                }
            }
        }

        document.querySelectorAll('.artwork-container').forEach(function (element) {

            element.addEventListener('click', () => {
                updateModalContent(element);
            });
        });

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
    infoDiv.textContent = `${artworkInfo.title}, ${artworkInfo.year}. ${artworkInfo.medium} - ${artworkInfo.dimensions}`;


    artworkContainer.appendChild(artworkFrame);
    artworkOuterContainer.appendChild(artworkContainer);
    artworkOuterContainer.appendChild(infoDiv);

    container.appendChild(artworkOuterContainer);
}

function updateModalContent(element) {

    const artworkGrid = document.getElementsByClassName('artwork-grid');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop');
    const modalContainer = document.getElementsByClassName('modal-artwork-container');
    const prevBtn = document.getElementsByClassName('nav-btn prev-btn');
    const nextBtn = document.getElementsByClassName('nav-btn next-btn');

    // Update modal content with the clicked artwork's data
    const index = Array.from(artworkGrid[0].children).indexOf(element.parentElement);
    const artworkImage = element.querySelector('.artwork-image');
    const modalImage = document.createElement('img');

    modalContainer[0].innerHTML = '';

    modalImage.src = artworkImage.src;
    modalImage.alt = artworkImage.alt;
    modalImage.className = 'modal-artwork-image';

    modalContainer[0].appendChild(modalImage);

    prevBtn[0].setAttribute("index", Math.max(0, index - 1));
    nextBtn[0].setAttribute("index", Math.min(artworkGrid[0].children.length - 1, index + 1));
    prevBtn[0].style.display = index === 0 ? 'none' : 'block';
    nextBtn[0].style.display = index === artworkGrid[0].children.length - 1 ? 'none' : 'block';

    // Display the modal
    modalBackdrop[0].style.display = 'flex';
}