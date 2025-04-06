import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quantidade_de_pesagens = async () => {
  const response = await api.get('/dashboard/quantidade-de-pesagens');
  return response.data;
};

export const quantidade_de_toneladas_pesadas = async () => {
  const response = await api.get('/dashboard/toneladas-pesadas');
  return response.data;
};

export const exibir_pesagem_por_mes = async () => {
  const response = await api.get('/dashboard/pesagens-por-mes');
  return response.data;
};

export const meta_batida = async () => {
  const response = await api.get('/dashboard/meta-batida');
  return response.data;
};

export const def_pesagens_seletiva = async () => {
  const response = await api.get('/dashboard/pesagens-seletiva');
  return response.data;
};

export const def_pesagens_cata_treco = async () => {
  const response = await api.get('/dashboard/pesagens-cata-treco');
  return response.data;
};

export const def_pesagens_ao_longo_ano_por_tipo_pesagem = async () => {
  const response = await api.get('/dashboard/pesagens-ano-por-tipo');
  return response.data;
};

export const top_5_coperativas_por_pesagem = async () => {
  const response = await api.get('/dashboard/top-cooperativas');
  return response.data;
};

export const veiculo_maior_pesagens = async () => {
  const response = await api.get('/dashboard/veiculo-maior-pesagem');
  return response.data;
};

export const eficiencia_motoristas = async () => {
  const response = await api.get('/dashboard/eficiencia-motoristas');
  return response.data;
};
