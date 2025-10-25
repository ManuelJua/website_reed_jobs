// jobService.js - Handles API calls and data fetching
export class JobService {
    constructor() {
        this.apiUrl = window.API_URL || 'http://127.0.0.1:8080';
        this.allJobs = [];
    }

    async fetchJobs() {
        try {
            const endpoint = `${this.apiUrl}/jobs`;
            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            this.allJobs = await response.json();
            return this.allJobs;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }

    async searchJobs(searchTerm) {
        try {
            const response = await fetch(`${this.apiUrl}/jobs/search/${searchTerm}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching filtered jobs:', error);
            return [];
        }
    }

    async getJobsForAnalytics(searchTerm) {
        try {
            const response = await fetch(`${this.apiUrl}/jobs/analytics/${searchTerm}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            return [];
        }
    }

    getAllJobs() {
        return this.allJobs;
    }
}
