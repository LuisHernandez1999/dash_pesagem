import api from "../pages/api/api"

// Get total number of weighings
export const quantidade_de_pesagens = async () => {
  try {
    const response = await api.get("/quantidade-pesagens/")
    return { total: response.data.quantidade_de_pesagens || 0 }
  } catch (error) {
    console.error("Error fetching quantidade_de_pesagens:", error)
    return { total: 0 }
  }
}

// Get total tonnage weighed
export const quantidade_de_toneladas_pesadas = async () => {
  try {
    const response = await api.get("/quantidade-toneladas/")
    const meta = 2601.0 // Default meta value from backend
    const atual = response.data.total_toneladas_pesadas || 0
    const percentual = meta > 0 ? Math.round((atual / meta) * 100) : 0

    return {
      meta: meta,
      atual: atual,
      percentual: percentual,
    }
  } catch (error) {
    console.error("Error fetching quantidade_de_toneladas_pesadas:", error)
    return { meta: 0, atual: 0, percentual: 0 }
  }
}

// Get weighings by month
export const exibir_pesagem_por_mes = async () => {
  try {
    const response = await api.get("/exibir-pesagem-mes/")
    const data = response.data.pesagens_por_periodo_personalizado || []

    // Transform data to match dashboard format
    return data.map((item) => ({
      month: `${item.mes_referencia}/${item.ano}`,
      seletiva: item.tipo_pesagem === "SELETIVA" ? item.quantidade_pesagens : 0,
      cataTreco: item.tipo_pesagem === "CATA TRECO" ? item.quantidade_pesagens : 0,
      total: item.quantidade_pesagens,
      meta: Math.round(item.quantidade_pesagens * 1.2), // Example meta calculation
      eficiencia: Math.round((item.quantidade_pesagens / (item.quantidade_pesagens * 1.2)) * 100),
    }))
  } catch (error) {
    console.error("Error fetching exibir_pesagem_por_mes:", error)
    return []
  }
}

// Get target achievement data
export const meta_batida = async () => {
  try {
    const response = await api.get("/meta-batida/")
    return {
      meta: response.data.meta_toneladas || 0,
      atual: response.data.peso_total_batido || 0,
      percentual: response.data.porcentagem_atingida || 0,
    }
  } catch (error) {
    console.error("Error fetching meta_batida:", error)
    return { meta: 0, atual: 0, percentual: 0 }
  }
}

// Get selective weighings count
export const def_pesagens_seletiva = async () => {
  try {
    const response = await api.get("/def-pesagens-seletiva/")
    return { total: response.data.total_pesagens_seletiva || 0 }
  } catch (error) {
    console.error("Error fetching def_pesagens_seletiva:", error)
    return { total: 0 }
  }
}

// Get "cata treco" weighings count
export const def_pesagens_cata_treco = async () => {
  try {
    const response = await api.get("/def-pesagens-cata-treco/")
    return { total: response.data.total_pesagens_cata_treco || 0 }
  } catch (error) {
    console.error("Error fetching def_pesagens_cata_treco:", error)
    return { total: 0 }
  }
}

// Get weighings throughout the year by type
export const def_pesagens_ao_longo_ano_por_tipo_pesagem = async () => {
  try {
    const response = await api.get("/def-pesagens-ao-longo-ano-por-tipo-pesagem/")
    const data = response.data.pesagens_ao_longo_ano || {}

    // Transform data to match dashboard format
    return Object.entries(data).map(([key, value]) => {
      const [year, month] = key.split("-")
      return {
        month: `${month}/${year}`,
        seletiva: value.SELETIVA || 0,
        cataTreco: value["CATA TRECO"] || 0,
        outros: value.OUTROS || 0,
        total: value.total_geral || 0,
      }
    })
  } catch (error) {
    console.error("Error fetching def_pesagens_ao_longo_ano_por_tipo_pesagem:", error)
    return []
  }
}

// Get top 5 cooperatives by weighing
export const top_5_coperativas_por_pesagem = async () => {
  try {
    const response = await api.get("/topo-5-coperativas-por-pesagem/")
    const data = response.data.top_5_cooperativas || []

    // Transform data to match dashboard format
    return data.map((item, index) => ({
      rank: index + 1,
      nome: item.cooperativa,
      total_pesagens: item.total_pesagens,
      percentual: Number.parseFloat(item.porcentagem.replace("%", "")),
    }))
  } catch (error) {
    console.error("Error fetching top_5_coperativas_por_pesagem:", error)
    return []
  }
}

// Get vehicle with most weighings
export const veiculo_maior_pesagens = async () => {
  try {
    const response = await api.get("/veiculo-maior-pesagens/")
    const data = response.data.veiculo_com_mais_pesagens

    if (!data) return null

    return {
      prefix: data.prefixo,
      type: data.tipo_veiculo,
      total_pesagens: data.quantidade_de_pesagens,
      eficiencia: 95, // Example value
    }
  } catch (error) {
    console.error("Error fetching veiculo_maior_pesagens:", error)
    return null
  }
}

// Get driver efficiency
export const eficiencia_motoristas = async () => {
  try {
    const response = await api.get("/eficiencia-motoristas/")
    const data = response.data.eficiencia_motoristas || []

    // Transform data to match dashboard format
    return data.map((item) => ({
      id: item.motorista_id,
      nome: item.nome,
      total_pesagens: item.total_pesagens,
      eficiencia: item.eficiencia_percentual,
    }))
  } catch (error) {
    console.error("Error fetching eficiencia_motoristas:", error)
    return []
  }
}

// Get vehicle efficiency (additional endpoint)
export const eficiencia_veiculos = async () => {
  try {
    const response = await api.get("/eficiencia-veiculos/")
    const data = response.data.eficiencia_veiculos || []

    // Transform data to match dashboard format
    return data.map((item) => ({
      id: item.veiculo_id,
      prefixo: item.prefixo,
      total_pesagens: item.total_pesagens,
      eficiencia: item.eficiencia_percentual,
    }))
  } catch (error) {
    console.error("Error fetching eficiencia_veiculos:", error)
    return []
  }
}

// Get cooperative efficiency (additional endpoint)
export const eficiencia_cooperativas = async () => {
  try {
    const response = await api.get("/eficiencia-cooperativas/")
    const data = response.data.eficiencia_cooperativas || []

    // Transform data to match dashboard format
    return data.map((item) => ({
      id: item.cooperativa_id,
      nome: item.nome,
      total_pesagens: item.total_pesagens,
      eficiencia: item.eficiencia_percentual,
    }))
  } catch (error) {
    console.error("Error fetching eficiencia_cooperativas:", error)
    return []
  }
}

