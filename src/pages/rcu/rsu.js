"use client"

import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Container,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  Paper,
  Tabs,
  Tab,
} from "@mui/material"
import {
  Refresh,
  Menu as MenuIcon,
  Timeline,
  Warehouse,
  BarChart,
  Home,
  Recycling,
  CleaningServices,
  Dashboard,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import RSUTable from "../../components/rsu_tabela"
import ShiftDistributionChart from "../../components/rsu_shift"
import WeeklyTowerChart from "../../components/grafico_rsu_semana"
import StatsCards from "../../components/rsu_cards"
import RSUResourceComparisonStats from "../../components/rsu_resource"
import { useRouter } from "next/navigation"
import { getResumoRsuHoje, fetchDadosRsuTabelaGrafico } from "../../service/rsu_new"


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
  float: `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
      100% { transform: translateY(0px); }
    }
  `,
  gradientShift: `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `,
  rotate: `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0); }
    }
  `,
  glow: `
    @keyframes glow {
      0% { box-shadow: 0 0 5px rgba(26, 35, 126, 0.2); }
      50% { box-shadow: 0 0 15px rgba(26, 35, 126, 0.4); }
      100% { box-shadow: 0 0 5px rgba(26, 35, 126, 0.2); }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from {
        transform: translateX(15px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        transform: translateX(-15px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1
      }
    }
  `,
  zoomIn: `
    @keyframes zoomIn {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  heartbeat: `
    @keyframes heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.05); }
      28% { transform: scale(1); }
      42% { transform: scale(1.05); }
      70% { transform: scale(1); }
    }
  `,
  flashHighlight: `
  @keyframes flashHighlight {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 0 50px rgba(255, 193, 7, 0.6);
    }
  }
`,
  tabGlow: `
  @keyframes tabGlow {
    0% { box-shadow: 0 0 0 rgba(58, 134, 255, 0); }
    50% { box-shadow: 0 0 15px rgba(58, 134, 255, 0.3); }
    100% { box-shadow: 0 0 0 rgba(58, 134, 255, 0); }
  }
`,
  subtleRise: `
  @keyframes subtleRise {
    from { transform: translateY(2px); opacity: 0.8; }
    to { transform: translateY(0); opacity: 1; }
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
    default: "#f8fafc",
    paper: "#ffffff",
    card: "#ffffff",
    dark: "#0f172a",
  },
  divider: "rgba(226, 232, 240, 0.8)",
}

