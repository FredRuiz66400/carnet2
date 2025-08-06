import { loadDives, saveDives, exportData, importData } from './storage.js';
import { displayDives, handleAddDive, deleteDive, handleSearch, handleSort, updateRecentDives, toggleFilters } from './dives.js';
import { updateStats, updateStatistics, updateDepthDistribution } from './stats.js';

// Application State
let dives = [];
let currentView = 'dashboard';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    dives = loadDives();
    updateStats(dives);
    updateRecentDives(dives);
    updateStatistics(dives);

    // Set current date for dive form
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dive-date').value = today;

    // Add event listeners
    document.getElementById('dive-form').addEventListener('submit', (e) => handleAddDive(e, dives));
    document.getElementById('search-input').addEventListener('input', () => handleSearch(dives));
    document.getElementById('sort-by').addEventListener('change', () => handleSort(dives));
});

// Navigation Functions
function showView(viewName) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));

    // Show selected view
    document.getElementById(viewName + '-view').classList.add('active');

    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');

    currentView = viewName;

    // Update view-specific content
    if (viewName === 'dives') {
        displayDives(dives);
    } else if (viewName === 'statistics') {
        updateStatistics(dives);
    }
}

// Notification Utility
export function showNotification(message, type = 'info') {
    // ...notification code...
}

// Initialize navigation click handlers
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        const views = ['dashboard', 'dives', 'add-dive', 'statistics', 'settings'];
        item.addEventListener('click', () => showView(views[index]));
    });

    // Menu burger responsive
    const burger = document.querySelector('.burger');
    const mainNav = document.querySelector('.main-nav');
    if (burger && mainNav) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('active');
            mainNav.classList.toggle('open');
            mainNav.classList.toggle('closed');
        });
        // Fermer le menu au clic sur un lien
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mainNav.classList.remove('open');
                mainNav.classList.add('closed');
            });
        });
        // Par défaut, menu fermé sur mobile
        if (window.innerWidth <= 600) {
            mainNav.classList.add('closed');
        }
    }
});