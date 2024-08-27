import { Request, Response } from 'express';
import Professional from '../models/professional.model';
import ClientProfessional from '../models/clientProfessional.model'; // Importa o modelo de relacionamento
import { AuthenticatedRequest } from '../types/express'; // Tipo personalizado para requisições autenticadas
import { Op } from 'sequelize';
import Client from '../models/client.model';

interface ClientProfessionalEntry {
  client_id: number;
  professional_id: number;
}

// Função para criar um novo profissional
export const createProfessional = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_id, name, register_number, register_type, register_state, specialty_code, specialty_description } = req.body;
    const { user_id } = req.user!;

    // Verifica se o número de registro já está cadastrado
    const existingProfessional = await Professional.findOne({ where: { register_number } });
    if (existingProfessional) {
      return res.status(400).json({ message: 'Número de registro já cadastrado' });
    }

    // Cria o novo profissional
    const professional = await Professional.create({
      name,
      register_number,
      register_type,
      register_state,
      specialty_code,
      specialty_description,
    });

    // Associa o profissional ao cliente na tabela client_professionals
    if (client_id) {
      await ClientProfessional.create({
        client_id,
        professional_id: professional.professional_id,
      });
    }

    res.status(201).json(professional);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao criar profissional', error: error.message });
    }
  }
};

// Função para listar todos os profissionais de um cliente
export const listProfessionals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id } = req.user!;

    // Obtém os IDs dos clientes associados ao usuário
    const clientIds = await Client.findAll({
      where: { user_id },
      attributes: ['client_id'],
    }).then(clients => clients.map(client => client.client_id));

    // Lista todos os profissionais associados aos clientes do usuário
    const professionals = await Professional.findAll({
      include: [
        {
          model: ClientProfessional,
          as: 'professionals',
          where: { client_id: { [Op.in]: clientIds } },
        },
      ],
    });

    res.status(200).json(professionals);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao listar profissionais', error: error.message });
    }
  }
};

// Função para atualizar um profissional existente
export const updateProfessional = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { professional_id } = req.params;
    const { name, register_number, register_type, register_state, specialty_code, specialty_description } = req.body;
    const { user_id } = req.user!;

    // Verifica se o profissional existe
    const professional = await Professional.findOne({ where: { professional_id } });
    if (!professional) {
      return res.status(404).json({ message: 'Profissional não encontrado' });
    }

    // Atualiza o profissional
    await Professional.update(
      { name, register_number, register_type, register_state, specialty_code, specialty_description },
      { where: { professional_id } }
    );

    res.status(200).json({ message: 'Profissional atualizado com sucesso' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao atualizar profissional', error: error.message });
    }
  }
};

// Função para remover um profissional
export const deleteProfessional = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { professional_id } = req.params;
    const { user_id } = req.user!;

    // Verifica se o profissional existe
    const professional = await Professional.findOne({ where: { professional_id } });
    if (!professional) {
      return res.status(404).json({ message: 'Profissional não encontrado' });
    }

    // Remove o profissional
    await Professional.destroy({ where: { professional_id } });

    // Remove as associações na tabela client_professionals
    await ClientProfessional.destroy({ where: { professional_id } });

    res.status(204).send(); // No content
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao remover profissional', error: error.message });
    }
  }
};

// Função para listar um profissional pelo ID
export const listProfessionalById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { professional_id } = req.params;
    const { user_id } = req.user!;

    // Obtém o profissional pelo ID
    const professional = await Professional.findOne({
      where: { professional_id },
      include: [
        {
          model: ClientProfessional,
        //   attributes: ['client_id'],
        as:'cliente'
        },
      ],
    });

    if (!professional) {
      return res.status(404).json({ message: 'Profissional não encontrado' });
    }

    res.status(200).json(professional);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao listar profissional', error: error.message });
    }
  }
};
