// Application State
let dives = [];
let currentView = 'dashboard';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadDives();
    updateStats();
    updateRecentDives();
    updateStatistics();
    
    // Set current date for dive form
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dive-date').value = today;
    
    // Add event listeners
    document.getElementById('dive-form').addEventListener('submit', handleAddDive);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('sort-by').addEventListener('change', handleSort);
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
        displayDives();
    } else if (viewName === 'statistics') {
        updateStatistics();
    }
}

// Dive Management Functions
function handleAddDive(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const dive = {
        id: Date.now().toString(),
        date: document.getElementById('dive-date').value,
        time: document.getElementById('dive-time').value,
        location: document.getElementById('dive-location').value,
        site: document.getElementById('dive-site').value,
        maxDepth: parseInt(document.getElementById('max-depth').value) || 0,
        duration: parseInt(document.getElementById('duration').value) || 0,
        waterTemp: parseInt(document.getElementById('water-temp').value) || 0,
        visibility: parseInt(document.getElementById('visibility').value) || 0,
        conditions: document.getElementById('conditions').value,
        buddyName: document.getElementById('buddy-name').value,
        airStart: document.getElementById('air-start').value ? parseInt(document.getElementById('air-start').value) : null,
        airEnd: document.getElementById('air-end').value ? parseInt(document.getElementById('air-end').value) : null,
        notes: document.getElementById('notes').value
    };
    
    dives.unshift(dive);
    saveDives();
    updateStats();
    updateRecentDives();
    updateStatistics();
    
    // Reset form and navigate to dives list
    event.target.reset();
    document.getElementById('dive-date').value = new Date().toISOString().split('T')[0];
    showView('dives');
    
    // Show success message
    showNotification('Plongée ajoutée avec succès !', 'success');
}

function deleteDive(diveId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette plongée ?')) {
        dives = dives.filter(dive => dive.id !== diveId);
        saveDives();
        updateStats();
        updateRecentDives();
        updateStatistics();
        displayDives();
        showNotification('Plongée supprimée', 'info');
    }
}

