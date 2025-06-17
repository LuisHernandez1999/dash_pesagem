// Serviço para buscar dados do dashboard geral de solturas
export async function getDashGeral() {
  try {
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

    // Verificação da estrutura esperada: success e data devem existir
    if (!result || !result.success || !result.data) {
      throw new Error("Resposta da API está em formato inválido")
    }

    const apiData = result.data

    // Verificação se resultado_por_pa e data existem dentro de result.data
    if (!apiData.resultado_por_pa || !apiData.data) {
      throw new Error("Dados incompletos na resposta da API")
    }

    const resultadoPorPA = apiData.resultado_por_pa

    // Mapeamento correto: RSU = Domiciliar na nossa interface
    const dadosFinal = {
      data: apiData.data,

      PA1: {
        Seletiva: resultadoPorPA.PA1 && resultadoPorPA.PA1.Seletiva ? resultadoPorPA.PA1.Seletiva : null,
        Domiciliar: resultadoPorPA.PA1 && resultadoPorPA.PA1.Rsu ? resultadoPorPA.PA1.Rsu : null,
      },
      PA2: {
        Seletiva: resultadoPorPA.PA2 && resultadoPorPA.PA2.Seletiva ? resultadoPorPA.PA2.Seletiva : null,
        Domiciliar: resultadoPorPA.PA2 && resultadoPorPA.PA2.Rsu ? resultadoPorPA.PA2.Rsu : null,
      },
      PA3: {
        Seletiva: resultadoPorPA.PA3 && resultadoPorPA.PA3.Seletiva ? resultadoPorPA.PA3.Seletiva : null,
        Domiciliar: resultadoPorPA.PA3 && resultadoPorPA.PA3.Rsu ? resultadoPorPA.PA3.Rsu : null,
      },
      PA4: {
        Seletiva: resultadoPorPA.PA4 && resultadoPorPA.PA4.Seletiva ? resultadoPorPA.PA4.Seletiva : null,
        Domiciliar: resultadoPorPA.PA4 && resultadoPorPA.PA4.Rsu ? resultadoPorPA.PA4.Rsu : null,
      },
    }

    console.log("Dados finais mapeados:", dadosFinal)
    return dadosFinal
  } catch (error) {
    throw new Error("Erro ao buscar dados do dashboard geral: " + error.message)
  }
}
