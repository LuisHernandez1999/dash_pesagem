"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,///oi
  Box,// Importar o componente correto
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  Grid,
  Chip,
  Divider,
} from "@mui/material"
import {
  Assignment,
  Close,
  Refresh,
  Person,
  DirectionsCar,
  Schedule,
  AccessTime,
  Phone,
  Badge,
  CheckCircle,
  LocalShipping,
  Route,
  CalendarToday,
  Groups,
  LocationOn,
  Repeat,
  Category,
  Info,
  Delete,
} from "@mui/icons-material"
import { buscarSolturaPorId } from "../service/dashboard"

// Função deletarSoltura
const deletarSoltura = async (solturaId) => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
    const url = `${API_BASE}/api/soltura/${solturaId}/deletar/`

    console.log("Tentando deletar com URL:", url)

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
    })

    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = {
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: "Não foi possível obter detalhes do erro",
        }
      }

      return {
        sucesso: false,
        status: response.status,
        dados: errorData,
      }
    }

    let data
    try {
      const responseText = await response.text()
      console.log("Response text:", responseText)

      if (responseText) {
        data = JSON.parse(responseText)
      } else {
        data = { message: "Deletado com sucesso" }
      }
    } catch (parseError) {
      console.log("Erro ao fazer parse da resposta:", parseError)
      data = { message: "Deletado com sucesso" }
    }

    return {
      sucesso: true,
      status: response.status,
      dados: data,
    }
  } catch (error) {
    console.error("Erro na requisição de delete:", error)

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        sucesso: false,
        status: 0,
        dados: {
          error: "Erro de conexão com o servidor",
          details:
            "Verifique se o servidor Django está rodando em http://127.0.0.1:8000 e se as configurações de CORS estão corretas.",
          suggestion:
            "Tente acessar http://127.0.0.1:8000/api/soltura/ diretamente no navegador para verificar se o servidor está respondendo.",
        },
      }
    }

    return {
      sucesso: false,
      status: 0,
      dados: {
        error: error.message || "Erro desconhecido",
        details: "Erro inesperado durante a requisição",
      },
    }
  }
}

