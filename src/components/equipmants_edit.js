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
  Select,
  MenuItem,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Close, Save, Cancel, Edit, ErrorOutline } from "@mui/icons-material"
import { useState, useEffect } from "react"
import { editarEquipamento } from "../service/equipamento"

const EquipmentModal = ({ open, onClose, onSave, equipment, themeColors }) => {
  const [formData, setFormData] = useState({
    prefix: "",
    type: "",
    status: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  // Pre-populate form when equipment data changes
  useEffect(() => {
    if (equipment) {
      setFormData({
        prefix: equipment.prefix || "",
        type: equipment.type || "",
        status: equipment.status || "",
      })
    } else {
      // Reset form for new equipment
      setFormData({
        prefix: "",
        type: "",
        status: "",
      })
    }
    setErrors({})
    setApiError(null)
  }, [equipment])

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
    if (!formData.status) newErrors.status = "Status é obrigatório"

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
        // Editing existing equipment
        console.log(`📝 Editando equipamento ID: ${equipment.id}`)
        console.log("📊 Dados para edição:", {
          id: equipment.id,
          prefix: formData.prefix,
          type: formData.type,
          status: formData.status,
        })

        const result = await editarEquipamento(equipment.id, formData.prefix, formData.type, formData.status)
        console.log("📊 Resultado da edição:", result)

        // Verificar se há erro de resposta não-JSON
        if (result.erroDetalhado === "Resposta não é JSON válido. Possível HTML ou texto recebido.") {
          setApiError({
            title: "Erro na resposta da API",
            message: "A API retornou uma resposta inválida. Verifique a URL e os parâmetros.",
            details: `Resposta recebida (primeiros 200 caracteres): ${result.respostaTexto?.substring(0, 200)}...`
          })
          console.error("❌ Erro de resposta não-JSON:", result.respostaTexto)
        } else {
          onSave(result)
        }
      } else {
        // Creating new equipment (implement this API call later)
        console.log("🆕 Criando novo equipamento:", formData)
        onSave({
          sucesso: true,
          mensagem: "Equipamento criado com sucesso!",
          dados: { ...formData, id: Date.now() },
        })
      }
    } catch (error) {
      console.error("❌ Erro ao salvar equipamento:", error)
      setApiError({
        title: "Erro inesperado",
        message: error.message || "Ocorreu um erro ao processar sua solicitação.",
        details: "Verifique o console para mais detalhes."
      })
    } finally {
      setLoading(false)
      console.log("✅ Processo de salvamento finalizado")
    }
  }

  const handleCancel = () => {
    setErrors({})
    setFormData({
      prefix: "",
      type: "",
      status: "",
    })
    setApiError(null)
    onClose()
  }

  const isEditing = !!equipment?.id

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          border: "1px solid #f1f5f9",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: isEditing
            ? `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`
            : `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
          color: "#ffffff",
          padding: "24px 32px",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "120px",
            height: "120px",
            background: `radial-gradient(circle, ${alpha("#ffffff", 0.15)} 0%, transparent 70%)`,
            transform: "translate(30%, -30%)",
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
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                backgroundColor: alpha("#ffffff", 0.2),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha("#ffffff", 0.3)}`,
              }}
            >
              <Edit sx={{ color: "#ffffff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "#ffffff",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {isEditing ? "Editar Equipamento" : "Novo Equipamento"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: alpha("#ffffff", 0.9),
                  fontSize: "0.9rem",
                }}
              >
                {isEditing ? "Modificar informações" : "Cadastrar novo equipamento"}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCancel}
            disabled={loading}
            sx={{
              color: "#ffffff",
              backgroundColor: alpha("#ffffff", 0.15),
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha("#ffffff", 0.2)}`,
              width: 44,
              height: 44,
              "&:hover": {
                backgroundColor: alpha("#ffffff", 0.25),
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: "32px", backgroundColor: "#ffffff" }}>
        {apiError && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: "12px",
              "& .MuiAlert-icon": {
                alignItems: "center"
              }
            }}
            icon={<ErrorOutline />}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {apiError.title}
            </Typography>
            <Typography variant="body2">
              {apiError.message}
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 1, fontSize: "0.7rem", opacity: 0.8 }}>
              {apiError.details}
            </Typography>
          </Alert>
        )}
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Prefixo */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1,
              }}
            >
              Prefixo
            </Typography>
            <TextField
              fullWidth
              value={formData.prefix}
              onChange={handleInputChange("prefix")}
              error={!!errors.prefix}
              helperText={errors.prefix}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                  },
                },
              }}
            />
          </Box>

          {/* Implemento */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1,
              }}
            >
              Implemento
            </Typography>
            <FormControl fullWidth error={!!errors.type}>
              <Select
                value={formData.type}
                onChange={handleInputChange("type")}
                displayEmpty
                disabled={loading}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Selecione o tipo</em>
                </MenuItem>
                <MenuItem value="Retroescavadeira">Retroescavadeira</MenuItem>
                <MenuItem value="Pá Carregadeira'">Pá Carregadeira</MenuItem>
                <MenuItem value="Caminhão Carroceiria">Caminhão Carroceiria</MenuItem>
              </Select>
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.type}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Status */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1,
              }}
            >
              Status
            </Typography>
            <FormControl fullWidth error={!!errors.status}>
              <Select
                value={formData.status}
                onChange={handleInputChange("status")}
                displayEmpty
                disabled={loading}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Selecione o status</em>
                </MenuItem>
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
                <MenuItem value="Manutenção">Manutenção</MenuItem>
              </Select>
              {errors.status && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.status}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          padding: "24px 32px",
          backgroundColor: "#f8fafc",
          borderTop: "1px solid #f1f5f9",
          gap: 2,
        }}
      >
        <Button
          onClick={handleCancel}
          startIcon={<Cancel />}
          disabled={loading}
          sx={{
            color: "#64748b",
            borderColor: "#e2e8f0",
            "&:hover": {
              borderColor: "#cbd5e1",
              backgroundColor: "#f1f5f9",
            },
            borderRadius: "12px",
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 500,
          }}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />}
          variant="contained"
          disabled={loading}
          sx={{
            background: isEditing
              ? `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`
              : `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
            color: "#ffffff",
            borderRadius: "12px",
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
            "&:hover": {
              background: isEditing
                ? `linear-gradient(135deg, #d97706 0%, #b45309 100%)`
                : `linear-gradient(135deg, #059669 0%, #047857 100%)`,
              transform: "translateY(-1px)",
              boxShadow: "0 6px 16px rgba(59, 130, 246, 0.3)",
            },
            "&:disabled": {
              background: "#94a3b8",
              transform: "none",
            },
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EquipmentModal
