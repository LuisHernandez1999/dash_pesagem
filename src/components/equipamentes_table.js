"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  alpha,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Divider,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material"
import { Search, Refresh, Engineering, Visibility, Edit, Add, Delete, Warning } from "@mui/icons-material"
import EquipmentModal from "./equipamente_modal"
import EquipmentViewModal from "./equipaments_view_modal"
import EquipmentEditModal from "./equipmants_edit"
import { deletarEquipamento } from "../service/equipamento"

const EquipmentTable = ({ equipments = [], loading, themeColors, onRefresh, onEquipmentUpdate }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [typeFilter, setTypeFilter] = useState("Todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [equipmentToDelete, setEquipmentToDelete] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [showRecentOnly, setShowRecentOnly] = useState(false)

  // Adicione este efeito após as declarações de estado
  useEffect(() => {
    // Este efeito será executado sempre que a lista de equipamentos mudar
    console.log("📊 Lista de equipamentos atualizada:", equipments.length)
    // Resetar para a primeira página quando os dados mudam significativamente
    setPage(0)
  }, [equipments])

  // Filter equipments based on search term, status, type and recent items with safe checks
  const filteredEquipments = equipments.filter((equipment) => {
    // Safe checks for undefined/null values
    const prefix = equipment?.prefix || ""
    const type = equipment?.type || ""
    const status = equipment?.status || ""

    const matchesSearch =
      prefix.toLowerCase().includes(searchTerm.toLowerCase()) || type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "Todos" || status === statusFilter
    const matchesType = typeFilter === "Todos" || type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle status filter change
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value)
    setPage(0)
  }

  // Handle type filter change
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value)
    setPage(0)
  }

  // Handle modal open/close
  const handleOpenModal = () => {
    setSelectedEquipment(null) // Garantir que é modo criação
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedEquipment(null)
  }

  // Handle view modal
  const handleOpenViewModal = (equipment) => {
    setSelectedEquipment(equipment)
    setViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setSelectedEquipment(null)
  }

  // Handle edit modal
  const handleOpenEditModal = (equipment) => {
    setSelectedEquipment(equipment)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedEquipment(null)
  }

  // Handle equipment update with success feedback
  const handleUpdateEquipment = (result) => {
    console.log("🔄 Processando atualização de equipamento:", result)

    if (result.sucesso) {
      console.log("✅ Atualização bem-sucedida:", result.mensagem)
      setSnackbarMessage(result.mensagem)
      setSnackbarSeverity("success")
      setSnackbarOpen(true)

      // Refresh the table data
      console.log("🔄 Solicitando atualização da tabela")
      if (onRefresh) {
        onRefresh()
      }

      // Notify parent component about the update
      if (onEquipmentUpdate) {
        console.log("📢 Notificando componente pai sobre atualização")
        onEquipmentUpdate(result.dados)
      }
    } else {
      console.error("❌ Erro na atualização:", result.mensagem)
      setSnackbarMessage(result.mensagem)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }

    handleCloseEditModal()
    console.log("🏁 Processo de atualização finalizado")
  }

  // Handle delete confirmation dialog
  const handleOpenDeleteConfirmation = (equipment) => {
    setEquipmentToDelete(equipment)
    setConfirmDialogOpen(true)
  }

  const handleCloseDeleteConfirmation = () => {
    setConfirmDialogOpen(false)
    setEquipmentToDelete(null)
  }

  // Handle equipment deletion
  const handleConfirmDelete = async () => {
    if (!equipmentToDelete) return

    console.log("🗑️ Iniciando processo de exclusão do equipamento:", equipmentToDelete.id)

    try {
      const result = await deletarEquipamento(equipmentToDelete.id)

      if (result.sucesso) {
        console.log("✅ Exclusão bem-sucedida:", result.mensagem)
        setSnackbarMessage(result.mensagem)
        setSnackbarSeverity("success")
        setSnackbarOpen(true)

        // Refresh the table data immediately
        console.log("🔄 Atualizando tabela após exclusão")
        if (onRefresh) {
          await onRefresh() // Aguarda a conclusão da atualização
        }
      } else {
        console.error("❌ Erro na exclusão:", result.mensagem)
        setSnackbarMessage(result.mensagem)
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error("❌ Erro inesperado na exclusão:", error)
      setSnackbarMessage("Erro inesperado ao tentar excluir o equipamento.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }

    // Fechar o diálogo de confirmação
    handleCloseDeleteConfirmation()
    console.log("🏁 Processo de exclusão finalizado")
  }

  // Handle equipment creation with success feedback
  const handleCreateEquipment = (result) => {
    console.log("🔄 Processando criação de equipamento:", result)

    if (result.sucesso) {
      console.log("✅ Criação bem-sucedida:", result.mensagem)
      setSnackbarMessage(result.mensagem)
      setSnackbarSeverity("success")
      setSnackbarOpen(true)

      // Refresh the table data
      console.log("🔄 Solicitando atualização da tabela após criação")
      if (onRefresh) {
        onRefresh()
      }

      // Notify parent component about the creation
      if (onEquipmentUpdate) {
        console.log("📢 Notificando componente pai sobre criação")
        onEquipmentUpdate(result.dados)
      }
    } else {
      console.error("❌ Erro na criação:", result.mensagem)
      setSnackbarMessage(result.mensagem)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }

    console.log("🏁 Processo de criação finalizado")
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Ativo":
        return themeColors.success.main
      case "Inativo":
        return themeColors.error.main
      case "Manutenção":
        return themeColors.warning.main
      default:
        return themeColors.text.secondary
    }
  }

  // Get equipment type color
  const getTypeColor = (type) => {
    switch (type) {
      case "Caminhão Carroceiria":
        return themeColors.primary.main
      case "Pá Carregadeira":
      case "Pá Carregadeira'":
        return themeColors.warning.main
      case "Retroescavadeira":
        return themeColors.error.main
      default:
        return themeColors.text.secondary
    }
  }

  // Toggle recent items filter
  const toggleRecentFilter = () => {
    console.log("Toggling recent filter. Current state:", showRecentOnly)
    console.log("Equipment data sample:", equipments[0])
    setShowRecentOnly(!showRecentOnly)
    setPage(0) // Reset to first page when filter changes
  }

  // Show loading state
  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          background: themeColors.background.card,
          mb: 4,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography>Carregando equipamentos...</Typography>
      </Card>
    )
  }

  return (
    <>
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s ease",
          overflow: "hidden",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-2px)",
          },
          background: themeColors.background.card,
          mb: 4,
          border: `1px solid ${alpha(themeColors.primary.main, 0.08)}`,
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Box
                sx={{
                  width: { xs: "40px", sm: "48px" },
                  height: { xs: "40px", sm: "48px" },
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.light})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 24px ${alpha(themeColors.primary.main, 0.3)}`,
                }}
              >
                <Engineering
                  sx={{
                    color: "#ffffff",
                    fontSize: { xs: "1.3rem", sm: "1.5rem" },
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                    color: themeColors.text.primary,
                    background: `linear-gradient(135deg, ${themeColors.text.primary}, ${themeColors.primary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Equipamentos e Maquinário
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    color: themeColors.text.secondary,
                    fontWeight: 500,
                    mt: 0.5,
                  }}
                >
                  Controle e monitoramento de equipamentos
                </Typography>
              </Box>
            </Box>
          }
          action={
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
              <IconButton
                sx={{
                  color: themeColors.text.secondary,
                  backgroundColor: alpha(themeColors.primary.main, 0.08),
                  borderRadius: "12px",
                  "&:hover": {
                    color: themeColors.primary.main,
                    backgroundColor: alpha(themeColors.primary.main, 0.15),
                    transform: "rotate(180deg)",
                  },
                  transition: "all 0.3s ease",
                }}
                onClick={onRefresh}
              >
                <Refresh />
              </IconButton>

              {/* Contador de Equipamentos */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: themeColors.text.primary,
                    lineHeight: 1,
                  }}
                >
                  {filteredEquipments.length}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: themeColors.text.secondary,
                    lineHeight: 1,
                    mt: 0.5,
                  }}
                >
                  Equipamentos
                </Typography>
              </Box>

              {/* Botão Cadastrar Equipamento */}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleOpenModal}
                sx={{
                  backgroundColor: "#ffffff",
                  color: themeColors.success.main,
                  border: `2px solid ${themeColors.success.main}`,
                  borderRadius: "12px",
                  padding: "8px 16px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: alpha(themeColors.success.main, 0.05),
                    borderColor: themeColors.success.dark,
                    color: themeColors.success.dark,
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                }}
              >
                Cadastrar Equipamento
              </Button>
            </Box>
          }
          sx={{
            paddingBottom: "1.5rem",
            borderBottom: `2px solid ${alpha(themeColors.primary.main, 0.08)}`,
            "& .MuiCardHeader-action": {
              margin: 0,
            },
          }}
        />

        {/* Seção de Busca e Filtros */}
        <Box sx={{ px: 4, py: 3 }}>
          {/* Campo de Busca */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Digite o prefixo ou tipo do equipamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: themeColors.text.secondary, fontSize: "1.3rem" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: "700px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "#ffffff",
                  border: `2px solid ${alpha(themeColors.primary.main, 0.1)}`,
                  transition: "all 0.3s ease",
                  fontSize: "1rem",
                  "&:hover": {
                    borderColor: alpha(themeColors.primary.main, 0.3),
                    backgroundColor: alpha(themeColors.primary.main, 0.02),
                  },
                  "&.Mui-focused": {
                    borderColor: themeColors.primary.main,
                    backgroundColor: alpha(themeColors.primary.main, 0.05),
                    boxShadow: `0 0 0 4px ${alpha(themeColors.primary.main, 0.1)}`,
                  },
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "16px 14px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&::placeholder": {
                    color: themeColors.text.secondary,
                    opacity: 0.8,
                  },
                },
              }}
            />
          </Box>

          {/* Filtros */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  displayEmpty
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    border: `2px solid ${alpha(themeColors.success.main, 0.15)}`,
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover": {
                      borderColor: alpha(themeColors.success.main, 0.3),
                      backgroundColor: alpha(themeColors.success.main, 0.02),
                    },
                    "&.Mui-focused": {
                      borderColor: themeColors.success.main,
                      backgroundColor: alpha(themeColors.success.main, 0.05),
                      boxShadow: `0 0 0 4px ${alpha(themeColors.success.main, 0.1)}`,
                    },
                    "& .MuiSelect-select": {
                      padding: "14px 16px",
                    },
                  }}
                >
                  <MenuItem value="Todos" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    Todos os Status
                  </MenuItem>
                  <MenuItem value="Ativo" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: themeColors.success.main,
                        }}
                      />
                      Ativo
                    </Box>
                  </MenuItem>
                  <MenuItem value="Inativo" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: themeColors.error.main,
                        }}
                      />
                      Inativo
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Select
                  value={typeFilter}
                  onChange={handleTypeFilterChange}
                  displayEmpty
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    border: `2px solid ${alpha(themeColors.warning.main, 0.15)}`,
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover": {
                      borderColor: alpha(themeColors.warning.main, 0.3),
                      backgroundColor: alpha(themeColors.warning.main, 0.02),
                    },
                    "&.Mui-focused": {
                      borderColor: themeColors.warning.main,
                      backgroundColor: alpha(themeColors.warning.main, 0.05),
                      boxShadow: `0 0 0 4px ${alpha(themeColors.warning.main, 0.1)}`,
                    },
                    "& .MuiSelect-select": {
                      padding: "14px 16px",
                    },
                  }}
                >
                  <MenuItem value="Todos" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    Todos os Tipos
                  </MenuItem>
                  <MenuItem value="Caminhão Carroceiria" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: themeColors.primary.main,
                        }}
                      />
                      Caminhão Carroceiria
                    </Box>
                  </MenuItem>
                  <MenuItem value="Pá Carregadeira'" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: themeColors.warning.main,
                        }}
                      />
                      Pá Carregadeira
                    </Box>
                  </MenuItem>
                  <MenuItem value="Retroescavadeira" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: themeColors.error.main,
                        }}
                      />
                      Retroescavadeira
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: alpha(themeColors.primary.main, 0.1) }} />

        <CardContent sx={{ padding: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: alpha(themeColors.primary.main, 0.05),
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: themeColors.text.primary,
                      fontSize: "0.95rem",
                      py: 2,
                    }}
                  >
                    Prefixo
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: themeColors.text.primary,
                      fontSize: "0.95rem",
                      py: 2,
                    }}
                  >
                    Tipo
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: themeColors.text.primary,
                      fontSize: "0.95rem",
                      py: 2,
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: themeColors.text.primary,
                      fontSize: "0.95rem",
                      py: 2,
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEquipments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((equipment) => (
                  <TableRow
                    key={equipment.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha(themeColors.primary.main, 0.03),
                      },
                      transition: "background-color 0.2s ease",
                      "&:nth-of-type(even)": {
                        backgroundColor: alpha(themeColors.primary.main, 0.01),
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: themeColors.text.primary,
                          fontSize: "0.95rem",
                        }}
                      >
                        {equipment?.prefix || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={equipment?.type || "N/A"}
                        size="medium"
                        sx={{
                          backgroundColor: alpha(getTypeColor(equipment?.type), 0.12),
                          color: getTypeColor(equipment?.type),
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${alpha(getTypeColor(equipment?.type), 0.2)}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={equipment?.status || "N/A"}
                        size="medium"
                        sx={{
                          backgroundColor: alpha(getStatusColor(equipment?.status), 0.12),
                          color: getStatusColor(equipment?.status),
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${alpha(getStatusColor(equipment?.status), 0.2)}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenViewModal(equipment)}
                          sx={{
                            color: themeColors.text.secondary,
                            backgroundColor: alpha(themeColors.primary.main, 0.08),
                            borderRadius: "8px",
                            "&:hover": {
                              color: themeColors.primary.main,
                              backgroundColor: alpha(themeColors.primary.main, 0.15),
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditModal(equipment)}
                          sx={{
                            color: themeColors.text.secondary,
                            backgroundColor: alpha(themeColors.warning.main, 0.08),
                            borderRadius: "8px",
                            "&:hover": {
                              color: themeColors.warning.main,
                              backgroundColor: alpha(themeColors.warning.main, 0.15),
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteConfirmation(equipment)}
                          sx={{
                            color: themeColors.text.secondary,
                            backgroundColor: alpha(themeColors.error.main, 0.08),
                            borderRadius: "8px",
                            "&:hover": {
                              color: themeColors.error.main,
                              backgroundColor: alpha(themeColors.error.main, 0.15),
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredEquipments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
            sx={{
              borderTop: `2px solid ${alpha(themeColors.primary.main, 0.08)}`,
              backgroundColor: alpha(themeColors.primary.main, 0.02),
              "& .MuiTablePagination-toolbar": {
                paddingX: 3,
                paddingY: 2,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: themeColors.text.secondary,
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Modal de Cadastro */}
      <EquipmentModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleCreateEquipment}
        themeColors={themeColors}
        equipment={selectedEquipment}
      />

      {/* Modal de Visualização */}
      <EquipmentViewModal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        equipment={selectedEquipment}
        themeColors={themeColors}
      />

      {/* Modal de Edição */}
      <EquipmentEditModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        equipment={selectedEquipment}
        onSave={handleUpdateEquipment}
        themeColors={themeColors}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseDeleteConfirmation}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: themeColors.error.main,
            fontWeight: 700,
            fontSize: "1.2rem",
            pb: 2,
          }}
        >
          <Warning sx={{ fontSize: "1.5rem" }} />
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: themeColors.text.primary,
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            Tem certeza que deseja excluir o equipamento{" "}
            <strong style={{ color: themeColors.primary.main }}>{equipmentToDelete?.prefix}</strong>?
          </DialogContentText>
          <DialogContentText
            sx={{
              color: themeColors.text.secondary,
              fontSize: "0.9rem",
              mt: 1,
              fontStyle: "italic",
            }}
          >
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseDeleteConfirmation}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: themeColors.text.secondary,
              color: themeColors.text.secondary,
              "&:hover": {
                borderColor: themeColors.text.primary,
                color: themeColors.text.primary,
                backgroundColor: alpha(themeColors.text.primary, 0.05),
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: themeColors.error.main,
              color: "#ffffff",
              "&:hover": {
                backgroundColor: themeColors.error.dark,
              },
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EquipmentTable
