Voices Under Fire 🌐🔥
A Secure Anonymous Emergency Alert and Crisis Response Platform

URL of the deployed frontend application - https://voicesunderfire.vercel.app/
URL of the deployed backend API - https://crisis-response-app.onrender.com

![Frontend](<Screenshot 2025-11-22 040645.png>)


📖 Table of Contents
Overview

Features

Tech Stack

Installation

Configuration

API Documentation

Deployment

Security

Contributing

License

🎯 Overview
Voices Under Fire is a MERN stack application designed to provide secure, anonymous emergency alert broadcasting and crisis response coordination. The platform enables users to report emergencies, broadcast SOS signals, and coordinate assistance while maintaining privacy and security.

🎯 Mission
To create a safe, anonymous platform for emergency reporting and crisis response that protects user identities while facilitating rapid assistance.

✨ Features
🚨 Core Functionality
Anonymous Emergency Alerts: Submit emergency reports without revealing identity

SOS Broadcasting: Immediate distress signal broadcasting with location data

Real-time Notifications: Live alert system for nearby responders

Missing Persons Reports: Secure reporting and tracking of missing individuals

Crisis Verification: Multi-layer verification system for emergency reports

Geolocation Services: Location-based alert targeting and response coordination

🛡️ Security & Privacy
End-to-End Encryption: All communications are encrypted

Anonymous Authentication: No personal data required for basic usage

Data Minimization: Collect only essential emergency information

Secure Broadcasting: Protected alert distribution system

📱 User Experience
Responsive Design: Works on desktop, tablet, and mobile devices

Real-time Updates: Live status updates for all emergency reports

Intuitive Interface: Easy-to-use emergency reporting system

Multi-language Support: Built-in internationalization capabilities

🛠️ Tech Stack
Frontend
React.js - UI framework

Redux - State management

Material-UI - Component library

Leaflet/OpenStreetMap - Maps and geolocation

Socket.io Client - Real-time communications

Axios - HTTP client

Backend
Node.js - Runtime environment

Express.js - Web framework

MongoDB - Database

Mongoose - ODM

JWT - Authentication

Socket.io - WebSockets

bcryptjs - Password hashing

Helmet - Security middleware

CORS - Cross-origin resource sharing

Infrastructure
MongoDB Atlas - Cloud database

AWS S3 - File storage

Redis - Caching and sessions

Docker - Containerization

NGINX - Web server and reverse proxy

🚀 Installation
Prerequisites
Node.js (v16 or higher)

MongoDB (v5.0 or higher)

npm or yarn

Clone the Repository
bash
git clone https://github.com/your-username/voices-under-fire.git
cd voices-under-fire
Backend Setup
bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
Frontend Setup
bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm start
⚙️ Configuration
Environment Variables
Backend (.env)
env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/voices-under-fire

# Security
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
ENCRYPTION_KEY=your_encryption_key_here

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
Frontend (.env)
env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
📚 API Documentation
Authentication Endpoints
http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/refresh     # Refresh token
POST /api/auth/logout      # User logout
Emergency Endpoints
http
POST   /api/alerts         # Create emergency alert
GET    /api/alerts         # Get user's alerts
GET    /api/alerts/nearby  # Get nearby alerts
PUT    /api/alerts/:id     # Update alert status
DELETE /api/alerts/:id     # Delete alert

POST   /api/sos            # Broadcast SOS signal
GET    /api/sos/nearby     # Get nearby SOS alerts
Verification Endpoints
http
POST /api/verify/alert     # Verify emergency alert
POST /api/verify/user      # Verify user account
GET  /api/verify/status    # Check verification status
Missing Persons Endpoints
http
POST /api/missing-persons          # Report missing person
GET  /api/missing-persons          # List missing persons
GET  /api/missing-persons/:id      # Get missing person details
PUT  /api/missing-persons/:id      # Update missing person report
System Endpoints
http
GET /api/system/health     # System health check
GET /api/system/stats      # Platform statistics
GET /api/system/status     # Service status
🗃️ Database Schema
Users Collection
javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,
  role: String, // 'user', 'responder', 'admin'
  isVerified: Boolean,
  location: {
    type: String,
    coordinates: [Number]
  },
  createdAt: Date,
  updatedAt: Date
}
Alerts Collection
javascript
{
  _id: ObjectId,
  anonymousUserId: String,
  emergencyType: String, // 'medical', 'fire', 'police', 'other'
  location: {
    type: String,
    coordinates: [Number]
  },
  description: String,
  priority: String, // 'low', 'medium', 'high', 'critical'
  status: String, // 'active', 'resolved', 'cancelled'
  broadcastRadius: Number,
  createdAt: Date,
  expiresAt: Date
}
🚢 Deployment
Production Build
bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
serve -s build
Docker Deployment
dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
Environment-Specific Configurations
Development
env
NODE_ENV=development
DEBUG=true
CORS_ORIGIN=http://localhost:3000
Production
env
NODE_ENV=production
DEBUG=false
CORS_ORIGIN=https://yourdomain.com
🔒 Security Features
Data Protection
End-to-End Encryption: All sensitive data encrypted at rest and in transit

Anonymous Reporting: No personal data stored with emergency reports

Secure Authentication: JWT-based auth with refresh token rotation

Input Validation: Comprehensive request validation and sanitization

Access Control
Role-Based Access: Different permissions for users, responders, and admins

Rate Limiting: Protection against brute force and DDoS attacks

CORS Configuration: Strict cross-origin resource sharing policies

Helmet.js: Security headers protection

Privacy Measures
Data Anonymization: Personal identifiers removed from emergency data

Automatic Data Expiry: Emergency data automatically deleted after resolution

Limited Data Collection: Only essential information collected

User Control: Users can delete their data at any time

🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

Development Workflow
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Code Standards
Follow ESLint configuration

Write comprehensive tests

Update documentation for new features

Use conventional commit messages

📊 Monitoring & Analytics
Health Checks
bash
# Check API health
curl http://localhost:5000/api/system/health

# Check database connection
curl http://localhost:5000/api/system/status
Performance Metrics
Response time monitoring

Error rate tracking

Database performance

Memory usage statistics

🆘 Emergency Protocols
Crisis Response Workflow
Alert Creation: User submits anonymous emergency report

Verification: System validates and prioritizes the alert

Broadcasting: Alert distributed to nearby responders

Coordination: Responders coordinate assistance

Resolution: Alert marked as resolved with follow-up

Escalation Procedures
Low Priority: Automated response and monitoring

Medium Priority: Human verification and coordination

High Priority: Immediate responder mobilization

Critical Priority: Multi-agency coordination

📞 Support
For technical support or emergency platform issues:

Email: support@voicesunderfire.org

Documentation: docs.voicesunderfire.org

Community Forum: community.voicesunderfire.org

📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

🙏 Acknowledgments
Emergency response organizations and volunteers

Open source community contributors

Security researchers and privacy advocates

Beta testers and user feedback providers

⚠️ Important: This platform is designed for emergency use. In life-threatening situations, always contact local emergency services first.
