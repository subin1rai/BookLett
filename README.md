# BookLett

## Project Overview
BookLett is a web-based application designed to turn a personal collection of books into an online digital bookstore platform. The system allows users to search and browse through books, filter by multiple preferences, and purchase books online with in-store pickup. Administrators can manage book inventory, offer discounts, and post announcements to users. The platform also provides features like sorting books, bookmarking, and reviewing purchased books.

## Technology Stack
- **Frontend**: React.js
- **Backend**: ASP.NET Core Web API (Dotnet)
- **Database**: PostgreSQL
- **Deployment**: 
  - Backend and Database: Docker, Railway
  - Frontend: Netlify
- **External Libraries**: 
  - Bcrypt.Net-Next (for password hashing)
  - JWT (for authentication)
  - Entity Framework Core (for database communication)
  - Swashbuckle (for API documentation)
  - Cloudinary (for image management)
  - SendGrid (for email services)
  - SignalR (for real-time communication)
  - CORS (for cross-origin resource sharing)

## Installation and Setup

### Prerequisites
- **Node.js**: Make sure you have **Node.js** installed for the frontend.
- **.NET SDK**: Install the **.NET SDK** for running the backend.
- **Docker**: Install **Docker** to build and run containers for the backend and database.

### Steps to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/subin1rai/BookLett.git
   cd BookLett

2. **Set up the frontend**:
  ```bash
  cd book-frontend
  npm install
  npm start
```

4. **Set up for backend**:
  ```bash
  cd backend
  dotnet restore
  dotnet run
```

## Try Out the website
https://booklett.netlify.app/
