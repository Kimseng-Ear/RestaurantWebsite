const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Assuming standardized file names in models
const User = require('./models/User');
const Menu = require('./models/Menu');
const Reservation = require('./models/Reservation');
const Review = require('./models/Review');
const Gallery = require('./models/Gallery');
const Notification = require('./models/Notification');
// You can dynamically read models or safely attempt the common ones

const modelsToBackup = [
   { name: 'Users', model: User },
   { name: 'Menu', model: Menu },
   { name: 'Reservations', model: Reservation },
   { name: 'Reviews', model: Review },
   { name: 'Gallery', model: Gallery },
   { name: 'Notifications', model: Notification }
];

const backupDatabase = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      });
      console.log('✅ Connected to MongoDB for Backup...');

      const date = new Date();
      // Format: YYYY-MM-DD_HH-mm-ss
      const timestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}-${String(date.getSeconds()).padStart(2, '0')}`;
      
      const backupDir = path.join(__dirname, 'backups', timestamp);
      
      if (!fs.existsSync(backupDir)){
         fs.mkdirSync(backupDir, { recursive: true });
      }

      console.log(`📂 Starting Backup to: /backups/${timestamp}`);

      for (const item of modelsToBackup) {
         if (item.model) {
            const data = await item.model.find({});
            const extPath = path.join(backupDir, `${item.name}.json`);
            fs.writeFileSync(extPath, JSON.stringify(data, null, 2));
            console.log(`   - Saved ${item.name} (${data.length} records)`);
         }
      }

      console.log('🎉 Database Backup Completed Successfully!');
   } catch (error) {
      console.error('❌ Backup Failed:', error);
   } finally {
      await mongoose.connection.close();
      console.log('🔌 Database Connection Closed.');
      process.exit(0);
   }
};

backupDatabase();
