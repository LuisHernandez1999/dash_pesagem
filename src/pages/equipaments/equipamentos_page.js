"use client"

import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Box,
  Container,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from "@mui/material"
import { Construction, CheckCircle, Cancel, Today, Refresh, Menu as MenuIcon } from "@mui/icons-material"
import EquipmentTable from "../../components/equipamentes_table"
import WeeklyDistributionChart from "../../components/grafic_equipmanents"
import EquipmentTypeSummary from "../../components/equipament_summary"
import EquipmentListModal from "../../components/equipaments_list"
import {
  listarPrefixosEImplementos,
  listarEquipamentosTable,
  contarEquipamentosSemana,
} from "../../service/equipamento"

// Animation keyframes
const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideInUp: `
    @keyframes slideInUp {
      from {
        transform: translateY(15px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
  `,
}

// Theme colors
const themeColors = {
  primary: {
    main: "#3a86ff",
    light: "#5e9bff",
    dark: "#2970e6",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ff006e",
    light: "#ff4b93",
    dark: "#c8005a",
    contrastText: "#ffffff",
  },
  success: {
    main: "#00c896",
    light: "#33d3aa",
    dark: "#00a078",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ffbe0b",
    light: "#ffcb3d",
    dark: "#e6aa00",
    contrastText: "#ffffff",
  },
  error: {
    main: "#fb5607",
    light: "#fc7739",
    dark: "#e64e00",
    contrastText: "#ffffff",
  },
  info: {
    main: "#8338ec",
    light: "#9c5ff0",
    dark: "#6a2dbd",
    contrastText: "#ffffff",
  },
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    disabled: "#94a3b8",
  },
  background: {
    default: "#ffffff",
    paper: "#ffffff",
    card: "#ffffff",
    dark: "#0f172a",
  },
  divider: "rgba(226, 232, 240, 0.8)",
}

// Custom stat card component with click functionality
const CustomStatCard = ({ title, value, icon: Icon, color, highlight, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      background: "#ffffff",
      height: "100%",
      transition: "all 0.3s ease",
      cursor: "pointer",
      "&:hover": {
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        transform: "translateY(-4px)",
        "& .card-icon": {
          transform: "scale(1.1)",
        },
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        background: color,
        zIndex: 1,
      },
      animation: highlight ? `${keyframes.fadeIn} 0.6s ease-out` : `${keyframes.fadeIn} 0.6s ease-out`,
    }}
  >
    <Box
      className="card-icon"
      sx={{
        position: "absolute",
        top: "20px",
        right: "20px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: alpha(color, 0.1),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.3s ease",
      }}
    >
      <Icon sx={{ fontSize: 24, color: color }} />
    </Box>
    <CardContent sx={{ p: 3, pt: 4, pb: 5 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", sm: "2.5rem" },
          color: themeColors.text.primary,
          mb: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: themeColors.text.secondary,
          fontWeight: 500,
          fontSize: "0.95rem",
        }}
      >
        {title}
      </Typography>
    </CardContent>
  </Card>
)

// Function to transform API equipment data to match modal component expectations
const transformEquipmentData = (equipmentList) => {
  return equipmentList.map((equipment, index) => ({
    id: index + 1,
    prefix: equipment.prefixo,
    status: equipment.status,
    type: equipment.implemento,
  }))
}

// Function to transform table equipment data from API
const transformTableEquipmentData = (equipmentList) => {
  return equipmentList.map((equipment, index) => ({
    id: index + 1,
    prefix: equipment.prefixo_equipamento || "",
    type: equipment.implemento || "",
    status: equipment.status_equipamento || "",
    model: "N/A",
    location: "N/A",
    lastMaintenance: "N/A",
    nextMaintenance: "N/A",
    operator: "N/A",
    workingHours: 0,
  }))
}

