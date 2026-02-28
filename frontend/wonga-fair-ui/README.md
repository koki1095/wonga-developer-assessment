A full-stack authentication application built with React, C# .NET 10.0, and PostgreSQL, containerized with Docker.

## Live Demo Features

- **User Registration** with form validation
- **Secure Login** with JWT authentication
- **Protected Dashboard** showing user details
- **Loan Calculator** with interactive sliders
- **Thank You Modal** demonstrating UI/UX polish

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | C# .NET 10.0 Web API, Entity Framework Core, JWT, BCrypt |
| **Database** | PostgreSQL 15 |
| **Containerization** | Docker & Docker Compose |
| **Testing** | xUnit (Unit Tests) |

## Architecture

The application follows a clean, containerized microservices architecture:

Frontend ────▶ :3000 
Backend ────▶ :8080
Database ────▶ :5432 

## Authentication Flow

1. User registers with email/password
2. Password is hashed using BCrypt and stored in PostgreSQL
3. User logs in with credentials
4. Server validates and returns JWT token
5. Token is stored in localStorage and included in subsequent requests
6. Protected routes/endpoints validate the token before granting access

## API Endpoints

### Public Endpoints
- POST /api/auth/register` - Register new user
- POST /api/auth/login` - Login user

### Protected Endpoints (JWT Required)
- GET /api/user/me` - Get current user details

## Running with Docker

### Prerequisites
- Docker Desktop (24.0+)
- Docker Compose (2.20+)

### Quick Start
# Clone the repository
git clone https://github.com/koki1095/wonga-developer-assessment.git
cd wonga-developer-assessment

# Start all services
docker-compose up --build
Access the Application
Frontend: http://localhost:3000

Backend API: http://localhost:8080/api

Database: localhost:5432

Testing the Application
1. Register a New User
Navigate to http://localhost:3000/register

Fill in: First Name, Last Name, Email, Password

Click "Create account"

2. Login
Use your credentials at http://localhost:3000/login

You'll be redirected to the protected dashboard

3. Explore Features
Adjust the loan amount slider (R500 - R8,000)

Adjust repayment period (7 - 180 days)

See real-time repayment calculation

Click "Apply Now" to see the thank you modal

4. API Testing (without Swagger)


# Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'


# Run backend unit tests
cd backend
dotnet test

Project Structure
wonga-fair-assessment/
├── backend/
│ ├── WongaFair.Api/ # Main API project
│ │ ├── Controllers/ # API endpoints
│ │ ├── Models/ # Entities and DTOs
│ │ ├── Data/ # Database context
│ │ ├── Configuration/ # JWT settings
│ │ └── Program.cs
│ ├── WongaFair.Tests/ # Unit tests
│ └── Dockerfile
├── frontend/
│ └── wonga-fair-ui/ # React application
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ ├── pages/ # Login, Register, Dashboard
│ │ ├── context/ # Auth context
│ │ ├── services/ # API services
│ │ ├── assets/ # Logo and images
│ │ └── App.jsx
│ ├── public/ # Static assets
│ └── Dockerfile
└── docker-compose.yml # Docker services

Configuration Notes
.NET 10.0 Compatibility
This project uses .NET 10.0 (latest LTS). Swagger/OpenAPI is temporarily unavailable due to package compatibility with this new version. All endpoints are fully functional and can be tested via curl or the frontend.

Environment Variables
Frontend: VITE_API_URL=http://localhost:8080/api

Backend: Configured in appsettings.json and Docker environment

Author
Koketso Pooe
Email: koketso@y7mail.com

Thank You
Thank you for reviewing my submission! I thoroughly enjoyed building this application and demonstrating my development skills with React, C#, and Docker.
