"use client"

import { useState } from "react"
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
} from "@mui/material"
import { Search, Refresh, Engineering, Visibility, Edit, Add } from "@mui/icons-material"
import EquipmentModal from "./equipamente_modal"

const EquipmentTable = ({ equipments, loading, themeColors, onRefresh }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [typeFilter, setTypeFilter] = useState("Todos")
  const [modalOpen, setModalOpen] = useState(false)

  // Filter equipments based on search term, status and type
  const filteredEquipments = equipments.filter((equipment) => {
    const matchesSearch =
      equipment.prefix.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "Todos" || equipment.status === statusFilter
    const matchesType = typeFilter === "Todos" || equipment.type === typeFilter

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
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  // Handle equipment save
  const handleSaveEquipment = (equipmentData) => {
    console.log("Novo equipamento:", equipmentData)
    // Aqui você adicionaria a lógica para salvar o equipamento
    handleCloseModal()
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
      case "Carroceria":
        return themeColors.primary.main
      case "Pá Carregadeira":
        return themeColors.warning.main
      case "Retroescavadeira":
        return themeColors.error.main
      default:
        return themeColors.text.secondary
    }
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
                    color: "white",
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
                  backgroundColor: "white",
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
                  backgroundColor: "white",
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
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  displayEmpty
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "white",
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
                  <MenuItem value="Manutenção" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: themeColors.warning.main,
                        }}
                      />
                      Em Manutenção
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
                    backgroundColor: "white",
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
                  <MenuItem value="Carroceria" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: themeColors.primary.main,
                        }}
                      />
                      Carroceria
                    </Box>
                  </MenuItem>
                  <MenuItem value="Pá Carregadeira" sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
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
                        {equipment.prefix}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={equipment.type}
                        size="medium"
                        sx={{
                          backgroundColor: alpha(getTypeColor(equipment.type), 0.12),
                          color: getTypeColor(equipment.type),
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${alpha(getTypeColor(equipment.type), 0.2)}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={equipment.status}
                        size="medium"
                        sx={{
                          backgroundColor: alpha(getStatusColor(equipment.status), 0.12),
                          color: getStatusColor(equipment.status),
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${alpha(getStatusColor(equipment.status), 0.2)}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
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
        onSave={handleSaveEquipment}
        themeColors={themeColors}
      />
    </>
  )
}

export default EquipmentTable
