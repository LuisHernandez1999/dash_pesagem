"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material"
import { Close, Save } from "@mui/icons-material"
import { Slide } from "@mui/material"///oi
import { useState, useEffect } from "react"

const EditModal = ({ open, onClose, data, onSave, themeColors }) => {
  const [formData, setFormData] = useState({
    driver: "",
    driverId: "",
    team: "",
    vehiclePrefix: "",
    collectors: ["", "", ""],
    vehicleType: "",
    garage: "",
    status: "",
    location: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data) {
      setFormData({
        driver: data.driver || "",
        driverId: data.driverId || "",
        team: data.tipo_equipe || data.team || "",
        vehiclePrefix: data.vehiclePrefix || data.prefixo || "",
        collectors: Array.isArray(data.collectors) ? [...data.collectors] : ["", "", ""],
        vehicleType: data.vehicle || data.tipo_veiculo_selecionado || "",
        garage: data.garage || "",
        status: data.status || data.status_frota || "",
        location: data.location || data.bairro || data.setores || "",
      })
    }
  }, [data])

  const handleChange = (field, value, index = null) => {
    if (index !== null) {
      // Para campos com múltiplos valores (collectors)
      setFormData((prev) => {
        const newValues = [...prev[field]]
        newValues[index] = value
        return { ...prev, [field]: newValues }
      })
    } else {
      // Para campos simples
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Prepare data for API
      const apiData = {
        id: data.id,
        motorista: formData.driver,
        matricula_motorista: formData.driverId,
        tipo_equipe: formData.team,
        prefixo: formData.vehiclePrefix,
        coletores: formData.collectors.filter(Boolean),
        tipo_veiculo_selecionado: formData.vehicleType,
        garagem: formData.garage,
        status_frota: formData.status,
        bairro: formData.location,
        // Preserve other fields from original data
        data: data.data,
        hora_saida_frota: data.hora_saida_frota,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Call the onSave callback with the updated data
      onSave({
        ...data,
        driver: formData.driver,
        driverId: formData.driverId,
        team: formData.team,
        tipo_equipe: formData.team,
        vehiclePrefix: formData.vehiclePrefix,
        prefixo: formData.vehiclePrefix,
        collectors: formData.collectors.filter(Boolean),
        vehicle: formData.vehicleType,
        tipo_veiculo_selecionado: formData.vehicleType,
        garage: formData.garage,
        status: formData.status,
        status_frota: formData.status,
        location: formData.location,
        bairro: formData.location,
      })

      // Close the modal
      onClose()
    } catch (err) {
      console.error("Erro ao salvar alterações:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!data) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
      TransitionComponent={Slide}
      TransitionProps={{
        direction: "up",
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#4285F4",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
            Editar Remoção
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.85rem", mt: 0.5 }}>
            Prefixo: {data.vehiclePrefix || data.prefixo || "N/A"}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            padding: "8px",
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "24px" }}>
        {/* Informações do Motorista */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#4285F4",
              display: "flex",
              alignItems: "center",
              mb: 2,
              pb: 1,
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <Box component="span" sx={{ mr: 1, display: "flex", alignItems: "center" }}>
              👤
            </Box>
            Informações do Motorista
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Nome do Motorista"
              fullWidth
              variant="outlined"
              value={formData.driver}
              onChange={(e) => handleChange("driver", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: "#757575" }}>
                    👤
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              label="Matrícula do Motorista"
              fullWidth
              variant="outlined"
              value={formData.driverId}
              onChange={(e) => handleChange("driverId", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: "#757575" }}>
                    🆔
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>
        </Box>

        {/* Informações do Veículo */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#4285F4",
              display: "flex",
              alignItems: "center",
              mb: 2,
              pb: 1,
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <Box component="span" sx={{ mr: 1, display: "flex", alignItems: "center" }}>
              🚗
            </Box>
            Informações do Veículo
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Prefixo do Veículo"
              fullWidth
              variant="outlined"
              value={formData.vehiclePrefix}
              onChange={(e) => handleChange("vehiclePrefix", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: "#757575" }}>
                    🚗
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <Autocomplete
              disablePortal
              options={["Caminhão Reboque", "Van", "Outro"]}
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
                        <Box component="span" sx={{ mr: 1, color: "#757575" }}>
                          🚗
                        </Box>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Garagem"
              fullWidth
              variant="outlined"
              value={formData.garage}
              onChange={(e) => handleChange("garage", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: "#757575" }}>
                    🏢
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              label="Setor"
              fullWidth
              variant="outlined"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: "#757575" }}>
                    📍
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>
        </Box>

        {/* Informações da Equipe */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#4285F4",
              display: "flex",
              alignItems: "center",
              mb: 2,
              pb: 1,
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <Box component="span" sx={{ mr: 1, display: "flex", alignItems: "center" }}>
              👥
            </Box>
            Informações da Equipe
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <Autocomplete
              options={["Equipe1(Matutino)", "Equipe2(Vespertino)", "Equipe3(Noturno)"]}
              value={formData.team}
              onChange={(_, newValue) => handleChange("team", newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Equipe"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Box component="span" sx={{ mr: 1, color: "#757575" }}>
                          👥
                        </Box>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              )}
            />

            <Autocomplete
              options={["Em andamento", "Finalizado"]}
              value={formData.status}
              onChange={(_, newValue) => handleChange("status", newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Box component="span" sx={{ mr: 1, color: "#757575" }}>
                          🕒
                        </Box>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>

        {/* Coletores */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#4285F4",
              display: "flex",
              alignItems: "center",
              mb: 2,
              pb: 1,
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <Box component="span" sx={{ mr: 1, display: "flex", alignItems: "center" }}>
              👥
            </Box>
            Coletores
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TextField
                key={index}
                label={`Coletor ${index + 1}`}
                fullWidth
                variant="outlined"
                value={formData.collectors[index] || ""}
                onChange={(e) => handleChange("collectors", e.target.value, index)}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1, color: "#757575" }}>
                      👤
                    </Box>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          padding: "16px 24px",
          borderTop: "1px solid #E0E0E0",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<Close />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            borderColor: "#E0E0E0",
            color: "#757575",
            "&:hover": {
              borderColor: "#4285F4",
              color: "#4285F4",
              backgroundColor: "rgba(66, 133, 244, 0.05)",
            },
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            backgroundColor: "#4285F4",
            "&:hover": {
              backgroundColor: "#3367D6",
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
