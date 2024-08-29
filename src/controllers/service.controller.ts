import { Request, Response } from 'express';
import {Service} from '../models';
import {Client} from '../models';
import {Professional} from '../models';
import {HealthPlan} from '../models';
import { AuthenticatedRequest } from '../types/express';
import { Op } from 'sequelize';

// Função para criar um novo serviço
export const createService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_id, professional_id, plan_id, service_name, tuss_code, tuss_description, price } = req.body;

    // Verifica se o usuário tem permissão para criar o serviço
    if (req.user!.role !== 'admin') {
      // Permitir criar serviço apenas se o cliente estiver associado ao usuário
      const client = await Client.findOne({ where: { client_id, user_id: req.user!.user_id } });
      if (!client) {
        return res.status(403).json({ message: 'Não autorizado a criar serviço para este cliente' });
      }
    }

    const newService = await Service.create({
      client_id,
      professional_id,
      plan_id,
      service_name,
      tuss_code,
      tuss_description,
      price
    });

    res.status(201).json(newService);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao criar serviço', error: error.message });
    }
  }
};

// Função para listar todos os serviços ou serviços específicos para o usuário
export const listServices = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role === 'admin') {
      // Admin pode acessar todos os serviços
      const services = await Service.findAll({
        include: [
          { model: Client, as: 'client' },
          { model: Professional, as: 'professional' },
          { model: HealthPlan, as: 'healthPlan' }
        ]
      });

      res.status(200).json(services);
    } else {
      // Usuário comum pode acessar apenas os serviços dos clientes associados
      const clientIds = await Client.findAll({
        where: { user_id: req.user!.user_id },
        attributes: ['client_id'],
      }).then(clients => clients.map(client => client.client_id));

      const services = await Service.findAll({
        where: { client_id: { [Op.in]: clientIds } },
        include: [
          { model: Client, as: 'client' },
          { model: Professional, as: 'professional' },
          { model: HealthPlan, as: 'healthPlan' }
        ]
      });

      res.status(200).json(services);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao listar serviços', error: error.message });
    }
  }
};

// Função para obter um serviço por ID
export const getServiceById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { service_id } = req.params;

    // Obtém o serviço com o ID fornecido
    const service = await Service.findByPk(service_id, {
      include: [
        { model: Client, as: 'client' },
        { model: Professional, as: 'professional' },
        { model: HealthPlan, as: 'healthPlan' }
      ]
    });

    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    // Verifica permissão para acessar o serviço
    if (req.user!.role !== 'admin') {
      // Obtém os IDs dos clientes associados ao usuário
      const clientIds = await Client.findAll({
        where: { user_id: req.user!.user_id },
        attributes: ['client_id'],
      }).then(clients => clients.map(client => client.client_id));

      // Verifica se o client_id do serviço está na lista de client_ids associados ao usuário
      if (!clientIds.includes(service.client_id)) {
        return res.status(403).json({ message: 'Não autorizado a acessar este serviço' });
      }
    }

    res.status(200).json(service);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao obter serviço', error: error.message });
    }
  }
};

// Função para atualizar um serviço
export const updateService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id } = req.user!;
    const { service_id } = req.params;
    const { client_id, professional_id, plan_id, service_name, tuss_code, tuss_description, price } = req.body;
    
    // Verificar se o serviço existe
    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    // Obter todos os clientes associados ao usuário
    const clientIds = await Client.findAll({
      where: { user_id },
      attributes: ['client_id'],
    }).then(clients => clients.map(client => client.client_id));

    // Verificar se o serviço pertence a um cliente associado ao usuário
    if (req.user!.role !== 'admin' && !clientIds.includes(service.client_id)) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Atualizar o serviço
    await service.update({
      client_id,
      professional_id,
      plan_id,
      service_name,
      tuss_code,
      tuss_description,
      price,
    });

    res.status(200).json(service);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao atualizar serviço', error: error.message });
    }
  }
};

// Função para remover um serviço
export const deleteService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id } = req.user!;
    const { service_id } = req.params;

    // Verificar se o serviço existe
    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    // Obter todos os clientes associados ao usuário
    const clientIds = await Client.findAll({
      where: { user_id },
      attributes: ['client_id'],
    }).then(clients => clients.map(client => client.client_id));

    // Verificar se o serviço pertence a um cliente associado ao usuário
    if (req.user!.role !== 'admin' && !clientIds.includes(service.client_id)) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Deletar o serviço
    await service.destroy();

    res.status(204).json({message:'Serviço removido com sucesso'});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao deletar serviço', error: error.message });
    }
  }
};
