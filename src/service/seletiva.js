import axios from 'axios';
const API_BASE_URL = 'http://127.0.0.1:8000/';

export const contarSeletivaRealizadasHoje = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/soltura/contar_seletiva_no_dia/`);
    return {
      success: true,
      total: response.data.total_seletiva_hoje,
    };

  } catch (error) {
    console.error('Erro ao buscar solturas seletivas do dia:', error);

    return {
      success: false,
      error: error.response?.data?.error || 'Erro inesperado ao buscar os dados.',
    };
  }
};

export const contarTotalSeletiva = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/veiculos/total_frota_seletiva/`);

    return {
      success: true,
      total: response.data.total_seletiva, 
    };
  } catch (error) {
    console.error('Erro ao buscar total de seletiva:', error);

    return {
      success: false,
      error: error.response?.data?.error || 'Erro inesperado ao buscar os dados.',
    };
  }
}

export const contarSeletivaInativos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/veiculos/conatagem_seletiva_inativos/`);

    return {
      success: true,
      count: response.data.count_seletiva_inativos,
    };
  } catch (error) {
    console.error('Erro ao buscar seletivas inativas:', error);

    return {
      success: false,
      error: error.response?.data?.error || 'Erro inesperado ao buscar os dados.',
    };
  }
};

export const contarSeletivaAtivos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/veiculos/conatagem_seletiva_ativos/`);

    return {
      success: true,
      count: response.data.count_seletiva_ativos,
    };
  } catch (error) {
    console.error('Erro ao buscar seletivas ativas:', error);

    return {
      success: false,
      error: error.response?.data?.error || 'Erro inesperado ao buscar os dados.',
    };
  }
};

export const contarColetoresMotoristasPorTurno = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/soltura/seletiva_colaboradores_equipe/`);
    const data = response.data;
    const resultadoMapeado = Object.entries(data).map(([equipe, valores]) => ({
      equipe,
      motoristas: valores.motoristas,
      coletores: valores.coletores,
    }));

    return {
      success: true,
      data: resultadoMapeado,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.erro || 'Erro inesperado ao buscar os dados',
    };
  }
};

export const obterSolturasSeletivaPorDiaDaSemana = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/soltura/obter_solturas_seletiva_por_dia_da_semana/`);
    const data = response.data;
    const diasOrdenados = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];

    const resultadoMapeado = diasOrdenados.map(dia => ({
      dia,
      total: data[dia] ?? 0,
    }));

    return {
      success: true,
      data: resultadoMapeado,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.erro || 'Erro inesperado ao buscar os dados',
    };
  }
};

export const contarSolturasSeletivaPorGaragem = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/soltura/contar_solturas_seletiva_por_garagem/`);
    const data = response.data;
    const garages = ['PA1', 'PA2', 'PA3', 'PA4'];
    const garagesData = garages.map(garagem => ({
      garagem: garagem,      
      count: data[garagem] || 0  
    }));
    return {
      success: true,
      garages: garagesData,     
      total: data.total || 0   
    };

  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Erro inesperado ao buscar os dados'
    };
  }
};

export const retornarInfosSeletiva = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/soltura/retornar_infos_seletiva/`);
    const data = response.data;
    return {
      success: true,
      data: data.map(item => ({
        motorista: item.motorista || null,
        hora_saida_frota: item.hora_saida_frota || null,
        hora_entrega_chave: item.hora_entrega_chave || null,
        hora_chegada: item.hora_chegada || null,
        coletores: Array.isArray(item.coletores) ? item.coletores : [],
        prefixo:item.prefixo,
        data: item.data || null,
        lider: item.lider || null,
        rota: item.rota || null,
        tipo_equipe: item.tipo_equipe || null,
        status_frota: item.status_frota || null,
        tipo_veiculo_selecionado: item.tipo_veiculo_selecionado || null,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Erro inesperado ao buscar os dados',
    };
  }
};
