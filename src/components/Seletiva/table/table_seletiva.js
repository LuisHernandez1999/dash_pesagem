"use client"

import { useState, useEffect, useMemo } from "react"
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
  Zoom,
  InputBase,
  CircularProgress,
} from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { Delete, MoreVert, ArrowUpward, ArrowDownward, Close, Edit, Search, Refresh } from "@mui/icons-material"
import RegisterModal from "../../registro_remocao"
import EditModal from "../../edit_soltura"
import DetailModal from "../../visualizar_remocao"
import SolturaDetailModal from "../../visualizar_remocao" // Importando o novo modal
import { retornarInfosSeletiva } from "../../../service/seletiva"

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
            border: `2px solid ${themeColors.primary.light}`,
            overflow: "hidden",
            transition: "all 0.3s ease",
            background: themeColors.background.paper,
            height: "52px",
            width: "100%",
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(themeColors.primary.light, 0.15)}`,
              borderColor: themeColors.primary.main,
            },
            "&:focus-within": {
              boxShadow: `0 4px 12px ${alpha(themeColors.primary.light, 0.2)}`,
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

const SeletivaTable = ({ loading: initialLoading, themeColors, keyframes, onRefresh }) => {
  // State variables
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortField, setSortField] = useState("hora_saida_frota")
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

  // Novo estado para o modal de detalhes da soltura
  const [solturaModalOpen, setSolturaModalOpen] = useState(false)
  const [selectedSolturaId, setSelectedSolturaId] = useState(null)

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

  // State for API data
  const [removals, setRemovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Iniciando fetchData...")
      const response = await retornarInfosSeletiva()
      console.log("📥 Resposta da API:", response)

      if (response.success) {
        // Transform API data to match the expected format for the table
        const formattedData = response.data.map((item, index) => {
          console.log(`🔧 Formatando item ${index}:`, item)
          console.log(`🆔 ID do item ${index}:`, item.id)

          const formattedItem = {
            id: item.id || index + 1, // Usar o ID da API se disponível, senão usar o índice
            driver: item.motorista || "Não informado",
            driverId: "",
            collectors: Array.isArray(item.coletores) ? item.coletores : [],
            collectorsIds: [],
            prefixo: item.prefixo || "",
            hora_saida_frota: item.hora_saida_frota || "",
            hora_entrega_chave: item.hora_entrega_chave || "",
            hora_chegada: item.hora_chegada || "",
            tipo_equipe: item.tipo_equipe || "",
            status_frota: item.status_frota || "Em andamento",
            data: item.data || "",
            rota: item.rota || "",
            location: "",
            vehiclePrefix: item.tipo_veiculo_selecionado || "",
            departureTime: item.hora_saida_frota || "",
            status: item.status_frota || "Em andamento",
            team: item.tipo_equipe || "",
            vehicle: item.tipo_veiculo_selecionado || "",
            lider: item.lider || "",
            solturaId: item.id, // Garantir que o ID da soltura seja passado corretamente
          }

          console.log(`✅ Item formatado ${index}:`, formattedItem)
          console.log(`🆔 solturaId para item ${index}:`, formattedItem.solturaId)

          return formattedItem
        })

        console.log("📋 Dados finais formatados:", formattedData)
        setRemovals(formattedData)
      } else {
        setError(response.error || "Erro ao carregar dados")
      }
    } catch (err) {
      console.error("Erro ao buscar dados de coletas:", err)
      setError("Falha ao carregar dados de coletas")
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount and when refresh is triggered
  useEffect(() => {
    fetchData()
  }, [])

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

  // Handle edit click
  const handleEditClick = () => {
    const removalToEdit = removals.find((removal) => removal.id === selectedRowId)
    if (removalToEdit) {
      setSelectedRemoval(removalToEdit)
      setEditModalOpen(true)
      setActionMenuAnchor(null)
    }
  }

  // Handle save edit
  const handleSaveEdit = (editedData) => {
    try {
      // Find the index of the record to be edited
      const indexToUpdate = removals.findIndex((removal) => removal.id === selectedRemoval.id)

      if (indexToUpdate !== -1) {
        // Create a copy of the removals array
        const updatedRemovals = [...removals]

        // Replace the old record completely with the edited data
        // while preserving the id and other metadata
        updatedRemovals[indexToUpdate] = {
          ...updatedRemovals[indexToUpdate], // Keep the original id and any other metadata
          ...editedData, // Completely overwrite with new data
          lastEditDate: new Date().toISOString(), // Add edit timestamp
        }

        // Update the state with the modified array
        setRemovals(updatedRemovals)

        // Also update selectedRemoval to reflect changes in the detailed view
        setSelectedRemoval({ ...selectedRemoval, ...editedData })

        // Show success message
        setSnackbarMessage("Registro atualizado com sucesso!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)

        // Close modals
        setEditModalOpen(false)
        setDetailModalOpen(false)
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error)
      setSnackbarMessage("Erro ao atualizar registro. Tente novamente.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  // Handle modal open - CORRIGIDO para usar o ID correto do item da tabela
  const handleOpenModal = (removal) => {
    console.log("🔍 handleOpenModal chamado com:", removal)

    // Verificar se temos um ID válido diretamente do item
    if (removal && removal.id) {
      const itemId = removal.id
      console.log("✅ Usando ID do item da tabela:", itemId)

      // Definir o ID selecionado e abrir o modal
      setSelectedSolturaId(itemId)
      setSolturaModalOpen(true)
    } else {
      // Fallback para o modal antigo se não tiver ID
      console.log("⚠️ ID não encontrado, usando modal antigo")
      const currentRemoval = removals.find((r) => r.id === removal.id) || removal
      setSelectedRemoval(currentRemoval)
      setDetailModalOpen(true)
    }
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
    }
  }

  // Handle register form change
  const handleRegisterFormChange = (field, value, index = null) => {
    if (index !== null) {
      // Para campos com múltiplos valores (collectors, leaders, leaderPhones)
      setRegisterFormData((prev) => {
        const newValues = [...prev[field]]
        newValues[index] = value
        return { ...prev, [field]: newValues }
      })
    } else {
      // Para campos simples
      setRegisterFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  // Handle register submit
  const handleRegisterSubmit = async () => {
    try {
      // First, create the data object to send to the server
      const newRemovalData = {
        motorista: {
          nome: registerFormData.driver,
          matricula: registerFormData.driverId,
        },
        prefixo: registerFormData.vehiclePrefix,
        tipo_equipe: registerFormData.team,
        coletores: registerFormData.collectors.filter(Boolean).map((name) => ({ nome: name })),
        garagem: registerFormData.garage,
        rota: registerFormData.route,
        veiculo: registerFormData.vehicleType,
        hora_saida_frota: new Date().toLocaleTimeString(),
        status_frota: "Em andamento",
        data: new Date().toISOString().split("T")[0],
      }

      // Create the new removal object for local state
      const newRemoval = {
        id: removals.length + 1,
        driver: registerFormData.driver,
        driverId: registerFormData.driverId,
        collectors: registerFormData.collectors.filter(Boolean),
        collectorsIds: [],
        garage: registerFormData.garage,
        route: registerFormData.route,
        vehiclePrefix: registerFormData.vehiclePrefix,
        departureTime: new Date().toLocaleTimeString(),
        status: "Em andamento",
        arrivalTime: "",
        date: new Date().toISOString().split("T")[0],
        team: registerFormData.team,
        location: "",
        vehicle: registerFormData.vehicleType,
        distance: "0 km",
        notes: "",
      }

      // Add to local state first for immediate UI update
      setRemovals((prev) => {
        const updatedRemovals = [newRemoval, ...prev]
        // After adding the new removal, reset to first page and enable "recently registered" filter
        setPage(0)
        setRecentlyRegisteredFilter(true)
        return updatedRemovals
      })

      // Show success message
      setSnackbarMessage("Coleta cadastrada com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)

      // Close modal and reset form
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
      console.error("Erro ao cadastrar coleta:", error)
      setSnackbarMessage("Erro ao cadastrar coleta. Tente novamente.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  // Handle recently registered filter toggle
  const handleRecentlyRegisteredFilterChange = () => {
    setRecentlyRegisteredFilter((prev) => !prev)
    setPage(0) // Reset to first page when filter changes
  }

  // Format date in Brazilian format
  const formatDateBR = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return dateString
    }
  }

  // FUNÇÃO CORRIGIDA - Exibe o status EXATO da API sem sobrescrever
  const getStatusChip = (status) => {
    // Se não há status, exibe "Não informado"
    if (!status) {
      return (
        <Chip
          label="Não informado"
          sx={{
            backgroundColor: alpha(themeColors.grey?.[500] || "#9e9e9e", 0.15),
            color: themeColors.grey?.[700] || "#616161",
            fontWeight: 600,
            borderRadius: "12px",
          }}
          size="small"
        />
      )
    }

    // Determina a cor baseada no conteúdo do status, MAS MANTÉM O TEXTO ORIGINAL
    let chipColor = themeColors.info?.main || "#2196f3"
    let chipBgColor = alpha(themeColors.info?.light || "#64b5f6", 0.15)

    // Verifica palavras-chave no status para definir cores apropriadas
    const statusLower = status.toLowerCase()

    if (statusLower.includes("finaliz")) {
      chipColor = themeColors.primary?.dark || "#1565c0"
      chipBgColor = alpha(themeColors.primary?.light || "#42a5f5", 0.15)
    } else if (statusLower.includes("andamento")) {
      chipColor = themeColors.warning?.dark || "#f57c00"
      chipBgColor = alpha(themeColors.warning?.light || "#ffb74d", 0.15)
    } else if (statusLower.includes("cancel")) {
      chipColor = themeColors.error?.dark || "#d32f2f"
      chipBgColor = alpha(themeColors.error?.light || "#e57373", 0.15)
    } else if (statusLower.includes("pendent")) {
      chipColor = themeColors.info?.dark || "#1976d2"
      chipBgColor = alpha(themeColors.info?.light || "#64b5f6", 0.15)
    }

    // RETORNA O CHIP COM O TEXTO EXATO DA API
    return (
      <Chip
        label={status}
        sx={{
          backgroundColor: chipBgColor,
          color: chipColor,
          fontWeight: 600,
          borderRadius: "12px",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: alpha(chipColor, 0.25),
          },
        }}
        size="small"
      />
    )
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

  // Filter and sort removals data
  const filteredRemovals = useMemo(() => {
    // Get current date for "recently registered" filter
    const currentDate = new Date()
    const oneDayAgo = new Date(currentDate)
    oneDayAgo.setDate(currentDate.getDate() - 1)

    return removals
      .filter((removal) => {
        // Unified search across multiple fields
        const searchMatch =
          driverSearch === "" ||
          (removal.driver && removal.driver.toLowerCase().includes(driverSearch.toLowerCase())) ||
          (removal.vehiclePrefix && removal.vehiclePrefix.toLowerCase().includes(driverSearch.toLowerCase())) ||
          (removal.driverId && removal.driverId.toLowerCase().includes(driverSearch.toLowerCase()))

        // Date check with proper format
        let dateMatch = true
        if (selectedDate !== null) {
          // Convert removal date to Date object for comparison
          const removalDate = new Date(removal.data)
          // Reset hours to compare only dates
          removalDate.setHours(0, 0, 0, 0)
          const filterDate = new Date(selectedDate)
          filterDate.setHours(0, 0, 0, 0)

          // Compare dates
          dateMatch = removalDate.getTime() === filterDate.getTime()
        }

        // Status filter
        const statusMatch =
          statusFilter === "all" ||
          (statusFilter === "completed" && removal.status_frota === "Finalizada") ||
          (statusFilter === "in-progress" && removal.status_frota === "Em andamento")

        // Team filter
        const teamMatch =
          teamFilter === "all" ||
          (teamFilter === "team-1" && removal.tipo_equipe === "Equipe(Diurno)") ||
          (teamFilter === "team-2" && removal.tipo_equipe === "Equipe(Noturno)")

        // Recently registered filter (last 24 hours)
        const recentlyMatch = !recentlyRegisteredFilter || (removal.data && new Date(removal.data) >= oneDayAgo)

        // Return true only if all filters match
        return searchMatch && dateMatch && statusMatch && teamMatch && recentlyMatch
      })
      .sort((a, b) => {
        const factor = sortDirection === "asc" ? 1 : -1
        if (sortField === "driver") {
          return factor * (a.driver || "").localeCompare(b.driver || "")
        } else if (sortField === "vehiclePrefix") {
          return factor * (a.prefixo || "").localeCompare(b.prefixo || "")
        } else if (sortField === "hora_saida_frota") {
          return factor * (a.hora_saida_frota || "").localeCompare(b.hora_saida_frota || "")
        } else if (sortField === "team") {
          return factor * (a.tipo_equipe || "").localeCompare(b.tipo_equipe || "")
        } else if (sortField === "status") {
          return factor * (a.status_frota || "").localeCompare(b.status_frota || "")
        } else if (sortField === "location") {
          return factor * (a.location || "").localeCompare(b.location || "")
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
    removals,
    recentlyRegisteredFilter,
  ])

  // Get paginated data
  const paginatedRemovals = filteredRemovals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Obter sugestões para o campo de busca
  const searchSuggestions = useMemo(() => {
    const driverNames = [...new Set(removals.map((r) => r.driver).filter(Boolean))]
    const vehiclePrefixes = [...new Set(removals.map((r) => r.prefixo).filter(Boolean))]
    return [...driverNames, ...vehiclePrefixes]
  }, [removals])

  // Handle refresh
  const handleRefresh = () => {
    fetchData()
    if (onRefresh) onRefresh()
  }

  // Handle soltura deletion callback
  const handleSolturaDeleted = (deletedSolturaId) => {
    console.log("🗑️ Soltura deletada, atualizando tabela...", deletedSolturaId)

    // Atualizar estado local removendo o item deletado
    setRemovals(prevRemovals => {
      const updatedRemovals = prevRemovals.filter(removal => removal.id !== deletedSolturaId)
      console.log("📋 Tabela atualizada, removals restantes:", updatedRemovals.length)
      return updatedRemovals
    })

    // Fechar o modal
    setSolturaModalOpen(false)
    setSelectedSolturaId(null)

    // Mostrar mensagem de sucesso
    setSnackbarMessage("Registro removido com sucesso!")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)

    // Opcionalmente, fazer fetch dos dados atualizados da API
    // fetchData()
  }

  return (
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
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
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
                      Registros de Coleta Seletiva
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        color: themeColors.text.secondary,
                        fontWeight: 400,
                      }}
                    >
                      Todos os registros de coletas seletivas
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
                      themeColors={themeColors}
                      keyframes={keyframes}
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
                          { id: "completed", label: "Finalizada", color: themeColors.primary.main },
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
                        {["Todas", "Equipe(Diurno)", "Equipe(Noturno)"].map((team, index) => (
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
                              ? alpha(themeColors.primary.light, 0.15)
                              : alpha(themeColors.background.default, 0.5),
                            color: recentlyRegisteredFilter ? themeColors.primary.dark : themeColors.text.secondary,
                            border: `1px solid ${recentlyRegisteredFilter ? themeColors.primary.light : themeColors.divider}`,
                            "&:hover": {
                              backgroundColor: alpha(themeColors.primary.light, 0.15),
                              color: themeColors.primary.dark,
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
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 5 }}>
                <CircularProgress size={40} sx={{ color: themeColors.primary.main }} />
              </Box>
            ) : error ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 5 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : (
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
                          color: sortField === "vehiclePrefix" ? themeColors.primary.main : themeColors.text.secondary,
                          "&:hover": { color: themeColors.primary.main },
                          borderBottom: `1px solid ${themeColors.divider}`,
                          py: 1.5,
                        }}
                      >
                        Prefixo
                        <SortIndicator field="vehiclePrefix" />
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("hora_saida_frota")}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          color:
                            sortField === "hora_saida_frota" ? themeColors.primary.main : themeColors.text.secondary,
                          "&:hover": { color: themeColors.primary.main },
                          borderBottom: `1px solid ${themeColors.divider}`,
                          py: 1.5,
                        }}
                      >
                        Horário
                        <SortIndicator field="hora_saida_frota" />
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
                                  backgroundColor: alpha(themeColors.primary.light, 0.2),
                                  color: themeColors.primary.dark,
                                  fontWeight: 600,
                                }}
                              >
                                {/* Garantir que o primeiro caractere do nome do motorista seja exibido */}
                                {(typeof removal.driver === "string" && removal.driver.charAt(0)) || "?"}
                              </Avatar>
                              <Typography sx={{ fontWeight: 500 }}>
                                {/* Exibir o nome do motorista corretamente */}
                                {typeof removal.driver === "string" ? removal.driver : "-"}
                              </Typography>
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
                          <TableCell>{removal.hora_saida_frota || "-"}</TableCell>
                          <TableCell>{removal.tipo_equipe || "-"}</TableCell>
                          <TableCell>{getStatusChip(removal.status_frota)}</TableCell>
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
      </Zoom>

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

      {/* Modal antigo (fallback) */}
      <DetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        removal={selectedRemoval}
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

export default SeletivaTable