const SolturaDetailModal = ({ open, onClose, solturaId, onDelete }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    if (open && solturaId) {
      fetchData()
    }
  }, [open, solturaId])

  useEffect(() => {
    if (open) {
      setDeleteSuccess(false)
      setDeleting(false)
      setError(null)
    }
  }, [open])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await buscarSolturaPorId(solturaId)
      setData(result)
    } catch (err) {
      setError(err.message || "Erro ao buscar dados")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchData()
  }

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    setConfirmDeleteOpen(false)

    if (!solturaId) {
      setError("ID da soltura não encontrado")
      return
    }

    console.log("Iniciando delete para ID:", solturaId)
    console.log("onDelete function disponível:", typeof onDelete === "function")

    setDeleting(true)
    setError(null)

    try {
      const result = await deletarSoltura(solturaId)
      console.log("Resultado do delete:", result)

      if (result.sucesso) {
        setDeleteSuccess(true)
        console.log("Delete realizado com sucesso")

        // Chamar onDelete ANTES do timeout para garantir que a tabela seja atualizada imediatamente
        if (onDelete) {
          console.log("Chamando onDelete com ID:", solturaId)
          onDelete(solturaId)
        }

        setTimeout(() => {
          setDeleteSuccess(false)
          setDeleting(false)
          setError(null)
          setData(null)
          onClose()
        }, 800)
      } else {
        const errorMessage =
          result.dados?.error || result.dados?.message || `Erro HTTP ${result.status}` || "Erro desconhecido"

        const errorDetails = result.dados?.details || ""
        const suggestion = result.dados?.suggestion || ""

        console.error("Erro no delete:", errorMessage)

        let fullErrorMessage = `Erro ao deletar: ${errorMessage}`
        if (errorDetails) fullErrorMessage += `\n\nDetalhes: ${errorDetails}`
        if (suggestion) fullErrorMessage += `\n\nSugestão: ${suggestion}`

        setError(fullErrorMessage)
        setDeleting(false)
      }
    } catch (err) {
      console.error("Erro na função handleDelete:", err)
      setError(`Erro ao deletar: ${err.message}`)
      setDeleting(false)
    }
  }

  const formatarData = (dataString) => {
    if (!dataString) return "Não informado"

    try {
      const data = new Date(dataString)
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (e) {
      return dataString
    }
  }

  const getStatusColor = (status) => {
    if (!status) return "#64748b"

    if (status.toLowerCase().includes("finaliz")) {
      return "#059669"
    } else if (status.toLowerCase().includes("andamento")) {
      return "#d97706"
    } else if (status.toLowerCase().includes("cancel")) {
      return "#dc2626"
    } else if (status.toLowerCase().includes("pendent")) {
      return "#2563eb"
    } else {
      return "#7c3aed"
    }
  }

  if (!open) return null

  const statusColor = getStatusColor(data?.statusFrota)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 3,
          px: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "#475569",
              width: 48,
              height: 48,
              mr: 3,
            }}
          >
            <Assignment />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
              Detalhes da Soltura
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Código:
              </Typography>
              <Chip
                label={solturaId}
                size="small"
                sx={{
                  bgcolor: "#f1f5f9",
                  color: "#475569",
                  fontWeight: 600,
                  height: 24,
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            <Refresh />
          </IconButton>
          <IconButton
            onClick={onClose}
            sx={{
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              "&:hover": { bgcolor: "#fef2f2", borderColor: "#fecaca" },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
              flexDirection: "column",
              gap: 3,
            }}
          >
            <CircularProgress size={48} sx={{ color: "#475569" }} />
            <Typography sx={{ color: "#64748b", fontWeight: 500 }}>Carregando informações...</Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ p: 4 }}>
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
                "& .MuiAlert-message": { width: "100%" },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Erro ao carregar dados
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button size="small" onClick={handleRefresh} startIcon={<Refresh />} variant="contained" color="error">
                Tentar novamente
              </Button>
            </Alert>
          </Box>
        )}

        {/* Main Content */}
        {data && !loading && (
          <Box>
            {/* Status Section */}
            <Paper
              elevation={0}
              sx={{
                mx: 4,
                mt: 4,
                mb: 3,
                p: 3,
                borderRadius: 2,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    Status atual da soltura
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: statusColor,
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      {data.statusFrota?.toLowerCase().includes("finaliz") ? <CheckCircle /> : <Schedule />}
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: statusColor,
                      }}
                    >
                      {data.statusFrota || "Não informado"}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`#${solturaId}`}
                  sx={{
                    fontWeight: 600,
                    bgcolor: "#f1f5f9",
                    color: "#475569",
                    height: 32,
                  }}
                  icon={<Info />}
                />
              </Box>
            </Paper>

            {/* Main Content Grid */}
            <Box sx={{ display: "flex" }}>
              {/* Left Column - Driver Info */}
              <Box sx={{ width: "50%", borderRight: "1px solid #e2e8f0" }}>
                <Box sx={{ p: 4, borderBottom: "1px solid #e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Person sx={{ color: "#475569", mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Motorista
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: "#475569",
                        width: 56,
                        height: 56,
                        mr: 3,
                        fontSize: "1.5rem",
                        fontWeight: 600,
                      }}
                    >
                      {data.motorista ? data.motorista.charAt(0).toUpperCase() : "M"}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: "#1e293b",
                        }}
                      >
                        {data.motorista || "Não informado"}
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Badge sx={{ color: "#64748b", fontSize: 16, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {data.matriculaMotorista || "Matrícula não informada"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Tipo de Equipe
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Groups sx={{ fontSize: 18, color: "#64748b" }} />
                          {data.tipoEquipe || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Turno
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTime sx={{ fontSize: 18, color: "#64748b" }} />
                          {data.turno || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                {/* Collectors Section */}
                {data.coletores && data.coletores.length > 0 && (
                  <Box sx={{ p: 4, borderBottom: "1px solid #e2e8f0" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Groups sx={{ color: "#475569", mr: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Coletores ({data.coletores.length})
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {data.coletores.map((coletor, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#475569",
                              width: 36,
                              height: 36,
                              mr: 2,
                              fontSize: "0.9rem",
                            }}
                          >
                            {coletor.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography sx={{ fontWeight: 500 }}>{coletor}</Typography>
                          <Box sx={{ ml: "auto" }}>
                            <Chip
                              label="Ativo"
                              size="small"
                              sx={{
                                bgcolor: "#dcfce7",
                                color: "#166534",
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Leader Section */}
                {data.lider && (
                  <Box sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Person sx={{ color: "#475569", mr: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Líder da Equipe
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#475569",
                          width: 56,
                          height: 56,
                          mr: 3,
                          fontSize: "1.5rem",
                          fontWeight: 600,
                        }}
                      >
                        {data.lider ? data.lider.charAt(0).toUpperCase() : "L"}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: "#1e293b",
                          }}
                        >
                          {data.lider}
                        </Typography>
                        {data.celular && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Phone sx={{ color: "#64748b", fontSize: 16, mr: 1 }} />
                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                              {data.celular}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Right Column - Vehicle & Schedule */}
              <Box sx={{ width: "50%" }}>
                <Box sx={{ p: 4, borderBottom: "1px solid #e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <LocalShipping sx={{ color: "#475569", mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Veículo e Rota
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Prefixo
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
                          <DirectionsCar sx={{ color: "#64748b", mr: 1, fontSize: 18 }} />
                          <Chip
                            label={data.prefixo || "N/A"}
                            sx={{
                              fontWeight: 600,
                              bgcolor: "#dc2626",
                              color: "white",
                              height: 28,
                            }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Tipo de Veículo
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: "auto",
                            fontSize: "0.9rem",
                          }}
                        >
                          <Category sx={{ fontSize: 18, color: "#64748b" }} />
                          {data.tipoVeiculoSelecionado || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Rota
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: "auto",
                          }}
                        >
                          <Route sx={{ fontSize: 18, color: "#64748b" }} />
                          {data.rota || "N/A"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Frequência
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Repeat sx={{ fontSize: 18, color: "#64748b" }} />
                          {data.frequencia || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Tipo de Serviço
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Category sx={{ fontSize: 18, color: "#64748b" }} />
                          {data.tipoServico || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                {/* Schedule Section */}
                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <AccessTime sx={{ color: "#475569", mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Horários
                    </Typography>
                  </Box>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      mb: 3,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Data
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CalendarToday sx={{ fontSize: 20, color: "#64748b" }} />
                      {formatarData(data.data)}
                    </Typography>
                  </Paper>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Entrega da Chave
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Schedule sx={{ fontSize: 18, color: "#64748b" }} />
                          {data.horaEntregaChave || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Saída da Frota
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Schedule sx={{ fontSize: 18, color: "#64748b" }} />
                          {data.horaSaidaFrota || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Hora de Chegada
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Schedule sx={{ fontSize: 18, color: "#64748b" }} />
                          {data.horaChegada || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Additional Info */}
                  {(data.garagem || data.bairro || (data.setores && data.setores.length > 0)) && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      <Grid container spacing={2}>
                        {data.garagem && (
                          <Grid item xs={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "#f8fafc",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Garagem
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 500,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LocationOn sx={{ fontSize: 18, color: "#64748b" }} />
                                {data.garagem}
                              </Typography>
                            </Paper>
                          </Grid>
                        )}
                        {data.bairro && (
                          <Grid item xs={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "#f8fafc",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Bairro
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 500,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LocationOn sx={{ fontSize: 18, color: "#64748b" }} />
                                {data.bairro}
                              </Typography>
                            </Paper>
                          </Grid>
                        )}
                        {data.setores && data.setores.length > 0 && (
                          <Grid item xs={12}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "#f8fafc",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Setores
                              </Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {data.setores.map((setor, index) => (
                                  <Chip
                                    key={index}
                                    label={setor}
                                    size="small"
                                    sx={{
                                      bgcolor: "#dbeafe",
                                      color: "#1e40af",
                                      fontWeight: 500,
                                    }}
                                  />
                                ))}
                              </Box>
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            px: 3,
            py: 1,
            borderColor: "#d1d5db",
            color: "#6b7280",
            "&:hover": {
              borderColor: "#9ca3af",
              bgcolor: "#f9fafb",
            },
          }}
        >
          Fechar
        </Button>
        <Button
          variant="contained"
          onClick={handleDeleteClick}
          disabled={loading || deleting || deleteSuccess}
          startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Delete />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            px: 3,
            py: 1,
            bgcolor: deleteSuccess ? "#059669" : "#dc2626",
            "&:hover": {
              bgcolor: deleteSuccess ? "#059669" : "#b91c1c",
            },
            "&:disabled": {
              bgcolor: deleteSuccess ? "#059669" : "#fca5a5",
              color: deleteSuccess ? "white" : "#6b7280",
            },
          }}
        >
          {deleteSuccess ? "Deletado com Sucesso!" : deleting ? "Deletando..." : "Deletar Registro"}
        </Button>
      </DialogActions>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#fef2f2",
            borderBottom: "1px solid #fecaca",
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 3,
            px: 4,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#dc2626",
              width: 40,
              height: 40,
            }}
          >
            <Delete />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#991b1b" }}>
              Confirmar Exclusão
            </Typography>
            <Typography variant="body2" sx={{ color: "#7f1d1d" }}>
              Esta ação não pode ser desfeita
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "#dc2626" }}>
              Tem certeza que deseja deletar esta soltura?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#6b7280" }}>
              Todos os dados relacionados a esta soltura serão permanentemente removidos do sistema.
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "#fef2f2",
                border: "1px solid #fecaca",
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#dc2626", mb: 1 }}>
                Soltura #{solturaId}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                {data?.motorista && `Motorista: ${data.motorista}`}
                {data?.prefixo && ` • Prefixo: ${data.prefixo}`}
              </Typography>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            gap: 2,
            bgcolor: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              py: 1,
              borderColor: "#d1d5db",
              color: "#6b7280",
              "&:hover": {
                borderColor: "#9ca3af",
                bgcolor: "#f3f4f6",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Delete />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              py: 1,
              bgcolor: "#dc2626",
              "&:hover": {
                bgcolor: "#b91c1c",
              },
              "&:disabled": {
                bgcolor: "#fca5a5",
                color: "#6b7280",
              },
            }}
          >
            {deleting ? "Deletando..." : "Sim, Deletar"}
          </Button>
        </DialogActions>
      </Dialog> 
    </Dialog>
  )
}

export default SolturaDetailModal
