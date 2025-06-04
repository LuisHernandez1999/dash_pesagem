"use client"

import React from "react"
import { useState, useEffect } from "react"
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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Collapse,
  Alert,
  CircularProgress,
} from "@mui/material"
import { 
  Close, 
  Engineering, 
  Save, 
  Cancel, 
  DirectionsCar, 
  Construction, 
  Build, 
  Warning,
  ErrorOutline 
} from "@mui/icons-material"
import { criarEquipamento } from "../service/equipamento"

const EquipmentModal = ({ open, onClose, onSave, themeColors, equipment = null }) => {
  const [formData, setFormData] = useState({
    prefix: equipment?.prefix || "",
    type: equipment?.type || "",
    status: equipment?.status || "Ativo",
  })

  const [motivoInatividade, setMotivoInatividade] = useState({
    manutencao: false,
    garagem: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const equipmentTypes = [
    { value: "Caminhão Carroceiria", label: "Caminhão Carroceiria", icon: DirectionsCar, color: themeColors.primary.main },
    { value: "Pá Carregadeira'", label: "Pá Carregadeira", icon: Construction, color: themeColors.warning.main },
    { value: "Retroescavadeira", label: "Retroescavadeira", icon: Build, color: themeColors.error.main },
  ]

  const statusOptions = [
    { value: "Ativo", label: "Ativo", color: themeColors.success.main },
    { value: "Inativo", label: "Inativo", color: themeColors.error.main },
    { value: "Manutenção", label: "Manutenção", color: themeColors.warning.main },
  ]

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (equipment) {
        setFormData({
          prefix: equipment.prefix || "",
          type: equipment.type || "",
          status: equipment.status || "Ativo",
        })
      } else {
        setFormData({
          prefix: "",
          type: "",
          status: "Ativo",
        })
      }
      setMotivoInatividade({
        manutencao: false,
        garagem: false,
      })
      setErrors({})
      setApiError(null)
    }
  }, [open, equipment])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Reset motivo inatividade se status não for Inativo
    if (field === "status" && value !== "Inativo") {
      setMotivoInatividade({
        manutencao: false,
        garagem: false,
      })
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleMotivoChange = (motivo) => (event) => {
    setMotivoInatividade((prev) => ({
      ...prev,
      [motivo]: event.target.checked,
    }))

    // Clear motivo error when user selects something
    if (errors.motivo) {
      setErrors((prev) => ({
        ...prev,
        motivo: "",
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

    // Validar motivo da inatividade se status for Inativo
    if (formData.status === "Inativo") {
      if (!motivoInatividade.manutencao && !motivoInatividade.garagem) {
        newErrors.motivo = "Selecione pelo menos um motivo da inatividade"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setLoading(true)
    setApiError(null)
    console.log("🔄 Iniciando salvamento do equipamento:", formData)

    try {
      if (equipment?.id) {
        // Editing existing equipment - usar função de edição
        console.log("📝 Modo de edição não implementado neste modal")
        setApiError({
          title: "Funcionalidade não disponível",
          message: "Este modal é apenas para criação. Use o modal de edição para alterar equipamentos.",
          details: ""
        })
      } else {
        // Creating new equipment
        console.log("🆕 Criando novo equipamento:", formData)
        
        // Preparar motivo da inatividade se aplicável
        let motivoTexto = null
        if (formData.status === "Inativo") {
          const motivos = []
          if (motivoInatividade.manutencao) motivos.push("Manutenção")
          if (motivoInatividade.garagem) motivos.push("Garagem")
          motivoTexto = motivos.join(", ")
        }

        const result = await criarEquipamento(
          formData.prefix, 
          formData.type, 
          formData.status, 
          motivoTexto
        )
        
        console.log("📊 Resultado da criação:", result)

        // Verificar se há erro de resposta não-JSON
        if (!result.sucesso && result.erroDetalhado === "Resposta HTML recebida em vez de JSON") {
          setApiError({
            title: "❌ Erro na API - Resposta HTML",
            message: "A API retornou uma página HTML em vez de JSON. Isso indica um problema no servidor.",
            details: `
            URL chamada: ${result.urlChamada}
            Status HTTP: ${result.status}
            
            Possíveis causas:
            • Endpoint não existe (404)
            • Erro interno do servidor (500)
            • URL incorreta
            • Servidor retornando página de erro
            
            Resposta recebida (primeiros 300 caracteres):
            ${result.respostaTexto?.substring(0, 300)}...
          `,
          })
          console.error("❌ Erro de resposta HTML:", result)
        } else if (!result.sucesso && result.erroDetalhado === "Resposta não é JSON válido") {
          setApiError({
            title: "❌ Erro na API - Resposta Inválida",
            message: "A API retornou uma resposta que não é JSON válido.",
            details: `
            URL chamada: ${result.urlChamada}
            Status HTTP: ${result.status}
            
            Resposta recebida (primeiros 300 caracteres):
            ${result.respostaTexto?.substring(0, 300)}...
          `,
          })
          console.error("❌ Erro de resposta inválida:", result)
        } else {
          // Resposta válida, processar normalmente
          onSave(result)
          if (result.sucesso) {
            handleClose()
          }
        }
      }
    } catch (error) {
      console.error("❌ Erro ao salvar equipamento:", error)
      setApiError({
        title: "Erro inesperado",
        message: error.message || "Ocorreu um erro ao processar sua solicitação.",
        details: "Verifique o console para mais detalhes.",
      })
    } finally {
      setLoading(false)
      console.log("✅ Processo de salvamento finalizado")
    }
  }

  const handleClose = () => {
    setFormData({
      prefix: "",
      type: "",
      status: "Ativo",
    })
    setMotivoInatividade({
      manutencao: false,
      garagem: false,
    })
    setErrors({})
    setApiError(null)
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

  const isInactive = formData.status === "Inativo"

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
      {/* Header */}
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
            disabled={loading}
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
        {apiError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "12px",
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
            icon={<ErrorOutline />}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {apiError.title}
            </Typography>
            <Typography variant="body2">{apiError.message}</Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 1, fontSize: "0.7rem", opacity: 0.8 }}>
              {apiError.details}
            </Typography>
          </Alert>
        )}

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
              disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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

          {/* Motivo da Inatividade - Aparece apenas quando status é Inativo */}
          <Collapse in={isInactive}>
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${alpha(themeColors.error.main, 0.05)} 0%, ${alpha(themeColors.error.main, 0.02)} 100%)`,
                border: `2px solid ${alpha(themeColors.error.main, 0.15)}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Warning sx={{ color: themeColors.error.main, fontSize: "1.2rem" }} />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: themeColors.error.main,
                    fontSize: "1rem",
                  }}
                >
                  Motivo da Inatividade
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  color: themeColors.text.secondary,
                  mb: 2,
                  fontSize: "0.9rem",
                }}
              >
                Selecione o(s) motivo(s) pelos quais o equipamento está inativo:
              </Typography>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={motivoInatividade.manutencao}
                      onChange={handleMotivoChange("manutencao")}
                      disabled={loading}
                      sx={{
                        color: themeColors.error.main,
                        "&.Mui-checked": {
                          color: themeColors.error.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                      Manutenção
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={motivoInatividade.garagem}
                      onChange={handleMotivoChange("garagem")}
                      disabled={loading}
                      sx={{
                        color: themeColors.error.main,
                        "&.Mui-checked": {
                          color: themeColors.error.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                      Em Garagem
                    </Typography>
                  }
                />
              </FormGroup>

              {errors.motivo && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                  {errors.motivo}
                </Typography>
              )}
            </Box>
          </Collapse>

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
                    {isInactive && (motivoInatividade.manutencao || motivoInatividade.garagem) && (
                      <Typography variant="caption" sx={{ color: themeColors.error.main, fontSize: "0.8rem", mt: 0.5, display: "block" }}>
                        Motivo: {[
                          motivoInatividade.manutencao && "Manutenção",
                          motivoInatividade.garagem && "Garagem"
                        ].filter(Boolean).join(", ")}
                      </Typography>
                    )}
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

      {/* Actions */}
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
          disabled={loading}
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
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />}
          variant="outlined"
          disabled={loading}
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
            "&:disabled": {
              backgroundColor: "#f5f5f5",
              color: "#999",
              borderColor: "#ddd",
              transform: "none",
            },
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Criando..." : "Cadastrar Equipamento"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EquipmentModal