// Display Functions
function displayDives() {
    const divesList = document.getElementById('dives-list');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortBy = document.getElementById('sort-by').value;
    
    let filteredDives = dives.filter(dive => 
        dive.site.toLowerCase().includes(searchTerm) ||
        dive.location.toLowerCase().includes(searchTerm) ||
        dive.notes.toLowerCase().includes(searchTerm)
    );
    
    // Sort dives
    filteredDives.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.date) - new Date(a.date);
            case 'depth':
                return b.maxDepth - a.maxDepth;
            case 'duration':
                return b.duration - a.duration;
            default:
                return 0;
        }
    });
    
    if (filteredDives.length === 0) {
        divesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>${searchTerm ? 'Aucune plongée trouvée' : 'Aucune plongée enregistrée'}</h3>
                <p>${searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Commencez par ajouter votre première plongée !'}</p>
            </div>
        `;
        return;
    }
    
    divesList.innerHTML = filteredDives.map(dive => `
        <div class="dive-card">
            <div class="dive-card-header">
                <div>
                    <div class="dive-card-title">${dive.site}</div>
                    <div class="dive-card-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${dive.location}
                    </div>
                    <div class="dive-card-date">${formatDate(dive.date)}</div>
                </div>
                <button class="btn-delete" onclick="deleteDive('${dive.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="dive-card-stats">
                <div class="dive-stat">
                    <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
                    <span>Profondeur: ${dive.maxDepth}m</span>
                </div>
                <div class="dive-stat">
                    <i class="fas fa-clock"></i>
                    <span>${dive.duration} minutes</span>
                </div>
                <div class="dive-stat">
                    <i class="fas fa-thermometer-half"></i>
                    <span>${dive.waterTemp}°C</span>
                </div>
                <div class="dive-stat">
                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                    <span>Visibilité: ${dive.visibility}m</span>
                </div>
            </div>
            
            <div class="dive-card-meta">
                <span>${dive.date} à ${dive.time}</span>
                <span class="condition-badge">${dive.conditions}</span>
            </div>
            
            ${dive.notes ? `<div class="dive-notes">${dive.notes}</div>` : ''}
            
            ${dive.buddyName ? `
                <div class="dive-buddy">
                    <span class="dive-buddy-label">Binôme: </span>
                    <span class="dive-buddy-name">${dive.buddyName}</span>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function updateRecentDives() {
    const recentDivesList = document.getElementById('recent-dives-list');
    const recentDives = dives.slice(0, 3);
    
    if (recentDives.length === 0) {
        recentDivesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-water"></i>
                <p>Aucune plongée enregistrée</p>
                <small>Ajoutez votre première plongée !</small>
            </div>
        `;
        return;
    }
    
    recentDivesList.innerHTML = recentDives.map(dive => `
        <div class="dive-card">
            <div class="dive-card-header">
                <div>
                    <div class="dive-card-title">${dive.site}</div>
                    <div class="dive-card-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${dive.location}
                    </div>
                    <div class="dive-card-date">${formatDate(dive.date)}</div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #10b981; font-weight: 600; font-size: 0.875rem;">${dive.maxDepth}m</div>
                    <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.75rem;">${dive.duration}min</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Statistics Functions
function updateStats() {
    const totalDives = dives.length;
    const totalTime = dives.reduce((sum, dive) => sum + dive.duration, 0);
    const maxDepth = dives.length > 0 ? Math.max(...dives.map(dive => dive.maxDepth)) : 0;
    const avgDepth = dives.length > 0 ? (dives.reduce((sum, dive) => sum + dive.maxDepth, 0) / dives.length) : 0;
    
    // Update dashboard stats
    document.getElementById('total-dives').textContent = totalDives;
    document.getElementById('total-time').textContent = formatTime(totalTime);
    document.getElementById('max-depth').textContent = maxDepth + 'm';
    document.getElementById('avg-depth').textContent = avgDepth.toFixed(1) + 'm';
}

function updateStatistics() {
    const totalDives = dives.length;
    const totalTime = dives.reduce((sum, dive) => sum + dive.duration, 0);
    const maxDepth = dives.length > 0 ? Math.max(...dives.map(dive => dive.maxDepth)) : 0;
    const avgDepth = dives.length > 0 ? (dives.reduce((sum, dive) => sum + dive.maxDepth, 0) / dives.length) : 0;
    const avgTemp = dives.length > 0 ? (dives.reduce((sum, dive) => sum + dive.waterTemp, 0) / dives.length) : 0;
    const avgVisibility = dives.length > 0 ? (dives.reduce((sum, dive) => sum + dive.visibility, 0) / dives.length) : 0;
    const maxDuration = dives.length > 0 ? Math.max(...dives.map(dive => dive.duration)) : 0;
    const maxVisibility = dives.length > 0 ? Math.max(...dives.map(dive => dive.visibility)) : 0;
    
    // Update detailed stats
    document.getElementById('stats-total-dives').textContent = totalDives;
    document.getElementById('stats-total-time').textContent = formatTime(totalTime);
    document.getElementById('stats-max-depth').textContent = maxDepth + 'm';
    document.getElementById('stats-avg-depth').textContent = avgDepth.toFixed(1) + 'm';
    document.getElementById('stats-avg-temp').textContent = avgTemp.toFixed(1) + '°C';
    document.getElementById('stats-avg-visibility').textContent = avgVisibility.toFixed(1) + 'm';
    
    // Update records
    document.getElementById('record-max-depth').textContent = maxDepth + 'm';
    document.getElementById('record-max-duration').textContent = maxDuration + 'min';
    document.getElementById('record-max-visibility').textContent = maxVisibility + 'm';
    
    // Update depth distribution
    updateDepthDistribution();
}

function updateDepthDistribution() {
    const depthChart = document.getElementById('depth-chart');
    
    if (dives.length === 0) {
        depthChart.innerHTML = `
            <div class="empty-stats">
                <i class="fas fa-chart-line"></i>
                <p>Aucune donnée disponible</p>
                <small>Ajoutez des plongées pour voir vos statistiques</small>
            </div>
        `;
        return;
    }
    
    const depthRanges = {
        '0-10m': dives.filter(d => d.maxDepth <= 10).length,
        '11-20m': dives.filter(d => d.maxDepth > 10 && d.maxDepth <= 20).length,
        '21-30m': dives.filter(d => d.maxDepth > 20 && d.maxDepth <= 30).length,
        '30m+': dives.filter(d => d.maxDepth > 30).length,
    };
    
    const totalDives = dives.length;
    
    depthChart.innerHTML = Object.entries(depthRanges).map(([range, count]) => {
        const percentage = (count / totalDives) * 100;
        return `
            <div class="depth-range">
                <span class="depth-range-label">${range}</span>
                <div class="depth-range-bar">
                    <div class="depth-range-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="depth-range-percentage">${percentage.toFixed(0)}%</span>
            </div>
        `;
    }).join('');
}

// Search and Filter Functions
function handleSearch() {
    if (currentView === 'dives') {
        displayDives();
    }
}

function handleSort() {
    if (currentView === 'dives') {
        displayDives();
    }
}

function toggleFilters() {
    const filtersSection = document.getElementById('filters-section');
    filtersSection.classList.toggle('hidden');
}

// Data Management Functions
function saveDives() {
    localStorage.setItem('diving-logbook', JSON.stringify(dives));
}

function loadDives() {
    const savedDives = localStorage.getItem('diving-logbook');
    if (savedDives) {
        dives = JSON.parse(savedDives);
    }
}

function exportData() {
    const data = JSON.stringify(dives, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carnet-plongee-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Données exportées avec succès !', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedDives = JSON.parse(e.target.result);
                if (Array.isArray(importedDives)) {
                    dives = importedDives;
                    saveDives();
                    updateStats();
                    updateRecentDives();
                    updateStatistics();
                    displayDives();
                    showNotification('Données importées avec succès !', 'success');
                } else {
                    showNotification('Format de fichier invalide', 'error');
                }
            } catch (error) {
                showNotification('Erreur lors de l\'importation des données', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h${mins > 0 ? mins + 'min' : ''}`;
    }
    return `${mins}min`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 
                   type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                   'rgba(59, 130, 246, 0.9)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '10000',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        animation: 'slideDown 0.3s ease-out'
    });
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// Initialize navigation click handlers
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        const views = ['dashboard', 'dives', 'add-dive', 'statistics', 'settings'];
        item.addEventListener('click', () => showView(views[index]));
    });
});