// Function to transform weekly API data to chart format
const transformWeeklyData = (equipamentos) => {
  console.log("🔍 Iniciando transformação dos dados semanais")
  console.log("📊 Equipamentos recebidos:", equipamentos)

  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

  // Função para normalizar nomes de equipamentos (remover acentos, aspas, etc.)
  const normalizeEquipmentName = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/['"]/g, "") // Remove aspas
      .replace(/\s+/g, "") // Remove espaços
  }

  // Mapeamento de nomes de equipamentos para as chaves do gráfico
  const equipmentMapping = {
    retroescavadeira: "retroescavadeira",
    pacarregadeira: "paCarregadeira",
    caminhaocarroceria: "carroceria",
    carroceria: "carroceria",
    caminhaocarroceiria: "carroceria", // Corrigindo o erro de digitação
  }

  // Detectar todos os tipos de equipamentos únicos
  const uniqueEquipmentTypes = [...new Set(equipamentos.map((eq) => normalizeEquipmentName(eq.equipamento)))]
  console.log("🔧 Tipos de equipamentos detectados:", uniqueEquipmentTypes)

  // Criar um objeto com todos os tipos de equipamentos inicializados com 0
  const createEmptyDayData = (day) => {
    const dayData = { day }

    // Garantir que sempre temos as três propriedades padrão
    dayData.carroceria = 0
    dayData.paCarregadeira = 0
    dayData.retroescavadeira = 0

    return dayData
  }

  const result = days.map((day) => {
    const dayData = createEmptyDayData(day)

    console.log(`📅 Processando dia: ${day}`)

    equipamentos.forEach((equipment) => {
      const equipmentName = equipment.equipamento
      const normalizedName = normalizeEquipmentName(equipmentName)
      const mappedName = equipmentMapping[normalizedName] || normalizedName

      // Mapear o nome do dia para a propriedade correspondente
      let dayValue = 0
      switch (day) {
        case "Segunda":
          dayValue = equipment.segunda || 0
          break
        case "Terça":
          dayValue = equipment.terca || 0
          break
        case "Quarta":
          dayValue = equipment.quarta || 0
          break
        case "Quinta":
          dayValue = equipment.quinta || 0
          break
        case "Sexta":
          dayValue = equipment.sexta || 0
          break
        case "Sábado":
          dayValue = equipment.sabado || 0
          break
        case "Domingo":
          dayValue = equipment.domingo || 0
          break
      }

      console.log(`🔧 Equipamento: ${equipmentName}, Normalizado: ${normalizedName}, Mapeado para: ${mappedName}`)
      console.log(`📊 Valor para ${day}:`, dayValue)

      if (dayData.hasOwnProperty(mappedName)) {
        dayData[mappedName] = dayValue
        console.log(`✅ Atribuído ${dayValue} para ${mappedName} no dia ${day}`)
      } else {
        console.log(`❌ Propriedade ${mappedName} não encontrada no dayData`)
      }
    })

    console.log(`📊 Dados finais para ${day}:`, dayData)
    return dayData
  })

  console.log("🎯 Resultado final da transformação:", result)
  return result
}

