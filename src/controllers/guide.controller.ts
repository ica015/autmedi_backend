import { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import { Guide } from '../models/guide.model';
import  {Client}  from '../models';
import  {Professional}  from '../models';
import  {HealthPlan}  from '../models';
import  {Service}  from '../models';
import { AuthenticatedRequest } from '../types/express';

// Incluir nova guia gerada pelo sistema
export const createGuide = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_id, professional_id, plan_id, service_id, guide_type } = req.body;

    // Validação básica para garantir que todos os campos necessários estão presentes
    if (!client_id || !professional_id || !plan_id || !service_id || !guide_type) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificação da existência dos registros referenciados
    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const professional = await Professional.findByPk(professional_id);
    if (!professional) {
      return res.status(404).json({ message: 'Profissional não encontrado' });
    }

    const healthPlan = await HealthPlan.findByPk(plan_id);
    if (!healthPlan) {
      return res.status(404).json({ message: 'Plano de saúde não encontrado' });
    }

    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    // Criação da nova guia
    const newGuide = await Guide.create({
      client_id,
      professional_id,
      plan_id,
      service_id,
      guide_type,
    });

    res.status(201).json(newGuide);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao criar guia médica', error: error.message });
    }
  }
};


//Listar as guias com filtros por clientes, profissionais e data de início e fim - via query
export const listGuides = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user } = req;
    const { client_id, professional_id, start_date, end_date } = req.query;

    // Monta os filtros para a consulta
    const where: any = {};

    if (user!.rule !== 'admin') {
      // Filtra por client_ids associados ao usuário autenticado
      const clientIds = await Client.findAll({
        where: { user_id: user!.user_id },
        attributes: ['client_id'],
      }).then(clients => clients.map(client => client.client_id));

      where.client_id = {
        [Op.in]: clientIds,
      };
    }

    if (client_id) {
      where.client_id = client_id;
    }

    if (professional_id) {
      where.professional_id = professional_id;
    }

    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date as string), new Date(end_date as string)],
      };
    }

    // Consulta as guias com os filtros aplicados
    const guides = await Guide.findAll({
      where,
      include: [
        { model: Client, as: 'client' },
        { model: Professional, as: 'professional' },
        { model: HealthPlan, as: 'healthPlan' },
        { model: Service, as: 'service' },
      ],
    });

    res.status(200).json(guides);
  } catch (error) {
    if (error instanceof Error){
        res.status(500).json({ message: 'Erro ao listar guias', error: error.message });
    }
  }
};

//retornará a quantidade de guias separadas por cliente e profissional, filtrando os resultados para que o usuário só veja suas próprias guias.
export const getClientSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rule, user_id } = req.user!;
    
    if (rule !== 'client') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const clientSummary = await Guide.findAll({
      include: [
        {
          model: Client,
          where: { user_id },
          as:'Client',
          attributes: ['client_id', 'company_name']
        },
        {
          model: Professional,
          as:'Professional',
          attributes: ['professional_id', 'name']
        }
      ],
      attributes: [
        'guide_type',
        [sequelize.fn('COUNT', sequelize.col('guide_id')), 'guide_count']
      ],
      group:['Client.client_id', 'Professional.professional_id', 'guide_type'],
      order: [
        [sequelize.col('Client.client_id'), 'ASC'], // Use o alias correto para a ordenação
        [sequelize.col('Professional.professional_id'), 'ASC'] // Use o alias correto para a ordenação
      ],
    });

    res.status(200).json(clientSummary);
  } catch (error) {
    if (error instanceof Error)
    res.status(500).json({ message: 'Erro ao buscar resumo de guias por cliente e profissional', error: error.message });
  }
};

//Esta rota retorna as estatísticas das guias separadas por cliente e plano de saúde, filtrando para que o usuário veja apenas suas próprias guias.
export const getClientStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rule, user_id } = req.user!;
    
    if (rule !== 'client') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const clientStats = await Guide.findAll({
      include: [
        {
          model: Client,
          where: { user_id },
          as:'Client',
          attributes: ['client_id', 'company_name']
        },
        {
          model: HealthPlan,
          attributes: ['plan_id', 'plan_name']
        }
      ],
      attributes: [
        'guide_type',
        [sequelize.fn('COUNT', sequelize.col('guide_id')), 'guide_count']
      ],
      group: ['Client.client_id', 'HealthPlan.plan_id', 'guide_type'],
      order:[
        [sequelize.col('Client.client_id'), 'ASC'],
        [sequelize.col('HealthPlan.plan_id'), 'ASC']
      ]
    });

    res.status(200).json(clientStats);
  } catch (error) {
    if (error instanceof Error)
    res.status(500).json({ message: 'Erro ao buscar estatísticas de guias por cliente e plano', error: error.message });
  }
};

