import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const listarPrefixosEImplementos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/equipamentos/listar/`);
    const data = response.data.equipamentos; 

    return {
      todos: data.todos,
      ativos: data.ativos,
      inativos: data.inativos,
      total: data.total,
      contagem_total: data.contagem_total,
      contagem_ativos: data.contagem_ativos,
      contagem_inativos: data.contagem_inativos,
      contagem_manutencao: data.contagem_manutencao,
    };
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    throw error;
  }
};
export const listarEquipamentosTable = async (params = {}) => {
  try {

    const query = {};
    if (params.status) query.status = params.status;
    if (params.implemento) query.implemento = params.implemento;
    if (params.prefixo) query.prefixo = params.prefixo;
    query.pagina = params.pagina || 1;
    query.itens_por_pagina = params.itensPorPagina || 100;

    const response = await axios.get(`${API_BASE_URL}/api/equipamentos/table_equipmantos/`, { params: query });

    return {
      equipamentos: response.data.equipamentos,
      pagina_atual: response.data.pagina_atual,
      total_paginas: response.data.total_paginas,
      total_equipamentos: response.data.total_equipamentos,
    };
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    throw error;
  }
};

export async function editarEquipamento(idEquipamento, prefixo, implemento, status) {
  console.log("📡 Iniciando edição de equipamento:", { idEquipamento, prefixo, implemento, status });

  try {
    const url = `${API_BASE_URL}/api/equipamentos/${idEquipamento}/editar/`; // <-- Aqui adicionamos API_BASE_URL
    console.log(`📤 Enviando requisição POST para ${url}`);

    const payload = {
      prefixo: prefixo,
      implemento: implemento,
      status: status,
    };
    console.log("📦 Payload:", JSON.stringify(payload));

    const response = await fetch(url, {
      method: "POST", // Altere para "PUT" se o backend esperar PUT
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`📥 Resposta recebida - Status: ${response.status}`);
    console.log(`📥 Status Text: ${response.statusText}`);
    console.log(`📥 URL final: ${response.url}`);

    const contentType = response.headers.get("content-type");
    console.log("📄 Tipo de conteúdo da resposta:", contentType);

    const responseText = await response.text();
    console.log("📄 Primeiros 200 caracteres da resposta:", responseText.substring(0, 200));

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("📄 Dados da resposta (JSON):", data);
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse da resposta como JSON:", parseError);

      if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
        return {
          sucesso: false,
          mensagem: "A API retornou uma página HTML em vez de JSON. Verifique se o endpoint está correto.",
          status: response.status,
          dados: null,
          erroDetalhado: "Resposta HTML recebida em vez de JSON",
          respostaTexto: responseText.substring(0, 1000),
          urlChamada: url,
        };
      }

      return {
        sucesso: false,
        mensagem: "A API retornou uma resposta inválida (não é JSON).",
        status: response.status,
        dados: null,
        erroDetalhado: "Resposta não é JSON válido",
        respostaTexto: responseText.substring(0, 500),
        urlChamada: url,
      };
    }

    if (response.ok) {
      console.log("✅ Edição realizada com sucesso!");
      return {
        sucesso: true,
        mensagem: data.message || "Equipamento editado com sucesso.",
        status: response.status,
        dados: data.dados || null,
      };
    } else {
      console.error("❌ Erro na edição:", data.error || "Erro desconhecido");
      return {
        sucesso: false,
        mensagem: data.error || "Erro ao editar o equipamento.",
        status: response.status,
        dados: null,
      };
    }
  } catch (erro) {
    console.error("🔥 Exceção durante a edição:", erro);
    return {
      sucesso: false,
      mensagem: "Erro inesperado na requisição: " + erro.message,
      status: 500,
      dados: null,
      erroDetalhado: erro.message,
    };
  }
}

export async function criarEquipamento(prefixo, implemento, status, motivoInatividade) {
  console.log("📡 Iniciando criação de equipamento:", {
    prefixo,
    implemento,
    status,
    motivoInatividade,
  });

  try {
    const url = `${API_BASE_URL}/api/equipamentos/criar/`;
    console.log(`📤 Enviando requisição POST para ${url}`);

    const payload = {
      prefixo: prefixo,
      implemento: implemento,
      status: status,
      motivo_inatividade: motivoInatividade,
    };
    console.log("📦 Payload:", JSON.stringify(payload));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`📥 Resposta recebida - Status: ${response.status}`);
    console.log(`📥 URL final: ${response.url}`);

    const responseText = await response.text();
    console.log("📄 Resposta bruta:", responseText.substring(0, 300));

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("📄 Resposta JSON:", data);
    } catch (parseError) {
      console.error("❌ Erro ao interpretar resposta como JSON:", parseError);

      return {
        sucesso: false,
        mensagem: "A resposta da API não está em formato JSON.",
        status: response.status,
        dados: null,
        erroDetalhado: parseError.message,
        respostaTexto: responseText.substring(0, 1000),
        urlChamada: url,
      };
    }

    if (response.ok) {
      console.log("✅ Equipamento criado com sucesso!");
      return {
        sucesso: true,
        mensagem: data.message || "Equipamento criado com sucesso.",
        status: response.status,
        dados: data || null,
      };
    } else {
      console.error("❌ Erro ao criar equipamento:", data.error || "Erro desconhecido");
      return {
        sucesso: false,
        mensagem: data.error || "Erro ao criar o equipamento.",
        status: response.status,
        dados: null,
      };
    }
  } catch (erro) {
    console.error("🔥 Exceção durante a criação:", erro);
    return {
      sucesso: false,
      mensagem: "Erro inesperado na requisição: " + erro.message,
      status: 500,
      dados: null,
      erroDetalhado: erro.message,
    };
  }
}

export const contarEquipamentosSemana = async () => { 
  try {
    const response = await axios.get(`${API_BASE_URL}/api/soltura/equipamento_semana_distrib/`);

    const equipamentos = Object.entries(response.data.contagem).map(([equipamento, dias]) => ({
      equipamento: equipamento,
      segunda: dias['Segunda'] || 0,
      terca: dias['Terça'] || 0,
      quarta: dias['Quarta'] || 0,
      quinta: dias['Quinta'] || 0,
      sexta: dias['Sexta'] || 0,
      sabado: dias['Sábado'] || 0,
      domingo: dias['Domingo'] || 0,
    }));

    return {
      equipamentos: equipamentos,
    };
  } catch (error) {
    console.error('Erro ao buscar a contagem de equipamentos por dia da semana:', error);
    throw error;
  }
};


export async function deletarEquipamento(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/equipamentos/${id}/deletar/`);

    // Mapeamento completo da resposta
    return {
      sucesso: response.data.success,
      mensagem: response.data.message,  // <- Corrigido para "message"
      status: response.status
    };

  } catch (error) {
    if (error.response) {
      // Erro com resposta do servidor
      return {
        sucesso: false,
        mensagem: error.response.data.message || "Erro ao deletar equipamento.", // <- Corrigido
        status: error.response.status
      };
    } else {
      // Erro sem resposta (ex: servidor caiu)
      return {
        sucesso: false,
        mensagem: "Erro inesperado ao tentar se conectar com o servidor.",
        status: 0
      };
    }
  }
}