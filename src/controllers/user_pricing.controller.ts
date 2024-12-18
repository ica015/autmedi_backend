import { Request, Response } from 'express';
import {UserPricing} from '../models';
import { AuthenticatedRequest } from '../types/express'; // Ajuste conforme o caminho correto


//Gerar Faturas
export const createUserPricing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id, amount, payment_date, due_date, contract_start_date, contract_end_date, transaction_id, comments, status } = req.body;
    console.log(req.user!.rule)
    console.log(req.user!.user_id)
    if (req.user!.rule !== 'admin' && req.user!.user_id !== user_id) {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    const userPricing = await UserPricing.create({
      user_id,
      amount,
      payment_date,
      due_date,
      contract_start_date,
      contract_end_date,
      transaction_id,
      comments,
      status,
    });

    res.status(201).json(userPricing);
  } catch (error) {
    if (error instanceof Error)
    res.status(500).json({ message: 'Erro ao criar fatura', error: error.message });
  }
};

//Buscar fatura por ID
export const getUserPricingById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { user_pricing_id } = req.params;
  
      const userPricing = await UserPricing.findByPk(user_pricing_id);
  
      if (!userPricing) {
        return res.status(404).json({ message: 'Fatura não encontrada' });
      }
  
      if (req.user!.rule !== 'admin' && userPricing.user_id !== req.user!.user_id) {
        return res.status(403).json({ message: 'Acesso não autorizado' });
      }
  
      res.status(200).json(userPricing);
    } catch (error) {
        if (error instanceof Error)
      res.status(500).json({ message: 'Erro ao buscar fatura', error: error.message });
    }
  };
  
  //Atualizar Fatura
  export const updateUserPricing = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { user_pricing_id } = req.params;
      const { amount, payment_date, due_date, contract_start_date, contract_end_date, transaction_id, comments, status } = req.body;
  
      const userPricing = await UserPricing.findByPk(user_pricing_id);
  
      if (!userPricing) {
        return res.status(404).json({ message: 'Fatura não encontrada' });
      }
  
      if (req.user!.rule !== 'admin' && userPricing.user_id !== req.user!.user_id) {
        return res.status(403).json({ message: 'Acesso não autorizado' });
      }
  
      // Verificar se o campo foi passado no corpo da requisição, inclusive para valores null
      if (amount !== undefined) userPricing.amount = amount;
      if (payment_date !== undefined) userPricing.payment_date = payment_date; // Pode ser null ou data válida
      if (due_date !== undefined) userPricing.due_date = due_date;
      if (contract_start_date !== undefined) userPricing.contract_start_date = contract_start_date;
      if (contract_end_date !== undefined) userPricing.contract_end_date = contract_end_date;
      if (transaction_id !== undefined) userPricing.transaction_id = transaction_id;
      if (status !== undefined) userPricing.status = status;
      if (comments !== undefined) userPricing.comments = comments;
  
      await userPricing.save();
  
      res.status(200).json(userPricing);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Erro ao atualizar fatura', error: error.message });
      }
    }
  };
  
  //Excluir uma Fatura
  export const deleteUserPricing = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { user_pricing_id } = req.params;
  
      const userPricing = await UserPricing.findByPk(user_pricing_id);
  
      if (!userPricing) {
        return res.status(404).json({ message: 'Fatura não encontrada' });
      }
  
      if (req.user!.rule !== 'admin' && userPricing.user_id !== req.user!.user_id) {
        return res.status(403).json({ message: 'Acesso não autorizado' });
      }
  
      await userPricing.destroy();
  
      res.status(200).json({message: "Fatura excluída com sucesso"});
    } catch (error) {
        if (error instanceof Error)
      res.status(500).json({ message: 'Erro ao excluir fatura', error: error.message });
    }
  };
  
  //Listar Faturas com Filtro
  import { Op } from 'sequelize';

export const listUserPricing = async (req: AuthenticatedRequest, res: Response) => {
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
      whereClause.payment_date = {
        [Op.between]: [new Date(start_date as string), new Date(end_date as string)],
      };
    }

    const userPricings = await UserPricing.findAll({ where: whereClause });

    res.status(200).json(userPricings);
  } catch (error) {
    if (error instanceof Error)
    res.status(500).json({ message: 'Erro ao listar faturas', error: error.message });
  }
};
