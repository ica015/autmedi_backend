import { Request, Response } from 'express';
import { AvailableHealthPlan } from '../models/available_health_plan.model';
import { AuthenticatedRequest } from '../types/express';
import { Op } from 'sequelize';

// Criar um novo plano de saúde
export const createHealthPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan_name, is_active } = req.body;

    const newPlan = await AvailableHealthPlan.create({
      plan_name,
      is_active,
    });

    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar plano de saúde', error: (error as Error).message });
  }
};

// Obter todos os planos de saúde
export const getAllHealthPlans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const healthPlans = await AvailableHealthPlan.findAll({
        order:[
            ['plan_name','asc']
        ]
    });
    res.status(200).json(healthPlans);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter planos de saúde', error: (error as Error).message });
  }
};

// Obter um plano de saúde por ID
export const getHealthPlanById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan_id } = req.params;

    const healthPlan = await AvailableHealthPlan.findByPk(plan_id);

    if (!healthPlan) {
      return res.status(404).json({ message: 'Plano de saúde não encontrado' });
    }

    res.status(200).json(healthPlan);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter plano de saúde', error: (error as Error).message });
  }
};

// Atualizar um plano de saúde por ID
export const updateHealthPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan_id } = req.params;
    const { plan_name, is_active } = req.body;

    const [updated] = await AvailableHealthPlan.update(
      { plan_name, is_active },
      { where: { plan_id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Plano de saúde não encontrado' });
    }

    const updatedPlan = await AvailableHealthPlan.findByPk(plan_id);
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar plano de saúde', error: (error as Error).message });
  }
};

// Remover um plano de saúde por ID
export const deleteHealthPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan_id } = req.params;

    const deleted = await AvailableHealthPlan.destroy({ where: { plan_id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Plano de saúde não encontrado' });
    }

    res.status(204).send({message: 'Registro excluído com sucesso'}); // No content
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover plano de saúde', error: (error as Error).message });
  }
};

// Buscar plano de saúde por nome
export const searchHealthPlanByName = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan_name } = req.params;

    const healthPlans = await AvailableHealthPlan.findAll({
      where: { 
        plan_name: {
          [Op.iLike]: `%${plan_name}%` // Usando Op.iLike para busca case-insensitive e parcial
        }
      }
    });

    if (healthPlans.length === 0) {
      return res.status(404).json({ message: 'Nenhum plano de saúde encontrado com esse nome' });
    }

    res.status(200).json(healthPlans);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar plano de saúde por nome', error: (error as Error).message });
  }
};