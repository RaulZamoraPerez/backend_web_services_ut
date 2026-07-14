import sequelize from '../src/config/database';
import { DataTypes } from 'sequelize';

const addThemeColumn = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const queryInterface = sequelize.getQueryInterface();
    
    // Check if column exists first to avoid errors
    const tableDescription = await queryInterface.describeTable('relojes_digitales');
    
    if (!tableDescription.tema) {
      await queryInterface.addColumn('relojes_digitales', 'tema', {
        type: DataTypes.ENUM('light', 'dark', 'blue', 'minimal'),
        defaultValue: 'light',
      });
      console.log('Column "tema" added successfully.');
    } else {
      console.log('Column "tema" already exists.');
    }

  } catch (error) {
    console.error('Unable to connect to the database or add column:', error);
  } finally {
    await sequelize.close();
  }
};

addThemeColumn();
