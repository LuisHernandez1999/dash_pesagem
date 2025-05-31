import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // ou use a base correta da sua API

export const getResumoRsuHoje = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/soltura/dados_rsu_hoje/`);
    const data = response.data;

    const contagemPA = data.contagem_geral_por_pa_rsu || {};
    const equipes = data.quantidade_motorista_coletores_equipe || {};
    const totalRSU = data.total_rsu_realizadas_hoje || {};

    const resultadoDetalhado = {
      porGaragem: {
        PA1: {
          turnos: contagemPA.PA1?.turnos || [],
          motoristas: contagemPA.PA1?.motoristas || 0,
          veiculos: contagemPA.PA1?.veiculos || 0,
          coletores: contagemPA.PA1?.coletores || 0
        },
        PA2: {
          turnos: contagemPA.PA2?.turnos || [],
          motoristas: contagemPA.PA2?.motoristas || 0,
          veiculos: contagemPA.PA2?.veiculos || 0,
          coletores: contagemPA.PA2?.coletores || 0
        },
        PA3: {
          turnos: contagemPA.PA3?.turnos || [],
          motoristas: contagemPA.PA3?.motoristas || 0,
          veiculos: contagemPA.PA3?.veiculos || 0,
          coletores: contagemPA.PA3?.coletores || 0
        },
        PA4: {
          turnos: contagemPA.PA4?.turnos || [],
          motoristas: contagemPA.PA4?.motoristas || 0,
          veiculos: contagemPA.PA4?.veiculos || 0,
          coletores: contagemPA.PA4?.coletores || 0
        }
      },
      porEquipe: {
        diurno: {
          motoristas: equipes["Equipe(Diurno)"]?.motoristas || 0,
          coletores: equipes["Equipe(Diurno)"]?.coletores || 0
        },
        noturno: {
          motoristas: equipes["Equipe(Noturno)"]?.motoristas || 0,
          coletores: equipes["Equipe(Noturno)"]?.coletores || 0
        }
      },
      totalRSUHoje: totalRSU.total_rsu_hoje || 0
    };

    return { data: resultadoDetalhado, error: null };
  } catch (error) {
    const mensagemErro = error.response?.data?.error || 'erro ao buscar dados RSU.';
    return { data: null, error: mensagemErro };
  }
};
 


export async function fetchDadosRsuTabelaGrafico() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/soltura/rsu_tabela_grafico/`);
    const data = response.data;

    return {
      resumoPorDiaDaSemana: data.resumo_por_dia_da_semana,

      detalhesSolturas: data.detalhes_solturas.map((item) => ({
        id: item.id,
        motorista: item.motorista,
        horaSaidaFrota: item.hora_saida_frota,
        prefixo: item.prefixo,
        horaEntregaChave: item.hora_entrega_chave,
        horaChegada: item.hora_chegada,
        coletores: item.coletores,
        data: item.data,
        lider: item.lider,
        rota: item.rota,
        tipoEquipe: item.tipo_equipe,
        statusFrota: item.status_frota,
        tipoVeiculoSelecionado: item.tipo_veiculo_selecionado,
      })),

      configuracao: {
        maxPages: data.configuracao.max_pages,
        maxRegistrosPorPagina: data.configuracao.max_registros_por_pagina,
        totalRegistrosDisponiveis: data.configuracao.total_registros_disponiveis,
        registrosSendoExibidos: data.configuracao.registros_sendo_exibidos,
      },

      paginacao: {
        paginaAtual: data.paginacao.pagina_atual,
        totalPaginas: data.paginacao.total_paginas,
        totalPaginasReal: data.paginacao.total_paginas_real,
        totalSolturas: data.paginacao.total_solturas,
        totalSolturasReal: data.paginacao.total_solturas_real,
        pageSize: data.paginacao.page_size,
        temProxima: data.paginacao.tem_proxima,
        temAnterior: data.paginacao.tem_anterior,
        primeiraPagina: data.paginacao.primeira_pagina,
        ultimaPagina: data.paginacao.ultima_pagina,
        registrosNaPagina: data.paginacao.registros_na_pagina,
        limitadoA100Paginas: data.paginacao.limitado_a_100_paginas,
      }
    };
  } catch (error) {
    console.error('Erro ao buscar dados RSU hoje:', error);
    throw error;
  }
}
