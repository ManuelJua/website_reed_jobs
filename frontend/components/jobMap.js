// jobMap.js - Handles map functionality using Leaflet
export class JobMap {
    constructor(mapId) {
        this.mapId = mapId;
        this.map = null;
        this.markerClusterGroup = null;
    }

    init() {
        this.map = L.map(this.mapId).setView([51.505, -0.09], 5);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        return this.map;
    }

    update(jobs) {
        if (!this.map) {
            console.error('Map not initialized. Call init() first.');
            return;
        }

        // Remove previous marker cluster groups
        this.map.eachLayer(layer => {
            if (layer instanceof L.MarkerClusterGroup) {
                this.map.removeLayer(layer);
            }
        });

        this.markerClusterGroup = L.markerClusterGroup();

        jobs.forEach(job => {
            if (job.latitude && job.longitude) {
                const marker = L.marker([job.latitude, job.longitude])
                    .bindPopup(`<a href="${job.job_url}" target="_blank">${job.job_title}</a><br>${job.location}`);
                this.markerClusterGroup.addLayer(marker);
            }
        });

        this.map.addLayer(this.markerClusterGroup);
    }

    invalidateSize() {
        if (this.map) {
            this.map.invalidateSize();
        }
    }

    showError(message) {
        document.getElementById(this.mapId).innerHTML = `
            <div class="error">
                ${message || 'Failed to load map data. Please try again later.'}
            </div>
        `;
    }

    showLoading() {
        document.getElementById(this.mapId).innerHTML = '<div class="loading">Loading map...</div>';
    }
}
