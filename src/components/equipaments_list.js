"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  alpha,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material"
import { Close, DirectionsCar, CheckCircle, Cancel, Build, Search, Clear } from "@mui/icons-material"

const EquipmentListModal = ({ open, onClose, title, equipments, themeColors }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ativo":
        return <CheckCircle sx={{ color: themeColors.success.main }} />
      case "Inativo":
        return <Cancel sx={{ color: themeColors.error.main }} />
      case "Manutenção":
        return <Build sx={{ color: themeColors.warning.main }} />
      default:
        return <DirectionsCar sx={{ color: themeColors.text.secondary }} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Ativo":
        return themeColors.success.main
      case "Inativo":
        return themeColors.error.main
      case "Manutenção":
        return themeColors.warning.main
      default:
        return themeColors.text.secondary
    }
  }

  // Filter equipments based on search term
  const filteredEquipments = equipments.filter((equipment) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      equipment.prefix?.toLowerCase().includes(searchLower) ||
      equipment.type?.toLowerCase().includes(searchLower) ||
      equipment.status?.toLowerCase().includes(searchLower)
    )
  })

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleClose = () => {
    setSearchTerm("")
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.12)",
          overflow: "hidden",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`,
          color: "#ffffff",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: `radial-gradient(circle, ${alpha("#ffffff", 0.15)} 0%, transparent 70%)`,
            transform: "translate(50%, -50%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "150px",
            height: "150px",
            background: `radial-gradient(circle, ${alpha("#ffffff", 0.1)} 0%, transparent 70%)`,
            transform: "translate(-50%, 50%)",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, ${alpha("#ffffff", 0.25)} 0%, ${alpha("#ffffff", 0.15)} 100%)`,
                backdropFilter: "blur(10px)",
                border: `2px solid ${alpha("#ffffff", 0.3)}`,
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              }}
            >
              <DirectionsCar sx={{ fontSize: 28, color: "#ffffff" }} />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  opacity: 0.9,
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                {filteredEquipments.length} de {equipments.length} equipamento(s)
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#ffffff",
              backgroundColor: alpha("#ffffff", 0.15),
              width: 48,
              height: 48,
              "&:hover": {
                backgroundColor: alpha("#ffffff", 0.25),
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Close sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Search Bar */}
      <Box
        sx={{
          padding: "20px 24px",
          backgroundColor: alpha(themeColors.primary.main, 0.02),
          borderBottom: `1px solid ${alpha(themeColors.primary.main, 0.1)}`,
        }}
      >
        <TextField
          fullWidth
          placeholder="Pesquisar por prefixo, tipo ou status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: themeColors.text.secondary }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  size="small"
                  sx={{
                    color: themeColors.text.secondary,
                    "&:hover": {
                      color: themeColors.primary.main,
                    },
                  }}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(themeColors.primary.main, 0.2),
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(themeColors.primary.main, 0.4),
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: themeColors.primary.main,
                borderWidth: "2px",
              },
            },
          }}
        />
      </Box>

      <DialogContent sx={{ padding: 0, backgroundColor: "#ffffff" }}>
        {filteredEquipments.length === 0 ? (
          <Box
            sx={{
              padding: "60px 24px",
              textAlign: "center",
              color: themeColors.text.secondary,
            }}
          >
            <DirectionsCar sx={{ fontSize: 64, opacity: 0.3, mb: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: "1.2rem" }}>
              {searchTerm ? "Nenhum equipamento encontrado" : "Nenhum equipamento disponível"}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              {searchTerm
                ? `Não encontramos equipamentos que correspondam a "${searchTerm}"`
                : "Não há equipamentos nesta categoria no momento."}
            </Typography>
          </Box>
        ) : (
          <List sx={{ padding: 0 }}>
            {filteredEquipments.map((equipment, index) => (
              <Box key={equipment.id}>
                <ListItem
                  sx={{
                    padding: "20px 24px",
                    "&:hover": {
                      backgroundColor: alpha(themeColors.primary.main, 0.04),
                      transform: "translateX(4px)",
                    },
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 56 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        backgroundColor: alpha(getStatusColor(equipment.status), 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${alpha(getStatusColor(equipment.status), 0.2)}`,
                      }}
                    >
                      {getStatusIcon(equipment.status)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: themeColors.text.primary,
                            fontSize: "1.1rem",
                          }}
                        >
                          {equipment.prefix}
                        </Typography>
                        <Chip
                          label={equipment.status}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getStatusColor(equipment.status), 0.15),
                            color: getStatusColor(equipment.status),
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            borderRadius: "8px",
                            border: `1px solid ${alpha(getStatusColor(equipment.status), 0.3)}`,
                            height: "28px",
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <DirectionsCar sx={{ fontSize: 18, color: themeColors.text.secondary }} />
                        <Typography
                          variant="body1"
                          sx={{
                            color: themeColors.text.secondary,
                            fontSize: "0.95rem",
                            fontWeight: 500,
                          }}
                        >
                          {equipment.type}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredEquipments.length - 1 && (
                  <Divider
                    sx={{
                      marginLeft: "80px",
                      marginRight: "24px",
                      borderColor: alpha(themeColors.primary.main, 0.08),
                    }}
                  />
                )}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EquipmentListModal
