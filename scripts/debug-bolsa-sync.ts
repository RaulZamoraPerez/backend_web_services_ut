
import dotenv from 'dotenv';
import path from 'path';
import BolsaTrabajoHeader from '../src/models/BolsaTrabajoHeader';
import BolsaTrabajoItem from '../src/models/BolsaTrabajoItem';
import sequelize from '../src/config/database';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    console.log('Dropping BolsaTrabajoItem...');
    await BolsaTrabajoItem.drop();
    console.log('✅ BolsaTrabajoItem dropped.');

    console.log('Syncing BolsaTrabajoHeader...');
    await BolsaTrabajoHeader.sync({ force: true }); // Force to recreate
    console.log('✅ BolsaTrabajoHeader synced.');

    console.log('Syncing BolsaTrabajoItem...');
    await BolsaTrabajoItem.sync({ force: true }); // Force to recreate
    console.log('✅ BolsaTrabajoItem synced.');

  } catch (error) {
    console.error('Unable to connect to the database or sync:', error);
  } finally {
    await sequelize.close();
  }
};

run();
