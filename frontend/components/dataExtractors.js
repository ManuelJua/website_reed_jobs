// dataExtractors.js - Extract data for analytics
export class DataExtractors {
    static extractLanguages(jobs) {
        const programmingLanguages = {
            'C#': 0,
            'Python': 0,
            'JavaScript': 0,
            'Java': 0,
            'PHP': 0,
            'Ruby': 0,
            'Golang': 0
        };

        jobs.forEach(job => {
            const description = job.description.toLowerCase();

            if (description.includes('c#') || description.includes('csharp') || description.includes('.net')) {
                programmingLanguages['C#']++;
            }
            if (description.includes('python')) {
                programmingLanguages['Python']++;
            }
            if (description.includes('javascript') || description.includes('js')) {
                programmingLanguages['JavaScript']++;
            }
            if (description.includes('java ') || description.includes('java,') || description.includes('java.')) {
                programmingLanguages['Java']++;
            }
            if (description.includes('php')) {
                programmingLanguages['PHP']++;
            }
            if (description.includes('ruby')) {
                programmingLanguages['Ruby']++;
            }
            if (description.includes('golang')) {
                programmingLanguages['Golang']++;
            }
        });

        return programmingLanguages;
    }

    static extractSalaryCounts(jobs) {
        const salaryCounts = {
            '< $50k': 0,
            '$50k-$100k': 0,
            '$100k-$150k': 0,
            '> $150k': 0
        };

        jobs.forEach(job => {
            const salary = job.salary;

            if (salary < 50000) {
                salaryCounts['< $50k']++;
            } else if (salary >= 50000 && salary < 100000) {
                salaryCounts['$50k-$100k']++;
            } else if (salary >= 100000 && salary < 150000) {
                salaryCounts['$100k-$150k']++;
            } else if (salary >= 150000) {
                salaryCounts['> $150k']++;
            }
        });

        return salaryCounts;
    }

    static extractEducationCounts(jobs) {
        const educationCounts = {
            'No Degree Required': 0,
            'Degree Required': 0
        };

        jobs.forEach(job => {
            const description = job.description.toLowerCase();
            const hasDegree = description.includes('bachelor') ||
                description.includes("bachelor's") ||
                description.includes('master') ||
                description.includes("master's") ||
                description.includes('phd') ||
                description.includes('ph.d') ||
                description.includes('doctorate');
            educationCounts[hasDegree ? 'Degree Required' : 'No Degree Required']++;
        });

        return educationCounts;
    }

    static extractTrendCounts(jobs) {
        const trendCounts = {
            '2023-Q1': 0,
            '2023-Q2': 0,
            '2023-Q3': 0,
            '2023-Q4': 0,
            '2024-Q1': 0,
            '2024-Q2': 0,
            '2024-Q3': 0,
            '2024-Q4': 0,
            '2025-Q1': 0,
            '2025-Q2': 0,
            '2025-Q3': 0,
            '2025-Q4': 0
        };

        jobs.forEach(job => {
            const date = new Date(job.publication_date);
            const quarter = Math.ceil((date.getMonth() + 1) / 3);
            const year = date.getFullYear();
            const key = `${year}-Q${quarter}`;

            if (trendCounts[key] !== undefined) {
                trendCounts[key]++;
            }
        });

        return trendCounts;
    }

    static extractDailyPublicationCounts(jobs) {
        const dailyCounts = {
            'Sunday': 0,
            'Monday': 0,
            'Tuesday': 0,
            'Wednesday': 0,
            'Thursday': 0,
            'Friday': 0,
            'Saturday': 0
        };

        jobs.forEach(job => {
            const date = new Date(job.publication_date);
            const day = date.toLocaleString('en-US', { weekday: 'long' });
            dailyCounts[day]++;
        });

        return dailyCounts;
    }

    static extractSalaryHistogramCounts(jobs) {
        const salaryHistogramCounts = {
            '20k-30k': 0,
            '30k-40k': 0,
            '40k-50k': 0,
            '50k-60k': 0,
            '60k-70k': 0,
            '70k-80k': 0,
            '80k-90k': 0,
            '90k-100k': 0,
            '100k+': 0
        };

        jobs.forEach(job => {
            const salary = job.salary;
            if (salary >= 20000 && salary < 30000) {
                salaryHistogramCounts['20k-30k']++;
            } else if (salary >= 30000 && salary < 40000) {
                salaryHistogramCounts['30k-40k']++;
            } else if (salary >= 40000 && salary < 50000) {
                salaryHistogramCounts['40k-50k']++;
            } else if (salary >= 50000 && salary < 60000) {
                salaryHistogramCounts['50k-60k']++;
            } else if (salary >= 60000 && salary < 70000) {
                salaryHistogramCounts['60k-70k']++;
            } else if (salary >= 70000 && salary < 80000) {
                salaryHistogramCounts['70k-80k']++;
            } else if (salary >= 80000 && salary < 90000) {
                salaryHistogramCounts['80k-90k']++;
            } else if (salary >= 90000 && salary < 100000) {
                salaryHistogramCounts['90k-100k']++;
            } else if (salary >= 100000) {
                salaryHistogramCounts['100k+']++;
            }
        });

        return salaryHistogramCounts;
    }
}
