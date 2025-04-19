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
  useMediaQuery,
  useTheme,
  Slide,
  Stack,
  InputBase,
  Snackbar,
  Alert,
  LinearProgress,
  Backdrop,
  alpha,
  TextField,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  ExpandMore,
  DirectionsCar,
  CheckCircle,
  Cancel,
  Today,
  CalendarMonth,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  Close,
  Person,
  Timeline,
  Menu as MenuIcon,
  WbSunny,
  Brightness3,
  Brightness5,
  ViewList,
  MoreVert,
  Share,
  Print,
  Visibility,
  Edit,
  Delete,
  Group,
  Route,
  Warehouse,
  FileDownload,
  CalendarToday,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Email,
  Dashboard,
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
        opacity: 1;
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
    main: "#ff006e",
    light: "#ff4b93",
    dark: "#c8005a",
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
    color: themeColors.warning.main,
    icon: <WbSunny />,
    vehicles: 15,
    hours: 8,
  },
  {
    name: "Equipe 2",
    label: "Vespertino",
    releases: 38,
    color: themeColors.primary.main,
    icon: <Brightness5 />,
    vehicles: 12,
    hours: 8,
  },
  {
    name: "Equipe 3",
    label: "Noturno",
    releases: 25,
    color: themeColors.text.secondary,
    icon: <Brightness3 />,
    vehicles: 8,
    hours: 8,
  },
]

// Combined mock data for all removals
const mockAllRemovals = [
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
    team: "Equipe 1",
    garage: "Garagem Norte",
    collectors: ["João Pereira", "Miguel Santos"],
    date: "2023-05-15",
    route: "Rota 15 - Zona Sul",
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
    team: "Equipe 2",
    garage: "Garagem Sul",
    collectors: ["Roberto Almeida", "Carla Dias"],
    date: "2023-05-15",
    route: "Rota 08 - Centro",
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
    team: "Equipe 1",
    garage: "Garagem Leste",
    collectors: ["Paulo Mendes", "Fernanda Costa"],
    date: "2023-05-15",
    route: "Rota 22 - Zona Oeste",
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
    team: "Equipe 3",
    garage: "Garagem Norte",
    collectors: ["Lucas Ferreira", "Amanda Silva"],
    date: "2023-05-16",
    route: "Rota 05 - Zona Norte",
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
    team: "Equipe 2",
    garage: "Garagem Oeste",
    collectors: ["Ricardo Oliveira", "Mariana Santos"],
    date: "2023-05-16",
    route: "Rota 12 - Zona Sul",
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
    team: "Equipe 1",
    garage: "Garagem Sul",
    collectors: ["Bruno Costa", "Camila Alves"],
    date: "2023-05-16",
    route: "Rota 08 - Centro",
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
    team: "Equipe 3",
    garage: "Garagem Leste",
    collectors: ["Daniel Martins", "Juliana Rocha"],
    date: "2023-05-17",
    route: "Rota 18 - Centro",
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
    team: "Equipe 2",
    garage: "Garagem Norte",
    collectors: ["Rodrigo Lima", "Beatriz Sousa"],
    date: "2023-05-17",
    route: "Rota 09 - Zona Sul",
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
    team: "Equipe 1",
    garage: "Garagem Oeste",
    collectors: ["Felipe Dias", "Larissa Oliveira"],
    date: "2023-05-17",
    route: "Rota 14 - Zona Sul",
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
    team: "Equipe 3",
    garage: "Garagem Sul",
    collectors: ["Gustavo Pereira", "Natália Costa"],
    date: "2023-05-18",
    route: "Rota 03 - Centro",
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
    team: "Equipe 2",
    garage: "Garagem Leste",
    collectors: ["Marcelo Silva", "Isabela Santos"],
    date: "2023-05-18",
    route: "Rota 07 - Centro",
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
    team: "Equipe 1",
    garage: "Garagem Norte",
    collectors: ["André Oliveira", "Renata Lima"],
    date: "2023-05-18",
    route: "Rota 08 - Centro",
  },
  {
    id: 13,
    driver: "Carlos Silva",
    vehiclePrefix: "VR-1234",
    departureTime: "08:15",
    status: "Em andamento",
    location: "Av. Paulista, 1000",
    vehicle: "Caminhão Reboque",
    arrivalTime: "-",
    distance: "12.5 km",
    notes: "Veículo abandonado",
    team: "Equipe 1",
    garage: "Garagem Norte",
    collectors: ["João Pereira", "Miguel Santos"],
    date: "2023-05-19",
    route: "Rota 15 - Zona Sul",
  },
  {
    id: 14,
    driver: "Ana Oliveira",
    vehiclePrefix: "VR-5678",
    departureTime: "09:30",
    status: "Em andamento",
    location: "Rua Augusta, 500",
    vehicle: "Guincho Leve",
    arrivalTime: "-",
    distance: "8.2 km",
    notes: "Estacionamento proibido",
    team: "Equipe 2",
    garage: "Garagem Sul",
    collectors: ["Roberto Almeida", "Carla Dias"],
    date: "2023-05-19",
    route: "Rota 08 - Centro",
  },
  {
    id: 15,
    driver: "Roberto Santos",
    vehiclePrefix: "VR-9012",
    departureTime: "10:45",
    status: "Agendado",
    location: "Av. Brigadeiro Faria Lima, 3000",
    vehicle: "Caminhão Plataforma",
    arrivalTime: "-",
    distance: "15.7 km",
    notes: "Veículo em local de carga/descarga",
    team: "Equipe 1",
    garage: "Garagem Leste",
    collectors: ["Paulo Mendes", "Fernanda Costa"],
    date: "2023-05-19",
    route: "Rota 22 - Zona Oeste",
  },
  {
    id: 16,
    driver: "Juliana Costa",
    vehiclePrefix: "VR-3456",
    departureTime: "11:20",
    status: "Agendado",
    location: "Rua Oscar Freire, 700",
    vehicle: "Guincho Pesado",
    arrivalTime: "-",
    distance: "6.8 km",
    notes: "Bloqueando garagem",
    team: "Equipe 3",
    garage: "Garagem Norte",
    collectors: ["Lucas Ferreira", "Amanda Silva"],
    date: "2023-05-19",
    route: "Rota 05 - Zona Norte",
  },
  {
    id: 17,
    driver: "Marcos Pereira",
    vehiclePrefix: "VR-7890",
    departureTime: "13:00",
    status: "Agendado",
    location: "Av. Rebouças, 1500",
    vehicle: "Caminhão Reboque",
    arrivalTime: "-",
    distance: "10.3 km",
    notes: "Veículo em faixa exclusiva",
    team: "Equipe 2",
    garage: "Garagem Oeste",
    collectors: ["Ricardo Oliveira", "Mariana Santos"],
    date: "2023-05-19",
    route: "Rota 12 - Zona Sul",
  },
]