//Esta rota retorna a quantidade total de guias, separada por cliente, plano de saúde, e profissional. Admins podem ver todas as guias.
export const getAdminSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rule } = req.user!;
    
    if (rule !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const adminSummary = await Guide.findAll({
      include: [
        {
          model: Client,
          as: 'Client',
          attributes: ['client_id', 'company_name']
        },
        {
          model: HealthPlan,
          as:'HealthPlan',
          attributes: ['plan_id', 'plan_name']
        },
        {
          model: Professional,
          as:'Professional',
          attributes: ['professional_id', 'name']
        }
      ],
      attributes: [
        'guide_type',
        [sequelize.fn('COUNT', sequelize.col('guide_id')), 'guide_count']
      ],
      group: ['Client.client_id', 'HealthPlan.plan_id', 'Professional.professional_id', 'guide_type'],
      order:[
        [sequelize.col('Client.client_id'), 'ASC'],
        [sequelize.col('HealthPlan.plan_id'), 'ASC'],
        [sequelize.col('Professional.professional_id'), 'ASC'],
      ]
    });

    res.status(200).json(adminSummary);
  } catch (error) {
    if (error instanceof Error)
    res.status(500).json({ message: 'Erro ao buscar resumo de guias para admin', error: error.message });
  }
};

//Essa rota fornecerá estatísticas detalhadas sobre as guias criadas no sistema, permitindo que os administradores gerem relatórios com filtros específicos por cliente, plano de saúde e profissional.
export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rule } = req.user!;
    const { client_id, plan_id, professional_id } = req.query;
    
    if (rule !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const whereClause: any = {};

    if (client_id) {
      whereClause.client_id = client_id;
    }
    if (plan_id) {
      whereClause.plan_id = plan_id;
    }
    if (professional_id) {
      whereClause.professional_id = professional_id;
    }

    const adminStats = await Guide.findAll({
      where: whereClause,
      include: [
        {
          model: Client,
          as:'Client',
          attributes: ['client_id', 'company_name']
        },
        {
          model: HealthPlan,
          as:'HealthPlan',
          attributes: ['plan_id', 'plan_name']
        },
        {
          model: Professional,
          as:'Professional',
          attributes: ['professional_id', 'name']
        }
      ],
      attributes: [
        'guide_type',
        [sequelize.fn('COUNT', sequelize.col('guide_id')), 'guide_count']
      ],
      group: ['Client.client_id', 'HealthPlan.plan_id', 'Professional.professional_id', 'guide_type'],
      order:[
        [sequelize.col('Client.client_id'), 'ASC'],
        [sequelize.col('HealthPlan.plan_id'), 'ASC'],
        [sequelize.col('Professional.professional_id'), 'ASC'],
      ]
    });

    res.status(200).json(adminStats);
  } catch (error) {
    if (error instanceof Error)
    res.status(500).json({ message: 'Erro ao buscar estatísticas detalhadas para admin', error: error.message });
  }
};






//conta a quantidade total de guias, com filtros opcionais por cliente, profissional e período.
export const countGuides = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { user } = req;
      const { client_id, professional_id, start_date, end_date } = req.query;
  
      const where: any = {};
  
      if (user!.rule !== 'admin') {
        const clientIds = await Client.findAll({
          where: { user_id: user!.user_id },
          attributes: ['client_id'],
        }).then(clients => clients.map(client => client.client_id));
  
        where.client_id = {
          [Op.in]: clientIds,
        };
      }
  
      if (client_id) {
        where.client_id = client_id;
      }
  
      if (professional_id) {
        where.professional_id = professional_id;
      }
  
      if (start_date && end_date) {
        where.created_at = {
          [Op.between]: [new Date(start_date as string), new Date(end_date as string)],
        };
      }
  
      const count = await Guide.count({ where });
  
      res.status(200).json({ count });
    } catch (error) {
        if (error instanceof Error)
            res.status(500).json({ message: 'Erro ao contar guias', error: error.message });
    }
  };
  