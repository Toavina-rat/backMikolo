const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function initDb() {
  console.log('🚀 Starting PostgreSQL Database Initialization...');
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    console.log('📜 Executing schema.sql...');
    await pool.query(schemaSql);
    console.log('✅ Tables created/verified.');

    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    console.log('🌱 Executing seed.sql...');
    await pool.query(seedSql);
    console.log('✅ Initial seed data inserted.');

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Please make sure your PostgreSQL server is running and accessible.');
    }
  }
}

if (require.main === module) {
  initDb().then(() => pool.end());
}

module.exports = initDb;
