# 🩸 Blood Bank Management System

A comprehensive full-stack web application designed to streamline blood donation management, inventory tracking, and donor coordination between hospitals, organizations, and donors. Built with modern web technologies and deployed on cloud platforms for maximum accessibility and reliability.

## 🌟 Project Overview

The Blood Bank Management System is a complete solution for managing blood donation operations, providing real-time inventory tracking, donor management, and analytics for healthcare organizations. The system facilitates seamless communication between donors, hospitals, and blood banks while ensuring efficient blood supply chain management.

## ✨ Key Features

### 🔐 **Multi-Role Authentication System**
- **Admin Dashboard**: Complete system oversight and user management
- **Hospital Management**: Blood inventory tracking and patient management
- **Organization Management**: Donor coordination and blood collection
- **Donor Portal**: Personal donation history and certificate generation

### 🩺 **Blood Inventory Management**
- Real-time blood stock monitoring by blood group
- Inventory type classification (Whole Blood, Plasma, Platelets)
- Quantity tracking in milliliters
- Expiry date management and alerts
- Low stock notifications

### 👥 **Donor Management**
- Comprehensive donor registration and profiling
- Donation history tracking
- Eligibility verification system
- QR code-enabled donation certificates
- Donor communication tools

### 🏥 **Hospital Integration**
- Blood request and allocation system
- Patient blood requirement tracking
- Emergency blood request handling
- Hospital-specific inventory management
- Blood usage analytics

### 📊 **Analytics & Reporting**
- Real-time dashboard with key metrics
- Blood donation trends and statistics
- Inventory turnover analysis
- Donor engagement reports
- Hospital utilization data

### 📱 **Modern User Interface**
- Responsive design for all devices
- Intuitive navigation and user experience
- Real-time notifications and alerts
- Professional certificate generation
- Mobile-friendly interface

## 🛠️ Technology Stack

### **Frontend**
- **React.js** - Modern UI framework with hooks and functional components
- **Redux Toolkit** - State management for complex application state
- **React Router** - Client-side routing and navigation
- **Bootstrap 5** - Responsive CSS framework for modern design
- **React Toastify** - User notification system
- **Axios** - HTTP client for API communication

### **Backend**
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for secure authentication
- **CORS** - Cross-Origin Resource Sharing configuration

### **Deployment & Infrastructure**
- **Frontend**: Netlify (https://bloodbankmanagementsystem1.netlify.app)
- **Backend**: Render (https://blood-bank-management-system-f0wa.onrender.com)
- **Database**: MongoDB Atlas (Cloud-hosted)
- **Version Control**: Git & GitHub

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB Atlas account (free tier available)
- Git for version control

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divyanshjaiswal2311/Blood-Bank-Management-System.git
   cd Blood-Bank-Management-System
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

5. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

6. **Configure frontend environment**
   Create a `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api/v1
   ```

7. **Start the frontend application**
   ```bash
   npm start
   ```

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/current-user` - Get current user data

### Inventory Management
- `GET /api/v1/inventory/get-inventory` - Get all inventory
- `POST /api/v1/inventory/create-inventory` - Add new inventory
- `PUT /api/v1/inventory/update-inventory/:id` - Update inventory
- `DELETE /api/v1/inventory/delete-inventory/:id` - Delete inventory

### Analytics
- `GET /api/v1/analytics/blood-group-data` - Blood group statistics
- `GET /api/v1/analytics/recent-inventory` - Recent inventory data
- `GET /api/v1/analytics/donor-stats` - Donor statistics

### Admin Management
- `GET /api/v1/admin/get-all-users` - Get all users
- `GET /api/v1/admin/get-all-hospitals` - Get all hospitals
- `GET /api/v1/admin/get-all-organizations` - Get all organizations

## 🏗️ Project Structure

```
Blood-Bank-Management-System/
├── client/                     # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── redux/             # State management
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
├── config/                     # Database configuration
├── controllers/                # API route controllers
├── middlewares/                # Express middlewares
├── models/                     # MongoDB schemas
├── routes/                     # API routes
└── server.js                   # Main server file
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/bloodbank
JWT_SECRET=your-super-secure-jwt-secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env)**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api/v1
```

## 🚀 Deployment

### Frontend Deployment (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build command: `cd client && npm install && npm run build`
3. Set publish directory: `client/build`
4. Configure environment variables in Netlify dashboard

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Configure environment variables in Render dashboard

## 📊 Features in Detail

### **Role-Based Access Control**
- **Admin**: Full system access, user management, analytics
- **Hospital**: Blood inventory management, patient records
- **Organization**: Donor coordination, blood collection
- **Donor**: Personal donation history, certificates

### **Blood Inventory Features**
- Real-time stock monitoring
- Blood group categorization (A+, A-, B+, B-, AB+, AB-, O+, O-)
- Inventory type classification
- Quantity tracking with units
- Expiry date management
- Low stock alerts

### **Donor Management**
- Comprehensive donor profiles
- Donation eligibility tracking
- Donation history and certificates
- QR code generation for certificates
- Communication tools

### **Analytics Dashboard**
- Real-time blood stock visualization
- Donation trends and patterns
- Hospital utilization metrics
- Donor engagement analytics
- Inventory turnover reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Divyanshu Jaiswal**
- GitHub: [@Divyanshjaiswal2311](https://github.com/Divyanshjaiswal2311)
- Project: Blood Bank Management System

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database hosting
- Netlify for frontend hosting
- Render for backend hosting
- Bootstrap for UI components
- React community for excellent documentation

## 📞 Support

For support, email support@bloodbank.com or create an issue in the GitHub repository.

---

**⭐ Star this repository if you find it helpful!**

**🔗 Live Demo**: [https://bloodbankmanagementsystem1.netlify.app](https://bloodbankmanagementsystem1.netlify.app)
