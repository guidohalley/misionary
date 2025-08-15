import ApiService from '@/services/ApiService';

export interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
}

export async function fetchCategorias(activo?: boolean): Promise<Categoria[]> {
  const q = activo === undefined ? '' : `?activo=${activo}`;
  const res = await ApiService.fetchData<{success:boolean,data:Categoria[]}>({ url: `/categorias${q}`, method: 'GET' });
  return res.data.data;
}

export async function createCategoria(nombre: string): Promise<Categoria> {
  const res = await ApiService.fetchData<{success:boolean,data:Categoria}>({ url: '/categorias', method: 'POST', data: { nombre } });
  return res.data.data;
}
