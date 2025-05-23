import axios from "axios"

const API_URL = "http://127.0.0.1:8000/"

export const cadastrarSoltura = async (solturaData) => {
  /// pro formulario de cadastro de soltura
  try {
    const response = await axios.post(
      `${API_URL}api/soltura/criar/`,
      {
        motorista: solturaData.motorista,
        tipo_equipe: solturaData.tipo_equipe,
        veiculo: solturaData.veiculo,
        frequencia: solturaData.frequencia,
        garagem: solturaData.garagem,
        celular: solturaData.celular,
        lider: solturaData.lider,
        hora_entrega_chave: solturaData.hora_entrega_chave,
        hora_saida_frota: solturaData.hora_saida_frota,
        hora_chegada: solturaData.hora_chegada,
        turno: solturaData.turno,
        tipo_servico: solturaData.tipo_servico,
        status_frota: solturaData.status_frota,
        rota: solturaData.rota || null,
        coletores: solturaData.tipo_servico?.toLowerCase() !== "varrição" ? solturaData.coletores : undefined,
        data: solturaData.data,
        tipo_veiculo_selecionado:solturaData. tipo_veiculo_selecionado,
        bairro:solturaData.bairro

      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    return response.data
  } catch (error) {
    if (error.response) {
      console.error("Erro no cadastro:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao cadastrar soltura" }
    }
  }
}

export const getVeiculosListaAtivos = async () => {
  //// sera usado no campo de veiculo no  formulario de cadastro de soltura
  try {
    const response = await axios.get(`${API_URL}api/veiculos/lista/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.data && response.data.veiculos_lista_ativos) {
      const veiculos = response.data.veiculos_lista_ativos.map((veiculo) => ({
        prefixo: veiculo.prefixo,
      }))

      return { veiculos }
    } else {
      return { error: "Nenhum veículo ativo encontrado" }
    }
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar veículos ativos:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "erro inesperado ao buscar veiculos ativos" }
    }
  }
}

export const getColaboradoresListaMotoristasAtivos = async () => {
  /// sera usaado no campo de motorista no formulario de soltura
  try {
    const response = await axios.get(`${API_URL}api/colaboradores/colaboradores_lista_motoristas_ativos/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.data && response.data.colaboradores_lista) {
      const motoristas = response.data.colaboradores_lista.map((colaborador) => ({
        nome: colaborador.nome,
        matricula: colaborador.matricula,
      }))

      return { motoristas }
    } else {
      return { error: "Nenhum motorista ativo encontrado" }
    }
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar motoristas ativos:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao buscar motoristas ativos" }
    }
  }
}

export const getColaboradoresListaColetores = async () => {
  //// sera usa no campo coletores no formulario de cadastro de soltura
  try {
    const response = await axios.get(`${API_URL}api/colaboradores/colaboradores_lista_coletores_ativos/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.data && response.data.colaboradores_lista) {
      const coletores = response.data.colaboradores_lista.map((colaborador) => ({
        nome: colaborador.nome,
        matricula: colaborador.matricula,
      }))

      return { coletores }
    } else {
      return { error: "nenhum coletor ativo encontrado" }
    }
  } catch (error) {
    if (error.response) {
      console.error("erro ao buscar coletores ativos:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("erro inesperado:", error.message)
      return { error: "erro inesperado ao buscar coletores ativos" }
    }
  }
}




export const getSolturasDetalhadaTodas = async () => {
  //// sera usado pra tabela de solturas
  try {
    const response = await axios.get(`${API_URL}api/soltura/ver_solturas/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    // Verificar a estrutura dos dados recebidos
    console.log("Dados brutos da API:", response.data);
    
    const solturasDetalhadas = response.data.map((soltura) => {
      // Verificar a estrutura de cada soltura
      console.log("Estrutura de soltura:", soltura);
      
      return {
        id: soltura.id,
        motorista: soltura.motorista && typeof soltura.motorista === 'object' 
          ? soltura.motorista.nome || "Não informado" 
          : soltura.motorista || "Não informado",
        
        // Extrair a matrícula do motorista se disponível
        matricula_motorista: soltura.motorista && typeof soltura.motorista === 'object'
          ? soltura.motorista.matricula || ""
          : soltura.matricula_motorista || "",
        
        tipo_equipe: soltura.tipo_equipe,
        
        // Garantir que coletores seja sempre um array e extrair os nomes corretamente
        coletores: Array.isArray(soltura.coletores) 
          ? soltura.coletores.map(coletor => {
              if (typeof coletor === 'object') {
                return {
                  nome: coletor.nome || "Não informado",
                  matricula: coletor.matricula || ""
                };
              }
              return { nome: coletor || "Não informado", matricula: "" };
            }) 
          : [],
          
        data: soltura.data,
        prefixo: soltura.prefixo || "",
        frequencia: soltura.frequencia,
        setores: soltura.setores,
        celular: soltura.celular,
        lider: soltura.lider,
        hora_entrega_chave: soltura.hora_entrega_chave || null,
        hora_saida_frota: soltura.hora_saida_frota || null,
        tipo_servico: soltura.tipo_servico,
        turno: soltura.turno,
        rota: soltura.rota,
        status_frota: soltura.status_frota,
        tipo_veiculo_selecionado:soltura.tipo_veiculo_selecionado,
        bairro:soltura.bairro
        
      };
    });
    
    console.log("Dados formatados:", solturasDetalhadas);

    return solturasDetalhadas;
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar solturas detalhadas:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao buscar solturas detalhadas" }
    }
  }
}


export const getTotalDeRemocaoSoltasNoDia = async () => {
  //// pra  ultima card
  try {
    const response = await axios.get(`${API_URL}api/soltura/exibir_total_de_remocoes_no_dia/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const totalDeRemocoes = response.data.total_remocoes 

    return { totalDeRemocoes }
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar o total de remoções no dia:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao buscar o total de remoções no dia" }
    }
  }
}

export const getContagemRemocaoAtivos = async () => {
  //// pra segunda card
  try {
    const response = await axios.get(`${API_URL}api/veiculos/contagem_remocao_ativos/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const countRemocaoAtivos = response.data.count_remocao_ativos 

    return { countRemocaoAtivos }
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar a contagem de remoções ativas:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao buscar a contagem de remoções ativas" }
    }
  }
}

export const getContagemRemocaoInativos = async () => {
  ///// pra terceira card
  try {
    const response = await axios.get(`${API_URL}api/veiculos/conatagem_romcao_inativos/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const countRemocaoInativos = response.data.count_remocao_inativos 

    return { countRemocaoInativos }
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar a contagem de remoções inativas:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao buscar a contagem de remoções inativas" }
    }
  }
}

export const getContagemTotalRemocao = async () => {
  ////// pra primeira card
  try {
    const response = await axios.get(`${API_URL}api/veiculos/total_frota_remocao/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const totalRemocao = response.data.total_remocao 

    return { totalRemocao }
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar a contagem total de remoções:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao buscar a contagem total de remoções" }
    }
  }
}



export const getMediaMensalDeSolturas = async () => {
  try {
    const response = await axios.get(`${API_URL}api/soltura/remocao_por_mes/`, {
      //// sera usado na media de remoções por mes que aaparece no grafico de remoções por mes
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.data && typeof response.data.media_mensal_de_solturas === "number") {
      const mediaMensal = response.data.media_mensal_de_solturas

      return { mediaMensal }
    } else {
      return { error: "Média mensal de solturas não encontrada ou formato inesperado" }
    }
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar média mensal de solturas:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao buscar média mensal de solturas" }
    }
  }
}

export const getRemocoesPorMes = async () => {
  ///// será usada pro grafico de remoçoes por mes
  try {
    const response = await axios.get(`${API_URL}api/soltura/solturas_de_remocao_por_mes/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.data && response.data.remocoes_por_mes && typeof response.data.remocoes_por_mes === "object") {
      const remocoes = Object.entries(response.data.remocoes_por_mes).map(([mes, total]) => ({
        mes,
        total,
      }))

      return { remocoes }
    } else {
      return { error: "Dados de remoções por mês não encontrados ou em formato inválido" }
    }
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar remoções por mês:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao buscar remoções por mês" }
    }
  }
}

export const getDistribuicaoPorStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}api/soltura/distribuicao_status/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Extrair as informações necessárias da resposta
    const quantidadeEmAndamento = response.data.quantidade_em_andamento;
    const quantidadeFinalizado = response.data.quantidade_finalizado;
    const resultado = response.data.resultado;

    // Retornar os dados obtidos
    return {
      quantidadeEmAndamento,
      quantidadeFinalizado,
      resultado,
    };
  } catch (error) {
    if (error.response) {
      // Caso haja erro na resposta da API
      console.error("Erro ao buscar a distribuição de status:", error.response.data);
      return { error: error.response.data };
    } else {
      // Caso haja erro na requisição ou outro erro inesperado
      console.error("Erro inesperado:", error.message);
      return { error: "Erro inesperado ao buscar a distribuição de status" };
    }
  }
};

export const getDistribuicaoPorTipoVeiculo = async () => {
  try {
    // Requisição GET para obter os dados de distribuição
    const response = await axios.get(`${API_URL}/api/soltura/tipos_veiculos_soltos_no_dia/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Os dados retornados da API
    const distribuicao = response.data;

    // Verifique se os dados foram recebidos corretamente
    if (distribuicao && distribuicao.Basculante && distribuicao.Baú && distribuicao.Seletolix) {
      return {
        Basculante: {
          contagem: distribuicao.Basculante.contagem || 0,
          porcentagem: distribuicao.Basculante.porcentagem || 0.0,
        },
        Baú: {
          contagem: distribuicao.Baú.contagem || 0,
          porcentagem: distribuicao.Baú.porcentagem || 0.0,
        },
        Seletolix: {
          contagem: distribuicao.Seletolix.contagem || 0,
          porcentagem: distribuicao.Seletolix.porcentagem || 0.0,
        },
      };
    } else {
      throw new Error('Dados da API inválidos');
    }
  } catch (error) {
    console.error('Erro ao buscar a distribuição por tipo de veículo:', error);
    return { error: 'Erro ao buscar a distribuição por tipo de veículo' };
  }
};



export const getQuantidadeSolturaEquipesDiaTipo = async () => {
  try {
    // Requisição GET para o endpoint da API
    const response = await axios.get(`${API_URL}/api/soltura/tipos_equipes_soltas/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Verificação da resposta
    if (!response || !response.data) {
      throw new Error("A resposta da API está vazia ou indefinida");
    }

    const data = response.data;

    // Mapeamento seguro com fallback para 0
    const resultado = {
      'Equipe1(Matutino)': data['Equipe1(Matutino)'] ?? 0,
      'Equipe2(Vespertino)': data['Equipe2(Vespertino)'] ?? 0,
      'Equipe3(Noturno)': data['Equipe3(Noturno)'] ?? 0,
    };

    console.log('Distribuição mapeada por equipe:', resultado);
    return resultado;

  } catch (error) {
    console.error(`Erro ao buscar dados da API: ${error.message}`);
    return {
      'Equipe1(Matutino)': 0,
      'Equipe2(Vespertino)': 0,
      'Equipe3(Noturno)': 0,
    };
  }
};

export const getDistribuicaoPorStatusTipo = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/soltura/ distribuicao_por_status/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || !response.data) {
      throw new Error('Resposta da API está vazia');
    }

    const data = response.data;

    // Mapeamento seguro com fallback para 0
    const distribuicaoStatus = {
      emAndamento: data.quantidade_em_andamento ?? 0,
      finalizado: data.quantidade_finalizado ?? 0,
      resultado: data.resultado || {}, // resultado pode conter outros status também
    };

    console.log('Distribuição por status:', distribuicaoStatus);
    return distribuicaoStatus;
  } catch (error) {
    console.error(`Erro ao buscar distribuição por status: ${error.message}`);
    return {
      emAndamento: 0,
      finalizado: 0,
      resultado: {},
    };
  }
};
export const editarSoltura = async (solturaId, dados) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/soltura/${solturaId}/editar/`, // ou a URL que seu backend define
      {
        motorista: dados.motorista,
        veiculo: dados.veiculo,
        tipo_equipe: dados.tipo_equipe || "",
        frequencia: dados.frequencia,
        setor: dados.setor,
        celular: dados.celular || "",
        lider: dados.lider || "",
        hora_entrega_chave: dados.hora_entrega_chave,
        hora_saida_frota: dados.hora_saida_frota,
        hora_chegada: dados.hora_chegada || null,
        turno: dados.turno,
        tipo_servico: dados.tipo_servico,
        coletores: dados.tipo_servico.toLowerCase() !== "varrição" ? dados.coletores : [],
        rota: dados.rota || null,
        data: dados.data || null,
        status_frota: dados.status_frota || null,
        tipo_veiculo_selecionado :dados.tipo_veiculo_selecionado,
        bairro:dados.bairro

      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Erro ao editar soltura:', error);
    throw error.response?.data || { error: 'Erro inesperado ao editar soltura' };
  }
};
export async function getSolturasDetalhada() {
  try {
    const response = await fetch(`${API_URL}//api/soltura/ver_solturas/ `, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar solturas: ${response.status}`);
    }

    const solturas = await response.json();

    // Mapeamento dos campos retornados
    return solturas.map(item => ({
      motorista: item.motorista,
      matriculaMotorista: item.matricula_motorista,
      tipoEquipe: item.tipo_equipe,
      coletores: item.coletores,
      data: item.data,
      prefixo: item.prefixo,
      frequencia: item.frequencia,
      setores: item.setores,
      celular: item.celular,
      lider: item.lider,
      horaEntregaChave: item.hora_entrega_chave,
      horaSaidaFrota: item.hora_saida_frota,
      tipoServico: item.tipo_servico,
      turno: item.turno,
      rota: item.rota,
      statusFrota: item.status_frota,
      tipoVeiculoSelecionado: item.tipo_veiculo_selecionado,
      bairro: item.bairro
    }));

  } catch (error) {
    console.error('Erro ao buscar solturas:', error);
    throw error;
  }
}

export const getRemocoesPorDiaSemana = async () => {
  try {
    // Simulação de dados para demonstração
    // Em um ambiente real, isso seria uma chamada de API
    const data = {
      remocoes: [
        { day: "Segunda", removals: 42 },
        { day: "Terça", removals: 38 },
        { day: "Quarta", removals: 45 },
        { day: "Quinta", removals: 52 },
        { day: "Sexta", removals: 48 },
        { day: "Sábado", removals: 36 },
        { day: "Domingo", removals: 25 },
      ],
    }

    return data
  } catch (error) {
    console.error("Erro ao obter remoções por dia da semana:", error)
    throw error
  }
}
const DIAS_SEMANA_ORDEM = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export const getSolturasPorDiaDaSemana = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/soltura/solturas_de_semana_/`);
    const rawData = response.data.solturas_por_dia_da_semana;

    const dadosOrdenados = DIAS_SEMANA_ORDEM.map((dia) => ({
      dia,
      total: rawData[dia] ?? 0,
    }));

    return dadosOrdenados;
  } catch (error) {
    console.error('Erro ao buscar solturas por dia da semana:', error);
    throw error;
  }
};



export const contarSolturasPorGaragemHoje = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/soltura/distribuicao_pa/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Verificação da resposta
    if (!response || !response.data) {
      throw new Error("A resposta da API está vazia ou indefinida");
    }

    const data = response.data;

    // Mapeamento seguro com fallback para 0
    const resultado = {
      'PA1': data['PA1'] ?? 0,
      'PA2': data['PA2'] ?? 0,
      'PA3': data['PA3'] ?? 0,
      'PA4': data['PA4'] ?? 0,
      'total': data['total'] ?? 0,
    };

    console.log('Distribuição mapeada por garagem:', resultado);
    return resultado;

  } catch (error) {
    console.error(`Erro ao buscar dados da API: ${error.message}`);
    return {
      'PA1': 0,
      'PA2': 0,
      'PA3': 0,
      'PA4': 0,
      'total': 0,
    };
  }
};



export const contarMotoristasEColetorsHoje = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/soltura/colaboradores_hoje/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Verificação da resposta
    if (!response || !response.data) {
      throw new Error("A resposta da API está vazia ou indefinida");
    }

    const data = response.data;

    // Mapeamento seguro com fallback para 0
    const resultado = {
      'total_motoristas': data['total_motoristas'] ?? 0,
      'total_coletores': data['total_coletores'] ?? 0,
      'total_geral': data['total_geral'] ?? 0,
    };

    console.log('Distribuição mapeada de motoristas e coletores:', resultado);
    return resultado;

  } catch (error) {
    console.error(`Erro ao buscar dados da API: ${error.message}`);
    return {
      'total_motoristas': 0,
      'total_coletores': 0,
      'total_geral': 0,
    };
  }
};


