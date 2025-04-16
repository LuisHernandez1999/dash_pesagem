"use client"

import { useState, useEffect, useMemo } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Box,
  Fade,
  Zoom,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Container,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  ExpandMore,
  LocalShipping as TruckIcon,
  Download,
  Search,
  DirectionsCar,
  CheckCircle,
  Cancel,
  Today,
  CalendarMonth,
  FilterAlt,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  Close,
  Info,
  LocationOn,
  AccessTime,
  Person,
  Timeline,
  Menu as MenuIcon,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"

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
  gradientShift: `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,
}

// Mock data for the dashboard
const mockMonthlyData = [
  { month: "Jan", removals: 45, target: 40, efficiency: 112.5 },
  { month: "Fev", removals: 52, target: 45, efficiency: 115.6 },
  { month: "Mar", removals: 48, target: 50, efficiency: 96.0 },
  { month: "Abr", removals: 70, target: 55, efficiency: 127.3 },
  { month: "Mai", removals: 65, target: 60, efficiency: 108.3 },
  { month: "Jun", removals: 75, target: 65, efficiency: 115.4 },
  { month: "Jul", removals: 80, target: 70, efficiency: 114.3 },
  { month: "Ago", removals: 90, target: 75, efficiency: 120.0 },
  { month: "Set", removals: 85, target: 80, efficiency: 106.3 },
  { month: "Out", removals: 95, target: 85, efficiency: 111.8 },
  { month: "Nov", removals: 100, target: 90, efficiency: 111.1 },
  { month: "Dez", removals: 110, target: 95, efficiency: 115.8 },
]

// Mock data for total removals
const mockTotalRemovals = [
  {
    id: 1,
    driver: "Carlos Silva",
    vehiclePrefix: "VR-1234",
    departureTime: "08:15",
    status: "Concluído",
    location: "Av. Paulista, 1000",
    vehicle: "Caminhão Reboque",
    arrivalTime: "09:30",
    distance: "12.5 km",
    notes: "Veículo abandonado",
  },
  {
    id: 2,
    driver: "Ana Oliveira",
    vehiclePrefix: "VR-5678",
    departureTime: "09:30",
    status: "Concluído",
    location: "Rua Augusta, 500",
    vehicle: "Guincho Leve",
    arrivalTime: "10:45",
    distance: "8.2 km",
    notes: "Estacionamento proibido",
  },
  {
    id: 3,
    driver: "Roberto Santos",
    vehiclePrefix: "VR-9012",
    departureTime: "10:45",
    status: "Concluído",
    location: "Av. Brigadeiro Faria Lima, 3000",
    vehicle: "Caminhão Plataforma",
    arrivalTime: "12:00",
    distance: "15.7 km",
    notes: "Veículo em local de carga/descarga",
  },
  {
    id: 4,
    driver: "Juliana Costa",
    vehiclePrefix: "VR-3456",
    departureTime: "11:20",
    status: "Concluído",
    location: "Rua Oscar Freire, 700",
    vehicle: "Guincho Pesado",
    arrivalTime: "12:35",
    distance: "6.8 km",
    notes: "Bloqueando garagem",
  },
  {
    id: 5,
    driver: "Marcos Pereira",
    vehiclePrefix: "VR-7890",
    departureTime: "13:00",
    status: "Concluído",
    location: "Av. Rebouças, 1500",
    vehicle: "Caminhão Reboque",
    arrivalTime: "14:15",
    distance: "10.3 km",
    notes: "Veículo em faixa exclusiva",
  },
  {
    id: 6,
    driver: "Fernanda Lima",
    vehiclePrefix: "VR-2345",
    departureTime: "14:15",
    status: "Concluído",
    location: "Av. Paulista, 2000",
    vehicle: "Guincho Leve",
    arrivalTime: "15:30",
    distance: "7.5 km",
    notes: "Estacionamento em local proibido",
  },
  {
    id: 7,
    driver: "Ricardo Alves",
    vehiclePrefix: "VR-6789",
    departureTime: "15:30",
    status: "Concluído",
    location: "Rua da Consolação, 800",
    vehicle: "Caminhão Plataforma",
    arrivalTime: "16:45",
    distance: "9.2 km",
    notes: "Veículo abandonado",
  },
  {
    id: 8,
    driver: "Patrícia Gomes",
    vehiclePrefix: "VR-0123",
    departureTime: "16:45",
    status: "Concluído",
    location: "Av. Brigadeiro Luís Antônio, 1200",
    vehicle: "Guincho Pesado",
    arrivalTime: "18:00",
    distance: "11.8 km",
    notes: "Bloqueando ciclovia",
  },
  {
    id: 9,
    driver: "Eduardo Martins",
    vehiclePrefix: "VR-4567",
    departureTime: "08:00",
    status: "Concluído",
    location: "Av. Santo Amaro, 1000",
    vehicle: "Caminhão Reboque",
    arrivalTime: "09:15",
    distance: "8.7 km",
    notes: "Veículo em ponto de ônibus",
  },
  {
    id: 10,
    driver: "Camila Rocha",
    vehiclePrefix: "VR-8901",
    departureTime: "09:15",
    status: "Concluído",
    location: "Rua Haddock Lobo, 600",
    vehicle: "Guincho Leve",
    arrivalTime: "10:30",
    distance: "5.4 km",
    notes: "Estacionamento em local proibido",
  },
  {
    id: 11,
    driver: "Gustavo Dias",
    vehiclePrefix: "VR-2345",
    departureTime: "10:30",
    status: "Concluído",
    location: "Av. Nove de Julho, 2000",
    vehicle: "Caminhão Plataforma",
    arrivalTime: "11:45",
    distance: "13.2 km",
    notes: "Veículo em faixa exclusiva",
  },
  {
    id: 12,
    driver: "Luciana Ferreira",
    vehiclePrefix: "VR-6789",
    departureTime: "11:45",
    status: "Concluído",
    location: "Av. Paulista, 500",
    vehicle: "Guincho Pesado",
    arrivalTime: "13:00",
    distance: "7.9 km",
    notes: "Bloqueando entrada de garagem",
  },
]

// Mock data for today's removals
const mockTodayRemovals = [
  {
    id: 1,
    driver: "Carlos Silva",
    vehiclePrefix: "VR-1234",
    departureTime: "08:15",
    status: "Em andamento",
    location: "Av. Paulista, 1000",
    vehicle: "Caminhão Reboque",
    arrivalTime: "-",
    distance: "12.5 km",
    notes: "Veículo abandonado",
  },
  {
    id: 2,
    driver: "Ana Oliveira",
    vehiclePrefix: "VR-5678",
    departureTime: "09:30",
    status: "Em andamento",
    location: "Rua Augusta, 500",
    vehicle: "Guincho Leve",
    arrivalTime: "-",
    distance: "8.2 km",
    notes: "Estacionamento proibido",
  },
  {
    id: 3,
    driver: "Roberto Santos",
    vehiclePrefix: "VR-9012",
    departureTime: "10:45",
    status: "Agendado",
    location: "Av. Brigadeiro Faria Lima, 3000",
    vehicle: "Caminhão Plataforma",
    arrivalTime: "-",
    distance: "15.7 km",
    notes: "Veículo em local de carga/descarga",
  },
  {
    id: 4,
    driver: "Juliana Costa",
    vehiclePrefix: "VR-3456",
    departureTime: "11:20",
    status: "Agendado",
    location: "Rua Oscar Freire, 700",
    vehicle: "Guincho Pesado",
    arrivalTime: "-",
    distance: "6.8 km",
    notes: "Bloqueando garagem",
  },
  {
    id: 5,
    driver: "Marcos Pereira",
    vehiclePrefix: "VR-7890",
    departureTime: "13:00",
    status: "Agendado",
    location: "Av. Rebouças, 1500",
    vehicle: "Caminhão Reboque",
    arrivalTime: "-",
    distance: "10.3 km",
    notes: "Veículo em faixa exclusiva",
  },
]

// Calculate driver with most removals
const getDriverWithMostRemovals = () => {
  const driverCounts = {}
  mockTotalRemovals.forEach((removal) => {
    driverCounts[removal.driver] = (driverCounts[removal.driver] || 0) + 1
  })

  let maxCount = 0
  let topDriver = ""
  let topVehicle = ""

  Object.entries(driverCounts).forEach(([driver, count]) => {
    if (count > maxCount) {
      maxCount = count
      topDriver = driver
      // Find the vehicle prefix for this driver
      const driverRemoval = mockTotalRemovals.find((r) => r.driver === driver)
      topVehicle = driverRemoval ? driverRemoval.vehiclePrefix : ""
    }
  })

  return { driver: topDriver, count: maxCount, vehiclePrefix: topVehicle }
}

// Pie chart data
const getPieChartData = () => {
  const statusCounts = { Concluído: 0, "Em andamento": 0, Agendado: 0 }

  mockTotalRemovals.forEach((removal) => {
    statusCounts["Concluído"]++
  })

  mockTodayRemovals.forEach((removal) => {
    if (removal.status === "Em andamento") {
      statusCounts["Em andamento"]++
    } else if (removal.status === "Agendado") {
      statusCounts["Agendado"]++
    }
  })

  return [
    { name: "Concluído", value: statusCounts["Concluído"] },
    { name: "Em andamento", value: statusCounts["Em andamento"] },
    { name: "Agendado", value: statusCounts["Agendado"] },
  ]
}

// Area chart data
const getAreaChartData = () => {
  return mockMonthlyData.map((item) => ({
    month: item.month,
    removals: item.removals,
    target: item.target,
  }))
}

// Colors for pie chart
const COLORS = ["#2DCE89", "#4A6FFF", "#FB6340"]

export default function RemovalDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // State variables
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState("Todos")
  const [monthMenuAnchor, setMonthMenuAnchor] = useState(null)
  const [searchTotal, setSearchTotal] = useState("")
  const [searchToday, setSearchToday] = useState("")
  const [totalPage, setTotalPage] = useState(0)
  const [totalRowsPerPage, setTotalRowsPerPage] = useState(5)
  const [todayPage, setTodayPage] = useState(0)
  const [todayRowsPerPage, setTodayRowsPerPage] = useState(5)
  const [sortField, setSortField] = useState("departureTime")
  const [sortDirection, setSortDirection] = useState("asc")
  const [chartsLoaded, setChartsLoaded] = useState(false)
  const [statsData, setStatsData] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
    releasedToday: 0,
  })
  const [chartType, setChartType] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRemoval, setSelectedRemoval] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const topDriver = getDriverWithMostRemovals()
  const pieChartData = getPieChartData()
  const areaChartData = getAreaChartData()

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Set mock stats data
      setStatsData({
        totalVehicles: 120,
        activeVehicles: 85,
        inactiveVehicles: 35,
        releasedToday: 12,
      })

      setLoading(false)

      // Simulate charts loading with a slight delay
      setTimeout(() => setChartsLoaded(true), 500)
    }

    loadData()
  }, [])

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  // Handle month menu
  const handleMonthMenuOpen = (event) => {
    setMonthMenuAnchor(event.currentTarget)
  }

  const handleMonthMenuClose = () => {
    setMonthMenuAnchor(null)
  }

  const handleMonthChange = (month) => {
    setSelectedMonth(month)
    setMonthMenuAnchor(null)
  }

  // Handle pagination for total removals table
  const handleTotalPageChange = (event, newPage) => {
    setTotalPage(newPage)
  }

  const handleTotalRowsPerPageChange = (event) => {
    setTotalRowsPerPage(Number.parseInt(event.target.value, 10))
    setTotalPage(0)
  }

  // Handle pagination for today's removals table
  const handleTodayPageChange = (event, newPage) => {
    setTodayPage(newPage)
  }

  const handleTodayRowsPerPageChange = (event) => {
    setTodayRowsPerPage(Number.parseInt(event.target.value, 10))
    setTodayPage(0)
  }

  // Handle sorting
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc"
    setSortDirection(isAsc ? "desc" : "asc")
    setSortField(field)
  }

  // Handle chart type change
  const handleChartTypeChange = (event, newValue) => {
    setChartType(newValue)
  }

  // Handle modal open
  const handleOpenModal = (removal) => {
    setSelectedRemoval(removal)
    setModalOpen(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false)
  }

  // Filter and sort total removals data
  const filteredTotalRemovals = useMemo(() => {
    return mockTotalRemovals
      .filter(
        (removal) =>
          removal.driver.toLowerCase().includes(searchTotal.toLowerCase()) ||
          removal.vehiclePrefix.toLowerCase().includes(searchTotal.toLowerCase()) ||
          removal.departureTime.includes(searchTotal),
      )
      .sort((a, b) => {
        const factor = sortDirection === "asc" ? 1 : -1
        if (sortField === "driver") {
          return factor * a.driver.localeCompare(b.driver)
        } else if (sortField === "vehiclePrefix") {
          return factor * a.vehiclePrefix.localeCompare(b.vehiclePrefix)
        } else if (sortField === "departureTime") {
          return factor * a.departureTime.localeCompare(b.departureTime)
        }
        return 0
      })
  }, [searchTotal, sortField, sortDirection])

  // Filter today's removals data
  const filteredTodayRemovals = useMemo(() => {
    return mockTodayRemovals.filter(
      (removal) =>
        removal.driver.toLowerCase().includes(searchToday.toLowerCase()) ||
        removal.vehiclePrefix.toLowerCase().includes(searchToday.toLowerCase()) ||
        removal.departureTime.includes(searchToday),
    )
  }, [searchToday])

  // Get paginated data
  const paginatedTotalRemovals = filteredTotalRemovals.slice(
    totalPage * totalRowsPerPage,
    totalPage * totalRowsPerPage + totalRowsPerPage,
  )

  const paginatedTodayRemovals = filteredTodayRemovals.slice(
    todayPage * todayRowsPerPage,
    todayPage * todayRowsPerPage + todayRowsPerPage,
  )

  // Filter chart data based on selected month
  const chartData = useMemo(() => {
    if (selectedMonth === "Todos") {
      return mockMonthlyData
    }
    return mockMonthlyData.filter((data) => data.month === selectedMonth)
  }, [selectedMonth])

  // Calculate total removals
  const totalRemovalsCount = mockTotalRemovals.length

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = mockMonthlyData.find((item) => item.month === label)
      const removals = data?.removals || 0
      const target = data?.target || 0
      const efficiency = data?.efficiency || 0

      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: "none",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            maxWidth: "280px",
            position: "relative",
            "&:before": {
              content: "''",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #4A6FFF, #6B8CFF)",
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
            {`${label} - ${removals} Remoções`}
          </Typography>

          <Box
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
                  backgroundColor: "#4A6FFF",
                }}
              />
              <Typography sx={{ color: "#475569", fontWeight: 500 }}>Remoções:</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, color: "#334155" }}>{removals}</Typography>
          </Box>

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
              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "0.875rem" }}>{target}</Typography>
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
                  color: efficiency >= 100 ? "#2DCE89" : "#F5365C",
                }}
              >
                {efficiency}%
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }
    return null
  }

  // Custom stat card component
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        background: "white",
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "150px", sm: "180px" },
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Box
        sx={{
          width: { xs: "50px", sm: "60px" },
          height: { xs: "50px", sm: "60px" },
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}22`,
          marginBottom: "1rem",
        }}
      >
        <Icon sx={{ fontSize: { xs: 24, sm: 30 }, color: color }} />
      </Box>
      <Typography
        variant="h3"
        sx={{ fontWeight: "bold", color: "#334155", mb: 1, fontSize: { xs: "2rem", sm: "2.5rem" } }}
      >
        {value}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#64748b",
          textAlign: "center",
          fontWeight: "500",
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        {title}
      </Typography>
    </Card>
  )

  // Get status chip based on status
  const getStatusChip = (status) => {
    if (status === "Concluído") {
      return (
        <Chip
          label="Concluído"
          sx={{
            backgroundColor: "rgba(45, 206, 137, 0.1)",
            color: "#2DCE89",
            fontWeight: 600,
            borderRadius: "20px",
            boxShadow: "0 2px 10px rgba(45, 206, 137, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(45, 206, 137, 0.2)",
              boxShadow: "0 2px 15px rgba(45, 206, 137, 0.3)",
            },
          }}
        />
      )
    } else if (status === "Em andamento") {
      return (
        <Chip
          label="Em andamento"
          sx={{
            backgroundColor: "rgba(74, 111, 255, 0.1)",
            color: "#4A6FFF",
            fontWeight: 600,
            borderRadius: "20px",
            boxShadow: "0 2px 10px rgba(74, 111, 255, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(74, 111, 255, 0.2)",
              boxShadow: "0 2px 15px rgba(74, 111, 255, 0.3)",
            },
          }}
        />
      )
    } else {
      return (
        <Chip
          label="Agendado"
          sx={{
            backgroundColor: "rgba(251, 99, 64, 0.1)",
            color: "#FB6340",
            fontWeight: 600,
            borderRadius: "20px",
            boxShadow: "0 2px 10px rgba(251, 99, 64, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(251, 99, 64, 0.2)",
              boxShadow: "0 2px 15px rgba(251, 99, 64, 0.3)",
            },
          }}
        />
      )
    }
  }

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ArrowUpward sx={{ fontSize: 16, ml: 0.5 }} />
    ) : (
      <ArrowDownward sx={{ fontSize: 16, ml: 0.5 }} />
    )
  }

  // Render chart based on selected type
  const renderChart = () => {
    switch (chartType) {
      case 0: // Bar Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
              barGap={8}
              barCategoryGap={30}
            >
              <defs>
                <linearGradient id="colorRemovals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A6FFF" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6B8CFF" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.8} />
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
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 20 }} />
              <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1} />
              <Bar
                dataKey="removals"
                fill="url(#colorRemovals)"
                radius={[6, 6, 0, 0]}
                name="Remoções"
                animationDuration={1000}
                barSize={36}
              >
                <LabelList dataKey="removals" position="top" fill="#4A6FFF" fontSize={12} fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case 1: // Line Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.8} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="removals"
                stroke="#4A6FFF"
                strokeWidth={3}
                dot={{ r: 6, fill: "#4A6FFF", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 8, fill: "#4A6FFF", strokeWidth: 2, stroke: "#ffffff" }}
                name="Remoções"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#FB6340"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 6, fill: "#FB6340", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 8, fill: "#FB6340", strokeWidth: 2, stroke: "#ffffff" }}
                name="Meta"
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case 2: // Pie Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} remoções`, "Quantidade"]} />
              <Legend verticalAlign="bottom" layout="horizontal" align="center" wrapperStyle={{ paddingTop: 30 }} />
            </PieChart>
          </ResponsiveContainer>
        )
      case 3: // Area Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaChartData} margin={{ top: 30, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="colorRemovals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A6FFF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4A6FFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FB6340" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FB6340" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 20 }} />
              <Area
                type="monotone"
                dataKey="removals"
                stroke="#4A6FFF"
                fillOpacity={1}
                fill="url(#colorRemovals)"
                name="Remoções"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#FB6340"
                fillOpacity={1}
                fill="url(#colorTarget)"
                name="Meta"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
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
        `}
      </style>
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar onCollapse={handleSidebarCollapse} />

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
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
              backgroundColor: "#ffffff !important",
              color: "#0f172a !important",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05) !important",
              position: "relative",
              zIndex: 10,
              transition: "all 0.3s ease",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #4A6FFF, #6B8CFF, #FB6340)",
                zIndex: 1,
              },
            }}
          >
            <Toolbar>
              {isMobile && (
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.4rem", sm: "1.8rem" },
                  background: "linear-gradient(90deg, #4A6FFF, #6B8CFF)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  animation: "fadeIn 1s ease-out",
                }}
              >
                <TruckIcon
                  sx={{
                    color: "#4A6FFF",
                    fontSize: { xs: "1.8rem", sm: "2.2rem" },
                    animation: "float 3s ease-in-out infinite",
                  }}
                />
                Dashboard de Remoção
              </Typography>
            </Toolbar>
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
                    gap: "1.5rem",
                    gridTemplateColumns: {
                      xs: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    mb: 4,
                  }}
                >
                  <Fade in={!loading} timeout={500}>
                    <Box>
                      <StatCard
                        title="Veículos de remoção total"
                        value={statsData.totalVehicles}
                        icon={DirectionsCar}
                        color="#4A6FFF"
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                    <Box>
                      <StatCard
                        title="Veículos remoção ativos"
                        value={statsData.activeVehicles}
                        icon={CheckCircle}
                        color="#2DCE89"
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                    <Box>
                      <StatCard
                        title="Veículos remoção inativo"
                        value={statsData.inactiveVehicles}
                        icon={Cancel}
                        color="#F5365C"
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                    <Box>
                      <StatCard
                        title="Veículos remoção soltos hoje"
                        value={statsData.releasedToday}
                        icon={Today}
                        color="#FB6340"
                      />
                    </Box>
                  </Fade>
                </Box>
              </Box>

              {/* Chart Section */}
              <Box component="section" sx={{ mb: 4 }}>
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "400ms" : "0ms" }}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                      },
                      background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                    }}
                  >
                    <CardHeader
                      title={
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Box
                            sx={{
                              width: { xs: "30px", sm: "36px" },
                              height: { xs: "30px", sm: "36px" },
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, #4A6FFF, #6B8CFF)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 4px 12px rgba(74, 111, 255, 0.3)",
                            }}
                          >
                            <BarChartIcon
                              sx={{
                                color: "white",
                                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                                background: "linear-gradient(90deg, #4A6FFF, #6B8CFF)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "-0.02em",
                              }}
                            >
                              Histórico de Remoções
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                color: "#64748b",
                                fontWeight: 500,
                              }}
                            >
                              Análise mensal de remoções de veículos
                            </Typography>
                          </Box>
                        </Box>
                      }
                      action={
                        <Box sx={{ display: "flex", gap: "0.5rem" }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CalendarMonth />}
                            endIcon={<ExpandMore />}
                            onClick={handleMonthMenuOpen}
                            sx={{
                              height: "2.2rem",
                              textTransform: "none",
                              borderRadius: "10px",
                              transition: "all 0.3s ease",
                              fontWeight: 500,
                              padding: "0 1rem",
                              borderColor: "rgba(226, 232, 240, 0.8)",
                              color: "#64748b",
                              display: { xs: "none", sm: "flex" },
                              "&:hover": {
                                backgroundColor: "rgba(241, 245, 249, 0.8)",
                                borderColor: "rgba(148, 163, 184, 0.5)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            {selectedMonth}
                          </Button>
                          <IconButton
                            onClick={handleMonthMenuOpen}
                            sx={{
                              display: { xs: "flex", sm: "none" },
                              color: "#64748b",
                            }}
                          >
                            <CalendarMonth />
                          </IconButton>
                          <Menu
                            anchorEl={monthMenuAnchor}
                            open={Boolean(monthMenuAnchor)}
                            onClose={handleMonthMenuClose}
                          >
                            <MenuItem
                              onClick={() => handleMonthChange("Todos")}
                              sx={{
                                fontSize: "0.875rem",
                                transition: "all 0.2s ease",
                                backgroundColor: selectedMonth === "Todos" ? "rgba(74, 111, 255, 0.1)" : "transparent",
                                fontWeight: selectedMonth === "Todos" ? 600 : 400,
                                "&:hover": {
                                  backgroundColor: "rgba(74, 111, 255, 0.1)",
                                },
                              }}
                            >
                              Todos
                            </MenuItem>
                            {mockMonthlyData.map((data) => (
                              <MenuItem
                                key={data.month}
                                onClick={() => handleMonthChange(data.month)}
                                sx={{
                                  fontSize: "0.875rem",
                                  transition: "all 0.2s ease",
                                  backgroundColor:
                                    selectedMonth === data.month ? "rgba(74, 111, 255, 0.1)" : "transparent",
                                  fontWeight: selectedMonth === data.month ? 600 : 400,
                                  "&:hover": {
                                    backgroundColor: "rgba(74, 111, 255, 0.1)",
                                  },
                                }}
                              >
                                {data.month}
                              </MenuItem>
                            ))}
                          </Menu>
                          <IconButton
                            sx={{
                              color: "#64748b",
                              transition: "all 0.2s ease",
                              backgroundColor: "rgba(241, 245, 249, 0.5)",
                              "&:hover": {
                                color: "#4A6FFF",
                                transform: "rotate(15deg)",
                                backgroundColor: "rgba(241, 245, 249, 0.8)",
                              },
                              display: { xs: "none", sm: "flex" },
                            }}
                          >
                            <Download />
                          </IconButton>
                          <IconButton
                            sx={{
                              color: "#64748b",
                              transition: "all 0.2s ease",
                              backgroundColor: "rgba(241, 245, 249, 0.5)",
                              "&:hover": {
                                color: "#4A6FFF",
                                transform: "rotate(15deg)",
                                backgroundColor: "rgba(241, 245, 249, 0.8)",
                              },
                              display: { xs: "none", sm: "flex" },
                            }}
                          >
                            <FilterAlt />
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
                    <Box sx={{ padding: "0.5rem 1.5rem" }}>
                      <Tabs
                        value={chartType}
                        onChange={handleChartTypeChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                          "& .MuiTabs-indicator": {
                            backgroundColor: "#4A6FFF",
                            height: "3px",
                            borderRadius: "3px",
                          },
                          "& .MuiTab-root": {
                            textTransform: "none",
                            minWidth: { xs: "80px", sm: "120px" },
                            fontWeight: 500,
                            color: "#64748b",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            "&.Mui-selected": {
                              color: "#4A6FFF",
                              fontWeight: 600,
                            },
                          },
                        }}
                      >
                        <Tab icon={<BarChartIcon />} label="Barras" iconPosition="start" sx={{ gap: "0.5rem" }} />
                        <Tab icon={<LineChartIcon />} label="Linhas" iconPosition="start" sx={{ gap: "0.5rem" }} />
                        <Tab icon={<PieChartIcon />} label="Pizza" iconPosition="start" sx={{ gap: "0.5rem" }} />
                        <Tab icon={<AreaChartIcon />} label="Área" iconPosition="start" sx={{ gap: "0.5rem" }} />
                      </Tabs>
                    </Box>
                    <CardContent sx={{ padding: "1.5rem" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: { xs: "300px", sm: "400px" },
                          position: "relative",
                        }}
                      >
                        {!chartsLoaded && (
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
                                background: "linear-gradient(135deg, #4A6FFF, #6B8CFF)",
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
                        <Fade in={chartsLoaded} timeout={800}>
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {renderChart()}
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
                            gap: { xs: "0.8rem", sm: "1.5rem" },
                            flexWrap: "wrap",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              backgroundColor: "rgba(74, 111, 255, 0.1)",
                              padding: { xs: "0.4rem 0.8rem", sm: "0.5rem 1rem" },
                              borderRadius: "10px",
                            }}
                          >
                            <Box
                              sx={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "3px",
                                background: "linear-gradient(135deg, #4A6FFF, #6B8CFF)",
                              }}
                            />
                            <Typography
                              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, fontWeight: 600, color: "#4A6FFF" }}
                            >
                              Total: {chartData.reduce((sum, item) => sum + item.removals, 0)}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              backgroundColor: "rgba(45, 206, 137, 0.1)",
                              padding: { xs: "0.4rem 0.8rem", sm: "0.5rem 1rem" },
                              borderRadius: "10px",
                            }}
                          >
                            <Box
                              sx={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "3px",
                                background: "linear-gradient(135deg, #2DCE89, #2DCEAC)",
                              }}
                            />
                            <Typography
                              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, fontWeight: 600, color: "#2DCE89" }}
                            >
                              Média:{" "}
                              {Math.round(
                                chartData.reduce((sum, item) => sum + item.removals, 0) / (chartData.length || 1),
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>

              {/* Tables Section */}
              <Box component="section">
                <Grid
                  container
                  spacing={3}
                  sx={{
                    width: "100%",
                    margin: 0,
                    "& > .MuiGrid-item": {
                      paddingLeft: "12px",
                      paddingRight: "12px",
                    },
                  }}
                >
                  {/* Total Removals Table */}
                  <Grid item xs={12} md={6}>
                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "700ms" : "0ms" }}>
                      <Card
                        sx={{
                          borderRadius: "16px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease",
                          overflow: "hidden",
                          height: "100%",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <CardHeader
                          title={
                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Box
                                sx={{
                                  width: { xs: "28px", sm: "32px" },
                                  height: { xs: "28px", sm: "32px" },
                                  borderRadius: "8px",
                                  background: "linear-gradient(135deg, #4A6FFF, #6B8CFF)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 4px 12px rgba(74, 111, 255, 0.2)",
                                }}
                              >
                                <TruckIcon sx={{ color: "white", fontSize: { xs: "1rem", sm: "1.2rem" } }} />
                              </Box>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: { xs: "1rem", sm: "1.1rem" },
                                  color: "#334155",
                                }}
                              >
                                Total de Remoções
                              </Typography>
                              <Chip
                                label={filteredTotalRemovals.length}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(74, 111, 255, 0.1)",
                                  color: "#4A6FFF",
                                  fontWeight: 600,
                                  height: "1.5rem",
                                  fontSize: "0.75rem",
                                }}
                              />
                            </Box>
                          }
                          action={
                            <IconButton
                              onClick={() => {}}
                              sx={{
                                color: "#64748b",
                                "&:hover": {
                                  color: "#4A6FFF",
                                  backgroundColor: "rgba(241, 245, 249, 0.8)",
                                },
                              }}
                            >
                              <Refresh />
                            </IconButton>
                          }
                          sx={{
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                            padding: { xs: "0.8rem 1rem", sm: "1rem 1.25rem" },
                          }}
                        />
                        <CardContent sx={{ padding: { xs: "0.5rem 0.8rem", sm: "0.5rem 1rem" } }}>
                          <TextField
                            size="small"
                            placeholder="Buscar remoções..."
                            fullWidth
                            value={searchTotal}
                            onChange={(e) => setSearchTotal(e.target.value)}
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
                                "&:hover": {
                                  backgroundColor: "rgba(241, 245, 249, 0.9)",
                                },
                                "&.Mui-focused": {
                                  backgroundColor: "white",
                                  boxShadow: "0 0 0 2px rgba(74, 111, 255, 0.2)",
                                },
                              },
                            }}
                          />
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    onClick={() => handleSort("driver")}
                                    sx={{
                                      cursor: "pointer",
                                      fontWeight: 600,
                                      color: sortField === "driver" ? "#4A6FFF" : "#64748b",
                                      "&:hover": { color: "#4A6FFF" },
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                  >
                                    Motorista
                                    <SortIndicator field="driver" />
                                  </TableCell>
                                  <TableCell
                                    onClick={() => handleSort("vehiclePrefix")}
                                    sx={{
                                      cursor: "pointer",
                                      fontWeight: 600,
                                      color: sortField === "vehiclePrefix" ? "#4A6FFF" : "#64748b",
                                      "&:hover": { color: "#4A6FFF" },
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                  >
                                    Prefixo
                                    <SortIndicator field="vehiclePrefix" />
                                  </TableCell>
                                  <TableCell
                                    onClick={() => handleSort("departureTime")}
                                    sx={{
                                      cursor: "pointer",
                                      fontWeight: 600,
                                      color: sortField === "departureTime" ? "#4A6FFF" : "#64748b",
                                      "&:hover": { color: "#4A6FFF" },
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                  >
                                    Horário
                                    <SortIndicator field="departureTime" />
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: 600,
                                      color: "#64748b",
                                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                  >
                                    Status
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {paginatedTotalRemovals.map((removal) => (
                                  <TableRow
                                    key={removal.id}
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "rgba(241, 245, 249, 0.5)",
                                      },
                                      transition: "background-color 0.2s",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleOpenModal(removal)}
                                  >
                                    <TableCell>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <Avatar
                                          sx={{
                                            width: { xs: 28, sm: 32 },
                                            height: { xs: 28, sm: 32 },
                                            backgroundColor: "rgba(74, 111, 255, 0.1)",
                                            color: "#4A6FFF",
                                            fontWeight: 600,
                                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                          }}
                                        >
                                          {removal.driver.charAt(0)}
                                        </Avatar>
                                        <Typography
                                          sx={{ fontWeight: 500, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                                        >
                                          {isMobile ? removal.driver.split(" ")[0] : removal.driver}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Chip
                                        label={removal.vehiclePrefix}
                                        size="small"
                                        sx={{
                                          backgroundColor: "rgba(45, 206, 137, 0.1)",
                                          color: "#2DCE89",
                                          fontWeight: 600,
                                          height: { xs: "1.4rem", sm: "1.5rem" },
                                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                                      {removal.departureTime}
                                    </TableCell>
                                    <TableCell>{getStatusChip(removal.status)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            component="div"
                            count={filteredTotalRemovals.length}
                            page={totalPage}
                            onPageChange={handleTotalPageChange}
                            rowsPerPage={totalRowsPerPage}
                            onRowsPerPageChange={handleTotalRowsPerPageChange}
                            rowsPerPageOptions={[5, 10, 25]}
                            labelRowsPerPage={isMobile ? "" : "Linhas:"}
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                            sx={{
                              ".MuiTablePagination-actions": {
                                "& .MuiIconButton-root": {
                                  color: "#64748b",
                                  "&:hover": {
                                    backgroundColor: "rgba(74, 111, 255, 0.1)",
                                    color: "#4A6FFF",
                                  },
                                },
                              },
                              ".MuiTablePagination-selectLabel": {
                                display: { xs: "none", sm: "block" },
                              },
                              ".MuiTablePagination-select": {
                                paddingLeft: { xs: 0, sm: "8px" },
                              },
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>

                  {/* Today's Removals Table */}
                  <Grid item xs={12} md={6}>
                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "800ms" : "0ms" }}>
                      <Card
                        sx={{
                          borderRadius: "16px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease",
                          overflow: "hidden",
                          height: "100%",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <CardHeader
                          title={
                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Box
                                sx={{
                                  width: { xs: "28px", sm: "32px" },
                                  height: { xs: "28px", sm: "32px" },
                                  borderRadius: "8px",
                                  background: "linear-gradient(135deg, #FB6340, #FBB140)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 4px 12px rgba(251, 99, 64, 0.2)",
                                }}
                              >
                                <Today sx={{ color: "white", fontSize: { xs: "1rem", sm: "1.2rem" } }} />
                              </Box>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: { xs: "1rem", sm: "1.1rem" },
                                  color: "#334155",
                                }}
                              >
                                Remoções de Hoje
                              </Typography>
                              <Chip
                                label={filteredTodayRemovals.length}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(251, 99, 64, 0.1)",
                                  color: "#FB6340",
                                  fontWeight: 600,
                                  height: "1.5rem",
                                  fontSize: "0.75rem",
                                }}
                              />
                            </Box>
                          }
                          action={
                            <IconButton
                              onClick={() => {}}
                              sx={{
                                color: "#64748b",
                                "&:hover": {
                                  color: "#FB6340",
                                  backgroundColor: "rgba(241, 245, 249, 0.8)",
                                },
                              }}
                            >
                              <Refresh />
                            </IconButton>
                          }
                          sx={{
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                            padding: { xs: "0.8rem 1rem", sm: "1rem 1.25rem" },
                          }}
                        />
                        <CardContent sx={{ padding: { xs: "0.5rem 0.8rem", sm: "0.5rem 1rem" } }}>
                          <TextField
                            size="small"
                            placeholder="Buscar remoções de hoje..."
                            fullWidth
                            value={searchToday}
                            onChange={(e) => setSearchToday(e.target.value)}
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
                                "&:hover": {
                                  backgroundColor: "rgba(241, 245, 249, 0.9)",
                                },
                                "&.Mui-focused": {
                                  backgroundColor: "white",
                                  boxShadow: "0 0 0 2px rgba(251, 99, 64, 0.2)",
                                },
                              },
                            }}
                          />
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    sx={{
                                      fontWeight: 600,
                                      color: "#64748b",
                                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                  >
                                    Motorista
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: 600,
                                      color: "#64748b",
                                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                  >
                                    Prefixo
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: 600,
                                      color: "#64748b",
                                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                  >
                                    Horário
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: 600,
                                      color: "#64748b",
                                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                  >
                                    Status
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {paginatedTodayRemovals.map((removal) => (
                                  <TableRow
                                    key={removal.id}
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "rgba(241, 245, 249, 0.5)",
                                      },
                                      transition: "background-color 0.2s",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleOpenModal(removal)}
                                  >
                                    <TableCell>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <Avatar
                                          sx={{
                                            width: { xs: 28, sm: 32 },
                                            height: { xs: 28, sm: 32 },
                                            backgroundColor: "rgba(251, 99, 64, 0.1)",
                                            color: "#FB6340",
                                            fontWeight: 600,
                                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                          }}
                                        >
                                          {removal.driver.charAt(0)}
                                        </Avatar>
                                        <Typography
                                          sx={{ fontWeight: 500, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                                        >
                                          {isMobile ? removal.driver.split(" ")[0] : removal.driver}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Chip
                                        label={removal.vehiclePrefix}
                                        size="small"
                                        sx={{
                                          backgroundColor: "rgba(251, 99, 64, 0.1)",
                                          color: "#FB6340",
                                          fontWeight: 600,
                                          height: { xs: "1.4rem", sm: "1.5rem" },
                                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                                      {removal.departureTime}
                                    </TableCell>
                                    <TableCell>{getStatusChip(removal.status)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            component="div"
                            count={filteredTodayRemovals.length}
                            page={todayPage}
                            onPageChange={handleTodayPageChange}
                            rowsPerPage={todayRowsPerPage}
                            onRowsPerPageChange={handleTodayRowsPerPageChange}
                            rowsPerPageOptions={[5, 10, 25]}
                            labelRowsPerPage={isMobile ? "" : "Linhas:"}
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                            sx={{
                              ".MuiTablePagination-actions": {
                                "& .MuiIconButton-root": {
                                  color: "#64748b",
                                  "&:hover": {
                                    backgroundColor: "rgba(251, 99, 64, 0.1)",
                                    color: "#FB6340",
                                  },
                                },
                              },
                              ".MuiTablePagination-selectLabel": {
                                display: { xs: "none", sm: "block" },
                              },
                              ".MuiTablePagination-select": {
                                paddingLeft: { xs: 0, sm: "8px" },
                              },
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>

      {/* Removal Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : "16px",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            width: "100%",
          },
        }}
      >
        {selectedRemoval && (
          <>
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #4A6FFF, #6B8CFF)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: { xs: "0.6rem 1rem", sm: "0.75rem 1.25rem" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <TruckIcon sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" } }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.1rem" } }}>
                  Detalhes da Remoção
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  color: "white",
                  padding: "0.5rem",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: "1rem" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      padding: "1rem",
                      borderRadius: "12px",
                      backgroundColor: "rgba(241, 245, 249, 0.5)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#334155",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.95rem",
                      }}
                    >
                      <Person fontSize="small" /> Informações da Equipe
                    </Typography>
                    <List disablePadding dense>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              backgroundColor: "rgba(74, 111, 255, 0.1)",
                              color: "#4A6FFF",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                            }}
                          >
                            {selectedRemoval.driver.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}>
                                {selectedRemoval.driver}
                              </Typography>
                              <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>Matrícula: 12345</Typography>
                            </Box>
                          }
                          secondary="Motorista"
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                      <Divider sx={{ my: 0.5 }} />
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              backgroundColor: "rgba(45, 206, 137, 0.1)",
                              color: "#2DCE89",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                            }}
                          >
                            C1
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}>
                                João Silva
                              </Typography>
                              <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>Matrícula: 23456</Typography>
                            </Box>
                          }
                          secondary="Coletor"
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                      <Divider sx={{ my: 0.5 }} />
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              backgroundColor: "rgba(45, 206, 137, 0.1)",
                              color: "#2DCE89",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                            }}
                          >
                            C2
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}>
                                Pedro Oliveira
                              </Typography>
                              <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>Matrícula: 34567</Typography>
                            </Box>
                          }
                          secondary="Coletor"
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      padding: "1rem",
                      borderRadius: "12px",
                      backgroundColor: "rgba(241, 245, 249, 0.5)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#334155",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.95rem",
                      }}
                    >
                      <DirectionsCar fontSize="small" /> Informações do Veículo
                    </Typography>
                    <List disablePadding dense>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <DirectionsCar fontSize="small" sx={{ color: "#4A6FFF" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={selectedRemoval.vehiclePrefix}
                          secondary="Prefixo do Veículo"
                          primaryTypographyProps={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                      <Divider sx={{ my: 0.5 }} />
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <TruckIcon fontSize="small" sx={{ color: "#4A6FFF" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={selectedRemoval.vehicle || "Caminhão Reboque"}
                          secondary="Tipo de Veículo"
                          primaryTypographyProps={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                      <Divider sx={{ my: 0.5 }} />
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <LocationOn fontSize="small" sx={{ color: "#4A6FFF" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="PA2"
                          secondary="Garagem"
                          primaryTypographyProps={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      padding: "1rem",
                      borderRadius: "12px",
                      backgroundColor: "rgba(241, 245, 249, 0.5)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#334155",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.95rem",
                      }}
                    >
                      <Info fontSize="small" /> Detalhes da Operação
                    </Typography>
                    <List disablePadding dense>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <AccessTime fontSize="small" sx={{ color: "#FB6340" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={selectedRemoval.departureTime}
                          secondary="Horário de Saída"
                          primaryTypographyProps={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                      <Divider sx={{ my: 0.5 }} />
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <Timeline fontSize="small" sx={{ color: "#FB6340" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Rota 15 - Zona Sul"
                          secondary="Rota"
                          primaryTypographyProps={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                      <Divider sx={{ my: 0.5 }} />
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <Info fontSize="small" sx={{ color: "#FB6340" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Remoção Programada"
                          secondary="Tipo de Serviço"
                          primaryTypographyProps={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      padding: "1rem",
                      borderRadius: "12px",
                      backgroundColor: "rgba(241, 245, 249, 0.5)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#334155",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.95rem",
                      }}
                    >
                      <LocationOn fontSize="small" /> Local e Observações
                    </Typography>
                    <List disablePadding dense>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <LocationOn fontSize="small" sx={{ color: "#2DCE89" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={selectedRemoval.location || "Não especificado"}
                          secondary="Local da Remoção"
                          primaryTypographyProps={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                      <Divider sx={{ my: 0.5 }} />
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <Info fontSize="small" sx={{ color: "#2DCE89" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={selectedRemoval.notes || "Sem observações"}
                          secondary="Observações"
                          primaryTypographyProps={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}
                          secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(226, 232, 240, 0.8)" }}>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: "rgba(226, 232, 240, 0.8)",
                  color: "#64748b",
                  "&:hover": {
                    borderColor: "#4A6FFF",
                    color: "#4A6FFF",
                    backgroundColor: "rgba(74, 111, 255, 0.05)",
                  },
                }}
              >
                Fechar
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  backgroundColor: "#4A6FFF",
                  boxShadow: "0 4px 12px rgba(74, 111, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "#3A5FEF",
                    boxShadow: "0 6px 16px rgba(74, 111, 255, 0.3)",
                  },
                }}
              >
                Gerar Relatório
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
