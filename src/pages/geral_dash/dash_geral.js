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
  alpha,
  LinearProgress,
  Fade,
  Grow,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material"
import {
  LocalShipping,
  Person,
  RecyclingOutlined,
  Refresh,
  Assessment,
  TrendingUp,
  Build,
  Dashboard,
  BarChart,
  PieChart,
  Speed,
} from "@mui/icons-material"
import {
  PieChart as RechartsPieChart,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
} from "recharts"
import { getDashGeral } from "../../service/geral"
import { createTheme } from "@mui/material/styles"

// No início do arquivo, adicionar breakpoint customizado
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      "2xl": 1920, // Para TVs
    },
  },
})

// Cores do tema
const themeColors = {
  primary: {
    main: "#2563eb",
    light: "#3b82f6",
    dark: "#1d4ed8",
  },
  secondary: {
    main: "#64748b",
    light: "#94a3b8",
    dark: "#475569",
  },
  success: {
    main: "#059669",
    light: "#10b981",
    dark: "#047857",
  },
  warning: {
    main: "#d97706",
    light: "#f59e0b",
    dark: "#b45309",
  },
  info: {
    main: "#0284c7",
    light: "#0ea5e9",
    dark: "#0369a1",
  },
  purple: {
    main: "#7c3aed",
    light: "#8b5cf6",
    dark: "#6d28d9",
  },
  green: {
    main: "#374151",
    light: "#4b5563",
    dark: "#1f2937",
  },
}

// Cores dos gráficos
const chartColors = ["#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#22d3ee", "#fb7185", "#a3e635", "#fb923c"]

