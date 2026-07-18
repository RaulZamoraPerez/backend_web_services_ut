import { Request, Response } from 'express';
import { Op } from 'sequelize';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import { logSecurityEvent } from '../middleware/logging';
import crypto from 'crypto';
import { EmailService } from './email-service';

// Registrar nuevo usuario (solo admins pueden crear usuarios)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'normal' } = req.body;

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Formato de correo inválido',
        message: 'Por favor proporciona un correo electrónico válido'
      });
    }

    // Validar longitud de contraseña
    if (!password || password.length < 6) {
      return res.status(400).json({
        error: 'Contraseña demasiado corta',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar que no exista el usuario
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      logSecurityEvent('Registration attempt with existing credentials', 'warn', {
        username,
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(400).json({
        error: 'Usuario ya existe',
        message: 'El nombre de usuario o email ya están registrados'
      });
    }

    // Generar token de confirmación de cuenta
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password,
      role,
      isConfirmed: false,
      confirmationToken
    });

    logSecurityEvent('User registered successfully', 'info', {
      newUserId: user.id,
      newUsername: user.username,
      newUserRole: user.role,
      createdBy: req.user?.username || 'system',
      ip: req.ip
    });

    // Enviar email de confirmación
    try {
      const emailService = EmailService.forTramites();
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const confirmationLink = `${frontendUrl}/confirmar-cuenta?token=${confirmationToken}`;

      await emailService.sendEmail({
        to: email,
        subject: 'UTTECAM - Confirma tu cuenta',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #0A9782; margin: 0;">UTTECAM</h2>
              <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Panel de Administración</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
            <h3 style="color: #1e293b; margin-top: 0;">¡Hola ${username}!</h3>
            <p style="color: #334155; line-height: 1.5; font-size: 16px;">
              Gracias por registrarte en el Panel de Administración de la UTTECAM. Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationLink}" style="background-color: #fe6a07; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                Confirmar Cuenta
              </a>
            </div>
            <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
              Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
              <br />
              <a href="${confirmationLink}" style="color: #0A9782; word-break: break-all;">${confirmationLink}</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              Este es un correo automático, por favor no respondas a este mensaje.
            </p>
          </div>
        `
      });
      console.log(`✉️ Email de confirmación enviado exitosamente a ${email}`);
    } catch (emailError: any) {
      console.error('❌ Error al enviar email de confirmación:', emailError.message);
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente. Por favor verifica tu correo para activar tu cuenta.',
      user: user.toSafeObject()
    });

  } catch (error: any) {
    logSecurityEvent('Registration error', 'error', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo registrar el usuario'
    });
  }
};

// Login de usuario
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email: username } // Permitir login con email o username
        ]
      }
    });

    if (!user) {
      logSecurityEvent('Login attempt with non-existent user', 'warn', {
        username,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Usuario o contraseña incorrectos'
      });
    }

    // Verificar si la cuenta está confirmada
    if (!user.isConfirmed) {
      logSecurityEvent('Login attempt with unconfirmed email', 'warn', {
        userId: user.id,
        username: user.username,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(401).json({
        error: 'Cuenta no confirmada',
        message: 'Por favor confirma tu cuenta mediante el enlace enviado a tu correo electrónico'
      });
    }

    // Verificar si la cuenta está activa
    if (!user.isActive) {
      logSecurityEvent('Login attempt with inactive account', 'warn', {
        userId: user.id,
        username: user.username,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(401).json({
        error: 'Cuenta inactiva',
        message: 'Su cuenta ha sido desactivada'
      });
    }

    // Verificar si la cuenta está bloqueada
    if (user.isLocked()) {
      logSecurityEvent('Login attempt with locked account', 'warn', {
        userId: user.id,
        username: user.username,
        lockedUntil: user.lockedUntil,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(423).json({
        error: 'Cuenta bloqueada',
        message: 'Su cuenta está temporalmente bloqueada debido a múltiples intentos fallidos',
        lockedUntil: user.lockedUntil
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      await user.incrementFailedAttempts();

      logSecurityEvent('Failed login attempt', 'warn', {
        userId: user.id,
        username: user.username,
        failedAttempts: user.failedLoginAttempts,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Usuario o contraseña incorrectos',
        remainingAttempts: Math.max(0, 5 - user.failedLoginAttempts)
      });
    }

    // Login exitoso
    await user.resetFailedAttempts();

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    logSecurityEvent('Successful login', 'info', {
      userId: user.id,
      username: user.username,
      role: user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'Login exitoso',
      token,
      user: user.toSafeObject(),
      expiresIn: '24h'
    });

  } catch (error: any) {
    logSecurityEvent('Login error', 'error', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo procesar el login'
    });
  }
};

// Obtener perfil del usuario actual
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe en el sistema'
      });
    }

    res.json({
      message: 'Perfil obtenido exitosamente',
      user: user.toSafeObject()
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el perfil'
    });
  }
};

// Cambiar contraseña
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user!.id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe en el sistema'
      });
    }

    // Verificar contraseña actual
    const isValidPassword = await user.checkPassword(currentPassword);

    if (!isValidPassword) {
      logSecurityEvent('Failed password change attempt', 'warn', {
        userId: user.id,
        username: user.username,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(401).json({
        error: 'Contraseña incorrecta',
        message: 'La contraseña actual no es correcta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    logSecurityEvent('Password changed successfully', 'info', {
      userId: user.id,
      username: user.username,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo cambiar la contraseña'
    });
  }
};

// Listar usuarios (solo admins)
export const listUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    const whereClause: any = {};
    if (role) whereClause.role = role;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Usuarios obtenidos exitosamente',
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalUsers: count,
        usersPerPage: Number(limit)
      }
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los usuarios'
    });
  }
};

// Actualizar usuario (solo admins)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, role, isActive } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe en el sistema'
      });
    }

    // Actualizar campos
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    logSecurityEvent('User updated by admin', 'info', {
      updatedUserId: user.id,
      updatedUsername: user.username,
      updatedBy: req.user!.username,
      changes: { username, email, role, isActive },
      ip: req.ip
    });

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: user.toSafeObject()
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el usuario'
    });
  }
};

// Eliminar usuario (solo admins)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // No permitir que un admin se elimine a sí mismo
    if (Number(id) === req.user!.id) {
      return res.status(400).json({
        error: 'Operación no permitida',
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe en el sistema'
      });
    }

    const deletedUserInfo = user.toSafeObject();
    await user.destroy();

    logSecurityEvent('User deleted by admin', 'warn', {
      deletedUserId: deletedUserInfo.id,
      deletedUsername: deletedUserInfo.username,
      deletedBy: req.user!.username,
      ip: req.ip
    });

    res.json({
      message: 'Usuario eliminado exitosamente',
      deletedUser: deletedUserInfo
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el usuario'
    });
  }
};

// Confirmar cuenta de usuario
export const confirmAccount = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      where: { confirmationToken: token }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'El token de confirmación es inválido o ya ha sido utilizado'
      });
    }

    user.isConfirmed = true;
    user.confirmationToken = null as any;
    await user.save();

    logSecurityEvent('User confirmed account successfully', 'info', {
      userId: user.id,
      username: user.username,
      ip: req.ip
    });

    res.json({
      message: 'Cuenta confirmada exitosamente. Ya puedes iniciar sesión.'
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo confirmar la cuenta'
    });
  }
};

// Solicitar recuperación de contraseña (Forgot Password)
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      // Por seguridad no revelamos si el email existe, pero retornamos un mensaje general
      return res.json({
        message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.'
      });
    }

    // Generar token y expiración (1 hora)
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();

    // Enviar email con link de recuperación
    try {
      const emailService = EmailService.forTramites();
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetLink = `${frontendUrl}/restablecer-contra?token=${resetToken}`;

      await emailService.sendEmail({
        to: email,
        subject: 'UTTECAM - Restablecer Contraseña',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #0A9782; margin: 0;">UTTECAM</h2>
              <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Panel de Administración</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
            <h3 style="color: #1e293b; margin-top: 0;">¡Hola ${user.username}!</h3>
            <p style="color: #334155; line-height: 1.5; font-size: 16px;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si tú no realizaste esta solicitud, puedes ignorar este correo.
            </p>
            <p style="color: #334155; line-height: 1.5; font-size: 16px;">
              Para restablecer tu contraseña, haz clic en el siguiente botón (el enlace expira en 1 hora):
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #fe6a07; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                Restablecer Contraseña
              </a>
            </div>
            <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
              Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
              <br />
              <a href="${resetLink}" style="color: #0A9782; word-break: break-all;">${resetLink}</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              Este es un correo automático, por favor no respondas a este mensaje.
            </p>
          </div>
        `
      });
      console.log(`✉️ Email de recuperación enviado a ${email}`);
    } catch (emailError: any) {
      console.error('❌ Error al enviar email de recuperación:', emailError.message);
    }

    res.json({
      message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.'
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo procesar la solicitud de recuperación'
    });
  }
};

// Restablecer contraseña con el Token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Token inválido o expirado',
        message: 'El enlace para restablecer la contraseña es inválido o ha expirado.'
      });
    }

    // Guardar nueva contraseña
    user.password = newPassword;
    user.resetPasswordToken = null as any;
    user.resetPasswordExpires = null as any;
    await user.save();

    logSecurityEvent('User reset password successfully', 'info', {
      userId: user.id,
      username: user.username,
      ip: req.ip
    });

    res.json({
      message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.'
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo restablecer la contraseña'
    });
  }
};