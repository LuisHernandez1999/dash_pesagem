"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  Grid,
  Chip,
  Divider,
  alpha,
  keyframes,
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
  VerifiedUser,
  Update,
} from "@mui/icons-material"
import { buscarSolturaPorId } from "../service/dashboard"

// Animações personalizadas
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.3); }
  50% { box-shadow: 0 0 30px rgba(33, 150, 243, 0.6); }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const SolturaDetailModal = ({ open, onClose, solturaId }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (open && solturaId) {
      fetchData()
    }
  }, [open, solturaId])

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

  // Função para obter a cor baseada no status com gradientes
  const getStatusColor = (status) => {
    if (!status) return { main: "#9e9e9e", gradient: ["#9e9e9e", "#757575"] }

    if (status.toLowerCase().includes("finaliz")) {
      return {
        main: "#4caf50",
        gradient: ["#66bb6a", "#4caf50", "#43a047"],
        glow: "rgba(76, 175, 80, 0.4)",
      }
    } else if (status.toLowerCase().includes("andamento")) {
      return {
        main: "#ff9800",
        gradient: ["#ffb74d", "#ff9800", "#f57c00"],
        glow: "rgba(255, 152, 0, 0.4)",
      }
    } else if (status.toLowerCase().includes("cancel")) {
      return {
        main: "#f44336",
        gradient: ["#e57373", "#f44336", "#d32f2f"],
        glow: "rgba(244, 67, 54, 0.4)",
      }
    } else if (status.toLowerCase().includes("pendent")) {
      return {
        main: "#2196f3",
        gradient: ["#64b5f6", "#2196f3", "#1976d2"],
        glow: "rgba(33, 150, 243, 0.4)",
      }
    } else {
      return {
        main: "#9c27b0",
        gradient: ["#ba68c8", "#9c27b0", "#7b1fa2"],
        glow: "rgba(156, 39, 176, 0.4)",
      }
    }
  }

  if (!open) return null

  const statusInfo = getStatusColor(data?.statusFrota)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 20%, rgba(33, 150, 243, 0.05) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        },
      }}
    >
      {/* Header - Agora com cor verde claro */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              position: "relative",
              mr: 3,
            }}
          >
            <Avatar
              sx={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)",
                backdropFilter: "blur(10px)",
                color: "white",
                width: 56,
                height: 56,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Assignment sx={{ fontSize: 28 }} />
            </Avatar>
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                fontSize: "1.5rem",
                mb: 0.5,
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                color: "white",
              }}
            >
              Detalhes da Soltura
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Código de Cadastro:
              </Typography>
              <Chip
                label={solturaId}
                size="small"
                sx={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontWeight: 700,
                  height: 28,
                  fontSize: "0.8rem",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                icon={<Info sx={{ fontSize: 16 }} />}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1, position: "relative", zIndex: 2 }}>
          <IconButton
            color="inherit"
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
              animation: loading ? `${pulse} 1s ease-in-out infinite` : "none",
            }}
          >
            <Refresh sx={{ animation: loading ? `${pulse} 1s linear infinite` : "none" }} />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={onClose}
            sx={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(255, 82, 82, 0.3) 0%, rgba(255, 82, 82, 0.2) 100%)",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: "transparent", position: "relative" }}>
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
              animation: `${slideIn} 0.5s ease-out`,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <CircularProgress
                size={64}
                sx={{
                  color: "#4caf50",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Update sx={{ fontSize: 20, color: "white" }} />
              </Box>
            </Box>
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: 600,
                fontSize: "1.1rem",
                textAlign: "center",
              }}
            >
              Carregando informações...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ p: 4, animation: `${slideIn} 0.5s ease-out` }}>
            <Alert
              severity="error"
              sx={{
                borderRadius: "16px",
                background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
                border: "1px solid rgba(244, 67, 54, 0.2)",
                boxShadow: "0 8px 32px rgba(244, 67, 54, 0.1)",
                "& .MuiAlert-icon": { fontSize: "2rem" },
                "& .MuiAlert-message": { width: "100%" },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#d32f2f" }}>
                Erro ao carregar dados
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: "#d32f2f" }}>
                {error}
              </Typography>
              <Button
                size="medium"
                onClick={handleRefresh}
                startIcon={<Refresh />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(244, 67, 54, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(244, 67, 54, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Tentar novamente
              </Button>
            </Alert>
          </Box>
        )}

        {/* Main Content */}
        {data && !loading && (
          <Box sx={{ animation: `${slideIn} 0.6s ease-out` }}>
            {/* Status Section */}
            <Paper
              elevation={0}
              sx={{
                mx: 4,
                mt: 4,
                mb: 4,
                p: 3,
                borderRadius: "20px",
                background: `rgba(${statusInfo.main === "#4caf50" ? "76, 175, 80" : statusInfo.main === "#ff9800" ? "255, 152, 0" : statusInfo.main === "#f44336" ? "244, 67, 54" : statusInfo.main === "#2196f3" ? "33, 150, 243" : "156, 39, 176"}, 0.08)`,
                border: `2px solid ${alpha(statusInfo.main, 0.2)}`,
                boxShadow: `0 8px 32px ${alpha(statusInfo.main, 0.15)}`,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s ease",
                "&:hover": {
                  boxShadow: `0 12px 40px ${alpha(statusInfo.main, 0.25)}`,
                  transform: "translateY(-4px)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(45deg, transparent 30%, ${alpha(statusInfo.main, 0.1)} 50%, transparent 70%)`,
                  animation: `${shimmer} 3s ease-in-out infinite`,
                  pointerEvents: "none",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 600, fontSize: "0.9rem" }}
                  >
                    Status atual da soltura
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ position: "relative", mr: 2 }}>
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, ${statusInfo.gradient[0]} 0%, ${statusInfo.gradient[1]} 50%, ${statusInfo.gradient[2]} 100%)`,
                          color: "white",
                          width: 48,
                          height: 48,
                          boxShadow: `0 8px 24px ${statusInfo.glow}`,
                          border: "3px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        {data.statusFrota?.toLowerCase().includes("finaliz") ? (
                          <CheckCircle sx={{ fontSize: 24 }} />
                        ) : (
                          <Schedule sx={{ fontSize: 24 }} />
                        )}
                      </Avatar>
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: statusInfo.main,
                        textShadow: `0 2px 4px ${alpha(statusInfo.main, 0.3)}`,
                        fontSize: "1.4rem",
                      }}
                    >
                      {data.statusFrota || "Não informado"}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`#${solturaId}`}
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                    color: "#1565c0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 16px rgba(25, 118, 210, 0.2)",
                    border: "2px solid rgba(25, 118, 210, 0.3)",
                    height: 36,
                    px: 2,
                    fontSize: "1rem",
                  }}
                  icon={<Info sx={{ fontSize: 18, color: "#1565c0" }} />}
                />
              </Box>
            </Paper>

            {/* Main Content Grid */}
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {/* Left Column - Driver Info */}
              <Box sx={{ width: "50%", p: 0, borderRight: "2px solid rgba(0, 0, 0, 0.06)" }}>
                <Box sx={{ p: 4, borderBottom: "2px solid rgba(0, 0, 0, 0.06)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                        mr: 2,
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                      }}
                    >
                      <Person sx={{ color: "#1565c0", fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#1565c0", fontSize: "1.2rem" }}>
                      Motorista
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Box sx={{ position: "relative", mr: 3 }}>
                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          width: 72,
                          height: 72,
                          fontSize: "2rem",
                          fontWeight: 800,
                          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                          border: "4px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        {data.motorista ? data.motorista.charAt(0).toUpperCase() : "M"}
                      </Avatar>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -4,
                          right: -4,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #4caf50 0%, #43a047 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)",
                        }}
                      >
                        <VerifiedUser sx={{ fontSize: 16, color: "white" }} />
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          mb: 1,
                          color: "#667eea",
                          fontSize: "1.3rem",
                        }}
                      >
                        {data.motorista || "Não informado"}
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Badge sx={{ color: "#ff9800", fontSize: 18, mr: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#ff9800" }}>
                            {data.matriculaMotorista || "Matrícula não informada"}
                          </Typography>
                        </Box>
                        {data.celular && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Phone sx={{ color: "#4caf50", fontSize: 18, mr: 1 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#4caf50" }}>
                              {data.celular}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: "16px",
                          background: "rgba(156, 39, 176, 0.05)",
                          border: "2px solid rgba(156, 39, 176, 0.2)",
                          boxShadow: "0 6px 20px rgba(156, 39, 176, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(156, 39, 176, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Tipo de Equipe
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#7b1fa2",
                          }}
                        >
                          <Groups sx={{ fontSize: 20 }} />
                          {data.tipoEquipe || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: "16px",
                          background: "rgba(255, 152, 0, 0.05)",
                          border: "2px solid rgba(255, 152, 0, 0.2)",
                          boxShadow: "0 6px 20px rgba(255, 152, 0, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(255, 152, 0, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Turno
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#f57c00",
                          }}
                        >
                          <AccessTime sx={{ fontSize: 20 }} />
                          {data.turno || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                {/* Collectors Section */}
                {data.coletores && data.coletores.length > 0 && (
                  <Box sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                          mr: 2,
                          boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                        }}
                      >
                        <Groups sx={{ color: "#2e7d32", fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2e7d32", fontSize: "1.2rem" }}>
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
                            borderRadius: "16px",
                            background: "rgba(76, 175, 80, 0.05)",
                            border: "2px solid rgba(76, 175, 80, 0.3)",
                            boxShadow: "0 4px 16px rgba(76, 175, 80, 0.1)",
                            transition: "all 0.3s ease",
                            animation: `${slideIn} 0.5s ease-out ${index * 0.1}s both`,
                            "&:hover": {
                              background: "rgba(76, 175, 80, 0.1)",
                              transform: "translateX(8px) scale(1.02)",
                              boxShadow: "0 6px 20px rgba(76, 175, 80, 0.2)",
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              background: "linear-gradient(135deg, #4caf50 0%, #43a047 100%)",
                              color: "white",
                              width: 44,
                              height: 44,
                              mr: 2,
                              fontSize: "1rem",
                              fontWeight: 800,
                              border: "3px solid rgba(255, 255, 255, 0.3)",
                              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                            }}
                          >
                            {coletor.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1b5e20" }}>
                            {coletor}
                          </Typography>
                          <Box sx={{ ml: "auto" }}>
                            <Chip
                              label="Ativo"
                              size="small"
                              sx={{
                                background: "linear-gradient(135deg, #4caf50 0%, #43a047 100%)",
                                color: "white",
                                fontWeight: 600,
                                boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
                              }}
                            />
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Right Column - Vehicle & Schedule */}
              <Box sx={{ width: "50%", p: 0 }}>
                <Box sx={{ p: 4, borderBottom: "2px solid rgba(0, 0, 0, 0.06)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
                        mr: 2,
                        boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
                      }}
                    >
                      <LocalShipping sx={{ color: "#c62828", fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#c62828", fontSize: "1.2rem" }}>
                      Veículo e Rota
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: "16px",
                          background: "rgba(244, 67, 54, 0.05)",
                          border: "2px solid rgba(244, 67, 54, 0.3)",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "0 6px 20px rgba(244, 67, 54, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(244, 67, 54, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Prefixo
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
                          <DirectionsCar sx={{ color: "#d32f2f", mr: 1, fontSize: 20 }} />
                          <Chip
                            label={data.prefixo || "N/A"}
                            sx={{
                              fontWeight: 800,
                              background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                              color: "white",
                              borderRadius: "8px",
                              height: 32,
                              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
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
                          borderRadius: "16px",
                          background: "rgba(156, 39, 176, 0.05)",
                          border: "2px solid rgba(156, 39, 176, 0.2)",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "0 6px 20px rgba(156, 39, 176, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(156, 39, 176, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Tipo de Veículo
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: "auto",
                            fontSize: "0.9rem",
                            color: "#7b1fa2",
                          }}
                        >
                          <Category sx={{ fontSize: 20 }} />
                          {data.tipoVeiculoSelecionado || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: "16px",
                          background: "rgba(33, 150, 243, 0.05)",
                          border: "2px solid rgba(33, 150, 243, 0.2)",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "0 6px 20px rgba(33, 150, 243, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(33, 150, 243, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Rota
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 800,
                            color: "#1565c0",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: "auto",
                          }}
                        >
                          <Route sx={{ fontSize: 20 }} />
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
                          p: 2.5,
                          borderRadius: "16px",
                          background: "rgba(156, 39, 176, 0.05)",
                          border: "2px solid rgba(156, 39, 176, 0.2)",
                          boxShadow: "0 6px 20px rgba(156, 39, 176, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(156, 39, 176, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Frequência
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1, color: "#7b1fa2" }}
                        >
                          <Repeat sx={{ fontSize: 20 }} />
                          {data.frequencia || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: "16px",
                          background: "rgba(0, 150, 136, 0.05)",
                          border: "2px solid rgba(0, 150, 136, 0.2)",
                          boxShadow: "0 6px 20px rgba(0, 150, 136, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(0, 150, 136, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Tipo de Serviço
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1, color: "#00695c" }}
                        >
                          <Category sx={{ fontSize: 20 }} />
                          {data.tipoServico || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                {/* Schedule Section */}
                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                        mr: 2,
                        boxShadow: "0 4px 12px rgba(255, 152, 0, 0.2)",
                      }}
                    >
                      <AccessTime sx={{ color: "#ef6c00", fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#ef6c00", fontSize: "1.2rem" }}>
                      Horários
                    </Typography>
                  </Box>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: "16px",
                      background: "rgba(255, 152, 0, 0.05)",
                      border: "2px solid rgba(255, 152, 0, 0.3)",
                      mb: 3,
                      boxShadow: "0 8px 24px rgba(255, 152, 0, 0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 32px rgba(255, 152, 0, 0.2)",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                    >
                      Data
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: "#ef6c00",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CalendarToday sx={{ fontSize: 24, color: "#ef6c00" }} />
                      {formatarData(data.data)}
                    </Typography>
                  </Paper>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: "16px",
                          background: "rgba(76, 175, 80, 0.05)",
                          border: "2px solid rgba(76, 175, 80, 0.2)",
                          boxShadow: "0 6px 20px rgba(76, 175, 80, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(76, 175, 80, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Entrega da Chave
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#2e7d32",
                          }}
                        >
                          <Schedule sx={{ fontSize: 20 }} />
                          {data.horaEntregaChave || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: "16px",
                          background: "rgba(33, 150, 243, 0.05)",
                          border: "2px solid rgba(33, 150, 243, 0.2)",
                          boxShadow: "0 6px 20px rgba(33, 150, 243, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(33, 150, 243, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          Saída da Frota
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#1565c0",
                          }}
                        >
                          <Schedule sx={{ fontSize: 20 }} />
                          {data.horaSaidaFrota || "Não informado"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Additional Info */}
                  {(data.garagem || (data.setores && data.setores.length > 0)) && (
                    <>
                      <Divider
                        sx={{
                          my: 3,
                          borderColor: "rgba(0, 0, 0, 0.08)",
                          "&::before, &::after": {
                            borderColor: "rgba(255, 152, 0, 0.3)",
                          },
                        }}
                      />
                      <Grid container spacing={2}>
                        {data.garagem && (
                          <Grid item xs={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2.5,
                                borderRadius: "16px",
                                background: "rgba(3, 169, 244, 0.05)",
                                border: "2px solid rgba(3, 169, 244, 0.2)",
                                boxShadow: "0 6px 20px rgba(3, 169, 244, 0.1)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: "0 8px 25px rgba(3, 169, 244, 0.2)",
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                              >
                                Garagem
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  color: "#0277bd",
                                }}
                              >
                                <LocationOn sx={{ fontSize: 20 }} />
                                {data.garagem}
                              </Typography>
                            </Paper>
                          </Grid>
                        )}
                        {data.setores && data.setores.length > 0 && (
                          <Grid item xs={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2.5,
                                borderRadius: "16px",
                                background: "rgba(76, 175, 80, 0.05)",
                                border: "2px solid rgba(76, 175, 80, 0.2)",
                                boxShadow: "0 6px 20px rgba(76, 175, 80, 0.1)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.2)",
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1, fontSize: "0.8rem", fontWeight: 600 }}
                              >
                                Setores
                              </Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {data.setores.map((setor, index) => (
                                  <Chip
                                    key={index}
                                    label={setor}
                                    size="small"
                                    sx={{
                                      borderRadius: "8px",
                                      background: "linear-gradient(135deg, #4caf50 0%, #43a047 100%)",
                                      color: "white",
                                      height: 28,
                                      fontWeight: 700,
                                      boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
                                      animation: `${slideIn} 0.5s ease-out ${index * 0.1}s both`,
                                      "& .MuiChip-label": { px: 1.5, py: 0 },
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
          p: 4,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderTop: "2px solid rgba(0, 0, 0, 0.06)",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "16px",
            textTransform: "none",
            fontWeight: 700,
            px: 4,
            py: 1.5,
            borderColor: "rgba(0, 0, 0, 0.12)",
            color: "#64748b",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              borderColor: "rgba(0, 0, 0, 0.24)",
              background: "linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(226, 232, 240, 0.9) 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Fechar
        </Button>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          disabled={loading}
          startIcon={<Refresh />}
          sx={{
            borderRadius: "16px",
            textTransform: "none",
            fontWeight: 700,
            px: 4,
            py: 1.5,
            background: "transparent",
            color: "#4caf50",
            borderColor: "#4caf50",
            "&:hover": {
              borderColor: "#2e7d32",
              background: "rgba(76, 175, 80, 0.05)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(76, 175, 80, 0.15)",
            },
            "&:disabled": {
              borderColor: "#c8e6c9",
              color: "#a5d6a7",
            },
            transition: "all 0.3s ease",
          }}
        >
          Atualizar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SolturaDetailModal