// Componente de Card Estatístico
const StatCard = ({ title, value, icon: Icon, color, subtitle, progress, delay = 0 }) => (
  <Grow in={true} timeout={800} style={{ transitionDelay: `${delay}ms` }}>
    <Card
      sx={{
        height: {
          xs: "200px",
          xl: "200px",
          "2xl": "280px", // Para TVs
        },
        background: "#ffffff",
        color: "#1e293b",
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        border: "1px solid #f1f5f9",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${alpha(color, 0.2)}`,
        },
      }}
    >
      <CardContent
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "3rem",
                  xl: "3rem",
                  "2xl": "4.5rem", // Para TVs
                },
                mb: 1,
                color: "#0f172a",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: {
                  xs: "1.1rem",
                  xl: "1.1rem",
                  "2xl": "1.4rem", // Para TVs
                },
                color: "#475569",
                lineHeight: 1.3,
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: color,
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: {
                xs: 64,
                xl: 64,
                "2xl": 80, // Para TVs
              },
              height: {
                xs: 64,
                xl: 64,
                "2xl": 80, // Para TVs
              },
              borderRadius: "20px",
              background: alpha(color, 0.08),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${alpha(color, 0.15)}`,
              flexShrink: 0,
              ml: 2,
            }}
          >
            <Icon
              sx={{
                fontSize: {
                  xs: 28,
                  xl: 28,
                  "2xl": 36, // Para TVs
                },
                color: color,
              }}
            />
          </Box>
        </Box>

        {progress !== undefined && (
          <Box sx={{ mt: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
                Progresso
              </Typography>
              <Typography variant="caption" sx={{ color: color, fontWeight: 600 }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(color, 0.08),
                "& .MuiLinearProgress-bar": {
                  backgroundColor: color,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  </Grow>
)

// Componente de Gráfico de Pizza
const PieChartCard = ({ title, data, height = 400 }) => (
  <Card
    sx={{
      height: {
        xs: height + 120,
        xl: height + 120,
        "2xl": height + 160, // Para TVs
      },
      borderRadius: "24px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    <CardContent sx={{ p: 4, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: alpha("#8b5cf6", 0.1),
            border: `1px solid ${alpha("#8b5cf6", 0.3)}`,
            mr: 2,
          }}
        >
          <PieChart sx={{ fontSize: 20, color: "#8b5cf6" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            fontSize: {
              xs: "1.3rem",
              xl: "1.3rem",
              "2xl": "1.6rem", // Para TVs
            },
          }}
        >
          {title}
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={100}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            stroke="#fff"
            strokeWidth={4}
          >
            {data &&
              Array.isArray(data) &&
              data.map((entry, index) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
              padding: "16px",
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

// Componente de Gráfico de Barras
const BarChartCard = ({ title, data, height = 400 }) => (
  <Card
    sx={{
      height: {
        xs: height + 120,
        xl: height + 120,
        "2xl": height + 160, // Para TVs
      },
      borderRadius: "24px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    <CardContent sx={{ p: 4, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: alpha("#3b82f6", 0.1),
            border: `1px solid ${alpha("#3b82f6", 0.3)}`,
            mr: 2,
          }}
        >
          <BarChart sx={{ fontSize: 20, color: "#3b82f6" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            fontSize: {
              xs: "1.3rem",
              xl: "1.3rem",
              "2xl": "1.6rem", // Para TVs
            },
          }}
        >
          {title}
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeWidth={1} />
          <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }} />
          <YAxis tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
              padding: "16px",
            }}
          />
          <Legend />
          <Bar dataKey="veiculos" fill="#60a5fa" name="Veículos" radius={[6, 6, 0, 0]} />
          <Bar dataKey="motoristas" fill="#34d399" name="Motoristas" radius={[6, 6, 0, 0]} />
          <Bar dataKey="coletores" fill="#fbbf24" name="Coletores" radius={[6, 6, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

// Componente de Gráfico de Barras para Eficiência
const EfficiencyBarChartCard = ({ title, data, height = 400 }) => (
  <Card
    sx={{
      height: {
        xs: height + 120,
        xl: height + 120,
        "2xl": height + 160, // Para TVs
      },
      borderRadius: "24px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    <CardContent sx={{ p: 4, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: alpha("#f59e0b", 0.1),
            border: `1px solid ${alpha("#f59e0b", 0.3)}`,
            mr: 2,
          }}
        >
          <Speed sx={{ fontSize: 20, color: "#f59e0b" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            fontSize: {
              xs: "1.3rem",
              xl: "1.3rem",
              "2xl": "1.6rem", // Para TVs
            },
          }}
        >
          {title}
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeWidth={1} />
          <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }} />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
              padding: "16px",
            }}
            formatter={(value) => [`${value}%`, "Eficiência"]}
          />
          <Legend />
          <Bar dataKey="value" fill="#f59e0b" name="Eficiência %" radius={[6, 6, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

export default function FleetDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Iniciando busca de dados...")
      const apiData = await getDashGeral()
      console.log("Dados recebidos da API:", apiData)

      if (apiData) {
        setData(apiData)
        setLastUpdate(new Date())
        console.log("Dados definidos no estado:", apiData)
      } else {
        console.error("API retornou dados nulos")
        setError("Erro ao carregar dados da API")
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err)
      setError(`Erro ao conectar com a API: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRefresh = () => {
    fetchData()
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#fdfdfd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#3b82f6" }} />
        <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 600 }}>
          Carregando dados do dashboard...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fdfdfd", p: 4 }}>
        <Container maxWidth="md">
          <Alert
            severity="error"
            sx={{
              borderRadius: "16px",
              fontSize: "1.1rem",
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh} startIcon={<Refresh />}>
                Tentar Novamente
              </Button>
            }
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Erro ao carregar dashboard
            </Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        </Container>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fdfdfd", p: 4 }}>
        <Container maxWidth="md">
          <Alert severity="warning" sx={{ borderRadius: "16px" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Nenhum dado disponível
            </Typography>
            <Typography variant="body2">Os dados não foram carregados. Verifique a conexão com a API.</Typography>
            <Button onClick={handleRefresh} startIcon={<Refresh />} sx={{ mt: 2 }}>
              Tentar Novamente
            </Button>
          </Alert>
        </Container>
      </Box>
    )
  }

  console.log("Renderizando dashboard com dados:", data)

  // Calcular totais com os dados da API
  const totalVeiculos =
    (data.pa1?.veiculos || 0) + (data.pa2?.veiculos || 0) + (data.pa3?.veiculos || 0) + (data.pa4?.veiculos || 0)
  const totalMotoristas =
    (data.pa1?.motoristas || 0) +
    (data.pa2?.motoristas || 0) +
    (data.pa3?.motoristas || 0) +
    (data.pa4?.motoristas || 0)
  const totalColetores =
    (data.pa1?.coletores || 0) + (data.pa2?.coletores || 0) + (data.pa3?.coletores || 0) + (data.pa4?.coletores || 0)

  console.log("Totais calculados:", { totalVeiculos, totalMotoristas, totalColetores })

  // Preparar dados para gráficos
  const locationData = [
    {
      name: "PA1",
      veiculos: data.pa1?.veiculos || 0,
      motoristas: data.pa1?.motoristas || 0,
      coletores: data.pa1?.coletores || 0,
    },
    {
      name: "PA2",
      veiculos: data.pa2?.veiculos || 0,
      motoristas: data.pa2?.motoristas || 0,
      coletores: data.pa2?.coletores || 0,
    },
    {
      name: "PA3",
      veiculos: data.pa3?.veiculos || 0,
      motoristas: data.pa3?.motoristas || 0,
      coletores: data.pa3?.coletores || 0,
    },
    {
      name: "PA4",
      veiculos: data.pa4?.veiculos || 0,
      motoristas: data.pa4?.motoristas || 0,
      coletores: data.pa4?.coletores || 0,
    },
  ]

  const pieData = [
    { name: "Veículos", value: totalVeiculos },
    { name: "Motoristas", value: totalMotoristas },
    { name: "Coletores", value: totalColetores },
  ]

  // Calcular eficiência baseada nos dados reais
  const calculateEfficiency = (pa) => {
    const total = (pa?.veiculos || 0) + (pa?.motoristas || 0) + (pa?.coletores || 0)
    const maxPossible = 12 // Assumindo um máximo teórico baseado nos seus dados
    return total > 0 ? Math.min(Math.round((total / maxPossible) * 100), 100) : 0
  }

  const efficiencyData = [
    { name: "PA1", value: calculateEfficiency(data.pa1), fill: "#3b82f6" },
    { name: "PA2", value: calculateEfficiency(data.pa2), fill: "#10b981" },
    { name: "PA3", value: calculateEfficiency(data.pa3), fill: "#f59e0b" },
    { name: "PA4", value: calculateEfficiency(data.pa4), fill: "#8b5cf6" },
  ]

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fdfdfd" }}>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
          color: "#ffffff",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ py: 2, px: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 3,
                border: "2px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Dashboard sx={{ fontSize: 28, color: "#ffffff" }} />
            </Box>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: "2.2rem",
                    xl: "2.2rem",
                    "2xl": "3rem", // Para TVs
                  },
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                Dashboard Operacional
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: {
                    xs: "1rem",
                    xl: "1rem",
                    "2xl": "1.4rem", // Para TVs
                  },
                  fontWeight: 500,
                  mt: 0.5,
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                Gestão Inteligente de Frota e Recursos
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {lastUpdate && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 4,
                  py: 2,
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  ml: 2,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <Assessment sx={{ fontSize: 16, color: "#ffffff" }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                      lineHeight: 1,
                    }}
                  >
                    Última Atualização
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                      mt: 0.5,
                    }}
                  >
                    {lastUpdate.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            )}

            <Button
              onClick={handleRefresh}
              startIcon={<Refresh />}
              disabled={loading}
              sx={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                borderRadius: "12px",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                backdropFilter: "blur(10px)",
                textTransform: "none",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.25)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                },
                "&:disabled": {
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.6)",
                },
              }}
            >
              Atualizar
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth={{
          xs: "xl",
          xl: "xl",
          "2xl": false, // Para TVs usar largura total
        }}
        sx={{
          py: 4,
          px: {
            xs: 4,
            xl: 4,
            "2xl": 6, // Para TVs
          },
        }}
      >
        {/* Cards de Resumo Geral */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              fontSize: {
                xs: "1.5rem",
                xl: "1.5rem",
                "2xl": "2rem", // Para TVs
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: alpha(themeColors.success.main, 0.1),
                border: `1px solid ${alpha(themeColors.success.main, 0.3)}`,
                mr: 2,
              }}
            >
              <Assessment sx={{ color: themeColors.success.main }} />
            </Box>
            Resumo Geral
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            <StatCard
              title="Total de Veículos"
              value={totalVeiculos}
              icon={LocalShipping}
              color={themeColors.primary.main}
              subtitle="Em operação"
              progress={totalVeiculos > 0 ? Math.min((totalVeiculos / 10) * 100, 100) : 0}
              delay={0}
            />
            <StatCard
              title="Total de Motoristas"
              value={totalMotoristas}
              icon={Person}
              color={themeColors.success.main}
              subtitle="Em operação"
              progress={totalMotoristas > 0 ? Math.min((totalMotoristas / 10) * 100, 100) : 0}
              delay={100}
            />
            <StatCard
              title="Total de Coletores"
              value={totalColetores}
              icon={RecyclingOutlined}
              color={themeColors.info.main}
              subtitle="Em operação"
              progress={totalColetores > 0 ? Math.min((totalColetores / 20) * 100, 100) : 0}
              delay={200}
            />
            <StatCard
              title="Equipamentos"
              value={data.contagemEquipamentos || 0}
              icon={Build}
              color={themeColors.warning.main}
              subtitle="Em operação"
              progress={data.contagemEquipamentos > 0 ? Math.min((data.contagemEquipamentos / 10) * 100, 100) : 0}
              delay={300}
            />
          </Box>
        </Box>

        {/* Comparativo de Recursos */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              fontSize: {
                xs: "1.5rem",
                xl: "1.5rem",
                "2xl": "2rem", // Para TVs
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: alpha(themeColors.secondary.main, 0.1),
                border: `1px solid ${alpha(themeColors.secondary.main, 0.3)}`,
                mr: 2,
              }}
            >
              <BarChart sx={{ color: themeColors.secondary.main }} />
            </Box>
            Comparativo de Recursos
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                lg: "repeat(2, 1fr)",
              },
              gap: 3,
            }}
          >
            <BarChartCard title="Comparativo de Recursos - Todas as PAs" data={locationData} height={400} />

            <Card
              sx={{
                height: 520,
                borderRadius: "24px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
              }}
            >
              <CardContent sx={{ p: 4, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    pb: 2,
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: alpha("#10b981", 0.1),
                      border: `1px solid ${alpha("#10b981", 0.3)}`,
                      mr: 2,
                    }}
                  >
                    <Assessment sx={{ fontSize: 20, color: "#10b981" }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: {
                        xs: "1.3rem",
                        xl: "1.3rem",
                        "2xl": "1.6rem", // Para TVs
                      },
                    }}
                  >
                    Distribuição Total por PA
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "calc(100% - 100px)" }}>
                  {locationData.map((paData, index) => {
                    const totalPA = paData.veiculos + paData.motoristas + paData.coletores
                    const totalGeral = totalVeiculos + totalMotoristas + totalColetores
                    const percentage = totalGeral > 0 ? Math.round((totalPA / totalGeral) * 100) : 0
                    const isActive = totalPA > 0
                    const paColor = isActive ? ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][index] : "#e2e8f0"

                    return (
                      <Box
                        key={paData.name}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          borderRadius: "12px",
                          background: alpha(paColor, 0.05),
                          border: `1px solid ${alpha(paColor, 0.15)}`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateX(4px)",
                            boxShadow: `0 4px 12px ${alpha(paColor, 0.2)}`,
                          },
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateX(4px)",
                            boxShadow: `0 4px 12px ${alpha(paColor, 0.2)}`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: paColor,
                            mr: 2,
                            boxShadow: `0 0 0 3px ${alpha(paColor, 0.2)}`,
                          }}
                        />

                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#1e293b",
                            fontSize: "1.3rem",
                            minWidth: "50px",
                          }}
                        >
                          {paData.name}
                        </Typography>

                        <Box sx={{ flex: 1, mx: 2 }}>
                          <Box
                            sx={{
                              width: "100%",
                              height: 8,
                              borderRadius: 4,
                              background: "#f1f5f9",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                width: `${percentage}%`,
                                height: "100%",
                                background: `linear-gradient(90deg, ${paColor}, ${alpha(paColor, 0.8)})`,
                                borderRadius: 4,
                                transition: "width 1s ease-in-out",
                              }}
                            />
                          </Box>
                        </Box>

                        <Box sx={{ textAlign: "right", minWidth: "80px" }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: paColor,
                              fontSize: "1.1rem",
                              lineHeight: 1,
                            }}
                          >
                            {totalPA}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#64748b",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          >
                            ({percentage}%)
                          </Typography>
                        </Box>
                      </Box>
                    )
                  })}

                  <Box
                    sx={{
                      mt: "auto",
                      pt: 2,
                      borderTop: "1px solid #f1f5f9",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      Total Geral
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#1e293b",
                        fontSize: "1.8rem",
                      }}
                    >
                      {totalVeiculos + totalMotoristas + totalColetores} recursos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Detalhamento de Serviços */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              fontSize: {
                xs: "1.5rem",
                xl: "1.5rem",
                "2xl": "2rem", // Para TVs
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: alpha(themeColors.purple.main, 0.1),
                border: `1px solid ${alpha(themeColors.purple.main, 0.3)}`,
                mr: 2,
              }}
            >
              <TrendingUp sx={{ color: themeColors.purple.main }} />
            </Box>
            Detalhamento de Serviços
          </Typography>

          {/* Cards para cada PA */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
                xl: "repeat(4, 1fr)",
                "2xl": "repeat(2, 1fr)", // Para TVs, 2 por linha para melhor proporção
              },
              gap: 4,
              mb: 4,
            }}
          >
            {[
              { name: "PA1", data: data.pa1, color: "#3b82f6" },
              { name: "PA2", data: data.pa2, color: "#10b981" },
              { name: "PA3", data: data.pa3, color: "#f59e0b" },
              { name: "PA4", data: data.pa4, color: "#8b5cf6" },
            ].map(({ name, data: paData, color }, index) => {
              const totalVeiculos = paData?.veiculos || 0
              const totalMotoristas = paData?.motoristas || 0
              const totalColetores = paData?.coletores || 0

              // Calcular percentuais dos serviços baseado nos dados da API
              const servicosData = data.contagemPorGaragemEServico?.[name] || {}

              // Somar dados de RSU (maiúsculo e minúsculo)
              const rsuData = servicosData.rsu || servicosData.Rsu || {}
              const seletivaData = servicosData.seletiva || servicosData.Seletiva || {}
              const remocaoData = servicosData.remoção || servicosData.Remoção || {}

              const rsuTotal = (rsuData.veiculos || 0) + (rsuData.motoristas || 0) + (rsuData.coletores || 0)
              const seletivaTotal =
                (seletivaData.veiculos || 0) + (seletivaData.motoristas || 0) + (seletivaData.coletores || 0)
              const remocaoTotal =
                (remocaoData.veiculos || 0) + (remocaoData.motoristas || 0) + (remocaoData.coletores || 0)

              const servicosTotal = rsuTotal + seletivaTotal + remocaoTotal
              const rsuPercent = servicosTotal > 0 ? Math.round((rsuTotal / servicosTotal) * 100) : 0
              const seletivaPercent = servicosTotal > 0 ? Math.round((seletivaTotal / servicosTotal) * 100) : 0
              const remocaoPercent = servicosTotal > 0 ? Math.round((remocaoTotal / servicosTotal) * 100) : 0

              return (
                <Fade in={true} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }} key={name}>
                  <Card
                    sx={{
                      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                      borderRadius: "20px",
                      border: `2px solid ${alpha(color, 0.1)}`,
                      p: 0,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      height: {
                        xs: "280px",
                        xl: "280px",
                        "2xl": "320px", // Para TVs
                      },
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.02)",
                        boxShadow: `0 20px 40px ${alpha(color, 0.2)}`,
                        border: `2px solid ${alpha(color, 0.3)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                      {/* Header da PA */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "14px",
                              background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 2,
                              boxShadow: `0 8px 16px ${alpha(color, 0.3)}`,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 800,
                                color: "#ffffff",
                                fontSize: "1rem",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {name}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: "#1e293b",
                                fontSize: "1.1rem",
                                lineHeight: 1.2,
                              }}
                            >
                              Posto De Apoio
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Métricas principais */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 40,
                              height: 40,
                              borderRadius: "12px",
                              background: alpha("#3b82f6", 0.1),
                              mx: "auto",
                              mb: 1.5,
                              border: `2px solid ${alpha("#3b82f6", 0.2)}`,
                            }}
                          >
                            <LocalShipping sx={{ fontSize: 18, color: "#3b82f6" }} />
                          </Box>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: "#1e293b",
                              fontSize: {
                                xs: "1.8rem",
                                xl: "1.8rem",
                                "2xl": "2.2rem", // Para TVs
                              },
                              lineHeight: 1,
                              mb: 0.5,
                            }}
                          >
                            {totalVeiculos}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#64748b",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Veículos
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: "1px",
                            background: "linear-gradient(180deg, transparent, #e2e8f0, transparent)",
                            mx: 1,
                          }}
                        />

                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 40,
                              height: 40,
                              borderRadius: "12px",
                              background: alpha("#059669", 0.1),
                              mx: "auto",
                              mb: 1.5,
                              border: `2px solid ${alpha("#059669", 0.2)}`,
                            }}
                          >
                            <Person sx={{ fontSize: 18, color: "#059669" }} />
                          </Box>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: "#1e293b",
                              fontSize: {
                                xs: "1.8rem",
                                xl: "1.8rem",
                                "2xl": "2.2rem", // Para TVs
                              },
                              lineHeight: 1,
                              mb: 0.5,
                            }}
                          >
                            {totalMotoristas}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#64748b",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Motoristas
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: "1px",
                            background: "linear-gradient(180deg, transparent, #e2e8f0, transparent)",
                            mx: 1,
                          }}
                        />

                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 40,
                              height: 40,
                              borderRadius: "12px",
                              background: alpha("#f59e0b", 0.1),
                              mx: "auto",
                              mb: 1.5,
                              border: `2px solid ${alpha("#f59e0b", 0.2)}`,
                            }}
                          >
                            <RecyclingOutlined sx={{ fontSize: 18, color: "#f59e0b" }} />
                          </Box>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: "#1e293b",
                              fontSize: {
                                xs: "1.8rem",
                                xl: "1.8rem",
                                "2xl": "2.2rem", // Para TVs
                              },
                              lineHeight: 1,
                              mb: 0.5,
                            }}
                          >
                            {totalColetores}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#64748b",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Coletores
                          </Typography>
                        </Box>
                      </Box>

                      {/* Distribuição por Serviços */}
                      <Box
                        sx={{
                          borderTop: `2px solid ${alpha("#f1f5f9", 0.8)}`,
                          pt: 2.5,
                          mt: "auto",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#64748b",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            mb: 2,
                            display: "block",
                            textAlign: "center",
                          }}
                        >
                          Distribuição por Serviço
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                          <Box sx={{ textAlign: "center", flex: 1, minWidth: "70px" }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                background: alpha("#8b5cf6", 0.1),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 1,
                                border: `2px solid ${alpha("#8b5cf6", 0.2)}`,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 800,
                                  color: "#8b5cf6",
                                  fontSize: "0.7rem",
                                }}
                              >
                                {rsuPercent}%
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#8b5cf6",
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              RSU
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: "center", flex: 1, minWidth: "70px" }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                background: alpha("#10b981", 0.1),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 1,
                                border: `2px solid ${alpha("#10b981", 0.2)}`,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 800,
                                  color: "#10b981",
                                  fontSize: "0.7rem",
                                }}
                              >
                                {seletivaPercent}%
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#10b981",
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Seletiva
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: "center", flex: 1, minWidth: "70px" }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                background: alpha("#f59e0b", 0.1),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 1,
                                border: `2px solid ${alpha("#f59e0b", 0.2)}`,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 800,
                                  color: "#f59e0b",
                                  fontSize: "0.7rem",
                                }}
                              >
                                {remocaoPercent}%
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#f59e0b",
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Remoção
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              )
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
