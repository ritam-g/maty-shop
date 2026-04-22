import app from './src/app.js';
import { AppConfig } from './src/config/config.js';
import dbConnection from './src/config/db.js';

/**
 * Server Port Configuration
 * 
 * LOCALHOST (Development):
 * - Set PORT=5000 in .env for development
 * - Backend will run on: http://localhost:5000
 * 
 * PRODUCTION (Render):
 * - Uses PORT from environment variable
 * - Default fallback: 3000
 */
const PORT = process.env.PORT || 5000; // Changed default to 5000 for local development

const startServer = async () => {
  try {
    await dbConnection();
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      // LOCAL DEVELOPMENT MESSAGE
      if (PORT === 5000) {
        console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
