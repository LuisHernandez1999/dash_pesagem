"use client"

import React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  alpha,
  Divider,
  Chip,
  Avatar,
} from "@mui/material"
import { Close, Engineering, Save, Cancel, DirectionsCar, Construction, Build } from "@mui/icons-material"

const EquipmentModal = ({ open, onClose, onSave, themeColors, equipment = null }) => {
  const [formData, setFormData] = useState({
    prefix: equipment?.prefix || "",
    type: equipment?.type || "",
    status: equipment?.status || "Ativo",
  })

  const [errors, setErrors] = useState({})

  const equipmentTypes = [
    { value: "Carroceria", label: "Carroceria", icon: DirectionsCar, color: themeColors.primary.main },
    { value: "Pá Carregadeira", label: "Pá Carregadeira", icon: Construction, color: themeColors.warning.main },
    { value: "Retroescavadeira", label: "Retroescavadeira", icon: Build, color: themeColors.error.main },
  ]

  const statusOptions = [
    { value: "Ativo", label: "Ativo", color: themeColors.success.main },
    { value: "Inativo", label: "Inativo", color: themeColors.error.main },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.prefix.trim()) {
      newErrors.prefix = "Prefixo é obrigatório"
    }
    if (!formData.type) {
      newErrors.type = "Tipo é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      prefix: "",
      type: "",
      status: "Ativo",
    })
    setErrors({})
    onClose()
  }

  const getTypeIcon = (type) => {
    const typeObj = equipmentTypes.find((t) => t.value === type)
    return typeObj ? typeObj.icon : Engineering
  }

  const getTypeColor = (type) => {
    const typeObj = equipmentTypes.find((t) => t.value === type)
    return typeObj ? typeObj.color : themeColors.text.secondary
  }

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find((s) => s.value === status)
    return statusObj ? statusObj.color : themeColors.text.secondary
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.12)",
          overflow: "hidden",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          minHeight: "420px",
        },
      }}
    >
      {/* Header - Ainda mais reduzido */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${themeColors.success.main} 0%, ${themeColors.success.light} 100%)`,
          color: "white",
          padding: "16px 20px",
          position: "relative",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: -4,
              top: -4,
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transform: "rotate(90deg)",
              },
              transition: "all 0.3s ease",
              width: 28,
              height: 28,
            }}
          >
            <Close sx={{ fontSize: "1rem" }} />
          </IconButton>

          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <Engineering sx={{ fontSize: "1.4rem", color: "white" }} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 0.3 }}>
            {equipment ? "Editar Equipamento" : "Novo Equipamento"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.85rem" }}>
            {equipment ? "Atualize as informações" : "Cadastre um novo equipamento"}
          </Typography>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ padding: "32px", backgroundColor: "#ffffff" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Prefixo */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: themeColors.text.primary,
                mb: 1.5,
                fontSize: "1rem",
              }}
            >
              Identificação do Equipamento
            </Typography>
            <TextField
              fullWidth
              label="Prefixo"
              value={formData.prefix}
              onChange={(e) => handleInputChange("prefix", e.target.value)}
              error={!!errors.prefix}
              helperText={errors.prefix || "Ex: CAR-001, PC-002, RE-003"}
              placeholder="Digite o prefixo do equipamento"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  fontSize: "1rem",
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: themeColors.success.main,
                      borderWidth: "2px",
                    },
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: themeColors.success.main,
                },
              }}
            />
          </Box>

          {/* Tipo de Equipamento */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: themeColors.text.primary,
                mb: 1.5,
                fontSize: "1rem",
              }}
            >
              Categoria do Equipamento
            </Typography>
            <FormControl fullWidth error={!!errors.type}>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: "16px",
                  fontSize: "1rem",
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: themeColors.success.main,
                      borderWidth: "2px",
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ color: themeColors.text.secondary }}>Selecione o tipo de equipamento</Typography>
                </MenuItem>
                {equipmentTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 0.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: alpha(type.color, 0.1),
                            color: type.color,
                          }}
                        >
                          <IconComponent sx={{ fontSize: "1.1rem" }} />
                        </Avatar>
                        <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>{type.label}</Typography>
                      </Box>
                    </MenuItem>
                  )
                })}
              </Select>
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.type}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Status */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: themeColors.text.primary,
                mb: 1.5,
                fontSize: "1rem",
              }}
            >
              Status do Equipamento
            </Typography>
            <FormControl fullWidth>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                sx={{
                  borderRadius: "16px",
                  fontSize: "0.95rem",
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: themeColors.success.main,
                      borderWidth: "2px",
                    },
                  },
                }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: status.color,
                        }}
                      />
                      <Typography sx={{ fontSize: "0.95rem" }}>{status.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Preview Card */}
          {formData.prefix && formData.type && (
            <Box sx={{ mt: 1 }}>
              <Divider sx={{ mb: 2 }}>
                <Chip
                  label="Prévia do Equipamento"
                  sx={{
                    backgroundColor: alpha(themeColors.success.main, 0.1),
                    color: themeColors.success.main,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                  }}
                />
              </Divider>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${alpha(getTypeColor(formData.type), 0.08)} 0%, ${alpha(getTypeColor(formData.type), 0.02)} 100%)`,
                  border: `2px solid ${alpha(getTypeColor(formData.type), 0.2)}`,
                  transition: "all 0.3s ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: getTypeColor(formData.type),
                      boxShadow: `0 6px 16px ${alpha(getTypeColor(formData.type), 0.3)}`,
                    }}
                  >
                    {React.createElement(getTypeIcon(formData.type), { sx: { color: "white", fontSize: "1.5rem" } })}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1.1rem" }}
                    >
                      {formData.prefix}
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontSize: "0.9rem", mt: 0.3 }}>
                      {formData.type}
                    </Typography>
                  </Box>
                  <Chip
                    label={formData.status}
                    sx={{
                      backgroundColor: alpha(getStatusColor(formData.status), 0.15),
                      color: getStatusColor(formData.status),
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      height: "32px",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Actions - Com melhor separação */}
      <DialogActions
        sx={{
          padding: "20px 32px 24px",
          backgroundColor: alpha(themeColors.success.main, 0.02),
          borderTop: `1px solid ${alpha(themeColors.success.main, 0.1)}`,
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Button
          onClick={handleClose}
          startIcon={<Cancel />}
          sx={{
            color: themeColors.text.secondary,
            borderColor: alpha(themeColors.text.secondary, 0.3),
            borderRadius: "12px",
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: "0.9rem",
            minWidth: "120px",
            "&:hover": {
              backgroundColor: alpha(themeColors.text.secondary, 0.05),
              borderColor: themeColors.text.secondary,
            },
          }}
          variant="outlined"
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          startIcon={<Save />}
          variant="outlined"
          sx={{
            backgroundColor: "white",
            color: themeColors.success.main,
            border: `2px solid ${themeColors.success.main}`,
            borderRadius: "12px",
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: "0.9rem",
            minWidth: "160px",
            "&:hover": {
              backgroundColor: "white",
              borderColor: themeColors.success.dark,
              color: themeColors.success.dark,
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {equipment ? "Atualizar" : "Cadastrar"} Equipamento
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EquipmentModal
