// services/weighing-service.js

// Mock implementation for weighing services
// Replace with actual API calls

const mockData = {
    dashboardSummary: {
      totalWeighings: 1234,
      totalTonnage: 55000,
      period: "month",
    },
    monthlyData: [
      { month: "Jan", seletiva: 100, cataTreco: 50, total: 150, meta: 200, eficiencia: 75 },
      { month: "Fev", seletiva: 120, cataTreco: 60, total: 180, meta: 200, eficiencia: 90 },
      { month: "Mar", seletiva: 110, cataTreco: 55, total: 165, meta: 200, eficiencia: 82 },
      { month: "Abr", seletiva: 130, cataTreco: 65, total: 195, meta: 200, eficiencia: 97 },
      { month: "Mai", seletiva: 140, cataTreco: 70, total: 210, meta: 200, eficiencia: 105 },
      { month: "Jun", seletiva: 150, cataTreco: 75, total: 225, meta: 200, eficiencia: 112 },
      { month: "Jul", seletiva: 160, cataTreco: 80, total: 240, meta: 200, eficiencia: 120 },
      { month: "Ago", seletiva: 170, cataTreco: 85, total: 255, meta: 200, eficiencia: 127 },
      { month: "Set", seletiva: 180, cataTreco: 90, total: 270, meta: 200, eficiencia: 135 },
      { month: "Out", seletiva: 190, cataTreco: 95, total: 285, meta: 200, eficiencia: 142 },
      { month: "Nov", seletiva: 200, cataTreco: 100, total: 300, meta: 200, eficiencia: 150 },
      { month: "Dez", seletiva: 210, cataTreco: 105, total: 315, meta: 200, eficiencia: 157 },
    ],
    cooperativesData: [
      { id: 1, nome: "Cooperativa A", total_pesagens: 500, percentual: 10 },
      { id: 2, nome: "Cooperativa B", total_pesagens: 400, percentual: 8 },
      { id: 3, nome: "Cooperativa C", total_pesagens: 300, percentual: 6 },
      { id: 4, nome: "Cooperativa D", total_pesagens: 200, percentual: 4 },
      { id: 5, nome: "Cooperativa E", total_pesagens: 100, percentual: 2 },
    ],
    driversData: [
      { id: 1, nome: "Motorista A", total_pesagens: 150, eficiencia: 92, avatar: "MA" },
      { id: 2, nome: "Motorista B", total_pesagens: 140, eficiencia: 88, avatar: "MB" },
      { id: 3, nome: "Motorista C", total_pesagens: 130, eficiencia: 78, avatar: "MC" },
      { id: 4, nome: "Motorista D", total_pesagens: 120, eficiencia: 95, avatar: "MD" },
      { id: 5, nome: "Motorista E", total_pesagens: 110, eficiencia: 85, avatar: "ME" },
    ],
    vehicleData: [
      { id: 1, name: "Caminhão 1", weighings: 200 },
      { id: 2, name: "Caminhão 2", weighings: 180 },
      { id: 3, name: "Caminhão 3", weighings: 160 },
      { id: 4, name: "Caminhão 4", weighings: 140 },
      { id: 5, name: "Caminhão 5", weighings: 120 },
    ],
    topVehicle: {
      name: "Caminhão 1",
      weighings: 200,
    },
    efficiencyData: {
      efficiency: 95,
      period: "month",
    },
    quantidade_de_pesagens_data: {
      total: 500,
    },
    quantidade_de_toneladas_pesadas_data: {
      meta: 60000,
      atual: 55000,
      percentual: 91.67,
    },
    meta_batida_data: {
      janeiro: true,
      fevereiro: true,
      marco: false,
    },
    def_pesagens_seletiva_data: {
      total: 300,
    },
    def_pesagens_cata_treco_data: {
      total: 200,
    },
    def_pesagens_ao_longo_ano_por_tipo_pesagem_data: [
      { tipo: "Seletiva", janeiro: 20, fevereiro: 25, marco: 30 },
      { tipo: "Cata Treco", janeiro: 15, fevereiro: 18, marco: 22 },
    ],
    top_5_coperativas_por_pesagem_data: [
      { rank: 1, nome: "Cooperativa A", total_pesagens: 500, percentual: 10 },
      { rank: 2, nome: "Cooperativa B", total_pesagens: 400, percentual: 8 },
      { rank: 3, nome: "Cooperativa C", total_pesagens: 300, percentual: 6 },
      { rank: 4, nome: "Cooperativa D", total_pesagens: 200, percentual: 4 },
      { rank: 5, nome: "Cooperativa E", total_pesagens: 100, percentual: 2 },
    ],
    veiculo_maior_pesagens_data: {
      name: "Caminhão X",
      weighings: 600,
    },
    eficiencia_motoristas_data: [
      { id: 1, nome: "Motorista A", total_pesagens: 150, eficiencia: 92, avatar: "MA" },
      { id: 2, nome: "Motorista B", total_pesagens: 140, eficiencia: 88, avatar: "MB" },
      { id: 3, nome: "Motorista C", total_pesagens: 130, eficiencia: 78, avatar: "MC" },
      { id: 4, nome: "Motorista D", total_pesagens: 120, eficiencia: 95, avatar: "MD" },
      { id: 5, nome: "Motorista E", total_pesagens: 110, eficiencia: 85, avatar: "ME" },
    ],
  }
  
  export const quantidade_de_pesagens = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.quantidade_de_pesagens_data
  }
  
  export const quantidade_de_toneladas_pesadas = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.quantidade_de_toneladas_pesadas_data
  }
  
  export const exibir_pesagem_por_mes = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.monthlyData
  }
  
  export const meta_batida = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.meta_batida_data
  }
  
  export const def_pesagens_seletiva = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.def_pesagens_seletiva_data
  }
  
  export const def_pesagens_cata_treco = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.def_pesagens_cata_treco_data
  }
  
  export const def_pesagens_ao_longo_ano_por_tipo_pesagem = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.def_pesagens_ao_longo_ano_por_tipo_pesagem_data
  }
  
  export const top_5_coperativas_por_pesagem = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.top_5_coperativas_por_pesagem_data
  }
  
  export const veiculo_maior_pesagens = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.veiculo_maior_pesagens_data
  }
  
  export const eficiencia_motoristas = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.eficiencia_motoristas_data
  }
  
  