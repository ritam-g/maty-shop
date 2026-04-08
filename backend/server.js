import app from './src/app.js';
import { AppConfig } from './src/config/config.js';
import dbConnection from './src/config/db.js';

const PORT =AppConfig.PORT || 3000;

const startServer = async () => {
  await dbConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
