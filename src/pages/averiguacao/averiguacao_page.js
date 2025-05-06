"use client"

import { useState, useEffect, useMemo } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  IconButton,
  Box,
  Fade,
  Zoom,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
  InputBase,
  Snackbar,
  Alert,
  alpha,
  Autocomplete,
  ListItemText,
  Grid,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import {
  Refresh,
  Close,
  Menu as MenuIcon,
  MoreVert,
  Delete,
  Search,
  Edit,
  BarChart,
  Visibility,
  FilterAlt,
  ViewList,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import DetailModal from "../../components/visualizar_averiguacao"
import DataTable from "../../components/averiguacao_tabela"
import BarChartComponent from "../../components/averiguacao_grafico"

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
    main: "#3a86ff",
    light: "#5e9bff",
    dark: "#2970e6",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#4CAF50",
    light: "#81C784",
    dark: "#388E3C",
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

// Search input component
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
        width: "100%",
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
            width: "100%",
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

// Custom stat card component with dropdown filter - IMPROVED POSITIONING AND REDUCED HEIGHT
const CustomStatCard = ({
  title,
  value,
  color,
  highlight,
  pa,
  fleetTypeFilter,
  onFilterChange,
  fleetCounts,
  averiguacaoNumber,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleFilterSelect = (type) => {
    onFilterChange(pa, type)
    handleClose()
  }

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        background: "white",
        height: "100%",
        maxHeight: "120px", // Reduced height
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          background: color,
          zIndex: 1,
        },
        animation: highlight ? `${keyframes.flashHighlight} 1s ease-out` : `${keyframes.fadeIn} 0.6s ease-out`,
      }}
    >
      <CardContent sx={{ p: 1.5, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              color: alpha(color, 0.8),
              fontWeight: 600,
              fontSize: "0.7rem",
              backgroundColor: alpha(color, 0.1),
              borderRadius: "6px",
              padding: "3px 6px",
            }}
          >
            #{averiguacaoNumber}
          </Typography>
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              color: themeColors.text.secondary,
              backgroundColor: alpha(themeColors.background.default, 0.7),
              borderRadius: "6px",
              padding: "3px",
              "&:hover": {
                backgroundColor: alpha(color, 0.1),
                color: color,
              },
            }}
          >
            <FilterAlt sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            my: 0.5,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
              color: themeColors.text.primary,
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: themeColors.text.secondary,
              fontWeight: 500,
              fontSize: "0.8rem",
              textAlign: "right",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ mt: "auto", display: "flex", justifyContent: "flex-start" }}>
          <Chip
            label={fleetTypeFilter === "all" ? "Todos" : fleetTypeFilter}
            size="small"
            sx={{
              backgroundColor: alpha(color, 0.1),
              color: color,
              fontWeight: 500,
              borderRadius: "6px",
              height: "20px",
              fontSize: "0.7rem",
            }}
          />
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            minWidth: "180px",
          },
        }}
      >
        <MenuItem
          onClick={() => handleFilterSelect("all")}
          selected={fleetTypeFilter === "all"}
          sx={{
            borderRadius: "8px",
            mx: 0.5,
            my: 0.3,
            "&:hover": {
              backgroundColor: alpha(color, 0.1),
            },
            "&.Mui-selected": {
              backgroundColor: alpha(color, 0.1),
              "&:hover": {
                backgroundColor: alpha(color, 0.2),
              },
            },
          }}
        >
          <ListItemText primary="Todos os tipos" secondary={`Total: ${fleetCounts.total}`} />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {["Remoção", "Varrição", "Seletiva"].map((type) => (
          <MenuItem
            key={type}
            onClick={() => handleFilterSelect(type)}
            selected={fleetTypeFilter === type}
            sx={{
              borderRadius: "8px",
              mx: 0.5,
              my: 0.3,
              "&:hover": {
                backgroundColor: alpha(color, 0.1),
              },
              "&.Mui-selected": {
                backgroundColor: alpha(color, 0.1),
                "&:hover": {
                  backgroundColor: alpha(color, 0.2),
                },
              },
            }}
          >
            <ListItemText primary={type} secondary={`Total: ${fleetCounts[type] || 0}`} />
          </MenuItem>
        ))}
      </Menu>
    </Card>
  )
}

