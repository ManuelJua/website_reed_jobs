# Component Architecture

## Visual Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         index.html                              │
│  (UI Structure, Styles, External Libraries)                     │
│                                                                 │
│  Loads: components/main.js (ES6 Module)                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                       main.js                                   │
│                 (Application Coordinator)                       │
│                                                                 │
│  Responsibilities:                                              │
│  • Initialize all components                                    │
│  • Coordinate data flow                                         │
│  • Handle application lifecycle                                 │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────────┘
       │          │          │          │          │
       ↓          ↓          ↓          ↓          ↓
┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────────┐
│jobService││ jobList  ││  jobMap  ││jobAnalyt.││searchFilter  │
│   .js    ││   .js    ││   .js    ││   .js    ││    .js       │
└──────────┘└──────────┘└──────────┘└─────┬────┘└──────────────┘
                                           │
                                           ↓
                                    ┌──────────────┐
                                    │dataExtractors│
                                    │     .js      │
                                    └──────────────┘
```

## Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Interactions                           │
└───────┬─────────────────────────────┬───────────────────────────┘
        │                             │
        ↓                             ↓
  [Search Input]              [Tab Navigation]
        │                             │
        ↓                             ↓
┌──────────────┐              ┌──────────────┐
│searchFilter  │              │tabNavigation │
│    .js       │              │     .js      │
└──────┬───────┘              └──────┬───────┘
       │                             │
       ↓                             ↓
┌──────────────┐              [Show/Hide Tabs]
│ jobService   │                     │
│    .js       │                     ↓
└──────┬───────┘              [Map.invalidateSize()]
       │
       ↓
┌──────────────────────────────────────┐
│      Fetch Data from API             │
└──────┬───────────────────────────────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       ↓              ↓              ↓              ↓
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│  jobList   │ │   jobMap   │ │dataExtract │ │tabNavigat. │
│  .display()│ │  .update() │ │ ors.extract│ │  .openTab()│
└────────────┘ └────────────┘ └──────┬─────┘ └────────────┘
                                      │
                                      ↓
                               ┌────────────┐
                               │jobAnalytics│
                               │   .init()  │
                               └────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API                                │
│            http://127.0.0.1:8080/jobs                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓ HTTP Fetch
                  ┌─────────────┐
                  │ jobService  │
                  │   .js       │
                  └──────┬──────┘
                         │
                         ↓ Store in allJobs[]
                  [Jobs Data Array]
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ↓                ↓                ↓
  ┌──────────┐    ┌──────────┐    ┌──────────────┐
  │ jobList  │    │  jobMap  │    │dataExtractors│
  │ Display  │    │ Markers  │    │   Process    │
  └──────────┘    └──────────┘    └──────┬───────┘
                                          │
                                          ↓
                                   ┌──────────────┐
                                   │jobAnalytics  │
                                   │  6 Charts    │
                                   └──────────────┘
```

## Component Responsibilities Matrix

| Component         | Data Fetch | Data Display | User Input | Data Processing |
|-------------------|------------|--------------|------------|-----------------|
| main.js           |     ✓      |       -      |      -     |        -        |
| jobService.js     |    ✓✓✓    |       -      |      -     |        -        |
| jobList.js        |      -     |     ✓✓✓     |      -     |        -        |
| jobMap.js         |      -     |     ✓✓✓     |      -     |        -        |
| jobAnalytics.js   |      -     |     ✓✓✓     |      -     |        -        |
| dataExtractors.js |      -     |       -      |      -     |      ✓✓✓       |
| searchFilter.js   |      ✓     |       -      |    ✓✓✓    |       -         |
| tabNavigation.js  |      -     |       -      |    ✓✓✓    |       -         |

## Component Dependencies

```
main.js
  ├── jobService.js (no dependencies)
  ├── jobList.js (no dependencies)
  ├── jobMap.js (requires: Leaflet library)
  ├── jobAnalytics.js
  │   ├── requires: Chart.js library
  │   └── imports: dataExtractors.js
  ├── searchFilter.js
  │   ├── uses: jobService
  │   ├── uses: jobList
  │   ├── uses: jobMap
  │   └── uses: jobAnalytics
  └── tabNavigation.js
      └── uses: jobMap (for invalidateSize)
```

## Event Flow

```
User Types in Search Box → Press Enter
         ↓
searchFilter.filter(searchTerm)
         ↓
jobService.searchJobs(searchTerm) → API Call
         ↓
         ├─→ jobList.display(filteredJobs)
         ├─→ jobMap.update(filteredJobs)
         └─→ jobAnalytics.init(analyticsData)
```

```
User Clicks Tab Button
         ↓
tabNavigation.openTab(evt, tabName)
         ↓
         ├─→ Hide all tab content
         ├─→ Show selected tab content
         ├─→ Update active button style
         └─→ If mapTab: jobMap.invalidateSize()
```

## File Size Comparison

### Before Refactoring
- `index.html`: ~850 lines (HTML + CSS + JS)

### After Refactoring
- `index.html`: ~294 lines (HTML + CSS only)
- `components/main.js`: ~80 lines
- `components/jobService.js`: ~47 lines
- `components/jobList.js`: ~61 lines
- `components/jobMap.js`: ~63 lines
- `components/jobAnalytics.js`: ~293 lines
- `components/dataExtractors.js`: ~165 lines
- `components/searchFilter.js`: ~30 lines
- `components/tabNavigation.js`: ~32 lines
- **Total**: ~1,065 lines (better organized, documented, and maintainable)

## Key Benefits

1. **Modularity**: Each component is independent and reusable
2. **Maintainability**: Easy to find and fix bugs
3. **Testability**: Components can be unit tested
4. **Scalability**: Easy to add new features
5. **Collaboration**: Multiple developers can work simultaneously
6. **Performance**: Better browser caching
7. **Documentation**: Self-documenting code structure
