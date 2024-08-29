import { Request, Response } from 'express';
import {Client} from '../models';
import {Professional} from '../models'
import {ClientProfessional} from '../models'
import { AuthenticatedRequest } from '../types/express';
import { Op } from 'sequelize';


// Criar um novo cliente
export const createClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id } = req.user!; // ID do usuário autenticado
    const { company_name, contact_number, status } = req.body;

    // Verifica se já existe um cliente com o mesmo nome ou telefone para o usuário autenticado
    const existingClient = await Client.findOne({
      where: {
        user_id,
        [Op.or]: [
          { company_name },
          { contact_number }
        ]
      }
    });

    if (existingClient) {
      return res.status(400).json({ message: 'Cliente com o mesmo nome ou telefone já está cadastrado' });
    }

    // Cria o novo cliente
    const newClient = await Client.create({
      user_id,
      company_name,
      contact_number,
      status,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json(newClient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
    }
  }
};

// Buscar cliente por ID
export const getClientById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_id } = req.params;
    const { user_id, role } = req.user!; // ID do usuário autenticado

    const client = await Client.findOne({ where: { client_id, user_id } });
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.status(200).json(client);
  } catch (error) {
    if (error instanceof Error){
        res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
    }
  }
};

// Atualizar cliente
export const updateClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_id } = req.params;
    const { user_id, role } = req.user!;
    const updateData = req.body;

    let client;

    if (role === 'admin') {
      // Admin pode atualizar qualquer cliente
      client = await Client.findOne({ where: { client_id } });
    } else {
      // Cliente só pode atualizar seus próprios clientes
      client = await Client.findOne({ where: { client_id, user_id } });
    }

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    await client.update(updateData);
    res.status(200).json(client);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
    }
  }
};

// Remover cliente
export const deleteClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_id } = req.params;
    const { user_id } = req.user!; // ID do usuário autenticado

    const client = await Client.findOne({ where: { client_id, user_id } });
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    await client.destroy();

    res.status(204).json({message: 'Cliente removido com sucesso'}); // No content
  } catch (error) {
    if (error instanceof Error){
        res.status(500).json({ message: 'Erro ao remover cliente', error: error.message });
    }
  }
};

//listar clientes
export const listClients = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id, role } = req.user!;

    let clients;
    if (role === 'admin') {
      // Admin pode ver todos os clientes
      clients = await Client.findAll({
        order: [['company_name', 'asc']],
        include: [
          {
            model: Professional,
            through: { attributes: [] }, // Evita incluir dados da tabela intermediária
          },
        ],
      });
    } else {
      // Cliente só pode ver seus próprios clientes
      clients = await Client.findAll({
        where: { user_id },
        order: [['company_name', 'asc']],
        include: [
          {
            model: Professional,
            through: { attributes: [] }, // Evita incluir dados da tabela intermediária
          },
        ],
      });
    }

    res.status(200).json(clients);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao buscar clientes', error: error.message });
    }
  }
};

//Remover vinculo de um Profissional a um clinete (clinica) 
export const removeProfessionalFromClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { client_id, professional_id } = req.params;

    // Verifica se o vínculo existe
    const clientProfessional = await ClientProfessional.findOne({
      where: { client_id, professional_id },
    });

    if (!clientProfessional) {
      return res.status(404).json({ message: 'Vínculo entre o cliente e o profissional não encontrado' });
    }

    // Remove o vínculo
    await clientProfessional.destroy();

    res.status(200).json({ message: 'Vínculo removido com sucesso' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao remover vínculo do profissional com o cliente', error: error.message });
    }
  }
};