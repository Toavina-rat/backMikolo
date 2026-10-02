const app = require('./app');
const initDb = require('./database/initDb');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Attempt DB initialisation on server startup
    await initDb();
  } catch (err) {
    console.warn('⚠️ Base de données non prête lors du démarrage initial:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Serveur Express Mikolo Events lancé avec succès !`);
    console.log(`🌐 URL API : http://localhost:${PORT}/api`);
    console.log(`📡 Health Check : http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
}

startServer();
