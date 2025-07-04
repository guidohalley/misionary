import ApiService from '@/services/ApiService';
import { Persona, CreatePersonaDTO, UpdatePersonaDTO } from './types';

export async function fetchPersonas(): Promise<Persona[]> {
  const response = await ApiService.fetchData<Persona[]>({
    url: '/personas',
    method: 'GET'
  });
  return response.data;
}

export async function fetchPersonaById(id: number): Promise<Persona> {
  const response = await ApiService.fetchData<Persona>({
    url: `/personas/${id}`,
    method: 'GET'
  });
  return response.data;
}

export async function createPersona(data: CreatePersonaDTO): Promise<Persona> {
  const response = await ApiService.fetchData<Persona>({
    url: '/personas',
    method: 'POST',
    data
  });
  return response.data;
}

export async function updatePersona(id: number, data: UpdatePersonaDTO): Promise<Persona> {
  const response = await ApiService.fetchData<Persona>({
    url: `/personas/${id}`,
    method: 'PUT',
    data
  });
  return response.data;
}

export async function deletePersona(id: number): Promise<void> {
  await ApiService.fetchData<void>({
    url: `/personas/${id}`,
    method: 'DELETE'
  });
}
