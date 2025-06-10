"use client"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Box,
  Container,
  IconButton,
  useTheme,
  alpha,
  Chip,
  LinearProgress,
  Fade,
  Grow,
  Avatar,
  Badge,
  Button,
} from "@mui/material"
import {
  LocalShipping,
  Person,
  RecyclingOutlined,
  Refresh,
  LocationOn,
  Assessment,
  TrendingUp,
  Build,
  Notifications,
  Settings,
  Dashboard,
  BarChart,
  PieChart,
  Speed,
  AccountCircle,
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
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Pie,
} from "recharts"

// Dados simulados baseados no JSON fornecido
const mockData = {
  success: true,
  data: {
    PA1: {
      veiculos: 3,
      motoristas: 6,
      coletores: 6,
    },
    PA2: {
      veiculos: 0,
      motoristas: 0,
      coletores: 0,
    },
    PA3: {
      veiculos: 0,
      motoristas: 0,
      coletores: 0,
    },
    PA4: {
      veiculos: 0,
      motoristas: 0,
      coletores: 0,
    },
    contagem_por_garagem_e_servico: {
      PA1: {
        Rsu: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
        Seletiva: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
        Remoção: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
        remoção: {
          veiculos: 1,
          motoristas: 1,
          coletores: 2,
        },
        rsu: {
          veiculos: 1,
          motoristas: 1,
          coletores: 2,
        },
        seletiva: {
          veiculos: 1,
          motoristas: 4,
          coletores: 2,
        },
      },
      PA2: {
        Rsu: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
        Seletiva: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
        Remoção: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
      },
      PA3: {
        Rsu: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
        Seletiva: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
        Remoção: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
      },
      PA4: {
        Rsu: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
        Seletiva: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
        Remoção: {
          veiculos: 0,
          motoristas: 0,
          coletores: 0,
        },
      },
    },
    total_solturas: 6,
    contagem_rsu: 0,
    contagem_seletiva: 0,
    contagem_remocao: 0,
    contagem_equipamentos: 6,
    contagem_equipamentos_rsu: 0,
    contagem_equipamentos_remocao: 0,
    contagem_equipamentos_seletiva: 0,
  },
}

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
  gradient: {
    primary: "linear-gradient(135deg, #374151 0%, #4b5563 100%)",
    secondary: "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)",
    success: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    warning: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
    green: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
  },
}

// Update chart colors to be more professional and colorful
const chartColors = ["#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#22d3ee", "#fb7185", "#a3e635", "#fb923c"]

