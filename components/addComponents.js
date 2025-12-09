document.addEventListener('DOMContentLoaded', function() {    // Determine if we're in a subdirectory and handle both development and production paths
    const path = window.location.pathname;
    const isInSubdirectory = path.includes('/pages/') || path.includes('\\pages\\');
    const componentPath = isInSubdirectory ? '../components/' : './components/';
    
    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch(componentPath + 'header.html')
            .then(response => response.text())
            .then(data => {            headerPlaceholder.innerHTML = data;
                
                // Initialize mobile menu after header is loaded
                initMobileMenu();
                
                // Fix navigation links
                fixNavigationLinks();
                
                // Fix logo link when in subdirectory
                fixLogoLink();
                
                // Highlight active nav link
                highlightCurrentPage();
            })
            .catch(error => console.error('Error loading header:', error));
    }    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch(componentPath + 'footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
                
                // Set copyright year
                const copyrightYearElement = document.getElementById('copyright-year');
                if (copyrightYearElement) {
                    copyrightYearElement.textContent = new Date().getFullYear();
                }
                
                // Initialize back to top button
                initBackToTopButton();
                
                // Initialize theme toggle
                initThemeToggle();
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});

// Function to handle mobile menu toggle
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// Function to fix navigation links when in subdirectory
function fixNavigationLinks() {
    const path = window.location.pathname;
    const isInSubdirectory = path.includes('/pages/') || path.includes('\\pages\\');
    
    if (isInSubdirectory) {
        // Use the correct selector for navigation links (.nav-menu instead of .nav-links)
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Fix links that point to pages directory
            if (href.startsWith('pages/')) {
                link.setAttribute('href', '../' + href);
            } else if (href === 'index.html') {
                link.setAttribute('href', '../index.html');
            }
        });
    }
}

// Function to fix the logo link when in subdirectory
function fixLogoLink() {
    const path = window.location.pathname;
    const isInSubdirectory = path.includes('/pages/') || path.includes('\\pages\\');
    
    if (isInSubdirectory) {
        const logoLink = document.getElementById('logo-link');
        if (logoLink && logoLink.getAttribute('href') === 'index.html') {
            logoLink.setAttribute('href', '../index.html');
        }
    }
}

// Function to highlight current page in navigation
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        const pageName = currentPath.split('/').pop();
        
        // Check if current page matches the link's href
        if (pageName === linkPath.split('/').pop() || 
            (currentPath.endsWith('/') && linkPath === 'index.html') ||
            (currentPath.endsWith('/index.html') && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Function to initialize back to top button
function initBackToTopButton() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Show button when user scrolls down 300px
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0';
            }
        });
        
        // Smooth scroll to top when clicked
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    if (!themeToggle || !themeDropdown) return;
    
    // Initialize theme on page load
    initializeTheme();
    
    // Toggle dropdown on button click
    themeToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        themeDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!themeToggle.contains(e.target) && !themeDropdown.contains(e.target)) {
            themeDropdown.classList.remove('show');
        }
    });
    
    // Handle theme option clicks
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedTheme = this.dataset.theme;
            setTheme(selectedTheme);
            themeDropdown.classList.remove('show');
        });
    });
    
    // Update active option based on current theme
    updateActiveThemeOption();
}

function initializeTheme() {
    // Check for saved theme preference or default to 'auto'
    const savedTheme = localStorage.getItem('theme') || 'auto';
    setTheme(savedTheme);
}

function setTheme(theme) {
    // Save the preference
    localStorage.setItem('theme', theme);
    
    // Apply the theme
    if (theme === 'auto') {
        // Remove explicit theme attribute to let CSS media query handle it
        document.documentElement.removeAttribute('data-theme');
        // But add data-theme="auto" for our CSS selector
        document.documentElement.setAttribute('data-theme', 'auto');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Update the toggle button appearance
    updateThemeToggleAppearance(theme);
    updateActiveThemeOption();
}

function updateThemeToggleAppearance(theme) {
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    
    if (!lightIcon || !darkIcon) return;
    
    // Determine what icon to show based on theme and system preference
    let showDarkIcon = false;
    
    if (theme === 'dark') {
        showDarkIcon = true;
    } else if (theme === 'auto') {
        // Check system preference
        showDarkIcon = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    if (showDarkIcon) {
        lightIcon.style.opacity = '0';
        lightIcon.style.transform = 'translateY(-10px)';
        darkIcon.style.opacity = '1';
        darkIcon.style.transform = 'translateY(0)';
    } else {
        lightIcon.style.opacity = '1';
        lightIcon.style.transform = 'translateY(0)';
        darkIcon.style.opacity = '0';
        darkIcon.style.transform = 'translateY(10px)';
    }
}

function updateActiveThemeOption() {
    const currentTheme = localStorage.getItem('theme') || 'auto';
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        if (option.dataset.theme === currentTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Listen for system theme changes when in auto mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    const currentTheme = localStorage.getItem('theme') || 'auto';
    if (currentTheme === 'auto') {
        updateThemeToggleAppearance('auto');
    }
});