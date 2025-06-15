// Serviço para buscar dados do dashboard geral
export async function getDashGeral() {
  try {
    console.log("Fazendo requisição para a API...")

    const response = await fetch("http://127.0.0.1:8000/api/soltura/dash_geral/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }

    const result = await response.json()
    console.log("Resposta bruta da API:", result)

    // Verificar se a resposta tem a estrutura esperada
    if (!result.success || !result.data) {
      throw new Error("Estrutura de resposta inválida")
    }

    const apiData = result.data
    console.log("Dados extraídos da API:", apiData)

    // Mapear os dados da API para a estrutura esperada pelo dashboard
    const mappedData = {
      // Mapear PA1, PA2, PA3, PA4 (maiúsculas na API)
      pa1: apiData.PA1 || null,
      pa2: apiData.PA2 || null,
      pa3: apiData.PA3 || null,
      pa4: apiData.PA4 || null,

      // Mapear contagens (snake_case na API para camelCase no dashboard)
      contagemEquipamentos: apiData.contagem_equipamentos || 0,
      contagemEquipamentosRsu: apiData.contagem_equipamentos_rsu || 0,
      contagemEquipamentosRemocao: apiData.contagem_equipamentos_remocao || 0,
      contagemEquipamentosSeletiva: apiData.contagem_equipamentos_seletiva || 0,
      contagemRsu: apiData.contagem_rsu || 0,
      contagemSeletiva: apiData.contagem_seletiva || 0,
      contagemRemocao: apiData.contagem_remocao || 0,
      totalSolturas: apiData.total_solturas || 0,

      // Mapear contagem por garagem e serviço
      contagemPorGaragemEServico: apiData.contagem_por_garagem_e_servico || {},
    }

    console.log("Dados mapeados para o dashboard:", mappedData)
    return mappedData
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    throw error
  }
}
