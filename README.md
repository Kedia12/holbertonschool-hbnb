# HBnB - Holbertonschool Project

A complete full-stack application for booking and managing vacation rentals, built with Flask backend and React frontend.

## 📋 Project Overview

HBnB is a web application that allows users to:
- Browse and discover vacation rental properties
- Create and manage their own listings
- Leave reviews on places
- Manage amenities (admin)
- Filter places by price, location, and other criteria
- Secure authentication with JWT tokens

## 🏗️ Architecture

```
HBnB Project
│
├── Backend (Flask API)
│   └── part4/hbnb/
│       ├── app/
│       │   ├── models/        (SQLAlchemy models)
│       │   ├── api/           (REST endpoints)
│       │   ├── services/      (Business logic)
│       │   └── persistence/   (Database layer)
│       ├── config.py
│       ├── run.py
│       └── requirements.txt
│
└── Frontend (React App)
    └── frontend/
        ├── src/
        │   ├── pages/         (Page components)
        │   ├── components/    (Reusable components)
        │   ├── contexts/      (React Context)
        │   ├── api/           (API calls)
        │   └── index.css      (Global styles)
        ├── public/
        │   └── index.html
        ├── package.json
        ├── tailwind.config.js
        └── .env
```

## 🚀 Quick Start

### Prerequisites

- Node.js v14+ and npm v6+
- Python 3.8+
- Git
- A code editor (VS Code recommended)

### Installation

#### 1. Clone the repository (if needed)
```bash
git clone <repository-url>
cd holbertonschool-hbnb-1
```

#### 2. Run the setup script
```bash
# macOS/Linux
bash setup.sh

# Windows (use Git Bash or WSL)
./setup.sh
```

Or manually:

#### Backend Setup
```bash
cd part4/hbnb
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# or: venv\Scripts\activate  # Windows

pip install -r requirements.txt
python run.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Running the Application

### Start Backend
```bash
cd part4/hbnb
source venv/bin/activate
python run.py
```
Backend runs at: `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:3000`

### Access the Application
Open your browser and navigate to: `http://localhost:3000`

## 📂 Project Structure

### Backend Structure
```
part4/hbnb/
├── app/
│   ├── models/
│   │   ├── base_model.py      (Base entity model)
│   │   ├── user.py            (User model)
│   │   ├── place.py           (Place/Property model)
│   │   ├── review.py          (Review model)
│   │   └── amenity.py         (Amenity model)
│   ├── api/v1/
│   │   ├── auth.py            (Authentication endpoints)
│   │   ├── users.py           (User endpoints)
│   │   ├── places.py          (Place endpoints)
│   │   ├── reviews.py         (Review endpoints)
│   │   └── amenities.py       (Amenity endpoints)
│   ├── services/
│   │   └── facade.py          (Service layer)
│   ├── persistence/
│   │   ├── repository.py      (Repository pattern)
│   │   └── user_repository.py (User-specific queries)
│   ├── extensions.py          (Flask extensions)
│   └── __init__.py            (App factory)
├── config.py                  (Configuration)
├── run.py                     (Entry point)
└── requirements.txt           (Python dependencies)
```

