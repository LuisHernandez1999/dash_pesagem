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
  alpha,
  Snackbar,
  Alert,
  Grid,
  Chip,
} from "@mui/material"
import { Refresh, BarChart, Home, Groups, LocalShipping, Schedule } from "@mui/icons-material"

// Componentes simplificados para TV (inline)
const TVStatsCard = ({ title, value, subtitle, icon, color, trend }) => (
  <Card
    sx={{
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
      border: `2px solid ${alpha(color, 0.2)}`,
      transition: "all 0.4s ease",
      height: "180px",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: `0 16px 48px ${alpha(color, 0.25)}`,
      },
    }}
  >
    <CardContent
      sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 24px ${alpha(color, 0.4)}`,
          }}
        >
          {icon}
        </Box>
        {trend && (
          <Chip
            label={trend}
            size="small"
            sx={{
              backgroundColor: alpha(color, 0.15),
              color: color,
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          />
        )}
      </Box>
      <Box>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: "3.2rem",
            color: color,
            lineHeight: 1,
            mb: 1,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.4rem",
            color: "#1e293b",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748b",
            fontSize: "1.1rem",
            fontWeight: 500,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </CardContent>
  </Card>
)

const TVBarChart = ({ data, height = 400 }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height }}>
        <Typography variant="h6" color="text.secondary">
          Carregando dados...
        </Typography>
      </Box>
    )
  }

  const maxValue = Math.max(...data.map((item) => item.quantidade || 0))

  return (
    <Box sx={{ height, p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "end", height: "100%", gap: 3 }}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.quantidade / maxValue) * 80 : 0
          const colors = ["#4361EE", "#4CC9F0", "#F72585", "#7209B7", "#F9C74F", "#90BE6D", "#F94144"]

          return (
            <Box
              key={index}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "end",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: colors[index % colors.length],
                  mb: 1,
                  fontSize: "2rem",
                }}
              >
                {item.quantidade || 0}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: `${barHeight}%`,
                  background: `linear-gradient(180deg, ${colors[index % colors.length]} 0%, ${alpha(colors[index % colors.length], 0.7)} 100%)`,
                  borderRadius: "12px 12px 0 0",
                  transition: "all 0.6s ease",
                  boxShadow: `0 4px 16px ${alpha(colors[index % colors.length], 0.3)}`,
                  minHeight: "20px",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  color: "#1e293b",
                  fontSize: "1.3rem",
                  textAlign: "center",
                }}
              >
                {item.diaSemana}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

const TVShiftChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
        <Typography variant="h6" color="text.secondary">
          Carregando dados dos turnos...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: 300, display: "flex", gap: 4, p: 2 }}>
      {data.map((shift, index) => {
        const total = shift.total || 0
        const colors = ["#FF6B6B", "#4ECDC4"]

        return (
          <Card
            key={shift.name}
            sx={{
              flex: 1,
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${colors[index]}15 0%, ${colors[index]}08 100%)`,
              border: `2px solid ${alpha(colors[index], 0.2)}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: colors[index],
                fontSize: "4rem",
                mb: 2,
              }}
            >
              {total}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
                mb: 2,
                fontSize: "1.8rem",
              }}
            >
              {shift.name}
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ color: "#64748b", fontSize: "1.2rem" }}>
                Motoristas: {shift.motoristas || 0}
              </Typography>
              <Typography variant="h6" sx={{ color: "#64748b", fontSize: "1.2rem" }}>
                Coletores: {shift.coletores || 0}
              </Typography>
            </Box>
          </Card>
        )
      })}
    </Box>
  )
}

// Animações CSS
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
        transform: translateY(30px);
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
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  glow: `
    @keyframes glow {
      0% { box-shadow: 0 0 20px rgba(26, 35, 126, 0.3); }
      50% { box-shadow: 0 0 40px rgba(26, 35, 126, 0.6); }
      100% { box-shadow: 0 0 20px rgba(26, 35, 126, 0.3); }
    }
  `,
}

// Cores do tema
const themeColors = {
  primary: { main: "#3a86ff", light: "#5e9bff", dark: "#2970e6" },
  secondary: { main: "#ff006e", light: "#ff4b93", dark: "#c8005a" },
  success: { main: "#00c896", light: "#33d3aa", dark: "#00a078" },
  warning: { main: "#ffbe0b", light: "#ffcb3d", dark: "#e6aa00" },
  error: { main: "#fb5607", light: "#fc7739", dark: "#e64e00" },
  info: { main: "#8338ec", light: "#9c5ff0", dark: "#6a2dbd" },
  text: { primary: "#1e293b", secondary: "#64748b" },
  background: { default: "#f8fafc", paper: "#ffffff" },
}

export default function RSUTVDashboard() {
  // Estados
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState(null)
  const [shiftData, setShiftData] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock da função de API (substitua pela sua implementação real)
  const loadAllData = async () => {
    setLoading(true)
    try {
      // Simular dados da API
      const mockApiData = {
        totalRSUHoje: 47,
        totalVeiculos: 12,
        totalMotoristas: 24,
        totalColetores: 36,
        porEquipe: {
          diurno: { motoristas: 16, coletores: 24 },
          noturno: { motoristas: 8, coletores: 12 },
        },
      }

      const mockWeeklyData = [
        { diaSemana: "Segunda", quantidade: 42 },
        { diaSemana: "Terça", quantidade: 38 },
        { diaSemana: "Quarta", quantidade: 45 },
        { diaSemana: "Quinta", quantidade: 40 },
        { diaSemana: "Sexta", quantidade: 47 },
        { diaSemana: "Sábado", quantidade: 25 },
        { diaSemana: "Domingo", quantidade: 15 },
      ]

      const mockShiftData = [
        { name: "Diurno", motoristas: 16, coletores: 24, total: 40 },
        { name: "Noturno", motoristas: 8, coletores: 12, total: 20 },
      ]

      setApiData(mockApiData)
      setWeeklyData(mockWeeklyData)
      setShiftData(mockShiftData)

      setSnackbarMessage("Dados atualizados com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setSnackbarMessage("Erro ao carregar dados")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados na inicialização
  useEffect(() => {
    loadAllData()

    // Auto-refresh a cada 30 segundos para TV
    const interval = setInterval(loadAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Atualizar relógio
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleRefreshData = () => {
    loadAllData()
  }

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
          ${keyframes.glow}
          
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
        `}
      </style>

      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        {/* Header otimizado para TV */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: "#ffffff",
            color: "#1e293b",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            borderBottom: `3px solid ${themeColors.primary.main}`,
          }}
        >
          <Toolbar sx={{ minHeight: "100px !important", px: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Box
                sx={{
                  width: "8px",
                  height: "80px",
                  borderRadius: "8px",
                  background: `linear-gradient(180deg, ${themeColors.primary.main} 0%, ${themeColors.info.main} 100%)`,
                  mr: 4,
                  animation: `${keyframes.glow} 3s ease-in-out infinite`,
                }}
              />
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: "3.5rem",
                    color: themeColors.text.primary,
                    letterSpacing: "-0.02em",
                    background: `linear-gradient(90deg, ${themeColors.primary.dark} 0%, ${themeColors.primary.main} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Dashboard Domiciliar
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: themeColors.text.secondary,
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    mt: 1,
                  }}
                >
                  Sistema de Monitoramento RSU • {apiData?.totalRSUHoje || 0} saídas hoje
                </Typography>
              </Box>
            </Box>

            {/* Relógio e controles */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: themeColors.primary.main,
                    fontSize: "2.2rem",
                  }}
                >
                  {currentTime.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: themeColors.text.secondary,
                    fontSize: "1.2rem",
                  }}
                >
                  {currentTime.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </Typography>
              </Box>

              <IconButton
                sx={{
                  color: themeColors.text.secondary,
                  width: "60px",
                  height: "60px",
                  "&:hover": {
                    color: themeColors.primary.main,
                    transform: "rotate(180deg)",
                    transition: "transform 0.5s ease-in-out",
                  },
                }}
                onClick={handleRefreshData}
              >
                <Refresh sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Conteúdo principal */}
        <Container maxWidth="xl" sx={{ py: 4, px: 4 }}>
          {/* Cards de estatísticas principais */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <TVStatsCard
                title="Saídas Hoje"
                value={apiData?.totalRSUHoje || 0}
                subtitle="Coletas realizadas"
                icon={<Home sx={{ color: "white", fontSize: "2rem" }} />}
                color={themeColors.primary.main}
                trend="+12%"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <TVStatsCard
                title="Veículos Ativos"
                value={apiData?.totalVeiculos || 0}
                subtitle="Em operação"
                icon={<LocalShipping sx={{ color: "white", fontSize: "2rem" }} />}
                color={themeColors.success.main}
                trend="100%"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <TVStatsCard
                title="Motoristas"
                value={apiData?.totalMotoristas || 0}
                subtitle="Em atividade"
                icon={<Groups sx={{ color: "white", fontSize: "2rem" }} />}
                color={themeColors.warning.main}
                trend="+5%"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <TVStatsCard
                title="Coletores"
                value={apiData?.totalColetores || 0}
                subtitle="Trabalhando"
                icon={<Groups sx={{ color: "white", fontSize: "2rem" }} />}
                color={themeColors.error.main}
                trend="+8%"
              />
            </Grid>
          </Grid>

          {/* Gráficos principais */}
          <Grid container spacing={4}>
            {/* Distribuição por Turno */}
            <Grid item xs={12} lg={6}>
              <Card
                sx={{
                  borderRadius: "24px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                  height: "500px",
                  background: "#ffffff",
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: themeColors.warning.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                        }}
                      >
                        <Schedule sx={{ color: "white", fontSize: "1.5rem" }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            fontSize: "2rem",
                            color: themeColors.text.primary,
                          }}
                        >
                          Distribuição por Turno
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.2rem",
                            color: themeColors.text.secondary,
                          }}
                        >
                          Colaboradores ativos por período
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ pb: 2 }}
                />
                <CardContent sx={{ height: "calc(100% - 120px)" }}>
                  <TVShiftChart data={shiftData} />
                </CardContent>
              </Card>
            </Grid>

            {/* Distribuição Semanal */}
            <Grid item xs={12} lg={6}>
              <Card
                sx={{
                  borderRadius: "24px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                  height: "500px",
                  background: "#ffffff",
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: themeColors.info.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                        }}
                      >
                        <BarChart sx={{ color: "white", fontSize: "1.5rem" }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            fontSize: "2rem",
                            color: themeColors.text.primary,
                          }}
                        >
                          Distribuição Semanal
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.2rem",
                            color: themeColors.text.secondary,
                          }}
                        >
                          Coletas realizadas por dia
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ pb: 2 }}
                />
                <CardContent sx={{ height: "calc(100% - 120px)" }}>
                  <TVBarChart data={weeklyData} height={350} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Status bar inferior */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${themeColors.primary.main}15 0%, ${themeColors.info.main}08 100%)`,
              border: `2px solid ${alpha(themeColors.primary.main, 0.2)}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: themeColors.text.primary,
                fontSize: "1.4rem",
              }}
            >
              Sistema Online • Última atualização: {currentTime.toLocaleTimeString("pt-BR")}
            </Typography>
            <Chip
              label="ATIVO"
              sx={{
                backgroundColor: themeColors.success.main,
                color: "white",
                fontWeight: 700,
                fontSize: "1.1rem",
                px: 2,
                py: 1,
                animation: `${keyframes.pulse} 2s ease-in-out infinite`,
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Notificações */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            fontSize: "1.1rem",
            "& .MuiAlert-message": {
              fontSize: "1.1rem",
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
