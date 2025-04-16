import axios from 'axios';

const API_BASE_URL = '/api/soltura'; // ou sua base real

/**
 * Total de remoções realizadas hoje (únicas por motorista e veículo).
 * Exemplo de resposta: { total_remocoes: 5 }
 */
export const getTotalRemocoesHoje = async () => {
  const response = await axios.get(`${API_BASE_URL}/total-remocoes-hoje`);
  return {
    total: response.data.total_remocoes
  };
};

/**
 * Total de remoções únicas feitas (motorista + veículo + data).
 * Exemplo de resposta: { total_remocoes_unicas: 12 }
 */
export const getTotalRemocoesUnicas = async () => {
  const response = await axios.get(`${API_BASE_URL}/total-remocoes-unicas`);
  return {
    total: response.data.total_remocoes_unicas
  };
};

/**
 * Lista com os dados completos de todas as remoções (sem filtro de data).
 * Cada item tem motorista, veículo, coletores, horários, setor, etc.
 */
export const getTodasRemocoes = async () => {
  const response = await axios.get(`${API_BASE_URL}/detalhes-todas-remocoes`);
  return response.data.remocoes.map((item) => ({
    motorista: item.motorista,
    matricula: item.matricula_motorista,
    coletores: item.coletores,
    prefixoVeiculo: item.prefixo,
    frequencia: item.frequencia,
    setores: item.setores,
    celular: item.celular,
    lider: item.lider,
    horaEntregaChave: item.hora_entrega_chave,
    horaSaidaFrota: item.hora_saida_frota,
    tipoServico: item.tipo_servico,
    turno: item.turno,
    rota: item.rota
  }));
};

/**
 * Lista com os dados completos de remoções feitas HOJE.
 * Estrutura idêntica à função acima, mas filtrada pela data atual.
 */
export const getRemocoesHoje = async () => {
  const response = await axios.get(`${API_BASE_URL}/detalhes-remocoes-hoje`);
  return response.data.remocoes_hoje.map((item) => ({
    motorista: item.motorista,
    matricula: item.matricula_motorista,
    coletores: item.coletores,
    prefixoVeiculo: item.prefixo,
    frequencia: item.frequencia,
    setores: item.setores,
    celular: item.celular,
    lider: item.lider,
    horaEntregaChave: item.hora_entrega_chave,
    horaSaidaFrota: item.hora_saida_frota,
    tipoServico: item.tipo_servico,
    turno: item.turno,
    rota: item.rota
  }));
};

/**
 * Média mensal de solturas realizadas no ano atual.
 * Exemplo de resposta: { media_mensal_de_solturas: 9.42 }
 */
export const getMediaMensalSolturas = async () => {
  const response = await axios.get(`${API_BASE_URL}/media-mensal`);
  return {
    mediaMensal: response.data.media_mensal_de_solturas
  };
};
