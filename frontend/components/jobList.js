// jobList.js - Handles job list display in table format
export class JobList {
    constructor(containerId, counterId) {
        this.container = document.getElementById(containerId);
        this.counter = document.getElementById(counterId);
        this.jobs = [];
        this.sortColumn = null;
        this.sortDirection = 'asc';
    }

    updateCounter(count) {
        this.counter.textContent = `${count} job${count === 1 ? '' : 's'} found`;
    }

    display(jobs) {
        this.jobs = jobs;
        this.updateCounter(jobs.length);
        
        if (jobs.length === 0) {
            this.container.innerHTML = '<div class="no-results">No jobs found matching your search.</div>';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th data-column="job_title" style="cursor: pointer;">
                        Job Title <span class="sort-indicator"></span>
                    </th>
                    <th data-column="location" style="cursor: pointer;">
                        Location <span class="sort-indicator"></span>
                    </th>
                    <th data-column="salary" style="cursor: pointer;">
                        Salary <span class="sort-indicator"></span>
                    </th>
                    <th data-column="employer_name" style="cursor: pointer;">
                        Company <span class="sort-indicator"></span>
                    </th>
                </tr>
            </thead>
            <tbody id="jobsTableBody">
            </tbody>
        `;

        // Add click handlers to headers
        const headers = table.querySelectorAll('th[data-column]');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                this.sortBy(column);
            });
        });

        this.renderTableBody(table, jobs);
        this.updateSortIndicators(table);

        this.container.innerHTML = '';
        this.container.appendChild(table);
    }

    renderTableBody(table, jobs) {
        const tableBody = table.querySelector('#jobsTableBody');
        tableBody.innerHTML = '';

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
    }

    sortBy(column) {
        // Toggle direction if clicking the same column
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Sort the jobs array
        const sortedJobs = [...this.jobs].sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];

        
            // Handle null/undefined values
            if (valueA == null) valueA = '';
            if (valueB == null) valueB = '';

            // Convert to strings for comparison (except numbers)
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();

            let comparison = 0;
            if (valueA > valueB) {
                comparison = 1;
            } else if (valueA < valueB) {
                comparison = -1;
            }

            return this.sortDirection === 'asc' ? comparison : -comparison;
        });

        // Re-render the table with sorted data
        this.display(sortedJobs);
    }


    updateSortIndicators(table) {
        const headers = table.querySelectorAll('th[data-column]');
        headers.forEach(header => {
            const column = header.getAttribute('data-column');
            const indicator = header.querySelector('.sort-indicator');
            
            if (column === this.sortColumn) {
                indicator.textContent = this.sortDirection === 'asc' ? ' ▲' : ' ▼';
            } else {
                indicator.textContent = '';
            }
        });
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
