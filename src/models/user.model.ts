import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';


type checkPasswordCallBack = (err?: Error | undefined, isSame?:boolean) => void

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes{
  checkPassword: (password: string, callbackfn: checkPasswordCallBack) => void
}

interface UserAttributes {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'client';
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: 'admin' | 'client';
  public created_at!: Date;
  public updated_at!: Date;
}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'client'),
    allowNull: false,
  },
  // created_at: {
  //   type: DataTypes.DATE,
  //   defaultValue: DataTypes.NOW,
  // },
  // updated_at: {
  //   type: DataTypes.DATE,
  //   defaultValue: DataTypes.NOW,
  // },
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

export default User;
