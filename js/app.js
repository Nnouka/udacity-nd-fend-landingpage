/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
*/

/**
 * Define Global Variables
 * 
*/

// Application data store
const store = {
    sections: [],
    links: {},
    scrollTimerId: -1,
    pageHeader: null,
}

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

/**
 * Create Menu link
 */
function MenuLink({ label, href, onClick }) {
    const link = document.createElement('a');
    link.href = href;
    link.addEventListener('click', e => {
        e.preventDefault();
        onClick?.();
    });
    link.classList.add('menu__link');
    link.innerHTML = label;
    return link;
}
/**
 * Create Nav Menu Item
 */
function MenuItem({ label, href, onClick }) {
    const item = document.createElement('li');
    item.append(MenuLink({ label, href, onClick }));
    return item;
}

/**
 * Add an element to a Document root element
 */
function DOMRoot(selector) {
    try {
        let entry = document.querySelector(selector);
        function render(element) {
            if (entry && element) {
                entry.append(element);
            }
        }
        return { render }
    } catch(e) {
        console.error(e);
    }
}

/**
 * Select app sections
 */
function selectAppSections() {
    return document.querySelectorAll('[data-nav]');
}

/**
 * show/hide app header
 */
function showHideHeader() {
    if (store.pageHeader == null) {
        store.pageHeader = document.querySelector('#page__header');
    }
    store.pageHeader.classList.remove('hidden_header');
    clearTimeout(store.scrollTimerId);
    store.scrollTimerId = setTimeout(() => {
        if (window.scrollY) {
            store.pageHeader.classList.add('hidden_header');
        }
    }, 1000);
}

/**
 * Calculate position and add/remove active classes
 */
function addActiveClasses() {
    // get the least y > 0;
    const toArr = Array.prototype.slice.call(store.sections);
    // sort by y position
    toArr.sort(function (a, b) {
        const aR = a.getBoundingClientRect();
        const bR = b.getBoundingClientRect();
        const aY = aR.y + aR.height / 4;
        const bY = bR.y + bR.height / 4;
        if (aY === bY) return 0;
        else if (aY < 0 && bY < 0) return aY > bY ? -1 : 1;
        else if (aY < 0) return 1;
        else if (bY < 0) return -1;
        else if (aY < bY) return -1;
    });
    // first is active
    toArr.forEach((s, i) => {
        if (i == 0) {
            s.classList.add('active-section');
            store.links[s.id]?.classList.add('active-link');
        }
        else {
            s.classList.remove('active-section');
            store.links[s.id]?.classList.remove('active-link');
        }
    });
    showHideHeader();
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

/**
 * Man application entry point
 */
function Main() {
    store.sections = selectAppSections();
    // build the nav
    const navFragment = document.createDocumentFragment();
    // Build menu 
    store.sections.forEach(s => {
        const menuItem = MenuItem({
            label: s.getAttribute('data-nav'),
            href: `#${s.id}`,
            onClick() {
                // Scroll to anchor ID using scrollTO event
                // Scroll to section on link click
                window.scrollTo({
                    top: s.getBoundingClientRect().top + window.scrollY,
                    behavior: 'smooth'
                });
            }
        });
        navFragment.appendChild(menuItem);
        store.links[s.id] = menuItem;
    });
    // Add class 'active' to section when near top of viewport
    addActiveClasses();
    // Set sections as active
    document.addEventListener('scroll', addActiveClasses);
    // render the nav
    DOMRoot('#navbar__list').render(navFragment);
}



/**
 * End Main Functions
 * Begin Events
 * 
*/

// start application
document.addEventListener('DOMContentLoaded', Main);