export default function AveriguacaoDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State variables
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [paFilter, setPaFilter] = useState("all")
  const [fleetTypeFilter, setFleetTypeFilter] = useState("all")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [highlightedStat, setHighlightedStat] = useState(null)

  // Card filter states
  const [pa1FleetFilter, setPa1FleetFilter] = useState("all")
  const [pa2FleetFilter, setPa2FleetFilter] = useState("all")
  const [pa3FleetFilter, setPa3FleetFilter] = useState("all")
  const [pa4FleetFilter, setPa4FleetFilter] = useState("all")

  // Action menu states
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Detail modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState(null)

  // Mock data
  const [inspections, setInspections] = useState([
    {
      id: 1,
      inspector: "Carlos Silva",
      date: "10/05/2023",
      time: "08:30",
      pa: "PA1",
      route: "R-101",
      fleetType: "Remoção",
      photos: ["/classic-red-pickup.png", null, null],
      observations: "Veículo em boas condições",
    },
    {
      id: 2,
      inspector: "Ana Oliveira",
      date: "11/05/2023",
      time: "09:15",
      pa: "PA2",
      route: "R-203",
      fleetType: "Varrição",
      photos: ["/classic-red-pickup.png", "/placeholder.svg?key=4qzd3", null],
      observations: "Pneus precisam ser verificados",
    },
    {
      id: 3,
      inspector: "Roberto Almeida",
      date: "12/05/2023",
      time: "10:45",
      pa: "PA3",
      route: "R-305",
      fleetType: "Seletiva",
      photos: ["/classic-red-pickup.png", null, null],
      observations: "Manutenção preventiva necessária",
    },
    {
      id: 4,
      inspector: "Mariana Costa",
      date: "13/05/2023",
      time: "14:20",
      pa: "PA4",
      route: "R-407",
      fleetType: "Remoção",
      photos: ["/classic-red-pickup.png", "/placeholder.svg?key=61fnp", "/equipment-maintenance.png"],
      observations: "Tudo em ordem",
    },
    {
      id: 5,
      inspector: "Paulo Santos",
      date: "14/05/2023",
      time: "16:00",
      pa: "PA1",
      route: "R-102",
      fleetType: "Varrição",
      photos: ["/classic-red-pickup.png", null, null],
      observations: "Verificar nível de óleo",
    },
    {
      id: 6,
      inspector: "Juliana Lima",
      date: "15/05/2023",
      time: "07:45",
      pa: "PA2",
      route: "R-204",
      fleetType: "Remoção",
      photos: ["/classic-red-pickup.png", "/placeholder.svg?key=1bbb1", null],
      observations: "Sistema hidráulico funcionando normalmente",
    },
    {
      id: 7,
      inspector: "Fernando Gomes",
      date: "16/05/2023",
      time: "11:30",
      pa: "PA3",
      route: "R-306",
      fleetType: "Seletiva",
      photos: ["/classic-red-pickup.png", null, null],
      observations: "Substituir lâmpadas de sinalização",
    },
    {
      id: 8,
      inspector: "Luciana Martins",
      date: "17/05/2023",
      time: "13:15",
      pa: "PA4",
      route: "R-408",
      fleetType: "Varrição",
      photos: ["/classic-red-pickup.png", "/placeholder.svg?key=uuzra", null],
      observations: "Freios em bom estado",
    },
  ])

  // Calculate fleet counts by PA
  const getFleetCountsByPA = (pa) => {
    const paInspections = inspections.filter((i) => i.pa === pa)

    const counts = {
      total: paInspections.length,
      Remoção: paInspections.filter((i) => i.fleetType === "Remoção").length,
      Varrição: paInspections.filter((i) => i.fleetType === "Varrição").length,
      Seletiva: paInspections.filter((i) => i.fleetType === "Seletiva").length,
    }

    return counts
  }

  // Calculate statistics
  const statsData = useMemo(() => {
    const pa1Counts = getFleetCountsByPA("PA1")
    const pa2Counts = getFleetCountsByPA("PA2")
    const pa3Counts = getFleetCountsByPA("PA3")
    const pa4Counts = getFleetCountsByPA("PA4")

    return {
      pa1Inspections: pa1FleetFilter === "all" ? pa1Counts.total : pa1Counts[pa1FleetFilter] || 0,
      pa2Inspections: pa2FleetFilter === "all" ? pa2Counts.total : pa2Counts[pa2FleetFilter] || 0,
      pa3Inspections: pa3FleetFilter === "all" ? pa3Counts.total : pa3Counts[pa3FleetFilter] || 0,
      pa4Inspections: pa4FleetFilter === "all" ? pa4Counts.total : pa4Counts[pa4FleetFilter] || 0,
      pa1Counts,
      pa2Counts,
      pa3Counts,
      pa4Counts,
      totalInspections: inspections.length,
    }
  }, [inspections, pa1FleetFilter, pa2FleetFilter, pa3FleetFilter, pa4FleetFilter])

  // Fleet type distribution data
  const fleetTypeData = useMemo(() => {
    const counts = inspections.reduce((acc, item) => {
      acc[item.fleetType] = (acc[item.fleetType] || 0) + 1
      return acc
    }, {})

    return Object.keys(counts).map((type) => ({
      name: type,
      value: counts[type],
      color:
        type === "Remoção"
          ? themeColors.primary.main
          : type === "Varrição"
            ? themeColors.success.main
            : themeColors.warning.main,
    }))
  }, [inspections])

  // Load data
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  // Handle card filter change
  const handleCardFilterChange = (pa, fleetType) => {
    switch (pa) {
      case "PA1":
        setPa1FleetFilter(fleetType)
        break
      case "PA2":
        setPa2FleetFilter(fleetType)
        break
      case "PA3":
        setPa3FleetFilter(fleetType)
        break
      case "PA4":
        setPa4FleetFilter(fleetType)
        break
      default:
        break
    }
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

  // Handle view details
  const handleViewDetails = (inspection) => {
    setSelectedInspection(inspection)
    setDetailModalOpen(true)
    handleActionMenuClose()
  }

  // Handle delete
  const handleDeleteConfirmOpen = () => {
    setDeleteConfirmOpen(true)
    setActionMenuAnchor(null)
  }

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false)
  }

  const handleDelete = () => {
    setInspections((prev) => prev.filter((item) => item.id !== selectedRowId))
    setDeleteConfirmOpen(false)
    setSnackbarMessage("Averiguação excluída com sucesso!")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)
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

  // Apply filters
  const applyFilters = () => {
    // This function applies all filters at once
    const filtered = inspections.filter((item) => {
      // Search filter
      const searchMatch =
        searchValue === "" ||
        item.inspector.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.route.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.pa.toLowerCase().includes(searchValue.toLowerCase())

      // Date filter
      let dateMatch = true
      if (selectedDate) {
        const itemDate = new Date(item.date.split("/").reverse().join("-"))
        const filterDate = new Date(selectedDate)
        dateMatch =
          itemDate.getDate() === filterDate.getDate() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
      }

      // PA filter
      const paMatch = paFilter === "all" || item.pa === paFilter

      // Fleet type filter
      const fleetMatch = fleetTypeFilter === "all" || item.fleetType === fleetTypeFilter

      return searchMatch && dateMatch && paMatch && fleetMatch
    })

    return filtered
  }

  // Filter inspections
  const filteredInspections = useMemo(() => {
    const filtered = applyFilters()

    // Apply sorting
    return filtered.sort((a, b) => {
      const factor = sortDirection === "asc" ? 1 : -1

      if (sortField === "date") {
        const dateA = new Date(a.date.split("/").reverse().join("-"))
        const dateB = new Date(b.date.split("/").reverse().join("-"))
        return factor * (dateA - dateB)
      }

      if (sortField === "inspector") {
        return factor * a.inspector.localeCompare(b.inspector)
      }

      if (sortField === "pa") {
        return factor * a.pa.localeCompare(b.pa)
      }

      if (sortField === "route") {
        return factor * a.route.localeCompare(b.route)
      }

      return 0
    })
  }, [inspections, searchValue, selectedDate, paFilter, fleetTypeFilter, sortField, sortDirection])

  // Reset all filters
  const resetFilters = () => {
    setSearchValue("")
    setSelectedDate(null)
    setPaFilter("all")
    setFleetTypeFilter("all")
    setSnackbarMessage("Filtros resetados com sucesso!")
    setSnackbarSeverity("info")
    setSnackbarOpen(true)
  }

  // Table columns configuration
  const tableColumns = [
    {
      field: "date",
      headerName: "Data",
      sortable: true,
    },
    {
      field: "pa",
      headerName: "PA",
      sortable: true,
    },
    {
      field: "route",
      headerName: "Rota",
      sortable: true,
    },
    {
      field: "inspector",
      headerName: "Averiguador",
      sortable: true,
      renderCell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: alpha(themeColors.secondary.main, 0.1),
              color: themeColors.secondary.main,
              fontWeight: 600,
            }}
          >
            {row.inspector.charAt(0)}
          </Avatar>
          <Typography sx={{ fontWeight: 500 }}>{row.inspector}</Typography>
        </Box>
      ),
    },
    {
      field: "fleetType",
      headerName: "Tipo de Frota",
      renderCell: (row) => (
        <Chip
          label={row.fleetType}
          size="small"
          sx={{
            backgroundColor: alpha(
              row.fleetType === "Remoção"
                ? themeColors.primary.main
                : row.fleetType === "Varrição"
                  ? themeColors.success.main
                  : themeColors.warning.main,
              0.1,
            ),
            color:
              row.fleetType === "Remoção"
                ? themeColors.primary.main
                : row.fleetType === "Varrição"
                  ? themeColors.success.main
                  : themeColors.warning.main,
            fontWeight: 600,
            height: "1.5rem",
            borderRadius: "12px",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      align: "center",
      renderCell: (row) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            handleActionMenuOpen(e, row.id)
          }}
          sx={{
            color: themeColors.text.secondary,
            "&:hover": {
              backgroundColor: alpha(themeColors.secondary.main, 0.1),
              color: themeColors.secondary.main,
            },
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      ),
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
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* Vertical green line instead of icon - ADJUSTED POSITION */}
                  <Box
                    sx={{
                      width: "6px",
                      height: "42px", // Reduced height
                      borderRadius: "3px",
                      background: themeColors.secondary.main,
                      mr: 2,
                      mt: 1, // Added margin top to lower the line
                      boxShadow: `0 4px 12px ${alpha(themeColors.secondary.main, 0.3)}`,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 400, // Mantendo o peso da fonte mais leve
                      fontSize: { xs: "1.35rem", sm: "1.8rem" },
                      color: themeColors.text.primary,
                      letterSpacing: "0.02em",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    SISTEMA DE AVERIGUAÇÃO
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: themeColors.text.secondary,
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    ml: { xs: "0", sm: "2.5rem" },
                    mt: "-0.3rem",
                    fontWeight: 400,
                    fontFamily: "'Roboto', sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  Controle e monitoramento de rotas e veículos
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  sx={{
                    color: themeColors.text.secondary,
                    "&:hover": { color: themeColors.secondary.main },
                  }}
                  onClick={() => {
                    setLoading(true)
                    setTimeout(() => setLoading(false), 1000)
                  }}
                >
                  <Refresh />
                </IconButton>
              </Box>
            </Toolbar>
            <Divider
              sx={{
                height: "1px",
                background: `${alpha(themeColors.secondary.main, 0.2)}`,
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
                      <CustomStatCard
                        title="Averiguações PA1"
                        value={statsData.pa1Inspections}
                        color={themeColors.primary.main}
                        highlight={highlightedStat === "pa1Inspections"}
                        pa="PA1"
                        fleetTypeFilter={pa1FleetFilter}
                        onFilterChange={handleCardFilterChange}
                        fleetCounts={statsData.pa1Counts}
                        averiguacaoNumber="1"
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                    <Box>
                      <CustomStatCard
                        title="Averiguações PA2"
                        value={statsData.pa2Inspections}
                        color={themeColors.success.main}
                        highlight={highlightedStat === "pa2Inspections"}
                        pa="PA2"
                        fleetTypeFilter={pa2FleetFilter}
                        onFilterChange={handleCardFilterChange}
                        fleetCounts={statsData.pa2Counts}
                        averiguacaoNumber="2"
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                    <Box>
                      <CustomStatCard
                        title="Averiguações PA3"
                        value={statsData.pa3Inspections}
                        color={themeColors.warning.main}
                        highlight={highlightedStat === "pa3Inspections"}
                        pa="PA3"
                        fleetTypeFilter={pa3FleetFilter}
                        onFilterChange={handleCardFilterChange}
                        fleetCounts={statsData.pa3Counts}
                        averiguacaoNumber="3"
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                    <Box>
                      <CustomStatCard
                        title="Averiguações PA4"
                        value={statsData.pa4Inspections}
                        color={themeColors.error.main}
                        highlight={highlightedStat === "pa4Inspections"}
                        pa="PA4"
                        fleetTypeFilter={pa4FleetFilter}
                        onFilterChange={handleCardFilterChange}
                        fleetCounts={statsData.pa4Counts}
                        averiguacaoNumber="4"
                      />
                    </Box>
                  </Fade>
                </Box>
              </Box>

              {/* Inspections Table */}
              <Box component="section">
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                      },
                      background: themeColors.background.card,
                      mb: 4,
                    }}
                  >
                    <CardHeader
                      title={
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Box
                            sx={{
                              width: { xs: "40px", sm: "48px" },
                              height: { xs: "40px", sm: "48px" },
                              borderRadius: "16px",
                              background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.light})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                              boxShadow: `0 6px 16px ${alpha(themeColors.secondary.main, 0.3)}`,
                            }}
                          >
                            <ViewList
                              sx={{
                                color: "white",
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                                color: themeColors.text.primary,
                                letterSpacing: "0.01em",
                                fontFamily: "'Montserrat', sans-serif",
                              }}
                            >
                              Averiguações Registradas
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                color: themeColors.text.secondary,
                                fontWeight: 400,
                                mt: 0.5,
                                fontFamily: "'Roboto', sans-serif",
                                fontStyle: "italic",
                              }}
                            >
                              Lista de todas as averiguações
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        padding: "1.5rem",
                        paddingBottom: "1rem",
                        borderBottom: `1px solid ${alpha(themeColors.divider, 0.6)}`,
                        "& .MuiCardHeader-title": {
                          fontWeight: 600,
                          fontSize: "1.125rem",
                          color: themeColors.text.primary,
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
                          }}
                        >
                          <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 2 }}>
                            <Box sx={{ flex: 1, width: "100%" }}>
                              <SearchInput
                                icon={Search}
                                placeholder="Buscar por averiguador ou rota..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                              />
                            </Box>
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
                                format="dd/MM/yyyy"
                                clearable
                                clearText="Limpar"
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
                                  Por PA:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {["all", "PA1", "PA2", "PA3", "PA4"].map((pa) => (
                                    <Chip
                                      key={pa}
                                      label={pa === "all" ? "Todos" : pa}
                                      clickable
                                      onClick={() => setPaFilter(pa)}
                                      sx={{
                                        borderRadius: "12px",
                                        fontWeight: 500,
                                        backgroundColor:
                                          paFilter === pa
                                            ? alpha(themeColors.secondary.main, 0.1)
                                            : alpha(themeColors.background.default, 0.5),
                                        color:
                                          paFilter === pa ? themeColors.secondary.main : themeColors.text.secondary,
                                        border: `1px solid ${
                                          paFilter === pa ? themeColors.secondary.main : themeColors.divider
                                        }`,
                                        "&:hover": {
                                          backgroundColor: alpha(themeColors.secondary.main, 0.1),
                                          color: themeColors.secondary.main,
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
                                  Por Tipo de Frota:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {["all", "Remoção", "Varrição", "Seletiva"].map((type) => (
                                    <Chip
                                      key={type}
                                      label={type === "all" ? "Todos" : type}
                                      clickable
                                      onClick={() => setFleetTypeFilter(type)}
                                      sx={{
                                        borderRadius: "12px",
                                        fontWeight: 500,
                                        backgroundColor:
                                          fleetTypeFilter === type
                                            ? alpha(themeColors.success.main, 0.1)
                                            : alpha(themeColors.background.default, 0.5),
                                        color:
                                          fleetTypeFilter === type
                                            ? themeColors.success.main
                                            : themeColors.text.secondary,
                                        border: `1px solid ${
                                          fleetTypeFilter === type ? themeColors.success.main : themeColors.divider
                                        }`,
                                        "&:hover": {
                                          backgroundColor: alpha(themeColors.success.main, 0.1),
                                          color: themeColors.success.main,
                                        },
                                        transition: "all 0.2s ease",
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={resetFilters}
                              startIcon={<Close />}
                              sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                borderColor: themeColors.divider,
                                color: themeColors.text.secondary,
                                "&:hover": {
                                  borderColor: themeColors.secondary.main,
                                  color: themeColors.secondary.main,
                                  backgroundColor: alpha(themeColors.secondary.main, 0.05),
                                },
                              }}
                            >
                              Limpar Filtros
                            </Button>
                          </Box>
                        </Paper>
                      </Box>

                      {/* Table Component */}
                      <DataTable
                        data={filteredInspections}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        themeColors={themeColors}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        onSort={handleSort}
                        onRowClick={handleViewDetails}
                        onActionClick={handleActionMenuOpen}
                        loading={loading}
                        columns={tableColumns}
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>

              {/* Bar Chart (replaced Pie Chart) */}
              <Box component="section" sx={{ mb: 4 }}>
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "600ms" : "0ms" }}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                      },
                      background: themeColors.background.card,
                    }}
                  >
                    <CardHeader
                      title={
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Box
                            sx={{
                              width: { xs: "40px", sm: "48px" },
                              height: { xs: "40px", sm: "48px" },
                              borderRadius: "16px",
                              background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.light})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                              boxShadow: `0 6px 16px ${alpha(themeColors.secondary.main, 0.3)}`,
                            }}
                          >
                            <BarChart
                              sx={{
                                color: "white",
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                                color: themeColors.text.primary,
                                letterSpacing: "0.01em",
                                fontFamily: "'Montserrat', sans-serif",
                              }}
                            >
                              Distribuição por Tipo de Frota
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                color: themeColors.text.secondary,
                                fontWeight: 400,
                                mt: 0.5,
                                fontFamily: "'Roboto', sans-serif",
                                fontStyle: "italic",
                              }}
                            >
                              Análise de averiguações por tipo de veículo
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        padding: "1.5rem",
                        paddingBottom: "1rem",
                        borderBottom: `1px solid ${alpha(themeColors.divider, 0.6)}`,
                        "& .MuiCardHeader-title": {
                          fontWeight: 600,
                          fontSize: "1.125rem",
                          color: themeColors.text.primary,
                        },
                      }}
                    />

                    <CardContent sx={{ padding: "1.5rem" }}>
                      {/* Bar Chart Component */}
                      <BarChartComponent
                        data={fleetTypeData}
                        themeColors={themeColors}
                        title="Tipo de Frota"
                        loading={loading}
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>

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
        <MenuItem
          onClick={() => {
            const inspection = inspections.find((item) => item.id === selectedRowId)
            if (inspection) {
              handleViewDetails(inspection)
            }
          }}
          sx={{
            borderRadius: "8px",
            py: 1,
            px: 1.5,
            "&:hover": {
              backgroundColor: alpha(themeColors.secondary.main, 0.1),
            },
          }}
        >
          <Visibility fontSize="small" sx={{ mr: 1, color: themeColors.secondary.main }} />
          Visualizar
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleActionMenuClose()
            // Edit logic would go here
          }}
          sx={{
            borderRadius: "8px",
            py: 1,
            px: 1.5,
            "&:hover": {
              backgroundColor: alpha(themeColors.info.main, 0.1),
            },
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1, color: themeColors.info.main }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={handleDeleteConfirmOpen}
          sx={{
            borderRadius: "8px",
            py: 1,
            px: 1.5,
            "&:hover": {
              backgroundColor: alpha(themeColors.error.main, 0.1),
            },
          }}
        >
          <Delete fontSize="small" sx={{ mr: 1, color: themeColors.error.main }} />
          Excluir
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "0.5rem",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
          {"Confirmar Exclusão?"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Você tem certeza que deseja excluir esta averiguação? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={handleDeleteConfirmClose}
            variant="outlined"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            autoFocus
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: `0 4px 12px ${alpha(themeColors.error.main, 0.2)}`,
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Modal */}
      <DetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        inspection={selectedInspection}
        themeColors={themeColors}
        keyframes={keyframes}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
