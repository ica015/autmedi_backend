import { Request, Response } from 'express';
import {ClientProfessional} from '../models';
import {Professional} from '../models';
import {Client} from '../models';

import { AuthenticatedRequest } from '../types/express';

// Função para criar uma nova associação entre cliente e profissional
export const createClientProfessional = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_id, professional_id } = req.body;

    // Verifica se o cliente e o profissional existem
    const client = await Client.findByPk(client_id);
    const professional = await Professional.findByPk(professional_id);
    
    if (!client || !professional) {
      return res.status(404).json({ message: 'Cliente ou profissional não encontrado' });
    }

    // Cria a associação
    const clientProfessional = await ClientProfessional.create({
      client_id,
      professional_id,
    });

    res.status(201).json(clientProfessional);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao criar associação', error: error.message });
    }
  }
};

// Função para listar todas as associações
export const listClientProfessionals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientProfessionals = await ClientProfessional.findAll({
      include: [
        { model: Client, attributes: ['company_name'] },
        { model: Professional, attributes: ['name', 'crm'] }
      ]
    });

    res.status(200).json(clientProfessionals);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao listar associações', error: error.message });
    }
  }
};

// Função para atualizar uma associação
export const updateClientProfessional = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_professional_id } = req.params;
    const { client_id, professional_id } = req.body;

    const clientProfessional = await ClientProfessional.findByPk(client_professional_id);
    
    if (!clientProfessional) {
      return res.status(404).json({ message: 'Associação não encontrada' });
    }

    await ClientProfessional.update(
      { client_id, professional_id },
      { where: { client_professional_id } }
    );

    res.status(200).json({ message: 'Associação atualizada com sucesso' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao atualizar associação', error: error.message });
    }
  }
};

// Função para remover uma associação
export const deleteClientProfessional = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_professional_id } = req.params;

    const clientProfessional = await ClientProfessional.findByPk(client_professional_id);
    
    if (!clientProfessional) {
      return res.status(404).json({ message: 'Associação não encontrada' });
    }

    await ClientProfessional.destroy({ where: { client_professional_id } });

    res.status(204).send(); // No content
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao remover associação', error: error.message });
    }
  }
};
