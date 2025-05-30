"use client"

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
} from "@mui/material"
import { Close, DirectionsCar, LocationOn, Person, CheckCircle, Cancel, Build } from "@mui/icons-material"

const EquipmentListModal = ({ open, onClose, title, equipments, themeColors, statusFilter }) => {
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

  const filteredEquipments = statusFilter ? equipments.filter((eq) => eq.status === statusFilter) : equipments

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`,
          color: "#ffffff",
          padding: "20px 24px",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "150px",
            height: "150px",
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
                width: 48,
                height: 48,
                background: `linear-gradient(135deg, ${alpha("#ffffff", 0.2)} 0%, ${alpha("#ffffff", 0.1)} 100%)`,
                backdropFilter: "blur(10px)",
                border: `2px solid ${alpha("#ffffff", 0.3)}`,
              }}
            >
              <DirectionsCar sx={{ fontSize: 24, color: "#ffffff" }} />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {filteredEquipments.length} equipamento(s)
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#ffffff",
              backgroundColor: alpha("#ffffff", 0.1),
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

      <DialogContent sx={{ padding: 0, backgroundColor: "#ffffff" }}>
        {filteredEquipments.length === 0 ? (
          <Box
            sx={{
              padding: "40px 24px",
              textAlign: "center",
              color: themeColors.text.secondary,
            }}
          >
            <DirectionsCar sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Nenhum equipamento encontrado
            </Typography>
            <Typography variant="body2">Não há equipamentos nesta categoria no momento.</Typography>
          </Box>
        ) : (
          <List sx={{ padding: 0 }}>
            {filteredEquipments.map((equipment, index) => (
              <Box key={equipment.id}>
                <ListItem
                  sx={{
                    padding: "16px 24px",
                    "&:hover": {
                      backgroundColor: alpha(themeColors.primary.main, 0.03),
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>{getStatusIcon(equipment.status)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: themeColors.text.primary,
                            fontSize: "1rem",
                          }}
                        >
                          {equipment.prefix}
                        </Typography>
                        <Chip
                          label={equipment.status}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getStatusColor(equipment.status), 0.12),
                            color: getStatusColor(equipment.status),
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            borderRadius: "6px",
                            border: `1px solid ${alpha(getStatusColor(equipment.status), 0.2)}`,
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <DirectionsCar sx={{ fontSize: 14, color: themeColors.text.secondary }} />
                          <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                            {equipment.type} - {equipment.model}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOn sx={{ fontSize: 14, color: themeColors.text.secondary }} />
                          <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                            {equipment.location}
                          </Typography>
                        </Box>
                        {equipment.operator && equipment.operator !== "-" && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Person sx={{ fontSize: 14, color: themeColors.text.secondary }} />
                            <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                              {equipment.operator}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredEquipments.length - 1 && <Divider sx={{ marginLeft: "72px", marginRight: "24px" }} />}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EquipmentListModal