### Frontend Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── index.js           (Axios setup & API calls)
│   ├── components/
│   │   ├── Layout.js          (Header & Footer)
│   │   ├── UI.js              (Reusable UI components)
│   │   └── ProtectedRoute.js  (Auth wrapper)
│   ├── contexts/
│   │   └── AuthContext.js     (Auth state)
│   ├── pages/
│   │   ├── HomePage.js        (Browse places)
│   │   ├── LoginPage.js       (User login)
│   │   ├── RegisterPage.js    (User registration)
│   │   ├── PlaceDetailPage.js (Place details & reviews)
│   │   ├── CreatePlacePage.js (Create listing)
│   │   ├── MyPlacesPage.js    (User's listings)
│   │   └── AdminAmenitiesPage.js (Admin panel)
│   ├── App.js                 (Main app)
│   ├── index.js               (Entry point)
│   └── index.css              (Global styles)
├── package.json
├── tailwind.config.js
└── .env
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/users/` - User registration

### Users
- `GET /api/v1/users/<user_id>` - Get user details
- `PUT /api/v1/users/<user_id>` - Update user (admin)

### Places
- `GET /api/v1/places/` - List all places
- `POST /api/v1/places/` - Create place (authenticated)
- `GET /api/v1/places/<place_id>` - Get place details
- `PUT /api/v1/places/<place_id>` - Update place (owner/admin)

### Reviews
- `POST /api/v1/reviews/` - Create review (authenticated)
- `PUT /api/v1/reviews/<review_id>` - Update review (owner/admin)
- `DELETE /api/v1/reviews/<review_id>` - Delete review (owner/admin)

### Amenities
- `GET /api/v1/amenities/` - List all amenities
- `POST /api/v1/amenities/` - Create amenity (admin)
- `GET /api/v1/amenities/<amenity_id>` - Get amenity
- `PUT /api/v1/amenities/<amenity_id>` - Update amenity (admin)

## 🎨 Frontend Features

### Pages

1. **Home Page** (`/`)
   - Browse all available places
   - Filter by price range
   - Responsive grid layout

2. **Login Page** (`/login`)
   - Email and password authentication
   - Link to registration

3. **Register Page** (`/register`)
   - Create new account
   - Email validation
   - Password confirmation

4. **Place Detail Page** (`/place/:id`)
   - Full place information
   - Average rating
   - User reviews
   - Leave review form (authenticated)

5. **Create Place Page** (`/create-place`)
   - Create new property listing
   - Set coordinates, price, description

6. **My Places Page** (`/my-places`)
   - View own listings
   - Edit/delete places

7. **Admin Panel** (`/admin/amenities`)
   - Manage amenities
   - Add/remove amenities

### Design Features

- **Modern UI**: Tailwind CSS with gradient colors
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Easy to extend
- **Accessibility**: Semantic HTML, ARIA labels
- **Performance**: Code splitting, lazy loading
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback for async operations

## 🔐 Authentication

- JWT-based authentication
- Tokens stored in localStorage
- Automatic token refresh
- Protected routes
- Admin role support

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask
- **ORM**: SQLAlchemy
- **Database**: SQLite (development)
- **Authentication**: Flask-JWT-Extended
- **Password Hashing**: Werkzeug
- **API Documentation**: Flask-RESTX (Swagger)

### Frontend
- **Framework**: React 18
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Build Tool**: Create React App

## 📖 Documentation

- [Frontend Setup Guide](frontend/SETUP.md)
- [Frontend README](frontend/README.md)
- [Backend README](part4/hbnb/README.md)

## ⚙️ Configuration

### Environment Variables

**.env** (Frontend)
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

**config.py** (Backend)
- Database URI
- JWT configuration
- Debug mode

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd part4/hbnb
pytest
```

## 📦 Building for Production

### Backend
```bash
# Gunicorn on production
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Frontend
```bash
cd frontend
npm run build
```

Builds are optimized for production deployment.

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process on port 3000
lsof -i :3000
# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

**API Connection Error**
1. Check backend is running: `http://localhost:5000/api/v1/places/`
2. Verify `.env` has correct API URL
3. Check browser console for CORS errors

**Database Errors**
```bash
# Reset database
cd part4/hbnb
rm -f *.db
python run.py
```

**Python Dependencies Error**
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

## 📝 Features Implemented

✅ User Authentication (Register/Login)
✅ Place Listings (CRUD)
✅ Reviews (Create, Read, Update, Delete)
✅ Amenity Management
✅ Price Filtering
✅ Protected Routes
✅ Admin Functions
✅ Responsive Design
✅ Error Handling
✅ JWT Token Management

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development
- Flask best practices
- React patterns and hooks
- RESTful API design
- JWT authentication
- Database design
- State management
- Responsive design
- Component composition

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the Holbertonschool curriculum.

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the code comments
3. Check browser console for errors
4. Review API logs for backend issues

## 🚀 Future Enhancements

- [ ] Payment integration (Stripe)
- [ ] Image uploads for places
- [ ] Map view with Leaflet.js
- [ ] Real-time notifications
- [ ] Booking system
- [ ] User profile management
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Unit tests
- [ ] Integration tests
- [ ] API rate limiting
- [ ] Caching (Redis)
- [ ] Message/Chat system
- [ ] Two-factor authentication
- [ ] Social login (OAuth)

---

**Happy coding! 🎉**

For the latest updates, check the git log:
```bash
git log --oneline
```
