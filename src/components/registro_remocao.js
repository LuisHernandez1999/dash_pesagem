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
  IconButton,
  TextField,
  Autocomplete,
  alpha,
  Grid,
  Divider,
  Paper,
  InputAdornment,
  Tooltip,
  Zoom,
  CircularProgress,
  styled,
} from "@mui/material"
import {
  DirectionsCar,
  Close,
  CheckCircle,
  Person,
  Numbers,
  Group,
  LocalShipping,
  Warehouse,
  LocationOn,
  AccessTime,
  Key,
  Info,
  Timeline,
  AssignmentTurnedIn,
  CalendarToday,
  Repeat,
} from "@mui/icons-material"
import { Slide } from "@mui/material"
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { format } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { getColaboradoresListaMotoristasAtivos, getColaboradoresListaColetores } from "../service/dashboard"

// Componente estilizado para o Autocomplete para garantir que o texto não seja truncado
const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: "100%",
  "& .MuiAutocomplete-inputRoot": {
    padding: "10px 12px",
  },
  "& .MuiAutocomplete-input": {
    padding: "0 !important",
    width: "100% !important",
    textOverflow: "ellipsis",
  },
  "& .MuiAutocomplete-endAdornment": {
    right: "8px",
  },
  "& .MuiAutocomplete-popupIndicator": {
    padding: "2px",
  },
  "& .MuiAutocomplete-clearIndicator": {
    padding: "2px",
  },
}))

