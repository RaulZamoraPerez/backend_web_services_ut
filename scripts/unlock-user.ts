#!/usr/bin/env ts-node
import 'dotenv/config';
import sequelize from '../src/config/database';
import User from '../src/models/User';

async function unlock(usernameOrEmail: string) {
  await sequelize.authenticate();
  const { Op } = require('sequelize');
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    }
  });

  if (!user) {
    console.error('Usuario no encontrado:', usernameOrEmail);
    process.exit(1);
  }

  await user.resetFailedAttempts();
  console.log(`Cuenta desbloqueada para usuario: ${user.username} (id: ${user.id})`);
  await sequelize.close();
}

const arg = process.argv[2];
if (!arg) {
  console.error('Uso: unlock-user.ts <username|email>');
  process.exit(1);
}

unlock(arg).catch(err => {
  console.error('Error desbloqueando usuario:', err);
  process.exit(1);
});