// Componente de Card Estatístico Melhorado
const StatCard = ({ title, value, icon: Icon, color, subtitle, progress, delay = 0 }) => (
  <Grow in={true} timeout={800} style={{ transitionDelay: `${delay}ms` }}>
    <Card
      sx={{
        height: "200px",
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
                fontSize: "3rem",
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
                fontSize: "1.1rem",
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
              width: 64,
              height: 64,
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
            <Icon sx={{ fontSize: 28, color: color }} />
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

// Componente de Card de Localização
const LocationCard = ({ location, data, delay = 0 }) => {
  const isActive = data.veiculos > 0 || data.motoristas > 0 || data.coletores > 0
  const statusColor = isActive ? "#059669" : "#ef4444"

  return (
    <Fade in={true} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          height: "220px",
          background: "#ffffff",
          color: "#1e293b",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <CardContent sx={{ p: 3, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: alpha(statusColor, 0.1),
                border: "1px solid #e2e8f0",
                mr: 2,
              }}
            >
              <LocationOn sx={{ fontSize: 22, color: statusColor }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b" }}>
              {location}
            </Typography>
            <Chip
              label={isActive ? "Ativo" : "Inativo"}
              size="small"
              sx={{
                ml: "auto",
                backgroundColor: alpha(statusColor, 0.1),
                color: statusColor,
                fontWeight: 600,
                border: `1px solid ${alpha(statusColor, 0.3)}`,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: alpha("#3b82f6", 0.1),
                    border: "1px solid #e2e8f0",
                    mr: 1,
                  }}
                >
                  <LocalShipping sx={{ fontSize: 16, color: "#3b82f6" }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
                  Veículos
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                {data.veiculos}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: alpha("#059669", 0.1),
                    border: "1px solid #e2e8f0",
                    mr: 1,
                  }}
                >
                  <Person sx={{ fontSize: 16, color: "#059669" }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
                  Motoristas
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                {data.motoristas}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: alpha("#f59e0b", 0.1),
                    border: "1px solid #e2e8f0",
                    mr: 1,
                  }}
                >
                  <RecyclingOutlined sx={{ fontSize: 16, color: "#f59e0b" }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
                  Coletores
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                {data.coletores}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )
}

// Componente de Gráfico de Pizza Ultra Melhorado
const PieChartCard = ({ title, data, height = 300 }) => (
  <Card
    sx={{
      height: height + 120,
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
            fontSize: "1.3rem",
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
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

// Componente de Gráfico de Barras Ultra Melhorado
const BarChartCard = ({ title, data, height = 300 }) => (
  <Card
    sx={{
      height: height + 120,
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
            fontSize: "1.3rem",
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

// Componente de Gráfico de Linha Ultra Melhorado
const LineChartCard = ({ title, data, height = 300 }) => (
  <Card
    sx={{
      height: height + 120,
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
            background: alpha("#059669", 0.1),
            border: `1px solid ${alpha("#059669", 0.3)}`,
            mr: 2,
          }}
        >
          <TrendingUp sx={{ fontSize: 20, color: "#059669" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            fontSize: "1.3rem",
          }}
        >
          {title}
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Line
            type="monotone"
            dataKey="veiculos"
            stroke="#60a5fa"
            strokeWidth={5}
            name="Veículos"
            dot={{ fill: "#60a5fa", strokeWidth: 3, r: 8 }}
            activeDot={{ r: 10, stroke: "#60a5fa", strokeWidth: 3, fill: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="motoristas"
            stroke="#34d399"
            strokeWidth={5}
            name="Motoristas"
            dot={{ fill: "#34d399", strokeWidth: 3, r: 8 }}
            activeDot={{ r: 10, stroke: "#34d399", strokeWidth: 3, fill: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="coletores"
            stroke="#fbbf24"
            strokeWidth={5}
            name="Coletores"
            dot={{ fill: "#fbbf24", strokeWidth: 3, r: 8 }}
            activeDot={{ r: 10, stroke: "#fbbf24", strokeWidth: 3, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

// Componente de Gráfico de Barras para Eficiência
const EfficiencyBarChartCard = ({ title, data, height = 300 }) => (
  <Card
    sx={{
      height: height + 120,
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
            fontSize: "1.3rem",
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
          <Bar dataKey="value" fill="#60a5fa" name="Eficiência %" radius={[6, 6, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

export default function FleetDashboard() {
  const theme = useTheme()
  const [data, setData] = useState(mockData.data)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const handleRefresh = () => {
    setLastUpdate(new Date())
  }

  // Calcular totais
  const totalVeiculos = Object.values(data)
    .slice(0, 4)
    .reduce((sum, location) => sum + location.veiculos, 0)
  const totalMotoristas = Object.values(data)
    .slice(0, 4)
    .reduce((sum, location) => sum + location.motoristas, 0)
  const totalColetores = Object.values(data)
    .slice(0, 4)
    .reduce((sum, location) => sum + location.coletores, 0)

  // Preparar dados para gráficos
  const locationData = Object.entries(data)
    .slice(0, 4)
    .map(([name, values]) => ({
      name,
      veiculos: values.veiculos,
      motoristas: values.motoristas,
      coletores: values.coletores,
      total: values.veiculos + values.motoristas + values.coletores,
    }))

  const pieData = [
    { name: "Veículos", value: totalVeiculos },
    { name: "Motoristas", value: totalMotoristas },
    { name: "Coletores", value: totalColetores },
  ]

  // Dados corrigidos para PA1
  const pa1ServiceData = Object.entries(data.contagem_por_garagem_e_servico.PA1)
    .filter(([service, values]) => {
      return values.veiculos > 0 || values.motoristas > 0 || values.coletores > 0
    })
    .map(([name, values]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      veiculos: values.veiculos,
      motoristas: values.motoristas,
      coletores: values.coletores,
      total: values.veiculos + values.motoristas + values.coletores,
    }))

  const pa1PieData = pa1ServiceData.map((item) => ({
    name: item.name,
    value: item.total,
  }))

  // Dados para o gráfico de barras de eficiência
  const efficiencyData = [
    {
      name: "PA1",
      value: 85,
    },
    {
      name: "PA2",
      value: 15,
    },
    {
      name: "PA3",
      value: 25,
    },
    {
      name: "PA4",
      value: 10,
    },
  ]

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fdfdfd" }}>
      {/* Header Verde Escuro */}
      <AppBar
        position="sticky"
        sx={{
          background: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          color: "#1e293b",
        }}
      >
        <Toolbar sx={{ py: 2, px: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "12px",
                background: alpha("#3b82f6", 0.08),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 3,
                border: `2px solid ${alpha("#3b82f6", 0.15)}`,
              }}
            >
              <Dashboard sx={{ fontSize: 28, color: "#3b82f6" }} />
            </Box>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: "2.2rem",
                  color: "#1e293b",
                  letterSpacing: "-0.02em",
                }}
              >
                Dashboard Operacional
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#64748b",
                  fontSize: "1rem",
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Gestão Inteligente de Frota e Recursos
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: "12px",
                background: alpha("#059669", 0.08),
                border: `1px solid ${alpha("#059669", 0.15)}`,
              }}
            >
              <Speed sx={{ fontSize: 20, color: "#059669" }} />
              <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600 }}>
                Tempo Real
              </Typography>
            </Box>

            <Badge badgeContent={3} color="error">
              <IconButton
                sx={{
                  background: alpha("#64748b", 0.08),
                  border: "1px solid #e2e8f0",
                  color: "#64748b",
                  "&:hover": {
                    background: alpha("#f59e0b", 0.15),
                  },
                }}
              >
                <Notifications />
              </IconButton>
            </Badge>

            <IconButton
              sx={{
                background: alpha("#64748b", 0.08),
                border: "1px solid #e2e8f0",
                color: "#64748b",
                "&:hover": {
                  background: alpha("#8b5cf6", 0.15),
                },
              }}
            >
              <Settings />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  color: "#64748b",
                }}
              >
                <AccountCircle />
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>
                  Administrador
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  {lastUpdate.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>

            <Button
              onClick={handleRefresh}
              startIcon={<Refresh />}
              sx={{
                background: alpha("#64748b", 0.08),
                border: "1px solid #e2e8f0",
                color: "#64748b",
                borderRadius: "12px",
                px: 3,
                "&:hover": {
                  background: alpha("#059669", 0.15),
                },
              }}
            >
              Atualizar
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
                background: alpha(themeColors.primary.main, 0.1),
                border: `1px solid ${alpha(themeColors.primary.main, 0.3)}`,
                mr: 2,
              }}
            >
              <Assessment sx={{ color: themeColors.primary.main }} />
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
              progress={75}
              delay={0}
            />
            <StatCard
              title="Total de Motoristas"
              value={totalMotoristas}
              icon={Person}
              color={themeColors.success.main}
              subtitle="Disponíveis"
              progress={85}
              delay={100}
            />
            <StatCard
              title="Total de Coletores"
              value={totalColetores}
              icon={RecyclingOutlined}
              color={themeColors.info.main}
              subtitle="Em campo"
              progress={90}
              delay={200}
            />
            <StatCard
              title="Equipamentos"
              value={data.contagem_equipamentos}
              icon={Build}
              color={themeColors.warning.main}
              subtitle="Ativos"
              progress={60}
              delay={300}
            />
          </Box>
        </Box>

        {/* Gráficos de Visão Geral */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
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
                background: alpha(themeColors.info.main, 0.1),
                border: `1px solid ${alpha(themeColors.info.main, 0.3)}`,
                mr: 2,
              }}
            >
              <BarChart sx={{ color: themeColors.info.main }} />
            </Box>
            Análise Geral
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            <PieChartCard title="Distribuição de Recursos" data={pieData} />
            <BarChartCard title="Recursos por Localização" data={locationData} />
            <EfficiencyBarChartCard title="Eficiência por PA" data={efficiencyData} />
          </Box>
        </Box>

        {/* Cards de Localização */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
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
              <LocationOn sx={{ color: themeColors.success.main }} />
            </Box>
            Status por Localização
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
              mb: 4,
            }}
          >
            {Object.entries(data)
              .slice(0, 4)
              .map(([location, locationData], index) => (
                <LocationCard key={location} location={location} data={locationData} delay={index * 100} />
              ))}
          </Box>

          <LineChartCard title="Tendência de Recursos por Localização" data={locationData} height={300} />
        </Box>

        {/* Detalhamento de Serviços PA1 */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
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
            Detalhamento de Serviços - PA1
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
            <BarChartCard title="Recursos por Serviço - PA1" data={pa1ServiceData} height={350} />
            <PieChartCard title="Distribuição de Serviços - PA1" data={pa1PieData} height={350} />
          </Box>
        </Box>

        {/* Gráficos para outras PAs */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
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
              <PieChart sx={{ color: themeColors.secondary.main }} />
            </Box>
            Análise Comparativa - Todas as PAs
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
            <Card
              sx={{
                height: 470,
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
                    <Assessment sx={{ fontSize: 20, color: "#3b82f6" }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: "1.3rem",
                    }}
                  >
                    Comparativo de Eficiência
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={locationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#34d399"
                      strokeWidth={5}
                      name="Total"
                      dot={{ fill: "#34d399", strokeWidth: 3, r: 8 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card
              sx={{
                height: 470,
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
                    <LocationOn sx={{ fontSize: 20, color: "#8b5cf6" }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: "1.3rem",
                    }}
                  >
                    Área de Cobertura
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={locationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    <Area
                      type="monotone"
                      dataKey="motoristas"
                      stackId="1"
                      stroke="#60a5fa"
                      fill="#60a5fa"
                      name="Motoristas"
                    />
                    <Area
                      type="monotone"
                      dataKey="coletores"
                      stackId="1"
                      stroke="#fbbf24"
                      fill="#fbbf24"
                      name="Coletores"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
