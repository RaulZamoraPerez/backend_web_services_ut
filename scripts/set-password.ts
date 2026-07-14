#!/usr/bin/env ts-node
import 'dotenv/config';
import sequelize from '../src/config/database';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

async function setPassword(usernameOrEmail: string, newPassword: string) {
  await sequelize.authenticate();
  const { Op } = require('sequelize');
  const user = await User.findOne({ where: { [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }] } });
  if (!user) {
    console.error('Usuario no encontrado:', usernameOrEmail);
    process.exit(1);
  }

  // Assign plaintext so model hook hashes it consistently
  user.password = newPassword as any;
  await user.resetFailedAttempts();
  await user.save();

  console.log(`Contraseña actualizada para usuario: ${user.username} (id: ${user.id})`);
  await sequelize.close();
}

const username = process.argv[2];
const newPassword = process.argv[3];
if (!username || !newPassword) {
  console.error('Uso: set-password.ts <username|email> <newPassword>');
  process.exit(1);
}

setPassword(username, newPassword).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
