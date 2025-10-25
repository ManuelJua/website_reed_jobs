// jobAnalytics.js - Handles all charts and analytics
import { DataExtractors } from './dataExtractors.js';

export class JobAnalytics {
    constructor() {
        this.charts = {
            languages: null,
            salary: null,
            education: null,
            trend: null,
            dailyPublications: null,
            salaryHistogram: null
        };
    }

    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
    }

    init(jobs) {
        const languageCounts = DataExtractors.extractLanguages(jobs);
        const salaryCounts = DataExtractors.extractSalaryCounts(jobs);
        const educationCounts = DataExtractors.extractEducationCounts(jobs);
        const trendCounts = DataExtractors.extractTrendCounts(jobs);
        const dailyPublicationCounts = DataExtractors.extractDailyPublicationCounts(jobs);
        const salaryHistogramCounts = DataExtractors.extractSalaryHistogramCounts(jobs);

        // Destroy existing charts before creating new ones
        this.destroyAllCharts();

        // Create Languages Chart
        this.charts.languages = new Chart(document.getElementById('languagesChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(languageCounts),
                datasets: [{
                    label: 'Number of Job Listings',
                    data: Object.values(languageCounts),
                    backgroundColor: [
                        '#512BD4', // C# purple
                        '#3776AB', // Python blue
                        '#F7DF1E', // JavaScript yellow
                        '#007396', // Java blue
                        '#777BB4', // PHP purple
                        '#CC342D', // Ruby red
                        '#00ADD8'  // Golang blue
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Programming Language Distribution in Job Listings'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Job Listings'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Programming Language'
                        }
                    }
                }
            }
        });

        // Create Salary Distribution Chart
        this.charts.salary = new Chart(document.getElementById('salaryChart'), {
            type: 'pie',
            data: {
                labels: ['< $50k', '$50k-$100k', '$100k-$150k', '> $150k'],
                datasets: [{
                    data: Object.values(salaryCounts),
                    backgroundColor: [
                        '#FF9F40',
                        '#36A2EB',
                        '#4BC0C0',
                        '#FFCE56'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12
                        }
                    }
                }
            }
        });

        // Create Education Chart
        this.charts.education = new Chart(document.getElementById('educationChart'), {
            type: 'doughnut',
            data: {
                labels: ['No Degree Required', 'Degree Required'],
                datasets: [{
                    data: Object.values(educationCounts),
                    backgroundColor: [
                        '#36A2EB',
                        '#FF6384'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12
                        }
                    }
                }
            }
        });

        // Create Trend Chart
        this.charts.trend = new Chart(document.getElementById('trendChart'), {
            type: 'line',
            data: {
                labels: [
                    '2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4',
                    '2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4',
                    '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4'
                ],
                datasets: [{
                    label: 'Number of Job Postings',
                    data: Object.values(trendCounts),
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    fill: true,
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Job Postings'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Quarter'
                        }
                    }
                }
            }
        });

        // Create Daily Publications Chart
        this.charts.dailyPublications = new Chart(document.getElementById('dailyPublicationsChart'), {
            type: 'bar',
            data: {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [{
                    label: 'Number of Job Postings',
                    data: Object.values(dailyPublicationCounts),
                    backgroundColor: '#4BC0C0',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Daily Job Postings Distribution'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Postings'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Day of Week'
                        }
                    }
                }
            }
        });

        // Create Salary Histogram Chart
        this.charts.salaryHistogram = new Chart(document.getElementById('salaryHistogramChart'), {
            type: 'bar',
            data: {
                labels: [
                    '20k-30k', '30k-40k', '40k-50k', '50k-60k', '60k-70k',
                    '70k-80k', '80k-90k', '90k-100k', '100k+'
                ],
                datasets: [{
                    label: 'Number of Jobs',
                    data: Object.values(salaryHistogramCounts),
                    backgroundColor: '#FF9F40',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Salary Distribution in Job Listings'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Jobs'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Salary Range'
                        }
                    }
                }
            }
        });
    }
}