export const getAveriguacoes = async () => {
    try {
        const response = await fetch(`${API_URL}/averiguacao/ver_averiguacao/get/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar averiguações');
        }
        const data = await response.json();
        return data.map(item => ({
            id: item.id,
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
    } catch (error) {
        console.error('Erro ao buscar averiguações:', error);
        throw error;
    }
};



export const buscarSolturaPorId = async (solturaId) => {
  try {
    console.log("🔍 Iniciando busca da soltura:", solturaId)
    console.log("🌐 API_URL:", API_URL)

    const url = `${API_URL}api/soltura/${solturaId}/buscar/`
    console.log("📡 URL da requisição:", url)

    const response = await fetch(url)
    console.log("📥 Response status:", response.status)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Soltura não encontrada")
      }

      const errorData = await response.json()
      throw new Error(errorData.error || "Erro ao buscar soltura")
    }

    const data = await response.json()
    console.log("📊 Dados recebidos da API:", data)

    const mappedData = {
      id: data.id,
      motorista: data.motorista,
      matriculaMotorista: data.matricula_motorista,
      tipoEquipe: data.tipo_equipe,
      coletores: data.coletores,
      garagem:data.garagem,
      data: data.data,
      prefixo: data.prefixo,
      frequencia: data.frequencia,
      setores: data.setores,
      celular: data.celular,
      lider: data.lider,
      horaEntregaChave: data.hora_entrega_chave,
      horaSaidaFrota: data.hora_saida_frota,
      horaChegada: data.hora_chegada,
      tipoServico: data.tipo_servico,
      turno: data.turno,
      rota: data.rota,
      statusFrota: data.status_frota,
      tipoVeiculoSelecionado: data.tipo_veiculo_selecionado,
       bairro:data.bairro
    }

    console.log("✅ Dados mapeados:", mappedData)
    return mappedData
  } catch (error) {
    console.error("❌ Erro ao buscar soltura por ID:", error.message)
    throw error
  }
}
