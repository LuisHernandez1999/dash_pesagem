"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  alpha,
  Avatar,
  LinearProgress,
} from "@mui/material"
import {
  Close,
  Engineering,
  LocationOn,
  Person,
  Schedule,
  Build,
  DirectionsCar,
  CalendarToday,
  AccessTime,
  Settings,
} from "@mui/icons-material"

const EquipmentViewModal = ({ open, onClose, equipment, themeColors }) => {
  if (!equipment) return null

  // Get status color
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

  // Get equipment type color
  const getTypeColor = (type) => {
    switch (type) {
      case "Carroceria":
        return themeColors.primary.main
      case "Pá Carregadeira":
        return themeColors.warning.main
      case "Retroescavadeira":
        return themeColors.error.main
      default:
        return themeColors.text.secondary
    }
  }

  // Calculate maintenance progress
  const calculateMaintenanceProgress = () => {
    const lastMaintenance = new Date(equipment.lastMaintenance)
    const nextMaintenance = new Date(equipment.nextMaintenance)
    const today = new Date()

    const totalDays = (nextMaintenance - lastMaintenance) / (1000 * 60 * 60 * 24)
    const daysPassed = (today - lastMaintenance) / (1000 * 60 * 60 * 24)

    return Math.min((daysPassed / totalDays) * 100, 100)
  }

  const maintenanceProgress = calculateMaintenanceProgress()

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  // Get days until next maintenance
  const getDaysUntilMaintenance = () => {
    const nextMaintenance = new Date(equipment.nextMaintenance)
    const today = new Date()
    const diffTime = nextMaintenance - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilMaintenance = getDaysUntilMaintenance()

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
          background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`,
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
                {equipment.prefix}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  opacity: 0.9,
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                Detalhes do Equipamento
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
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
        {/* Status e Tipo Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                borderRadius: "16px",
                border: `2px solid ${alpha(getStatusColor(equipment.status), 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(getStatusColor(equipment.status), 0.05)} 0%, ${alpha(getStatusColor(equipment.status), 0.02)} 100%)`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha(getStatusColor(equipment.status), 0.2)}`,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: alpha(getStatusColor(equipment.status), 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Settings sx={{ color: getStatusColor(equipment.status), fontSize: 24 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary, mb: 1 }}>
                  Status
                </Typography>
                <Chip
                  label={equipment.status}
                  sx={{
                    backgroundColor: alpha(getStatusColor(equipment.status), 0.15),
                    color: getStatusColor(equipment.status),
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    borderRadius: "12px",
                    border: `2px solid ${alpha(getStatusColor(equipment.status), 0.3)}`,
                    px: 2,
                    py: 1,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                borderRadius: "16px",
                border: `2px solid ${alpha(getTypeColor(equipment.type), 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(getTypeColor(equipment.type), 0.05)} 0%, ${alpha(getTypeColor(equipment.type), 0.02)} 100%)`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha(getTypeColor(equipment.type), 0.2)}`,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: alpha(getTypeColor(equipment.type), 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <DirectionsCar sx={{ color: getTypeColor(equipment.type), fontSize: 24 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.text.primary, mb: 1 }}>
                  Tipo
                </Typography>
                <Chip
                  label={equipment.type}
                  sx={{
                    backgroundColor: alpha(getTypeColor(equipment.type), 0.15),
                    color: getTypeColor(equipment.type),
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    borderRadius: "12px",
                    border: `2px solid ${alpha(getTypeColor(equipment.type), 0.3)}`,
                    px: 2,
                    py: 1,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: alpha(themeColors.primary.main, 0.1) }} />

        {/* Informações Detalhadas */}
        <Grid container spacing={3}>
          {/* Informações Básicas */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "16px",
                border: `1px solid ${alpha(themeColors.primary.main, 0.1)}`,
                background: alpha(themeColors.primary.main, 0.02),
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
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
                  <Engineering sx={{ color: themeColors.primary.main }} />
                  Informações Básicas
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: alpha(themeColors.info.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <DirectionsCar sx={{ color: themeColors.info.main, fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>
                        Modelo
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                        {equipment.model}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: alpha(themeColors.warning.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LocationOn sx={{ color: themeColors.warning.main, fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>
                        Localização
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                        {equipment.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: alpha(themeColors.success.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Person sx={{ color: themeColors.success.main, fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>
                        Operador
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                        {equipment.operator || "Não atribuído"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: alpha(themeColors.error.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AccessTime sx={{ color: themeColors.error.main, fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>
                        Horas Trabalhadas
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                        {equipment.workingHours?.toLocaleString()} horas
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Manutenção */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "16px",
                border: `1px solid ${alpha(themeColors.warning.main, 0.1)}`,
                background: alpha(themeColors.warning.main, 0.02),
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
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
                  <Build sx={{ color: themeColors.warning.main }} />
                  Manutenção
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: alpha(themeColors.success.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CalendarToday sx={{ color: themeColors.success.main, fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>
                        Última Manutenção
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                        {formatDate(equipment.lastMaintenance)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: alpha(themeColors.warning.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Schedule sx={{ color: themeColors.warning.main, fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>
                        Próxima Manutenção
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                        {formatDate(equipment.nextMaintenance)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Progress da Manutenção */}
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>
                        Progresso até próxima manutenção
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: themeColors.text.primary }}>
                        {Math.round(maintenanceProgress)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={maintenanceProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha(themeColors.warning.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          backgroundColor: maintenanceProgress > 80 ? themeColors.error.main : themeColors.warning.main,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: daysUntilMaintenance <= 7 ? themeColors.error.main : themeColors.text.secondary,
                        fontWeight: 600,
                      }}
                    >
                      {daysUntilMaintenance > 0
                        ? `${daysUntilMaintenance} dias restantes`
                        : `Manutenção atrasada em ${Math.abs(daysUntilMaintenance)} dias`}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default EquipmentViewModal
