// Function to show a specific page and hide others
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.remove('hidden');
            // Trigger reflow to restart animation
            void page.offsetWidth; // This forces a reflow, restarting the animation
            page.classList.add('active');
        } else {
            page.classList.remove('active');
            page.classList.add('hidden');
        }
    });
    // Clear search results when navigating to a new page
    document.getElementById('search-results-container').classList.add('hidden');
    document.getElementById('header-search-input').value = '';
    // Scroll to top of the page when content changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const closeMobileMenuButton = document.getElementById('close-mobile-menu');

function openMobileMenu() {
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.remove('hidden');
    mobileMenuOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
}

function closeMobileMenu() {
    mobileMenu.classList.add('translate-x-full');
    mobileMenuOverlay.classList.add('hidden');
    // Wait for transition to complete before hiding
    mobileMenu.addEventListener('transitionend', function handler() {
        mobileMenu.classList.add('hidden');
        mobileMenu.removeEventListener('transitionend', handler);
    });
    document.body.style.overflow = ''; // Restore scrolling
}

mobileMenuButton.addEventListener('click', openMobileMenu);
closeMobileMenuButton.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', closeMobileMenu); // Close when clicking outside menu

// Handle contact form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // In a real application, you would send this data to a backend server.
    // For this example, we'll just show a success message.
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    console.log('Form Submitted:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);

    // Show success message using the custom modal
    showMessageModal('Message Sent!', 'Thank you for contacting us, ' + name + '! We will get back to you shortly.');

    // Clear the form
    contactForm.reset();
});

// Modal functions
const messageModal = document.getElementById('messageModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');

function showMessageModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    messageModal.style.display = 'flex'; // Show the modal
}

function closeModal() {
    messageModal.style.display = 'none'; // Hide the modal
}

// Search Functionality
const headerSearchInput = document.getElementById('header-search-input');
const headerSearchButton = document.getElementById('header-search-button');
const searchResultsContainer = document.getElementById('search-results-container');
const searchResultsContent = document.getElementById('search-results-content');
const searchQueryDisplay = document.getElementById('search-query-display');
const noResultsMessage = document.getElementById('no-results-message');

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function performSearch() {
    const query = headerSearchInput.value.trim();
    searchQueryDisplay.textContent = query;
    searchResultsContent.innerHTML = ''; // Clear previous results
    noResultsMessage.classList.add('hidden');

    if (query === '') {
        searchResultsContainer.classList.add('hidden');
        showPage('home'); // Go back to home if search is empty
        return;
    }

    // Hide all pages initially
    document.querySelectorAll('.page-content').forEach(page => page.classList.add('hidden'));

    let resultsFound = false;
    const searchRegex = new RegExp(escapeRegExp(query), 'gi'); // Case-insensitive global search

    // Search through each section
    document.querySelectorAll('.page-content').forEach(section => {
        const sectionId = section.id;
        const sectionTitle = section.querySelector('h1, h2')?.textContent || sectionId;
        let sectionMatches = [];

        // Search text content within the section
        section.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span').forEach(element => {
            const originalText = element.textContent;
            if (originalText.match(searchRegex)) {
                resultsFound = true;
                // Create a copy of the element to highlight matches without affecting original DOM
                const clonedElement = element.cloneNode(true);
                clonedElement.innerHTML = originalText.replace(searchRegex, `<span class="highlight">${query}</span>`);
                sectionMatches.push(clonedElement.outerHTML);
            }
        });

        if (sectionMatches.length > 0) {
            const sectionResultDiv = document.createElement('div');
            sectionResultDiv.classList.add('mb-4', 'p-4', 'bg-gray-50', 'rounded-md');
            sectionResultDiv.innerHTML = `<h3 class="text-xl font-semibold text-green-700 mb-2">${sectionTitle}</h3>` + sectionMatches.join('');
            searchResultsContent.appendChild(sectionResultDiv);
        }
    });

    if (!resultsFound) {
        noResultsMessage.classList.remove('hidden');
    }

    searchResultsContainer.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to search results
}

headerSearchButton.addEventListener('click', performSearch);
headerSearchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

function clearSearchAndShowHome() {
    headerSearchInput.value = '';
    searchResultsContainer.classList.add('hidden');
    showPage('home');
}

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
    showPage('home'); // Show the home page by default
});