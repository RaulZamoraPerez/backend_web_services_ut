import { Request, Response } from 'express';
import { Op } from 'sequelize';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import { logSecurityEvent } from '../middleware/logging';

// Registrar nuevo usuario (solo admins pueden crear usuarios)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'viewer' } = req.body;

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

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password,
      role
    });

    logSecurityEvent('User registered successfully', 'info', {
      newUserId: user.id,
      newUsername: user.username,
      newUserRole: user.role,
      createdBy: req.user?.username || 'system',
      ip: req.ip
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
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