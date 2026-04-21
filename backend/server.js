import app from './src/app.js';
import { AppConfig } from './src/config/config.js';
import dbConnection from './src/config/db.js';

// Use PORT from environment variable, fallback to 3000
// This ensures compatibility with Render and other cloud platforms
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await dbConnection();
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
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
