"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  alpha,
  Slide,
  Avatar,
  Snackbar,
  Alert,
  Autocomplete,
  CircularProgress,
  Paper,
  Chip,
  GlobalStyles,
} from "@mui/material"
import {
  Close,
  DirectionsCar,
  Person,
  Group,
  Warehouse,
  SupervisorAccount,
  AccessTime,
  Phone,
  Check,
  EventNote,
  Speed,
  LocalShipping,
} from "@mui/icons-material"
import {
  cadastrarSoltura,
  getVeiculosListaAtivos,
  getColaboradoresListaMotoristasAtivos,
  getColaboradoresListaColetores,
} from "../service/dashboard"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

// Definindo os estilos globais para as animações
const globalStyles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`

const RegisterModal = ({ open, onClose, themeColors, onRegisterSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })
  const [formData, setFormData] = useState({
    motorista: "",
    veiculo: "",
    frequencia: "",
    hora_entrega_chave: "",
    hora_saida_frota: "",
    hora_chegada: "",
    turno: "",
    tipo_servico: "Remoção",
    tipo_equipe: "",
    status_frota: "Em Andamento",
    garagem: "",
    rota: "",
    lider: "",
    celular: "",
    coletores: ["", "", ""],
    data: getCurrentDate(),
    tipo_veiculo_selecionado: "", // Renomeado conforme solicitado
  })

  // Estados para os dados de autocomplete
  const [veiculos, setVeiculos] = useState([])
  const [motoristas, setMotoristas] = useState([])
  const [coletoresLista, setColetoresLista] = useState([])
  const [loadingData, setLoadingData] = useState({
    veiculos: false,
    motoristas: false,
    coletores: false,
  })

  // Função para obter a data atual no formato YYYY-MM-DD
  function getCurrentDate() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Carregar dados para autocomplete quando o modal abrir
  useEffect(() => {
    if (open) {
      fetchVeiculos()
      fetchMotoristas()
      fetchColetores()
    }
  }, [open])

  // Buscar veículos ativos
  const fetchVeiculos = async () => {
    setLoadingData((prev) => ({ ...prev, veiculos: true }))
    try {
      const response = await getVeiculosListaAtivos()
      if (response.veiculos) {
        setVeiculos(response.veiculos)
      } else {
        setAlert({
          open: true,
          message: response.error || "Erro ao carregar veículos",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar veículos:", error)
    } finally {
      setLoadingData((prev) => ({ ...prev, veiculos: false }))
    }
  }

  // Buscar motoristas ativos
  const fetchMotoristas = async () => {
    setLoadingData((prev) => ({ ...prev, motoristas: true }))
    try {
      const response = await getColaboradoresListaMotoristasAtivos()
      if (response.motoristas) {
        setMotoristas(response.motoristas)
      } else {
        setAlert({
          open: true,
          message: response.error || "Erro ao carregar motoristas",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error)
    } finally {
      setLoadingData((prev) => ({ ...prev, motoristas: false }))
    }
  }

  // Buscar coletores ativos
  const fetchColetores = async () => {
    setLoadingData((prev) => ({ ...prev, coletores: true }))
    try {
      const response = await getColaboradoresListaColetores()
      if (response.coletores) {
        setColetoresLista(response.coletores)
      } else {
        setAlert({
          open: true,
          message: response.error || "Erro ao carregar coletores",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar coletores:", error)
    } finally {
      setLoadingData((prev) => ({ ...prev, coletores: false }))
    }
  }

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (field, value, index = null) => {
    if (index !== null) {
      // Para arrays como coletores
      setFormData((prev) => {
        const newArray = [...prev[field]]
        newArray[index] = value
        return { ...prev, [field]: newArray }
      })
    } else {
      // Para campos normais
      setFormData((prev) => {
        const updates = { [field]: value }

        // Lógica especial para tipo_servico "Remoção" - limpar rota
        if (field === "tipo_servico" && value === "Remoção") {
          updates.rota = ""
        }

        // Lógica para atualizar o turno automaticamente com base na equipe
        if (field === "tipo_equipe") {
          if (value === "Equipe1(Matutino)") {
            updates.turno = "Matutino"
          } else if (value === "Equipe2(Vespertino)") {
            updates.turno = "Vespertino"
          } else if (value === "Equipe3(Noturno)") {
            updates.turno = "Noturno"
          }
        }

        return { ...prev, ...updates }
      })
    }
  }

  // Modifique a função handleSubmit para combinar a data com os horários antes de enviar
  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Filtra coletores vazios
      const filteredColetores = formData.coletores.filter((coletor) => coletor && coletor.trim() !== "")

      // Combinar a data selecionada com os horários para criar timestamps completos
      const dataFormatada = formData.data // Já está no formato YYYY-MM-DD

      // Formatar os horários com a data
      const horaEntregaChaveFormatada = formData.hora_entrega_chave
        ? `${dataFormatada} ${formData.hora_entrega_chave}:00`
        : null

      const horaSaidaFrotaFormatada = formData.hora_saida_frota
        ? `${dataFormatada} ${formData.hora_saida_frota}:00`
        : null

      // Hora de chegada só é enviada se o status for "Finalizado"
      const horaChegadaFormatada =
        formData.status_frota === "Finalizado" && formData.hora_chegada
          ? `${dataFormatada} ${formData.hora_chegada}:00`
          : null

      const solturaData = {
        ...formData,
        coletores: filteredColetores,
        // Enviar os horários formatados com data
        hora_entrega_chave: horaEntregaChaveFormatada,
        hora_saida_frota: horaSaidaFrotaFormatada,
        hora_chegada: horaChegadaFormatada,
        // Usar o campo renomeado para tipo de veículo
        tipo_veiculo: formData.tipo_veiculo_selecionado,
      }

      const response = await cadastrarSoltura(solturaData)

      if (response.error) {
        setAlert({
          open: true,
          message: typeof response.error === "string" ? response.error : "Erro ao cadastrar soltura",
          severity: "error",
        })
      } else {
        setAlert({
          open: true,
          message: "Soltura cadastrada com sucesso!",
          severity: "success",
        })

        // Chamar a função de callback para atualizar os dados estatísticos
        if (typeof onRegisterSuccess === "function") {
          onRegisterSuccess()
        }

        // Limpa o formulário após sucesso
        setTimeout(() => {
          onClose()
          setFormData({
            motorista: "",
            veiculo: "",
            frequencia: "",
            hora_entrega_chave: "",
            hora_saida_frota: "",
            hora_chegada: "",
            turno: "",
            tipo_servico: "Remoção",
            tipo_equipe: "",
            status_frota: "Em Andamento",
            garagem: "",
            rota: "",
            lider: "",
            celular: "",
            coletores: ["", "", ""],
            data: getCurrentDate(),
            tipo_veiculo_selecionado: "",
          })
        }, 1500)
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Erro ao processar a solicitação",
        severity: "error",
      })
      console.error("Erro ao cadastrar soltura:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  // Estilo padrão para todos os campos
  const fieldStyle = {
    width: "100%",
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      height: "56px",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: `0 4px 8px ${alpha(themeColors.primary.main, 0.15)}`,
      },
      "&.Mui-focused": {
        boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.25)}`,
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "1.1rem",
    },
    "& .MuiInputLabel-root": {
      fontSize: "1rem",
      fontWeight: 500,
      "&.Mui-focused": {
        color: themeColors.primary.main,
      },
    },
  }

  // Estilo para campos maiores (como coletores e horários)
  const largeFieldStyle = {
    width: "100%",
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      height: "70px",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: `0 4px 8px ${alpha(themeColors.primary.main, 0.15)}`,
      },
      "&.Mui-focused": {
        boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.25)}`,
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "1.2rem",
      padding: "14px 14px",
    },
    "& .MuiInputLabel-root": {
      fontSize: "1.1rem",
      fontWeight: 500,
      "&.Mui-focused": {
        color: themeColors.primary.main,
      },
    },
  }

  // Estilo para os títulos das seções
  const sectionTitleStyle = {
    display: "flex",
    alignItems: "center",
    mb: 2.5,
    pb: 1.5,
    borderBottom: `2px solid ${alpha(themeColors.primary.main, 0.2)}`,
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -2,
      left: 0,
      width: "60px",
      height: "2px",
      backgroundColor: themeColors.primary.main,
    },
  }

  // Estilo para os cards de seção
  const sectionCardStyle = {
    p: 3,
    mb: 3,
    borderRadius: "16px",
    backgroundColor: alpha(themeColors.background.paper, 0.9),
    border: `1px solid ${alpha(themeColors.divider, 0.1)}`,
    boxShadow: `0 8px 24px ${alpha(themeColors.primary.main, 0.08)}`,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: `0 12px 28px ${alpha(themeColors.primary.main, 0.12)}`,
      transform: "translateY(-2px)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      background: `linear-gradient(90deg, ${themeColors.primary.main}, ${themeColors.primary.light})`,
    },
  }

  return (
    <>
      <GlobalStyles styles={{ html: { ...globalStyles } }} />
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.2rem 1.8rem",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: `linear-gradient(90deg, transparent, ${alpha("#ffffff", 0.2)}, transparent)`,
              animation: "shimmer 2s infinite linear",
              backgroundSize: "200% 100%",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                fontWeight: 600,
                width: 42,
                height: 42,
                mr: 1.8,
                animation: "pulse 2s infinite ease-in-out",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <DirectionsCar />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 0.2 }}>
                Cadastrar Nova Soltura
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Preencha os dados para registrar uma nova soltura de veículo
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#ffffff",
              padding: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
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
        <DialogContent sx={{ padding: "1.8rem", backgroundColor: alpha(themeColors.background.default, 0.5) }}>
          {/* Container principal */}
          <Box sx={{ width: "100%" }}>
            {/* Seção: Dados do Motorista */}
            <Paper
              elevation={0}
              sx={{
                ...sectionCardStyle,
                animation: "fadeIn 0.4s ease-out forwards",
              }}
            >
              <Box sx={sectionTitleStyle}>
                <Avatar
                  sx={{
                    backgroundColor: alpha(themeColors.primary.main, 0.1),
                    color: themeColors.primary.main,
                    mr: 1.5,
                    width: 40,
                    height: 40,
                  }}
                >
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                    Dados do Motorista
                  </Typography>
                  <Typography variant="caption" sx={{ color: themeColors.text.secondary }}>
                    Informações sobre o motorista e veículo
                  </Typography>
                </Box>
                <Chip
                  label="Obrigatório"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ ml: "auto", fontWeight: 500 }}
                />
              </Box>

              <Autocomplete
                options={motoristas}
                getOptionLabel={(option) => option.nome || ""}
                loading={loadingData.motoristas}
                value={motoristas.find((m) => m.nome === formData.motorista) || null}
                onChange={(event, newValue) => {
                  handleChange("motorista", newValue ? newValue.nome : "")
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nome do Motorista"
                    variant="outlined"
                    fullWidth
                    required
                    sx={fieldStyle}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <Person sx={{ color: themeColors.primary.main, mr: 1, opacity: 0.7 }} />,
                      endAdornment: (
                        <>
                          {loadingData.motoristas ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Autocomplete
                    options={veiculos}
                    getOptionLabel={(option) => option.prefixo || ""}
                    loading={loadingData.veiculos}
                    value={veiculos.find((v) => v.prefixo === formData.veiculo) || null}
                    onChange={(event, newValue) => {
                      handleChange("veiculo", newValue ? newValue.prefixo : "")
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Veículo"
                        variant="outlined"
                        fullWidth
                        required
                        sx={fieldStyle}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <LocalShipping sx={{ color: themeColors.primary.main, mr: 1, opacity: 0.7 }} />
                          ),
                          endAdornment: (
                            <>
                              {loadingData.veiculos ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth sx={fieldStyle}>
                    <InputLabel>Tipo de Veículo</InputLabel>
                    <Select
                      value={formData.tipo_veiculo_selecionado}
                      label="Tipo de Veículo"
                      onChange={(e) => handleChange("tipo_veiculo_selecionado", e.target.value)}
                      startAdornment={<DirectionsCar sx={{ color: themeColors.primary.main, mr: 1, opacity: 0.7 }} />}
                    >
                      <MenuItem value="Basculante">Basculante</MenuItem>
                      <MenuItem value="Baú">Baú</MenuItem>
                      <MenuItem value="Seletolix">Seletolix</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Paper>

            {/* Seção: Equipe e Turno */}
            <Paper
              elevation={0}
              sx={{
                ...sectionCardStyle,
                animation: "fadeIn 0.5s ease-out forwards",
              }}
            >
              <Box sx={sectionTitleStyle}>
                <Avatar
                  sx={{
                    backgroundColor: alpha(themeColors.success.main, 0.1),
                    color: themeColors.success.main,
                    mr: 1.5,
                    width: 40,
                    height: 40,
                  }}
                >
                  <Group />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                    Equipe e Turno
                  </Typography>
                  <Typography variant="caption" sx={{ color: themeColors.text.secondary }}>
                    Informações sobre a equipe de trabalho
                  </Typography>
                </Box>
              </Box>

              <FormControl fullWidth sx={fieldStyle}>
                <InputLabel>Tipo de Equipe</InputLabel>
                <Select
                  value={formData.tipo_equipe}
                  label="Tipo de Equipe"
                  onChange={(e) => handleChange("tipo_equipe", e.target.value)}
                  startAdornment={<Group sx={{ color: themeColors.success.main, mr: 1, opacity: 0.7 }} />}
                >
                  <MenuItem value="Equipe1(Matutino)">Equipe 1 (Matutino)</MenuItem>
                  <MenuItem value="Equipe2(Vespertino)">Equipe 2 (Vespertino)</MenuItem>
                  <MenuItem value="Equipe3(Noturno)">Equipe 3 (Noturno)</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  ...fieldStyle,
                  "& .Mui-disabled": {
                    backgroundColor: alpha(themeColors.text.secondary, 0.05),
                  },
                }}
              >
                <InputLabel>Turno</InputLabel>
                <Select
                  value={formData.turno}
                  label="Turno"
                  disabled
                  startAdornment={<AccessTime sx={{ color: themeColors.info.main, mr: 1, opacity: 0.7 }} />}
                >
                  <MenuItem value="Matutino">Matutino</MenuItem>
                  <MenuItem value="Vespertino">Vespertino</MenuItem>
                  <MenuItem value="Noturno">Noturno</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Seção: Garagem e Status */}
            <Paper
              elevation={0}
              sx={{
                ...sectionCardStyle,
                animation: "fadeIn 0.6s ease-out forwards",
              }}
            >
              <Box sx={sectionTitleStyle}>
                <Avatar
                  sx={{
                    backgroundColor: alpha(themeColors.info.main, 0.1),
                    color: themeColors.info.main,
                    mr: 1.5,
                    width: 40,
                    height: 40,
                  }}
                >
                  <Warehouse />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                    Garagem e Status
                  </Typography>
                  <Typography variant="caption" sx={{ color: themeColors.text.secondary }}>
                    Localização e situação atual
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth sx={fieldStyle}>
                    <InputLabel>Garagem</InputLabel>
                    <Select
                      value={formData.garagem}
                      label="Garagem"
                      onChange={(e) => handleChange("garagem", e.target.value)}
                      startAdornment={<Warehouse sx={{ color: themeColors.info.main, mr: 1, opacity: 0.7 }} />}
                    >
                      <MenuItem value="PA1">PA1</MenuItem>
                      <MenuItem value="PA2">PA2</MenuItem>
                      <MenuItem value="PA3">PA3</MenuItem>
                      <MenuItem value="PA4">PA4</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth sx={fieldStyle}>
                    <InputLabel>Status da Frota</InputLabel>
                    <Select
                      value={formData.status_frota}
                      label="Status da Frota"
                      onChange={(e) => handleChange("status_frota", e.target.value)}
                      startAdornment={<Speed sx={{ color: themeColors.warning.main, mr: 1, opacity: 0.7 }} />}
                    >
                      <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                      <MenuItem value="Finalizado">Finalizado</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Rota - Apenas se não for Remoção */}
              {formData.tipo_servico !== "Remoção" && (
                <TextField
                  fullWidth
                  label="Rota"
                  variant="outlined"
                  value={formData.rota}
                  onChange={(e) => handleChange("rota", e.target.value)}
                  sx={fieldStyle}
                />
              )}
            </Paper>

            {/* Seção: Horários */}
            <Paper
              elevation={0}
              sx={{
                ...sectionCardStyle,
                animation: "fadeIn 0.7s ease-out forwards",
              }}
            >
              <Box sx={sectionTitleStyle}>
                <Avatar
                  sx={{
                    backgroundColor: alpha(themeColors.info.main, 0.1),
                    color: themeColors.info.main,
                    mr: 1.5,
                    width: 40,
                    height: 40,
                  }}
                >
                  <AccessTime />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                    Horários
                  </Typography>
                  <Typography variant="caption" sx={{ color: themeColors.text.secondary }}>
                    Controle de tempo da operação
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Data"
                    type="date"
                    variant="outlined"
                    value={formData.data}
                    onChange={(e) => handleChange("data", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyle}
                    InputProps={{
                      startAdornment: <EventNote sx={{ color: themeColors.info.main, mr: 1, opacity: 0.7 }} />,
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Frequência"
                    variant="outlined"
                    value={formData.frequencia}
                    onChange={(e) => handleChange("frequencia", e.target.value)}
                    sx={fieldStyle}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 300px" }}>
                  {/* Hora de Entrega da Chave */}
                  <TextField
                    fullWidth
                    label="Hora de Entrega da Chave"
                    type="time"
                    variant="outlined"
                    value={formData.hora_entrega_chave}
                    onChange={(e) => handleChange("hora_entrega_chave", e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: "1rem",
                        whiteSpace: "nowrap",
                      },
                    }}
                    sx={largeFieldStyle}
                    InputProps={{
                      startAdornment: <AccessTime sx={{ color: themeColors.info.main, mr: 1, opacity: 0.7 }} />,
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 300px" }}>
                  {/* Hora de Saída da Frota */}
                  <TextField
                    fullWidth
                    label="Hora de Saída da Frota"
                    type="time"
                    variant="outlined"
                    value={formData.hora_saida_frota}
                    onChange={(e) => handleChange("hora_saida_frota", e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: "1rem",
                        whiteSpace: "nowrap",
                      },
                    }}
                    sx={largeFieldStyle}
                    InputProps={{
                      startAdornment: <AccessTime sx={{ color: themeColors.info.main, mr: 1, opacity: 0.7 }} />,
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 300px" }}>
                  {/* Hora de Chegada */}
                  <TextField
                    fullWidth
                    label="Hora de Chegada"
                    type="time"
                    variant="outlined"
                    value={formData.hora_chegada}
                    onChange={(e) => handleChange("hora_chegada", e.target.value)}
                    disabled={formData.status_frota !== "Finalizado"}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: "1rem",
                        whiteSpace: "nowrap",
                      },
                    }}
                    sx={{
                      ...largeFieldStyle,
                      "& .Mui-disabled": {
                        backgroundColor: alpha(themeColors.text.secondary, 0.05),
                      },
                    }}
                    InputProps={{
                      startAdornment: <AccessTime sx={{ color: themeColors.info.main, mr: 1, opacity: 0.7 }} />,
                    }}
                  />
                </Box>
              </Box>
            </Paper>

            {/* Seção: Coletores */}
            {formData.tipo_servico?.toLowerCase() !== "varrição" && (
              <Paper
                elevation={0}
                sx={{
                  ...sectionCardStyle,
                  animation: "fadeIn 0.8s ease-out forwards",
                }}
              >
                <Box sx={sectionTitleStyle}>
                  <Avatar
                    sx={{
                      backgroundColor: alpha(themeColors.error.main, 0.1),
                      color: themeColors.error.main,
                      mr: 1.5,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Group />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                      Coletores (até 3)
                    </Typography>
                    <Typography variant="caption" sx={{ color: themeColors.text.secondary }}>
                      Equipe de coleta
                    </Typography>
                  </Box>
                </Box>

                {/* CADA COLETOR EM UMA LINHA SEPARADA */}
                {[0, 1, 2].map((index) => (
                  <Autocomplete
                    key={`coletor-${index}`}
                    options={coletoresLista}
                    getOptionLabel={(option) => option.nome || ""}
                    loading={loadingData.coletores}
                    value={coletoresLista.find((c) => c.nome === formData.coletores[index]) || null}
                    onChange={(event, newValue) => {
                      handleChange("coletores", newValue ? newValue.nome : "", index)
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={`Coletor ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        sx={largeFieldStyle}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <Person sx={{ color: themeColors.error.main, mr: 1, opacity: 0.7 }} />,
                          endAdornment: (
                            <>
                              {loadingData.coletores ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                ))}
              </Paper>
            )}

            {/* Seção: Líder e Contato */}
            <Paper
              elevation={0}
              sx={{
                ...sectionCardStyle,
                animation: "fadeIn 0.9s ease-out forwards",
              }}
            >
              <Box sx={sectionTitleStyle}>
                <Avatar
                  sx={{
                    backgroundColor: alpha(themeColors.secondary.main, 0.1),
                    color: themeColors.secondary.main,
                    mr: 1.5,
                    width: 40,
                    height: 40,
                  }}
                >
                  <SupervisorAccount />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                    Líder e Contato
                  </Typography>
                  <Typography variant="caption" sx={{ color: themeColors.text.secondary }}>
                    Informações de responsabilidade e comunicação
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Nome do Líder"
                    variant="outlined"
                    value={formData.lider}
                    onChange={(e) => handleChange("lider", e.target.value)}
                    sx={fieldStyle}
                    InputProps={{
                      startAdornment: (
                        <SupervisorAccount sx={{ color: themeColors.secondary.main, mr: 1, opacity: 0.7 }} />
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Telefone de Contato"
                    variant="outlined"
                    value={formData.celular}
                    onChange={(e) => handleChange("celular", e.target.value)}
                    sx={fieldStyle}
                    InputProps={{
                      startAdornment: <Phone sx={{ color: themeColors.secondary.main, mr: 1, opacity: 0.7 }} />,
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "1.2rem 1.8rem",
            borderTop: `1px solid ${themeColors.divider}`,
            justifyContent: "space-between",
            background: `linear-gradient(to bottom, ${alpha(themeColors.background.default, 0.5)}, ${alpha(themeColors.background.paper, 0.8)})`,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
            startIcon={<Close />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 500,
              borderColor: themeColors.divider,
              color: themeColors.text.secondary,
              padding: "10px 24px",
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
            onClick={handleSubmit}
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? null : <Check />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: themeColors.primary.main,
              padding: "10px 32px",
              boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.2)}`,
              "&:hover": {
                backgroundColor: themeColors.primary.dark,
                boxShadow: `0 6px 16px ${alpha(themeColors.primary.main, 0.3)}`,
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Cadastrando...
              </Box>
            ) : (
              "Cadastrar Soltura"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta de feedback */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
            borderRadius: "12px",
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default RegisterModal
