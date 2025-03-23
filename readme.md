# Pinterest Clone 📌✨

A full-stack Pinterest clone built with modern web technologies. Features image uploading, user authentication, and a seamless user experience.

## Features ✨

- 🔒 JWT Authentication & Authorization
- 📸 Image upload and management with ImageKit
- 🌐 Infinite scrolling with TanStack Query
- 🟢 User profile and post management
- 📱 Responsive design
- 🔄 Global state management with Zustand

## Tech Stack 🛠️

**Client:**

- React.js
- Zustand
- TanStack Query
- ImageKit

**Server:**

- Node.js
- Express.js (v5)
- MongoDB
- Mongoose
- JWT
- Express-fileupload

## Environment Variables

### Client

Create a `.env` file in the client directory and define the following variables:

```env
VITE_API_ENDPOINT=your_api_endpoint
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### Server

Create a `.env` file in the server directory:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string
PORT=your_server_port

# Authentication
JWT_SECRET=your_jwt_secret_key

# Environment Mode
NODE_ENV=your_environment_mode
```