const RegisterModal = ({ open, onClose, formData, onChange, onSubmit, themeColors, loading }) => {
  const [activeSection, setActiveSection] = useState(0)
  const [keyDeliveryTime, setKeyDeliveryTime] = useState(null)
  const [departureTime, setDepartureTime] = useState(null)
  const [motoristas, setMotoristas] = useState([])
  const [coletores, setColetores] = useState([])
  const [loadingMotoristas, setLoadingMotoristas] = useState(false)
  const [loadingColetores, setLoadingColetores] = useState(false)
  const [selectedMotorista, setSelectedMotorista] = useState(null)
  const [selectedColetores, setSelectedColetores] = useState([null, null, null])

  // Data atual no formato brasileiro
  const dataAtual = format(new Date(), "dd/MM/yyyy")

  // Lista de garagens
  const garagens = ["PA1", "PA2", "PA3", "PA4"]

  // Lista de equipes
  const equipes = ["Equipe1(Matutino)", "Equipe2(Vespertino)", "Equipe3(Noturno)"]

  // Lista de status - limitada a "Em andamento" e "Finalizado"
  const statusOptions = ["Em andamento", "Finalizado"]

  // Lista de tipos de veículos - alterada para "Basculante", "Baú" e "Seletolix"
  const tiposVeiculos = ["Basculante", "Baú", "Seletolix"]

  // Frequência - sempre será "Diária"
  const frequencia = "Diária"

  // Carregar motoristas e coletores quando o modal abrir
  useEffect(() => {
    if (open) {
      fetchMotoristas()
      fetchColetores()

      // Inicializar os valores de data e frequência
      handleChange("date", dataAtual)
      handleChange("frequency", frequencia)
    }
  }, [open])

  // Função para buscar motoristas da API
  const fetchMotoristas = async () => {
    setLoadingMotoristas(true)
    try {
      const response = await getColaboradoresListaMotoristasAtivos()
      if (response.motoristas) {
        setMotoristas(response.motoristas)
      } else {
        console.error("Erro ao buscar motoristas:", response.error)
      }
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error)
    } finally {
      setLoadingMotoristas(false)
    }
  }

  // Função para buscar coletores da API
  const fetchColetores = async () => {
    setLoadingColetores(true)
    try {
      const response = await getColaboradoresListaColetores()
      if (response.coletores) {
        setColetores(response.coletores)
      } else {
        console.error("Erro ao buscar coletores:", response.error)
      }
    } catch (error) {
      console.error("Erro ao buscar coletores:", error)
    } finally {
      setLoadingColetores(false)
    }
  }

  const handleChange = (field, value, index = null) => {
    onChange(field, value, index)
  }

  const handleKeyDeliveryTimeChange = (newTime) => {
    setKeyDeliveryTime(newTime)
    // Converter para string no formato HH:MM para salvar no formData
    if (newTime) {
      const timeString = `${newTime.getHours().toString().padStart(2, "0")}:${newTime.getMinutes().toString().padStart(2, "0")}`
      handleChange("keyDeliveryTime", timeString)
    } else {
      handleChange("keyDeliveryTime", "")
    }
  }

  const handleDepartureTimeChange = (newTime) => {
    setDepartureTime(newTime)
    // Converter para string no formato HH:MM para salvar no formData
    if (newTime) {
      const timeString = `${newTime.getHours().toString().padStart(2, "0")}:${newTime.getMinutes().toString().padStart(2, "0")}`
      handleChange("departureTime", timeString)
    } else {
      handleChange("departureTime", "")
    }
  }

  // Função para lidar com a seleção de motorista
  const handleMotoristaChange = (event, newValue) => {
    setSelectedMotorista(newValue)
    if (newValue) {
      handleChange("driver", newValue.nome)
      handleChange("driverId", newValue.matricula)
    } else {
      handleChange("driver", "")
      handleChange("driverId", "")
    }
  }

  // Função para lidar com a seleção de coletores
  const handleColetorChange = (index, newValue) => {
    const newSelectedColetores = [...selectedColetores]
    newSelectedColetores[index] = newValue
    setSelectedColetores(newSelectedColetores)

    if (newValue) {
      handleChange("collectors", newValue.nome, index)
      // Se você também precisa armazenar a matrícula dos coletores, adicione aqui
    } else {
      handleChange("collectors", "", index)
    }
  }

  const sections = [
    { title: "Motorista e Veículo", icon: <Person /> },
    { title: "Equipe e Coletores", icon: <Group /> },
    { title: "Detalhes Operacionais", icon: <LocalShipping /> },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
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
          background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.75rem",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.05' fillRule='evenodd'/%3E%3C/svg%3E\")",
            backgroundSize: "cover",
            opacity: 0.1,
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "rgba(255, 255, 255, 0.2)",
            animation: `shimmer 2s infinite linear`,
            backgroundSize: "200% 100%",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", zIndex: 1 }}>
          <Avatar
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
              width: 48,
              height: 48,
              mr: 2,
              animation: `pulse 2s infinite ease-in-out`,
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
            }}
          >
            <DirectionsCar sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: "1.4rem", textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
            >
              Cadastrar Soltura
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, fontWeight: 500 }}>
              Preencha os dados para registrar uma nova soltura
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            padding: "0.5rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            zIndex: 1,
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

      {/* Seções de navegação */}
      <Box
        sx={{
          display: "flex",
          borderBottom: `1px solid ${themeColors.divider}`,
          backgroundColor: alpha(themeColors.primary.main, 0.03),
        }}
      >
        {sections.map((section, index) => (
          <Button
            key={index}
            onClick={() => setActiveSection(index)}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 0,
              borderBottom: activeSection === index ? `3px solid ${themeColors.primary.main}` : "3px solid transparent",
              color: activeSection === index ? themeColors.primary.main : themeColors.text.secondary,
              backgroundColor: activeSection === index ? alpha(themeColors.primary.main, 0.05) : "transparent",
              fontWeight: activeSection === index ? 600 : 500,
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": {
                backgroundColor: alpha(themeColors.primary.main, 0.08),
              },
              transition: "all 0.2s ease",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {section.icon}
              {section.title}
            </Box>
          </Button>
        ))}
      </Box>

      <DialogContent sx={{ padding: "1.75rem", maxHeight: "70vh", overflowY: "auto" }}>
        {/* Seção 1: Motorista e Veículo */}
        <Box sx={{ display: activeSection === 0 ? "block" : "none" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              background: `linear-gradient(145deg, white, ${alpha(themeColors.background.default, 0.7)})`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.primary.main, 0.1),
                  color: themeColors.primary.main,
                  width: 40,
                  height: 40,
                  mr: 2,
                }}
              >
                <Person />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.primary.main }}>
                Dados do Motorista
              </Typography>
            </Box>

            <StyledAutocomplete
              disablePortal
              options={motoristas}
              getOptionLabel={(option) => `${option.nome} (${option.matricula})`}
              loading={loadingMotoristas}
              value={selectedMotorista}
              onChange={handleMotoristaChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nome do Motorista"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Person sx={{ color: themeColors.text.secondary }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {loadingMotoristas ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      height: "64px", // Aumentado para 64px
                    },
                  }}
                />
              )}
              ListboxProps={{
                style: {
                  maxHeight: "250px",
                },
              }}
            />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              background: `linear-gradient(145deg, white, ${alpha(themeColors.background.default, 0.7)})`,
              position: "relative",
              zIndex: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.warning.main, 0.1),
                  color: themeColors.warning.main,
                  width: 40,
                  height: 40,
                  mr: 2,
                }}
              >
                <DirectionsCar />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.warning.main }}>
                Dados do Veículo
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Prefixo do Veículo"
                  fullWidth
                  variant="outlined"
                  value={formData.vehiclePrefix}
                  onChange={(e) => handleChange("vehiclePrefix", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Numbers sx={{ color: themeColors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      height: "64px", // Aumentado para 64px
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <StyledAutocomplete
                  disablePortal
                  options={tiposVeiculos}
                  value={formData.vehicleType}
                  onChange={(_, newValue) => handleChange("vehicleType", newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de Veículo"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <LocalShipping sx={{ color: themeColors.text.secondary }} />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "white",
                          height: "64px", // Aumentado para 64px
                        },
                      }}
                    />
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: "250px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Seção 2: Equipe e Coletores */}
        <Box sx={{ display: activeSection === 1 ? "block" : "none" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              background: `linear-gradient(145deg, white, ${alpha(themeColors.background.default, 0.7)})`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.success.main, 0.1),
                  color: themeColors.success.main,
                  width: 40,
                  height: 40,
                  mr: 2,
                }}
              >
                <Group />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.success.main }}>
                Equipe
              </Typography>
            </Box>

            <StyledAutocomplete
              options={equipes}
              value={formData.team}
              onChange={(_, newValue) => handleChange("team", newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecione a Equipe"
                  variant="outlined"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      height: "64px", // Aumentado para 64px
                    },
                  }}
                />
              )}
              sx={{ mb: 3 }}
              ListboxProps={{
                style: {
                  maxHeight: "250px",
                },
              }}
            />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              background: `linear-gradient(145deg, white, ${alpha(themeColors.background.default, 0.7)})`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.info.main, 0.1),
                  color: themeColors.info.main,
                  width: 40,
                  height: 40,
                  mr: 2,
                }}
              >
                <Group />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.info.main }}>
                Coletores
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} sm={12} md={4} key={index}>
                  <StyledAutocomplete
                    disablePortal
                    options={coletores}
                    getOptionLabel={(option) => `${option.nome} (${option.matricula})`}
                    loading={loadingColetores}
                    value={selectedColetores[index]}
                    onChange={(_, newValue) => handleColetorChange(index, newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={`Coletor ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <Person sx={{ color: themeColors.text.secondary }} />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                          endAdornment: (
                            <>
                              {loadingColetores ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "white",
                            height: "64px", // Aumentado para 64px
                          },
                        }}
                      />
                    )}
                    ListboxProps={{
                      style: {
                        maxHeight: "250px",
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Seção 3: Detalhes Operacionais */}
        <Box sx={{ display: activeSection === 2 ? "block" : "none" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              background: `linear-gradient(145deg, white, ${alpha(themeColors.background.default, 0.7)})`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.error.main, 0.1),
                  color: themeColors.error.main,
                  width: 40,
                  height: 40,
                  mr: 2,
                }}
              >
                <Warehouse />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.error.main }}>
                Localização
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StyledAutocomplete
                  disablePortal
                  options={garagens}
                  value={formData.garage}
                  onChange={(_, newValue) => handleChange("garage", newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Garagem"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <Warehouse sx={{ color: themeColors.text.secondary }} />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "white",
                          height: "64px", // Aumentado para 64px
                        },
                      }}
                    />
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: "250px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Setor"
                  fullWidth
                  variant="outlined"
                  value={formData.route}
                  onChange={(e) => handleChange("route", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: themeColors.text.secondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip
                          title="Informe o setor de atuação do veículo"
                          placement="top"
                          TransitionComponent={Zoom}
                        >
                          <Info fontSize="small" sx={{ color: themeColors.text.disabled }} />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      height: "64px", // Aumentado para 64px
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              background: `linear-gradient(145deg, white, ${alpha(themeColors.background.default, 0.7)})`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.info.main, 0.1),
                  color: themeColors.info.main,
                  width: 40,
                  height: 40,
                  mr: 2,
                }}
              >
                <Timeline />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.info.main }}>
                Status e Informações
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StyledAutocomplete
                  disablePortal
                  options={statusOptions}
                  value={formData.status || "Em andamento"}
                  onChange={(_, newValue) => handleChange("status", newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status da Frota"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <AssignmentTurnedIn sx={{ color: themeColors.text.secondary }} />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "white",
                          height: "64px", // Aumentado para 64px
                        },
                      }}
                    />
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: "250px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Data"
                  fullWidth
                  variant="outlined"
                  value={formData.date || dataAtual}
                  InputProps={{
                    readOnly: true, // Torna o campo somente leitura
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: themeColors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      height: "64px", // Aumentado para 64px
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Frequência"
                  fullWidth
                  variant="outlined"
                  value={formData.frequency || frequencia}
                  InputProps={{
                    readOnly: true, // Torna o campo somente leitura
                    startAdornment: (
                      <InputAdornment position="start">
                        <Repeat sx={{ color: themeColors.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      height: "64px", // Aumentado para 64px
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              background: `linear-gradient(145deg, white, ${alpha(themeColors.background.default, 0.7)})`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.secondary.main, 0.1),
                  color: themeColors.secondary.main,
                  width: 40,
                  height: 40,
                  mr: 2,
                }}
              >
                <AccessTime />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.secondary.main }}>
                Horários
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <TimePicker
                    label="Entrega de Chave"
                    value={keyDeliveryTime}
                    onChange={handleKeyDeliveryTimeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Key sx={{ color: themeColors.text.secondary }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "white",
                            height: "64px", // Aumentado para 64px
                          },
                        }}
                      />
                    )}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <TimePicker
                    label="Horário de Saída da Frota"
                    value={departureTime}
                    onChange={handleDepartureTimeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTime sx={{ color: themeColors.text.secondary }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "white",
                            height: "64px", // Aumentado para 64px
                          },
                        }}
                      />
                    )}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          padding: "1.25rem 1.75rem",
          background: alpha(themeColors.background.default, 0.5),
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
            startIcon={<Close />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: themeColors.divider,
              color: themeColors.text.secondary,
              "&:hover": {
                borderColor: themeColors.error.main,
                color: themeColors.error.main,
                backgroundColor: alpha(themeColors.error.main, 0.05),
              },
              px: 3,
            }}
          >
            Cancelar
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {activeSection > 0 && (
            <Button
              onClick={() => setActiveSection((prev) => prev - 1)}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: themeColors.primary.main,
                color: themeColors.primary.main,
                "&:hover": {
                  borderColor: themeColors.primary.dark,
                  backgroundColor: alpha(themeColors.primary.main, 0.05),
                },
                px: 3,
              }}
            >
              Anterior
            </Button>
          )}

          {activeSection < sections.length - 1 ? (
            <Button
              onClick={() => setActiveSection((prev) => prev + 1)}
              variant="contained"
              size="large"
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: themeColors.primary.main,
                boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.2)}`,
                "&:hover": {
                  backgroundColor: themeColors.primary.dark,
                  boxShadow: `0 6px 16px ${alpha(themeColors.primary.main, 0.3)}`,
                },
                px: 3,
              }}
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              variant="contained"
              size="large"
              startIcon={<CheckCircle />}
              disabled={loading}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: themeColors.success.main,
                boxShadow: `0 4px 12px ${alpha(themeColors.success.main, 0.2)}`,
                "&:hover": {
                  backgroundColor: themeColors.success.dark,
                  boxShadow: `0 6px 16px ${alpha(themeColors.success.main, 0.3)}`,
                },
                px: 3,
              }}
            >
              {loading ? "Cadastrando..." : "Cadastrar Soltura"}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default RegisterModal