export default function EquipmentDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // API data state for cards
  const [apiData, setApiData] = useState({
    contagem_total: 0,
    contagem_ativos: 0,
    contagem_inativos: 0,
    contagem_manutencao: 0,
    todos: [],
    ativos: [],
    inativos: [],
  })

  // Table data state (from API)
  const [tableData, setTableData] = useState({
    equipamentos: [],
    pagina_atual: 1,
    total_paginas: 1,
    total_equipamentos: 0,
  })

  // Current equipment list for modal
  const [currentModalList, setCurrentModalList] = useState([])

  // Loading states
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(true)

  // Weekly distribution data from API
  const [weeklyData, setWeeklyData] = useState([])
  const [weeklyLoading, setWeeklyLoading] = useState(true)

  // Fetch equipment data for cards from API
  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        setLoading(true)
        const data = await listarPrefixosEImplementos()

        console.log("Cards API Response:", data)

        setApiData({
          contagem_total: data.contagem_total || 0,
          contagem_ativos: data.contagem_ativos || 0,
          contagem_inativos: data.contagem_inativos || 0,
          contagem_manutencao: data.contagem_manutencao || 0,
          todos: data.todos || [],
          ativos: data.ativos || [],
          inativos: data.inativos || [],
        })
      } catch (error) {
        console.error("Erro ao carregar dados dos cards:", error)
        setSnackbarMessage("Erro ao carregar dados dos cards")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } finally {
        setLoading(false)
      }
    }

    fetchEquipmentData()
  }, [])

  // Fetch table data from API
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setTableLoading(true)
        const data = await listarEquipamentosTable({
          pagina: 1,
          itensPorPagina: 100,
        })

        console.log("Table API Response:", data)

        setTableData(data)
      } catch (error) {
        console.error("Erro ao carregar dados da tabela:", error)
        setSnackbarMessage("Erro ao carregar dados da tabela")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } finally {
        setTableLoading(false)
      }
    }

    fetchTableData()
  }, [])

  // Fetch weekly distribution data from API
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setWeeklyLoading(true)
        console.log("🚀 Iniciando busca dos dados semanais")

        const data = await contarEquipamentosSemana()

        console.log("📡 Resposta completa da API:", data)
        console.log("📊 Tipo de data:", typeof data)
        console.log("📊 Data é array?", Array.isArray(data))
        console.log("📊 Equipamentos:", data?.equipamentos)
        console.log("📊 Tipo de equipamentos:", typeof data?.equipamentos)
        console.log("📊 Equipamentos é array?", Array.isArray(data?.equipamentos))
        console.log("📊 Quantidade de equipamentos:", data?.equipamentos?.length)

        if (data && data.equipamentos && Array.isArray(data.equipamentos) && data.equipamentos.length > 0) {
          console.log("✅ Dados válidos encontrados, iniciando transformação")
          const transformedData = transformWeeklyData(data.equipamentos)
          console.log("🎯 Dados transformados:", transformedData)
          setWeeklyData(transformedData)
        } else {
          console.log("❌ Nenhum equipamento válido encontrado")
          console.log("🔍 Detalhes do problema:")
          console.log("  - data existe?", !!data)
          console.log("  - data.equipamentos existe?", !!data?.equipamentos)
          console.log("  - é array?", Array.isArray(data?.equipamentos))
          console.log("  - tem itens?", data?.equipamentos?.length > 0)

          // Fallback to empty data
          const fallbackData = [
            { day: "Segunda", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
            { day: "Terça", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
            { day: "Quarta", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
            { day: "Quinta", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
            { day: "Sexta", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
            { day: "Sábado", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
            { day: "Domingo", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
          ]
          console.log("🔄 Usando dados de fallback:", fallbackData)
          setWeeklyData(fallbackData)
        }
      } catch (error) {
        console.error("💥 Erro ao carregar dados semanais:", error)
        console.error("💥 Stack trace:", error.stack)
        setSnackbarMessage("Erro ao carregar dados do gráfico semanal")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)

        // Fallback to empty data
        const fallbackData = [
          { day: "Segunda", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
          { day: "Terça", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
          { day: "Quarta", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
          { day: "Quinta", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
          { day: "Sexta", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
          { day: "Sábado", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
          { day: "Domingo", carroceria: 0, paCarregadeira: 0, retroescavadeira: 0 },
        ]
        console.log("🔄 Usando dados de fallback após erro:", fallbackData)
        setWeeklyData(fallbackData)
      } finally {
        setWeeklyLoading(false)
        console.log("🏁 Busca de dados semanais finalizada")
      }
    }

    fetchWeeklyData()
  }, [])

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  // Equipment list modal state
  const [listModalOpen, setListModalOpen] = useState(false)
  const [listModalTitle, setListModalTitle] = useState("")

  // Handle card clicks
  const handleCardClick = (cardType) => {
    let equipmentList = []

    switch (cardType) {
      case "total":
        setListModalTitle("Todos os Equipamentos")
        equipmentList = transformEquipmentData(apiData.todos)
        break
      case "active":
        setListModalTitle("Equipamentos Ativos")
        equipmentList = transformEquipmentData(apiData.ativos)
        break
      case "inactive":
        setListModalTitle("Equipamentos Inativos")
        equipmentList = transformEquipmentData(apiData.inativos)
        break
      case "maintenance":
        setListModalTitle("Equipamentos em Manutenção")
        equipmentList = []
        break
    }

    setCurrentModalList(equipmentList)
    setListModalOpen(true)
  }

  // Handle refresh data
  const handleRefreshData = async () => {
    try {
      console.log("🔄 Iniciando atualização de todos os dados")
      setLoading(true)
      setTableLoading(true)
      setWeeklyLoading(true)

      // Refresh cards data
      console.log("📊 Atualizando dados dos cards")
      const cardsData = await listarPrefixosEImplementos()
      console.log("📊 Dados dos cards recebidos:", cardsData)
      setApiData({
        contagem_total: cardsData.contagem_total || 0,
        contagem_ativos: cardsData.contagem_ativos || 0,
        contagem_inativos: cardsData.contagem_inativos || 0,
        contagem_manutencao: cardsData.contagem_manutencao || 0,
        todos: cardsData.todos || [],
        ativos: cardsData.ativos || [],
        inativos: cardsData.inativos || [],
      })

      // Refresh table data
      console.log("📋 Atualizando dados da tabela")
      const tableDataResponse = await listarEquipamentosTable({
        pagina: 1,
        itensPorPagina: 100,
      })
      console.log("📋 Dados da tabela recebidos:", tableDataResponse)
      setTableData(tableDataResponse)

      // Refresh weekly data
      console.log("📈 Atualizando dados semanais")
      const weeklyDataResponse = await contarEquipamentosSemana()
      console.log("📈 Dados semanais recebidos:", weeklyDataResponse)
      if (weeklyDataResponse && weeklyDataResponse.equipamentos) {
        const transformedWeeklyData = transformWeeklyData(weeklyDataResponse.equipamentos)
        setWeeklyData(transformedWeeklyData)
      }

      setSnackbarMessage("Todos os dados atualizados com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      console.log("✅ Atualização de dados concluída com sucesso")
    } catch (error) {
      console.error("❌ Erro ao atualizar dados:", error)
      setSnackbarMessage("Erro ao atualizar dados")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
      setTableLoading(false)
      setWeeklyLoading(false)
      console.log("🏁 Processo de atualização finalizado")
    }
  }

  // Handle table refresh
  const handleTableRefresh = async () => {
    try {
      console.log("🔄 Iniciando atualização da tabela")
      setTableLoading(true)
      const data = await listarEquipamentosTable({
        pagina: 1,
        itensPorPagina: 100,
      })
      console.log("📋 Novos dados da tabela recebidos:", data)
      setTableData(data)
      setSnackbarMessage("Dados da tabela atualizados!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      console.log("✅ Atualização da tabela concluída com sucesso")
    } catch (error) {
      console.error("❌ Erro ao atualizar tabela:", error)
      setSnackbarMessage("Erro ao atualizar tabela")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setTableLoading(false)
      console.log("🏁 Processo de atualização da tabela finalizado")
    }
  }

  // Handle weekly chart refresh
  const handleWeeklyRefresh = async () => {
    try {
      console.log("🔄 Iniciando atualização dos dados semanais")
      setWeeklyLoading(true)
      const data = await contarEquipamentosSemana()
      console.log("📈 Novos dados semanais recebidos:", data)

      if (data && data.equipamentos) {
        const transformedData = transformWeeklyData(data.equipamentos)
        setWeeklyData(transformedData)
        setSnackbarMessage("Dados do gráfico semanal atualizados!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
      }

      console.log("✅ Atualização dos dados semanais concluída com sucesso")
    } catch (error) {
      console.error("❌ Erro ao atualizar dados semanais:", error)
      setSnackbarMessage("Erro ao atualizar dados do gráfico semanal")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setWeeklyLoading(false)
      console.log("🏁 Processo de atualização dos dados semanais finalizado")
    }
  }

  // Handle equipment type summary refresh
  const handleEquipmentTypeSummaryRefresh = async () => {
    try {
      console.log("🔄 Iniciando atualização dos dados de tipos de equipamentos")
      setLoading(true)
      const data = await listarPrefixosEImplementos()
      console.log("📊 Novos dados de tipos recebidos:", data)

      setApiData({
        contagem_total: data.contagem_total || 0,
        contagem_ativos: data.contagem_ativos || 0,
        contagem_inativos: data.contagem_inativos || 0,
        contagem_manutencao: data.contagem_manutencao || 0,
        todos: data.todos || [],
        ativos: data.ativos || [],
        inativos: data.inativos || [],
      })

      setSnackbarMessage("Dados de tipos de equipamentos atualizados!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      console.log("✅ Atualização dos dados de tipos concluída com sucesso")
    } catch (error) {
      console.error("❌ Erro ao atualizar dados de tipos:", error)
      setSnackbarMessage("Erro ao atualizar dados de tipos de equipamentos")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
      console.log("🏁 Processo de atualização dos tipos finalizado")
    }
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  // Adicione este log antes do return do componente
  console.log("🎨 Renderizando dashboard com weeklyData:", weeklyData)
  console.log("🎨 weeklyLoading:", weeklyLoading)
  console.log("🎨 Tipo de weeklyData:", typeof weeklyData)
  console.log("🎨 weeklyData é array?", Array.isArray(weeklyData))
  console.log("🎨 Tamanho do weeklyData:", weeklyData?.length)

  return (
    <>
      <style>
        {`
          ${keyframes.fadeIn}
          ${keyframes.slideInUp}
          ${keyframes.pulse}
        `}
      </style>

      {/* Main Content */}
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#ffffff" }}>
        {/* Header */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: `${themeColors.background.paper} !important`,
            color: `${themeColors.text.primary} !important`,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05) !important",
            position: "relative",
            zIndex: 10,
            transition: "all 0.3s ease",
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  pl: { xs: 0, sm: 2 },
                }}
              >
                <Box
                  sx={{
                    width: "6px",
                    height: { xs: "40px", sm: "60px" },
                    borderRadius: "8px",
                    background: `linear-gradient(180deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`,
                    mr: 3,
                    boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.4)}`,
                    animation: `${keyframes.pulse} 3s ease-in-out infinite`,
                  }}
                />
                <Box sx={{ position: "relative" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.7rem", sm: "2.3rem" },
                      color: themeColors.text.primary,
                      letterSpacing: "-0.01em",
                      fontFamily: "'Poppins', sans-serif",
                      position: "relative",
                      display: "inline-block",
                      background: `linear-gradient(90deg, ${themeColors.primary.dark} 0%, ${themeColors.primary.main} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0px 2px 5px rgba(0,0,0,0.05)",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "-6px",
                        left: "0",
                        width: "60%",
                        height: "4px",
                        background: `linear-gradient(90deg, ${themeColors.primary.main}, ${alpha(themeColors.primary.light, 0)})`,
                        borderRadius: "2px",
                      },
                    }}
                  >
                    Dashboard de Equipamentos
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: themeColors.text.secondary,
                      fontSize: { xs: "0.95rem", sm: "1.05rem" },
                      mt: "1rem",
                      fontWeight: 500,
                      letterSpacing: "0.03em",
                      opacity: 0.9,
                      pl: 0.5,
                      fontStyle: "italic",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: "-10px",
                        top: "50%",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: themeColors.primary.main,
                        boxShadow: `0 0 8px ${themeColors.primary.main}`,
                      },
                    }}
                  >
                    Gerenciamento de maquinário e equipamentos
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  color: themeColors.text.secondary,
                  "&:hover": {
                    color: themeColors.primary.main,
                    transform: "rotate(180deg)",
                    transition: "transform 0.5s ease-in-out",
                  },
                }}
                onClick={handleRefreshData}
              >
                <Refresh />
              </IconButton>
            </Box>
          </Toolbar>
          <Divider
            sx={{
              height: "1px",
              background: `linear-gradient(to right, ${alpha(themeColors.primary.main, 0.4)}, ${alpha(themeColors.primary.light, 0.1)})`,
            }}
          />
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            padding: { xs: "1rem", sm: "1.5rem" },
            animation: "fadeIn 1s ease-out",
            backgroundColor: "#ffffff",
          }}
        >
          <Container maxWidth="xl" disableGutters>
            {/* Stats Cards */}
            <Box component="section">
              <Box
                sx={{
                  display: "grid",
                  gap: "1.5rem",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  mb: 4,
                }}
              >
                <CustomStatCard
                  title="Total de Equipamentos"
                  value={apiData.contagem_total}
                  icon={Construction}
                  color={themeColors.primary.main}
                  onClick={() => handleCardClick("total")}
                />
                <CustomStatCard
                  title="Equipamentos Ativos"
                  value={apiData.contagem_ativos}
                  icon={CheckCircle}
                  color={themeColors.success.main}
                  onClick={() => handleCardClick("active")}
                />
                <CustomStatCard
                  title="Equipamentos Inativos"
                  value={apiData.contagem_inativos}
                  icon={Cancel}
                  color={themeColors.error.main}
                  onClick={() => handleCardClick("inactive")}
                />
                <CustomStatCard
                  title="Em Manutenção"
                  value={apiData.contagem_manutencao}
                  icon={Today}
                  color={themeColors.warning.main}
                  onClick={() => handleCardClick("maintenance")}
                />
              </Box>
            </Box>

            {/* Equipment Table - Using real API data */}
            <EquipmentTable
              equipments={transformTableEquipmentData(tableData.equipamentos)}
              loading={tableLoading}
              themeColors={themeColors}
              onRefresh={handleTableRefresh}
            />

            {/* Equipment Type Summary - NEW COMPONENT */}
            <EquipmentTypeSummary
              equipmentData={apiData}
              loading={loading}
              onRefresh={handleEquipmentTypeSummaryRefresh}
              themeColors={themeColors}
            />

            {/* Weekly Distribution Chart - Now using real API data */}
            <WeeklyDistributionChart
              weeklyData={weeklyData}
              themeColors={themeColors}
              onRefresh={handleWeeklyRefresh}
              loading={weeklyLoading}
            />
          </Container>
        </Box>
      </Box>

      {/* Equipment List Modal - Using real API data */}
      <EquipmentListModal
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        title={listModalTitle}
        equipments={currentModalList}
        themeColors={themeColors}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
