import { Request, Response } from 'express';
import Professional from '../models/professional.model';
// import ClientProfessional from '../models/clientProfessional.model'; // Importa o modelo de relacionamento
import { AuthenticatedRequest } from '../types/express'; // Tipo personalizado para requisições autenticadas
import { Op } from 'sequelize';
import {Client} from '../models';
import {ClientProfessional} from '../models'

interface ClientProfessionalEntry {
  client_id: number;
  professional_id: number;
}

// Função para criar um novo profissional
export const createProfessional = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_id, name, register_number, register_type, register_state, specialty_code, specialty_description } = req.body;
    const { user_id, role } = req.user!;

    // Verifica se o número de registro já está associado a um cliente do usuário atual
    const existingProfessional = await Professional.findOne({
      include: {
        model: ClientProfessional,
        include: [{
          model: Client,
          where: { user_id }, // Filtra pelos clientes do usuário atual
        }],
      },
      where: { register_number },
    });

    if (existingProfessional) {
      // Verifica se o profissional já está associado ao client_id fornecido
      const existingAssociation = await ClientProfessional.findOne({
        where: {
          client_id,
          professional_id: existingProfessional.professional_id,
        },
      });

      if (existingAssociation) {
        return res.status(400).json({ message: 'Profissional já está associado a este cliente' });
      } else {
        // Associa o profissional existente ao novo cliente
        await ClientProfessional.create({
          client_id,
          professional_id: existingProfessional.professional_id,
        });

        return res.status(201).json({ message: 'Profissional associado com sucesso ao cliente existente', professional: existingProfessional });
      }
    } else {
      // Cria um novo profissional e associa ao cliente
      const professional = await Professional.create({
        name,
        register_number,
        register_type,
        register_state,
        specialty_code,
        specialty_description,
      });

      // Associa o novo profissional ao cliente na tabela client_professionals
      if (client_id) {
        await ClientProfessional.create({
          client_id,
          professional_id: professional.professional_id,
        });
      }

      return res.status(201).json(professional);
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Erro ao criar profissional', error: error.message });
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
    }).then((clients: Client[]) => clients.map((client: Client) => client.client_id));

    // Se não houver clientes associados ao usuário, retorna uma lista vazia
    if (clientIds.length === 0) {
      return res.status(200).json([]);
    }
    // Obtém os IDs dos profissionais associados aos clientes
    const professionalIds = await ClientProfessional.findAll({
      where: { client_id: { [Op.in]: clientIds } },
      attributes: ['professional_id'],
    }).then((clientProfessionals: ClientProfessional[]) =>
      clientProfessionals.map((cp: ClientProfessional) => cp.professional_id)
    );

    // Se não houver profissionais associados, retorna uma lista vazia
    if (professionalIds.length === 0) {
      return res.status(200).json([]);
    }
    // Lista todos os profissionais associados aos IDs obtidos
    const professionals = await Professional.findAll({
      where: { professional_id: { [Op.in]: professionalIds } },
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
          attributes: ['client_id'],
          // as:'cliente'
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
