import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { hashPassword, verifyPassword } from '../middleware/auth';

// Definir atributos del usuario
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  isConfirmed: boolean;
  confirmationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales para creación
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isActive' | 'failedLoginAttempts' | 'lastLogin' | 'lockedUntil' | 'createdAt' | 'updatedAt' | 'isConfirmed' | 'confirmationToken' | 'resetPasswordToken' | 'resetPasswordExpires'> {}

// Definir el modelo
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public isActive!: boolean;
  public isConfirmed!: boolean;
  public confirmationToken?: string;
  public resetPasswordToken?: string;
  public resetPasswordExpires?: Date;
  public lastLogin?: Date;
  public failedLoginAttempts!: number;
  public lockedUntil?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para verificar contraseña
  public async checkPassword(password: string): Promise<boolean> {
    return await verifyPassword(password, this.password);
  }

  // Método para verificar si la cuenta está bloqueada
  public isLocked(): boolean {
    return !!(this.lockedUntil && this.lockedUntil > new Date());
  }

  // Método para incrementar intentos fallidos
  public async incrementFailedAttempts(): Promise<void> {
    this.failedLoginAttempts += 1;
    
    // Bloquear cuenta después de 5 intentos fallidos
    if (this.failedLoginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    }
    
    await this.save();
  }

  // Método para resetear intentos fallidos
  public async resetFailedAttempts(): Promise<void> {
    this.failedLoginAttempts = 0;
    this.lockedUntil = null as any; // Establecer null explícitamente para limpiar el campo en la BD
    this.lastLogin = new Date();
    await this.save();
  }

  // Método para obtener datos seguros (sin contraseña)
  public toSafeObject() {
    const { password, ...safeUser } = this.toJSON();
    return safeUser;
  }
}

// Inicializar el modelo
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        name: 'unique_username',
        msg: 'El nombre de usuario ya existe'
      },
      validate: {
        len: {
          args: [3, 50],
          msg: 'El nombre de usuario debe tener entre 3 y 50 caracteres'
        },
        isAlphanumeric: {
          msg: 'El nombre de usuario solo puede contener letras y números'
        }
      }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        name: 'unique_email',
        msg: 'El email ya está registrado'
      },
      validate: {
        isEmail: {
          msg: 'Debe ser un email válido'
        },
        len: {
          args: [5, 150],
          msg: 'El email debe tener entre 5 y 150 caracteres'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [8, 255],
          msg: 'La contraseña debe tener al menos 8 caracteres'
        }
      }
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'normal',
      validate: {
        isIn: {
          args: [['admin', 'servicios_escolares', 'servicios escolares', 'normal', 'admin_pro', 'admin pro']],
          msg: 'El rol no es válido'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    confirmationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los intentos fallidos no pueden ser negativos'
        }
      }
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['username']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['is_confirmed']
      },
      {
        fields: ['confirmation_token']
      },
      {
        fields: ['reset_password_token']
      },
      {
        fields: ['locked_until']
      }
    ],
    hooks: {
      // Hash de contraseña antes de crear
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await hashPassword(user.password);
        }
      },
      // Hash de contraseña antes de actualizar
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          user.password = await hashPassword(user.password);
        }
      }
    }
  }
);

export default User;