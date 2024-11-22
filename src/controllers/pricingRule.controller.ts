import { Request, Response } from 'express';
import { PricingRule } from '../models';
import { AuthenticatedRequest } from '../types/express';
import { Op } from 'sequelize';

// Criar Regra de Preço
export const createPricingRule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id, price_per_professional, valid_from } = req.body;

    if (req.user!.rule !== 'admin') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    const pricingRule = await PricingRule.create({
      user_id,
      price_per_professional,
      valid_from,
    });

    res.status(201).json(pricingRule);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: 'Erro ao criar regra de preço', error: error.message });
  }
};

// Buscar Regra de Preço por ID
export const getPricingRuleById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rule_id } = req.params;

    const pricingRule = await PricingRule.findByPk(rule_id);

    if (!pricingRule) {
      return res.status(404).json({ message: 'Regra de preço não encontrada' });
    }

    if (req.user!.rule !== 'admin') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    res.status(200).json(pricingRule);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: 'Erro ao buscar regra de preço', error: error.message });
  }
};

// Atualizar Regra de Preço
export const updatePricingRule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rule_id } = req.params;
    const { price_per_professional, valid_from } = req.body;

    const pricingRule = await PricingRule.findByPk(rule_id);

    if (!pricingRule) {
      return res.status(404).json({ message: 'Regra de preço não encontrada' });
    }

    if (req.user!.rule !== 'admin') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    if (price_per_professional !== undefined) pricingRule.price_per_professional = price_per_professional;
    if (valid_from !== undefined) pricingRule.valid_from = valid_from;

    await pricingRule.save();

    res.status(200).json(pricingRule);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: 'Erro ao atualizar regra de preço', error: error.message });
  }
};

// Excluir Regra de Preço
export const deletePricingRule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rule_id } = req.params;

    const pricingRule = await PricingRule.findByPk(rule_id);

    if (!pricingRule) {
      return res.status(404).json({ message: 'Regra de preço não encontrada' });
    }

    if (req.user!.rule !== 'admin') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    await pricingRule.destroy();

    res.status(200).json({ message: 'Regra de preço excluída com sucesso' });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: 'Erro ao excluir regra de preço', error: error.message });
  }
};

// Listar Regras de Preço com Filtro
export const listPricingRules = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id, start_date, end_date } = req.query;

    let whereClause: any = {};

    if (req.user!.rule !== 'admin') {
      whereClause.user_id = req.user!.user_id;
    }

    if (user_id) {
      whereClause.user_id = user_id;
    }

    if (start_date && end_date) {
      whereClause.valid_from = {
        [Op.between]: [new Date(start_date as string), new Date(end_date as string)],
      };
    }

    const pricingRules = await PricingRule.findAll({ where: whereClause,
        order:[
            ['updated_at','DESC']
        ]
     });

    res.status(200).json(pricingRules);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: 'Erro ao listar regras de preço', error: error.message });
  }
};
