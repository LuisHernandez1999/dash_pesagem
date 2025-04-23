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




export const getSolturasDetalhada = async () => {
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
        // Verificar se motorista é um objeto e extrair o nome corretamente
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

export const getQuantidadeSolturaEquipesDia = async () => {
  //// pro elemento Equipes:Análise comparativa por turno
  try {
    const response = await axios.get(`${API_URL}api/quantidade_soltura_equipes/`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.data && response.data.dados) {
      const dadosEquipes = response.data.dados.map((item) => ({
        tipoEquipe: item.tipo_equipe,
        quantidade: item.quantidade,
      }))
      return { dadosEquipes }
    } else {
      return { error: "Nenhum dado encontrado para a quantidade de solturas por equipe no dia" }
    }
  } catch (error) {
    if (error.response) {
      console.error("Erro ao buscar quantidade de solturas por equipe no dia:", error.response.data)
      return { error: error.response.data }
    } else {
      console.error("Erro inesperado:", error.message)
      return { error: "Erro inesperado ao buscar quantidade de solturas por equipe no dia" }
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
