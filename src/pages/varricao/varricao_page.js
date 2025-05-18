"use client"

import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
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
import { Refresh, Menu as MenuIcon, FilterAlt, BarChart, CleaningServices, Route, People } from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import VarricaoTable from "@/components/tabela_varricao"
import RegionCoverageChart from "@/components/cobertura_varricao"
import GraficoVarricaoSemanal from "@/components/varricao_grafico"
import StatsCard from "@/components/varricao_stats"
import DashboardCard from "@/components/dashboard_varricao_cards"

// Keyframes for animations
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

export default function VarricaoDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State variables
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [chartsLoaded, setChartsLoaded] = useState(false)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  // Stats Cards State
  const [statsLoading, setStatsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEquipes: 0,
    kmVarridos: 0,
    equipesAtivas: 0,
    coberturaDiaria: 0,
  })

  // Mock data for street sweeping operations
  const [varricaoData, setVarricaoData] = useState([])

  const loadAllData = async () => {
    console.log("Iniciando carregamento de dados...")
    setLoading(true)
    setInitialLoading(true)
    setStatsLoading(true)

    try {
      // Simulate API calls with mock data
      // In a real application, these would be actual API calls

      // Stats data
      setTimeout(() => {
        setStats({
          totalEquipes: 42,
          kmVarridos: 320,
          equipesAtivas: 36,
          coberturaDiaria: 78,
        })
        setStatsLoading(false)
      }, 1500)

      // Mock street sweeping data
      const mockVarricaoData = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        setor: `Setor ${Math.floor(Math.random() * 10) + 1}`,
        supervisor: `Supervisor ${Math.floor(Math.random() * 15) + 1}`,
        supervisorId: `S${Math.floor(Math.random() * 1000) + 1000}`,
        varredores: Array.from(
          { length: Math.floor(Math.random() * 3) + 2 },
          (_, i) => `Varredor ${Math.floor(Math.random() * 15) + 1}`,
        ),
        varredoresIds: Array.from(
          { length: Math.floor(Math.random() * 3) + 2 },
          (_, i) => `V${Math.floor(Math.random() * 1000) + 1000}`,
        ),
        equipamento: `Kit ${Math.floor(Math.random() * 20) + 1}`,
        equipamentoId: `KIT-${Math.floor(Math.random() * 100) + 100}`,
        inicioTurno: `${Math.floor(Math.random() * 4) + 6}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        status: Math.random() > 0.3 ? "Finalizado" : "Em andamento",
        fimTurno:
          Math.random() > 0.3
            ? `${Math.floor(Math.random() * 4) + 14}:${Math.floor(Math.random() * 60)
                .toString()
                .padStart(2, "0")}`
            : "",
        data: new Date().toISOString().split("T")[0],
        regiao: ["Norte", "Sul", "Leste", "Oeste", "Centro"][Math.floor(Math.random() * 5)],
        turno: ["Matutino", "Vespertino", "Noturno"][Math.floor(Math.random() * 3)],
        kmVarridos: (Math.random() * 5 + 1).toFixed(2),
        residuosColetados: `${(Math.random() * 0.8 + 0.2).toFixed(2)} ton`,
      }))

      setVarricaoData(mockVarricaoData)

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
      setStatsLoading(false)
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

  // Stats Cards Data
  const statsCards = [
    {
      title: "Total de Equipes",
      value: stats.totalEquipes,
      subtitle: "Equipes de varrição disponíveis",
      icon: <People />,
      color: themeColors.primary,
      delay: "0s",
    },
    {
      title: "Equipes Ativas",
      value: stats.equipesAtivas,
      subtitle: "Equipes em operação hoje",
      icon: <CleaningServices />,
      color: themeColors.success,
      delay: "0.1s",
    },
    {
      title: "KM Varridos",
      value: stats.kmVarridos,
      subtitle: "Quilômetros varridos hoje",
      icon: <Route />,
      color: themeColors.warning,
      delay: "0.2s",
    },
    {
      title: "Cobertura Diária",
      value: `${stats.coberturaDiaria}%`,
      subtitle: "Percentual de cobertura do dia",
      icon: <BarChart />,
      color: themeColors.info,
      delay: "0.3s",
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
                      width: "5px",
                      height: { xs: "36px", sm: "48px" },
                      borderRadius: "8px",
                      background: `linear-gradient(180deg, ${themeColors.primary.main} 0%, ${themeColors.info.main} 100%)`,
                      mr: 3,
                      boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.4)}`,
                    }}
                  />
                  <Box sx={{ position: "relative" }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "1.6rem", sm: "2.2rem" },
                        color: themeColors.text.primary,
                        letterSpacing: "0.01em",
                        fontFamily: "'Poppins', sans-serif",
                        position: "relative",
                        display: "inline-block",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: "-4px",
                          left: "0",
                          width: "40%",
                          height: "3px",
                          background: `linear-gradient(90deg, ${themeColors.primary.main}, ${alpha(themeColors.primary.light, 0)})`,
                          borderRadius: "2px",
                        },
                      }}
                    >
                      Dashboard Varrição
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: themeColors.text.secondary,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        mt: "0.5rem",
                        fontWeight: 400,
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
                          width: "3px",
                          height: "3px",
                          borderRadius: "50%",
                          backgroundColor: themeColors.primary.main,
                        },
                      }}
                    >
                      Gerenciamento de operações de varrição urbana
                    </Typography>
                  </Box>
                </Box>
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
              <Box sx={{ mb: 4, mt: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
                    gap: 3,
                  }}
                >
                  {statsCards.map((card, index) => (
                    <StatsCard
                      key={index}
                      title={card.title}
                      value={card.value}
                      subtitle={card.subtitle}
                      icon={card.icon}
                      color={card.color}
                      delay={card.delay}
                    />
                  ))}
                </Box>
              </Box>

              {/* Varrição Table Section */}
              <VarricaoTable
                varricaoData={varricaoData}
                loading={loading}
                themeColors={themeColors}
                keyframes={keyframes}
                onRefresh={handleRefreshData}
              />

              {/* Equipe Distribution Section */}

              {/* Region Coverage Chart */}
              <Box component="section" sx={{ mb: 4 }}>
                <DashboardCard
                  title="Cobertura por Região"
                  subtitle="Percentual de cobertura por região da cidade"
                  icon={<FilterAlt />}
                  iconColor={themeColors.info.main}
                  onRefresh={handleRefreshData}
                >
                  <Box
                    sx={{
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <RegionCoverageChart chartsLoaded={chartsLoaded} themeColors={themeColors} />
                  </Box>
                </DashboardCard>
              </Box>

              {/* Varrição por Dia da Semana Chart */}
              <Box component="section" sx={{ mb: 4 }}>
                <DashboardCard
                  title="Varrição por Dia da Semana"
                  subtitle="Quilômetros varridos e eficiência por dia da semana"
                  icon={<BarChart />}
                  iconColor={themeColors.primary.main}
                  onRefresh={handleRefreshData}
                >
                  <Box
                    sx={{
                      width: "100%",
                      position: "relative",
                      height: "350px",
                    }}
                  >
                    <GraficoVarricaoSemanal themeColors={themeColors} chartsLoaded={chartsLoaded} />
                  </Box>
                </DashboardCard>
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
