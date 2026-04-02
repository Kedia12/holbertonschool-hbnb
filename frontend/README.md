# HBnB Frontend

Modern and responsive frontend for the HBnB application built with React, Tailwind CSS, and Axios.

## Features

✨ **Core Features:**
- 🔐 User authentication (Login & Register)
- 🏠 Browse all available places
- 🔍 Filter places by price range
- 📍 View detailed place information
- ⭐ Leave and view reviews
- 📝 List your own places (authenticated users)
- 👤 User profile management
- 📱 Fully responsive design

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Leaflet** - Map integration

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── index.js              # API endpoints configuration
│   ├── components/
│   │   ├── Layout.js             # Header & Footer components
│   │   └── ProtectedRoute.js     # Protected route wrapper
│   ├── contexts/
│   │   └── AuthContext.js        # Authentication context
│   ├── pages/
│   │   ├── HomePage.js           # Places listing page
│   │   ├── LoginPage.js          # Login page
│   │   ├── RegisterPage.js       # Registration page
│   │   ├── PlaceDetailPage.js    # Place details & reviews
│   │   └── CreatePlacePage.js    # Create new place
│   ├── App.js                    # Main app component
│   ├── index.js                  # React entry point
│   └── index.css                 # Global styles
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── .env
```

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file with:
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from create-react-app

## API Integration

The frontend connects to the HBnB API running on `http://localhost:5000/api/v1`

### Supported Endpoints

**Authentication:**
- `POST /auth/login` - User login
- `POST /users/` - User registration

**Places:**
- `GET /places/` - List all places
- `GET /places/<id>` - Get place details
- `POST /places/` - Create new place (authenticated)
- `PUT /places/<id>` - Update place (owner/admin)

**Reviews:**
- `POST /reviews/` - Create review (authenticated)
- `PUT /reviews/<id>` - Update review (owner/admin)
- `DELETE /reviews/<id>` - Delete review (owner/admin)

**Amenities:**
- `GET /amenities/` - List all amenities
- `POST /amenities/` - Create amenity (admin)
- `PUT /amenities/<id>` - Update amenity (admin)

## Pages

### Home Page (`/`)
- Browse all available places
- Filter by price range
- Click on place cards to view details

### Login Page (`/login`)
- Email and password authentication
- Link to registration page

### Register Page (`/register`)
- Create new account
- First and last name required
- Password confirmation

### Place Detail Page (`/place/:id`)
- Full place information
- Location coordinates
- Average rating and reviews
- Leave a review (authenticated users)

### Create Place Page (`/create-place`)
- List a new property
- Set title, description, price, and coordinates
- Protected route (authentication required)

## Styling

The frontend uses Tailwind CSS for styling with a custom color scheme:
- Primary: Purple (#8B5CF6)
- Secondary: Pink (#EC4899)
- Accent: Amber (#F59E0B)

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is automatically added to all API requests
4. Protected routes redirect to login if not authenticated
5. Logout clears token and user data

## Error Handling

- API errors are caught and displayed to users
- Form validation with clear error messages
- Loading states for async operations
- Graceful fallbacks for missing data

## Future Enhancements

- [ ] Map view for places
- [ ] Advanced search and filters
- [ ] User profile page
- [ ] Booking system
- [ ] Payment integration
- [ ] Email notifications
- [ ] Image uploads for places
- [ ] Admin dashboard
- [ ] Favorites/Wishlist

## License

This project is part of the HBnB educational application.