// Calculate driver with most removals
const getDriverWithMostRemovals = () => {
  const driverCounts = {}
  mockAllRemovals.forEach((removal) => {
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
      const driverRemoval = mockAllRemovals.find((r) => r.driver === driver)
      topVehicle = driverRemoval ? driverRemoval.vehiclePrefix : ""
    }
  })

  return { driver: topDriver, count: maxCount, vehiclePrefix: topVehicle }
}

// Pie chart data
const getPieChartData = () => {
  const statusCounts = { Concluído: 0, "Em andamento": 0, Agendado: 0 }

  mockAllRemovals.forEach((removal) => {
    statusCounts[removal.status]++
  })

  return [
    { name: "Concluído", value: statusCounts["Concluído"], color: themeColors.success.main },
    { name: "Em andamento", value: statusCounts["Em andamento"], color: themeColors.primary.main },
    { name: "Agendado", value: statusCounts["Agendado"], color: themeColors.warning.main },
  ]
}

// Area chart data
const getAreaChartData = () => {
  return mockMonthlyData.map((item) => ({
    month: item.month,
    removals: item.removals,
  }))
}

export default function RemovalDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State variables
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState("Todos")
  const [monthMenuAnchor, setMonthMenuAnchor] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
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
  const [teamChartType, setTeamChartType] = useState(0) // Default to bar chart
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRemoval, setSelectedRemoval] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null)
  const [viewMode, setViewMode] = useState("list")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [driverSearch, setDriverSearch] = useState("")
  const [prefixSearch, setPrefixSearch] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const [removals, setRemovals] = useState(mockAllRemovals)

  // 1. Add state for the new modal
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newRemoval, setNewRemoval] = useState({
    driver: "",
    driverId: "",
    collectors: ["", "", ""],
    collectorsIds: ["", "", ""],
    garage: "PA1",
    route: "",
    vehiclePrefix: "",
    departureTime: "",
    status: "Agendado",
    arrivalTime: "",
  })

  const topDriver = getDriverWithMostRemovals()
  const pieChartData = getPieChartData()
  const areaChartData = getAreaChartData()

  // Load data on component mount with animated progress
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call with progress
      const totalSteps = 5
      const stepTime = 400

      for (let step = 1; step <= totalSteps; step++) {
        await new Promise((resolve) => setTimeout(resolve, stepTime))
        setLoadingProgress(step * (100 / totalSteps))
      }

      // Set mock stats data
      setStatsData({
        totalVehicles: 120,
        activeVehicles: 85,
        inactiveVehicles: 35,
        releasedToday: 12,
      })

      // Finish initial loading animation
      await new Promise((resolve) => setTimeout(resolve, 500))
      setInitialLoading(false)

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

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
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

  // Handle delete confirmation dialog
  const handleDeleteConfirmOpen = () => {
    setDeleteConfirmOpen(true)
    setActionMenuAnchor(null)
  }

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false)
  }

  // Handle delete action
  const handleDelete = () => {
    // Filter out the selected row
    const updatedRemovals = removals.filter((removal) => removal.id !== selectedRowId)
    setRemovals(updatedRemovals)

    // Show success message
    setSnackbarMessage("Registro removido com sucesso!")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)

    // Close dialog
    handleDeleteConfirmClose()
    setSelectedRowId(null)
  }

  // Handle share menu
  const handleShareMenuOpen = (event) => {
    event.stopPropagation()
    setShareMenuAnchor(event.currentTarget)
    setActionMenuAnchor(null)
  }

  const handleShareMenuClose = () => {
    setShareMenuAnchor(null)
  }

  // Handle share action
  const handleShare = (platform) => {
    const removal = removals.find((r) => r.id === selectedRowId)
    let shareMessage = ""

    if (removal) {
      shareMessage = `Detalhes da Remoção: ${removal.driver} - ${removal.vehiclePrefix} - ${removal.status}`
    }

    // Show success message
    setSnackbarMessage(`Compartilhado via ${platform}!`)
    setSnackbarSeverity("success")
    setSnackbarOpen(true)

    // Close menu
    handleShareMenuClose()
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  // 2. Add handlers for the new modal
  const handleOpenAddModal = () => {
    setAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setAddModalOpen(false)
    setNewRemoval({
      driver: "",
      driverId: "",
      collectors: ["", "", ""],
      collectorsIds: ["", "", ""],
      garage: "PA1",
      route: "",
      vehiclePrefix: "",
      departureTime: "",
      status: "Agendado",
      arrivalTime: "",
    })
  }

  const handleNewRemovalChange = (field, value, index = null) => {
    if (index !== null) {
      // For array fields like collectors
      setNewRemoval((prev) => {
        const updated = { ...prev }
        updated[field][index] = value
        return updated
      })
    } else {
      // For simple fields
      setNewRemoval((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleAddRemoval = () => {
    // Create a new removal with a unique ID
    const newId = Math.max(...removals.map((r) => r.id)) + 1
    const newRemovalEntry = {
      ...newRemoval,
      id: newId,
      date: new Date().toISOString().split("T")[0],
      team: "Equipe 1",
      location: "Nova Localização",
      vehicle: "Caminhão Reboque",
      distance: "0 km",
      notes: "",
      // Filter out empty collectors
      collectors: newRemoval.collectors.filter((c) => c.trim() !== ""),
    }

    // Add to the removals list
    setRemovals((prev) => [newRemovalEntry, ...prev])

    // Show success message
    setSnackbarMessage("Soltura adicionada com sucesso!")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)

    // Close modal
    handleCloseAddModal()
  }

  // Filter and sort removals data
  const filteredRemovals = useMemo(() => {
    return removals
      .filter(
        (removal) =>
          (driverSearch === "" || removal.driver.toLowerCase().includes(driverSearch.toLowerCase())) &&
          (prefixSearch === "" || removal.vehiclePrefix.toLowerCase().includes(prefixSearch.toLowerCase())) &&
          (selectedDate === null || removal.date === selectedDate?.toISOString().split("T")[0]) &&
          (statusFilter === "all" ||
            (statusFilter === "completed" && removal.status === "Concluído") ||
            (statusFilter === "in-progress" && removal.status === "Em andamento") ||
            (statusFilter === "scheduled" && removal.status === "Agendado")),
      )
      .sort((a, b) => {
        const factor = sortDirection === "asc" ? 1 : -1
        if (sortField === "driver") {
          return factor * a.driver.localeCompare(b.driver)
        } else if (sortField === "vehiclePrefix") {
          return factor * a.vehiclePrefix.localeCompare(b.vehiclePrefix)
        } else if (sortField === "departureTime") {
          return factor * a.departureTime.localeCompare(b.departureTime)
        } else if (sortField === "team") {
          return factor * a.team.localeCompare(b.team)
        } else if (sortField === "status") {
          return factor * a.status.localeCompare(b.status)
        }
        return 0
      })
  }, [driverSearch, prefixSearch, selectedDate, statusFilter, sortField, sortDirection, removals])

  // Get paginated data
  const paginatedRemovals = filteredRemovals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Filter chart data based on selected month
  const chartData = useMemo(() => {
    if (selectedMonth === "Todos") {
      return mockMonthlyData
    }
    return mockMonthlyData.filter((data) => data.month === selectedMonth)
  }, [selectedMonth])

  // Calculate total removals
  const totalRemovalsCount = removals.length

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
              background: `linear-gradient(90deg, ${themeColors.primary.main}, ${themeColors.primary.light})`,
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
              color: themeColors.text.primary,
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
                  backgroundColor: themeColors.primary.main,
                }}
              />
              <Typography sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>Remoções:</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>{removals}</Typography>
          </Box>

          <Box sx={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(226, 232, 240, 0.8)" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ color: themeColors.text.secondary, fontWeight: 500, fontSize: "0.875rem" }}>
                Média Mensal:
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: themeColors.success.main,
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
              background: `linear-gradient(90deg, ${data.color}, ${alpha(data.color, 0.8)})`,
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
              color: themeColors.text.primary,
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
              <Typography sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>Solturas:</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>{data.releases}</Typography>
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
        <text x={cx} y={cy + 15} textAnchor="middle" fill={themeColors.text.primary} fontSize={16}>
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
          fill={themeColors.text.primary}
          fontSize={14}
          fontWeight={500}
        >{`${value} (${(percent * 100).toFixed(0)}%)`}</text>
      </g>
    )
  }

  // Custom stat card component - redesigned to be more modern and clean
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        background: `linear-gradient(135deg, white 0%, #fafafa 100%)`,
        height: "100%",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 15px 35px ${alpha(color, 0.2)}`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "5px",
          background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.5)})`,
          zIndex: 1,
        },
        animation: `${keyframes.fadeIn} 0.6s ease-out, ${keyframes.float} 4s ease-in-out infinite`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${alpha(color, 0.12)} 0%, ${alpha(color, 0.06)} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: `${keyframes.pulse} 3s ease-in-out infinite`,
        }}
      >
        <Icon sx={{ fontSize: 30, color: color }} />
      </Box>
      <CardContent sx={{ p: 3, pt: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2rem", sm: "2.5rem" },
            color: themeColors.text.primary,
            mb: 1,
            animation: `${keyframes.slideInUp} 0.5s ease-out`,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: themeColors.text.secondary,
            fontWeight: 500,
            fontSize: "0.95rem",
            animation: `${keyframes.slideInUp} 0.5s ease-out 0.1s both`,
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: `linear-gradient(90deg, transparent, ${alpha(color, 0.25)}, transparent)`,
            animation: `${keyframes.shimmer} 2s infinite linear`,
            backgroundSize: "200% 100%",
          }}
        />
      </CardContent>
    </Card>
  )

  // Get status chip based on status
  const getStatusChip = (status) => {
    if (status === "Concluído") {
      return (
        <Chip
          label="Concluído"
          sx={{
            backgroundColor: alpha(themeColors.success.main, 0.1),
            color: themeColors.success.main,
            fontWeight: 600,
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: alpha(themeColors.success.main, 0.2),
            },
          }}
          size="small"
        />
      )
    } else if (status === "Em andamento") {
      return (
        <Chip
          label="Em andamento"
          sx={{
            backgroundColor: alpha(themeColors.primary.main, 0.1),
            color: themeColors.primary.main,
            fontWeight: 600,
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: alpha(themeColors.primary.main, 0.2),
            },
          }}
          size="small"
        />
      )
    } else {
      return (
        <Chip
          label="Agendado"
          sx={{
            backgroundColor: alpha(themeColors.warning.main, 0.1),
            color: themeColors.warning.main,
            fontWeight: 600,
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: alpha(themeColors.warning.main, 0.2),
            },
          }}
          size="small"
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
                  <stop offset="0%" stopColor={themeColors.primary.main} stopOpacity={1} />
                  <stop offset="100%" stopColor={themeColors.primary.light} stopOpacity={0.8} />
                </linearGradient>
                <filter id="shadow" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="6"
                    floodColor={themeColors.primary.main}
                    floodOpacity="0.2"
                  />
                </filter>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="5 5" stroke={themeColors.divider} strokeOpacity={0.6} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `${value}`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(241, 245, 249, 0.5)" }} />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 20 }} />
              <ReferenceLine y={0} stroke={themeColors.divider} strokeWidth={1} />
              <Bar
                dataKey="removals"
                fill="url(#colorRemovals)"
                radius={[8, 8, 0, 0]}
                name="Remoções"
                animationDuration={1500}
                barSize={40}
                filter="url(#shadow)"
              >
                <LabelList
                  dataKey="removals"
                  position="top"
                  fill={themeColors.primary.main}
                  fontSize={12}
                  fontWeight={600}
                />
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
                  <stop offset="0%" stopColor={themeColors.primary.main} stopOpacity={1} />
                  <stop offset="100%" stopColor={themeColors.primary.light} stopOpacity={0.8} />
                </linearGradient>
                <filter id="glow" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke={themeColors.divider} strokeOpacity={0.6} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="removals"
                stroke="url(#colorRemovals)"
                strokeWidth={4}
                dot={{ r: 6, fill: themeColors.primary.main, strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 8, fill: themeColors.primary.main, strokeWidth: 2, stroke: "#ffffff" }}
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
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
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
                      color: pieChartData[index].color,
                      fontWeight: 600,
                      fontSize: "14px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: alpha(pieChartData[index].color, 0.1),
                    }}
                  >
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
                  <stop offset="5%" stopColor={themeColors.primary.main} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={themeColors.primary.main} stopOpacity={0.1} />
                </linearGradient>
                <filter id="shadow" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="6"
                    floodColor={themeColors.primary.main}
                    floodOpacity="0.2"
                  />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke={themeColors.divider} strokeOpacity={0.5} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 20 }} />
              <Area
                type="monotone"
                dataKey="removals"
                stroke={themeColors.primary.main}
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
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke={themeColors.divider} strokeOpacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
              />
              <YAxis
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: themeColors.divider, strokeWidth: 1 }}
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
                      fontSize: "14px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: alpha(mockTeamData[index].color, 0.1),
                    }}
                  >{`${value} (${mockTeamData[index].label})`}</span>
                )}
              />
              <Bar dataKey="releases" name="Solturas" radius={[10, 10, 0, 0]} filter="url(#teamShadow)" barSize={50}>
                {mockTeamData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorTeam${index})`} />
                ))}
                <LabelList
                  dataKey="releases"
                  position="top"
                  fill={themeColors.text.primary}
                  fontSize={14}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  // Initial loading screen component
  const InitialLoadingScreen = () => (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: 9999,
        flexDirection: "column",
        background: `linear-gradient(135deg, ${themeColors.primary.dark} 0%, ${themeColors.primary.main} 100%)`,
      }}
      open={initialLoading}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            position: "relative",
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.1)",
          }}
        >
          <DirectionsCar
            sx={{
              fontSize: 60,
              color: "rgba(255, 255, 255, 0.9)",
              filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              border: "3px solid rgba(255, 255, 255, 0.2)",
              borderTopColor: "rgba(255, 255, 255, 0.8)",
              animation: `${keyframes.rotate} 1.5s linear infinite`,
            }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            letterSpacing: "0.5px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          Carregando Dashboard
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            opacity: 0.8,
            maxWidth: "400px",
            lineHeight: 1.6,
          }}
        >
          Preparando dados e visualizações para o sistema de gerenciamento de remoções
        </Typography>

        <Box sx={{ width: "300px", mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={loadingProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
              },
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {loadingProgress.toFixed(0)}% completo
        </Typography>
      </Box>
    </Backdrop>
  )

  // 4. Improve the SearchInput component styling and functionality
  // Replace the SearchInput component with this improved version:
  const SearchInput = ({ icon: Icon, placeholder, value, onChange }) => (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        flex: 1,
        borderRadius: "20px",
        border: `1px solid ${themeColors.divider}`,
        overflow: "hidden",
        transition: "all 0.3s ease",
        background: themeColors.background.paper,
        height: "48px", // Increased height
        "&:hover": {
          boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.1)}`,
          borderColor: themeColors.primary.main,
        },
        "&:focus-within": {
          boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.15)}`,
          borderColor: themeColors.primary.main,
          animation: `${keyframes.glow} 2s infinite ease-in-out`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 1.5,
          pl: 2,
          color: themeColors.text.secondary,
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
      </Box>
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        sx={{
          flex: 1,
          fontSize: "1rem",
          color: themeColors.text.primary,
          py: 1,
          px: 1,
          width: "100%",
          "& input": {
            padding: "8px 0",
            transition: "all 0.2s ease",
          },
          "& input::placeholder": {
            color: themeColors.text.disabled,
            opacity: 1,
          },
        }}
      />
      {value && (
        <IconButton
          size="small"
          onClick={() => onChange({ target: { value: "" } })}
          sx={{ mr: 1, color: themeColors.text.secondary }}
        >
          <Close fontSize="small" />
        </IconButton>
      )}
    </Paper>
  )

  // Custom date picker component
  const DatePickerInput = () => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          renderInput={() => null}
          PopperProps={{
            placement: "bottom-end",
            sx: {
              "& .MuiPaper-root": {
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              },
            },
          }}
        />
        <Paper
          elevation={0}
          sx={{
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.1)}`,
              borderColor: themeColors.primary.main,
              color: themeColors.primary.main,
              transform: "translateY(-2px)",
            },
            animation: selectedDate ? `${keyframes.pulse} 3s infinite ease-in-out` : "none",
          }}
          onClick={() => document.querySelector(".MuiPickersPopper-root")?.click()}
        ></Paper>
      </LocalizationProvider>
      {selectedDate && (
        <Chip
          label={selectedDate.toLocaleDateString()}
          size="small"
          onDelete={() => setSelectedDate(null)}
          sx={{
            ml: 1,
            borderRadius: "12px",
            backgroundColor: alpha(themeColors.primary.main, 0.1),
            color: themeColors.primary.main,
            fontWeight: 500,
            height: "28px",
            animation: `${keyframes.fadeIn} 0.3s ease-out`,
          }}
        />
      )}
    </Box>
  )

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
        `}
      </style>

      {/* Initial Loading Screen */}
      <InitialLoadingScreen />

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
            backgroundColor: themeColors.background.default,
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
              <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: themeColors.primary.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                    }}
                  >
                    <Dashboard sx={{ color: "white", fontSize: "1.5rem" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                      color: themeColors.text.primary,
                    }}
                  >
                    Dashboard de Remoções
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: themeColors.text.secondary,
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    ml: { xs: "0", sm: "4.5rem" },
                    mt: "-0.3rem",
                    fontWeight: 400,
                  }}
                >
                  Todos os registros de remoções
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FileDownload />}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    borderColor: themeColors.divider,
                    color: themeColors.text.secondary,
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: themeColors.primary.main,
                      color: themeColors.primary.main,
                      backgroundColor: alpha(themeColors.primary.main, 0.05),
                    },
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  Exportar
                </Button>
                <IconButton
                  sx={{
                    color: themeColors.text.secondary,
                    "&:hover": { color: themeColors.primary.main },
                  }}
                >
                  <Refresh />
                </IconButton>
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
                        title="Veículos de remoção total"
                        value={statsData.totalVehicles}
                        icon={DirectionsCar}
                        color={themeColors.primary.main}
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                    <Box>
                      <StatCard
                        title="Veículos remoção ativos"
                        value={statsData.activeVehicles}
                        icon={CheckCircle}
                        color={themeColors.success.main}
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                    <Box>
                      <StatCard
                        title="Veículos remoção inativo"
                        value={statsData.inactiveVehicles}
                        icon={Cancel}
                        color={themeColors.error.main}
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                    <Box>
                      <StatCard
                        title="Veículos remoção soltos hoje"
                        value={statsData.releasedToday}
                        icon={Today}
                        color={themeColors.warning.main}
                      />
                    </Box>
                  </Fade>
                </Box>
              </Box>

              {/* Chart Section */}
              <Box component="section" sx={{ mb: 3 }}>
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "400ms" : "0ms" }}>
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
                            <BarChartIcon
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
                              Histórico de Remoções
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                color: themeColors.text.secondary,
                                fontWeight: 400,
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
                              height: "2rem",
                              textTransform: "none",
                              borderRadius: "12px",
                              transition: "all 0.3s ease",
                              fontWeight: 500,
                              padding: "0 0.75rem",
                              borderColor: themeColors.divider,
                              color: themeColors.text.secondary,
                              display: { xs: "none", sm: "flex" },
                              "&:hover": {
                                borderColor: themeColors.primary.main,
                                color: themeColors.primary.main,
                              },
                            }}
                          >
                            {selectedMonth}
                          </Button>
                          <IconButton
                            onClick={handleMonthMenuOpen}
                            sx={{
                              display: { xs: "flex", sm: "none" },
                              color: themeColors.text.secondary,
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
                                borderRadius: "12px",
                                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                              },
                            }}
                          >
                            <MenuItem
                              onClick={() => handleMonthChange("Todos")}
                              sx={{
                                fontSize: "0.875rem",
                                transition: "all 0.2s ease",
                                backgroundColor:
                                  selectedMonth === "Todos" ? alpha(themeColors.primary.main, 0.1) : "transparent",
                                fontWeight: selectedMonth === "Todos" ? 600 : 400,
                                "&:hover": {
                                  backgroundColor: alpha(themeColors.primary.main, 0.1),
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
                                    selectedMonth === data.month ? alpha(themeColors.primary.main, 0.1) : "transparent",
                                  fontWeight: selectedMonth === data.month ? 600 : 400,
                                  "&:hover": {
                                    backgroundColor: alpha(themeColors.primary.main, 0.1),
                                  },
                                }}
                              >
                                {data.month}
                              </MenuItem>
                            ))}
                          </Menu>
                        </Box>
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
                    <Box sx={{ padding: "0.5rem 1.5rem" }}>
                      <Tabs
                        value={chartType}
                        onChange={handleChartTypeChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                          "& .MuiTabs-indicator": {
                            backgroundColor: themeColors.primary.main,
                            height: "3px",
                            borderRadius: "3px",
                          },
                          "& .MuiTab-root": {
                            textTransform: "none",
                            minWidth: { xs: "80px", sm: "120px" },
                            fontWeight: 500,
                            color: themeColors.text.secondary,
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            "&.Mui-selected": {
                              color: themeColors.primary.main,
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
                              backgroundColor: alpha(themeColors.background.paper, 0.7),
                              zIndex: 10,
                              borderRadius: "12px",
                            }}
                          >
                            <Box
                              sx={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: themeColors.primary.main,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                animation: `${keyframes.pulse} 1.5s ease-in-out infinite`,
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
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>

              {/* Team Performance Chart */}
              <Box component="section" sx={{ mb: 3 }}>
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
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
                            <Timeline
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
                              Equipes
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                color: themeColors.text.secondary,
                                fontWeight: 400,
                              }}
                            >
                              Análise comparativa por turno
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
                          height: "300px",
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
                              backgroundColor: alpha(themeColors.background.paper, 0.7),
                              zIndex: 10,
                              borderRadius: "12px",
                            }}
                          >
                            <Box
                              sx={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: themeColors.warning.main,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                animation: `${keyframes.pulse} 1.5s ease-in-out infinite`,
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
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>

              {/* Unified Table Section */}
              <Box component="section">
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "600ms" : "0ms" }}>
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
                      mb: 4,
                    }}
                  >
                    <CardHeader
                      // 3. Modify the TableHeader section to add the "Add Release" button
                      // Find the CardHeader in the Unified Table Section and replace the title with:
                      title={
                        <Box
                          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}
                        >
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
                              <ViewList
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
                                Registros de Remoções
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                  color: themeColors.text.secondary,
                                  fontWeight: 400,
                                }}
                              >
                                Todos os registros de remoções
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<DirectionsCar />}
                            onClick={handleOpenAddModal}
                            sx={{
                              borderRadius: "12px",
                              textTransform: "none",
                              fontWeight: 600,
                              backgroundColor: themeColors.success.main,
                              boxShadow: `0 4px 12px ${alpha(themeColors.success.main, 0.2)}`,
                              "&:hover": {
                                backgroundColor: themeColors.success.dark,
                                boxShadow: `0 6px 16px ${alpha(themeColors.success.main, 0.3)}`,
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.3s ease",
                              animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                            }}
                          >
                            Adicionar Soltura
                          </Button>
                        </Box>
                      }
                      action={
                        <Box sx={{ display: "flex", gap: "0.5rem" }}>
                          <Button
                            variant="outlined"
                            startIcon={<FileDownload />}
                            sx={{
                              borderRadius: "12px",
                              textTransform: "none",
                              borderColor: themeColors.divider,
                              color: themeColors.text.secondary,
                              fontWeight: 500,
                              "&:hover": {
                                borderColor: themeColors.primary.main,
                                color: themeColors.primary.main,
                              },
                              display: { xs: "none", sm: "flex" },
                            }}
                          >
                            Exportar
                          </Button>
                          <IconButton
                            sx={{
                              color: themeColors.text.secondary,
                              "&:hover": { color: themeColors.primary.main },
                            }}
                          >
                            <Refresh />
                          </IconButton>
                        </Box>
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
                      {/* Search and Filter Section */}
                      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                        <SearchInput
                          icon={Person}
                          placeholder="Buscar por motorista..."
                          value={driverSearch}
                          onChange={(e) => setDriverSearch(e.target.value)}
                        />
                        <SearchInput
                          icon={DirectionsCar}
                          placeholder="Buscar por prefixo de veículo..."
                          value={prefixSearch}
                          onChange={(e) => setPrefixSearch(e.target.value)}
                        />
                        <DatePickerInput />
                      </Box>

                      {/* Table */}
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                onClick={() => handleSort("driver")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  color: sortField === "driver" ? themeColors.primary.main : themeColors.text.secondary,
                                  "&:hover": { color: themeColors.primary.main },
                                  borderBottom: `1px solid ${themeColors.divider}`,
                                  py: 1.5,
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
                                  color:
                                    sortField === "vehiclePrefix"
                                      ? themeColors.primary.main
                                      : themeColors.text.secondary,
                                  "&:hover": { color: themeColors.primary.main },
                                  borderBottom: `1px solid ${themeColors.divider}`,
                                  py: 1.5,
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
                                  color:
                                    sortField === "departureTime"
                                      ? themeColors.primary.main
                                      : themeColors.text.secondary,
                                  "&:hover": { color: themeColors.primary.main },
                                  borderBottom: `1px solid ${themeColors.divider}`,
                                  py: 1.5,
                                }}
                              >
                                Horário
                                <SortIndicator field="departureTime" />
                              </TableCell>
                              <TableCell
                                onClick={() => handleSort("team")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  color: sortField === "team" ? themeColors.primary.main : themeColors.text.secondary,
                                  "&:hover": { color: themeColors.primary.main },
                                  borderBottom: `1px solid ${themeColors.divider}`,
                                  py: 1.5,
                                }}
                              >
                                Equipe
                                <SortIndicator field="team" />
                              </TableCell>
                              <TableCell
                                onClick={() => handleSort("status")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  color: sortField === "status" ? themeColors.primary.main : themeColors.text.secondary,
                                  "&:hover": { color: themeColors.primary.main },
                                  borderBottom: `1px solid ${themeColors.divider}`,
                                  py: 1.5,
                                }}
                              >
                                Status
                                <SortIndicator field="status" />
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  color: themeColors.text.secondary,
                                  borderBottom: `1px solid ${themeColors.divider}`,
                                  py: 1.5,
                                  textAlign: "center",
                                }}
                              >
                                Ações
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {paginatedRemovals.map((removal) => (
                              <TableRow
                                key={removal.id}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: alpha(themeColors.background.default, 0.5),
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
                                        width: 32,
                                        height: 32,
                                        backgroundColor: alpha(themeColors.primary.main, 0.1),
                                        color: themeColors.primary.main,
                                        fontWeight: 600,
                                      }}
                                    >
                                      {removal.driver.charAt(0)}
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 500 }}>
                                      {isMobile ? removal.driver.split(" ")[0] : removal.driver}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={removal.vehiclePrefix}
                                    size="small"
                                    sx={{
                                      backgroundColor: alpha(themeColors.success.main, 0.1),
                                      color: themeColors.success.main,
                                      fontWeight: 600,
                                      height: "1.5rem",
                                      borderRadius: "12px",
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{removal.departureTime}</TableCell>
                                <TableCell>{removal.team}</TableCell>
                                <TableCell>{getStatusChip(removal.status)}</TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleActionMenuOpen(e, removal.id)
                                    }}
                                  >
                                    <MoreVert fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <TablePagination
                        component="div"
                        count={filteredRemovals.length}
                        page={page}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Linhas por página:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                        sx={{
                          ".MuiTablePagination-actions": {
                            "& .MuiIconButton-root": {
                              color: themeColors.text.secondary,
                              "&:hover": {
                                backgroundColor: alpha(themeColors.primary.main, 0.1),
                                color: themeColors.primary.main,
                              },
                            },
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>

      {/* Removal Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
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
                background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "rgba(255, 255, 255, 0.2)",
                  animation: `${keyframes.shimmer} 2s infinite linear`,
                  backgroundSize: "200% 100%",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 600,
                    width: 36,
                    height: 36,
                    mr: 1.5,
                    animation: `${keyframes.pulse} 2s infinite ease-in-out`,
                  }}
                >
                  <DirectionsCar />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
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
                    transform: "rotate(90deg)",
                    transition: "transform 0.3s ease",
                  },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: "1.5rem" }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    animation: `${keyframes.fadeIn} 0.5s ease-out, ${keyframes.slideInUp} 0.5s ease-out`,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: alpha(themeColors.primary.main, 0.1),
                      color: themeColors.primary.main,
                      fontWeight: 600,
                      width: 48,
                      height: 48,
                      boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.15)}`,
                      animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                    }}
                  >
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: themeColors.text.primary,
                        fontSize: "1.1rem",
                        animation: `${keyframes.fadeIn} 0.5s ease-out`,
                      }}
                    >
                      {selectedRemoval.driver}
                    </Typography>
                    <Typography
                      sx={{
                        color: themeColors.text.secondary,
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        animation: `${keyframes.fadeIn} 0.5s ease-out 0.1s both`,
                      }}
                    >
                      <Person fontSize="small" sx={{ fontSize: 14, opacity: 0.7 }} /> Motorista
                    </Typography>
                  </Box>
                </Box>

                <Divider
                  sx={{
                    "&::before, &::after": {
                      borderColor: themeColors.divider,
                    },
                    animation: `${keyframes.fadeIn} 0.5s ease-out 0.2s both`,
                  }}
                >
                  <Chip
                    label="Equipe"
                    size="small"
                    sx={{
                      backgroundColor: alpha(themeColors.primary.main, 0.1),
                      color: themeColors.primary.main,
                      fontWeight: 600,
                      borderRadius: "12px",
                    }}
                  />
                </Divider>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    animation: `${keyframes.fadeIn} 0.5s ease-out 0.3s both, ${keyframes.slideInUp} 0.5s ease-out 0.3s both`,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: alpha(themeColors.success.main, 0.1),
                      color: themeColors.success.main,
                      fontWeight: 600,
                      width: 48,
                      height: 48,
                      boxShadow: `0 4px 12px ${alpha(themeColors.success.main, 0.15)}`,
                      animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                    }}
                  >
                    <Group />
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: themeColors.text.primary,
                        fontSize: "1.1rem",
                      }}
                    >
                      {selectedRemoval.collectors?.join(", ")}
                    </Typography>
                    <Typography
                      sx={{
                        color: themeColors.text.secondary,
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Group fontSize="small" sx={{ fontSize: 14, opacity: 0.7 }} /> Coletores
                    </Typography>
                  </Box>
                </Box>

                <Grid
                  container
                  spacing={2}
                  sx={{
                    mt: 1,
                    animation: `${keyframes.fadeIn} 0.5s ease-out 0.4s both, ${keyframes.slideInUp} 0.5s ease-out 0.4s both`,
                  }}
                >
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: alpha(themeColors.background.default, 0.5),
                        border: `1px solid ${themeColors.divider}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        height: "100%",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                          transform: "translateY(-4px)",
                          backgroundColor: alpha(themeColors.primary.main, 0.05),
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          backgroundColor: alpha(themeColors.primary.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                          animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                        }}
                      >
                        <DirectionsCar sx={{ color: themeColors.primary.main }} />
                      </Box>
                      <Typography
                        sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem", textAlign: "center" }}
                      >
                        {selectedRemoval.vehiclePrefix}
                      </Typography>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.75rem", mt: 0.5 }}>
                        Prefixo
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: alpha(themeColors.background.default, 0.5),
                        border: `1px solid ${themeColors.divider}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        height: "100%",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                          transform: "translateY(-4px)",
                          backgroundColor: alpha(themeColors.warning.main, 0.05),
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          backgroundColor: alpha(themeColors.warning.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                          animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                        }}
                      >
                        <WbSunny sx={{ color: themeColors.warning.main }} />
                      </Box>
                      <Typography
                        sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem", textAlign: "center" }}
                      >
                        {selectedRemoval.team}
                      </Typography>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.75rem", mt: 0.5 }}>
                        Equipe
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: alpha(themeColors.background.default, 0.5),
                        border: `1px solid ${themeColors.divider}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        height: "100%",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                          transform: "translateY(-4px)",
                          backgroundColor: alpha(themeColors.error.main, 0.05),
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          backgroundColor: alpha(themeColors.error.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                          animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                        }}
                      >
                        <Route sx={{ color: themeColors.error.main }} />
                      </Box>
                      <Typography
                        sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem", textAlign: "center" }}
                      >
                        {selectedRemoval.route}
                      </Typography>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.75rem", mt: 0.5 }}>
                        Rota
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: alpha(themeColors.background.default, 0.5),
                        border: `1px solid ${themeColors.divider}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        height: "100%",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                          transform: "translateY(-4px)",
                          backgroundColor: alpha(themeColors.text.secondary, 0.05),
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          backgroundColor: alpha(themeColors.text.secondary, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                          animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                        }}
                      >
                        <Warehouse sx={{ color: themeColors.text.secondary }} />
                      </Box>
                      <Typography
                        sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem", textAlign: "center" }}
                      >
                        {selectedRemoval.garage}
                      </Typography>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.75rem", mt: 0.5 }}>
                        Garagem
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 1,
                    animation: `${keyframes.fadeIn} 0.5s ease-out 0.5s both, ${keyframes.slideInUp} 0.5s ease-out 0.5s both`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      p: 2,
                      borderRadius: "16px",
                      backgroundColor:
                        selectedRemoval.status === "Concluído"
                          ? alpha(themeColors.success.main, 0.1)
                          : selectedRemoval.status === "Em andamento"
                            ? alpha(themeColors.primary.main, 0.1)
                            : alpha(themeColors.warning.main, 0.1),
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: themeColors.text.secondary }}>
                      Status
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {selectedRemoval.status === "Concluído" ? (
                        <CheckCircle sx={{ color: themeColors.success.main }} />
                      ) : selectedRemoval.status === "Em andamento" ? (
                        <Timeline sx={{ color: themeColors.primary.main }} />
                      ) : (
                        <CalendarToday sx={{ color: themeColors.warning.main }} />
                      )}
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color:
                            selectedRemoval.status === "Concluído"
                              ? themeColors.success.main
                              : selectedRemoval.status === "Em andamento"
                                ? themeColors.primary.main
                                : themeColors.warning.main,
                          fontSize: "1.1rem",
                        }}
                      >
                        {selectedRemoval.status}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 1,
                    animation: `${keyframes.fadeIn} 0.5s ease-out 0.6s both, ${keyframes.slideInUp} 0.5s ease-out 0.6s both`,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      backgroundColor: alpha(themeColors.background.default, 0.5),
                      border: `1px solid ${themeColors.divider}`,
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: themeColors.text.secondary, mb: 1 }}>
                      Informações adicionais
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                        Localização:
                      </Typography>
                      <Typography sx={{ fontWeight: 500, color: themeColors.text.primary, fontSize: "0.85rem" }}>
                        {selectedRemoval.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>Veículo:</Typography>
                      <Typography sx={{ fontWeight: 500, color: themeColors.text.primary, fontSize: "0.85rem" }}>
                        {selectedRemoval.vehicle}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                        Distância:
                      </Typography>
                      <Typography sx={{ fontWeight: 500, color: themeColors.text.primary, fontSize: "0.85rem" }}>
                        {selectedRemoval.distance}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>Data:</Typography>
                      <Typography sx={{ fontWeight: 500, color: themeColors.text.primary, fontSize: "0.85rem" }}>
                        {new Date(selectedRemoval.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{
                padding: "1rem 1.5rem",
                borderTop: `1px solid ${themeColors.divider}`,
                justifyContent: "space-between",
                background: alpha(themeColors.background.default, 0.5),
              }}
            >
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                size="medium"
                startIcon={<Close />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: themeColors.divider,
                  color: themeColors.text.secondary,
                  "&:hover": {
                    borderColor: themeColors.primary.main,
                    color: themeColors.primary.main,
                    backgroundColor: alpha(themeColors.primary.main, 0.05),
                  },
                }}
              >
                Fechar
              </Button>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<Share />}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 500,
                    borderColor: themeColors.primary.main,
                    color: themeColors.primary.main,
                    "&:hover": {
                      backgroundColor: alpha(themeColors.primary.main, 0.05),
                      boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.1)}`,
                    },
                  }}
                >
                  Compartilhar
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<Print />}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 500,
                    backgroundColor: themeColors.primary.main,
                    boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.2)}`,
                    "&:hover": {
                      backgroundColor: themeColors.primary.dark,
                      boxShadow: `0 6px 16px ${alpha(themeColors.primary.main, 0.3)}`,
                    },
                  }}
                >
                  Imprimir
                </Button>
              </Box>
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
        <MenuItem onClick={handleShareMenuOpen} sx={{ borderRadius: "8px" }}>
          <Share fontSize="small" sx={{ mr: 1 }} />
          Compartilhar
        </MenuItem>
        <MenuItem
          onClick={handleDeleteConfirmOpen}
          sx={{
            borderRadius: "8px",
          }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Exclusão?"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Você tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Menu */}
      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={handleShareMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem",
          },
        }}
      >
        <MenuItem onClick={() => handleShare("Facebook")} sx={{ borderRadius: "8px" }}>
          <Facebook fontSize="small" sx={{ mr: 1 }} />
          Facebook
        </MenuItem>
        <MenuItem onClick={() => handleShare("Twitter")} sx={{ borderRadius: "8px" }}>
          <Twitter fontSize="small" sx={{ mr: 1 }} />
          Twitter
        </MenuItem>
        <MenuItem onClick={() => handleShare("LinkedIn")} sx={{ borderRadius: "8px" }}>
          <LinkedIn fontSize="small" sx={{ mr: 1 }} />
          LinkedIn
        </MenuItem>
        <MenuItem onClick={() => handleShare("WhatsApp")} sx={{ borderRadius: "8px" }}>
          <WhatsApp fontSize="small" sx={{ mr: 1 }} />
          WhatsApp
        </MenuItem>
        <MenuItem onClick={() => handleShare("Email")} sx={{ borderRadius: "8px" }}>
          <Email fontSize="small" sx={{ mr: 1 }} />
          Email
        </MenuItem>
      </Menu>

      {/* Snackbar */}
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

      {/* 6. Add the new modal for adding a release */}
      {/* Add this at the end of the component, before the closing return tag: */}
      {/* Add Release Modal */}
      <Dialog
        open={addModalOpen}
        onClose={handleCloseAddModal}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
          },
        }}
        TransitionComponent={Slide}
        TransitionProps={{
          direction: "up",
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${themeColors.success.main} 0%, ${themeColors.success.light} 100%)`,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "rgba(255, 255, 255, 0.2)",
              animation: `${keyframes.shimmer} 2s infinite linear`,
              backgroundSize: "200% 100%",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 600,
                width: 36,
                height: 36,
                mr: 1.5,
                animation: `${keyframes.pulse} 2s infinite ease-in-out`,
              }}
            >
              <DirectionsCar />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Adicionar Nova Soltura
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseAddModal}
            sx={{
              color: "white",
              padding: "0.5rem",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transform: "rotate(90deg)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: "1.5rem" }}>
          <Grid container spacing={3}>
            {/* Driver Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: themeColors.text.primary }}>
                Informações do Motorista
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome do Motorista"
                    variant="outlined"
                    value={newRemoval.driver}
                    onChange={(e) => handleNewRemovalChange("driver", e.target.value)}
                    InputProps={{
                      sx: {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Matrícula do Motorista"
                    variant="outlined"
                    value={newRemoval.driverId}
                    onChange={(e) => handleNewRemovalChange("driverId", e.target.value)}
                    InputProps={{
                      sx: {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Collectors Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: themeColors.text.primary }}>
                Informações dos Coletores (até 3)
              </Typography>
              <Grid container spacing={2}>
                {[0, 1, 2].map((index) => (
                  <Grid item xs={12} key={index}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={`Nome do Coletor ${index + 1}`}
                          variant="outlined"
                          value={newRemoval.collectors[index]}
                          onChange={(e) => handleNewRemovalChange("collectors", e.target.value, index)}
                          InputProps={{
                            sx: {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={`Matrícula do Coletor ${index + 1}`}
                          variant="outlined"
                          value={newRemoval.collectorsIds[index]}
                          onChange={(e) => handleNewRemovalChange("collectorsIds", e.target.value, index)}
                          InputProps={{
                            sx: {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Vehicle and Route Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: themeColors.text.primary }}>
                Informações do Veículo e Rota
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Garagem"
                    variant="outlined"
                    value={newRemoval.garage}
                    onChange={(e) => handleNewRemovalChange("garage", e.target.value)}
                    InputProps={{
                      sx: {
                        borderRadius: "12px",
                      },
                    }}
                  >
                    {["PA1", "PA2", "PA3", "PA4"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Prefixo do Veículo"
                    variant="outlined"
                    value={newRemoval.vehiclePrefix}
                    onChange={(e) => handleNewRemovalChange("vehiclePrefix", e.target.value)}
                    InputProps={{
                      sx: {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Rota"
                    variant="outlined"
                    value={newRemoval.route}
                    onChange={(e) => handleNewRemovalChange("route", e.target.value)}
                    InputProps={{
                      sx: {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Time and Status Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: themeColors.text.primary }}>
                Horário e Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Horário de Saída"
                    variant="outlined"
                    type="time"
                    value={newRemoval.departureTime}
                    onChange={(e) => handleNewRemovalChange("departureTime", e.target.value)}
                    InputProps={{
                      sx: {
                        borderRadius: "12px",
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    variant="outlined"
                    value={newRemoval.status}
                    onChange={(e) => handleNewRemovalChange("status", e.target.value)}
                    InputProps={{
                      sx: {
                        borderRadius: "12px",
                      },
                    }}
                  >
                    {["Agendado", "Em andamento", "Concluído"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Horário de Chegada"
                    variant="outlined"
                    type="time"
                    value={newRemoval.arrivalTime}
                    onChange={(e) => handleNewRemovalChange("arrivalTime", e.target.value)}
                    disabled={newRemoval.status !== "Concluído"}
                    InputProps={{
                      sx: {
                        borderRadius: "12px",
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${themeColors.divider}`,
            justifyContent: "space-between",
            background: alpha(themeColors.background.default, 0.5),
          }}
        >
          <Button
            onClick={handleCloseAddModal}
            variant="outlined"
            size="medium"
            startIcon={<Close />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 500,
              borderColor: themeColors.divider,
              color: themeColors.text.secondary,
              "&:hover": {
                borderColor: themeColors.primary.main,
                color: themeColors.primary.main,
                backgroundColor: alpha(themeColors.primary.main, 0.05),
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="medium"
            startIcon={<DirectionsCar />}
            onClick={handleAddRemoval}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: themeColors.success.main,
              boxShadow: `0 4px 12px ${alpha(themeColors.success.main, 0.2)}`,
              "&:hover": {
                backgroundColor: themeColors.success.dark,
                boxShadow: `0 6px 16px ${alpha(themeColors.success.main, 0.3)}`,
              },
            }}
          >
            Adicionar Soltura
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
