import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';


export const getTodasAveriguacoes = async (page = 1, page_size = 10) => {
  try {
    console.log(`Conectando à API: ${API_BASE_URL}/api/averiguacao/ver_averiguacao/get/`);
    
    const response = await axios.get(`${API_BASE_URL}/api/averiguacao/ver_averiguacao/get/`, {
      params: {
        page,
        page_size,
      },
      timeout: 10000, // 10 segundos de timeout
    });

    console.log("Resposta da API:", response.data);
    
    // A resposta do backend é uma lista direta de objetos
    const data = response.data;
    
    if (!Array.isArray(data)) {
      console.warn("API retornou dados em formato inesperado:", data);
      throw new Error("Formato de dados inválido");
    }
    
    const mappedData = data.map((item) => ({
      id: item.id || Math.random().toString(36).substr(2, 9), // Gera ID aleatório se não existir
      horaAveriguacao: item.hora_averiguacao,
      imagens: Array.isArray(item.imagens) 
        ? item.imagens.filter(img => img !== null)
        : [],
      id: item.id,
            tipoServico:item. tipo_servico,
            horaAveriguacao: item.hora_averiguacao,
            horaInicio: item.hora_inicio,
            horaEncerramento: item.hora_encerramento,
            quantidadeViagens: item.quantidade_viagens,
            velocidadeColeta: item.velocidade_coleta,
            larguraRua: item.largura_rua,
            alturaFios: item.altura_fios,
            caminhaoUsado: item.caminhao_usado,
            equipamentoProtecao: item.equipamento_protecao,
            uniformeCompleto: item.uniforme_completo,
            documentacaoVeiculo: item.documentacao_veiculo,
            inconformidades: item.inconformidades,
            acoesCorretivas: item.acoes_corretivas,
            observacoesOperacao: item.observacoes_operacao,
            averiguador: item.averiguador,
            garagem: item.garagem,
            rota: item.rota,
            imagens: item.imagens || [],
    }));

    // Calcular o número total de páginas se não for fornecido pelo backend
    const totalItems = response.headers['x-total-count'] 
      ? parseInt(response.headers['x-total-count']) 
      : mappedData.length;
    const totalPages = response.headers['x-total-pages'] 
      ? parseInt(response.headers['x-total-pages']) 
      : Math.ceil(totalItems / page_size);

    return {
      data: mappedData,
      totalPages: totalPages,
      source: "api"
    };
  } catch (error) {
    console.error('Erro ao buscar averiguações:', error);
    
    // Verificar o tipo de erro para fornecer mensagem mais específica
    let errorMessage = "Erro ao buscar dados.";
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Timeout ao conectar com a API. Verifique se o servidor está rodando.";
      } else if (error.response) {
        errorMessage = `Erro ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique se o servidor está rodando.";
      }
    }
    
    throw new Error(errorMessage);
  }
};

export async function updateAveriguacao(averiguacaoId, data) {
  try {
    const response =  await axios.get(`${API_BASE_URL}/api/averiguacao/${averiguacaoId}/update/`, {
      hora_averiguacao: data.hora_averiguacao,
      tipo_servico: data.tipo_servico,
      hora_inicio: data.hora_inicio,
      hora_encerramento: data.hora_encerramento,
      quantidade_viagens: data.quantidade_viagens,
      velocidade_coleta: data.velocidade_coleta,
      largura_rua: data.largura_rua,
      altura_fios: data.altura_fios,
      caminhao_usado: data.caminhao_usado,
      equipamento_protecao: data.equipamento_protecao,
      uniforme_completo: data.uniforme_completo,
      documentacao_veiculo: data.documentacao_veiculo,
      inconformidades: data.inconformidades,
      acoes_corretivas: data.acoes_corretivas,
      observacoes_operacao: data.observacoes_operacao,
      quantidade_coletores: data.quantidade_coletores,
      averiguador: data.averiguador,
      garagem: data.garagem,
      rota: data.rota
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar averiguação:', error);
    throw error;
  }
}
