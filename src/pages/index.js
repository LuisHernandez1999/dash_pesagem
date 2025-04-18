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
  Sector,
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
  Badge,
  Tooltip as MuiTooltip,
  ToggleButtonGroup,
  ToggleButton,
  InputBase,
  Select,
  FormControl,
  InputLabel,
  ButtonGroup,
  Slide,
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
  WbSunny,
  Brightness3,
  Brightness5,
  DonutLarge,
  FilterList,
  Sort,
  Notifications,
  Settings,
  Tune,
  ViewModule,
  ViewList,
  ViewDay,
  MoreVert,
  Share,
  Print,
  Visibility,
  Edit,
  Delete,
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
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `,
  rotate: `
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  glow: `
    @keyframes glow {
      0% { box-shadow: 0 0 5px rgba(74, 111, 255, 0.2); }
      50% { box-shadow: 0 0 20px rgba(74, 111, 255, 0.4); }
      100% { box-shadow: 0 0 5px rgba(74, 111, 255, 0.2); }
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

// Mock data for team performance
const mockTeamData = [
  {
    name: "Equipe 1",
    label: "Matutino",
    releases: 42,
    color: "#FF9F43",
    icon: <WbSunny />,
    vehicles: 15,
    hours: 8,
  },
  {
    name: "Equipe 2",
    label: "Vespertino",
    releases: 38,
    color: "#4A6FFF",
    icon: <Brightness5 />,
    vehicles: 12,
    hours: 8,
  },
  {
    name: "Equipe 3",
    label: "Noturno",
    releases: 25,
    color: "#6C757D",
    icon: <Brightness3 />,
    vehicles: 8,
    hours: 8,
  },
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
    { name: "Concluído", value: statusCounts["Concluído"], color: "#2DCE89" },
    { name: "Em andamento", value: statusCounts["Em andamento"], color: "#4A6FFF" },
    { name: "Agendado", value: statusCounts["Agendado"], color: "#FB6340" },
  ]
}

// Area chart data
const getAreaChartData = () => {
  return mockMonthlyData.map((item) => ({
    month: item.month,
    removals: item.removals,
  }))
}

// Colors for pie chart
const COLORS = ["#2DCE89", "#4A6FFF", "#FB6340"]

export default function RemovalDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

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
  const [teamChartType, setTeamChartType] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRemoval, setSelectedRemoval] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null)
  const [viewMode, setViewMode] = useState("card")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("today")
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [selectedRowId, setSelectedRowId] = useState(null)
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

  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget)
  }

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null)
  }

  // Handle action menu
  const handleActionMenuOpen = (event, id) => {
    event.stopPropagation()
    setActionMenuAnchor(event.currentTarget)
    setSelectedRowId(id)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
    setSelectedRowId(null)
  }

  // Handle view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode)
    }
  }

  // Handle status filter change
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value)
  }

  // Handle date filter change
  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value)
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

  // Handle team chart type change
  const handleTeamChartTypeChange = (event, newValue) => {
    setTeamChartType(newValue)
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

  // Handle pie chart hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
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

  // Calculate monthly average
  const monthlyAverage = useMemo(() => {
    return Math.round(mockMonthlyData.reduce((sum, item) => sum + item.removals, 0) / mockMonthlyData.length)
  }, [])

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = mockMonthlyData.find((item) => item.month === label)
      const removals = data?.removals || 0

      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: "none",
            borderRadius: "16px",
            padding: "1.2rem",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            maxWidth: "280px",
            position: "relative",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "linear-gradient(90deg, #4A6FFF, #6B8CFF)",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.2rem",
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
              }}
            >
              <Typography sx={{ color: "#475569", fontWeight: 500, fontSize: "0.875rem" }}>Média Mensal:</Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#2DCE89",
                }}
              >
                {monthlyAverage}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }
    return null
  }

  // Custom tooltip for team chart
  const TeamChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: "none",
            borderRadius: "16px",
            padding: "1.2rem",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            maxWidth: "280px",
            position: "relative",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: `linear-gradient(90deg, ${data.color}, ${data.color}CC)`,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.2rem",
              marginBottom: "0.75rem",
              color: "#1e293b",
              borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
              paddingBottom: "0.5rem",
            }}
          >
            {`${data.name} (${data.label})`}
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
                  backgroundColor: data.color,
                }}
              />
              <Typography sx={{ color: "#475569", fontWeight: 500 }}>Solturas:</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, color: "#334155" }}>{data.releases}</Typography>
          </Box>

          <Box sx={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(226, 232, 240, 0.8)" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ color: "#475569", fontWeight: 500, fontSize: "0.875rem" }}>Veículos:</Typography>
              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "0.875rem" }}>{data.vehicles}</Typography>
            </Box>
          </Box>
        </Box>
      )
    }
    return null
  }

  // Custom active shape for pie chart
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

    return (
      <g>
        <text x={cx} y={cy - 15} textAnchor="middle" fill={fill} fontSize={18} fontWeight="bold">
          {payload.name}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" fill="#333" fontSize={16}>
          {`${value} (${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={payload.color}
          stroke="#fff"
          strokeWidth={3}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 12}
          fill={payload.color}
          stroke={payload.color}
          strokeWidth={1}
          strokeOpacity={0.8}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={payload.color} fill="none" strokeWidth={2} />
        <circle cx={ex} cy={ey} r={2} fill={payload.color} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} fill={payload.color} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          fontSize={14}
          fontWeight={500}
        >{`${value} (${(percent * 100).toFixed(0)}%)`}</text>
      </g>
    )
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
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        background: "white",
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "150px", sm: "180px" },
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "6px",
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
        },
      }}
    >
      <Box
        sx={{
          width: { xs: "60px", sm: "70px" },
          height: { xs: "60px", sm: "70px" },
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}15`,
          marginBottom: "1rem",
          transition: "all 0.3s ease",
          animation: "pulse 2s infinite",
          border: `2px solid ${color}40`,
        }}
      >
        <Icon sx={{ fontSize: { xs: 28, sm: 34 }, color: color }} />
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
              barGap={12}
              barCategoryGap={40}
            >
              <defs>
                <linearGradient id="colorRemovals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A6FFF" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6B8CFF" stopOpacity={0.8} />
                </linearGradient>
                <filter id="shadow" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4A6FFF" floodOpacity="0.2" />
                </filter>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="5 5" stroke="#e2e8f0" strokeOpacity={0.6} />
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
                radius={[8, 8, 0, 0]}
                name="Remoções"
                animationDuration={1500}
                barSize={40}
                filter="url(#shadow)"
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
              <defs>
                <linearGradient id="colorRemovals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A6FFF" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6B8CFF" stopOpacity={0.8} />
                </linearGradient>
                <filter id="glow" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" strokeOpacity={0.6} />
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
                stroke="url(#colorRemovals)"
                strokeWidth={4}
                dot={{ r: 6, fill: "#4A6FFF", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 8, fill: "#4A6FFF", strokeWidth: 2, stroke: "#ffffff" }}
                name="Remoções"
                filter="url(#glow)"
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case 2: // Pie Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {pieChartData.map((entry, index) => (
                  <filter key={`filter-${index}`} id={`glow-${index}`} height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
              </defs>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                paddingAngle={2}
                filter={`url(#glow-${activeIndex})`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#fff" 
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                layout="horizontal"
                align="center"
                wrapperStyle={{ paddingTop: 30 }}
                formatter={(value, entry, index) => (
                  <span style={{ 
                    color: pieChartData[index].color, 
                    fontWeight: 600,
                    fontSize: '14px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: `${pieChartData[index].color}15`
                  }}>
                    {value}
                  </span>
                )}
              />
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
                  <stop offset="95%" stopColor="#4A6FFF" stopOpacity={0.1} />
                </linearGradient>
                <filter id="shadow" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4A6FFF" floodOpacity="0.2" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" strokeOpacity={0.5} />
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
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRemovals)"
                name="Remoções"
                filter="url(#shadow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  // Render team chart based on selected type
  const renderTeamChart = () => {
    switch (teamChartType) {
      case 0: // Bar Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockTeamData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <defs>
                {mockTeamData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`colorTeam${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                  </linearGradient>
                ))}
                <filter id="teamShadow" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.15" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
              />
              <YAxis
                tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
              />
              <Tooltip content={<TeamChartTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={10}
                formatter={(value, entry, index) => (
                  <span
                    style={{ 
                      color: mockTeamData[index].color, 
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: `${mockTeamData[index].color}15`
                    }}
                  >{`${value} (${mockTeamData[index].label})`}</span>
                )}
              />
              <Bar dataKey="releases" name="Solturas" radius={[10, 10, 0, 0]} filter="url(#teamShadow)" barSize={50}>
                {mockTeamData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorTeam${index})`} />
                ))}
                <LabelList dataKey="releases" position="top" fill="#334155" fontSize={14} fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case 1: // Pie Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {mockTeamData.map((entry, index) => (
                  <filter key={`filter-${index}`} id={`teamGlow-${index}`} height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
              </defs>
              <Pie
                data={mockTeamData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="releases"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                paddingAngle={2}
                filter="url(#teamGlow-0)"
              >
                {mockTeamData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#fff" 
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                layout="horizontal"
                align="center"
                wrapperStyle={{ paddingTop: 30 }}
                formatter={(value, entry, index) => (
                  <span
                    style={{ 
                      color: mockTeamData[index].color, 
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: `${mockTeamData[index].color}15`
                    }}
                  >{`${value} (${mockTeamData[index].label})`}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      case 2: // Donut Chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {mockTeamData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`donutGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={`${entry.color}CC`} stopOpacity={0.8} />
                  </linearGradient>
                ))}
                <filter id="donutShadow" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.2" />
                </filter>
              </defs>
              <Pie
                data={mockTeamData}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={130}
                fill="#8884d8"
                paddingAngle={6}
                dataKey="releases"
                filter="url(#donutShadow)"
              >
                {mockTeamData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#donutGradient${index})`} 
                    stroke="#fff" 
                    strokeWidth={3}
                  />
                ))}
                <LabelList 
                  dataKey="releases" 
                  position="inside" 
                  fill="#fff" 
                  fontSize={16} 
                  fontWeight={700}
                  stroke="none"
                />
              </Pie>
              <Tooltip content={<TeamChartTooltip />} />
              <Legend
                verticalAlign="bottom"
                layout="horizontal"
                align="center"
                wrapperStyle={{ paddingTop: 30 }}
                formatter={(value, entry, index) => (
                  <span
                    style={{ 
                      color: mockTeamData[index].color, 
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: `${mockTeamData[index].color}15`
                    }}
                  >{`${value} (${mockTeamData[index].label})`}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  // Render card view for total removals
  const renderCardView = (removals, handleClick) => {
    return (
      <Grid container spacing={2}>
        {removals.map((removal) => (
          <Grid item xs={12} sm={6} md={4} key={removal.id}>
            <Card 
              sx={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                }
              }}
              onClick={() => handleClick(removal)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: "rgba(74, 111, 255, 0.1)",
                      color: "#4A6FFF",
                      fontWeight: 600,
                      mr: 1.5
                    }}
                  >
                    {removal.driver.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {removal.driver}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {removal.vehiclePrefix}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Horário:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {removal.departureTime}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Veículo:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {removal.vehicle}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  {getStatusChip(removal.status)}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {removal.location}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render timeline view for total removals
  const renderTimelineView = (removals, handleClick) => {
    return (
      <Box sx={{ position: 'relative', pl: 4 }}>
        <Box 
          sx={{ 
            position: 'absolute', 
            left: '15px', 
            top: 0, 
            bottom: 0, 
            width: '2px', 
            backgroundColor: 'rgba(226, 232, 240, 0.8)',
            zIndex: 0
          }} 
        />
        {removals.map((removal, index) => (
          <Box 
            key={removal.id} 
            sx={{ 
              position: 'relative', 
              mb: 3,
              '&:hover': {
                '& .MuiPaper-root': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                }
              }
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                left: '-15px', 
                top: '20px', 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                backgroundColor: removal.status === 'Concluído' ? '#2DCE89' : 
                                removal.status === 'Em andamento' ? '#4A6FFF' : '#FB6340',
                border: '3px solid white',
                boxShadow: '0 0 0 2px rgba(226, 232, 240, 0.8)',
                zIndex: 1
              }} 
            />
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: '16px', 
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
              onClick={() => handleClick(removal)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {removal.driver}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {removal.departureTime}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip 
                  label={removal.vehiclePrefix} 
                  size="small" 
                  sx={{ 
                    backgroundColor: "rgba(45, 206, 137, 0.1)",
                    color: "#2DCE89",
                    fontWeight: 600,
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {removal.vehicle}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {removal.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                {getStatusChip(removal.status)}
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionMenuOpen(e, removal.id);
                  }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    );
  };

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
                height: "4px",
                background: "linear-gradient(90deg, #4A6FFF, #6B8CFF, #FB6340)",
                backgroundSize: "200% 200%",
                animation: "gradientShift 15s ease infinite",
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
              <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #4A6FFF, #6B8CFF)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 16px rgba(74, 111, 255, 0.25)",
                      mr: 2,
                      animation: "float 3s ease-in-out infinite",
                    }}
                  >
                    <TruckIcon sx={{ color: "white", fontSize: "1.8rem" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1.5rem", sm: "2rem" },
                      background: "linear-gradient(90deg, #4A6FFF, #6B8CFF)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.5px",
                      animation: "fadeIn 1s ease-out",
                    }}
                  >
                    Dashboard de Remoção
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    ml: { xs: "0", sm: "4.5rem" },
                    mt: "-0.3rem",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    animation: "fadeIn 1.5s ease-out",
                  }}
                >
                  Sistema de monitoramento em tempo real • Atualizado há 5 minutos
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <MuiTooltip title="Notificações">
                  <IconButton
                    sx={{
                      color: "#64748b",
                      "&:hover": { color: "#4A6FFF" },
                    }}
                  >
                    <Badge badgeContent={3} color="primary">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </MuiTooltip>
                <MuiTooltip title="Configurações">
                  <IconButton
                    sx={{
                      color: "#64748b",
                      "&:hover": { color: "#4A6FFF" },
                    }}
                  >
                    <Settings />
                  </IconButton>
                </MuiTooltip>
              </Box>
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
                      borderRadius: "20px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 15px 50px rgba(0, 0, 0, 0.12)",
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
                              width: { xs: "36px", sm: "42px" },
                              height: { xs: "36px", sm: "42px" },
                              borderRadius: "12px",
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
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: { xs: "1.2rem", sm: "1.4rem" },
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
                                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                color: "#64748b",
                                fontWeight: 500,
                              }}
                            >
                              Análise detalhada de remoções por período
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
                            PaperProps={{
                              sx: {
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                              }
                            }}
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
                              Média Mensal: {monthlyAverage}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>

              {/* Team Performance Chart */}
              <Box component="section" sx={{ mb: 4 }}>
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
                  <Card
                    sx={{
                      borderRadius: "20px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 15px 50px rgba(0, 0, 0, 0.12)",
                      },
                      background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "6px",
                        background: "linear-gradient(90deg, #FF9F43, #FFB976)",
                        zIndex: 1,
                      },
                    }}
                  >
                    <CardHeader
                      title={
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Box
                            sx={{
                              width: { xs: "36px", sm: "42px" },
                              height: { xs: "36px", sm: "42px" },
                              borderRadius: "12px",
                              background: "linear-gradient(135deg, #FF9F43, #FFB976)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 4px 12px rgba(255, 159, 67, 0.3)",
                              animation: "pulse 2s infinite",
                            }}
                          >
                            <Timeline
                              sx={{
                                color: "white",
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                                background: "linear-gradient(90deg, #FF9F43, #FFB976)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "-0.02em",
                              }}
                            >
                              Remoção por Equipe
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                color: "#64748b",
                                fontWeight: 500,
                              }}
                            >
                              Análise comparativa de solturas por turno
                            </Typography>
                          </Box>
                        </Box>
                      }
                      action={
                        <Box sx={{ display: "flex", gap: "0.5rem" }}>
                          <IconButton
                            sx={{
                              color: "#64748b",
                              transition: "all 0.2s ease",
                              backgroundColor: "rgba(241, 245, 249, 0.5)",
                              "&:hover": {
                                color: "#FF9F43",
                                transform: "rotate(15deg)",
                                backgroundColor: "rgba(241, 245, 249, 0.8)",
                              },
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
                                color: "#FF9F43",
                                transform: "rotate(15deg)",
                                backgroundColor: "rgba(241, 245, 249, 0.8)",
                              },
                            }}
                          >
                            <Refresh />
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
                        value={teamChartType}
                        onChange={handleTeamChartTypeChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                          "& .MuiTabs-indicator": {
                            backgroundColor: "#FF9F43",
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
                              color: "#FF9F43",
                              fontWeight: 600,
                            },
                          },
                        }}
                      >
                        <Tab icon={<BarChartIcon />} label="Barras" iconPosition="start" sx={{ gap: "0.5rem" }} />
                        <Tab icon={<PieChartIcon />} label="Pizza" iconPosition="start" sx={{ gap: "0.5rem" }} />
                        <Tab icon={<DonutLarge />} label="Donut" iconPosition="start" sx={{ gap: "0.5rem" }} />
                      </Tabs>
                    </Box>
                    <CardContent sx={{ padding: "1.5rem" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: { xs: "250px", sm: "300px" },
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
                                background: "linear-gradient(135deg, #FF9F43, #FFB976)",
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
                            {renderTeamChart()}
                          </Box>
                        </Fade>
                      </Box>

                      <Box
                        sx={{
                          marginTop: "1rem",
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "1rem",
                          borderTop: "1px dashed rgba(226, 232, 240, 0.8)",
                          flexWrap: "wrap",
                          gap: "1rem",
                        }}
                      >
                        {mockTeamData.map((team, index) => (
                          <Box
                            key={team.name}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              backgroundColor: `${team.color}15`,
                              padding: "0.5rem 1rem",
                              borderRadius: "10px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                              },
                            }}
                          >
                            {team.icon}
                            <Box>
                              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: team.color }}>
                                {team.name} ({team.label})
                              </Typography>
                              <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                {team.releases} solturas • {team.vehicles} veículos
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>

              {/* Tables Section */}
              <Box component="section">
                <Box
                  sx={{
                    borderRadius: "24px",
                    background: "#ffffff",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.03)",
                    padding: { xs: "1rem", sm: "1.5rem" },
                    mb: 4,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 15px 50px rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                      flexWrap: { xs: "wrap", md: "nowrap" },
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "1.2rem", sm: "1.4rem" },
                        color: "#334155",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <ViewList sx={{ color: "#4A6FFF" }} />
                      Registros de Remoções
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleViewModeChange}
                        aria-label="view mode"
                        size="small"
                        sx={{
                          "& .MuiToggleButton-root": {
                            border: "1px solid rgba(226, 232, 240, 0.8)",
                            color: "#64748b",
                            borderRadius: "8px",
                            margin: "0 2px",
                            "&.Mui-selected": {
                              backgroundColor: "rgba(74, 111, 255, 0.1)",
                              color: "#4A6FFF",
                              fontWeight: 600,
                            },
                            "&:hover": {
                              backgroundColor: "rgba(74, 111, 255, 0.05)",
                            },
                          },
                        }}
                      >
                        <ToggleButton value="card" aria-label="card view">
                          <ViewModule fontSize="small" />
                        </ToggleButton>
                        <ToggleButton value="list" aria-label="list view">
                          <ViewList fontSize="small" />
                        </ToggleButton>
                        <ToggleButton value="timeline" aria-label="timeline view">
                          <ViewDay fontSize="small" />
                        </ToggleButton>
                      </ToggleButtonGroup>

                      <Button
                        variant="outlined"
                        startIcon={<Tune />}
                        onClick={handleFilterMenuOpen}
                        sx={{
                          borderRadius: "12px",
                          textTransform: "none",
                          borderColor: "rgba(226, 232, 240, 0.8)",
                          color: "#64748b",
                          fontWeight: 500,
                          padding: "6px 16px",
                          "&:hover": {
                            borderColor: "#4A6FFF",
                            color: "#4A6FFF",
                            backgroundColor: "rgba(74, 111, 255, 0.05)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Filtros
                      </Button>
                      <Menu
                        anchorEl={filterMenuAnchor}
                        open={Boolean(filterMenuAnchor)}
                        onClose={handleFilterMenuClose}
                        PaperProps={{
                          sx: {
                            width: "280px",
                            padding: "0.75rem",
                            borderRadius: "16px",
                            boxShadow: "0 15px 50px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            padding: "0.5rem 1rem",
                            fontWeight: 700,
                            color: "#334155",
                            fontSize: "1rem",
                            borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                            marginBottom: "0.75rem",
                            paddingBottom: "0.75rem",
                          }}
                        >
                          Filtros Avançados
                        </Typography>
                        <Box sx={{ padding: "0.5rem 1rem" }}>
                          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel id="status-filter-label">Status</InputLabel>
                            <Select
                              labelId="status-filter-label"
                              id="status-filter"
                              value={statusFilter}
                              label="Status"
                              onChange={handleStatusFilterChange}
                              sx={{
                                borderRadius: "10px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "rgba(226, 232, 240, 0.8)",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#4A6FFF",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#4A6FFF",
                                },
                              }}
                            >
                              <MenuItem value="all">Todos</MenuItem>
                              <MenuItem value="completed">Concluído</MenuItem>
                              <MenuItem value="in-progress">Em andamento</MenuItem>
                              <MenuItem value="scheduled">Agendado</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel id="date-filter-label">Período</InputLabel>
                            <Select
                              labelId="date-filter-label"
                              id="date-filter"
                              value={dateFilter}
                              label="Período"
                              onChange={handleDateFilterChange}
                              sx={{
                                borderRadius: "10px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "rgba(226, 232, 240, 0.8)",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#4A6FFF",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#4A6FFF",
                                },
                              }}
                            >
                              <MenuItem value="today">Hoje</MenuItem>
                              <MenuItem value="yesterday">Ontem</MenuItem>
                              <MenuItem value="week">Esta semana</MenuItem>
                              <MenuItem value="month">Este mês</MenuItem>
                              <MenuItem value="custom">Personalizado</MenuItem>
                            </Select>
                          </FormControl>

                          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                borderColor: "rgba(226, 232, 240, 0.8)",
                                color: "#64748b",
                                fontWeight: 500,
                              }}
                              onClick={handleFilterMenuClose}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                backgroundColor: "#4A6FFF",
                                fontWeight: 500,
                                boxShadow: "0 4px 12px rgba(74, 111, 255, 0.2)",
                                "&:hover": {
                                  backgroundColor: "#3A5FEF",
                                  boxShadow: "0 6px 16px rgba(74, 111, 255, 0.3)",
                                },
                              }}
                              onClick={handleFilterMenuClose}
                            >
                              Aplicar Filtros
                            </Button>
                          </Box>
                        </Box>
                      </Menu>
                    </Box>
                  </Box>

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
                            borderRadius: "20px",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                            transition: "all 0.3s ease",
                            overflow: "hidden",
                            height: "100%",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
                            },
                            position: "relative",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "5px",
                              background: "linear-gradient(90deg, #4A6FFF, #6B8CFF)",
                              zIndex: 1,
                            },
                          }}
                        >
                          <CardHeader
                            title={
                              <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Box
                                  sx={{
                                    width: { xs: "32px", sm: "36px" },
                                    height: { xs: "32px", sm: "36px" },
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #4A6FFF, #6B8CFF)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(74, 111, 255, 0.2)",
                                  }}
                                >
                                  <TruckIcon sx={{ color: "white", fontSize: { xs: "1.1rem", sm: "1.3rem" } }} />
                                </Box>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: "1.1rem", sm: "1.2rem" },
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
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 2,
                                backgroundColor: "rgba(241, 245, 249, 0.7)",
                                borderRadius: "16px",
                                padding: "0.75rem",
                                border: "1px solid rgba(226, 232, 240, 0.8)",
                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
                                  borderColor: "#4A6FFF50",
                                },
                              }}
                            >
                              <InputBase
                                placeholder="Buscar remoções..."
                                value={searchTotal}
                                onChange={(e) => setSearchTotal(e.target.value)}
                                sx={{
                                  ml: 1,
                                  flex: 1,
                                  fontSize: "0.875rem",
                                  color: "#334155",
                                }}
                                startAdornment={<Search sx={{ color: "#64748b", mr: 1, fontSize: "1.1rem" }} />}
                              />
                              <ButtonGroup
                                variant="outlined"
                                size="small"
                                sx={{
                                  '& .MuiButtonGroup-grouped': {
                                    borderColor: 'rgba(226, 232, 240, 0.8)',
                                    color: '#64748b',
                                    '&:hover': {
                                      backgroundColor: 'rgba(74, 111, 255, 0.05)',
                                      borderColor: '#4A6FFF50',
                                      color: '#4A6FFF',
                                    },
                                  },
                                }}
                              >
                                <Button sx={{ borderRadius: '12px 0 0 12px' }}>
                                  <Sort fontSize="small" />
                                </Button>
                                <Button sx={{ borderRadius: '0 12px 12px 0' }}>
                                  <FilterList fontSize="small" />
                                </Button>
                              </ButtonGroup>
                            </Box>
                            
                            {viewMode === "list" && (
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
                            )}
                            
                            {viewMode === "card" && renderCardView(paginatedTotalRemovals, handleOpenModal)}
                            
                            {viewMode === "timeline" && renderTimelineView(paginatedTotalRemovals, handleOpenModal)}
                            
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
                            borderRadius: "20px",
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                            transition: "all 0.3s ease",
                            overflow: "hidden",
                            height: "100%",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
                            },
                            position: "relative",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "5px",
                              background: "linear-gradient(90deg, #FB6340, #FBB140)",
                              zIndex: 1,
                            },
                          }}
                        >
                          <CardHeader
                            title={
                              <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Box
                                  sx={{
                                    width: { xs: "32px", sm: "36px" },
                                    height: { xs: "32px", sm: "36px" },
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #FB6340, #FBB140)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(251, 99, 64, 0.2)",
                                  }}
                                >
                                  <Today sx={{ color: "white", fontSize: { xs: "1.1rem", sm: "1.3rem" } }} />
                                </Box>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: "1.1rem", sm: "1.2rem" },
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
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 2,
                                backgroundColor: "rgba(241, 245, 249, 0.7)",
                                borderRadius: "16px",
                                padding: "0.75rem",
                                border: "1px solid rgba(226, 232, 240, 0.8)",
                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
                                  borderColor: "#FB634050",
                                },
                              }}
                            >
                              <InputBase
                                placeholder="Buscar remoções de hoje..."
                                value={searchToday}
                                onChange={(e) => setSearchToday(e.target.value)}
                                sx={{
                                  ml: 1,
                                  flex: 1,
                                  fontSize: "0.875rem",
                                  color: "#334155",
                                }}
                                startAdornment={<Search sx={{ color: "#64748b", mr: 1, fontSize: "1.1rem" }} />}
                              />
                              <ButtonGroup
                                variant="outlined"
                                size="small"
                                sx={{
                                  '& .MuiButtonGroup-grouped': {
                                    borderColor: 'rgba(226, 232, 240, 0.8)',
                                    color: '#64748b',
                                    '&:hover': {
                                      backgroundColor: 'rgba(251, 99, 64, 0.05)',
                                      borderColor: '#FB634050',
                                      color: '#FB6340',
                                    },
                                  },
                                }}
                              >
                                <Button sx={{ borderRadius: '12px 0 0 12px' }}>
                                  <Sort fontSize="small" />
                                </Button>
                                <Button sx={{ borderRadius: '0 12px 12px 0' }}>
                                  <FilterList fontSize="small" />
                                </Button>
                              </ButtonGroup>
                            </Box>
                            
                            {viewMode === "list" && (
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
                            )}
                            
                            {viewMode === "card" && renderCardView(paginatedTodayRemovals, handleOpenModal)}
                            
                            {viewMode === "timeline" && renderTimelineView(paginatedTodayRemovals, handleOpenModal)}
                            
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
            borderRadius: isMobile ? 0 : "20px",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            width: "100%",
          },
        }}
        TransitionComponent={Slide}
        TransitionProps={{
          direction: "up",
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
                padding: { xs: "0.8rem 1.2rem", sm: "1rem 1.5rem" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Box
                  sx={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TruckIcon sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" } }} />
                </Box>
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
            <DialogContent sx={{ padding: "1.5rem" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      padding: "1.2rem",
                      borderRadius: "16px",
                      backgroundColor: "rgba(241, 245, 249, 0.5)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: "#334155",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "1rem",
                      }}
                    >
                      <Person fontSize="small" sx={{ color: "#4A6FFF" }} /> Informações da Equipe
                    </Typography>
                    <List disablePadding dense>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "36px" }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
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
                              width: 32,
                              height: 32,
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
                              width: 32,
                              height: 32,
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
                      padding: "1.2rem",
                      borderRadius: "16px",
                      backgroundColor: "rgba(241, 245, 249, 0.5)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: "#334155",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "1rem",
                      }}
                    >
                      <DirectionsCar fontSize="small" sx={{ color: "#4A6FFF" }} /> Informações do Veículo
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
                      padding: "1.2rem",
                      borderRadius: "16px",
                      backgroundColor: "rgba(241, 245, 249, 0.5)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: "#334155",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "1rem",
                      }}
                    >
                      <Info fontSize="small" sx={{ color: "#FB6340" }} /> Detalhes da Operação
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
                      padding: "1.2rem",
                      borderRadius: "16px",
                      backgroundColor: "rgba(241, 245, 249, 0.5)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: "#334155",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "1rem",
                      }}
                    >
                      <LocationOn fontSize="small" sx={{ color: "#2DCE89" }} /> Local e Observações
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
            <DialogActions sx={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(226, 232, 240, 0.8)" }}>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                size="medium"
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: "rgba(226, 232, 240, 0.8)",
                  color: "#64748b",
                  "&:hover": {
                    borderColor: "#4A6FFF",
                    color: "#4A6FFF",
                    backgroundColor: "rgba(74, 111, 255, 0.05)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Fechar
              </Button>
              <Button
                variant="contained"
                size="medium"
                startIcon={<Print />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 500,
                  backgroundColor: "#4A6FFF",
                  boxShadow: "0 4px 12px rgba(74, 111, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "#3A5FEF",
                    boxShadow: "0 6px 16px rgba(74, 111, 255, 0.3)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Gerar Relatório
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem",
          },
        }}
      >
        <MenuItem onClick={handleActionMenuClose} sx={{ borderRadius: "8px" }}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          Ver detalhes
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose} sx={{ borderRadius: "8px" }}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose} sx={{ borderRadius: "8px" }}>
          <Print fontSize="small" sx={{ mr: 1 }} />
          Imprimir
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose} sx={{ borderRadius: "8px" }}>
          <Share fontSize="small" sx={{ mr: 1 }} />
          Compartilhar
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleActionMenuClose} sx={{ borderRadius: "8px", color: "#F5365C" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>
    </>
  )
}
