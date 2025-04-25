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
  alpha,
  Autocomplete,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  DirectionsCar,
  CheckCircle,
  Cancel,
  Today,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  Close,
  Person,
  Timeline,
  Menu as MenuIcon,
  WbSunny,
  ViewList,
  MoreVert,
  Share,
  Print,
  Delete,
  Group,
  Route,
  Warehouse,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Email,
  Search,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import {
  getSolturasDetalhada,
  getTotalDeRemocaoSoltasNoDia,
  getContagemRemocaoAtivos,
  getContagemRemocaoInativos,
  getContagemTotalRemocao,
  getQuantidadeSolturaEquipesDia,
  getMediaMensalDeSolturas,
  getRemocoesPorMes,
} from "../service/dashboard"
import PADistributionChart from "../components/pa"

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

// Modificar o componente SearchInput para aumentar a largura
const SearchInput = ({ icon: Icon, placeholder, value, onChange, suggestions = [] }) => {
  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      value={value}
      onChange={(_, newValue) => onChange({ target: { value: newValue || "" } })}
      onInputChange={(_, newInputValue) => onChange({ target: { value: newInputValue } })}
      sx={{
        flex: 1,
        width: "100%", // Aumentar a largura para ocupar todo o espaço disponível
      }}
      renderInput={(params) => (
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            borderRadius: "20px",
            border: `2px solid ${themeColors.divider}`,
            overflow: "hidden",
            transition: "all 0.3s ease",
            background: themeColors.background.paper,
            height: "52px",
            width: "100%", // Garantir que ocupe toda a largura
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.15)}`,
              borderColor: themeColors.primary.main,
            },
            "&:focus-within": {
              boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.2)}`,
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
              color: themeColors.primary.main,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
          <InputBase
            {...params.InputProps}
            placeholder={placeholder}
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
            inputProps={{
              ...params.inputProps,
              style: { paddingLeft: 0 },
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
      )}
      ListboxProps={{
        sx: {
          maxHeight: "300px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          mt: 1,
          "& .MuiAutocomplete-option": {
            padding: "10px 16px",
            borderRadius: "8px",
            margin: "2px 4px",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: alpha(themeColors.primary.main, 0.1),
            },
            "&.Mui-focused": {
              backgroundColor: alpha(themeColors.primary.main, 0.15),
            },
          },
        },
      }}
    />
  )
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
  const [rowsPerPage, setRowsPerPage] = useState(5)
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
  const [teamFilter, setTeamFilter] = useState("all")
  const [setDeleteConfirmClose, setSetDeleteConfirmClose] = useState(false)

  // Estados para armazenar dados da API
  const [removals, setRemovals] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [teamData, setTeamData] = useState([])

  // Vamos modificar a função loadAllData para garantir que os dados sejam processados corretamente
  const loadAllData = async () => {
    console.log("Iniciando carregamento de dados...")
    setLoading(true)
    setInitialLoading(true)

    try {
      // Carregar dados em paralelo
      const [
        solturasData,
        totalRemocaoResult,
        remocaoAtivosResult,
        remocaoInativosResult,
        remocoesDiaResult,
        equipesDiaResult,
        remocoesPorMesResult,
        mediaMensalResult,
      ] = await Promise.all([
        getSolturasDetalhada(),
        getContagemTotalRemocao(),
        getContagemRemocaoAtivos(),
        getContagemRemocaoInativos(),
        getTotalDeRemocaoSoltasNoDia(),
        getQuantidadeSolturaEquipesDia(),
        getRemocoesPorMes(),
        getMediaMensalDeSolturas(),
      ])

      console.log("Dados carregados:", {
        solturasData,
        totalRemocaoResult,
        remocaoAtivosResult,
        remocaoInativosResult,
        remocoesDiaResult,
        equipesDiaResult,
        remocoesPorMesResult,
      })

      // Formatar dados de solturas para o formato esperado pela UI
      const formattedRemovals = Array.isArray(solturasData)
        ? solturasData.map((soltura, index) => {
            // Verificar a estrutura dos dados de motorista
            console.log("Dados de motorista:", soltura.motorista)

            // Verificar a estrutura dos dados de coletores
            console.log("Dados de coletores:", soltura.coletores)

            return {
              id: index + 1,
              // Garantir que o nome do motorista seja exibido corretamente
              driver:
                typeof soltura.motorista === "object"
                  ? soltura.motorista.nome || "Não informado"
                  : soltura.motorista || "Não informado",

              driverId:
                typeof soltura.motorista === "object"
                  ? soltura.motorista.matricula || ""
                  : soltura.matricula_motorista || "",

              // Garantir que os nomes dos coletores sejam extraídos corretamente
              collectors: Array.isArray(soltura.coletores)
                ? soltura.coletores
                    .map((c) => {
                      if (typeof c === "object") {
                        return c.nome || "Não informado"
                      }
                      return c || "Não informado"
                    })
                    .filter(Boolean)
                : [],

              collectorsIds: Array.isArray(soltura.coletores)
                ? soltura.coletores
                    .map((c) => {
                      if (typeof c === "object") {
                        return c.matricula || ""
                      }
                      return ""
                    })
                    .filter(Boolean)
                : [],

              garage: soltura.garagem || "PA1",
              route: soltura.rota || "",
              vehiclePrefix: soltura.prefixo || "",
              departureTime: soltura.hora_saida_frota || "",
              status: soltura.status_frota === "Em andamento" ? "Em andamento" : "Finalizado",
              arrivalTime: soltura.hora_chegada || "",
              date: soltura.data || new Date().toISOString().split("T")[0],
              team: soltura.tipo_equipe || "",
              location:
                typeof soltura.setores === "string"
                  ? soltura.setores
                  : Array.isArray(soltura.setores)
                    ? soltura.setores.join(", ")
                    : "Não informado",
              vehicle: soltura.veiculo || "Caminhão Reboque",
              distance: "0 km",
              notes: "",
            }
          })
        : []
      // Formatar dados de equipes para o gráfico
      const formattedTeamData = equipesDiaResult?.dadosEquipes
        ? equipesDiaResult.dadosEquipes.map((item, index) => ({
            name: item.tipoEquipe || `Equipe ${index + 1}`,
            label: `${item.quantidade || 0} solturas`,
            releases: item.quantidade || 0,
            color:
              index === 0
                ? themeColors.primary.main
                : index === 1
                  ? themeColors.success.main
                  : themeColors.warning.main,
          }))
        : []

      console.log("Dados de equipe formatados:", formattedTeamData)

      // Formatar dados mensais para o gráfico
      const formattedMonthlyData = remocoesPorMesResult?.remocoes
        ? remocoesPorMesResult.remocoes.map((item) => ({
            month: item.mes,
            removals: item.total,
          }))
        : []

      console.log("Dados mensais formatados:", formattedMonthlyData)

      // Atualizar estados com os dados recebidos
      setRemovals(formattedRemovals)
      setMonthlyData(formattedMonthlyData)
      setTeamData(formattedTeamData)

      // Atualizar estatísticas
      setStatsData({
        totalVehicles: totalRemocaoResult?.totalRemocao || 0,
        activeVehicles: remocaoAtivosResult?.countRemocaoAtivos || 0,
        inactiveVehicles: remocaoInativosResult?.countRemocaoInativos || 0,
        releasedToday: remocoesDiaResult?.totalDeRemocoes || 0,
      })

      console.log("Estatísticas atualizadas:", {
        totalVehicles: totalRemocaoResult?.totalRemocao || 0,
        activeVehicles: remocaoAtivosResult?.countRemocaoAtivos || 0,
        inactiveVehicles: remocaoInativosResult?.countRemocaoInativos || 0,
        releasedToday: remocoesDiaResult?.totalDeRemocoes || 0,
      })

      // Marcar carregamento como concluído
      setChartsLoaded(true)
      setLoading(false)
      setInitialLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      // Mostrar mensagem de erro
      setSnackbarMessage("Erro ao carregar dados. Tente novamente.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)

      // Mesmo com erro, marcar carregamento como concluído
      setLoading(false)
      setInitialLoading(false)
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
  const handleDelete = async () => {
    try {
      setLoading(true)

      // Aqui seria a chamada real para a API de exclusão
      // Como não temos uma função específica para excluir, vamos simular
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Atualizar estado local
      const updatedRemovals = removals.filter((removal) => removal.id !== selectedRowId)
      setRemovals(updatedRemovals)

      // Show success message
      setSnackbarMessage("Registro removido com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)

      // Close dialog
      handleDeleteConfirmClose()
      setSelectedRowId(null)
    } catch (error) {
      console.error("Erro ao excluir:", error)
      setSnackbarMessage("Erro ao excluir registro. Tente novamente.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
    }
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

  // Função para atualizar dados
  const handleRefreshData = () => {
    loadAllData()
  }

  // Função para obter dados do gráfico de pizza
  const getPieChartData = () => {
    const statusCounts = { Finalizado: 0, "Em andamento": 0 }

    removals.forEach((removal) => {
      statusCounts[removal.status] = (statusCounts[removal.status] || 0) + 1
    })

    return [
      { name: "Finalizado", value: statusCounts["Finalizado"], color: themeColors.success.main },
      { name: "Em andamento", value: statusCounts["Em andamento"], color: themeColors.primary.main },
    ]
  }

  // Calcular dados derivados
  const pieChartData = useMemo(() => getPieChartData(), [removals])

  // Filter and sort removals data
  const filteredRemovals = useMemo(() => {
    return removals
      .filter(
        (removal) =>
          // Busca unificada em múltiplos campos
          (driverSearch === "" ||
            removal.driver?.toLowerCase().includes(driverSearch.toLowerCase()) ||
            removal.vehiclePrefix?.toLowerCase().includes(driverSearch.toLowerCase()) ||
            removal.vehiclePrefix?.toLowerCase().includes(driverSearch.toLowerCase())) &&
          (selectedDate === null || removal.date === selectedDate?.toISOString().split("T")[0]) &&
          // Update the filter function to handle the new status values
          (statusFilter === "all" ||
            (statusFilter === "completed" && removal.status === "Finalizado") ||
            (statusFilter === "in-progress" && removal.status === "Em andamento")) &&
          // Filtro por equipe
          (teamFilter === "all" ||
            (teamFilter === "team-1" && removal.team === "Equipe1(Matutino)") ||
            (teamFilter === "team-2" && removal.team === "Equipe2(Vespertino)") ||
            (teamFilter === "team-3" && removal.team === "Equipe3(Noturno)")),
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
  }, [driverSearch, selectedDate, statusFilter, teamFilter, sortField, sortDirection, removals])

  // Get paginated data
  const paginatedRemovals = filteredRemovals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Filter chart data based on selected month
  const chartData = useMemo(() => {
    if (selectedMonth === "Todos") {
      return monthlyData
    }
    return monthlyData.filter((data) => data.month === selectedMonth)
  }, [selectedMonth, monthlyData])

  // Calculate total removals
  const totalRemovalsCount = removals.length

  // Calculate monthly average
  const monthlyAverage = useMemo(() => {
    if (monthlyData.length === 0) return 0
    return Math.round(monthlyData.reduce((sum, item) => sum + item.removals, 0) / monthlyData.length)
  }, [monthlyData])

  // Obter sugestões para o campo de busca
  const searchSuggestions = useMemo(() => {
    const driverNames = [...new Set(removals.map((r) => r.driver).filter(Boolean))]
    const vehiclePrefixes = [...new Set(removals.map((r) => r.vehiclePrefix).filter(Boolean))]
    return [...driverNames, ...vehiclePrefixes]
  }, [removals])

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = monthlyData.find((item) => item.month === label)
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

  // Update the getStatusChip function to handle only "Finalizado" and "Em andamento"
  const getStatusChip = (status) => {
    if (status === "Finalizado") {
      return (
        <Chip
          label="Finalizado"
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
    } else {
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
            <BarChart data={teamData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <defs>
                {teamData.map((entry, index) => (
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
                      color: teamData[index]?.color,
                      fontWeight: 600,
                      fontSize: "14px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: alpha(teamData[index]?.color || themeColors.primary.main, 0.1),
                    }}
                  >{`${value} (${teamData[index]?.label || ""})`}</span>
                )}
              />
              <Bar dataKey="releases" name="Solturas" radius={[10, 10, 0, 0]} filter="url(#teamShadow)" barSize={50}>
                {teamData.map((entry, index) => (
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

  // Custom date picker component
  const DatePickerInput = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <DatePicker
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "white",
                },
              },
            },
          }}
        />

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
    </LocalizationProvider>
  )

  // Modifique o useEffect para usar dados de exemplo se a API falhar
  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadAllData()

        // Se após carregar os dados, ainda não temos nada, use os dados de exemplo
        setTimeout(() => {
          if (removals.length === 0) {
            console.log("Usando dados de exemplo porque a API não retornou dados")
            setChartsLoaded(true)
          }
        }, 1000)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)

        // Em caso de erro, marcar carregamento como concluído
        setChartsLoaded(true)
        setLoading(false)
        setInitialLoading(false)
      }
    }

    fetchData()
  }, [])

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
                    <DirectionsCar sx={{ color: "white", fontSize: "2rem" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1.35rem", sm: "1.8rem" },
                      color: themeColors.text.primary,
                      letterSpacing: "-0.02em",
                      background: `linear-gradient(135deg, ${themeColors.primary.dark} 0%, ${themeColors.primary.main} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    Controle de Remoção
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
                  Gerenciamento de veículos e equipes
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
                height: "3px",
                background: `linear-gradient(90deg, ${alpha(themeColors.primary.main, 0.8)}, ${alpha(themeColors.primary.light, 0.8)}, ${alpha(themeColors.primary.main, 0.8)})`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
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
                        </Box>
                      }
                      action={
                        <Box sx={{ display: "flex", gap: "0.5rem" }}>
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

                      <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            border: `1px solid ${themeColors.divider}`,
                            background: alpha(themeColors.background.paper, 0.8),
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {/* Modificar o layout da seção de pesquisa para dar mais espaço ao autocomplete */}
                          <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 2 }}>
                            {/* 1. Corrigir o input de pesquisa para usar motorista.nome da mesma forma que o autocomplete: */}
                            <Box sx={{ flex: 1, width: "100%" }}>
                              <SearchInput
                                icon={Search}
                                placeholder="Buscar por matrícula, motorista ou prefixo..."
                                value={driverSearch}
                                onChange={(e) => {
                                  setDriverSearch(e.target.value)
                                  setPrefixSearch(e.target.value)
                                }}
                                suggestions={searchSuggestions}
                              />
                            </Box>
                            {/* Substitua também o DatePicker na seção de busca */}
                            {/* Encontre o trecho com LocalizationProvider dentro do Box de busca e substitua por: */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                label="Filtrar por data"
                                value={selectedDate}
                                onChange={(newDate) => setSelectedDate(newDate)}
                                slotProps={{
                                  textField: {
                                    variant: "outlined",
                                    size: "small",
                                    sx: {
                                      minWidth: "180px",
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: "white",
                                        height: "52px",
                                      },
                                    },
                                  },
                                }}
                              />
                            </LocalizationProvider>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                color: themeColors.text.secondary,
                                fontSize: "0.85rem",
                              }}
                            >
                              Filtros:
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    color: themeColors.text.secondary,
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  Por Status:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {[
                                    { id: "all", label: "Todos", color: themeColors.text.secondary },
                                    { id: "completed", label: "Finalizado", color: themeColors.success.main },
                                    { id: "in-progress", label: "Em andamento", color: themeColors.primary.main },
                                  ].map((status) => (
                                    <Chip
                                      key={status.id}
                                      label={status.label}
                                      clickable
                                      onClick={() => setStatusFilter(status.id)}
                                      sx={{
                                        borderRadius: "12px",
                                        fontWeight: 500,
                                        backgroundColor:
                                          statusFilter === status.id
                                            ? alpha(status.color, 0.1)
                                            : alpha(themeColors.background.default, 0.5),
                                        color: statusFilter === status.id ? status.color : themeColors.text.secondary,
                                        border: `1px solid ${
                                          statusFilter === status.id ? status.color : themeColors.divider
                                        }`,
                                        "&:hover": {
                                          backgroundColor: alpha(status.color, 0.1),
                                          color: status.color,
                                        },
                                        transition: "all 0.2s ease",
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    color: themeColors.text.secondary,
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  Por Equipe:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {["Todas", "Equipe1(Matutino)", "Equipe2(Vespertino)", "Equipe3(Noturno)"].map(
                                    (team, index) => (
                                      <Chip
                                        key={team}
                                        label={team}
                                        clickable
                                        onClick={() => {
                                          // Update only the team filter
                                          if (index === 0) {
                                            setTeamFilter("all")
                                          } else {
                                            setTeamFilter(`team-${index}`)
                                          }
                                        }}
                                        sx={{
                                          borderRadius: "12px",
                                          fontWeight: 500,
                                          backgroundColor:
                                            teamFilter === (index === 0 ? "all" : `team-${index}`)
                                              ? alpha(themeColors.success.main, 0.1)
                                              : alpha(themeColors.background.default, 0.5),
                                          color:
                                            teamFilter === (index === 0 ? "all" : `team-${index}`)
                                              ? themeColors.success.main
                                              : themeColors.text.secondary,
                                          border: `1px solid ${
                                            teamFilter === (index === 0 ? "all" : `team-${index}`)
                                              ? themeColors.success.main
                                              : themeColors.divider
                                          }`,
                                          "&:hover": {
                                            backgroundColor: alpha(themeColors.success.main, 0.1),
                                            color: themeColors.success.main,
                                          },
                                          transition: "all 0.2s ease",
                                        }}
                                      />
                                    ),
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Paper>
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
                            {paginatedRemovals.length > 0 ? (
                              paginatedRemovals.map((removal) => (
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
                                        {/* Garantir que o primeiro caractere do nome do motorista seja exibido */}
                                        {(typeof removal.driver === "string" && removal.driver.charAt(0)) || "?"}
                                      </Avatar>
                                      <Typography sx={{ fontWeight: 500 }}>
                                        {/* Exibir o nome do motorista corretamente */}
                                        {isMobile
                                          ? typeof removal.driver === "string"
                                            ? removal.driver.split(" ")[0]
                                            : "-"
                                          : typeof removal.driver === "string"
                                            ? removal.driver
                                            : "-"}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={removal.vehiclePrefix || "-"}
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
                                  <TableCell>{removal.departureTime || "-"}</TableCell>
                                  <TableCell>{removal.team || "-"}</TableCell>
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
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                  <Typography variant="body1" sx={{ color: themeColors.text.secondary }}>
                                    {loading ? "Carregando dados..." : "Nenhum registro encontrado"}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
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

              {/* Team Performance and Status Charts */}
              <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 4 }}>
                {/* Team Performance Chart - Now half width */}
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
                      width: { xs: "100%", md: "50%" },
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
                          onClick={handleRefreshData}
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
                            {teamData.length > 0 ? (
                              renderTeamChart()
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "100%",
                                }}
                              >
                                <Typography sx={{ color: themeColors.text.secondary }}>
                                  Nenhum dado de equipe disponível
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Fade>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>

                {/* Status Pie Chart */}
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
                      width: { xs: "100%", md: "50%" },
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
                              background: themeColors.success.main,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                            }}
                          >
                            <PieChartIcon
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
                              Status
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                color: themeColors.text.secondary,
                                fontWeight: 400,
                              }}
                            >
                              Distribuição por status
                            </Typography>
                          </Box>
                        </Box>
                      }
                      action={
                        <IconButton
                          sx={{
                            color: themeColors.text.secondary,
                            "&:hover": { color: themeColors.success.main },
                          }}
                          onClick={handleRefreshData}
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
                                background: themeColors.success.main,
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
                            {pieChartData.length > 0 && pieChartData.some((item) => item.value > 0) ? (
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
                                    innerRadius={80}
                                    outerRadius={110}
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
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "100%",
                                }}
                              >
                                <Typography sx={{ color: themeColors.text.secondary }}>
                                  Nenhum dado de status disponível
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Fade>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>
              {/* PA Distribution Chart */}
              <Box component="section" sx={{ mb: 4 }}>
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "700ms" : "0ms" }}>
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
                              background: themeColors.info.main,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                            }}
                          >
                            <Warehouse
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
                              Distribuição por Garagem
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                color: themeColors.text.secondary,
                                fontWeight: 400,
                              }}
                            >
                              Análise de veículos por PA
                            </Typography>
                          </Box>
                        </Box>
                      }
                      action={
                        <IconButton
                          sx={{
                            color: themeColors.text.secondary,
                            "&:hover": { color: themeColors.info.main },
                          }}
                          onClick={handleRefreshData}
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
                          height: "350px",
                        }}
                      >
                        {!chartsLoaded ? (
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
                                background: themeColors.info.main,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                animation: `${keyframes.pulse} 1.5s ease-in-out infinite`,
                              }}
                            />
                          </Box>
                        ) : (
                          <PADistributionChart chartsLoaded={chartsLoaded} themeColors={themeColors} />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>

              {/* Monthly Distribution Chart - Now at the bottom */}
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
                          <IconButton
                            onClick={handleRefreshData}
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
                            {monthlyData.length > 0 ? (
                              renderChart()
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "100%",
                                }}
                              >
                                <Typography sx={{ color: themeColors.text.secondary }}>
                                  Nenhum dado mensal disponível
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Fade>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
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
                      {selectedRemoval.driver || "Não informado"}
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
                      {selectedRemoval.collectors?.join(", ") || "Não informado"}
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
                        {selectedRemoval.vehiclePrefix || "Não informado"}
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
                        {selectedRemoval.team || "Não informado"}
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
                        {selectedRemoval.route || "Não informado"}
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
                        {selectedRemoval.garage || "Não informado"}
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
                        selectedRemoval.status === "Finalizado"
                          ? alpha(themeColors.success.main, 0.1)
                          : alpha(themeColors.primary.main, 0.1),
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
                      {/* Update the status icon in the detail modal */}
                      {selectedRemoval.status === "Finalizado" ? (
                        <CheckCircle sx={{ color: themeColors.success.main }} />
                      ) : (
                        <Timeline sx={{ color: themeColors.primary.main }} />
                      )}
                      <Typography
                        sx={{
                          fontWeight: 700,
                          /* Update the status color in the detail modal */
                          color:
                            selectedRemoval.status === "Finalizado"
                              ? themeColors.success.main
                              : themeColors.primary.main,
                          fontSize: "1.1rem",
                        }}
                      >
                        {selectedRemoval.status || "Não informado"}
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
                        {selectedRemoval.location || "Não informado"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>Veículo:</Typography>
                      <Typography sx={{ fontWeight: 500, color: themeColors.text.primary, fontSize: "0.85rem" }}>
                        {selectedRemoval.vehicle || "Não informado"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                        Distância:
                      </Typography>
                      <Typography sx={{ fontWeight: 500, color: themeColors.text.primary, fontSize: "0.85rem" }}>
                        {selectedRemoval.distance || "Não informado"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>Data:</Typography>
                      <Typography sx={{ fontWeight: 500, color: themeColors.text.primary, fontSize: "0.85rem" }}>
                        {selectedRemoval.date ? new Date(selectedRemoval.date).toLocaleDateString() : "Não informado"}
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
