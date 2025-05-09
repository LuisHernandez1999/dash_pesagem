"use client"

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
  Stack,
  alpha,
} from "@mui/material"
import { DirectionsCar, Close, CheckCircle } from "@mui/icons-material"
import { Slide } from "@mui/material"
import { useState, useEffect } from "react"

const EditModal = ({ open, onClose, data, onSave, themeColors, keyframes }) => {
  const [formData, setFormData] = useState({
    driver: "",
    driverId: "",
    team: "",
    vehiclePrefix: "",
    collectors: ["", "", ""],
    vehicleType: "",
    garage: "",
    route: "",
    status: "",
  })

  useEffect(() => {
    if (data) {
      setFormData({
        driver: data.driver || "",
        driverId: data.driverId || "",
        team: data.team || "",
        vehiclePrefix: data.vehiclePrefix || "",
        collectors: Array.isArray(data.collectors) ? [...data.collectors] : ["", "", ""],
        vehicleType: data.vehicle || "",
        garage: data.garage || "",
        route: data.route || "",
        status: data.status || "",
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

  const handleSubmit = () => {
    onSave(formData)
  }

  if (!data) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
            Editar Remoção
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
        <Stack spacing={2.5}>
          <TextField
            label="Nome do Motorista"
            fullWidth
            variant="outlined"
            size="small"
            value={formData.driver}
            onChange={(e) => handleChange("driver", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "white",
              },
            }}
          />
          <TextField
            label="Matrícula do Motorista"
            fullWidth
            variant="outlined"
            size="small"
            value={formData.driverId}
            onChange={(e) => handleChange("driverId", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "white",
              },
            }}
          />
          <TextField
            label="Prefixo do Veículo"
            fullWidth
            variant="outlined"
            size="small"
            value={formData.vehiclePrefix}
            onChange={(e) => handleChange("vehiclePrefix", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "white",
              },
            }}
          />
          <Autocomplete
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
                  },
                }}
              />
            )}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: themeColors.text.secondary }}>
            Coletores:
          </Typography>
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#ffff",
                },
              }}
            />
          ))}
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
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "white",
                  },
                }}
              />
            )}
          />
          <TextField
            label="Garagem"
            fullWidth
            variant="outlined"
            size="small"
            value={formData.garage}
            onChange={(e) => handleChange("garage", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "white",
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "white",
              },
            }}
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
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "white",
                  },
                }}
              />
            )}
          />
        </Stack>
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
          onClick={handleSubmit}
          variant="contained"
          size="medium"
          startIcon={<CheckCircle />}
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
          Salvar Alterações
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditModal
