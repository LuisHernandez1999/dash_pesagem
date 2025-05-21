import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/';

export const getContagemPorPaRsu = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/soltura/contagem_geral_por_pa_rsu/`);

    const dados = response.data;

    return {
      PA1: {
        turnos: dados.PA1.turnos,
        motoristas: dados.PA1.motoristas,
        veiculos: dados.PA1.veiculos,
        coletores: dados.PA1.coletores,
      },
      PA2: {
        turnos: dados.PA2.turnos,
        motoristas: dados.PA2.motoristas,
        veiculos: dados.PA2.veiculos,
        coletores: dados.PA2.coletores,
      },
      PA3: {
        turnos: dados.PA3.turnos,
        motoristas: dados.PA3.motoristas,
        veiculos: dados.PA3.veiculos,
        coletores: dados.PA3.coletores,
      },
      PA4: {
        turnos: dados.PA4.turnos,
        motoristas: dados.PA4.motoristas,
        veiculos: dados.PA4.veiculos,
        coletores: dados.PA4.coletores,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar contagem por PA:', error);
    throw error;
  }
};



export const getSolturasPorDiaDaSemanaRSU = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/soltura/saidas_rsu_dias/`);

    const dados = response.data.solturas_por_dia_da_semana_rsu;
    const resultadoDetalhado = [
      {
        diaSemana: 'Domingo',
        quantidade: dados['Domingo'] || 0,
      },
      {
        diaSemana: 'Segunda-feira',
        quantidade: dados['Segunda-feira'] || 0,
      },
      {
        diaSemana: 'Terça-feira',
        quantidade: dados['Terça-feira'] || 0,
      },
      {
        diaSemana: 'Quarta-feira',
        quantidade: dados['Quarta-feira'] || 0,
      },
      {
        diaSemana: 'Quinta-feira',
        quantidade: dados['Quinta-feira'] || 0,
      },
      {
        diaSemana: 'Sexta-feira',
        quantidade: dados['Sexta-feira'] || 0,
      },
      {
        diaSemana: 'Sábado',
        quantidade: dados['Sábado'] || 0,
      },
    ];

    return resultadoDetalhado;

  } catch (error) {
    console.error('Erro ao buscar solturas por dia da semana RSU:', error);
    throw error;
  }
};


export const getSolturasPorGaragemRSU = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/soltura/contar_solturas_rsu_por_garagem/`);

    const dados = response.data.solturas_por_garagem;
    const resultadoDetalhado = [
      {
        garagem: 'PA1',
        quantidade: dados['PA1'] || 0,
      },
      {
        garagem: 'PA2',
        quantidade: dados['PA2'] || 0,
      },
      {
        garagem: 'PA3',
        quantidade: dados['PA3'] || 0,
      },
      {
        garagem: 'PA4',
        quantidade: dados['PA4'] || 0,
      },
      {
        garagem: 'Total',
        quantidade: dados['total'] || 0,
      },
    ];

    return resultadoDetalhado;

  } catch (error) {
    console.error('Erro ao buscar solturas por garagem RSU:', error);
    return [
      { garagem: 'PA1', quantidade: 0 },
      { garagem: 'PA2', quantidade: 0 },
      { garagem: 'PA3', quantidade: 0 },
      { garagem: 'PA4', quantidade: 0 },
      { garagem: 'Total', quantidade: 0 },
    ];
  }
};

export const getQuantidadeMotoristasColetoresPorEquipe = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/soltura/ quantidade_motorista_coletores_equipe_rsu/`);


    const dados = response.data;
    const resultadoDetalhado = Object.entries(dados).map(([equipe, valores]) => ({
      equipe,
      motoristas: valores.motoristas ?? 0,
      coletores: valores.coletores ?? 0,
    }));

    return resultadoDetalhado;

  } catch (error) {
    console.error("Erro ao buscar quantidade de motoristas e coletores por equipe:", error);
    return [
      { equipe: 'Equipe(Diurno)', motoristas: 0, coletores: 0 },
      { equipe: 'Equipe(Noturno)', motoristas: 0, coletores: 0 },
    ];
  }
};



export const getSolturasRSU = async (tipoServico) => {
  try {
    const url = `${API_BASE_URL}/api/soltura/solturas_rsu/`;
    const params = tipoServico ? { tipo_servico: tipoServico } : {};

    const response = await axios.get(url, { params });

    const dados = response.data.solturas || response.data; 
    const resultadoDetalhado = dados.map((soltura) => ({
      motorista: soltura.motorista ?? null,
      matriculaMotorista: soltura.matricula_motorista ?? null,
      tipoEquipe: soltura.tipo_equipe ?? '',
      coletores: Array.isArray(soltura.coletores) ? soltura.coletores : [],
      data: soltura.data ?? null,
      prefixoVeiculo: soltura.prefixo ?? null,
      frequencia: soltura.frequencia ?? null,
      setores: soltura.setores ?? null,
      celular: soltura.celular ?? null,
      lider: soltura.lider ?? null,
      horaEntregaChave: soltura.hora_entrega_chave ?? null,
      horaSaidaFrota: soltura.hora_saida_frota ?? null,
      tipoServico: soltura.tipo_servico ?? '',
      turno: soltura.turno ?? '',
      rota: soltura.rota ?? '',
      statusFrota: soltura.status_frota ?? '',
      tipoVeiculoSelecionado: soltura.tipo_veiculo_selecionado ?? '',
    }));

    return resultadoDetalhado;

  } catch (error) {
    console.error('Erro ao buscar solturas RSU:', error);
    return [];
  }
};


export const fetchSolturasRSU = async () => {
  try {
    const response = await fetch('/api/soltura/buscar_solturas_rsu/'); 

    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();
    const solturasFormatadas = data.solturas.map(soltura => ({
      motorista: soltura.motorista,
      matricula_motorista: soltura.matricula_motorista,
      tipo_equipe: soltura.tipo_equipe,
      coletores: soltura.coletores,
      data: soltura.data,
      prefixo: soltura.prefixo,
      frequencia: soltura.frequencia,
      setores: soltura.setores,
      celular: soltura.celular,
      lider: soltura.lider,
      hora_entrega_chave: soltura.hora_entrega_chave,
      hora_saida_frota: soltura.hora_saida_frota,
      tipo_servico: soltura.tipo_servico,
      turno: soltura.turno,
      rota: soltura.rota,
      status_frota: soltura.status_frota,
      tipo_veiculo_selecionado: soltura.tipo_veiculo_selecionado,
    }));

    return solturasFormatadas;

  } catch (error) {
    console.error('Erro ao buscar solturas:', error);
    return [];
  }
};