import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getDashboardSeletivaDadosHoje = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/soltura/seltiva_dados_hoje/`);

  return {
    seletiva_por_pa: { ////// o componente abaixo das 4 primeiras cards deve pegar esse 
      PA1: {
        turnos: response.data.seletiva_por_pa.PA1.turnos,
        motoristas: response.data.seletiva_por_pa.PA1.motoristas,
        veiculos: response.data.seletiva_por_pa.PA1.veiculos,
        coletores: response.data.seletiva_por_pa.PA1.coletores
      },
      PA2: {
        turnos: response.data.seletiva_por_pa.PA2.turnos,
        motoristas: response.data.seletiva_por_pa.PA2.motoristas,
        veiculos: response.data.seletiva_por_pa.PA2.veiculos,
        coletores: response.data.seletiva_por_pa.PA2.coletores
      },
      PA3: {
        turnos: response.data.seletiva_por_pa.PA3.turnos,
        motoristas: response.data.seletiva_por_pa.PA3.motoristas,
        veiculos: response.data.seletiva_por_pa.PA3.veiculos,
        coletores: response.data.seletiva_por_pa.PA3.coletores
      },
      PA4: {
        turnos: response.data.seletiva_por_pa.PA4.turnos,
        motoristas: response.data.seletiva_por_pa.PA4.motoristas,
        veiculos: response.data.seletiva_por_pa.PA4.veiculos,
        coletores: response.data.seletiva_por_pa.PA4.coletores
      }
    },
    por_turno: {///// o componente de distribuicao de turno deve pegar esse dado
      'Equipe(Diurno)': {
        motoristas: response.data.por_turno['Equipe(Diurno)'].motoristas,
        coletores: response.data.por_turno['Equipe(Diurno)'].coletores
      },
      'Equipe(Noturno)': {
        motoristas: response.data.por_turno['Equipe(Noturno)'].motoristas,
        coletores: response.data.por_turno['Equipe(Noturno)'].coletores
      }
    },
    quantidade_seletiva_por_garagem: { ////// o grafico de distruição de pa pega ele 
      PA1: response.data.quantidade_seletiva_por_garagem.PA1,
      PA2: response.data.quantidade_seletiva_por_garagem.PA2,
      PA3: response.data.quantidade_seletiva_por_garagem.PA3,
      PA4: response.data.quantidade_seletiva_por_garagem.PA4,
      total: response.data.quantidade_seletiva_por_garagem.total
    },
    total_seletivas_hoje: response.data.total_seletivas_hoje///// essa aqui a ultima card vai pegar esse dado
  };
};




export const getDashboardSeletivaTabelaGrafico = async (page = 1, pageSize = 100) => {
  const response = await axios.get(`${API_BASE_URL}/api/soltura/seletiva_tabela_grafic/`, {
    params: {
      page,
      page_size: pageSize
    }
  });

  const data = response.data;

  return { 
    resumoPorDiaDaSemana: data.resumo_por_dia_da_semana, ///// AQUI SERÁ USANDO NO ULTIMO GRAFICO 
    detalhesSolturas: data.detalhes_solturas.map(soltura => ({
      id: soltura.id,//// AQUI SERÁ USADO NA TABELA 
      motorista: soltura.motorista,
      horaSaidaFrota: soltura.hora_saida_frota,
      prefixo: soltura.prefixo,
      horaEntregaChave: soltura.hora_entrega_chave,
      horaChegada: soltura.hora_chegada,
      coletores: soltura.coletores,
      data: soltura.data,
      lider: soltura.lider,
      rota: soltura.rota,
      tipoEquipe: soltura.tipo_equipe,
      statusFrota: soltura.status_frota,
      tipoVeiculoSelecionado: soltura.tipo_veiculo_selecionado
    })),
    configuracao: {
      maxPages: data.configuracao.max_pages,
      maxRegistrosPorPagina: data.configuracao.max_registros_por_pagina,
      totalRegistrosDisponiveis: data.configuracao.total_registros_disponiveis,
      registrosSendoExibidos: data.configuracao.registros_sendo_exibidos
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
      limitadoA100Paginas: data.paginacao.limitado_a_100_paginas
    }
  };
};
