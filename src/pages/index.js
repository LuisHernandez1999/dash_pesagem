"use client"

import { useState, useEffect, useMemo } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Sector,
  LabelList,
  ReferenceLine,
} from "recharts"
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Fade,
  Zoom,
  Grow,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Container,
  LinearProgress,
  Avatar,
  Divider,
} from "@mui/material"
import {
  TrendingUp,
  BarChart as BarChartIcon,
  FilterList,
  ExpandMore,
  LocalShipping as Truck,
  MoreVert,
  Download,
  Print,
  Share,
  RecyclingOutlined,
  Speed,
  EmojiEvents,
  LocalShipping,
  AirportShuttle,
  FireTruck,
  ElectricCar,
  EnergySavingsLeaf as EcoIcon,
  DonutLarge,
  Leaderboard,
  Search,
  DateRange,
  InfoOutlined,
  EmojiTransportation,
  Star,
} from "@mui/icons-material"
import Sidebar from "../components/sidebar"

// Theme colors - can be used in sx props
const themeColors = {
  background: "#ffffff",
  foreground: "#0f172a",
  card: "#ffffff",
  cardForeground: "#0f172a",
  primary: "#0f172a",
  primaryForeground: "#f8fafc",
  secondary: "#f1f5f9",
  secondaryForeground: "#0f172a",
  muted: "#f1f5f9",
  mutedForeground: "#64748b",
  accent: "#f1f5f9",
  accentForeground: "#0f172a",
  destructive: "#ef4444",
  destructiveForeground: "#f8fafc",
  border: "#e2e8f0",
  input: "#e2e8f0",
  ring: "#0f172a",
  radius: "0.5rem",
  chart1: "#10b981",
  chart2: "#f59e0b",
  chart3: "#3b82f6",
  chart4: "#8b5cf6",
  chart5: "#ec4899",
  chart6: "#06b6d4",
}

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
        transform: translateY(20px);
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
  float: `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0px); }
    }
  `,
  progressAnimation: `
    @keyframes progressAnimation {
      0% { width: 0%; }
      100% { width: var(--progress-width); }
    }
  `,
  gradientShift: `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,
  rotate: `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  pieAnimation: `
    @keyframes pieAnimation {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
  barAnimation: `
    @keyframes barAnimation {
      0% { height: 0; y: 300; }
      100% { height: attr(height); y: attr(y); }
    }
  `,
  glowPulse: `
    @keyframes glowPulse {
      0% { filter: drop-shadow(0px 0px 2px rgba(16, 185, 129, 0.3)); }
      50% { filter: drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.6)); }
      100% { filter: drop-shadow(0px 0px 2px rgba(16, 185, 129, 0.3)); }
    }
  `,
  truckDrive: `
    @keyframes truckDrive {
      0% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      100% { transform: translateX(-10px); }
    }
  `,
}

export default function WeighingDashboard() {
  const [period, setPeriod] = useState("month")
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [chartsLoaded, setChartsLoaded] = useState({
    barChart: false,
    pieChart: false,
    lineChart: false,
    radarChart: false,
  })
  const [vehicleFilter, setVehicleFilter] = useState("")
  const [cooperativeFilter, setCooperativeFilter] = useState("")
  const [driverFilter, setDriverFilter] = useState("")
  const [periodMenuAnchor, setPeriodMenuAnchor] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [chartTooltip, setChartTooltip] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [vehicleData, setVehicleData] = useState([
    { type: "Caminhão Compactador", prefix: "CMP-2023", count: 12, avgWeighings: 245, icon: <LocalShipping /> },
    { type: "Caminhão Basculante", prefix: "BSC-2022", count: 8, avgWeighings: 210, icon: <FireTruck /> },
    { type: "Caminhão Carroceria", prefix: "CRR-2021", count: 6, avgWeighings: 180, icon: <AirportShuttle /> },
    { type: "Veículo Utilitário", prefix: "UTL-2023", count: 4, avgWeighings: 120, icon: <ElectricCar /> },
    { type: "Caminhão Baú", prefix: "BAU-2022", count: 3, avgWeighings: 150, icon: <Truck /> },
    { type: "Caminhão Tanque", prefix: "TNQ-2021", count: 2, avgWeighings: 130, icon: <LocalShipping /> },
    { type: "Caminhão Guincho", prefix: "GCH-2023", count: 2, avgWeighings: 110, icon: <Truck /> },
    { type: "Caminhão Plataforma", prefix: "PLT-2022", count: 1, avgWeighings: 95, icon: <LocalShipping /> },
    { type: "Caminhão Cegonha", prefix: "CGN-2021", count: 1, avgWeighings: 85, icon: <Truck /> },
  ])

  // Mock user data for sidebar
  const mockUser = {
    name: "Admin LimpaGyn",
    email: "admin@limpagyn.com.br",
    avatarUrl: "",
  }

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  // Find the vehicle with the highest average weighings
  const topVehicle = useMemo(() => {
    return [...vehicleData].sort((a, b) => b.avgWeighings - a.avgWeighings)[0]
  }, [vehicleData])

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    // Simulate charts loading one by one
    setTimeout(() => setChartsLoaded((prev) => ({ ...prev, barChart: true })), 1500)
    setTimeout(() => setChartsLoaded((prev) => ({ ...prev, pieChart: true })), 2000)
    setTimeout(() => setChartsLoaded((prev) => ({ ...prev, lineChart: true })), 2500)
    setTimeout(() => setChartsLoaded((prev) => ({ ...prev, radarChart: true })), 3000)

    return () => clearTimeout(timer)
  }, [])

  // Sample data - in a real app, this would come from an API or database
  const efficiencyData = {
    target: 2601,
    current: 2450,
    percentage: 94.2,
  }

  const driversData = [
    { id: 1, name: "Carlos Silva", weighings: 342, efficiency: 98.2, avatar: "CS" },
    { id: 2, name: "João Oliveira", weighings: 315, efficiency: 95.7, avatar: "JO" },
    { id: 3, name: "Marcos Santos", weighings: 301, efficiency: 94.3, avatar: "MS" },
    { id: 4, name: "Pedro Lima", weighings: 287, efficiency: 92.1, avatar: "PL" },
    { id: 5, name: "Antonio Souza", weighings: 265, efficiency: 89.8, avatar: "AS" },
    { id: 6, name: "Ricardo Pereira", weighings: 243, efficiency: 87.5, avatar: "RP" },
    { id: 7, name: "José Ferreira", weighings: 221, efficiency: 85.2, avatar: "JF" },
    { id: 8, name: "Paulo Costa", weighings: 198, efficiency: 82.9, avatar: "PC" },
  ]

  const lowestDriversData = [
    { id: 9, name: "Miguel Alves", weighings: 156, efficiency: 76.4, avatar: "MA" },
    { id: 10, name: "Fernando Dias", weighings: 142, efficiency: 72.1, avatar: "FD" },
    { id: 11, name: "Eduardo Gomes", weighings: 128, efficiency: 68.7, avatar: "EG" },
  ]

  const cooperativesData = [
    { rank: 1, name: "Cooperativa Recicla Vida", weighings: 1250, percentage: 28.1 },
    { rank: 2, name: "Cooperativa EcoSol", weighings: 980, percentage: 22.0 },
    { rank: 3, name: "Cooperativa Reciclagem Verde", weighings: 850, percentage: 19.1 },
    { rank: 4, name: "Cooperativa Futuro Limpo", weighings: 720, percentage: 16.2 },
    { rank: 5, name: "Cooperativa Recicla Cidadão", weighings: 650, percentage: 14.6 },
    { rank: 6, name: "Cooperativa Mãos que Reciclam", weighings: 520, percentage: 11.7 },
    { rank: 7, name: "Cooperativa Reciclando o Futuro", weighings: 480, percentage: 10.8 },
    { rank: 8, name: "Cooperativa Amigos do Meio Ambiente", weighings: 420, percentage: 9.4 },
    { rank: 9, name: "Cooperativa Recicla Já", weighings: 380, percentage: 8.5 },
    { rank: 10, name: "Cooperativa Planeta Verde", weighings: 350, percentage: 7.9 },
  ]

  // Enhanced monthly data with additional metrics for all 12 months
  const monthlyData = [
    { month: "Jan", seletiva: 850, cataTreco: 350, total: 1200, meta: 1100, eficiencia: 109.1 },
    { month: "Fev", seletiva: 920, cataTreco: 380, total: 1300, meta: 1150, eficiencia: 113.0 },
    { month: "Mar", seletiva: 880, cataTreco: 400, total: 1280, meta: 1200, eficiencia: 106.7 },
    { month: "Abr", seletiva: 950, cataTreco: 420, total: 1370, meta: 1250, eficiencia: 109.6 },
    { month: "Mai", seletiva: 1020, cataTreco: 450, total: 1470, meta: 1300, eficiencia: 113.1 },
    { month: "Jun", seletiva: 980, cataTreco: 430, total: 1410, meta: 1350, eficiencia: 104.4 },
    { month: "Jul", seletiva: 1050, cataTreco: 460, total: 1510, meta: 1400, eficiencia: 107.9 },
    { month: "Ago", seletiva: 1100, cataTreco: 480, total: 1580, meta: 1450, eficiencia: 109.0 },
    { month: "Set", seletiva: 1030, cataTreco: 470, total: 1500, meta: 1500, eficiencia: 100.0 },
    { month: "Out", seletiva: 1080, cataTreco: 490, total: 1570, meta: 1550, eficiencia: 101.3 },
    { month: "Nov", seletiva: 1150, cataTreco: 510, total: 1660, meta: 1600, eficiencia: 103.8 },
    { month: "Dez", seletiva: 1200, cataTreco: 550, total: 1750, meta: 1650, eficiencia: 106.1 },
  ]

  // Calculate totals for Seletiva and Cata Treco
  const totalSeletiva = monthlyData.reduce((sum, item) => sum + item.seletiva, 0)
  const totalCataTreco = monthlyData.reduce((sum, item) => sum + item.cataTreco, 0)
  const totalWeighings = totalSeletiva + totalCataTreco

  const vehiclePerformanceData = [
    { vehicle: "Compactador", efficiency: 92, maintenance: 85, fuel: 78, availability: 95, weighings: 245 },
    { vehicle: "Basculante", efficiency: 88, maintenance: 80, fuel: 82, availability: 90, weighings: 210 },
    { vehicle: "Carroceria", efficiency: 85, maintenance: 75, fuel: 90, availability: 88, weighings: 180 },
    { vehicle: "Utilitário", efficiency: 80, maintenance: 90, fuel: 95, availability: 85, weighings: 120 },
  ]

  // Enhanced colors with gradients for pie chart
  const PIE_COLORS = [
    { start: "#10b981", end: "#059669" }, // Green gradient
    { start: "#3b82f6", end: "#1d4ed8" }, // Blue gradient
    { start: "#f59e0b", end: "#d97706" }, // Amber gradient
    { start: "#8b5cf6", end: "#7c3aed" }, // Purple gradient
    { start: "#ec4899", end: "#be185d" }, // Pink gradient
  ]

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"]

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handlePeriodMenuOpen = (event) => {
    setPeriodMenuAnchor(event.currentTarget)
  }

  const handlePeriodMenuClose = () => {
    setPeriodMenuAnchor(null)
  }

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod)
    setPeriodMenuAnchor(null)
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    // Get the gradient for the active slice
    const index = cooperativesData.findIndex((item) => item.name === payload.name)
    const gradientStart = PIE_COLORS[index % PIE_COLORS.length].start
    const gradientEnd = PIE_COLORS[index % PIE_COLORS.length].end

    return (
      <g>
        <defs>
          <linearGradient id={`colorActive${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientStart} stopOpacity={1} />
            <stop offset="100%" stopColor={gradientEnd} stopOpacity={1} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={`url(#colorActive${index})`}
          filter="url(#glow)"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 8}
          outerRadius={outerRadius + 14}
          fill={gradientStart}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={gradientStart} fill="none" strokeWidth={2} />
        <circle cx={ex} cy={ey} r={2} fill={gradientStart} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333333"
          style={{ fontWeight: 600, fontSize: 16, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
        >
          {payload.name.split(" ")[1]}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={20}
          textAnchor={textAnchor}
          fill="#666666"
          style={{ fontSize: 14 }}
        >
          {`${value} pesagens (${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    )
  }

  // Enhanced tooltip for bar chart with better styling and more information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = monthlyData.find((item) => item.month === label)
      const total = data.total
      const meta = data.meta
      const eficiencia = data.eficiencia

      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: "none",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            animation: "fadeIn 0.2s ease-out",
            maxWidth: "280px",
            transition: "all 0.2s ease",
            position: "relative",
            "&:before": {
              content: "''",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #10b981, #3b82f6)",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              marginBottom: "0.75rem",
              color: "#1e293b",
              borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
              paddingBottom: "0.5rem",
            }}
          >
            {`${label} - ${total} Pesagens`}
          </Typography>

          {payload.map((entry, index) => (
            <Box
              key={`item-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "4px",
                    marginRight: "0.75rem",
                    backgroundColor: entry.color,
                    boxShadow: `0 0 6px ${entry.color}80`,
                  }}
                />
                <Typography sx={{ color: "#475569", fontWeight: 500 }}>{entry.name}:</Typography>
              </Box>
              <Typography sx={{ fontWeight: 600, color: "#334155" }}>{entry.value}</Typography>
            </Box>
          ))}

          <Box sx={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(226, 232, 240, 0.8)" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <Typography sx={{ color: "#475569", fontWeight: 500, fontSize: "0.875rem" }}>Meta:</Typography>
              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "0.875rem" }}>{meta}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ color: "#475569", fontWeight: 500, fontSize: "0.875rem" }}>Eficiência:</Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: eficiencia >= 100 ? "#10b981" : "#ef4444",
                }}
              >
                {eficiencia}%
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }
    return null
  }

  // Enhanced tooltip for pie chart
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const color = data.payload.fill || "#10b981"

      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: `2px solid ${color}`,
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            animation: "fadeIn 0.3s ease-out",
            maxWidth: "280px",
            transition: "all 0.3s ease",
            position: "relative",
            "&:before": {
              content: "''",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${color}, ${color}80)`,
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              marginBottom: "0.5rem",
              color: "#1e293b",
            }}
          >
            {data.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "#64748b",
              }}
            >
              Total de Pesagens:
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: "#334155",
              }}
            >
              {data.value}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "#64748b",
              }}
            >
              Porcentagem:
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: color,
              }}
            >
              {`${(data.payload.percentage).toFixed(1)}%`}
            </Typography>
          </Box>
        </Box>
      )
    }
    return null
  }

  // Custom legend for pie chart
  const renderLegend = (props) => {
    const { payload } = props

    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.75rem",
          marginTop: "1rem",
        }}
      >
        {payload.map((entry, index) => {
          const gradientStart = PIE_COLORS[index % PIE_COLORS.length].start
          const gradientEnd = PIE_COLORS[index % PIE_COLORS.length].end

          return (
            <Box
              key={`legend-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                padding: "0.25rem 0.5rem",
                borderRadius: "6px",
                "&:hover": {
                  backgroundColor: "rgba(241, 245, 249, 0.7)",
                },
              }}
              onClick={() => setActiveIndex(index)}
            >
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "4px",
                  marginRight: "0.5rem",
                  background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
                  boxShadow:
                    activeIndex === index ? `0 0 0 2px rgba(255,255,255,0.8), 0 0 0 4px ${gradientStart}40` : "none",
                  transition: "all 0.2s ease",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: activeIndex === index ? 600 : 400,
                  color: activeIndex === index ? "#334155" : "#64748b",
                  transition: "all 0.2s ease",
                }}
              >
                {entry.value.split(" ")[1]}
              </Typography>
            </Box>
          )
        })}
      </Box>
    )
  }

  // Enhanced custom bar chart legend
  const CustomBarChartLegend = (props) => {
    const { payload } = props

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          marginTop: "0.5rem",
          padding: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {payload.map((entry, index) => {
          const color = entry.color
          const isSelectiva = entry.value === "seletiva"

          return (
            <Box
              key={`legend-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                backgroundColor: "rgba(241, 245, 249, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(241, 245, 249, 0.9)",
                  transform: "translateY(-2px)",
                  boxShadow: "245,249,0.9)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              <Box
                sx={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "4px",
                  marginRight: "0.75rem",
                  background: isSelectiva
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #f59e0b, #d97706)",
                  boxShadow: `0 2px 6px ${color}40`,
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: isSelectiva ? "#10b981" : "#f59e0b",
                }}
              >
                {isSelectiva ? "Seletiva" : "Cata Treco"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#334155",
                  marginLeft: "0.5rem",
                }}
              >
                {isSelectiva ? `${totalSeletiva}` : `${totalCataTreco}`}
              </Typography>
            </Box>
          )
        })}
      </Box>
    )
  }

  // Custom label for bar chart
  const renderCustomBarLabel = (props) => {
    const { x, y, width, height, value } = props
    return (
      <text
        x={x + width / 2}
        y={y - 6}
        fill="#334155"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="600"
      >
        {value}
      </text>
    )
  }

  const getStatusChip = (efficiency) => {
    if (efficiency > 90) {
      return (
        <Chip
          label="Excelente"
          sx={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            fontWeight: 600,
            borderRadius: "20px",
            transition: "all 0.3s ease",
            animation: "pulse 2s infinite ease-in-out",
            boxShadow: "0 2px 10px rgba(16, 185, 129, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              boxShadow: "0 2px 15px rgba(16, 185, 129, 0.3)",
            },
          }}
        />
      )
    } else if (efficiency > 80) {
      return (
        <Chip
          label="Bom"
          sx={{
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            color: "#f59e0b",
            fontWeight: 600,
            borderRadius: "20px",
            transition: "all 0.3s ease",
            animation: "pulse 2s infinite ease-in-out",
            boxShadow: "0 2px 10px rgba(245, 158, 11, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              boxShadow: "0 2px 15px rgba(245, 158, 11, 0.3)",
            },
          }}
        />
      )
    } else {
      return (
        <Chip
          label="Precisa Melhorar"
          sx={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            fontWeight: 600,
            borderRadius: "20px",
            transition: "all 0.3s ease",
            animation: "pulse 2s infinite ease-in-out",
            boxShadow: "0 2px 10px rgba(239, 68, 68, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              boxShadow: "0 2px 15px rgba(239, 68, 68, 0.3)",
            },
          }}
        />
      )
    }
  }

  // Filter functions
  const filteredVehicleData = vehicleData.filter((vehicle) =>
    vehicle.type.toLowerCase().includes(vehicleFilter.toLowerCase()),
  )

  const filteredCooperativesData = cooperativesData.filter((coop) =>
    coop.name.toLowerCase().includes(cooperativeFilter.toLowerCase()),
  )

  const filteredDriversData = driversData.filter((driver) =>
    driver.name.toLowerCase().includes(driverFilter.toLowerCase()),
  )

  const filteredLowestDriversData = lowestDriversData.filter((driver) =>
    driver.name.toLowerCase().includes(driverFilter.toLowerCase()),
  )

  const filteredAllDriversData = [...driversData, ...lowestDriversData].filter((driver) =>
    driver.name.toLowerCase().includes(driverFilter.toLowerCase()),
  )

  // Get total counts for table headers
  const totalDrivers = filteredAllDriversData.length
  const totalVehicles = filteredVehicleData.length
  const totalCooperatives = filteredCooperativesData.length

  // Get current data based on selected tab
  const currentDriversData =
    tabValue === 0
      ? filteredDriversData.slice(0, 5)
      : tabValue === 1
        ? filteredLowestDriversData
        : filteredAllDriversData

  // Truck SVG for the top vehicle card
  const TruckSVG = () => (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))",
        animation: "truckDrive 4s infinite ease-in-out",
      }}
    >
      <rect x="10" y="35" width="50" height="15" rx="2" fill="#10b981" />
      <rect x="60" y="35" width="25" height="15" rx="2" fill="#059669" />
      <rect x="15" y="25" width="30" height="10" rx="2" fill="#059669" />
      <circle cx="25" cy="50" r="6" fill="#334155" />
      <circle cx="25" cy="50" r="3" fill="#f8fafc" />
      <circle cx="70" cy="50" r="6" fill="#334155" />
      <circle cx="70" cy="50" r="3" fill="#f8fafc" />
      <rect x="60" y="30" width="5" height="5" rx="1" fill="#f8fafc" />
    </svg>
  )

  return (
    <>
      <style>
        {`
          ${keyframes.fadeIn}
          ${keyframes.slideInUp}
          ${keyframes.pulse}
          ${keyframes.float}
          ${keyframes.progressAnimation}
          ${keyframes.gradientShift}
          ${keyframes.rotate}
          ${keyframes.pieAnimation}
          ${keyframes.shimmer}
          ${keyframes.barAnimation}
          ${keyframes.glowPulse}
          ${keyframes.truckDrive}
        `}
      </style>
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar onCollapse={handleSidebarCollapse} user={mockUser} />

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            animation: "fadeIn 0.5s ease-in-out",
            backgroundColor: themeColors.background,
            marginLeft: sidebarCollapsed ? "80px" : "280px",
            width: "calc(100% - " + (sidebarCollapsed ? "80px" : "280px") + ")",
            transition: "all 0.3s ease",
          }}
        >
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: `${themeColors.card} !important`,
              color: `${themeColors.cardForeground} !important`,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05) !important",
              position: "relative",
              zIndex: 10,
              transition: "all 0.3s ease",
              "&:after": {
                content: "''",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)",
                backgroundSize: "200% 200%",
                animation: "gradientShift 5s ease infinite",
                zIndex: 1,
              },
            }}
          >
            <Toolbar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.8rem",
                  background: "linear-gradient(90deg, #10b981, #3b82f6)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                }}
              >
                <EcoIcon
                  sx={{
                    color: "#10b981",
                    animation: "float 3s infinite ease-in-out",
                    fontSize: "2.2rem",
                  }}
                />
                Dashboard de Pesagens
              </Typography>
            </Toolbar>
          </AppBar>

          <Box
            component="main"
            sx={{
              flex: 1,
              padding: "1.5rem",
            }}
          >
            <Container maxWidth="xl" disableGutters>
              <Box sx={{ display: "grid", gap: "1.5rem" }}>
                {/* Efficiency Section */}
                <Box component="section">
                  <Box
                    sx={{
                      display: "grid",
                      gap: "1.5rem",
                      gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                      },
                    }}
                  >
                    <Fade in={!loading} timeout={500}>
                      <Card
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "16px !important",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05) !important",
                          transition: "all 0.3s ease !important",
                          animation: "slideInUp 0.5s ease-out forwards",
                          opacity: 0,
                          animationDelay: "0s",
                          borderLeft: "4px solid #10b981 !important",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1) !important",
                          },
                          "&::before": {
                            content: "''",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
                            pointerEvents: "none",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              marginBottom: "0.25rem",
                              color: "#334155",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "28px",
                                height: "28px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                color: "#10b981",
                              }}
                            >
                              <Speed />
                            </Box>
                            Meta de Eficiência
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: themeColors.mutedForeground,
                              fontSize: "0.75rem",
                            }}
                          >
                            Toneladas alvo vs. atual
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: "0.75rem",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h4"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "1.75rem",
                                  lineHeight: 1.2,
                                  marginBottom: "0.25rem",
                                  background: "linear-gradient(90deg, #059669, #10b981)",
                                  backgroundClip: "text",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  letterSpacing: "-0.5px",
                                }}
                              >
                                {efficiencyData.current} ton
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: themeColors.mutedForeground,
                                  fontSize: "0.75rem",
                                }}
                              >
                                Meta: {efficiencyData.target} ton
                              </Typography>
                            </Box>
                            <Chip
                              icon={<TrendingUp fontSize="small" />}
                              label={`${efficiencyData.percentage}%`}
                              sx={{
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                color: "#10b981",
                                fontWeight: 600,
                                borderRadius: "20px",
                                transition: "all 0.3s ease",
                                animation: "pulse 2s infinite ease-in-out",
                                boxShadow: "0 2px 10px rgba(16, 185, 129, 0.2)",
                                "&:hover": {
                                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                                  boxShadow: "0 2px 15px rgba(16, 185, 129, 0.3)",
                                },
                              }}
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={efficiencyData.percentage}
                            sx={{
                              marginTop: "1rem",
                              height: "8px !important",
                              borderRadius: "9999px",
                              backgroundColor: "rgba(241, 245, 249, 0.7) !important",
                              overflow: "hidden",
                              boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
                              "& .MuiLinearProgress-bar": {
                                background: "linear-gradient(90deg, #059669, #10b981) !important",
                                "--progress-width": "94.2%",
                                animation: "progressAnimation 1.5s ease-out forwards",
                              },
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Fade>

                    <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                      <Card
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "16px !important",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05) !important",
                          transition: "all 0.3s ease !important",
                          animation: "slideInUp 0.5s ease-out forwards",
                          opacity: 0,
                          animationDelay: "calc(1 * 0.1s)",
                          borderLeft: "4px solid #3b82f6 !important",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1) !important",
                          },
                          "&::before": {
                            content: "''",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
                            pointerEvents: "none",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              marginBottom: "0.25rem",
                              color: "#334155",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "28px",
                                height: "28px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                                color: "#3b82f6",
                              }}
                            >
                              <RecyclingOutlined />
                            </Box>
                            Total de Pesagens
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: themeColors.mutedForeground,
                              fontSize: "0.75rem",
                            }}
                          >
                            Seletiva e Cata Treco
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              fontSize: "1.75rem",
                              lineHeight: 1.2,
                              marginBottom: "0.25rem",
                              marginTop: "0.75rem",
                              background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            {totalWeighings}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#64748b",
                              fontSize: "0.75rem",
                              marginTop: "0.25rem",
                            }}
                          >
                            Número total de pesagens realizadas no período atual.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>

                    <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                      <Card
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "16px !important",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05) !important",
                          transition: "all 0.3s ease !important",
                          animation: "slideInUp 0.5s ease-out forwards",
                          opacity: 0,
                          animationDelay: "calc(2 * 0.1s)",
                          borderLeft: "4px solid #10b981 !important",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1) !important",
                          },
                          "&::before": {
                            content: "''",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
                            pointerEvents: "none",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              marginBottom: "0.25rem",
                              color: "#334155",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "28px",
                                height: "28px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                color: "#10b981",
                              }}
                            >
                              <RecyclingOutlined />
                            </Box>
                            Total de Seletiva
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: themeColors.mutedForeground,
                              fontSize: "0.75rem",
                            }}
                          >
                            Coleta seletiva
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              fontSize: "1.75rem",
                              lineHeight: 1.2,
                              marginBottom: "0.25rem",
                              marginTop: "0.75rem",
                              background: "linear-gradient(90deg, #059669, #10b981)",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            {totalSeletiva}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#059669",
                              fontSize: "0.75rem",
                              marginTop: "0.25rem",
                            }}
                          >
                            Total de coletas seletivas para reciclagem.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>

                    <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                      <Card
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "16px !important",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05) !important",
                          transition: "all 0.3s ease !important",
                          animation: "slideInUp 0.5s ease-out forwards",
                          opacity: 0,
                          animationDelay: "calc(3 * 0.1s)",
                          borderLeft: "4px solid #f59e0b !important",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1) !important",
                          },
                          "&::before": {
                            content: "''",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
                            pointerEvents: "none",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              marginBottom: "0.25rem",
                              color: "#334155",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "28px",
                                height: "28px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(245, 158, 11, 0.1)",
                                color: "#f59e0b",
                              }}
                            >
                              <LocalShipping />
                            </Box>
                            Total de Cata Treco
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: themeColors.mutedForeground,
                              fontSize: "0.75rem",
                            }}
                          >
                            Coleta de volumosos
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              fontSize: "1.75rem",
                              lineHeight: 1.2,
                              marginBottom: "0.25rem",
                              marginTop: "0.75rem",
                              background: "linear-gradient(90deg, #d97706, #f59e0b)",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            {totalCataTreco}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#d97706",
                              fontSize: "0.75rem",
                              marginTop: "0.25rem",
                            }}
                          >
                            Total de coletas de materiais volumosos descartados.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Box>
                </Box>

                {/* Enhanced Bar Chart Section */}
                <Box component="section" sx={{ marginTop: "1.5rem" }}>
                  <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "400ms" : "0ms" }}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: "16px !important",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08) !important",
                        transition: "all 0.3s ease !important",
                        animation: "slideInUp 0.6s ease-out forwards",
                        opacity: 0,
                        animationDelay: "0.4s",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12) !important",
                        },
                        background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        willChange: "transform, opacity", // Fix for flickering
                      }}
                    >
                      <CardHeader
                        title={
                          <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <Box
                              sx={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                              }}
                            >
                              <BarChartIcon
                                sx={{
                                  color: "white",
                                  fontSize: "1.4rem",
                                  animation: "pulse 3s infinite ease-in-out",
                                }}
                              />
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "1.25rem",
                                  background: "linear-gradient(90deg, #10b981, #3b82f6)",
                                  backgroundClip: "text",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  letterSpacing: "-0.02em",
                                }}
                              >
                                Comparativo de Pesagens
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "0.85rem",
                                  color: "#64748b",
                                  fontWeight: 500,
                                }}
                              >
                                Análise mensal de Seletiva vs. Cata Treco
                              </Typography>
                            </Box>
                          </Box>
                        }
                        action={
                          <Box sx={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<InfoOutlined />}
                              sx={{
                                height: "2.2rem",
                                textTransform: "none",
                                borderRadius: "10px",
                                transition: "all 0.3s ease",
                                fontWeight: 500,
                                padding: "0 1rem",
                                borderColor: "rgba(226, 232, 240, 0.8)",
                                color: "#64748b",
                                "&:hover": {
                                  backgroundColor: "rgba(241, 245, 249, 0.8)",
                                  borderColor: "rgba(148, 163, 184, 0.5)",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              Detalhes
                            </Button>
                            <IconButton
                              sx={{
                                color: "#64748b",
                                transition: "all 0.2s ease",
                                backgroundColor: "rgba(241, 245, 249, 0.5)",
                                "&:hover": {
                                  color: "#3b82f6",
                                  transform: "rotate(15deg)",
                                  backgroundColor: "rgba(241, 245, 249, 0.8)",
                                },
                              }}
                            >
                              <Download />
                            </IconButton>
                          </Box>
                        }
                        sx={{
                          paddingBottom: "0.75rem",
                          borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                          "& .MuiCardHeader-title": {
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            color: "#334155",
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
                            height: "400px",
                            position: "relative",
                          }}
                        >
                          {!chartsLoaded.barChart && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "rgba(255, 255, 255, 0.7)",
                                zIndex: 10,
                                borderRadius: "12px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  background: "linear-gradient(135deg, #10b981, #3b82f6)",
                                  backgroundSize: "200% 200%",
                                  animation: "gradientShift 2s ease infinite, rotate 1.5s linear infinite",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                  "&::before": {
                                    content: "''",
                                    position: "absolute",
                                    top: "15px",
                                    left: "15px",
                                    right: "15px",
                                    bottom: "15px",
                                    background: "white",
                                    borderRadius: "50%",
                                    boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.05)",
                                  },
                                }}
                              />
                            </Box>
                          )}
                          <Fade in={chartsLoaded.barChart} timeout={800}>
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                animation: "fadeIn 0.8s ease-out forwards",
                                willChange: "transform, opacity", // Fix for flickering
                              }}
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={monthlyData}
                                  margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
                                  barGap={8}
                                  barCategoryGap={30}
                                >
                                  <defs>
                                    <linearGradient id="colorSeletiva" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="colorCataTreco" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                                    </linearGradient>
                                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                      <feDropShadow
                                        dx="0"
                                        dy="2"
                                        stdDeviation="3"
                                        floodColor="#000"
                                        floodOpacity="0.1"
                                      />
                                    </filter>
                                    <filter id="glow1">
                                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                      <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                      </feMerge>
                                    </filter>
                                    <filter id="glow2">
                                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                      <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                      </feMerge>
                                    </filter>
                                  </defs>
                                  <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="3 3"
                                    stroke="#e2e8f0"
                                    strokeOpacity={0.8}
                                  />
                                  <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                                    tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                  />
                                  <YAxis
                                    tickLine={false}
                                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                                    tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
                                    tickFormatter={(value) => `${value}`}
                                    dx={-10}
                                  />
                                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(241, 245, 249, 0.5)" }} />
                                  <Legend
                                    content={<CustomBarChartLegend />}
                                    verticalAlign="bottom"
                                    wrapperStyle={{ paddingTop: 20 }}
                                  />
                                  <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1} />
                                  <Bar
                                    dataKey="seletiva"
                                    fill="url(#colorSeletiva)"
                                    radius={[6, 6, 0, 0]}
                                    name="Seletiva"
                                    animationDuration={1800}
                                    animationEasing="ease-out"
                                    filter="url(#shadow)"
                                    barSize={36}
                                    onMouseOver={() => setChartTooltip("seletiva")}
                                    onMouseOut={() => setChartTooltip(null)}
                                    style={{
                                      filter: chartTooltip === "seletiva" ? "url(#glow1)" : "none",
                                      transition: "filter 0.3s ease",
                                    }}
                                  >
                                    <LabelList
                                      dataKey="seletiva"
                                      position="top"
                                      content={renderCustomBarLabel}
                                      fill="#10b981"
                                    />
                                  </Bar>
                                  <Bar
                                    dataKey="cataTreco"
                                    fill="url(#colorCataTreco)"
                                    radius={[6, 6, 0, 0]}
                                    name="Cata Treco"
                                    animationDuration={1800}
                                    animationEasing="ease-out"
                                    animationBegin={300}
                                    filter="url(#shadow)"
                                    barSize={36}
                                    onMouseOver={() => setChartTooltip("cataTreco")}
                                    onMouseOut={() => setChartTooltip(null)}
                                    style={{
                                      filter: chartTooltip === "cataTreco" ? "url(#glow2)" : "none",
                                      transition: "filter 0.3s ease",
                                    }}
                                  >
                                    <LabelList
                                      dataKey="cataTreco"
                                      position="top"
                                      content={renderCustomBarLabel}
                                      fill="#f59e0b"
                                    />
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </Box>
                          </Fade>
                        </Box>

                        <Box
                          sx={{
                            marginTop: "1rem",
                            display: "flex",
                            justifyContent: "center",
                            padding: "1rem",
                            borderTop: "1px dashed rgba(226, 232, 240, 0.8)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1.5rem",
                              flexWrap: "wrap",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                padding: "0.5rem 1rem",
                                borderRadius: "10px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "3px",
                                  background: "linear-gradient(135deg, #10b981, #059669)",
                                }}
                              />
                              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#10b981" }}>
                                Seletiva: {totalSeletiva} (
                                {((totalSeletiva / (totalSeletiva + totalCataTreco)) * 100).toFixed(1)}%)
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                backgroundColor: "rgba(245, 158, 11, 0.1)",
                                padding: "0.5rem 1rem",
                                borderRadius: "10px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "3px",
                                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                }}
                              />
                              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#f59e0b" }}>
                                Cata Treco: {totalCataTreco} (
                                {((totalCataTreco / (totalSeletiva + totalCataTreco)) * 100).toFixed(1)}%)
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                                padding: "0.5rem 1rem",
                                borderRadius: "10px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "3px",
                                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                                }}
                              />
                              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#3b82f6" }}>
                                Total: {totalSeletiva + totalCataTreco}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Box>

                {/* Charts Section */}
                <Box component="section" sx={{ marginTop: "1.5rem" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gap: "1.5rem",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, 1fr)",
                      },
                    }}
                  >
                    {/* Pie Chart */}
                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
                      <Card
                        sx={{
                          height: "100%",
                          minHeight: "500px",
                          borderRadius: "16px !important",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05) !important",
                          transition: "all 0.3s ease !important",
                          animation: "slideInUp 0.6s ease-out forwards",
                          opacity: 0,
                          animationDelay: "0.4s",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1) !important",
                          },
                          position: "relative",
                          "&::after": {
                            content: "''",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "100%",
                            background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)",
                            opacity: 0.1,
                            pointerEvents: "none",
                          },
                          willChange: "transform, opacity", // Fix for flickering
                        }}
                      >
                        <CardHeader
                          title={
                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <DonutLarge
                                sx={{
                                  color: "#10b981",
                                  animation: "pulse 3s infinite ease-in-out",
                                }}
                              />
                              Cooperativas com Mais Pesagens
                            </Box>
                          }
                          subheader="Top 5 cooperativas por volume de coleta"
                          action={
                            <Box>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#64748b",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    color: "#10b981",
                                    transform: "rotate(15deg)",
                                  },
                                }}
                              >
                                <Print />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#64748b",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    color: "#3b82f6",
                                    transform: "scale(1.1)",
                                  },
                                }}
                              >
                                <Share />
                              </IconButton>
                            </Box>
                          }
                          sx={{
                            paddingBottom: "0.5rem",
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                            background: "linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))",
                            "& .MuiCardHeader-title": {
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#334155",
                            },
                            "& .MuiCardHeader-subheader": {
                              fontSize: "0.75rem",
                            },
                            "& .MuiCardHeader-action": {
                              margin: 0,
                            },
                          }}
                        />
                        <CardContent
                          sx={{
                            padding: "1rem",
                            "&:last-child": {
                              paddingBottom: "1rem",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              aspectRatio: "16/12",
                              padding: "0",
                              position: "relative",
                            }}
                          >
                            {!chartsLoaded.pieChart && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                                  zIndex: 10,
                                  borderRadius: "12px",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #10b981, #3b82f6)",
                                    backgroundSize: "200% 200%",
                                    animation: "gradientShift 2s ease infinite, rotate 1.5s linear infinite",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                    "&::before": {
                                      content: "''",
                                      position: "absolute",
                                      top: "15px",
                                      left: "15px",
                                      right: "15px",
                                      bottom: "15px",
                                      background: "white",
                                      borderRadius: "50%",
                                      boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.05)",
                                    },
                                  }}
                                />
                              </Box>
                            )}
                            <Fade in={chartsLoaded.pieChart} timeout={800}>
                              <Box
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  animation: "pieAnimation 0.8s ease-out forwards",
                                }}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <defs>
                                      {PIE_COLORS.map((color, index) => (
                                        <linearGradient
                                          key={`color${index}`}
                                          id={`color${index}`}
                                          x1="0"
                                          y1="0"
                                          x2="0"
                                          y2="1"
                                        >
                                          <stop offset="0%" stopColor={color.start} stopOpacity={1} />
                                          <stop offset="100%" stopColor={color.end} stopOpacity={1} />
                                        </linearGradient>
                                      ))}
                                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow
                                          dx="0"
                                          dy="0"
                                          stdDeviation="3"
                                          floodColor="#000"
                                          floodOpacity="0.1"
                                        />
                                      </filter>
                                    </defs>
                                    <Pie
                                      activeIndex={activeIndex}
                                      activeShape={renderActiveShape}
                                      data={cooperativesData.slice(0, 5)}
                                      cx="50%"
                                      cy="45%"
                                      innerRadius={80}
                                      outerRadius={120}
                                      paddingAngle={4}
                                      dataKey="weighings"
                                      nameKey="name"
                                      onMouseEnter={onPieEnter}
                                      animationDuration={1500}
                                      animationBegin={300}
                                      filter="url(#shadow)"
                                    >
                                      {cooperativesData.slice(0, 5).map((entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={`url(#color${index})`}
                                          stroke="white"
                                          strokeWidth={2}
                                        />
                                      ))}
                                    </Pie>
                                    <Tooltip content={<PieTooltip />} />
                                    <Legend content={renderLegend} verticalAlign="bottom" height={36} />
                                  </PieChart>
                                </ResponsiveContainer>
                              </Box>
                            </Fade>
                          </Box>
                        </CardContent>
                      </Card>
                    </Zoom>

                    {/* Top Vehicle Card - NEW COMPONENT */}
                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "550ms" : "0ms" }}>
                      <Card
                        sx={{
                          height: "100%",
                          minHeight: "500px",
                          borderRadius: "16px !important",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05) !important",
                          transition: "all 0.3s ease !important",
                          animation: "slideInUp 0.6s ease-out forwards",
                          opacity: 0,
                          animationDelay: "0.45s",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1) !important",
                          },
                          position: "relative",
                          background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                          "&::after": {
                            content: "''",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "100%",
                            background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)",
                            opacity: 0.1,
                            pointerEvents: "none",
                          },
                        }}
                      >
                        <CardHeader
                          title={
                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <EmojiTransportation
                                sx={{
                                  color: "#10b981",
                                  animation: "pulse 3s infinite ease-in-out",
                                }}
                              />
                              Veículo com Maior Pesagem
                            </Box>
                          }
                          subheader="Detalhes do veículo com melhor desempenho"
                          action={
                            <Box>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#64748b",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    color: "#10b981",
                                    transform: "rotate(15deg)",
                                  },
                                }}
                              >
                                <Print />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#64748b",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    color: "#3b82f6",
                                    transform: "scale(1.1)",
                                  },
                                }}
                              >
                                <Share />
                              </IconButton>
                            </Box>
                          }
                          sx={{
                            paddingBottom: "0.5rem",
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                            background: "linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))",
                            "& .MuiCardHeader-title": {
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#334155",
                            },
                            "& .MuiCardHeader-subheader": {
                              fontSize: "0.75rem",
                            },
                            "& .MuiCardHeader-action": {
                              margin: 0,
                            },
                          }}
                        />
                        <CardContent
                          sx={{
                            padding: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "calc(100% - 72px)",
                            "&:last-child": {
                              paddingBottom: "1.5rem",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              maxWidth: "300px",
                              height: "180px",
                              marginBottom: "1.5rem",
                              position: "relative",
                            }}
                          >
                            <TruckSVG />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "1rem",
                              width: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <Star sx={{ color: "#f59e0b", fontSize: "2rem" }} />
                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 700,
                                  background: "linear-gradient(90deg, #10b981, #3b82f6)",
                                  backgroundClip: "text",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                }}
                              >
                                {topVehicle.type}
                              </Typography>
                              <Star sx={{ color: "#f59e0b", fontSize: "2rem" }} />
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%",
                                padding: "1.5rem",
                                backgroundColor: "rgba(16, 185, 129, 0.05)",
                                borderRadius: "12px",
                                border: "1px dashed rgba(16, 185, 129, 0.3)",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                                  marginBottom: "1rem",
                                }}
                              >
                                {topVehicle.icon}
                              </Box>

                              <Typography
                                sx={{
                                  fontSize: "1.25rem",
                                  fontWeight: 700,
                                  color: "#10b981",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                Prefixo: {topVehicle.prefix}
                              </Typography>

                              <Divider sx={{ width: "80%", margin: "0.75rem 0" }} />

                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  width: "100%",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <Typography sx={{ fontWeight: 500, color: "#64748b" }}>Média de Pesagens:</Typography>
                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "1.25rem",
                                      color: "#10b981",
                                    }}
                                  >
                                    {topVehicle.avgWeighings}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <Typography sx={{ fontWeight: 500, color: "#64748b" }}>Quantidade:</Typography>
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      color: "#334155",
                                    }}
                                  >
                                    {topVehicle.count} unidades
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Button
                              variant="contained"
                              startIcon={<InfoOutlined />}
                              sx={{
                                marginTop: "1rem",
                                backgroundColor: "#10b981",
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: 600,
                                padding: "0.5rem 1.5rem",
                                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                                "&:hover": {
                                  backgroundColor: "#059669",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.6)",
                                },
                              }}
                            >
                              Ver Detalhes do Veículo
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Box>
                </Box>

                {/* Drivers Section */}
                <Box component="section" sx={{ marginTop: "1.5rem" }}>
                  <Grow in={!loading} timeout={800} style={{ transitionDelay: !loading ? "600ms" : "0ms" }}>
                    <Card
                      sx={{
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.3s ease",
                        animation: "slideInUp 0.7s ease-out forwards",
                        opacity: 0,
                        animationDelay: "0.6s",
                        overflow: "hidden",
                        "&:hover": {
                          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <CardHeader
                        title={
                          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <EmojiEvents />
                            Motoristas e Pesagens
                            <Box
                              sx={{
                                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                                color: "white",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                padding: "0.25rem 0.5rem",
                                borderRadius: "12px",
                                marginLeft: "0.5rem",
                                boxShadow: "0 2px 8px rgba(139, 92, 246, 0.2)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "1.5rem",
                              }}
                            >
                              {totalDrivers}
                            </Box>
                          </Box>
                        }
                        action={
                          <Box sx={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<FilterList />}
                              sx={{
                                height: "2.2rem",
                                textTransform: "none",
                                borderRadius: "12px",
                                transition: "all 0.3s ease",
                                fontWeight: 500,
                                padding: "0 1rem",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                                "&:hover": {
                                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                                  borderColor: "rgba(139, 92, 246, 0.3)",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                },
                              }}
                            >
                              Filtrar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DateRange />}
                              endIcon={<ExpandMore />}
                              onClick={handlePeriodMenuOpen}
                              sx={{
                                height: "2.2rem",
                                textTransform: "none",
                                borderRadius: "12px",
                                transition: "all 0.3s ease",
                                fontWeight: 500,
                                padding: "0 1rem",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                                "&:hover": {
                                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                                  borderColor: "rgba(139, 92, 246, 0.3)",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                },
                              }}
                            >
                              {period === "week" ? "Semana" : period === "month" ? "Mês" : "Ano"}
                            </Button>
                            <Menu
                              anchorEl={periodMenuAnchor}
                              open={Boolean(periodMenuAnchor)}
                              onClose={handlePeriodMenuClose}
                            >
                              <MenuItem
                                onClick={() => handlePeriodChange("week")}
                                sx={{
                                  fontSize: "0.875rem",
                                  transition: "all 0.2s ease",
                                  backgroundColor: period === "week" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                  fontWeight: period === "week" ? 600 : 400,
                                  "&:hover": {
                                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                                  },
                                }}
                              >
                                Semana
                              </MenuItem>
                              <MenuItem
                                onClick={() => handlePeriodChange("month")}
                                sx={{
                                  fontSize: "0.875rem",
                                  transition: "all 0.2s ease",
                                  backgroundColor: period === "month" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                  fontWeight: period === "month" ? 600 : 400,
                                  "&:hover": {
                                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                                  },
                                }}
                              >
                                Mês
                              </MenuItem>
                              <MenuItem
                                onClick={() => handlePeriodChange("year")}
                                sx={{
                                  fontSize: "0.875rem",
                                  transition: "all 0.2s ease",
                                  backgroundColor: period === "year" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                  fontWeight: period === "year" ? 600 : 400,
                                  "&:hover": {
                                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                                  },
                                }}
                              >
                                Ano
                              </MenuItem>
                            </Menu>
                          </Box>
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                          background: "linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05))",
                          "& .MuiCardHeader-title": {
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            color: "#334155",
                          },
                        }}
                      />
                      <CardContent>
                        <TextField
                          size="small"
                          placeholder="Buscar motoristas..."
                          fullWidth
                          value={driverFilter}
                          onChange={(e) => setDriverFilter(e.target.value)}
                          sx={{ marginBottom: "1rem" }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search fontSize="small" />
                              </InputAdornment>
                            ),
                            sx: {
                              borderRadius: "12px",
                              backgroundColor: "rgba(241, 245, 249, 0.7)",
                              transition: "all 0.3s ease",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                              "&:hover": {
                                backgroundColor: "rgba(241, 245, 249, 0.9)",
                                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.05)",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "white",
                                boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                              },
                            },
                          }}
                        />

                        <Tabs
                          value={tabValue}
                          onChange={handleTabChange}
                          variant="fullWidth"
                          sx={{
                            marginBottom: "1rem",
                            "& .MuiTabs-indicator": {
                              background: "linear-gradient(90deg, #7c3aed, #8b5cf6)",
                              height: "3px",
                              borderRadius: "3px",
                            },
                            "& .MuiTab-root": {
                              textTransform: "none",
                              fontWeight: 500,
                              transition: "all 0.3s ease",
                              minWidth: "120px",
                              "&.Mui-selected": {
                                color: "#8b5cf6",
                                fontWeight: 600,
                              },
                            },
                          }}
                        >
                          <Tab label="Top Motoristas" />
                          <Tab label="Menor Desempenho" />
                          <Tab label="Todos" />
                        </Tabs>

                        <Fade in={true} timeout={500}>
                          <TableContainer
                            component={Paper}
                            sx={{
                              boxShadow: "none",
                              borderRadius: "8px",
                              overflow: "hidden",
                              "& .MuiTableHead-root": {
                                backgroundColor: "rgba(241, 245, 249, 0.5)",
                              },
                              "& .MuiTableHead-root .MuiTableCell-root": {
                                fontWeight: 600,
                                color: "#64748b",
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              },
                              "& .MuiTableBody-root .MuiTableRow-root": {
                                transition: "background-color 0.3s ease",
                                "&:hover": {
                                  backgroundColor: "rgba(241, 245, 249, 0.5)",
                                },
                              },
                            }}
                          >
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Motorista</TableCell>
                                  <TableCell align="right">Pesagens</TableCell>
                                  <TableCell align="right">Eficiência</TableCell>
                                  <TableCell align="right">Status</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {currentDriversData.map((driver) => (
                                  <TableRow key={driver.id}>
                                    <TableCell
                                      sx={{
                                        fontWeight: 500,
                                        color: "#334155",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                      }}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 32,
                                          height: 32,
                                          fontSize: "0.875rem",
                                          fontWeight: 600,
                                          backgroundColor:
                                            driver.efficiency > 90
                                              ? "rgba(16, 185, 129, 0.2)"
                                              : driver.efficiency > 80
                                                ? "rgba(245, 158, 11, 0.2)"
                                                : "rgba(239, 68, 68, 0.2)",
                                          color:
                                            driver.efficiency > 90
                                              ? "#10b981"
                                              : driver.efficiency > 80
                                                ? "#f59e0b"
                                                : "#ef4444",
                                        }}
                                      >
                                        {driver.avatar}
                                      </Avatar>
                                      {driver.name}
                                    </TableCell>
                                    <TableCell align="right">{driver.weighings}</TableCell>
                                    <TableCell align="right">{driver.efficiency}%</TableCell>
                                    <TableCell align="right">{getStatusChip(driver.efficiency)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Fade>
                      </CardContent>
                    </Card>
                  </Grow>
                </Box>

                {/* Vehicle and Cooperatives Section */}
                <Box component="section" sx={{ marginTop: "1.5rem" }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "1.5rem",
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "800ms" : "0ms" }}>
                      <Card
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          height: "100%",
                          borderRadius: "16px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease",
                          animation: "slideInUp 0.8s ease-out forwards",
                          opacity: 0,
                          animationDelay: "0.8s",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <CardHeader
                          title={
                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Truck />
                              Veículos e Média de Pesagens
                              <Box
                                sx={{
                                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                  color: "white",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "12px",
                                  marginLeft: "0.5rem",
                                  boxShadow: "0 2px 8px rgba(245, 158, 11, 0.2)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  minWidth: "1.5rem",
                                }}
                              >
                                {totalVehicles}
                              </Box>
                            </Box>
                          }
                          subheader="Por tipo de veículo"
                          action={
                            <Box>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#64748b",
                                  transition: "all 0.3s ease",
                                  "&:hover": { color: "#334155", backgroundColor: "rgba(241, 245, 249, 0.8)" },
                                }}
                              >
                                <Print />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#64748b",
                                  transition: "all 0.3s ease",
                                  "&:hover": { color: "#334155", backgroundColor: "rgba(241, 245, 249, 0.8)" },
                                }}
                              >
                                <MoreVert />
                              </IconButton>
                            </Box>
                          }
                          sx={{
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                            background: "linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))",
                            "& .MuiCardHeader-title": {
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#334155",
                            },
                            "& .MuiCardHeader-subheader": {
                              fontSize: "0.75rem",
                            },
                            "& .MuiCardHeader-action": {
                              margin: 0,
                            },
                          }}
                        />
                        <CardContent>
                          <TextField
                            size="small"
                            placeholder="Filtrar veículos..."
                            fullWidth
                            value={vehicleFilter}
                            onChange={(e) => setVehicleFilter(e.target.value)}
                            sx={{ marginBottom: "1rem" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search fontSize="small" />
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: "12px",
                                backgroundColor: "rgba(241, 245, 249, 0.7)",
                                transition: "all 0.3s ease",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                                "&:hover": {
                                  backgroundColor: "rgba(241, 245, 249, 0.9)",
                                  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.05)",
                                },
                                "&.Mui-focused": {
                                  backgroundColor: "white",
                                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                                },
                              },
                            }}
                          />
                          <TableContainer
                            component={Paper}
                            sx={{
                              maxHeight: "500px",
                              overflowY: "auto",
                              boxShadow: "none",
                              borderRadius: "8px",
                              overflow: "hidden",
                              "& .MuiTableHead-root": {
                                backgroundColor: "rgba(241, 245, 249, 0.5)",
                              },
                              "& .MuiTableHead-root .MuiTableCell-root": {
                                fontWeight: 600,
                                color: "#64748b",
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              },
                              "& .MuiTableBody-root .MuiTableRow-root": {
                                transition: "background-color 0.3s ease",
                                "&:hover": {
                                  backgroundColor: "rgba(241, 245, 249, 0.5)",
                                },
                              },
                            }}
                          >
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Tipo de Veículo</TableCell>
                                  <TableCell align="right">Quantidade</TableCell>
                                  <TableCell align="right">Média de Pesagens</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {filteredVehicleData.map((vehicle) => (
                                  <TableRow key={vehicle.type}>
                                    <TableCell
                                      sx={{
                                        fontWeight: 500,
                                        color: "#334155",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: "32px",
                                          height: "32px",
                                          background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                          color: "white",
                                          borderRadius: "8px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          boxShadow: "0 2px 10px rgba(245, 158, 11, 0.2)",
                                          "& svg": {
                                            fontSize: "1.25rem",
                                          },
                                        }}
                                      >
                                        {vehicle.icon}
                                      </Box>
                                      {vehicle.type}
                                    </TableCell>
                                    <TableCell align="right">{vehicle.count}</TableCell>
                                    <TableCell align="right">{vehicle.avgWeighings}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    </Zoom>

                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "900ms" : "0ms" }}>
                      <Card
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          height: "100%",
                          borderRadius: "16px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease",
                          animation: "slideInUp 0.8s ease-out forwards",
                          opacity: 0,
                          animationDelay: "0.8s",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <CardHeader
                          title={
                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Leaderboard />
                              Ranking de Cooperativas
                              <Box
                                sx={{
                                  background: "linear-gradient(135deg, #10b981, #059669)",
                                  color: "white",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "12px",
                                  marginLeft: "0.5rem",
                                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  minWidth: "1.5rem",
                                }}
                              >
                                {totalCooperatives}
                              </Box>
                            </Box>
                          }
                          subheader="Top cooperativas por volume de pesagens"
                          action={
                            <Box>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#64748b",
                                  transition: "all 0.3s ease",
                                  "&:hover": { color: "#334155", backgroundColor: "rgba(241, 245, 249, 0.8)" },
                                }}
                              >
                                <Download />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#64748b",
                                  transition: "all 0.3s ease",
                                  "&:hover": { color: "#334155", backgroundColor: "rgba(241, 245, 249, 0.8)" },
                                }}
                              >
                                <MoreVert />
                              </IconButton>
                            </Box>
                          }
                          sx={{
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                            background: "linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))",
                            "& .MuiCardHeader-title": {
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#334155",
                            },
                            "& .MuiCardHeader-subheader": {
                              fontSize: "0.75rem",
                            },
                            "& .MuiCardHeader-action": {
                              margin: 0,
                            },
                          }}
                        />
                        <CardContent>
                          <TextField
                            size="small"
                            placeholder="Filtrar cooperativas..."
                            fullWidth
                            value={cooperativeFilter}
                            onChange={(e) => setCooperativeFilter(e.target.value)}
                            sx={{ marginBottom: "1rem" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search fontSize="small" />
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: "12px",
                                backgroundColor: "rgba(241, 245, 249, 0.7)",
                                transition: "all 0.3s ease",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                                "&:hover": {
                                  backgroundColor: "rgba(241, 245, 249, 0.9)",
                                  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.05)",
                                },
                                "&.Mui-focused": {
                                  backgroundColor: "white",
                                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                                },
                              },
                            }}
                          />
                          <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
                            <Table
                              sx={{
                                width: "100%",
                                borderCollapse: "collapse",
                                "& th": {
                                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                                  color: "#10b981",
                                  fontWeight: 600,
                                  textAlign: "left",
                                  padding: "0.75rem",
                                },
                                "& td": {
                                  padding: "0.75rem",
                                  borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                                },
                                "& tr:last-child td": {
                                  borderBottom: "none",
                                },
                                "& tr:hover td": {
                                  backgroundColor: "rgba(241, 245, 249, 0.5)",
                                },
                              }}
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell>Rank</TableCell>
                                  <TableCell>Cooperativa</TableCell>
                                  <TableCell>Pesagens</TableCell>
                                  <TableCell>%</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {filteredCooperativesData.map((coop) => (
                                  <TableRow key={coop.rank}>
                                    <TableCell>
                                      <Box
                                        sx={{
                                          fontWeight: 700,
                                          width: "32px",
                                          height: "32px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          borderRadius: "50%",
                                          background:
                                            coop.rank === 1
                                              ? "linear-gradient(135deg, #10b981, #059669)"
                                              : coop.rank === 2
                                                ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                                                : coop.rank === 3
                                                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                                                  : coop.rank === 4
                                                    ? "linear-gradient(135deg, #8b5cf6, #7c3aed)"
                                                    : coop.rank === 5
                                                      ? "linear-gradient(135deg, #ec4899, #be185d)"
                                                      : "linear-gradient(135deg, #64748b, #475569)",
                                          color: "white",
                                          marginRight: "0.75rem",
                                        }}
                                      >
                                        {coop.rank}
                                      </Box>
                                    </TableCell>
                                    <TableCell>{coop.name}</TableCell>
                                    <TableCell>{coop.weighings}</TableCell>
                                    <TableCell>{coop.percentage}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  )
}

