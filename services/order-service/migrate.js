const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database(process.env.DATABASE_PATH || './orders.db');

const migrationsDir = path.join(__dirname, 'migrations');

fs.readdirSync(migrationsDir).sort().forEach(file => {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`🚀 Running migration: ${file}`);
    db.exec(sql);
});

console.log('✅ Migrations applied successfully!');
db.close();
