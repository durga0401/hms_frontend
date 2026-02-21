# Hospital Management System - Frontend

A modern, responsive web application for hospital management built with React.

## 🏥 Features

- **Patient Portal**: Book appointments, view history, manage prescriptions
- **Doctor Dashboard**: Manage appointments, patients, and availability
- **Admin Panel**: User management, reports, and system configuration
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Notifications**: Stay updated with appointment changes

## 🛠️ Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Build Tool**: Webpack 5
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hms_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file for environment-specific configurations.

**⚠️ Security Note**: Never commit `.env` files or expose API keys in version control.

### 4. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`.

### 5. Build for Production

```bash
npm run build
```

Production files will be generated in the `dist/` directory.

## 🐳 Docker

### Build and Run Locally

```bash
# Build the image
docker build -t hms-frontend .

# Run the container
docker run -p 80:80 hms-frontend
```

### Using Docker Compose

```bash
docker-compose up
```

## 📁 Project Structure

```
hms_frontend/
├── public/           # Static files
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── layout/   # Navigation and layout components
│   │   └── ui/       # Common UI elements
│   ├── context/      # React context providers
│   ├── pages/        # Page components
│   ├── services/     # API service layer
│   ├── App.jsx       # Main application component
│   └── index.jsx     # Application entry point
├── Dockerfile
├── nginx.conf        # Nginx configuration for production
└── package.json
```

## 🎨 UI Components

The application includes a comprehensive UI component library:

- **Alert**: Notification messages
- **Badge**: Status indicators
- **Button**: Action buttons with variants
- **Card**: Content containers
- **DatePicker**: Date selection
- **Input**: Form inputs
- **Loader**: Loading states
- **Modal**: Dialog boxes
- **Select**: Dropdown selections

## 🔒 Security Features

- **Authentication**: JWT-based authentication
- **Protected Routes**: Role-based access control
- **Secure Headers**: Nginx security headers in production
- **XSS Protection**: React's built-in XSS prevention

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- Automated builds on pull requests
- Docker image creation on merge to main
- Deployment to AWS ECR

## 🧪 Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run linting (if configured)
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is proprietary software. Unauthorized copying, modification, or distribution is prohibited.

## ⚠️ Security Policy

If you discover a security vulnerability, please report it responsibly by contacting the development team directly. Do not open public issues for security vulnerabilities.

---

**Note**: This README provides general information. For detailed documentation and internal configurations, please refer to the internal documentation.
