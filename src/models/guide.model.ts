// models/guide.ts

import {
    Model,
    DataTypes,
    Optional,
    Sequelize,
  } from 'sequelize';
  import sequelize from '../config/database';
  import  {Client}  from './';
  import  {Professional}  from './';
  import  {HealthPlan}  from './';
  import  {Service}  from './';
  
  // Interface que define os atributos de Guide
  export interface GuideAttributes {
    guide_id: number;
    client_id: number;
    professional_id: number;
    plan_id: number;
    service_id: number;
    guide_type: 'consultation' | 'procedure';
    created_at?: Date;
    updated_at?: Date;
  }
  
  // Interface que define os atributos necessários para criar um novo Guide
  export interface GuideCreationAttributes
    extends Optional<GuideAttributes, 'guide_id' | 'created_at' | 'updated_at'> {}
  
  // Classe que define o modelo Guide
  export class Guide
    extends Model<GuideAttributes, GuideCreationAttributes>
    implements GuideAttributes
  {
    public guide_id!: number;
    public client_id!: number;
    public professional_id!: number;
    public plan_id!: number;
    public service_id!: number;
    public guide_type!: 'consultation' | 'procedure';
    public created_at!: Date;
    public updated_at!: Date;
  
    // Métodos de associação
    public static associate(models: any) {
      
    }
  }
  
  // Função para inicializar o modelo
  Guide.init(
      {
        guide_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        client_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        professional_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        plan_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        service_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        guide_type: {
          type: DataTypes.ENUM('consultation', 'procedure'),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'guides',
        modelName: 'Guide',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  
  export default Guide;
  