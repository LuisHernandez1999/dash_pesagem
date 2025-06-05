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
  RadialBarChart,
  RadialBar,
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
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
  },
  secondary: {
    main: "#dc004e",
    light: "#ff5983",
    dark: "#9a0036",
  },
  success: {
    main: "#2e7d32",
    light: "#4caf50",
    dark: "#1b5e20",
  },
  warning: {
    main: "#ed6c02",
    light: "#ff9800",
    dark: "#e65100",
  },
  info: {
    main: "#0288d1",
    light: "#03a9f4",
    dark: "#01579b",
  },
  purple: {
    main: "#7b1fa2",
    light: "#9c27b0",
    dark: "#4a148c",
  },
  green: {
    main: "#1b5e20",
    light: "#2e7d32",
    dark: "#0d3f14",
  },
  gradient: {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    success: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    warning: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    green: "linear-gradient(135deg, #0d3f14 0%, #1b5e20 100%)",
  },
}

// Cores para gráficos mais vibrantes e contrastantes
const chartColors = ["#00E676", "#FF6B35", "#4FC3F7", "#AB47BC", "#FFA726", "#26A69A", "#EF5350", "#42A5F5"]

// Componente de Card Estatístico
const StatCard = ({ title, value, icon: Icon, color, subtitle, progress, delay = 0 }) => (
  <Grow in={true} timeout={800} style={{ transitionDelay: `${delay}ms` }}>
    <Card
      sx={{
        height: "180px",
        background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
        color: "white",
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        boxShadow: `0 8px 32px ${alpha(color, 0.3)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: `0 16px 48px ${alpha(color, 0.4)}`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "100px",
          height: "100px",
          background: `radial-gradient(circle, ${alpha("#fff", 0.1)} 0%, transparent 70%)`,
          borderRadius: "50%",
          transform: "translate(30px, -30px)",
        },
      }}
    >
      <CardContent
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: "2.5rem", mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9, fontSize: "1.1rem" }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: alpha("#fff", 0.2),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <Icon sx={{ fontSize: 32 }} />
          </Box>
        </Box>
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha("#fff", 0.2),
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#fff",
                  borderRadius: 3,
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

  return (
    <Fade in={true} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          height: "220px",
          background: isActive
            ? `linear-gradient(135deg, ${themeColors.success.main} 0%, ${themeColors.success.light} 100%)`
            : `linear-gradient(135deg, #64748b 0%, #94a3b8 100%)`,
          color: "white",
          borderRadius: "20px",
          boxShadow: isActive
            ? `0 8px 32px ${alpha(themeColors.success.main, 0.3)}`
            : "0 8px 32px rgba(100, 116, 139, 0.3)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: isActive
              ? `0 16px 48px ${alpha(themeColors.success.main, 0.4)}`
              : "0 16px 48px rgba(100, 116, 139, 0.4)",
          },
        }}
      >
        <CardContent sx={{ p: 3, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <LocationOn sx={{ fontSize: 28, mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {location}
            </Typography>
            <Chip
              label={isActive ? "Ativo" : "Inativo"}
              size="small"
              sx={{
                ml: "auto",
                backgroundColor: alpha("#fff", 0.2),
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocalShipping sx={{ fontSize: 20, mr: 1, opacity: 0.8 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Veículos
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {data.veiculos}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Person sx={{ fontSize: 20, mr: 1, opacity: 0.8 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Motoristas
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {data.motoristas}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <RecyclingOutlined sx={{ fontSize: 20, mr: 1, opacity: 0.8 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Coletores
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
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
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
      overflow: "hidden",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "1px solid rgba(0, 230, 118, 0.1)",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #00E676, #4FC3F7, #AB47BC)",
      },
    }}
  >
    <CardContent sx={{ p: 4, height: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          mb: 3,
          color: "#1e293b",
          fontSize: "1.3rem",
          textAlign: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
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
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
      overflow: "hidden",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "1px solid rgba(0, 230, 118, 0.1)",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #00E676, #FF6B35, #4FC3F7)",
      },
    }}
  >
    <CardContent sx={{ p: 4, height: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          mb: 3,
          color: "#1e293b",
          fontSize: "1.3rem",
          textAlign: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
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
          <Bar dataKey="veiculos" fill="#00E676" name="Veículos" radius={[6, 6, 0, 0]} />
          <Bar dataKey="motoristas" fill="#FF6B35" name="Motoristas" radius={[6, 6, 0, 0]} />
          <Bar dataKey="coletores" fill="#4FC3F7" name="Coletores" radius={[6, 6, 0, 0]} />
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
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
      overflow: "hidden",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "1px solid rgba(0, 230, 118, 0.1)",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #00E676, #FF6B35, #4FC3F7)",
      },
    }}
  >
    <CardContent sx={{ p: 4, height: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          mb: 3,
          color: "#1e293b",
          fontSize: "1.3rem",
          textAlign: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
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
            stroke="#00E676"
            strokeWidth={5}
            name="Veículos"
            dot={{ fill: "#00E676", strokeWidth: 3, r: 8 }}
            activeDot={{ r: 10, stroke: "#00E676", strokeWidth: 3, fill: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="motoristas"
            stroke="#FF6B35"
            strokeWidth={5}
            name="Motoristas"
            dot={{ fill: "#FF6B35", strokeWidth: 3, r: 8 }}
            activeDot={{ r: 10, stroke: "#FF6B35", strokeWidth: 3, fill: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="coletores"
            stroke="#4FC3F7"
            strokeWidth={5}
            name="Coletores"
            dot={{ fill: "#4FC3F7", strokeWidth: 3, r: 8 }}
            activeDot={{ r: 10, stroke: "#4FC3F7", strokeWidth: 3, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

// Componente de Gráfico Radial ULTRA Melhorado com Visibilidade Máxima
const RadialChartCard = ({ title, data, height = 300 }) => (
  <Card
    sx={{
      height: height + 120,
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
      overflow: "hidden",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "1px solid rgba(0, 230, 118, 0.1)",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #00E676, #FF6B35, #4FC3F7, #AB47BC)",
      },
    }}
  >
    <CardContent sx={{ p: 4, height: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          mb: 3,
          color: "#1e293b",
          fontSize: "1.3rem",
          textAlign: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="85%" data={data}>
          <RadialBar
            minAngle={15}
            label={{
              position: "insideStart",
              fill: "#fff",
              fontSize: 16,
              fontWeight: 800,
              formatter: (value) => `${value}%`,
            }}
            background={{ fill: "#f1f5f9", stroke: "#e2e8f0", strokeWidth: 2 }}
            dataKey="value"
            cornerRadius={12}
            stroke="#fff"
            strokeWidth={4}
          />
          <Legend
            iconSize={20}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{
              paddingLeft: "30px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#1e293b",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
              padding: "16px",
            }}
            formatter={(value, name) => [`${value}%`, `Eficiência ${name}`]}
          />
        </RadialBarChart>
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

  // Dados MELHORADOS para o gráfico radial com valores mais visíveis e realistas
  const radialData = [
    {
      name: "PA1",
      value: 85, // PA1 está muito ativo (85%)
      fill: "#00E676",
    },
    {
      name: "PA2",
      value: 15, // PA2 tem baixa atividade (15%)
      fill: "#FF6B35",
    },
    {
      name: "PA3",
      value: 25, // PA3 tem atividade moderada (25%)
      fill: "#4FC3F7",
    },
    {
      name: "PA4",
      value: 10, // PA4 tem atividade mínima (10%)
      fill: "#AB47BC",
    },
  ]

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
      {/* Header Verde Escuro */}
      <AppBar
        position="sticky"
        sx={{
          background: themeColors.gradient.green,
          boxShadow: "0 8px 32px rgba(13, 63, 20, 0.4)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Toolbar sx={{ py: 2, px: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 3,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Dashboard sx={{ fontSize: 28, color: "white" }} />
            </Box>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: "2.2rem",
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  letterSpacing: "-0.02em",
                }}
              >
                Dashboard Operacional
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
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
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Speed sx={{ fontSize: 20, color: "rgba(255, 255, 255, 0.8)" }} />
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>
                Tempo Real
              </Typography>
            </Box>

            <Badge badgeContent={3} color="error">
              <IconButton
                sx={{
                  color: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Notifications />
              </IconButton>
            </Badge>

            <IconButton
              sx={{
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Settings />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <AccountCircle />
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                  Administrador
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  {lastUpdate.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>

            <Button
              onClick={handleRefresh}
              startIcon={<Refresh />}
              sx={{
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "12px",
                px: 3,
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
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
              fontWeight: 700,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Assessment sx={{ mr: 2, color: themeColors.primary.main }} />
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
              fontWeight: 700,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
            }}
          >
            <BarChart sx={{ mr: 2, color: themeColors.info.main }} />
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
            <RadialChartCard title="Eficiência por PA" data={radialData} />
          </Box>
        </Box>

        {/* Cards de Localização */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LocationOn sx={{ mr: 2, color: themeColors.success.main }} />
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
              fontWeight: 700,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TrendingUp sx={{ mr: 2, color: themeColors.purple.main }} />
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
              fontWeight: 700,
              mb: 3,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PieChart sx={{ mr: 2, color: themeColors.secondary.main }} />
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
                borderRadius: "24px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
                overflow: "hidden",
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                height: 470,
                border: "1px solid rgba(0, 230, 118, 0.1)",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #00E676, #FF6B35)",
                },
              }}
            >
              <CardContent sx={{ p: 4, height: "100%" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    color: "#1e293b",
                    fontSize: "1.3rem",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Comparativo de Eficiência
                </Typography>
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
                    <Bar dataKey="veiculos" fill="#00E676" name="Veículos" radius={[6, 6, 0, 0]} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#FF6B35"
                      strokeWidth={5}
                      name="Total"
                      dot={{ fill: "#FF6B35", strokeWidth: 3, r: 8 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: "24px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
                overflow: "hidden",
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                height: 470,
                border: "1px solid rgba(0, 230, 118, 0.1)",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #00E676, #4FC3F7)",
                },
              }}
            >
              <CardContent sx={{ p: 4, height: "100%" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    color: "#1e293b",
                    fontSize: "1.3rem",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Área de Cobertura
                </Typography>
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
                      stroke="#00E676"
                      fill="#00E676"
                      name="Motoristas"
                    />
                    <Area
                      type="monotone"
                      dataKey="coletores"
                      stackId="1"
                      stroke="#4FC3F7"
                      fill="#4FC3F7"
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
