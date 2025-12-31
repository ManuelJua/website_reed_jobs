// jobList.js - Handles job list display in table format
export class JobList {
    constructor(containerId, counterId) {
        this.container = document.getElementById(containerId);
        this.counter = document.getElementById(counterId);
    }

    updateCounter(count) {
        this.counter.textContent = `${count} job${count === 1 ? '' : 's'} found`;
    }

    display(jobs) {
        this.updateCounter(jobs.length);
        
        if (jobs.length === 0) {
            this.container.innerHTML = '<div class="no-results">No jobs found matching your search.</div>';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Job Title</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Company</th>
                </tr>
            </thead>
            <tbody id="jobsTableBody">
            </tbody>
        `;

        const tableBody = table.querySelector('#jobsTableBody');

        jobs.forEach(job => {
            const row = document.createElement('tr');
            const salary = job.salary || 'Not specified';

            row.innerHTML = `
                <td><a href="${job.job_url}" target="_blank">${job.job_title}</a></td>
                <td>${job.location}</td>
                <td>${salary}</td>
                <td>${job.employer_name}</td>
            `;

            tableBody.appendChild(row);
        });

        this.container.innerHTML = '';
        this.container.appendChild(table);
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="error">
                ${message || 'Failed to load jobs. Please try again later or check if the API server is running.'}
            </div>
        `;
    }

    showLoading() {
        this.container.innerHTML = '<div class="loading">Loading jobs...</div>';
    }
}
