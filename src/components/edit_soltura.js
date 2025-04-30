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
} from "@mui/material"
import { Close, Save, DirectionsCar, Person, Group, History } from "@mui/icons-material"
import { editarSoltura } from "../service/dashboard"

const EditModal = ({ open, onClose, data, onSave, themeColors, keyframes }) => {
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errorDetails, setErrorDetails] = useState(null)

  // Initial data to compare changes against
  const [initialData, setInitialData] = useState({})

  // Current form data
  const [formData, setFormData] = useState({
    driver: "",
    driverId: "",
    vehiclePrefix: "",
    team: "",
    collectors: ["", "", ""],
    collectorsIds: ["", "", ""],
    vehicleType: "",
    garage: "",
    route: "",
    departureTime: "",
    arrivalTime: "",
    status: "",
    date: "",
    location: "",
    distance: "",
    notes: "",
  })

  // Track which fields have been changed
  const [changedFields, setChangedFields] = useState({
    driver: false,
    driverId: false,
    vehiclePrefix: false,
    team: false,
    collectors: false,
    vehicleType: false,
    garage: false,
    route: false,
    departureTime: false,
    arrivalTime: false,
    status: false,
    date: false,
    location: false,
    distance: false,
    notes: false,
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
      const newFormData = {
        driver: data.driver || "",
        driverId: data.driverId || "",
        vehiclePrefix: data.vehiclePrefix || "",
        team: data.team || "",
        collectors: Array.isArray(data.collectors) ? [...data.collectors] : ["", "", ""],
        collectorsIds: Array.isArray(data.collectorsIds) ? [...data.collectorsIds] : ["", "", ""],
        vehicleType: data.vehicle || "",
        garage: data.garage || "",
        route: data.route || "",
        departureTime: data.departureTime || "",
        arrivalTime: data.arrivalTime || "",
        status: data.status || "",
        date: data.date || "",
        location: data.location || "",
        distance: data.distance || "",
        notes: data.notes || "",
      }

      setFormData(newFormData)
      setInitialData(JSON.parse(JSON.stringify(newFormData))) // Deep copy for comparison

      // Reset changed fields and change log
      setChangedFields({
        driver: false,
        driverId: false,
        vehiclePrefix: false,
        team: false,
        collectors: false,
        vehicleType: false,
        garage: false,
        route: false,
        departureTime: false,
        arrivalTime: false,
        status: false,
        date: false,
        location: false,
        distance: false,
        notes: false,
      })
      setChangeLog([])
      setError(null)
      setErrorDetails(null)
    }
  }, [data, open])

  const handleChange = (field, value, index = null) => {
    if (index !== null) {
      // For collectors array
      setFormData((prev) => {
        const newCollectors = [...prev.collectors]
        newCollectors[index] = value

        // Check if any collector changed
        const collectorsChanged = JSON.stringify(newCollectors) !== JSON.stringify(initialData.collectors)

        // Update changed fields
        setChangedFields((prev) => ({
          ...prev,
          collectors: collectorsChanged,
        }))

        // Update change log if this is a new change
        if (collectorsChanged && !changedFields.collectors) {
          const oldValue = initialData.collectors.filter(Boolean).join(", ") || "Nenhum"
          const newValue = newCollectors.filter(Boolean).join(", ") || "Nenhum"

          setChangeLog((prev) => [
            ...prev.filter((log) => log.field !== "collectors"),
            {
              field: "collectors",
              label: "Coletores",
              oldValue,
              newValue,
              timestamp: new Date().toLocaleString(),
            },
          ])
        }

        return { ...prev, collectors: newCollectors }
      })
    } else {
      // For other fields
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
              case "driver":
                fieldLabel = "Motorista"
                break
              case "driverId":
                fieldLabel = "Matrícula do Motorista"
                break
              case "vehiclePrefix":
                fieldLabel = "Prefixo do Veículo"
                break
              case "team":
                fieldLabel = "Equipe"
                break
              case "vehicleType":
                fieldLabel = "Tipo de Veículo"
                break
              case "garage":
                fieldLabel = "Garagem"
                break
              case "route":
                fieldLabel = "Rota"
                break
              case "departureTime":
                fieldLabel = "Hora de Saída"
                break
              case "arrivalTime":
                fieldLabel = "Hora de Chegada"
                break
              case "status":
                fieldLabel = "Status"
                break
              case "date":
                fieldLabel = "Data"
                break
              case "location":
                fieldLabel = "Localização"
                break
              case "distance":
                fieldLabel = "Distância"
                break
              case "notes":
                fieldLabel = "Observações"
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

  const handleJustificationChange = (category, field, value) => {
    setJustifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  // Função para formatar data e hora no formato esperado pelo backend
  const formatDateTime = (date, time) => {
    if (!date || !time) return null

    // Formato esperado: YYYY-MM-DD HH:MM:SS
    const formattedDate = date // Assumindo que já está no formato YYYY-MM-DD
    const formattedTime = time // Assumindo que já está no formato HH:MM

    return `${formattedDate} ${formattedTime}:00`
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      setErrorDetails(null)

      // Formatar data e hora
      const formattedDate = formData.date
      const formattedEntregaChave = formatDateTime(formData.date, "08:00") // Exemplo fixo
      const formattedSaidaFrota = formatDateTime(formData.date, formData.departureTime)
      const formattedChegada = formData.arrivalTime ? formatDateTime(formData.date, formData.arrivalTime) : null

      // Mapear os dados do formulário para o formato esperado pela API
      const dadosParaAPI = {
        motorista: formData.driver,
        veiculo: formData.vehiclePrefix,
        tipo_equipe: formData.team || "",
        frequencia: formData.garage,
        setor: formData.location || "",
        celular: "",
        lider: "",
        hora_entrega_chave: formattedEntregaChave || formattedSaidaFrota, // Usar saída da frota se não tiver entrega de chave
        hora_saida_frota: formattedSaidaFrota,
        hora_chegada: formattedChegada,
        turno: "Diurno", // Valor padrão
        tipo_servico: formData.vehicleType,
        coletores:
          formData.vehicleType && formData.vehicleType.toLowerCase() !== "varrição"
            ? formData.collectors.filter(Boolean)
            : [],
        rota: formData.route || null,
        data: formattedDate,
        status_frota: formData.status || null,
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
  const driverChanged = changedFields.driver || changedFields.driverId

  // Check if any vehicle-related fields changed
  const vehicleChanged = changedFields.vehiclePrefix || changedFields.vehicleType

  // Check if collectors changed
  const collectorsChanged = changedFields.collectors

  // Check if service type is "varrição" to determine if collectors should be shown
  const showCollectors = !(formData.vehicleType && formData.vehicleType.toLowerCase() === "varrição")

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
                  value={formData.driver}
                  onChange={(e) => handleChange("driver", e.target.value)}
                  sx={{
                    flex: "1 1 60%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      ...(changedFields.driver && {
                        border: `1px solid ${themeColors.warning.main}`,
                        boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                      }),
                    },
                  }}
                />
                <TextField
                  label="Matrícula"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formData.driverId}
                  onChange={(e) => handleChange("driverId", e.target.value)}
                  sx={{
                    flex: "1 1 30%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      ...(changedFields.driverId && {
                        border: `1px solid ${themeColors.warning.main}`,
                        boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                      }),
                    },
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
                  value={formData.vehiclePrefix}
                  onChange={(e) => handleChange("vehiclePrefix", e.target.value)}
                  sx={{
                    flex: "1 1 30%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      ...(changedFields.vehiclePrefix && {
                        border: `1px solid ${themeColors.warning.main}`,
                        boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                      }),
                    },
                  }}
                />
                <Autocomplete
                  disablePortal
                  options={["Basculante", "Baú", "Seletolix"]}
                  value={formData.vehicleType}
                  onChange={(_, newValue) => handleChange("vehicleType", newValue)}
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
                          ...(changedFields.vehicleType && {
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
                      value={formData.collectors[index] || ""}
                      onChange={(e) => handleChange("collectors", e.target.value, index)}
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
                                onChange={(e) => handleJustificationChange("collectors", "sickLeave", e.target.checked)}
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
                                onChange={(e) => handleJustificationChange("collectors", "emergency", e.target.checked)}
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
                                onChange={(e) => handleJustificationChange("collectors", "schedule", e.target.checked)}
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
                {(changedFields.team || changedFields.garage || changedFields.route) && (
                  <Chip
                    label="Alterado"
                    size="small"
                    color="warning"
                    sx={{ ml: 2, animation: `${keyframes.pulse} 2s infinite ease-in-out` }}
                  />
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Autocomplete
                  disablePortal
                  options={["Equipe1(Matutino)", "Equipe2(Vespertino)", "Equipe3(Noturno)"]}
                  value={formData.team}
                  onChange={(_, newValue) => handleChange("team", newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Equipe"
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "white",
                          ...(changedFields.team && {
                            border: `1px solid ${themeColors.warning.main}`,
                            boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                          }),
                        },
                      }}
                    />
                  )}
                  sx={{ flex: "1 1 100%" }}
                />
                <TextField
                  label="Garagem"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formData.garage}
                  onChange={(e) => handleChange("garage", e.target.value)}
                  sx={{
                    flex: "1 1 48%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      ...(changedFields.garage && {
                        border: `1px solid ${themeColors.warning.main}`,
                        boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                      }),
                    },
                  }}
                />
                <TextField
                  label="Rota"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formData.route}
                  onChange={(e) => handleChange("route", e.target.value)}
                  sx={{
                    flex: "1 1 48%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      ...(changedFields.route && {
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
                {(changedFields.status ||
                  changedFields.date ||
                  changedFields.departureTime ||
                  changedFields.arrivalTime) && (
                  <Chip
                    label="Alterado"
                    size="small"
                    color="warning"
                    sx={{ ml: 2, animation: `${keyframes.pulse} 2s infinite ease-in-out` }}
                  />
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Autocomplete
                  disablePortal
                  options={["Em andamento", "Finalizado"]}
                  value={formData.status}
                  onChange={(_, newValue) => handleChange("status", newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status"
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "white",
                          ...(changedFields.status && {
                            border: `1px solid ${themeColors.warning.main}`,
                            boxShadow: `0 0 0 1px ${alpha(themeColors.warning.main, 0.2)}`,
                          }),
                        },
                      }}
                    />
                  )}
                  sx={{ flex: "1 1 48%" }}
                />
                <TextField
                  label="Data"
                  fullWidth
                  variant="outlined"
                  size="small"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    flex: "1 1 48%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      ...(changedFields.date && {
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
                  value={formData.departureTime}
                  onChange={(e) => handleChange("departureTime", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    flex: "1 1 48%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      ...(changedFields.departureTime && {
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
                  value={formData.arrivalTime}
                  onChange={(e) => handleChange("arrivalTime", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    flex: "1 1 48%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "white",
                      ...(changedFields.arrivalTime && {
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
          onClick={handleSave}
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
  )
}

export default EditModal
