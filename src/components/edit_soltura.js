"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  IconButton,
  Avatar,
  Autocomplete,
  alpha,
  Slide,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Close, Save, DirectionsCar, Person, Group, History, BusinessCenter, Phone } from "@mui/icons-material"
import { editarSoltura } from "../service/dashboard"

const EditModal = ({ open, onClose, data, onSave, themeColors, keyframes }) => {
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errorDetails, setErrorDetails] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Initial data to compare changes against
  const [initialData, setInitialData] = useState({})

  // Current form data
  const [formData, setFormData] = useState({
    motorista: "",
    veiculo: "",
    tipo_equipe: "",
    frequencia: "Diária",
    setor: "",
    celular: "",
    lider: "",
    hora_entrega_chave: "",
    hora_saida_frota: "",
    hora_chegada: "",
    turno: "Diurno",
    tipo_servico: "Remoção",
    coletores: ["", "", ""],
    rota: "",
    data: "",
    status_frota: "Em Andamento",
    bairro: "",
  })

  // Track which fields have been changed
  const [changedFields, setChangedFields] = useState({
    motorista: false,
    veiculo: false,
    tipo_equipe: false,
    frequencia: false,
    setor: false,
    celular: false,
    lider: false,
    hora_entrega_chave: false,
    hora_saida_frota: false,
    hora_chegada: false,
    turno: false,
    tipo_servico: false,
    coletores: false,
    rota: false,
    data: false,
    status_frota: false,
    bairro: false,
  })

  // Track changes for the change log
  const [changeLog, setChangeLog] = useState([])

  const [justifications, setJustifications] = useState({
    vehicle: {
      vehicleFull: false,
      outOfGas: false,
      accident: false,
      maintenance: false,
      other: false,
      otherText: "",
    },
    driver: {
      sickLeave: false,
      emergency: false,
      noShow: false,
      schedule: false,
      other: false,
      otherText: "",
    },
    collectors: {
      sickLeave: false,
      emergency: false,
      noShow: false,
      schedule: false,
      other: false,
      otherText: "",
    },
  })

  // Initialize data when modal opens
  useEffect(() => {
    if (data) {
      // Mapear os dados recebidos para o formato do formulário
      const newFormData = {
        motorista: data.driver || "",
        veiculo: data.vehiclePrefix || "",
        tipo_equipe: data.team || "",
        frequencia: data.garage || "Diária",
        setor: data.setor || data.location || "", // Priorizar o campo setor se existir
        celular: data.phone || "",
        lider: data.leader || "",
        hora_entrega_chave: "08:00", // Valor padrão
        hora_saida_frota: data.departureTime || "",
        hora_chegada: data.arrivalTime || "",
        turno: "Diurno", // Valor padrão
        tipo_servico: data.vehicleType || "Remoção",
        coletores: Array.isArray(data.collectors) ? [...data.collectors] : ["", "", ""],
        rota: data.route || "",
        data: data.date || "",
        status_frota: data.status || "Em Andamento",
        bairro: data.bairro || "",
      }

      setFormData(newFormData)
      setInitialData(JSON.parse(JSON.stringify(newFormData))) // Deep copy for comparison

      // Reset changed fields and change log
      setChangedFields({
        motorista: false,
        veiculo: false,
        tipo_equipe: false,
        frequencia: false,
        setor: false,
        celular: false,
        lider: false,
        hora_entrega_chave: false,
        hora_saida_frota: false,
        hora_chegada: false,
        turno: false,
        tipo_servico: false,
        coletores: false,
        rota: false,
        data: false,
        status_frota: false,
        bairro: false,
      })
      setChangeLog([])
      setError(null)
      setErrorDetails(null)
    }
  }, [data, open])

  const handleChange = (field, value, index = null) => {
    if (index !== null) {
      // Para arrays como coletores
      setFormData((prev) => {
        const newColetores = [...prev.coletores]
        newColetores[index] = value

        // Check if any collector changed
        const coletoresChanged = JSON.stringify(newColetores) !== JSON.stringify(initialData.coletores)

        // Update changed fields
        setChangedFields((prev) => ({
          ...prev,
          coletores: coletoresChanged,
        }))

        // Update change log if this is a new change
        if (coletoresChanged && !changedFields.coletores) {
          const oldValue = initialData.coletores.filter(Boolean).join(", ") || "Nenhum"
          const newValue = newColetores.filter(Boolean).join(", ") || "Nenhum"

          setChangeLog((prev) => [
            ...prev.filter((log) => log.field !== "coletores"),
            {
              field: "coletores",
              label: "Coletores",
              oldValue,
              newValue,
              timestamp: new Date().toLocaleString(),
            },
          ])
        }

        return { ...prev, coletores: newColetores }
      })
    } else {
      // Para campos normais
      setFormData((prev) => {
        // Check if value actually changed
        const valueChanged = prev[field] !== value

        // Update changed fields
        if (valueChanged) {
          setChangedFields((prevFields) => ({
            ...prevFields,
            [field]: true,
          }))

          // Add to change log if this is a new change
          if (!changedFields[field]) {
            let fieldLabel = field
            switch (field) {
              case "motorista":
                fieldLabel = "Motorista"
                break
              case "veiculo":
                fieldLabel = "Veículo"
                break
              case "tipo_equipe":
                fieldLabel = "Equipe"
                break
              case "frequencia":
                fieldLabel = "Frequência"
                break
              case "setor":
                fieldLabel = "Setor"
                break
              case "celular":
                fieldLabel = "Telefone"
                break
              case "lider":
                fieldLabel = "Líder"
                break
              case "hora_entrega_chave":
                fieldLabel = "Hora de Entrega da Chave"
                break
              case "hora_saida_frota":
                fieldLabel = "Hora de Saída"
                break
              case "hora_chegada":
                fieldLabel = "Hora de Chegada"
                break
              case "turno":
                fieldLabel = "Turno"
                break
              case "tipo_servico":
                fieldLabel = "Tipo de Serviço"
                break
              case "rota":
                fieldLabel = "Rota"
                break
              case "data":
                fieldLabel = "Data"
                break
              case "status_frota":
                fieldLabel = "Status"
                break
              case "bairro":
                fieldLabel = "Bairro"
                break
            }

            setChangeLog((prevLog) => [
              ...prevLog.filter((log) => log.field !== field),
              {
                field,
                label: fieldLabel,
                oldValue: prev[field] || "Não informado",
                newValue: value || "Não informado",
                timestamp: new Date().toLocaleString(),
              },
            ])
          }
        }

        return { ...prev, [field]: value }
      })
    }
  }

  // Função para formatar telefone
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "") // Remove todos os caracteres não numéricos

    if (value.length > 0) {
      // Formata o número como (XX) XXXXX-XXXX
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
      value = value.replace(/(\d)(\d{4})$/, "$1-$2")

      // Limita a 15 caracteres (incluindo formatação)
      value = value.substring(0, 15)
    }

    handleChange("celular", value)
  }

  const handleJustificationChange = (category, field, value) => {
    setJustifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  // Função para validar horário
  const validateTime = (time) => {
    if (!time) return true

    // Verifica se o formato é HH:MM
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
  }

  // Função para formatar data e hora no formato esperado pelo backend
  const formatDateTime = (date, time) => {
    if (!date || !time) return null

    // Formato esperado: YYYY-MM-DD HH:MM:00 (apenas um ":00" no final)
    const formattedDate = date // Assumindo que já está no formato YYYY-MM-DD
    const formattedTime = time // Assumindo que já está no formato HH:MM

    return `${formattedDate} ${formattedTime}:00`
  }

  const handleConfirmSave = () => {
    setShowConfirmation(true)
  }

  const handleCancelSave = () => {
    setShowConfirmation(false)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      setErrorDetails(null)
      setShowConfirmation(false)

      // Validar horários
      if (
        !validateTime(formData.hora_saida_frota) ||
        (formData.status_frota === "Finalizado" && !validateTime(formData.hora_chegada))
      ) {
        setError("Formato de horário inválido. Use o formato HH:MM.")
        setLoading(false)
        return
      }

      // Validar campos obrigatórios
      if (!formData.setor || formData.setor.trim() === "") {
        setError("Campo obrigatório faltando: Setor")
        setErrorDetails("O campo Setor é obrigatório para esta operação.")
        setLoading(false)
        return
      }

      // Formatar data e hora
      const formattedDate = formData.data
      const formattedEntregaChave = formatDateTime(formData.data, formData.hora_entrega_chave)
      const formattedSaidaFrota = formatDateTime(formData.data, formData.hora_saida_frota)
      const formattedChegada = formData.hora_chegada ? formatDateTime(formData.data, formData.hora_chegada) : null

      // Mapear os dados do formulário para o formato esperado pela API
      const dadosParaAPI = {
        motorista: formData.motorista,
        veiculo: formData.veiculo,
        tipo_equipe: formData.tipo_equipe || "",
        frequencia: formData.frequencia,
        setor: formData.setor || "", // Garantir que o campo setor seja enviado
        celular: formData.celular || "",
        lider: formData.lider || "",
        hora_entrega_chave: formattedEntregaChave,
        hora_saida_frota: formattedSaidaFrota,
        hora_chegada: formattedChegada,
        turno: formData.turno,
        tipo_servico: formData.tipo_servico,
        coletores: formData.tipo_servico.toLowerCase() !== "varrição" ? formData.coletores.filter(Boolean) : [],
        rota: formData.rota || null,
        data: formattedDate || null,
        status_frota: formData.status_frota || null,
        bairro: formData.bairro || "",
      }

      console.log("Enviando dados para API:", dadosParaAPI)

      // Chamar a API para atualizar o registro
      if (data && data.id) {
        await editarSoltura(data.id, dadosParaAPI)

        // Add justifications and change log to the form data
        const dataToSave = {
          ...formData,
          justifications,
          changeLog,
        }

        onSave(dataToSave)
        onClose()
      } else {
        throw new Error("ID da soltura não fornecido")
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error)

      // Tratamento de erros mais detalhado
      if (error.response) {
        // O servidor respondeu com um status de erro
        const statusCode = error.response.status
        const responseData = error.response.data

        if (statusCode === 404) {
          setError("Recurso não encontrado. Verifique se o ID da soltura está correto.")
        } else if (statusCode === 400) {
          if (responseData.missing_fields) {
            setError("Campos obrigatórios faltando")
            setErrorDetails(`Campos faltantes: ${responseData.missing_fields.join(", ")}`)
          } else {
            setError(responseData.error || "Erro de validação nos dados")
          }
        } else if (statusCode === 405) {
          setError("Método não permitido. A API espera uma requisição PUT.")
        } else {
          setError(`Erro ${statusCode}: ${responseData.error || "Erro desconhecido"}`)
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        setError("Não foi possível conectar ao servidor. Verifique sua conexão.")
      } else {
        // Erro na configuração da requisição
        setError(`Erro ao configurar requisição: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Check if any driver-related fields changed
  const driverChanged = changedFields.motorista

  // Check if any vehicle-related fields changed
  const vehicleChanged = changedFields.veiculo || changedFields.tipo_servico

  // Check if collectors changed
  const collectorsChanged = changedFields.coletores

  // Check if service type is "varrição" to determine if collectors should be shown
  const showCollectors = !(formData.tipo_servico && formData.tipo_servico.toLowerCase() === "varrição")

  // Diálogo de confirmação
  const ConfirmationDialog = () => (
    <Dialog
      open={showConfirmation}
      onClose={handleCancelSave}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          padding: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Confirmar alterações</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Tem certeza que deseja salvar as alterações feitas neste registro?
        </Typography>
        {changeLog.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Resumo das alterações:
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: alpha(themeColors.info.main, 0.05),
                borderRadius: 2,
                maxHeight: "150px",
                overflow: "auto",
              }}
            >
              {changeLog.map((log, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 1,
                    pb: 1,
                    borderBottom:
                      index < changeLog.length - 1 ? `1px dashed ${alpha(themeColors.divider, 0.8)}` : "none",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {log.label}: <span style={{ color: themeColors.warning.main }}>{log.newValue}</span>
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancelSave}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
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
              Editar Registro
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
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
          {error ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
                p: 3,
                bgcolor: alpha(themeColors.error.main, 0.1),
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>

              {errorDetails && (
                <Alert severity="warning" sx={{ mb: 2, width: "100%" }}>
                  {errorDetails}
                </Alert>
              )}

              <Button variant="contained" onClick={() => setError(null)} startIcon={<DirectionsCar />}>
                Tentar Novamente
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Driver Information */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: alpha(themeColors.primary.main, 0.1),
                      color: themeColors.primary.main,
                      mr: 1,
                    }}
                  >
                    <Person />
                  </Avatar>
                  <Typography variant="h6">Informações do Motorista</Typography>
                  {driverChanged && (
                    <Chip
                      label="Alterado"
                      size="small"
                      color="warning"
                      sx={{ ml: 2, animation: `${keyframes.pulse} 2s infinite ease-in-out` }}
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Nome do Motorista"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formData.motorista}
                    onChange={(e) => handleChange("motorista", e.target.value)}
                    sx={{
                      flex: "1 1 60%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.motorista && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      },
                    }}
                  />
                  <TextField
                    label="Telefone"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formData.celular}
                    onChange={handlePhoneChange}
                    sx={{
                      flex: "1 1 30%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.celular && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      },
                    }}
                    InputProps={{
                      startAdornment: <Phone sx={{ color: themeColors.primary.main, mr: 1, opacity: 0.7 }} />,
                    }}
                  />
                </Box>

                {/* Setor Field */}
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Setor *"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formData.setor}
                    onChange={(e) => handleChange("setor", e.target.value)}
                    required
                    error={!formData.setor}
                    helperText={!formData.setor ? "Campo obrigatório" : ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.setor && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      },
                    }}
                    InputProps={{
                      startAdornment: <BusinessCenter sx={{ color: themeColors.primary.main, mr: 1, opacity: 0.7 }} />,
                    }}
                  />
                </Box>

                {/* Líder Field */}
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Líder"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formData.lider}
                    onChange={(e) => handleChange("lider", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.lider && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      },
                    }}
                    InputProps={{
                      startAdornment: <Person sx={{ color: themeColors.primary.main, mr: 1, opacity: 0.7 }} />,
                    }}
                  />
                </Box>

                {/* Driver Justification - Only show if driver fields changed */}
                {driverChanged && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: alpha(themeColors.background.default, 0.5), borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Justificativa para alteração do motorista:
                    </Typography>
                    <FormGroup>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.driver.sickLeave}
                              onChange={(e) => handleJustificationChange("driver", "sickLeave", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Atestado médico"
                          sx={{ width: "50%" }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.driver.emergency}
                              onChange={(e) => handleJustificationChange("driver", "emergency", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Emergência"
                          sx={{ width: "50%" }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.driver.noShow}
                              onChange={(e) => handleJustificationChange("driver", "noShow", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Não compareceu"
                          sx={{ width: "50%" }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.driver.schedule}
                              onChange={(e) => handleJustificationChange("driver", "schedule", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Mudança de escala"
                          sx={{ width: "50%" }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.driver.other}
                              onChange={(e) => handleJustificationChange("driver", "other", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Outro"
                          sx={{ width: "100%" }}
                        />
                      </Box>
                      {justifications.driver.other && (
                        <TextField
                          label="Especifique"
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={justifications.driver.otherText}
                          onChange={(e) => handleJustificationChange("driver", "otherText", e.target.value)}
                          sx={{ mt: 1 }}
                        />
                      )}
                    </FormGroup>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Vehicle Information */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: alpha(themeColors.success.main, 0.1),
                      color: themeColors.success.main,
                      mr: 1,
                    }}
                  >
                    <DirectionsCar />
                  </Avatar>
                  <Typography variant="h6">Informações do Veículo</Typography>
                  {vehicleChanged && (
                    <Chip
                      label="Alterado"
                      size="small"
                      color="warning"
                      sx={{ ml: 2, animation: `${keyframes.pulse} 2s infinite ease-in-out` }}
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Prefixo do Veículo"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formData.veiculo}
                    onChange={(e) => handleChange("veiculo", e.target.value)}
                    sx={{
                      flex: "1 1 30%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.veiculo && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      },
                    }}
                  />
                  <Autocomplete
                    disablePortal
                    options={["Basculante", "Baú", "Seletolix"]}
                    value={formData.tipo_servico}
                    onChange={(_, newValue) => handleChange("tipo_servico", newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tipo de Veículo"
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "white",
                            ...(changedFields.tipo_servico && {
                              border: `1px solid ${themeColors.warning.main}`,
                              boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                            }),
                          },
                        }}
                      />
                    )}
                    sx={{ flex: "1 1 60%" }}
                  />
                </Box>

                {/* Vehicle Justification - Only show if vehicle fields changed */}
                {vehicleChanged && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: alpha(themeColors.background.default, 0.5), borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Justificativa para alteração do veículo:
                    </Typography>
                    <FormGroup>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.vehicle.vehicleFull}
                              onChange={(e) => handleJustificationChange("vehicle", "vehicleFull", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Veículo lotou"
                          sx={{ width: "50%" }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.vehicle.outOfGas}
                              onChange={(e) => handleJustificationChange("vehicle", "outOfGas", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Acabou combustível"
                          sx={{ width: "50%" }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.vehicle.accident}
                              onChange={(e) => handleJustificationChange("vehicle", "accident", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Acidente/Batida"
                          sx={{ width: "50%" }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.vehicle.maintenance}
                              onChange={(e) => handleJustificationChange("vehicle", "maintenance", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Manutenção"
                          sx={{ width: "50%" }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={justifications.vehicle.other}
                              onChange={(e) => handleJustificationChange("vehicle", "other", e.target.checked)}
                              size="small"
                            />
                          }
                          label="Outro"
                          sx={{ width: "100%" }}
                        />
                      </Box>
                      {justifications.vehicle.other && (
                        <TextField
                          label="Especifique"
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={justifications.vehicle.otherText}
                          onChange={(e) => handleJustificationChange("vehicle", "otherText", e.target.value)}
                          sx={{ mt: 1 }}
                        />
                      )}
                    </FormGroup>
                  </Box>
                )}
              </Box>

              {/* Collectors Information - Only show if service type is not "varrição" */}
              {showCollectors && (
                <>
                  <Divider />
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: alpha(themeColors.warning.main, 0.1),
                          color: themeColors.warning.main,
                          mr: 1,
                        }}
                      >
                        <Group />
                      </Avatar>
                      <Typography variant="h6">Coletores</Typography>
                      {collectorsChanged && (
                        <Chip
                          label="Alterado"
                          size="small"
                          color="warning"
                          sx={{ ml: 2, animation: `${keyframes.pulse} 2s infinite ease-in-out` }}
                        />
                      )}
                    </Box>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <TextField
                        key={index}
                        label={`Coletor ${index + 1}`}
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={formData.coletores[index] || ""}
                        onChange={(e) => handleChange("coletores", e.target.value, index)}
                        sx={{
                          mb: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "white",
                            ...(collectorsChanged && {
                              border: `1px solid ${themeColors.warning.main}`,
                              boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                            }),
                          },
                        }}
                      />
                    ))}

                    {/* Collectors Justification - Only show if collectors changed */}
                    {collectorsChanged && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: alpha(themeColors.background.default, 0.5), borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Justificativa para alteração dos coletores:
                        </Typography>
                        <FormGroup>
                          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={justifications.collectors.sickLeave}
                                  onChange={(e) =>
                                    handleJustificationChange("collectors", "sickLeave", e.target.checked)
                                  }
                                  size="small"
                                />
                              }
                              label="Atestado médico"
                              sx={{ width: "50%" }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={justifications.collectors.emergency}
                                  onChange={(e) =>
                                    handleJustificationChange("collectors", "emergency", e.target.checked)
                                  }
                                  size="small"
                                />
                              }
                              label="Emergência"
                              sx={{ width: "50%" }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={justifications.collectors.noShow}
                                  onChange={(e) => handleJustificationChange("collectors", "noShow", e.target.checked)}
                                  size="small"
                                />
                              }
                              label="Não compareceu"
                              sx={{ width: "50%" }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={justifications.collectors.schedule}
                                  onChange={(e) =>
                                    handleJustificationChange("collectors", "schedule", e.target.checked)
                                  }
                                  size="small"
                                />
                              }
                              label="Mudança de escala"
                              sx={{ width: "50%" }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={justifications.collectors.other}
                                  onChange={(e) => handleJustificationChange("collectors", "other", e.target.checked)}
                                  size="small"
                                />
                              }
                              label="Outro"
                              sx={{ width: "100%" }}
                            />
                          </Box>
                          {justifications.collectors.other && (
                            <TextField
                              label="Especifique"
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={justifications.collectors.otherText}
                              onChange={(e) => handleJustificationChange("collectors", "otherText", e.target.value)}
                              sx={{ mt: 1 }}
                            />
                          )}
                        </FormGroup>
                      </Box>
                    )}
                  </Box>
                </>
              )}

              <Divider />

              {/* Other Information */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Outras Informações</Typography>
                  {(changedFields.tipo_equipe || changedFields.frequencia || changedFields.rota) && (
                    <Chip
                      label="Alterado"
                      size="small"
                      color="warning"
                      sx={{ ml: 2, animation: `${keyframes.pulse} 2s infinite ease-in-out` }}
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <FormControl fullWidth size="small" sx={{ flex: "1 1 100%" }}>
                    <InputLabel>Equipe</InputLabel>
                    <Select
                      value={formData.tipo_equipe}
                      label="Equipe"
                      onChange={(e) => handleChange("tipo_equipe", e.target.value)}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.tipo_equipe && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      }}
                    >
                      <MenuItem value="Equipe1(Matutino)">Equipe 1 (Matutino)</MenuItem>
                      <MenuItem value="Equipe2(Vespertino)">Equipe 2 (Vespertino)</MenuItem>
                      <MenuItem value="Equipe3(Noturno)">Equipe 3 (Noturno)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small" sx={{ flex: "1 1 48%" }}>
                    <InputLabel>Garagem</InputLabel>
                    <Select
                      value={formData.frequencia}
                      label="Garagem"
                      onChange={(e) => handleChange("frequencia", e.target.value)}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.frequencia && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      }}
                    >
                      <MenuItem value="PA1">PA1</MenuItem>
                      <MenuItem value="PA2">PA2</MenuItem>
                      <MenuItem value="PA3">PA3</MenuItem>
                      <MenuItem value="PA4">PA4</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Rota"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formData.rota}
                    onChange={(e) => handleChange("rota", e.target.value)}
                    sx={{
                      flex: "1 1 48%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.rota && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Fleet Status Information */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 3 }}>
                  <Typography variant="h6">Status da Frota</Typography>
                  {(changedFields.status_frota ||
                    changedFields.data ||
                    changedFields.hora_saida_frota ||
                    changedFields.hora_chegada) && (
                    <Chip
                      label="Alterado"
                      size="small"
                      color="warning"
                      sx={{ ml: 2, animation: `${keyframes.pulse} 2s infinite ease-in-out` }}
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <FormControl fullWidth size="small" sx={{ flex: "1 1 48%" }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status_frota}
                      label="Status"
                      onChange={(e) => handleChange("status_frota", e.target.value)}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.status_frota && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      }}
                    >
                      <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                      <MenuItem value="Finalizado">Finalizado</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Data"
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="date"
                    value={formData.data}
                    onChange={(e) => handleChange("data", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: "1 1 48%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.data && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                  <TextField
                    label="Hora de Saída"
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="time"
                    value={formData.hora_saida_frota}
                    onChange={(e) => handleChange("hora_saida_frota", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: "1 1 48%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.hora_saida_frota && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      },
                    }}
                  />
                  <TextField
                    label="Hora de Chegada"
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="time"
                    value={formData.hora_chegada}
                    onChange={(e) => handleChange("hora_chegada", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={formData.status_frota !== "Finalizado"}
                    sx={{
                      flex: "1 1 48%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "white",
                        ...(changedFields.hora_chegada && {
                          border: `1px solid ${themeColors.warning.main}`,
                          boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                        }),
                      },
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Change Log Section */}
              {changeLog.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: alpha(themeColors.info.main, 0.1),
                          color: themeColors.info.main,
                          mr: 1,
                        }}
                      >
                        <History />
                      </Avatar>
                      <Typography variant="h6">Registro de Alterações</Typography>
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: alpha(themeColors.info.main, 0.05),
                        borderRadius: 2,
                        border: `1px solid ${alpha(themeColors.info.main, 0.2)}`,
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      {changeLog.map((log, index) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 1,
                            pb: 1,
                            borderBottom:
                              index < changeLog.length - 1 ? `1px dashed ${alpha(themeColors.divider, 0.8)}` : "none",
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: themeColors.info.main }}>
                            {log.label}
                          </Typography>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                            <Typography variant="body2" sx={{ color: themeColors.text.secondary }}>
                              De: <span style={{ fontWeight: 500 }}>{log.oldValue}</span>
                            </Typography>
                            <Typography variant="body2" sx={{ color: themeColors.text.secondary }}>
                              Para:{" "}
                              <span style={{ fontWeight: 500, color: themeColors.warning.main }}>{log.newValue}</span>
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ color: themeColors.text.disabled, display: "block", textAlign: "right", mt: 0.5 }}
                          >
                            {log.timestamp}
                          </Typography>
                        </Box>
                      ))}
                    </Paper>
                  </Box>
                </>
              )}
            </Box>
          )}
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
            onClick={onClose}
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
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            size="medium"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            disabled={loading}
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
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação */}
      {showConfirmation && <ConfirmationDialog />}
    </>
  )
}

export default EditModal
