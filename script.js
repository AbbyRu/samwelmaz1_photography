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
if (contactForm) { // Ensure contactForm exists on the current page
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
}

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
        // If search is empty, go back to the default section if on index.html
        // Or simply hide search results if on other pages.
        if (document.getElementById('home')) { // Check if 'home' section exists (i.e., on index.html)
            showPage('home');
        }
        return;
    }

    // Hide all main page content sections
    document.querySelectorAll('.page-content').forEach(page => page.classList.add('hidden'));

    let resultsFound = false;
    const searchRegex = new RegExp(escapeRegExp(query), 'gi'); // Case-insensitive global search

    // Search through each section on the current page
    document.querySelectorAll('.page-content:not(.hidden)').forEach(section => { // Only search visible sections for simplicity
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
    // Navigate back to index.html and show the home page
    window.location.href = 'index.html';
}

// Initial page load logic (adjusted for multi-page)
document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    const targetPageElement = document.getElementById(hash);

    // If there's a valid hash and a corresponding page-content element, show it
    if (hash && targetPageElement && targetPageElement.classList.contains('page-content')) {
        showPage(hash);
    } else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        // If on index.html (or root), and no valid hash, default to home
        showPage('home');
    }
    // For other standalone pages (portfolio.html, rates.html), their content is already active by default
    // and they don't have other 'page-content' sections to hide/show.
    // The initial CSS `page-content { opacity: 0; transform: translateY(20px); }`
    // and `.page-content.active { opacity: 1; transform: translateY(0); }`
    // combined with the `active` class on their main section should handle their display.
});


// AI Package Suggester (Rates Page only)
const suggestPackageButton = document.getElementById('suggest-package-button');
const packageNeedsTextarea = document.getElementById('package-needs');
const packageSuggestionOutput = document.getElementById('package-suggestion-output');
const suggestedText = document.getElementById('suggested-text');
const packageLoading = document.getElementById('package-loading');

if (suggestPackageButton) { // Ensure this only runs on the rates page
    suggestPackageButton.addEventListener('click', async () => {
        const userNeeds = packageNeedsTextarea.value.trim();
        if (!userNeeds) {
            suggestedText.textContent = 'Please describe your needs to get a package suggestion.';
            packageSuggestionOutput.classList.remove('hidden');
            return;
        }

        packageLoading.classList.remove('hidden');
        packageSuggestionOutput.classList.add('hidden');

        try {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            let suggestion = "Based on your description, we recommend the ";
            let lowerCaseNeeds = userNeeds.toLowerCase();

            if (lowerCaseNeeds.includes('wedding') || lowerCaseNeeds.includes('full day') || lowerCaseNeeds.includes('large event') || lowerCaseNeeds.includes('many photos')) {
                suggestion += "Premium Package (KES 85,000) for comprehensive coverage and extensive deliverables. This package offers 4 hours of session time, multiple locations, and 80+ edited digital photos, along with an online gallery and a photo album, perfect for grand events.";
            } else if (lowerCaseNeeds.includes('family') || lowerCaseNeeds.includes('portrait') || lowerCaseNeeds.includes('medium event') || lowerCaseNeeds.includes('couple') || lowerCaseNeeds.includes('more photos')) {
                suggestion += "Standard Package (KES 50,000) which provides a balanced offering with 2 hours of session time, up to two locations, and 40 edited digital photos, suitable for detailed portraits or smaller events.";
            } else if (lowerCaseNeeds.includes('headshot') || lowerCaseNeeds.includes('quick shoot') || lowerCaseNeeds.includes('few photos') || lowerCaseNeeds.includes('single person')) {
                suggestion += "Basic Package (KES 25,000) for a focused and efficient session. This package includes a 1-hour session at one location and 20 edited digital photos, ideal for professional headshots or simple portrait needs.";
            } else if (lowerCaseNeeds.includes('product activation') || lowerCaseNeeds.includes('product launch')) {
                suggestion += "Commercial Photography services, tailored for product activations. Please contact us directly for a custom quote to best capture your brand's unique launch needs.";
            } else if (lowerCaseNeeds.includes('product shoot') || lowerCaseNeeds.includes('ecommerce photos')) {
                suggestion += "Commercial Photography services, specifically for product shoots. We recommend discussing your specific product quantity and styling needs for a tailored package. Please contact us directly for a custom quote.";
            } else if (lowerCaseNeeds.includes('birthday') || lowerCaseNeeds.includes('small party')) {
                suggestion += "Event Photography services, likely fitting within our Standard or Basic package depending on duration. Please contact us to discuss the specifics of your birthday event to provide the best recommendation.";
            }
            else {
                suggestion += "Standard Package (KES 50,000) as a versatile option. For a more precise recommendation, please provide more details about your specific photography needs. Alternatively, you can contact us directly for a custom quote.";
            }

            suggestedText.textContent = suggestion;
            packageSuggestionOutput.classList.remove('hidden');
        } catch (error) {
            suggestedText.textContent = 'Sorry, something went wrong while generating the suggestion. Please try again later.';
            packageSuggestionOutput.classList.remove('hidden');
            console.error("AI suggestion error:", error);
        } finally {
            packageLoading.classList.add('hidden');
        }
    });
}
