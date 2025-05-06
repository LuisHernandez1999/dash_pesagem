import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getTodasAveriguacoes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/averiguacao/ver_averiguacao/get/`);
    return response.data.map(mapAveriguacaoResponse);
  } catch (error) {
    console.error('Erro ao buscar todas as averiguações:', error);
    throw error;
  }
};

const mapAveriguacaoResponse = (data) => ({
  id: data.id,
  data: data.data,
  hora_averiguacao: data.hora_averiguacao,
  garagem: data.garagem , //// USAR NAS PA4 E NAS 4 PRIMEIRAS CARDS
  tipo_servico: data.tipo_servico , // USAR NO GRAFICO E NA TABELA NO FILTRO DE TIPO DE FROTA
  imagens: data.imagens,
  averiguador: data.averiguador,
  rota: data.rota,
});
