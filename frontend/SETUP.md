# HBnB Frontend - Installation & Setup Guide

## Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **Git**
- The HBnB API running on `http://localhost:5000`

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 3. Configure API Connection

The frontend is pre-configured to connect to `http://localhost:5000/api/v1`. If your API is running on a different URL, update the `.env` file:

```
REACT_APP_API_URL=http://your-api-url:port/api/v1
```

## Project Setup Details

### 1. Node Modules Installation

```bash
npm install
```

This installs all dependencies specified in `package.json`:
- React 18
- React Router v6
- Tailwind CSS
- Axios
- React Icons
- And more...

### 2. Environment Configuration

Create a `.env` file in the `frontend` directory (already created):

```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### 3. Development Server

Start the development server with hot reload:

```bash
npm run dev
```

This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

### Production Build

```bash
npm run build
```

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### Run Tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

### Deploy Build

```bash
npm run eject
```

**Note:** This operation is one-way!

## Architecture Overview

### Folder Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── index.js              # Axios instance & API calls
│   ├── components/
│   │   ├── Layout.js             # Header & Footer
│   │   ├── ProtectedRoute.js     # Auth wrapper
│   │   └── UI.js                 # Reusable UI components
│   ├── contexts/
│   │   └── AuthContext.js        # Auth state management
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── PlaceDetailPage.js
│   │   ├── CreatePlacePage.js
│   │   ├── MyPlacesPage.js
│   │   └── AdminAmenitiesPage.js
│   ├── App.js                    # Main component
│   ├── index.js                  # Entry point
│   └── index.css                 # Global styles
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── .env
```

## API Connection Setup

### Verify API is Running

Before starting the frontend, ensure the backend is running:

```bash
cd part4/hbnb
python run.py
```

The API should be available at `http://localhost:5000/api/v1`

Test the connection:
```bash
curl http://localhost:5000/api/v1/places/
```

### Authentication Flow

1. User registers/logs in
2. API returns JWT token
3. Token stored in localStorage
4. Token sent with all API requests
5. Protected routes redirect to login if not authenticated

## Features Walkthrough

### Public Routes

- **`/`** - Browse all places with price filtering
- **`/login`** - User login
- **`/register`** - User registration
- **`/place/:id`** - Place details and reviews

### Protected Routes (Requires Authentication)

- **`/create-place`** - List a new property
- **`/my-places`** - Manage your listings
- **`/admin/amenities`** - Manage amenities (admin only)

## Styling

The frontend uses **Tailwind CSS** for styling with a custom color palette:

- **Primary**: Purple (#8B5CF6)
- **Secondary**: Pink (#EC4899)
- **Accent**: Amber (#F59E0B)

### Custom CSS

Global styles are defined in `src/index.css`:
- Custom animations
- Utility classes
- Scrollbar styling
- Focus states

### Tailwind Configuration

Customize at `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: "#8B5CF6",
      secondary: "#EC4899",
      accent: "#F59E0B",
    },
  },
}
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or specify a different port
PORT=3001 npm run dev
```

### API Connection Errors

1. Check API is running: `curl http://localhost:5000/api/v1/places/`
2. Verify `.env` file has correct API URL
3. Check browser console for CORS errors
4. Ensure API allows requests from `http://localhost:3000`

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Login Issues

- Ensure backend database is initialized with test data
- Check that email/password are correct
- Look at browser console for error messages

## Testing the Application

### Manual Testing Checklist

1. **Authentication**
   - [ ] Can register a new account
   - [ ] Can log in with valid credentials
   - [ ] Cannot log in with invalid credentials
   - [ ] Token persists after page reload

2. **Places**
   - [ ] Can view all places on home page
   - [ ] Price filter works correctly
   - [ ] Can click on place to view details
   - [ ] Can view reviews on place detail page

3. **Create Place**
   - [ ] Cannot access without login
   - [ ] Can create place with all fields
   - [ ] Place appears in listings
   - [ ] Can view own place in "My Places"

4. **Reviews**
   - [ ] Can leave review on place (authenticated)
   - [ ] Cannot leave review on own place
   - [ ] Can view all reviews
   - [ ] Review displays with rating

## Performance Optimization

- **Code Splitting**: Routes are lazy-loaded
- **Asset Optimization**: CSS is minified and purged
- **Bundle Analysis**: Use `npm run build` to analyze bundle

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms

Copy the `build` folder to your hosting platform.

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Blank page | Open browser console, check for errors |
| API 404 errors | Verify API URL in `.env` |
| Login fails | Check database has test user |
| Styles not loading | Clear browser cache, restart dev server |
| CORS errors | Ensure API allows frontend origin |

## Development Tips

### Using Browser DevTools

1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Check `token` is stored after login
4. Check Network tab for API calls

### Debug API Calls

Add console logs in `src/api/index.js`:
```javascript
api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

## Next Steps

1. Customize branding and colors
2. Add more pages (favorites, bookings, etc.)
3. Implement image uploads
4. Add map view with Leaflet
5. Implement real-time notifications
6. Add unit and integration tests
7. Set up CI/CD pipeline

## Support

For issues or questions:
1. Check the README.md file
2. Review browser console for errors
3. Verify API is running correctly
4. Check network tab in DevTools

## License

This project is part of the HBnB educational application.
