#Jobs Search App

A web application that displays and visualizes job listings with an interactive map view and analytics dashboard. Built with FastAPI backend and vanilla JavaScript frontend.

## Features

- **Job Search**: Search through job listings with keyword filtering
- **Interactive Views**: 
  - List view with job details
  - Map view showing job locations with clustering
  - Analytics dashboard with various charts
- **Analytics Charts**:
  - Programming language demand
  - Salary distribution
  - Education requirements
  - Job posting trends
  - Daily publication patterns

## Technology Stack

### Backend
- FastAPI web framework
- Data sourced from Reed.co.uk Jobseeker API
- PostgreSQL database with asyncpg
- In-memory caching with fastapi-cache2
- Environment variable configuration
- CORS support

### Frontend
- Vanilla JavaScript
- Leaflet.js for maps
- Chart.js for data visualization
- Responsive design with CSS Grid

## Setup

1. Install backend dependencies:
```sh
cd backend
python -m venv backend_env
source backend_env/bin/activate  # On Windows: backend_env\Scripts\activate
pip install -r requirements.txt
```

2. Set up environment variables in `backend/.env`:
```sh
NEON_DB_USER=your_db_user
NEON_DB_PASSWORD=your_db_password
NEON_DB_HOST=your_db_host
NEON_DB_NAME=your_db_name
```

3. Install frontend dependencies:
```sh
cd frontend
npm install
```

4. Start the backend server:
```sh
cd backend
uvicorn main:app --reload
```

5. Open `frontend/index.html` in a web browser

## API Endpoints

- `GET /jobs` - Get all jobs for current date
- `GET /jobs/search/{keyword}` - Search jobs by keyword

## Database Schema

The application uses two main tables:

### jobs table
```sql
{
    "aplications": integer,
    "salary": bigint,
    "publication_date": date,
    "expiration_date": date,
    "id": bigint,
    "description": text,
    "job_title": character varying,
    "location": character varying,
    "employer_name": character varying,
    "job_url": character varying
}
```

### coordinates table
```sql
{
    "latitude": double precision,
    "longitude": double precision,
    "location": character varying
}
```

## Caching

The application implements caching to improve performance:
- Job listings are cached for 24 hours
- Search results are cached for 1 hour

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is released under the MIT License.