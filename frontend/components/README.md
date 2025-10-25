# Components Documentation

This directory contains modular JavaScript components for the Job Search Application. Each component has a specific responsibility and can be maintained independently.

## Component Structure

### 1. **jobService.js**
**Purpose**: Handles all API communications and data fetching.

**Responsibilities**:
- Fetch all jobs from the API
- Search jobs by keyword
- Get jobs data for analytics
- Maintain the jobs cache

**Key Methods**:
- `fetchJobs()` - Fetches all jobs from the API
- `searchJobs(searchTerm)` - Searches jobs by term
- `getJobsForAnalytics(searchTerm)` - Gets filtered analytics data
- `getAllJobs()` - Returns cached jobs

### 2. **jobList.js**
**Purpose**: Manages the job list display in table format.

**Responsibilities**:
- Display jobs in a table
- Update job counter
- Show loading/error states

**Key Methods**:
- `display(jobs)` - Displays jobs in table format
- `updateCounter(count)` - Updates the job counter
- `showError(message)` - Shows error message
- `showLoading()` - Shows loading state

### 3. **jobMap.js**
**Purpose**: Handles the interactive map functionality using Leaflet.

**Responsibilities**:
- Initialize the map
- Add job markers with clustering
- Update markers based on filtered data

**Key Methods**:
- `init()` - Initializes the Leaflet map
- `update(jobs)` - Updates map markers
- `invalidateSize()` - Recalculates map size (for tab switching)
- `showError(message)` - Shows error message
- `showLoading()` - Shows loading state

### 4. **dataExtractors.js**
**Purpose**: Extract and process job data for analytics.

**Responsibilities**:
- Extract programming language statistics
- Calculate salary distributions
- Analyze education requirements
- Track job posting trends
- Count daily publications

**Key Methods**:
- `extractLanguages(jobs)` - Extracts programming language counts
- `extractSalaryCounts(jobs)` - Groups jobs by salary ranges
- `extractEducationCounts(jobs)` - Counts degree requirements
- `extractTrendCounts(jobs)` - Tracks quarterly trends
- `extractDailyPublicationCounts(jobs)` - Counts jobs by day of week
- `extractSalaryHistogramCounts(jobs)` - Creates salary histogram data

### 5. **jobAnalytics.js**
**Purpose**: Creates and manages all Chart.js visualizations.

**Responsibilities**:
- Initialize all charts
- Update charts with new data
- Destroy and recreate charts when filtering

**Key Methods**:
- `init(jobs)` - Creates all charts
- `destroyAllCharts()` - Cleans up existing charts

**Charts Created**:
- Programming Languages Demand (Bar Chart)
- Salary Distribution (Pie Chart)
- Education Requirements (Doughnut Chart)
- Job Posting Trends (Line Chart)
- Daily Job Publications (Bar Chart)
- Salary Distribution Histogram (Bar Chart)

### 6. **searchFilter.js**
**Purpose**: Manages search and filtering functionality.

**Responsibilities**:
- Handle search input
- Filter all views (list, map, analytics)
- Coordinate updates across components

**Key Methods**:
- `filter(searchTerm)` - Filters all views
- `init(inputId)` - Sets up search event listeners

### 7. **tabNavigation.js**
**Purpose**: Handles tab switching between different views.

**Responsibilities**:
- Switch between list, map, and analytics tabs
- Update active tab styling
- Handle map resize on tab switch

**Key Methods**:
- `openTab(evt, tabName)` - Switches to specified tab
- `init()` - Sets up tab event listeners

### 8. **main.js**
**Purpose**: Main application entry point that coordinates all components.

**Responsibilities**:
- Initialize all components
- Fetch initial data
- Coordinate component interactions
- Handle application lifecycle

**Key Methods**:
- `init()` - Initializes the entire application

## Data Flow

```
User Action (Search/Tab Switch)
        ↓
    main.js (Coordinator)
        ↓
  jobService.js (Fetch Data)
        ↓
    ┌─────┴─────┬──────────┐
    ↓           ↓          ↓
jobList.js  jobMap.js  jobAnalytics.js
  (Display)   (Display)   (Display)
```

## Usage

All components are ES6 modules that export classes. They are automatically loaded by the main.js file which is included in index.html:

```html
<script src="components/main.js" type="module"></script>
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each component has a single responsibility
2. **Maintainability**: Easy to find and fix issues in specific features
3. **Reusability**: Components can be reused in other projects
4. **Testability**: Individual components can be tested in isolation
5. **Scalability**: New features can be added as new components
6. **Code Organization**: Clear structure makes onboarding easier

## Future Improvements

- Add unit tests for each component
- Implement error boundaries
- Add TypeScript for type safety
- Create a state management system for larger scale
- Add component documentation with JSDoc
