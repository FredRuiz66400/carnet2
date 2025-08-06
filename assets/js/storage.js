import { showNotification } from './main.js';

export function saveDives(dives) {
    localStorage.setItem('diving-logbook', JSON.stringify(dives));
}

export function loadDives() {
    const savedDives = localStorage.getItem('diving-logbook');
    return savedDives ? JSON.parse(savedDives) : [];
}

export function exportData(dives) {
    // ...export JSON...
    showNotification('Données exportées avec succès !', 'success');
}

export function importData(event, dives) {
    // ...import JSON...
}