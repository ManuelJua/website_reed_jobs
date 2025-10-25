// main.js - Main application initialization and coordination
import { JobService } from './jobService.js';
import { JobList } from './jobList.js';
import { JobMap } from './jobMap.js';
import { JobAnalytics } from './jobAnalytics.js';
import { SearchFilter } from './searchFilter.js';
import { TabNavigation } from './tabNavigation.js';

class JobSearchApp {
    constructor() {
        // Initialize all components
        this.jobService = new JobService();
        this.jobList = new JobList('jobsContainer', 'jobsCounter');
        this.jobMap = new JobMap('jobMap');
        this.jobAnalytics = new JobAnalytics();
        this.tabNavigation = new TabNavigation(this.jobMap);
        this.searchFilter = new SearchFilter(
            this.jobService,
            this.jobList,
            this.jobMap,
            this.jobAnalytics
        );
    }

    async init() {
        try {
            // Fetch jobs
            const jobs = await this.jobService.fetchJobs();

            // Initialize all views
            this.jobList.display(jobs);
            this.jobMap.init();
            this.jobMap.update(jobs);
            this.jobAnalytics.init(jobs);

            // Initialize search functionality
            this.searchFilter.init('searchInput');

            // Initialize tab navigation
            this.tabNavigation.init();

        } catch (error) {
            console.error('Error initializing app:', error);
            this.jobList.showError();
            this.jobMap.showError();
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new JobSearchApp();
    app.init();
});

// Export for global access (needed for inline onclick handlers)
window.openTab = function(evt, tabName) {
    const app = new JobSearchApp();
    app.tabNavigation.openTab(evt, tabName);
};