export default function RSUDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("domiciliar")

  // State variables
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [chartsLoaded, setChartsLoaded] = useState(false)

  // API data states
  const [apiData, setApiData] = useState(null)
  const [paData, setPaData] = useState([])
  const [shiftData, setShiftData] = useState([])
  const [weeklyData, setWeeklyData] = useState([])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  // Mock data for RSU collections (mantido para a tabela)
  const [rsuData, setRsuData] = useState([])

  // Novos estados para dados específicos da tabela e gráfico semanal
  const [tabelaGraficoData, setTabelaGraficoData] = useState(null)
  const [weeklyChartData, setWeeklyChartData] = useState([])
  const [tableData, setTableData] = useState([])

  // Função para transformar dados da API para os gráficos
  const transformApiDataToCharts = (data) => {
    if (!data) return

    // Transformar dados para o gráfico de PA (pizza) - MELHORADO
    const paChartData = []
    if (data.porGaragem) {
      Object.keys(data.porGaragem).forEach((pa) => {
        const paInfo = data.porGaragem[pa]
        const vehicleCount = paInfo.veiculos || 0 // Focar nos veículos como solicitado

        if (vehicleCount > 0 || true) {
          // Sempre incluir, mesmo com 0 veículos
          paChartData.push({
            name: pa,
            value: vehicleCount, // Usar contagem de veículos
            fullName: `Ponto de Apoio ${pa.slice(-1)}`,
            color: getColorForPA(pa),
            vehicles: vehicleCount,
            motoristas: paInfo.motoristas || 0,
            coletores: paInfo.coletores || 0,
            turnos: paInfo.turnos || [],
          })
        }
      })
    }

    // Se não houver dados, criar estrutura padrão
    if (paChartData.length === 0) {
      ;["PA1", "PA2", "PA3", "PA4"].forEach((pa) => {
        paChartData.push({
          name: pa,
          value: 0,
          fullName: `Ponto de Apoio ${pa.slice(-1)}`,
          color: getColorForPA(pa),
          vehicles: 0,
          motoristas: 0,
          coletores: 0,
          turnos: [],
        })
      })
    }

    console.log("Dados transformados para PA Chart:", paChartData)
    setPaData(paChartData)

    // Transformar dados para o gráfico de turnos
    const shiftChartData = []
    if (data.porEquipe) {
      if (data.porEquipe.diurno) {
        shiftChartData.push({
          name: "Diurno",
          motoristas: data.porEquipe.diurno.motoristas || 0,
          coletores: data.porEquipe.diurno.coletores || 0,
          total: (data.porEquipe.diurno.motoristas || 0) + (data.porEquipe.diurno.coletores || 0),
        })
      }
      if (data.porEquipe.noturno) {
        shiftChartData.push({
          name: "Noturno",
          motoristas: data.porEquipe.noturno.motoristas || 0,
          coletores: data.porEquipe.noturno.coletores || 0,
          total: (data.porEquipe.noturno.motoristas || 0) + (data.porEquipe.noturno.coletores || 0),
        })
      }
    }
    setShiftData(shiftChartData)

    // Dados semanais (mock por enquanto, pois a API atual é só de hoje)
    const mockWeeklyData = [
      { day: "Seg", fullDay: "Segunda-feira", value: 42, color: "#4361EE" },
      { day: "Ter", fullDay: "Terça-feira", value: 38, color: "#4CC9F0" },
      { day: "Qua", fullDay: "Quarta-feira", value: 45, color: "#F72585" },
      { day: "Qui", fullDay: "Quinta-feira", value: 40, color: "#7209B7" },
      { day: "Sex", fullDay: "Sexta-feira", value: data.totalRSUHoje || 50, color: "#F9C74F" }, // Usar dado real para hoje
      { day: "Sáb", fullDay: "Sábado", value: 25, color: "#90BE6D" },
      { day: "Dom", fullDay: "Domingo", value: 15, color: "#F94144" },
    ]
    setWeeklyData(mockWeeklyData)
  }

  // Função para obter cor baseada no PA
  const getColorForPA = (pa) => {
    const colors = {
      PA1: "#9c27b0", // Purple
      PA2: "#2196f3", // Blue
      PA3: "#ff9800", // Orange
      PA4: "#4caf50", // Green
    }
    return colors[pa] || "#757575"
  }

  // Função para obter cor baseada no dia da semana
  const getColorForDay = (diaSemana) => {
    const colors = {
      "Segunda-feira": "#4361EE",
      "Terça-feira": "#4CC9F0",
      "Quarta-feira": "#F72585",
      "Quinta-feira": "#7209B7",
      "Sexta-feira": "#F9C74F",
      Sábado: "#90BE6D",
      Domingo: "#F94144",
    }
    return colors[diaSemana] || "#757575"
  }

  const loadAllData = async () => {
    console.log("Iniciando carregamento de dados da nova API...")
    setLoading(true)
    setInitialLoading(true)

    try {
      // Buscar dados do resumo (mantém como está para os outros componentes)
      const { data, error } = await getResumoRsuHoje()

      if (error) {
        console.error("Erro da API:", error)
        setSnackbarMessage(`Erro ao carregar dados: ${error}`)
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } else if (data) {
        console.log("Dados recebidos da API:", data)
        setApiData(data)
        transformApiDataToCharts(data)
      }

      // NOVO: Buscar dados específicos para tabela e gráfico semanal
      try {
        const tabelaGraficoResult = await fetchDadosRsuTabelaGrafico()
        console.log("Dados tabela/gráfico recebidos:", tabelaGraficoResult)

        setTabelaGraficoData(tabelaGraficoResult)

        // Transformar dados para o gráfico semanal - CORRIGIDO para usar resumoPorDiaDaSemana
        if (tabelaGraficoResult.resumoPorDiaDaSemana) {
          console.log("Transformando dados semanais:", tabelaGraficoResult.resumoPorDiaDaSemana)

          // Converter objeto para array no formato esperado pelo gráfico
          const weeklyData = Object.entries(tabelaGraficoResult.resumoPorDiaDaSemana).map(
            ([diaSemana, quantidade]) => ({
              diaSemana: diaSemana,
              quantidade: quantidade || 0,
            }),
          )

          console.log("Dados semanais transformados:", weeklyData)
          setWeeklyChartData(weeklyData)
        } else {
          console.warn("resumoPorDiaDaSemana não encontrado no objeto:", tabelaGraficoResult)
          setWeeklyChartData([])
        }

        // Transformar dados para a tabela
        if (tabelaGraficoResult.detalhesSolturas && Array.isArray(tabelaGraficoResult.detalhesSolturas)) {
          setTableData(tabelaGraficoResult.detalhesSolturas)
        } else {
          console.warn("detalhesSolturas não é um array válido:", tabelaGraficoResult.detalhesSolturas)
          setTableData([])
        }
      } catch (tabelaError) {
        console.error("Erro ao buscar dados da tabela/gráfico:", tabelaError)
        setSnackbarMessage("Erro ao carregar dados da tabela. Usando dados padrão.")
        setSnackbarSeverity("warning")
        setSnackbarOpen(true)
        // Definir dados vazios em caso de erro
        setWeeklyChartData([])
        setTableData([])
      }

      setSnackbarMessage("Dados carregados com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)

      // Mark loading as complete
      setChartsLoaded(true)
      setLoading(false)
      setInitialLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setSnackbarMessage("Erro ao carregar dados. Tente novamente.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)

      // Even with error, mark loading as complete
      setLoading(false)
      setInitialLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadAllData()
  }, [])

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  // Handle refresh data
  const handleRefreshData = () => {
    loadAllData()
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)

    // Navigate to the corresponding page
    if (newValue === "domiciliar") {
      router.push("../../rcu/rsu")
    } else if (newValue === "seletiva") {
      router.push("../../seletiva/seletiva_page")
    } else if (newValue === "varricao") {
      router.push("../../varricao/varricao_page")
    } else if (newValue === "index") {
      router.push("/")
    }
  }

  // Tab data with icons and labels
  const tabsData = [
    {
      value: "index",
      label: "Início",
      icon: <Dashboard sx={{ fontSize: "1.3rem" }} />,
      color: themeColors.info.main,
    },
    {
      value: "domiciliar",
      label: "Domiciliar",
      icon: <Home sx={{ fontSize: "1.3rem" }} />,
      color: themeColors.primary.main,
    },
    {
      value: "seletiva",
      label: "Seletiva",
      icon: <Recycling sx={{ fontSize: "1.3rem" }} />,
      color: themeColors.success.main,
    },
    {
      value: "varricao",
      label: "Varrição",
      icon: <CleaningServices sx={{ fontSize: "1.3rem" }} />,
      color: themeColors.warning.main,
    },
  ]

  return (
    <>
      <style>
        {`
          ${keyframes.fadeIn}
          ${keyframes.slideInUp}
          ${keyframes.pulse}
          ${keyframes.float}
          ${keyframes.gradientShift}
          ${keyframes.shimmer}
          ${keyframes.rotate}
          ${keyframes.bounce}
          ${keyframes.glow}
          ${keyframes.slideInRight}
          ${keyframes.slideInLeft}
          ${keyframes.zoomIn}
          ${keyframes.heartbeat}
          ${keyframes.flashHighlight}
          ${keyframes.tabGlow}
          ${keyframes.subtleRise}
        `}
      </style>
      {/* Main Content */}
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar onCollapse={handleSidebarCollapse} />

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#ffffff",
            marginLeft: {
              xs: 0,
              sm: sidebarCollapsed ? "80px" : "280px",
            },
            width: {
              xs: "100%",
              sm: sidebarCollapsed ? "calc(100% - 80px)" : "calc(100% - 280px)",
            },
            transition: "all 0.3s ease",
          }}
        >
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
                      background: `linear-gradient(180deg, ${themeColors.primary.main} 0%, ${themeColors.info.main} 100%)`,
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
                      Dashboard Domiciliar
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
                      Gerenciamento de coletas e equipes -{" "}
                      {apiData?.totalRSUHoje ? `${apiData.totalRSUHoje} saídas hoje` : "Carregando..."}
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

          {/* Tabs Navigation */}
          <Paper
            elevation={2}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 9,
              background: "#ffffff",
              borderRadius: 0,
              borderBottom: `1px solid ${alpha(themeColors.primary.main, 0.1)}`,
              padding: "0.5rem 1.5rem",
              backdropFilter: "blur(10px)",
              boxShadow: `0 4px 20px ${alpha(themeColors.primary.main, 0.08)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="navigation tabs"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                TabIndicatorProps={{
                  style: {
                    display: "none",
                  },
                }}
                sx={{
                  minHeight: "64px",
                  width: "100%",
                  "& .MuiTabs-flexContainer": {
                    justifyContent: "space-between",
                    width: "100%",
                  },
                  "& .MuiTabs-scroller": {
                    width: "100%",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    minHeight: "54px",
                    borderRadius: "8px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    padding: "6px 16px",
                    letterSpacing: "0.02em",
                    color: themeColors.text.secondary,
                    opacity: 0.85,
                    flex: 1,
                    maxWidth: "none",
                    "&:hover": {
                      backgroundColor: alpha(themeColors.background.default, 0.8),
                      color: themeColors.text.primary,
                      opacity: 1,
                    },
                  },
                }}
              >
                {tabsData.map((tab) => (
                  <Tab
                    key={tab.value}
                    icon={tab.icon}
                    label={tab.label}
                    value={tab.value}
                    iconPosition="start"
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      marginX: 0.5,
                      "&.Mui-selected": {
                        color: tab.color,
                        fontWeight: 600,
                        backgroundColor: alpha(tab.color, 0.08),
                        boxShadow: activeTab === tab.value ? `0 3px 10px ${alpha(tab.color, 0.2)}` : "none",
                        animation: activeTab === tab.value ? `${keyframes.subtleRise} 0.3s ease-out` : "none",
                        "& .MuiSvgIcon-root": {
                          color: tab.color,
                          transform: "scale(1.1)",
                        },
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "3px",
                        background: tab.color,
                        transform: activeTab === tab.value ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.3s ease",
                        borderTopLeftRadius: "2px",
                        borderTopRightRadius: "2px",
                      },
                      "& .MuiSvgIcon-root": {
                        transition: "all 0.3s ease",
                        marginRight: "8px",
                        fontSize: "1.3rem",
                      },
                      "& .MuiTouchRipple-root": {
                        color: alpha(tab.color, 0.3),
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </Paper>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flex: 1,
              padding: { xs: "1rem", sm: "1.5rem" },
              animation: "fadeIn 1s ease-out",
            }}
          >
            <Container maxWidth="xl" disableGutters>
              {/* Stats Cards */}
              <StatsCards themeColors={themeColors} keyframes={keyframes} apiData={apiData} />

              {/* Real Time Stats - NOVO */}
           
              {/* Resource Comparison Stats */}
              <RSUResourceComparisonStats
                themeColors={themeColors}
                keyframes={keyframes}
                onRefresh={handleRefreshData}
                apiData={apiData}
              />

              {/* RSU Table Section - ATUALIZADO para usar novos dados */}
              <RSUTable
                rsuData={tableData}
                loading={loading}
                themeColors={themeColors}
                keyframes={keyframes}
                onRefresh={handleRefreshData}
                tabelaGraficoData={tabelaGraficoData}
              />

              {/* Shift Distribution Chart */}
              <Box sx={{ mb: 4 }}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                      transform: "translateY(-4px)",
                    },
                    background: themeColors.background.card,
                  }}
                >
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Box
                          sx={{
                            width: { xs: "32px", sm: "36px" },
                            height: { xs: "32px", sm: "36px" },
                            borderRadius: "12px",
                            background: themeColors.warning.main,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                          }}
                        >
                          <Timeline
                            sx={{
                              color: "white",
                              fontSize: { xs: "1.1rem", sm: "1.3rem" },
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "1.1rem", sm: "1.2rem" },
                              color: themeColors.text.primary,
                            }}
                          >
                            Distribuição por Turno
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "0.85rem" },
                              color: themeColors.text.secondary,
                              fontWeight: 400,
                            }}
                          >
                            Colaboradores nos turnos diurno e noturno
                          </Typography>
                        </Box>
                      </Box>
                    }
                    action={
                      <IconButton
                        sx={{
                          color: themeColors.text.secondary,
                          "&:hover": { color: themeColors.warning.main },
                        }}
                        onClick={handleRefreshData}
                      >
                        <Refresh />
                      </IconButton>
                    }
                    sx={{
                      paddingBottom: "0.75rem",
                      borderBottom: `1px solid ${themeColors.divider}`,
                    }}
                  />
                  <CardContent sx={{ padding: "1.5rem" }}>
                    <Box
                      sx={{
                        width: "100%",
                        position: "relative",
                        height: "300px",
                      }}
                    >
                      <ShiftDistributionChart themeColors={themeColors} chartsLoaded={chartsLoaded} data={shiftData} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* PA Distribution Chart - Novo gráfico de pizza */}
             

              {/* Weekly Distribution Chart - ATUALIZADO para usar novos dados */}
              <Box component="section" sx={{ mb: 4 }}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                      transform: "translateY(-4px)",
                    },
                    background: themeColors.background.card,
                  }}
                >
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Box
                          sx={{
                            width: { xs: "32px", sm: "36px" },
                            height: { xs: "32px", sm: "36px" },
                            borderRadius: "12px",
                            background: themeColors.info.main,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                          }}
                        >
                          <BarChart
                            sx={{
                              color: "white",
                              fontSize: { xs: "1.1rem", sm: "1.3rem" },
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "1.1rem", sm: "1.2rem" },
                              color: themeColors.text.primary,
                            }}
                          >
                            Distribuição Semanal
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "0.85rem" },
                              color: themeColors.text.secondary,
                              fontWeight: 400,
                            }}
                          >
                           
                          </Typography>
                        </Box>
                      </Box>
                    }
                    action={
                      <IconButton
                        sx={{
                          color: themeColors.text.secondary,
                          "&:hover": { color: themeColors.info.main },
                        }}
                        onClick={handleRefreshData}
                      >
                        <Refresh />
                      </IconButton>
                    }
                    sx={{
                      paddingBottom: "0.75rem",
                      borderBottom: `1px solid ${themeColors.divider}`,
                    }}
                  />
                  <CardContent sx={{ padding: "1.5rem" }}>
                    <Box
                      sx={{
                        width: "100%",
                        position: "relative",
                        height: "450px",
                      }}
                    >
                      <WeeklyTowerChart
                        data={weeklyChartData}
                        themeColors={themeColors}
                        height={400}
                        loading={loading}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>

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
