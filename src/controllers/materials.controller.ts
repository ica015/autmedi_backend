// controllers/materials.controller.ts
import { Request, Response } from 'express';
import  Material  from '../models/material.model';
import { Client } from '../models/client.model';
import Service from '../models/service.model';
import { Op } from 'sequelize';

import { AuthenticatedRequest } from '../types/express';

// Função para criar um material
export const createMaterial = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { user_id } = req.user!;
        const { service_id, name, measure, quantity, price } = req.body;
    
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
    
        // Verificar se o serviço pertence a um cliente do usuário
        if (req.user!.role !== 'admin' && !clientIds.includes(service.client_id)) {
          return res.status(403).json({ message: 'Acesso negado.' });
        }
    
        // Criar o material
        const material = await Material.create({
          service_id,
          name,
          measure,
          quantity,
          price,
        });
    
        res.status(201).json(material);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: 'Erro ao criar material', error: error.message });
        }
      }
    };

// Função para listar materiais
export const getMaterials = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id } = req.user!;
    const query: any = {};

    if (req.user!.role !== 'admin') {
      // Apenas materiais relacionados aos serviços dos clientes do usuário
      const clientIds = await Client.findAll({
        where: { user_id },
        attributes: ['client_id'],
      }).then(clients => clients.map(client => client.client_id));

      const serviceIds = await Service.findAll({
        where: { client_id: clientIds },
        attributes: ['service_id'],
      }).then(services => services.map(service => service.service_id));

      query.service_id = { [Op.in]: serviceIds };
    }

    const materials = await Material.findAll({
      where: query,
    });

    res.status(200).json(materials);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao listar materiais', error: error.message });
    }
  }
};

// Função para obter um material por ID
export const getMaterialById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { user_id } = req.user!;
        const { material_id } = req.params;
    
        // Verificar se o material existe
        const material = await Material.findByPk(material_id);
        if (!material) {
          return res.status(404).json({ message: 'Material não encontrado.' });
        }
    
        // Obter o serviço associado ao material
        const service = await Service.findByPk(material.service_id);
        if (!service || (req.user!.role !== 'admin' && !(await Client.findOne({ where: { client_id: service.client_id, user_id } })))) {
          return res.status(403).json({ message: 'Acesso negado.' });
        }
    
        res.status(200).json(material);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: 'Erro ao obter material', error: error.message });
        }
      }
    };

// Função para atualizar um material
export const updateMaterial = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { user_id } = req.user!;
        const { material_id } = req.params;
        const { service_id, name, measure, quantity, price } = req.body;
    
        // Verificar se o material existe
        const material = await Material.findByPk(material_id);
        if (!material) {
          return res.status(404).json({ message: 'Material não encontrado.' });
        }
    
        // Obter todos os clientes associados ao usuário
        const clientIds = await Client.findAll({
          where: { user_id },
          attributes: ['client_id'],
        }).then(clients => clients.map(client => client.client_id));
    
        // Obter o serviço associado ao material
        const service = await Service.findByPk(service_id);
        if (!service || (req.user!.role !== 'admin' && !clientIds.includes(service.client_id))) {
          return res.status(403).json({ message: 'Acesso negado.' });
        }
    
        // Atualizar o material
        await material.update({
          service_id,
          name,
          measure,
          quantity,
          price,
        });
    
        res.status(200).json(material);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: 'Erro ao atualizar material', error: error.message });
        }
      }
    };

// Função para deletar um material
export const deleteMaterial = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { user_id } = req.user!;
        const { material_id } = req.params;
    
        // Verificar se o material existe
        const material = await Material.findByPk(material_id);
        if (!material) {
          return res.status(404).json({ message: 'Material não encontrado.' });
        }
    
        // Obter o serviço associado ao material
        const service = await Service.findByPk(material.service_id);
        if (!service || (req.user!.role !== 'admin' && !(await Client.findOne({ where: { client_id: service.client_id, user_id } })))) {
          return res.status(403).json({ message: 'Acesso negado.' });
        }
    
        // Deletar o material
        await material.destroy();
    
        res.status(204).send();
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: 'Erro ao deletar material', error: error.message });
        }
      }
    };