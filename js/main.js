// Touch swipe navigation for modal
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("DOMContentLoaded", function () {

    let homeLink = document.querySelector('.artist-name');
    let navLinks = document.querySelectorAll('.navbar a');
    let sections = document.querySelectorAll('main > .sections > section');

    function showSection(hash) {
        if (hash) {
            document.body.classList.remove('bg-image');
            mobileMenu.classList.remove('active');
        } else {
            mobileMenu.classList.add('active');
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

        if (window.location.hash) {
            mobileMenu.classList.remove('active');
        }
    });

    // Keyboard navigation for modal
    document.addEventListener('keyup', function (event) {
        if (event.key === 'ArrowLeft') {
            const prevBtn = document.querySelector('.prev-btn');
            if (prevBtn) prevBtn.click();
        } else if (event.key === 'ArrowRight') {
            const nextBtn = document.querySelector('.next-btn');
            if (nextBtn) nextBtn.click();
        }
    });

    document.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function (event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
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

    // Create SVG for prev button
    const prevSvgNS = "http://www.w3.org/2000/svg";
    const prevSvg = document.createElementNS(prevSvgNS, "svg");
    prevSvg.setAttribute("viewBox", "0 0 9 16");
    prevSvg.setAttribute("width", "1.5em");
    prevSvg.setAttribute("height", "2.67em"); // 16/9 ≈ 1.78 for aspect ratio

    const prevPolyline = document.createElementNS(prevSvgNS, "polyline");
    prevPolyline.setAttribute("fill", "none");
    prevPolyline.setAttribute("stroke", "currentColor");
    prevPolyline.setAttribute("stroke-width", "1");
    prevPolyline.setAttribute("stroke-miterlimit", "10");
    prevPolyline.setAttribute("points", "7.3,14.7 2.5,8 7.3,1.2");

    prevSvg.appendChild(prevPolyline);
    prevBtn.appendChild(prevSvg);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn next-btn';

    // Create SVG for next button
    const nextSvgNS = "http://www.w3.org/2000/svg";
    const nextSvg = document.createElementNS(nextSvgNS, "svg");
    nextSvg.setAttribute("viewBox", "0 0 9 16");
    nextSvg.setAttribute("width", "1.5em");
    nextSvg.setAttribute("height", "2.67em"); // 16/9 ≈ 1.78 for aspect ratio

    const nextPolyline = document.createElementNS(nextSvgNS, "polyline");
    nextPolyline.setAttribute("fill", "none");
    nextPolyline.setAttribute("stroke", "currentColor");
    nextPolyline.setAttribute("stroke-width", "1");
    nextPolyline.setAttribute("stroke-miterlimit", "10");
    nextPolyline.setAttribute("points", "1.6,1.2 6.5,7.9 1.6,14.7 ");

    nextSvg.appendChild(nextPolyline);
    nextBtn.appendChild(nextSvg);

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
        let index = event.target.parentNode.getAttribute("index");
        const artworkGrid = document.getElementsByClassName('artwork-grid');
        let element = artworkGrid[0].children[index].getElementsByClassName('artwork-container');
        updateModalContent(element[0]);
    });

    nextBtn.addEventListener('click', (event) => {
        let index = event.target.parentNode.getAttribute("index");
        const artworkGrid = document.getElementsByClassName('artwork-grid');
        let element = artworkGrid[0].children[index].getElementsByClassName('artwork-container');
        updateModalContent(element[0]);
    });

    try {
        const response = await fetch('manifest.json');
        const entries = await response.json();

        for (const entry of entries) {
            if (entry.site) {
                const sheet = document.styleSheets[0];
                for (let i = 0; i < sheet.cssRules.length; i++) {
                    const rule = sheet.cssRules[i];
                    if (rule instanceof CSSStyleRule && rule.selectorText === '.bg-image') {
                        rule.style.setProperty('background-image', `url('../images/${entry.site.image}')`);
                        break;
                    }
                }
            }
            if (entry.works) {
                const categories = document.getElementsByClassName('categories');
                for (const category of entry.works.categories) {
                    const element = document.createElement('p');
                    element.className = 'py-1';
                    element.textContent = category.name;
                    categories[0].appendChild(element);
                    if (category.files) {
                        for (const work of category.files) {
                            createArtworkElement(work.filename, work.info, artworkGrid[0]);
                        }
                    }
                }
            } else if (entry.cv) {
                const artist = document.getElementsByClassName('artist-name');
                artist[0].textContent = `${entry.cv.name} ${entry.cv.surname}`;

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
            } else if (entry.contact) {
                if (entry.contact.links) {
                    const links = document.getElementsByClassName('links');
                    for (const link of entry.contact.links) {
                        const element = document.createElement('p');
                        const anchor = document.createElement('a');
                        anchor.href = link.url;
                        anchor.textContent = link.label;
                        element.appendChild(anchor);
                        links[0].appendChild(element);
                    }
                }
                const studio = document.getElementsByClassName('studio');
                let element = document.createElement('p');
                element.textContent = entry.contact.studio.street;
                studio[0].appendChild(element);
                element = document.createElement('p');
                element.textContent = entry.contact.studio.city;
                studio[0].appendChild(element);
                element = document.createElement('p');
                element.textContent = entry.contact.studio.country;
                studio[0].appendChild(element);

                const image = document.getElementsByClassName('contact-image');
                image[0].src = `/images/${entry.contact.image.src}`;
                image[0].alt = entry.contact.image.alt;
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

    // Use thumbnail for grid
    const artworkImage = document.createElement('img');
    artworkImage.src = `/images/works/thumbs/${filename}`;
    artworkImage.alt = baseName;
    artworkImage.className = 'artwork-image';
    artworkImage.loading = 'lazy'; // Enable lazy loading

    // Store full-size image path for modal use
    artworkImage.dataset.fullsize = `/images/works/${filename}`;

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

    // Use full-size image for modal
    modalImage.src = artworkImage.dataset.fullsize || artworkImage.src;
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
    
function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next
        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) nextBtn.click();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous
        const prevBtn = document.querySelector('.prev-btn');
        if (prevBtn) prevBtn.click();
    }
}