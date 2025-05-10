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
} from "@mui/material"
import {
  DirectionsCar,
  CheckCircle,
  Cancel,
  Today,
  Refresh,
  Menu as MenuIcon,
  Timeline,
  PieChart as PieChartIcon,
  Warehouse,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import {
  getSolturasDetalhada,
  getTotalDeRemocaoSoltasNoDia,
  getContagemRemocaoAtivos,
  getContagemRemocaoInativos,
  getContagemTotalRemocao,
  getMediaMensalDeSolturas,
  getRemocoesPorDiaSemana,
} from "../service/dashboard"
import PADistributionChart from "../components/pa"
import RemovalTable from "../components/tabela_remocao"
import TeamChart from "../components/team_chart"
import WeekdayChart from "@/components/grafico_remocao"
import DriverCollectorExitChart from "../components/motorista_coletores"

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

// Custom stat card component - redesigned to be mais simples e branco
const CustomStatCard = ({ title, value, icon: Icon, color, highlight }) => (
  <Card
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      background: "white",
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
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

export default function RemovalDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State variables
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [chartsLoaded, setChartsLoaded] = useState(false)
  const [statsData, setStatsData] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
    releasedToday: 0,
  })

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [refreshStats, setRefreshStats] = useState(false)

  // Estados para armazenar dados da API
  const [removals, setRemovals] = useState([])
  const [weekdayData, setWeekdayData] = useState([])
  const [teamData, setTeamData] = useState([])

  // Add these state variables in the component
  const [autoRefreshTotal, setAutoRefreshTotal] = useState(true)
  const [autoRefreshActive, setAutoRefreshActive] = useState(true)
  const [autoRefreshInactive, setAutoRefreshInactive] = useState(true)
  const [autoRefreshReleased, setAutoRefreshReleased] = useState(true)
  const [highlightedStat, setHighlightedStat] = useState(null)

  const loadAllData = async () => {
    console.log("Iniciando carregamento de dados...")
    setLoading(true)
    setInitialLoading(true)

    try {
      // Load data in parallel
      const [
        solturasData,
        totalRemocaoResult,
        remocaoAtivosResult,
        remocaoInativosResult,
        remocoesDiaResult,
        equipesDiaResult,
        remocoesPorDiaSemanaResult,
        mediaMensalResult,
      ] = await Promise.all([
        getSolturasDetalhada(),
        getContagemTotalRemocao(),
        getContagemRemocaoAtivos(),
        getContagemRemocaoInativos(),
        getTotalDeRemocaoSoltasNoDia(),
        getRemocoesPorDiaSemana(),
        getMediaMensalDeSolturas(),
      ])

      console.log("Dados carregados:", {
        solturasData,
        totalRemocaoResult,
        remocaoAtivosResult,
        remocaoInativosResult,
        remocoesDiaResult,
        equipesDiaResult,
        remocoesPorDiaSemanaResult,
      })

      // Create a Map to store only the most recent version of each record
      // using a combination of prefix and driver as a unique key
      const uniqueRemovalsMap = new Map()

      // Format soltura data for the expected UI format
      if (Array.isArray(solturasData)) {
        solturasData.forEach((soltura, index) => {
          const formattedRemoval = {
            id: index + 1,
            // Ensure driver name is displayed correctly
            driver:
              typeof soltura.motorista === "object"
                ? soltura.motorista.nome || "Não informado"
                : soltura.motorista || "Não informado",

            driverId:
              typeof soltura.motorista === "object"
                ? soltura.motorista.matricula || ""
                : soltura.matricula_motorista || "",

            // Ensure collector names are extracted correctly
            collectors: Array.isArray(soltura.coletores)
              ? soltura.coletores
                  .map((c) => {
                    if (typeof c === "object") {
                      return c.nome || "Não informado"
                    }
                    return c || "Não informado"
                  })
                  .filter(Boolean)
              : [],

            collectorsIds: Array.isArray(soltura.coletores)
              ? soltura.coletores
                  .map((c) => {
                    if (typeof c === "object") {
                      return c.matricula || ""
                    }
                    return ""
                  })
                  .filter(Boolean)
              : [],

            garage: soltura.garagem || "PA1",
            route: soltura.rota || "",
            vehiclePrefix: soltura.prefixo || "",
            departureTime: soltura.hora_saida_frota || "",
            status: soltura.status_frota === "Em andamento" ? "Em andamento" : "Finalizado",
            arrivalTime: soltura.hora_chegada || "",
            date: soltura.data || new Date().toISOString().split("T")[0],
            team: soltura.tipo_equipe || "",
            location:
              typeof soltura.setores === "string"
                ? soltura.setores
                : Array.isArray(soltura.setores)
                  ? soltura.setores.join(", ")
                  : "Não informado",
            vehicle: soltura.veiculo || "Caminhão Reboque",
            distance: "0 km",
            notes: "",
            tipo_equipe: soltura.tipo_equipe,
            status_frota: soltura.status_frota,
            hora_saida_frota: soltura.hora_saida_frota,
          }

          // Create a unique key for each record
          const uniqueKey = `${formattedRemoval.vehiclePrefix}-${formattedRemoval.driver}`

          // If the record already exists, check which is more recent
          if (uniqueRemovalsMap.has(uniqueKey)) {
            const existingRemoval = uniqueRemovalsMap.get(uniqueKey)
            const existingDate = new Date(existingRemoval.date)
            const newDate = new Date(formattedRemoval.date)

            // Replace only if the new record is more recent
            if (newDate >= existingDate) {
              uniqueRemovalsMap.set(uniqueKey, formattedRemoval)
            }
          } else {
            // If it doesn't exist, add to the Map
            uniqueRemovalsMap.set(uniqueKey, formattedRemoval)
          }
        })
      }

      // Convert the Map to an array of unique records
      const formattedRemovals = Array.from(uniqueRemovalsMap.values())

      // Format team data for the chart
      const formattedTeamData = equipesDiaResult?.dadosEquipes
        ? equipesDiaResult.dadosEquipes.map((item, index) => ({
            name: item.tipoEquipe || `Equipe ${index + 1}`,
            label: `${item.quantidade || 0} solturas`,
            releases: item.quantidade || 0,
            color:
              index === 0
                ? themeColors.primary.main
                : index === 1
                  ? themeColors.success.main
                  : themeColors.warning.main,
          }))
        : []

      // Format weekday data for the chart
      const formattedWeekdayData = remocoesPorDiaSemanaResult?.remocoes || []

      // Update states with received data
      setRemovals(formattedRemovals)
      setWeekdayData(formattedWeekdayData)
      setTeamData(formattedTeamData)

      // Update statistics
      setStatsData({
        totalVehicles: totalRemocaoResult?.totalRemocao || 0,
        activeVehicles: remocaoAtivosResult?.countRemocaoAtivos || 0,
        inactiveVehicles: remocaoInativosResult?.countRemocaoInativos || 0,
        releasedToday: remocoesDiaResult?.totalDeRemocoes || 0,
      })

      // Mark loading as complete
      setChartsLoaded(true)
      setLoading(false)
      setInitialLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      // Show error message
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

  // Funções para atualizar cards individuais
  const refreshTotalVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, totalVehicles: null })) // Opcional: definir como null para mostrar carregamento
      const result = await getContagemTotalRemocao()
      setStatsData((prev) => ({
        ...prev,
        totalVehicles: result?.totalRemocao || prev.totalVehicles,
      }))
      setHighlightedStat("totalVehicles")
    } catch (error) {
      console.error("Erro ao atualizar total de veículos:", error)
    }
  }

  const refreshActiveVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, activeVehicles: null })) // Opcional: definir como null para mostrar carregamento
      const result = await getContagemRemocaoAtivos()
      setStatsData((prev) => ({
        ...prev,
        activeVehicles: result?.countRemocaoAtivos || prev.activeVehicles,
      }))
      setHighlightedStat("activeVehicles")
    } catch (error) {
      console.error("Erro ao atualizar veículos ativos:", error)
    }
  }

  const refreshInactiveVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, inactiveVehicles: null })) // Opcional: definir como null para mostrar carregamento
      const result = await getContagemRemocaoInativos()
      setStatsData((prev) => ({
        ...prev,
        inactiveVehicles: result?.countRemocaoInativos || prev.inactiveVehicles,
      }))
      setHighlightedStat("inactiveVehicles")
    } catch (error) {
      console.error("Erro ao atualizar veículos inativos:", error)
    }
  }

  const refreshReleasedToday = async () => {
    try {
      const result = await getTotalDeRemocaoSoltasNoDia()
      const novoTotal = result?.totalDeRemocoes

      setStatsData((prev) => {
        if (prev.releasedToday === novoTotal || novoTotal == null) {
          return prev // NÃO atualiza se o valor for igual ou se vier nulo
        }

        return {
          ...prev,
          releasedToday: novoTotal,
        }
      })

      setHighlightedStat("releasedToday")
    } catch (error) {
      console.error("Erro ao atualizar veículos soltos hoje:", error)
    }
  }

  // Auto-refresh effects
  useEffect(() => {
    refreshReleasedToday()

    if (autoRefreshReleased) {
      const interval = setInterval(() => {
        refreshReleasedToday()
      }, 240000) // Atualiza a cada 4 minutos
      return () => clearInterval(interval)
    }
  }, [autoRefreshReleased])

  useEffect(() => {
    if (autoRefreshTotal) {
      const interval = setInterval(() => {
        refreshTotalVehicles()
      }, 240000) // Refresh every 4 minutes
      return () => clearInterval(interval)
    }
  }, [autoRefreshTotal])

  useEffect(() => {
    if (autoRefreshActive) {
      const interval = setInterval(() => {
        refreshActiveVehicles()
      }, 240000) // Refresh every 4 minutes
      return () => clearInterval(interval)
    }
  }, [autoRefreshActive])

  useEffect(() => {
    if (autoRefreshInactive) {
      const interval = setInterval(() => {
        refreshInactiveVehicles()
      }, 240000) // Refresh every 4 minutes
      return () => clearInterval(interval)
    }
  }, [autoRefreshInactive])

  // Add a timeout to clear the highlight after 3 seconds
  useEffect(() => {
    if (highlightedStat) {
      setTimeout(() => {
        setHighlightedStat(null)
      }, 1000) // Reduzido para 1 segundo
    }
  }, [highlightedStat])

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

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
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      boxShadow: `0 6px 16px ${alpha(themeColors.primary.main, 0.4)}`,
                      animation: `${keyframes.pulse} 2s ease-in-out infinite, ${keyframes.glow} 3s infinite ease-in-out`,
                    }}
                  >
                    <DirectionsCar sx={{ color: "white", fontSize: "2rem" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1.35rem", sm: "1.8rem" },
                      color: themeColors.text.primary,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Controle de Remoção
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: themeColors.text.secondary,
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    ml: { xs: "0", sm: "4.5rem" },
                    mt: "-0.3rem",
                    fontWeight: 500,
                  }}
                >
                  Gerenciamento de veículos e equipes
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  sx={{
                    color: themeColors.text.secondary,
                    "&:hover": { color: themeColors.primary.main },
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
                background: `${alpha(themeColors.primary.main, 0.2)}`,
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
            }}
          >
            <Container maxWidth="xl" disableGutters>
              {/* Stats Cards */}
              <Box component="section">
                <Box
                  sx={{
                    display: "grid",
                    gap: "1rem",
                    gridTemplateColumns: {
                      xs: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    mb: 3,
                  }}
                >
                  <Box>
                    <CustomStatCard
                      title="Veículos de remoção total"
                      value={statsData.totalVehicles === null ? "..." : statsData.totalVehicles}
                      icon={DirectionsCar}
                      color={themeColors.primary.main}
                      highlight={highlightedStat === "totalVehicles"}
                    />
                  </Box>
                  <Box>
                    <CustomStatCard
                      title="Veículos remoção ativos"
                      value={statsData.activeVehicles === null ? "..." : statsData.activeVehicles}
                      icon={CheckCircle}
                      color={themeColors.success.main}
                      highlight={highlightedStat === "activeVehicles"}
                    />
                  </Box>
                  <Box>
                    <CustomStatCard
                      title="Veículos remoção inativo"
                      value={statsData.inactiveVehicles === null ? "..." : statsData.inactiveVehicles}
                      icon={Cancel}
                      color={themeColors.error.main}
                      highlight={highlightedStat === "inactiveVehicles"}
                    />
                  </Box>
                  <Box>
                    <CustomStatCard
                      title="Veículos remoção soltos hoje"
                      value={statsData.releasedToday === null ? "..." : statsData.releasedToday}
                      icon={Today}
                      color={themeColors.warning.main}
                      highlight={highlightedStat === "releasedToday"}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Unified Table Section */}
              <RemovalTable
                removals={removals}
                loading={loading}
                themeColors={themeColors}
                keyframes={keyframes}
                onRefresh={handleRefreshData}
              />

              {/* Team Performance and Status Charts */}
              <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 4 }}>
                {/* Team Performance Chart - Now half width */}
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
                    width: { xs: "100%", md: "50%" },
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
                            Equipes
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "0.85rem" },
                              color: themeColors.text.secondary,
                              fontWeight: 400,
                            }}
                          >
                            Análise comparativa por turno
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
                      "& .MuiCardHeader-title": {
                        fontWeight: 600,
                        fontSize: "1.125rem",
                        color: themeColors.text.primary,
                      },
                      "& .MuiCardHeader-action": {
                        margin: 0,
                      },
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
                      <TeamChart teamData={teamData} themeColors={themeColors} chartsLoaded={chartsLoaded} />
                    </Box>
                  </CardContent>
                </Card>

                {/* Driver/Collector Exit Chart - replacing Status Pie Chart */}
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
                    width: { xs: "100%", md: "50%" },
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
                            background: themeColors.success.main,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                          }}
                        >
                          <PieChartIcon
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
                            Saídas de Funcionários
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "0.85rem" },
                              color: themeColors.text.secondary,
                              fontWeight: 400,
                            }}
                          >
                            Motoristas e coletores que saíram
                          </Typography>
                        </Box>
                      </Box>
                    }
                    action={
                      <IconButton
                        sx={{
                          color: themeColors.text.secondary,
                          "&:hover": { color: themeColors.success.main },
                        }}
                        onClick={handleRefreshData}
                      >
                        <Refresh />
                      </IconButton>
                    }
                    sx={{
                      paddingBottom: "0.75rem",
                      borderBottom: `1px solid ${themeColors.divider}`,
                      "& .MuiCardHeader-title": {
                        fontWeight: 600,
                        fontSize: "1.125rem",
                        color: themeColors.text.primary,
                      },
                      "& .MuiCardHeader-action": {
                        margin: 0,
                      },
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
                      <DriverCollectorExitChart themeColors={themeColors} chartsLoaded={chartsLoaded} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* PA Distribution Chart - replacing Vehicle Distribution */}
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
                          <Warehouse
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
                            Distribuição por PA
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "0.85rem" },
                              color: themeColors.text.secondary,
                              fontWeight: 400,
                            }}
                          >
                            Veículos por ponto de apoio
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
                      "& .MuiCardHeader-title": {
                        fontWeight: 600,
                        fontSize: "1.125rem",
                        color: themeColors.text.primary,
                      },
                      "& .MuiCardHeader-action": {
                        margin: 0,
                      },
                    }}
                  />
                  <CardContent sx={{ padding: "1.5rem" }}>
                    <Box
                      sx={{
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <PADistributionChart chartsLoaded={chartsLoaded} themeColors={themeColors} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Weekday Distribution Chart */}
              <Box component="section" sx={{ mb: 3 }}>
                <WeekdayChart
                  weekdayData={weekdayData}
                  themeColors={themeColors}
                  chartsLoaded={chartsLoaded}
                  onRefresh={handleRefreshData}
                />
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

