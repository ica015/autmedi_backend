import { Request, Response } from 'express';
import  HealthPlan  from '../models/healthplan.model';
import { AvailableHealthPlan } from '../models/availablehealthplan.model';
import { AuthenticatedRequest } from '../types/express';
import  Client  from '../models/client.model'

export const createClientHealthPlan = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { user_id } = req.user!; // ID do usuário autenticado
        const { client_id, available_plan_id, plan_code } = req.body;
    
        // Verificar se o client_id pertence ao user_id autenticado
        const client = await Client.findOne({ where: { client_id, user_id } });
        if (!client) {
          return res.status(403).json({ message: 'Você não tem permissão para acessar este cliente.' });
        }
    
        // Verificar se o available_plan_id existe
        const availablePlan = await AvailableHealthPlan.findOne({ where: { plan_id: available_plan_id } });
        if (!availablePlan) {
          return res.status(404).json({ message: 'Plano de saúde não disponível.' });
        }
    
        // Verificar se o plano já foi cadastrado para o client_id
        const existingPlan = await HealthPlan.findOne({ 
          where: { 
            client_id, 
            available_plan_id 
          } 
        });
        if (existingPlan) {
          return res.status(400).json({ message: 'Este plano já está cadastrado para este cliente.' });
        }
    
        // Criar o plano de saúde para o cliente
        const healthPlan = await HealthPlan.create({
          client_id,
          available_plan_id,
          plan_name: availablePlan.plan_name,
          plan_code,
        });
    
        res.status(201).json(healthPlan);
      } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro inesperado ao criar o plano de saúde.' });
        }
      }
    };

export const getClientHealthPlans = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { user_id } = req.user!; // ID do usuário autenticado
    
        // Buscar todos os clients_ids associados ao user_id autenticado
        const clients = await Client.findAll({ where: { user_id } });
    
        if (!clients.length) {
          return res.status(404).json({ message: 'Nenhum cliente encontrado para este usuário.' });
        }
    
        // Extrair os client_ids dos clientes encontrados
        const clientIds = clients.map(client => client.client_id);
    
        // Buscar todos os planos de saúde associados aos client_ids
        const healthPlans = await HealthPlan.findAll({ where: { client_id: clientIds } });
    
        if (!healthPlans.length) {
          return res.status(404).json({ message: 'Nenhum plano de saúde encontrado.' });
        }
    
        res.status(200).json({ healthPlans });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Erro inesperado ao listar os planos de saúde.' });
        }
      }
    };

  export const getClientHealthPlanById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { user_id } = req.user!; // ID do usuário autenticado
        const { plan_id } = req.params;
    
        // Buscar o plano de saúde pelo ID
        const healthPlan = await HealthPlan.findOne({ where: { plan_id } });
        if (!healthPlan) {
          return res.status(404).json({ message: 'Plano de saúde não encontrado.' });
        }
    
        // Verificar se o client_id associado ao plano pertence ao user_id autenticado
        const client = await Client.findOne({ where: { client_id: healthPlan.client_id, user_id } });
        if (!client) {
          return res.status(403).json({ message: 'Você não tem permissão para acessar este plano de saúde.' });
        }
    
        res.status(200).json({ healthPlan });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Erro inesperado ao buscar o plano de saúde.' });
        }
      }
  };

  export const updateClientHealthPlan = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { user_id } = req.user!; // ID do usuário autenticado
        const { plan_id } = req.params;
        const { available_plan_id, plan_code } = req.body;
    
        // Buscar o plano de saúde a ser atualizado
        const healthPlan = await HealthPlan.findOne({ where: { plan_id } });
        if (!healthPlan) {
          return res.status(404).json({ message: 'Plano de saúde não encontrado.' });
        }
    
        // Verificar se o client_id associado ao plano pertence ao user_id autenticado
        const client = await Client.findOne({ where: { client_id: healthPlan.client_id, user_id } });
        if (!client) {
          return res.status(403).json({ message: 'Você não tem permissão para atualizar este plano de saúde.' });
        }
    
        // Atualizar o plano de saúde
        healthPlan.available_plan_id = available_plan_id;
        healthPlan.plan_code = plan_code;
        await healthPlan.save();
    
        res.status(200).json({ message: 'Plano de saúde atualizado com sucesso.', healthPlan });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Erro inesperado ao atualizar o plano de saúde.' });
        }
      }
  };

  export const deleteClientHealthPlan = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { user_id } = req.user!; // ID do usuário autenticado
        const { plan_id } = req.params;
    
        // Buscar o plano de saúde a ser removido
        const healthPlan = await HealthPlan.findOne({ where: { plan_id } });
        if (!healthPlan) {
          return res.status(404).json({ message: 'Plano de saúde não encontrado.' });
        }
    
        // Verificar se o client_id associado ao plano pertence ao user_id autenticado
        const client = await Client.findOne({ where: { client_id: healthPlan.client_id, user_id } });
        if (!client) {
          return res.status(403).json({ message: 'Você não tem permissão para remover este plano de saúde.' });
        }
    
        // Remover o plano de saúde
        await healthPlan.destroy();
    
        res.status(204).send({message: "O plano foi removido com sucesso"}); // No Content
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Erro inesperado ao remover o plano de saúde.' });
        }
      }
  };