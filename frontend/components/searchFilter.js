// searchFilter.js - Handles search and filtering functionality
export class SearchFilter {
    constructor(jobService, jobList, jobMap, jobAnalytics) {
        this.jobService = jobService;
        this.jobList = jobList;
        this.jobMap = jobMap;
        this.jobAnalytics = jobAnalytics;
    }

    async filter(searchTerm) {
        if (searchTerm.length === 0) {
            const allJobs = this.jobService.getAllJobs();
            this.jobList.display(allJobs);
            this.jobMap.update(allJobs);
            this.jobAnalytics.init(allJobs);
            return;
        }

        const filteredJobs = await this.jobService.searchJobs(searchTerm);
        const filteredJobsForAnalytics = await this.jobService.getJobsForAnalytics(searchTerm);

        this.jobList.display(filteredJobs);
        this.jobMap.update(filteredJobs);
        this.jobAnalytics.init(filteredJobsForAnalytics);
    }

    init(inputId) {
        const searchInput = document.getElementById(inputId);
        searchInput.addEventListener('keyup', async (e) => {
            if (e.key === 'Enter') {
                await this.filter(e.target.value);
            }
        });
    }
}
