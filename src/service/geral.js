import axios from "axios"

const API_URL = "http://127.0.0.1:8000"

export const getDashGeral = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/soltura/dash_geral/`)
    const apiResponse = response.data

    console.log("Resposta completa da API:", apiResponse) // Para debug

    // A API retorna { success: true, data: { ... } }
    // Precisamos acessar apiResponse.data, não response.data
    const data = apiResponse.data

    if (!data) {
      throw new Error("Dados não encontrados na resposta da API")
    }

    // Função auxiliar para acessar dados de forma segura
    const safeGet = (obj, path, defaultValue = 0) => {
      try {
        return path.split(".").reduce((current, key) => current?.[key], obj) ?? defaultValue
      } catch {
        return defaultValue
      }
    }

    // Função para processar dados de uma PA
    const processPA = (paData) => {
      if (!paData)
        return {
          Seletiva: {
            veiculos: 0,
            motoristas: 0,
            coletores: 0,
            equipamentos: 0,
            meta_batida: { motoristas: false, coletores: false, equipamentos: false },
          },
          Rsu: {
            veiculos: 0,
            motoristas: 0,
            coletores: 0,
            equipamentos: 0,
            meta_batida: { motoristas: false, coletores: false, equipamentos: false },
          },
          Remoção: {
            veiculos: 0,
            motoristas: 0,
            coletores: 0,
            equipamentos: 0,
            meta_batida: { motoristas: false, coletores: false, equipamentos: false },
          },
        }

      return {
        Seletiva: {
          veiculos: safeGet(paData, "Seletiva.veiculos", 0),
          motoristas: safeGet(paData, "Seletiva.motoristas", 0),
          coletores: safeGet(paData, "Seletiva.coletores", 0),
          equipamentos: safeGet(paData, "Seletiva.equipamentos", 0),
          meta_batida: {
            motoristas: safeGet(paData, "Seletiva.meta_batida.motoristas", false),
            coletores: safeGet(paData, "Seletiva.meta_batida.coletores", false),
            equipamentos: safeGet(paData, "Seletiva.meta_batida.equipamentos", false),
          },
        },
        Rsu: {
          veiculos: safeGet(paData, "Rsu.veiculos", 0),
          motoristas: safeGet(paData, "Rsu.motoristas", 0),
          coletores: safeGet(paData, "Rsu.coletores", 0),
          equipamentos: safeGet(paData, "Rsu.equipamentos", 0),
          meta_batida: {
            motoristas: safeGet(paData, "Rsu.meta_batida.motoristas", false),
            coletores: safeGet(paData, "Rsu.meta_batida.coletores", false),
            equipamentos: safeGet(paData, "Rsu.meta_batida.equipamentos", false),
          },
        },
        Remoção: {
          veiculos: safeGet(paData, "Remoção.veiculos", 0),
          motoristas: safeGet(paData, "Remoção.motoristas", 0),
          coletores: safeGet(paData, "Remoção.coletores", 0),
          equipamentos: safeGet(paData, "Remoção.equipamentos", 0),
          meta_batida: {
            motoristas: safeGet(paData, "Remoção.meta_batida.motoristas", false),
            coletores: safeGet(paData, "Remoção.meta_batida.coletores", false),
            equipamentos: safeGet(paData, "Remoção.meta_batida.equipamentos", false),
          },
        },
      }
    }

    // CORRIGIR: Processar por_garagem e somar por serviço
    const processarPorGaragem = (statusFrota) => {
      const porServico = {
        Seletiva: 0,
        Rsu: 0,
        Remoção: 0,
      }

      // Se tem por_garagem, somar os valores por serviço
      if (statusFrota?.por_garagem) {
        Object.values(statusFrota.por_garagem).forEach((garagem) => {
          if (garagem.Seletiva) porServico.Seletiva += garagem.Seletiva
          if (garagem.Rsu) porServico.Rsu += garagem.Rsu
          if (garagem.Remoção) porServico.Remoção += garagem.Remoção
        })
      }
      // Se tem por_servico diretamente, usar esses valores
      else if (statusFrota?.por_servico) {
        porServico.Seletiva = statusFrota.por_servico.Seletiva || 0
        porServico.Rsu = statusFrota.por_servico.Rsu || 0
        porServico.Remoção = statusFrota.por_servico.Remoção || 0
      }

      return porServico
    }

    console.log("Dados processados:", {
      dataAtual: data.data,
      resultado_por_pa: data.resultado_por_pa,
      status_frota_andamento: data.status_frota_andamento,
      status_frota_andamento_mais_finalizado: data.status_frota_andamento_mais_finalizado,
    })

    // Processar status_frota_andamento
    const statusAndamento = processarPorGaragem(data.status_frota_andamento)
    const statusTotal = processarPorGaragem(data.status_frota_andamento_mais_finalizado)

    console.log("Status andamento processado:", statusAndamento)
    console.log("Status total processado:", statusTotal)

    // Retorno estruturado COMPLETO e DEFENSIVO
    return {
      dataAtual: data.data || new Date().toISOString().split("T")[0],

      resultado_por_pa: {
        PA1: processPA(data.resultado_por_pa?.PA1),
        PA2: processPA(data.resultado_por_pa?.PA2),
        PA3: processPA(data.resultado_por_pa?.PA3),
        PA4: processPA(data.resultado_por_pa?.PA4),
      },

      status_frota_andamento: {
        total: safeGet(data, "status_frota_andamento.total", 0),
        por_servico: statusAndamento,
      },

      status_frota_andamento_mais_finalizado: {
        total: safeGet(data, "status_frota_andamento_mais_finalizado.total", 0),
        por_servico: statusTotal,
      },
    }
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    console.error("Detalhes do erro:", error.response?.data || error.message)
    throw new Error(`Falha ao carregar dados: ${error.response?.status || "Erro de conexão"}`)
  }
}
