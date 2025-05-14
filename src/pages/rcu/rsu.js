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
  Fade,
  Zoom,
} from "@mui/material"
import {
  LocalShipping,
  People,
  Engineering,
  Today,
  Refresh,
  Menu as MenuIcon,
  Timeline,
  PieChart as PieChartIcon,
  Warehouse,
  RecyclingRounded,
  Home,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import StatCard from "../../components/rsu_stats"
import SummaryCard from "../../components/summary_rsu"
import EquipmentCard from "../../components/rsu_equipaments"
import WorkforceCard from "../../components/work"
import EquipmentChart from "../../components/equipament_chart"
import WorkforceChart from "../../components/work_chart"
import PADistributionChart from "../../components/pa_chart"
import CollectionTypeChart from "../../components/coleta_chart"

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
    main: "#4CAF50",
    light: "#81C784",
    dark: "#388E3C",
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

// Dados de exemplo para Coleta Domiciliar
const domiciliarEquipamentos = [
  { pa: "1", previsto: 15, realizado: 15, manutencao: 0, reservas: 0 },
  { pa: "2", previsto: 14, realizado: 15, manutencao: 0, reservas: 1 },
  { pa: "3", previsto: 15, realizado: 15, manutencao: 0, reservas: 0 },
  { pa: "4", previsto: 15, realizado: 14, manutencao: 1, reservas: 2 },
]

const domiciliarMaoDeObra = [
  { pa: "1", previstoMotorista: 15, realizadoMotorista: 15, previstoColetores: 45, realizadoColetores: 44, faltas: 1 },
  { pa: "2", previstoMotorista: 14, realizadoMotorista: 15, previstoColetores: 42, realizadoColetores: 34, faltas: 8 },
  { pa: "3", previstoMotorista: 15, realizadoMotorista: 15, previstoColetores: 45, realizadoColetores: 44, faltas: 1 },
  { pa: "4", previstoMotorista: 15, realizadoMotorista: 14, previstoColetores: 45, realizadoColetores: 31, faltas: 14 },
]

const domiciliarResumo = [
  { label: "Mot. Previsto", value: 59 },
  { label: "Mot. Realizado", value: 59 },
  { label: "Col. Previsto", value: 178 },
  { label: "Col. Realizado", value: 142 },
  { label: "Faltas", value: 36 },
  { label: "Faltas Totais", value: 36 },
]

// Dados de exemplo para Coleta Seletiva
const seletivaEquipamentos = [
  { pa: "1", previsto: 5, realizado: 6, manutencao: 0, reservas: 0 },
  { pa: "2", previsto: 5, realizado: 5, manutencao: 0, reservas: 0 },
  { pa: "3", previsto: 4, realizado: 4, manutencao: 0, reservas: 0 },
  { pa: "4", previsto: 5, realizado: 5, manutencao: 0, reservas: 0 },
]

const seletivaMaoDeObra = [
  { pa: "1", previstoMotorista: 4, realizadoMotorista: 6, previstoColetores: 8, realizadoColetores: 8, faltas: 0 },
  { pa: "2", previstoMotorista: 5, realizadoMotorista: 5, previstoColetores: 10, realizadoColetores: 10, faltas: 0 },
  { pa: "3", previstoMotorista: 4, realizadoMotorista: 4, previstoColetores: 8, realizadoColetores: 4, faltas: 4 },
  { pa: "4", previstoMotorista: 5, realizadoMotorista: 5, previstoColetores: 10, realizadoColetores: 10, faltas: 0 },
]

const seletivaResumo = [
  { label: "Mot. Previsto", value: 18 },
  { label: "Mot. Realizado", value: 20 },
  { label: "Col. Previsto", value: 36 },
  { label: "Col. Realizado", value: 32 },
  { label: "Faltas", value: 4 },
  { label: "Faltas Totais", value: 4 },
]

// Dados para gráficos
const equipamentosChartData = [
  { name: "PA1", previsto: 20, realizado: 21, manutencao: 0, reservas: 0 },
  { name: "PA2", previsto: 19, realizado: 20, manutencao: 0, reservas: 1 },
  { name: "PA3", previsto: 19, realizado: 19, manutencao: 0, reservas: 0 },
  { name: "PA4", previsto: 20, realizado: 19, manutencao: 1, reservas: 2 },
]

const maoDeObraChartData = [
  { name: "PA1", motoristas: 21, coletores: 52 },
  { name: "PA2", motoristas: 20, coletores: 44 },
  { name: "PA3", motoristas: 19, coletores: 48 },
  { name: "PA4", motoristas: 19, coletores: 41 },
]

const paDistributionData = [
  { name: "PA1", value: 21, color: themeColors.primary.main },
  { name: "PA2", value: 20, color: themeColors.success.main },
  { name: "PA3", value: 19, color: themeColors.warning.main },
  { name: "PA4", value: 19, color: themeColors.error.main },
]

const collectionTypeData = [
  { name: "Domiciliar", value: 70, color: themeColors.primary.main },
  { name: "Seletiva", value: 20, color: themeColors.success.main },
]

export default function RCUControlDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State variables
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [tabValue, setTabValue] = useState(0)
  const [highlightedStat, setHighlightedStat] = useState(null)
  const [chartsLoaded, setChartsLoaded] = useState(false)

  // Estatísticas gerais
  const [statsData, setStatsData] = useState({
    totalEquipamentos: 78,
    totalMotoristas: 77,
    totalColetores: 174,
    totalFaltas: 40,
  })

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setChartsLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Handle refresh data
  const handleRefreshData = () => {
    setLoading(true)
    setSnackbarMessage("Dados atualizados com sucesso!")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)

    // Simular atualização de dados
    setTimeout(() => {
      setLoading(false)
    }, 1000)
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
                    <LocalShipping sx={{ color: "white", fontSize: "2rem" }} />
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
                    Controle de RCU
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
                  12/05/2025
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

          {/* Tabs */}
          <Box sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)" }}>
            <Container maxWidth="xl">
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    minHeight: 56,
                  },
                  "& .Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.primary.main,
                    height: 3,
                  },
                }}
              >
                <Tab icon={<Home sx={{ fontSize: 20 }} />} iconPosition="start" label="Coleta Domiciliar - Diurno" />
                <Tab
                  icon={<RecyclingRounded sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Coleta Seletiva - Diurno"
                />
              </Tabs>
            </Container>
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flex: 1,
              padding: { xs: "1rem", sm: "1.5rem" },
              animation: "fadeIn 1s ease-out",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Container maxWidth="xl">
              {/* Coleta Domiciliar */}
              {tabValue === 0 && (
                <>
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        backgroundColor: "#009fe3",
                        color: "white",
                        py: 2,
                        px: 3,
                        borderRadius: "8px",
                        mb: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        COLETA DOMICILIAR - DIURNO
                      </Typography>
                    </Box>

                    {/* Stats Cards */}
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
                      <Fade in={!loading} timeout={500}>
                        <Box>
                          <StatCard
                            title="Total de Equipamentos"
                            value="59"
                            icon={<LocalShipping />}
                            color={themeColors.primary.main}
                            highlight={highlightedStat === "totalEquipamentos"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Motoristas"
                            value="59"
                            icon={<People />}
                            color={themeColors.secondary.main}
                            highlight={highlightedStat === "totalMotoristas"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Coletores"
                            value="142"
                            icon={<Engineering />}
                            color={themeColors.warning.main}
                            highlight={highlightedStat === "totalColetores"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Faltas"
                            value="36"
                            icon={<Today />}
                            color={themeColors.error.main}
                            highlight={highlightedStat === "totalFaltas"}
                          />
                        </Box>
                      </Fade>
                    </Box>

                    {/* Equipamentos e Mão de Obra */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "400ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <EquipmentCard
                            title="EQUIPAMENTOS"
                            data={domiciliarEquipamentos}
                            color="#c0c0c0"
                            textColor="#000"
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <WorkforceCard
                            title="MÃO DE OBRA"
                            data={domiciliarMaoDeObra}
                            color="#c0c0c0"
                            textColor="#000"
                          />
                        </Box>
                      </Zoom>
                    </Box>

                    {/* Resumo Geral */}
                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "600ms" : "0ms" }}>
                      <Box sx={{ mb: 3 }}>
                        <SummaryCard
                          title="RESUMO GERAL M.O. - DOMICILIAR"
                          data={domiciliarResumo}
                          color="#ffff00"
                          textColor="#000"
                        />
                      </Box>
                    </Zoom>

                    {/* Gráficos */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "700ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <EquipmentChart
                            title="Equipamentos por PA"
                            data={equipamentosChartData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "800ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <WorkforceChart
                            title="Mão de Obra por PA"
                            data={maoDeObraChartData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                    </Box>

                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "900ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <PADistributionChart
                            title="Distribuição por PA"
                            data={paDistributionData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "1000ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <CollectionTypeChart
                            title="Tipos de Coleta"
                            data={collectionTypeData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                    </Box>
                  </Box>
                </>
              )}

              {/* Coleta Seletiva */}
              {tabValue === 1 && (
                <>
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        backgroundColor: "#00a651",
                        color: "white",
                        py: 2,
                        px: 3,
                        borderRadius: "8px",
                        mb: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        COLETA SELETIVA - DIURNO
                      </Typography>
                    </Box>

                    {/* Stats Cards */}
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
                      <Fade in={!loading} timeout={500}>
                        <Box>
                          <StatCard
                            title="Total de Equipamentos"
                            value="19"
                            icon={<LocalShipping />}
                            color={themeColors.primary.main}
                            highlight={highlightedStat === "totalEquipamentos"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Motoristas"
                            value="20"
                            icon={<People />}
                            color={themeColors.secondary.main}
                            highlight={highlightedStat === "totalMotoristas"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Coletores"
                            value="32"
                            icon={<Engineering />}
                            color={themeColors.warning.main}
                            highlight={highlightedStat === "totalColetores"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Faltas"
                            value="4"
                            icon={<Today />}
                            color={themeColors.error.main}
                            highlight={highlightedStat === "totalFaltas"}
                          />
                        </Box>
                      </Fade>
                    </Box>

                    {/* Equipamentos e Mão de Obra */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "400ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <EquipmentCard
                            title="EQUIPAMENTOS"
                            data={seletivaEquipamentos}
                            color="#c0c0c0"
                            textColor="#000"
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <WorkforceCard
                            title="MÃO DE OBRA"
                            data={seletivaMaoDeObra}
                            color="#c0c0c0"
                            textColor="#000"
                          />
                        </Box>
                      </Zoom>
                    </Box>

                    {/* Resumo Geral */}
                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "600ms" : "0ms" }}>
                      <Box sx={{ mb: 3 }}>
                        <SummaryCard
                          title="RESUMO GERAL M.O. - SELETIVA"
                          data={seletivaResumo}
                          color="#ffff00"
                          textColor="#000"
                        />
                      </Box>
                    </Zoom>

                    {/* Gráficos */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "700ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <EquipmentChart
                            title="Equipamentos por PA"
                            data={equipamentosChartData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "800ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <WorkforceChart
                            title="Mão de Obra por PA"
                            data={maoDeObraChartData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                    </Box>

                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "900ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <PADistributionChart
                            title="Distribuição por PA"
                            data={paDistributionData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "1000ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <CollectionTypeChart
                            title="Tipos de Coleta"
                            data={collectionTypeData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                    </Box>
                  </Box>
                </>
              )}
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
