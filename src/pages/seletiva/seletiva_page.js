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
  Tabs,
  Tab,
  Paper,
} from "@mui/material"
import {
  Refresh,
  Menu as MenuIcon,
  FilterAlt,
  BarChart,
  Recycling,
  LocalShipping,
  Scale,
  EmojiEvents,
  Home,
  CleaningServices,
  Dashboard,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import SeletivaTable from "@/components/Seletiva/table/table_seletiva"
import PADistribution from "@/components/Seletiva/charts/pa"
import RegionDistributionChart from "@/components/Seletiva/charts/turnos_grafico"
import GraficoSeletivaSemanal from "@/components/Seletiva/charts/grafico_semanal"
import ResourceComparisonStats from "@/components/seletiva_previstas"
import {
  contarSeletivaRealizadasHoje,
  contarTotalSeletiva,
  contarSeletivaInativos,
  contarSeletivaAtivos,
} from "../../service/seletiva"
import { useRouter } from "next/navigation"

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
    0% { box-shadow: 0 0 0 rgba(46, 125, 50, 0); }
    50% { box-shadow: 0 0 15px rgba(46, 125, 50, 0.3); }
    100% { box-shadow: 0 0 0 rgba(46, 125, 50, 0); }
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
    main: "#2e7d32", // Verde mais escuro para tema de reciclagem
    light: "#4caf50",
    dark: "#1b5e20",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ff6d00", // Laranja para contraste
    light: "#ff9e40",
    dark: "#c43e00",
    contrastText: "#ffffff",
  },
  success: {
    main: "#00c896",
    light: "#33d3aa",
    dark: "#00a078",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ffb300",
    light: "#ffc233",
    dark: "#cc8f00",
    contrastText: "#ffffff",
  },
  error: {
    main: "#d32f2f",
    light: "#ef5350",
    dark: "#c62828",
    contrastText: "#ffffff",
  },
  info: {
    main: "#0288d1",
    light: "#29b6f6",
    dark: "#01579b",
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
const CustomStatCard = ({ title, value, icon: Icon, color, highlight, subtitle }) => (
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
        background: color.main,
        zIndex: 1,
      },
      animation: highlight ? `${keyframes.flashHighlight} 1s ease-out` : `${keyframes.fadeIn} 0.6s ease-out`,
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
        background: alpha(color.main, 0.1),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon sx={{ fontSize: 24, color: color.main }} />
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
        {value === null ? "..." : value}
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
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: themeColors.text.secondary,
            fontWeight: 400,
            fontSize: "0.85rem",
            mt: 1,
            opacity: 0.8,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
)

