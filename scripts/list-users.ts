import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import sequelize from '../src/config/database';
import User from '../src/models/User';

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos:', sequelize.config.database);
    
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'isActive']
    });
    
    console.log(`\nUsuarios en la base de datos (${users.length}):`);
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

main();
