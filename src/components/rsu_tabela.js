"use client"

import { useState, useMemo } from "react"
import {
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
  Menu,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  alpha,
  Autocomplete,
  InputBase,
  CircularProgress,
} from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
  Delete,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  Close,
  Edit,
  Search,
  Refresh,
  LocationOn,
} from "@mui/icons-material"
import RegisterModal from "./registro_remocao"
import EditModal from "./editar_remocao"
import DetailModal from "./visualizar_remocao"
import SolturaDetailModal from "./visualizar_remocao"

// Componente SearchInput
const SearchInput = ({ icon: Icon, placeholder, value, onChange, suggestions = [], themeColors, keyframes }) => {
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
            border: `2px solid ${themeColors.success.light}`,
            overflow: "hidden",
            transition: "all 0.3s ease",
            background: themeColors.background.paper,
            height: "52px",
            width: "100%",
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(themeColors.success.light, 0.15)}`,
              borderColor: themeColors.success.main,
            },
            "&:focus-within": {
              boxShadow: `0 4px 12px ${alpha(themeColors.success.light, 0.2)}`,
              borderColor: themeColors.success.main,
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

const RSUTable = ({ rsuData = [], loading: initialLoading, themeColors, keyframes, onRefresh }) => {
  // State variables
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortField, setSortField] = useState("horaSaidaFrota")
  const [sortDirection, setSortDirection] = useState("asc")
  const [driverSearch, setDriverSearch] = useState("")
  const [prefixSearch, setPrefixSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const [recentlyRegisteredFilter, setRecentlyRegisteredFilter] = useState(false)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [selectedRemoval, setSelectedRemoval] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [registerFormData, setRegisterFormData] = useState({
    driver: "",
    driverId: "",
    team: "Equipe1(Matutino)",
    vehiclePrefix: "",
    shift: "Manhã",
    collectors: ["", "", ""],
    vehicleType: "Caminhão Reboque",
    garage: "PA1",
    route: "",
    leaders: ["", ""],
    leaderPhones: ["", ""],
  })

  // Novo estado para o modal de detalhes da soltura
  const [solturaModalOpen, setSolturaModalOpen] = useState(false)
  const [selectedSolturaId, setSelectedSolturaId] = useState(null)

  // State for API data
  const [loading, setLoading] = useState(initialLoading || false)

  // Handle refresh
  const handleRefresh = () => {
    if (onRefresh) onRefresh()
  }

  // Handle save edit
  const handleSaveEdit = (editedData) => {
    try {
      setSnackbarMessage("Registro atualizado com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      setEditModalOpen(false)
      setDetailModalOpen(false)
    } catch (error) {
      setSnackbarMessage("Erro ao atualizar registro. Tente novamente.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  // Handle modal open
  const handleOpenModal = (removal) => {
    if (removal && removal.id) {
      const itemId = removal.id
      setSelectedSolturaId(itemId)
      setSolturaModalOpen(true)
    } else {
      setSelectedRemoval(removal)
      setDetailModalOpen(true)
    }
  }

  // Handle delete action
  const handleDelete = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSnackbarMessage("Registro removido com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      handleDeleteConfirmClose()
      setSelectedRowId(null)
    } catch (error) {
      setSnackbarMessage("Erro ao excluir registro. Tente novamente.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  // Handle soltura deletion callback
  const handleSolturaDeleted = (deletedSolturaId) => {
    setSolturaModalOpen(false)
    setSelectedSolturaId(null)
    setSnackbarMessage("Registro removido com sucesso!")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)
  }

  // Handle register submit
  const handleRegisterSubmit = async () => {
    try {
      setSnackbarMessage("Soltura cadastrada com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      setRegisterModalOpen(false)
      setRegisterFormData({
        driver: "",
        driverId: "",
        team: "Equipe1(Matutino)",
        vehiclePrefix: "",
        shift: "Manhã",
        collectors: ["", "", ""],
        vehicleType: "Caminhão Reboque",
        garage: "PA1",
        route: "",
        leaders: ["", ""],
        leaderPhones: ["", ""],
      })
    } catch (error) {
      setSnackbarMessage("Erro ao cadastrar soltura. Tente novamente.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  // Handle recently registered filter toggle
  const handleRecentlyRegisteredFilterChange = () => {
    setRecentlyRegisteredFilter((prev) => !prev)
    setPage(0)
  }

  // Filter and sort removals data - OTIMIZADO (removidos console.logs)
  const filteredRemovals = useMemo(() => {
    // Se não há dados, retorna array vazio
    if (!rsuData || rsuData.length === 0) return []

    const currentDate = new Date()
    const oneDayAgo = new Date(currentDate)
    oneDayAgo.setDate(currentDate.getDate() - 1)

    return rsuData
      .filter((removal) => {
        // Unified search - AJUSTADO para usar os campos corretos do dashboard
        const searchMatch =
          driverSearch === "" ||
          (removal.motorista && removal.motorista.toLowerCase().includes(driverSearch.toLowerCase())) ||
          (removal.prefixo && removal.prefixo.toLowerCase().includes(driverSearch.toLowerCase()))

        // Date check
        let dateMatch = true
        if (selectedDate !== null) {
          const removalDate = new Date(removal.data)
          removalDate.setHours(0, 0, 0, 0)
          const filterDate = new Date(selectedDate)
          filterDate.setHours(0, 0, 0, 0)
          dateMatch = removalDate.getTime() === filterDate.getTime()
        }

        // Status filter - AJUSTADO para usar statusFrota
        const statusMatch =
          statusFilter === "all" ||
          (statusFilter === "completed" &&
            (removal.statusFrota?.toLowerCase().includes("finaliz") ||
              removal.statusFrota?.toLowerCase() === "finalizada")) ||
          (statusFilter === "in-progress" &&
            (removal.statusFrota?.toLowerCase().includes("andamento") ||
              removal.statusFrota?.toLowerCase() === "em andamento"))

        // Team filter - AJUSTADO para usar tipoEquipe
        const teamMatch =
          teamFilter === "all" ||
          (teamFilter === "team-1" &&
            (removal.tipoEquipe === "Equipe(Diurno)" || removal.tipoEquipe === "Equipe1(Matutino)")) ||
          (teamFilter === "team-2" &&
            (removal.tipoEquipe === "Equipe(Noturno)" ||
              removal.tipoEquipe === "Equipe2(Vespertino)" ||
              removal.tipoEquipe === "Equipe(Notunro)"))

        // Recently registered filter
        const recentlyMatch = !recentlyRegisteredFilter || (removal.data && new Date(removal.data) >= oneDayAgo)

        return searchMatch && dateMatch && statusMatch && teamMatch && recentlyMatch
      })
      .sort((a, b) => {
        const factor = sortDirection === "asc" ? 1 : -1
        if (sortField === "motorista") {
          return factor * (a.motorista || "").localeCompare(b.motorista || "")
        } else if (sortField === "prefixo") {
          return factor * (a.prefixo || "").localeCompare(b.prefixo || "")
        } else if (sortField === "horaSaidaFrota") {
          return factor * (a.horaSaidaFrota || "").localeCompare(b.horaSaidaFrota || "")
        } else if (sortField === "tipoEquipe") {
          return factor * (a.tipoEquipe || "").localeCompare(b.tipoEquipe || "")
        } else if (sortField === "statusFrota") {
          return factor * (a.statusFrota || "").localeCompare(b.statusFrota || "")
        } else if (sortField === "rota") {
          return factor * (a.rota || "").localeCompare(b.rota || "")
        }
        return 0
      })
  }, [
    driverSearch,
    selectedDate,
    statusFilter,
    teamFilter,
    sortField,
    sortDirection,
    rsuData,
    recentlyRegisteredFilter,
  ])

  // Get paginated data
  const paginatedRemovals = filteredRemovals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Obter sugestões para o campo de busca - OTIMIZADO
  const searchSuggestions = useMemo(() => {
    const driverNames = [...new Set(rsuData.map((r) => r.motorista).filter(Boolean))]
    const vehiclePrefixes = [...new Set(rsuData.map((r) => r.prefixo).filter(Boolean))]
    return [...driverNames, ...vehiclePrefixes]
  }, [rsuData])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIndicator = ({ field }) => {
    if (sortField === field) {
      return sortDirection === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
    }
    return null
  }

  // AJUSTADO para usar statusFrota
  const getStatusChip = (status) => {
    let label = status || "Desconhecido"
    let color = themeColors.text.disabled

    if (status?.toLowerCase().includes("finaliz") || status?.toLowerCase() === "finalizada") {
      label = "Finalizada"
      color = themeColors.success.main
    } else if (status?.toLowerCase().includes("andamento") || status?.toLowerCase() === "em andamento") {
      label = "Em Andamento"
      color = themeColors.warning.main
    }

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          backgroundColor: alpha(color, 0.1),
          color: color,
          fontWeight: 600,
          height: "1.5rem",
          borderRadius: "12px",
        }}
      />
    )
  }

  const handleActionMenuOpen = (event, id) => {
    setActionMenuAnchor(event.currentTarget)
    setSelectedRowId(id)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
    setSelectedRowId(null)
  }

  const handleEditClick = () => {
    const currentRemoval = rsuData.find((r) => r.id === selectedRowId)
    setSelectedRemoval(currentRemoval)
    setEditModalOpen(true)
    handleActionMenuClose()
  }

  const handleDeleteConfirmOpen = () => {
    setDeleteConfirmOpen(true)
    handleActionMenuClose()
  }

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRegisterFormChange = (event) => {
    const { name, value } = event.target
    setRegisterFormData({ ...registerFormData, [name]: value })
  }

  return (
    <Box component="section">
      <div>
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
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Box
                    sx={{
                      width: { xs: "32px", sm: "36px" },
                      height: { xs: "32px", sm: "36px" },
                      borderRadius: "12px",
                      background: themeColors.success.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Delete sx={{ color: "white", fontSize: "2rem" }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        color: themeColors.text.primary,
                      }}
                    >
                      Registros de RSU
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        color: themeColors.text.secondary,
                        fontWeight: 400,
                      }}
                    >
                      {rsuData.length} registros encontrados
                    </Typography>
                  </Box>
                </Box>
              </Box>
            }
            action={
              <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <IconButton
                  sx={{
                    color: themeColors.text.secondary,
                    "&:hover": { color: themeColors.primary.main },
                  }}
                  onClick={handleRefresh}
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
                <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 2 }}>
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <SearchInput
                      icon={Search}
                      placeholder="Buscar por motorista ou prefixo..."
                      value={driverSearch}
                      onChange={(e) => {
                        setDriverSearch(e.target.value)
                        setPrefixSearch(e.target.value)
                      }}
                      suggestions={searchSuggestions}
                      themeColors={themeColors}
                      keyframes={keyframes}
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
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: "1 1 300px" }}>
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
                          { id: "all", label: "Todos", color: themeColors.primary.light },
                          { id: "completed", label: "Finalizada", color: themeColors.success.main },
                          { id: "in-progress", label: "Em andamento", color: themeColors.warning.main },
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
                                  ? alpha(status.color, 0.15)
                                  : alpha(themeColors.background.default, 0.5),
                              color: statusFilter === status.id ? status.color : themeColors.text.secondary,
                              border: `1px solid ${statusFilter === status.id ? status.color : themeColors.divider}`,
                              "&:hover": {
                                backgroundColor: alpha(status.color, 0.15),
                                color: status.color,
                              },
                              transition: "all 0.2s ease",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ flex: "1 1 300px" }}>
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
                        {["Todas", "Equipe Diurno", "Equipe Noturno"].map((team, index) => (
                          <Chip
                            key={team}
                            label={team}
                            clickable
                            onClick={() => {
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
                                  ? alpha(themeColors.primary.light, 0.15)
                                  : alpha(themeColors.background.default, 0.5),
                              color:
                                teamFilter === (index === 0 ? "all" : `team-${index}`)
                                  ? themeColors.primary.dark
                                  : themeColors.text.secondary,
                              border: `1px solid ${
                                teamFilter === (index === 0 ? "all" : `team-${index}`)
                                  ? themeColors.primary.light
                                  : themeColors.divider
                              }`,
                              "&:hover": {
                                backgroundColor: alpha(themeColors.primary.light, 0.15),
                                color: themeColors.primary.dark,
                              },
                              transition: "all 0.2s ease",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ flex: "1 1 300px" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: themeColors.text.secondary,
                          fontSize: "0.8rem",
                        }}
                      >
                        Filtro Adicional:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Chip
                          label="Cadastrados Recentemente"
                          clickable
                          onClick={handleRecentlyRegisteredFilterChange}
                          sx={{
                            borderRadius: "12px",
                            fontWeight: 500,
                            backgroundColor: recentlyRegisteredFilter
                              ? alpha(themeColors.success.light, 0.15)
                              : alpha(themeColors.background.default, 0.5),
                            color: recentlyRegisteredFilter ? themeColors.success.dark : themeColors.text.secondary,
                            border: `1px solid ${recentlyRegisteredFilter ? themeColors.success.light : themeColors.divider}`,
                            "&:hover": {
                              backgroundColor: alpha(themeColors.success.light, 0.15),
                              color: themeColors.success.dark,
                            },
                            transition: "all 0.2s ease",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Table */}
            {loading && (!rsuData || rsuData.length === 0) ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 5 }}>
                <CircularProgress size={40} sx={{ color: themeColors.primary.main }} />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        onClick={() => handleSort("motorista")}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          color: sortField === "motorista" ? themeColors.primary.main : themeColors.text.secondary,
                          "&:hover": { color: themeColors.primary.main },
                          borderBottom: `1px solid ${themeColors.divider}`,
                          py: 1.5,
                        }}
                      >
                        Motorista
                        <SortIndicator field="motorista" />
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("prefixo")}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          color: sortField === "prefixo" ? themeColors.primary.main : themeColors.text.secondary,
                          "&:hover": { color: themeColors.primary.main },
                          borderBottom: `1px solid ${themeColors.divider}`,
                          py: 1.5,
                        }}
                      >
                        Prefixo
                        <SortIndicator field="prefixo" />
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("horaSaidaFrota")}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          color: sortField === "horaSaidaFrota" ? themeColors.primary.main : themeColors.text.secondary,
                          "&:hover": { color: themeColors.primary.main },
                          borderBottom: `1px solid ${themeColors.divider}`,
                          py: 1.5,
                        }}
                      >
                        Horário
                        <SortIndicator field="horaSaidaFrota" />
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("tipoEquipe")}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          color: sortField === "tipoEquipe" ? themeColors.primary.main : themeColors.text.secondary,
                          "&:hover": { color: themeColors.primary.main },
                          borderBottom: `1px solid ${themeColors.divider}`,
                          py: 1.5,
                        }}
                      >
                        Equipe
                        <SortIndicator field="tipoEquipe" />
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("rota")}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          color: sortField === "rota" ? themeColors.primary.main : themeColors.text.secondary,
                          "&:hover": { color: themeColors.primary.main },
                          borderBottom: `1px solid ${themeColors.divider}`,
                          py: 1.5,
                        }}
                      >
                        Rota
                        <SortIndicator field="rota" />
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("statusFrota")}
                        sx={{
                          fontWeight: 600,
                          color: sortField === "statusFrota" ? themeColors.primary.main : themeColors.text.secondary,
                          "&:hover": { color: themeColors.primary.main },
                          borderBottom: `1px solid ${themeColors.divider}`,
                          py: 1.5,
                        }}
                      >
                        Status
                        <SortIndicator field="statusFrota" />
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
                                  backgroundColor: alpha(themeColors.success.light, 0.2),
                                  color: themeColors.success.dark,
                                  fontWeight: 600,
                                }}
                              >
                                {removal.motorista?.charAt(0) || "?"}
                              </Avatar>
                              <Typography sx={{ fontWeight: 500 }}>{removal.motorista || "-"}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={removal.prefixo || "-"}
                              size="small"
                              sx={{
                                backgroundColor: alpha(themeColors.primary.light, 0.1),
                                color: themeColors.primary.dark,
                                fontWeight: 600,
                                height: "1.5rem",
                                borderRadius: "12px",
                              }}
                            />
                          </TableCell>
                          <TableCell>{removal.horaSaidaFrota || "-"}</TableCell>
                          <TableCell>{removal.tipoEquipe || "-"}</TableCell>
                          <TableCell>
                            {removal.rota ? (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <LocationOn
                                  fontSize="small"
                                  sx={{ color: themeColors.primary.main, fontSize: "0.9rem" }}
                                />
                                <Typography variant="body2">{removal.rota}</Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ color: themeColors.text.disabled }}>
                                Não informado
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{getStatusChip(removal.statusFrota)}</TableCell>
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
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1" sx={{ color: themeColors.text.secondary }}>
                            {loading ? "Carregando dados..." : "Nenhum registro encontrado"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

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
      </div>

      {/* Modals and dialogs */}
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
          onClick={handleEditClick}
          sx={{
            borderRadius: "8px",
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Editar
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledTitle="alert-dialog-title"
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

      {/* Modal antigo (fallback) */}
      <DetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        solturaId={selectedRemoval?.id}
        onEdit={handleEditClick}
        themeColors={themeColors}
        keyframes={keyframes}
      />

      {/* Novo modal que recebe o ID */}
      <SolturaDetailModal
        open={solturaModalOpen}
        onClose={() => setSolturaModalOpen(false)}
        solturaId={selectedSolturaId}
        onDelete={handleSolturaDeleted}
      />

      <EditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        data={selectedRemoval}
        onSave={handleSaveEdit}
        themeColors={themeColors}
        keyframes={keyframes}
      />

      <RegisterModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        formData={registerFormData}
        onChange={handleRegisterFormChange}
        onSubmit={handleRegisterSubmit}
        themeColors={themeColors}
        loading={loading}
      />
    </Box>
  )
}

export default RSUTable
