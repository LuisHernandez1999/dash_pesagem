"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  alpha,
  Avatar,
} from "@mui/material"
import { Close, Engineering, Save, Cancel, DirectionsCar } from "@mui/icons-material"
import { useState } from "react"

const EquipmentModal = ({ open, onClose, onSave, themeColors }) => {
  const [formData, setFormData] = useState({
    prefix: "",
    type: "",
    model: "",
    status: "",
    location: "",
    operator: "",
    workingHours: 0,
    lastMaintenance: "",
    nextMaintenance: "",
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (field) => (event) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.prefix.trim()) newErrors.prefix = "Prefixo é obrigatório"
    if (!formData.type) newErrors.type = "Tipo é obrigatório"
    if (!formData.model.trim()) newErrors.model = "Modelo é obrigatório"
    if (!formData.status) newErrors.status = "Status é obrigatório"
    if (!formData.location.trim()) newErrors.location = "Localização é obrigatória"
    if (!formData.lastMaintenance) newErrors.lastMaintenance = "Data da última manutenção é obrigatória"
    if (!formData.nextMaintenance) newErrors.nextMaintenance = "Data da próxima manutenção é obrigatória"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleCancel = () => {
    setFormData({
      prefix: "",
      type: "",
      model: "",
      status: "",
      location: "",
      operator: "",
      workingHours: 0,
      lastMaintenance: "",
      nextMaintenance: "",
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${alpha(themeColors.primary.main, 0.02)} 0%, ${alpha(themeColors.primary.light, 0.01)} 100%)`,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${themeColors.success.main} 0%, ${themeColors.success.dark} 100%)`,
          color: "#ffffff",
          padding: "24px 32px",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: `radial-gradient(circle, ${alpha("#ffffff", 0.1)} 0%, transparent 70%)`,
            transform: "translate(50%, -50%)",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, ${alpha("#ffffff", 0.2)} 0%, ${alpha("#ffffff", 0.1)} 100%)`,
                backdropFilter: "blur(10px)",
                border: `2px solid ${alpha("#ffffff", 0.3)}`,
              }}
            >
              <Engineering sx={{ fontSize: 28, color: "#ffffff" }} />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                Cadastrar Equipamento
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  opacity: 0.9,
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                Preencha os dados abaixo
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCancel}
            sx={{
              color: "#ffffff",
              backgroundColor: alpha("#ffffff", 0.1),
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: alpha("#ffffff", 0.2),
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: "32px", backgroundColor: "#ffffff" }}>
        <Grid container spacing={3}>
          {/* Informações Básicas */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: themeColors.text.primary,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <DirectionsCar sx={{ color: themeColors.primary.main }} />
              Informações Básicas
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prefixo"
              value={formData.prefix}
              onChange={handleInputChange("prefix")}
              error={!!errors.prefix}
              helperText={errors.prefix}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.type}
                onChange={handleInputChange("type")}
                label="Tipo"
                sx={{
                  borderRadius: "12px",
                }}
              >
                <MenuItem value="Carroceria">Carroceria</MenuItem>
                <MenuItem value="Pá Carregadeira">Pá Carregadeira</MenuItem>
                <MenuItem value="Retroescavadeira">Retroescavadeira</MenuItem>
              </Select>
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.type}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Modelo"
              value={formData.model}
              onChange={handleInputChange("model")}
              error={!!errors.model}
              helperText={errors.model}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleInputChange("status")}
                label="Status"
                sx={{
                  borderRadius: "12px",
                }}
              >
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
                <MenuItem value="Manutenção">Manutenção</MenuItem>
              </Select>
              {errors.status && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.status}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Localização"
              value={formData.location}
              onChange={handleInputChange("location")}
              error={!!errors.location}
              helperText={errors.location}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Operador"
              value={formData.operator}
              onChange={handleInputChange("operator")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Horas Trabalhadas"
              type="number"
              value={formData.workingHours}
              onChange={handleInputChange("workingHours")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Última Manutenção"
              type="date"
              value={formData.lastMaintenance}
              onChange={handleInputChange("lastMaintenance")}
              error={!!errors.lastMaintenance}
              helperText={errors.lastMaintenance}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Próxima Manutenção"
              type="date"
              value={formData.nextMaintenance}
              onChange={handleInputChange("nextMaintenance")}
              error={!!errors.nextMaintenance}
              helperText={errors.nextMaintenance}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          padding: "24px 32px",
          backgroundColor: "#ffffff",
          borderTop: `1px solid ${alpha(themeColors.primary.main, 0.1)}`,
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Button
          onClick={handleCancel}
          startIcon={<Cancel />}
          sx={{
            color: themeColors.text.secondary,
            borderColor: alpha(themeColors.text.secondary, 0.3),
            "&:hover": {
              borderColor: themeColors.text.secondary,
              backgroundColor: alpha(themeColors.text.secondary, 0.05),
            },
            borderRadius: "12px",
            px: 3,
            py: 1,
          }}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          startIcon={<Save />}
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${themeColors.success.main} 0%, ${themeColors.success.dark} 100%)`,
            color: "#ffffff",
            borderRadius: "12px",
            px: 3,
            py: 1,
            boxShadow: `0 4px 12px ${alpha(themeColors.success.main, 0.3)}`,
            "&:hover": {
              background: `linear-gradient(135deg, ${themeColors.success.dark} 0%, ${themeColors.success.main} 100%)`,
              transform: "translateY(-2px)",
              boxShadow: `0 6px 16px ${alpha(themeColors.success.main, 0.4)}`,
            },
            transition: "all 0.3s ease",
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EquipmentModal