export default function SeletivaDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("seletiva")

  // State variables
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [chartsLoaded, setChartsLoaded] = useState(false)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  // Mock data for selective collections
  const [seletivaData, setSeletivaData] = useState([])

  // Stats state
  const [statsData, setStatsData] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
    releasedToday: 0,
  })

  // Auto-refresh states
  const [autoRefreshTotal, setAutoRefreshTotal] = useState(true)
  const [autoRefreshActive, setAutoRefreshActive] = useState(true)
  const [autoRefreshInactive, setAutoRefreshInactive] = useState(true)
  const [autoRefreshReleased, setAutoRefreshReleased] = useState(true)
  const [highlightedStat, setHighlightedStat] = useState(null)

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
      color: themeColors.warning.main,
    },
    {
      value: "seletiva",
      label: "Seletiva",
      icon: <Recycling sx={{ fontSize: "1.3rem" }} />,
      color: themeColors.primary.main,
    },
    {
      value: "varricao",
      label: "Varrição",
      icon: <CleaningServices sx={{ fontSize: "1.3rem" }} />,
      color: themeColors.secondary.main,
    },
  ]

  const loadAllData = async () => {
    console.log("Iniciando carregamento de dados...")
    setLoading(true)
    setInitialLoading(true)

    try {
      // Load data in parallel
      const [totalSeletivaResponse, inativosResponse, ativosResponse, hojeResponse] = await Promise.all([
        contarTotalSeletiva(),
        contarSeletivaInativos(),
        contarSeletivaAtivos(),
        contarSeletivaRealizadasHoje(),
      ])

      console.log("Dados carregados:", {
        totalSeletiva: totalSeletivaResponse,
        seletivaInativos: inativosResponse,
        seletivaAtivos: ativosResponse,
        seletivaHoje: hojeResponse,
      })

      // Update statistics
      setStatsData({
        totalVehicles: totalSeletivaResponse?.total || 0,
        inactiveVehicles: inativosResponse?.count || 0,
        activeVehicles: ativosResponse?.count || 0,
        releasedToday: hojeResponse?.total || 0,
      })

      // Mock selective collection data
      const mockSeletivaData = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        route: `Rota ${Math.floor(Math.random() * 10) + 1}`,
        driver: `Motorista ${Math.floor(Math.random() * 15) + 1}`,
        driverId: `M${Math.floor(Math.random() * 1000) + 1000}`,
        collectors: Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          (_, i) => `Coletor ${Math.floor(Math.random() * 15) + 1}`,
        ),
        collectorsIds: Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          (_, i) => `C${Math.floor(Math.random() * 1000) + 1000}`,
        ),
        vehicle: `Caminhão ${Math.floor(Math.random() * 20) + 1}`,
        vehiclePrefix: `SEL-${Math.floor(Math.random() * 100) + 100}`,
        departureTime: `${Math.floor(Math.random() * 12) + 7}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        status: Math.random() > 0.3 ? "Finalizado" : "Em andamento",
        arrivalTime:
          Math.random() > 0.3
            ? `${Math.floor(Math.random() * 12) + 13}:${Math.floor(Math.random() * 60)
                .toString()
                .padStart(2, "0")}`
            : "",
        date: new Date().toISOString().split("T")[0],
        region: ["Norte", "Sul", "Leste", "Oeste", "Centro"][Math.floor(Math.random() * 5)],
        shift: ["Matutino", "Vespertino", "Noturno"][Math.floor(Math.random() * 3)],
        collectedWeight: `${(Math.random() * 5 + 1).toFixed(2)} ton`,
        materialType: ["Papel", "Plástico", "Vidro", "Metal", "Misto"][Math.floor(Math.random() * 5)],
      }))

      setSeletivaData(mockSeletivaData)

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

  // Funções para atualizar cards individuais
  const refreshTotalVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, totalVehicles: null })) // Definir como null para mostrar carregamento
      const result = await contarTotalSeletiva()
      setStatsData((prev) => ({
        ...prev,
        totalVehicles: result?.total || prev.totalVehicles,
      }))
      setHighlightedStat("totalVehicles")
    } catch (error) {
      console.error("Erro ao atualizar total de veículos:", error)
    }
  }

  const refreshActiveVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, activeVehicles: null })) // Definir como null para mostrar carregamento
      const result = await contarSeletivaAtivos()
      setStatsData((prev) => ({
        ...prev,
        activeVehicles: result?.count || prev.activeVehicles,
      }))
      setHighlightedStat("activeVehicles")
    } catch (error) {
      console.error("Erro ao atualizar veículos ativos:", error)
    }
  }

  const refreshInactiveVehicles = async () => {
    try {
      setStatsData((prev) => ({ ...prev, inactiveVehicles: null })) // Definir como null para mostrar carregamento
      const result = await contarSeletivaInativos()
      setStatsData((prev) => ({
        ...prev,
        inactiveVehicles: result?.count || prev.inactiveVehicles,
      }))
      setHighlightedStat("inactiveVehicles")
    } catch (error) {
      console.error("Erro ao atualizar veículos inativos:", error)
    }
  }

  const refreshReleasedToday = async () => {
    try {
      const result = await contarSeletivaRealizadasHoje()
      const novoTotal = result?.total

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

  // Load data on component mount
  useEffect(() => {
    loadAllData()
  }, [])

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
                      Dashboard Seletiva
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
                        },
                      }}
                    >
                      Gerenciamento de coleta seletiva e reciclagem
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
                background: `${alpha(themeColors.primary.main, 0.2)}`,
              }}
            />
          </AppBar>

          {/* Tabs Navigation - Redesigned for a more professional look */}
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
                      title="Veículos de seletiva total"
                      value={statsData.totalVehicles}
                      icon={LocalShipping}
                      color={themeColors.primary}
                      highlight={highlightedStat === "totalVehicles"}
                     
                    />
                  </Box>
                  <Box>
                    <CustomStatCard
                      title="Veículos seletiva ativos"
                      value={statsData.activeVehicles}
                      icon={Recycling}
                      color={themeColors.success}
                      highlight={highlightedStat === "activeVehicles"}
                      
                    />
                  </Box>
                  <Box>
                    <CustomStatCard
                      title="Veículos seletiva inativos"
                      value={statsData.inactiveVehicles}
                      icon={Scale}
                      color={themeColors.error}
                      highlight={highlightedStat === "inactiveVehicles"}
                    
                    />
                  </Box>
                  <Box>
                    <CustomStatCard
                      title="Seletivas soltas hoje"
                      value={statsData.releasedToday}
                      icon={EmojiEvents}
                      color={themeColors.warning}
                      highlight={highlightedStat === "releasedToday"}
                      
                    />
                  </Box>
                </Box>
              </Box>

              {/* Resource Comparison Stats - New component */}
              <ResourceComparisonStats themeColors={themeColors} keyframes={keyframes} onRefresh={handleRefreshData} />

              {/* Seletiva Table Section */}
              <SeletivaTable
                seletivaData={seletivaData}
                loading={loading}
                themeColors={themeColors}
                keyframes={keyframes}
                onRefresh={handleRefreshData}
              />

              {/* PA Distribution Section - Movido para depois da tabela */}
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
                          <LocalShipping
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
                            Distribuição por Pontos de Apoio
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "0.85rem" },
                              color: themeColors.text.secondary,
                              fontWeight: 400,
                            }}
                          >
                            Quantidade de veículos que saíram de cada PA
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
                    <PADistribution themeColors={themeColors} chartsLoaded={chartsLoaded} keyframes={keyframes} />
                  </CardContent>
                </Card>
              </Box>

              {/* Region Distribution Chart */}
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
                          <FilterAlt
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
                            Distribuição por turno
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "0.85rem" },
                              color: themeColors.text.secondary,
                              fontWeight: 400,
                            }}
                          >
                            Saida de veiculos por turno
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
                      <RegionDistributionChart chartsLoaded={chartsLoaded} themeColors={themeColors} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Coletas por Dia da Semana Chart */}
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
                            background: themeColors.primary.main,
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
                            Coletas por Dia da Semana
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "0.85rem" },
                              color: themeColors.text.secondary,
                              fontWeight: 400,
                            }}
                          >
                            Quantidade de coletas e eficiência por dia da semana
                          </Typography>
                        </Box>
                      </Box>
                    }
                    action={
                      <IconButton
                        sx={{
                          color: themeColors.text.secondary,
                          "&:hover": { color: themeColors.primary.main },
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
                  <CardContent
                    sx={{ padding: "1.5rem", height: "calc(100% - 90px)", display: "flex", flexDirection: "column" }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        position: "relative",
                        height: "100%", // Usa todo o espaço disponível
                        flex: 1,
                      }}
                    >
                      <GraficoSeletivaSemanal themeColors={themeColors} chartsLoaded={chartsLoaded} />
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
