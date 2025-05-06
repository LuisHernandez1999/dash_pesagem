"use client"

import { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Paper,
  Divider,
  Stack,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import {
  Close,
  Print,
  Person,
  Group,
  DirectionsCar,
  Route,
  Warehouse,
  CalendarMonth,
  AccessTime,
  Phone,
  LocationOn,
  CheckCircle,
  Timeline,
  WbSunny,
  Business,
} from "@mui/icons-material"

const DetailModal = ({ open, onClose, removal, themeColors, keyframes }) => {
  const handleCloseModal = () => {
    onClose()
  }

  // Format date to Brazilian format
  const formatDateBR = (dateString) => {
    if (!dateString) return "Não informado"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return dateString || "Não informado"
    }
  }

  // Get status chip based on status
  const getStatusChip = (status) => {
    if (!status) return "Não informado"
    
    if (status === "Finalizado") {
      return (
        <Chip
          label="Finalizado"
          icon={<CheckCircle fontSize="small" />}
          sx={{
            backgroundColor: alpha(themeColors.success.main, 0.1),
            color: themeColors.success.main,
            fontWeight: 600,
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "& .MuiChip-icon": {
              color: themeColors.success.main,
            },
          }}
        />
      )
    } else {
      return (
        <Chip
          label="Em andamento"
          icon={<Timeline fontSize="small" />}
          sx={{
            backgroundColor: alpha(themeColors.primary.main, 0.1),
            color: themeColors.primary.main,
            fontWeight: 600,
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "& .MuiChip-icon": {
              color: themeColors.primary.main,
            },
          }}
        />
      )
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
          maxWidth: "600px",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
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
              width: 40,
              height: 40,
              mr: 1.5,
              animation: `${keyframes.pulse} 2s infinite ease-in-out`,
            }}
          >
            <DirectionsCar />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
            Detalhes da Remoção
          </Typography>
        </Box>
        <IconButton
          onClick={handleCloseModal}
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

      <DialogContent sx={{ padding: "1.5rem", overflowY: "auto" }}>
        <Stack spacing={3}>
          {/* Motorista Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              animation: `${keyframes.fadeIn} 0.5s ease-out, ${keyframes.slideInUp} 0.5s ease-out`,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: alpha(themeColors.primary.main, 0.1),
                color: themeColors.primary.main,
                fontWeight: 600,
                width: 56,
                height: 56,
                boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.15)}`,
                animation: `${keyframes.pulse} 3s infinite ease-in-out`,
              }}
            >
              <Person sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: themeColors.text.primary,
                  fontSize: "1.25rem",
                  animation: `${keyframes.fadeIn} 0.5s ease-out`,
                }}
              >
                {typeof removal?.motorista === "object" 
                  ? removal?.motorista?.nome || "Não informado" 
                  : removal?.driver || removal?.motorista || "Não informado"}
              </Typography>
              <Typography
                sx={{
                  color: themeColors.text.secondary,
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  animation: `${keyframes.fadeIn} 0.5s ease-out 0.1s both`,
                }}
              >
                <Person fontSize="small" sx={{ fontSize: 16, opacity: 0.7 }} /> Motorista
              </Typography>
            </Box>
          </Box>

          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: themeColors.divider,
              },
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.2s both`,
            }}
          >
            <Chip
              label="Informações Principais"
              size="small"
              sx={{
                backgroundColor: alpha(themeColors.primary.main, 0.1),
                color: themeColors.primary.main,
                fontWeight: 600,
                borderRadius: "12px",
              }}
            />
          </Divider>

          {/* Main Info Grid */}
          <Grid
            container
            spacing={2}
            sx={{
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.3s both, ${keyframes.slideInUp} 0.5s ease-out 0.3s both`,
            }}
          >
            {/* Status */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(
                    removal?.status_frota === "Finalizado" ? themeColors.success.main : themeColors.primary.main, 
                    0.05
                  ),
                  border: `1px solid ${alpha(
                    removal?.status_frota === "Finalizado" ? themeColors.success.main : themeColors.primary.main, 
                    0.2
                  )}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
              >
                <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem", mb: 1 }}>
                  Status
                </Typography>
                {getStatusChip(removal?.status_frota)}
              </Paper>
            </Grid>

            {/* Equipe */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.warning.main, 0.05),
                  border: `1px solid ${alpha(themeColors.warning.main, 0.2)}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
              >
                <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem", mb: 1 }}>
                  Equipe
                </Typography>
                <Typography sx={{ fontWeight: 700, color: themeColors.warning.main, fontSize: "1rem" }}>
                  {removal?.tipo_equipe || "Não informado"}
                </Typography>
              </Paper>
            </Grid>

            {/* Data */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.info.main, 0.05),
                  border: `1px solid ${alpha(themeColors.info.main, 0.2)}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <CalendarMonth sx={{ color: themeColors.info.main, fontSize: 20 }} />
                  <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                    Data
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem" }}>
                  {formatDateBR(removal?.data)}
                </Typography>
              </Paper>
            </Grid>

            {/* Prefixo */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.success.main, 0.05),
                  border: `1px solid ${alpha(themeColors.success.main, 0.2)}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <DirectionsCar sx={{ color: themeColors.success.main, fontSize: 20 }} />
                  <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                    Prefixo
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem" }}>
                  {removal?.vehiclePrefix || "Não informado"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Coletores Section */}
          <Box
            sx={{
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.4s both, ${keyframes.slideInUp} 0.5s ease-out 0.4s both`,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                backgroundColor: alpha(themeColors.background.default, 0.5),
                border: `1px solid ${themeColors.divider}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: alpha(themeColors.secondary.main, 0.1),
                    color: themeColors.secondary.main,
                    width: 40,
                    height: 40,
                  }}
                >
                  <Group />
                </Avatar>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: themeColors.text.primary,
                    fontSize: "1rem",
                  }}
                >
                  Coletores
                </Typography>
              </Box>

              {Array.isArray(removal?.coletores) && removal.coletores.length > 0 ? (
                <Stack spacing={1}>
                  {removal.coletores.map((coletor, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        borderRadius: "8px",
                        backgroundColor: alpha(themeColors.background.paper, 0.5),
                        border: `1px solid ${themeColors.divider}`,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: alpha(themeColors.secondary.main, 0.1),
                          color: themeColors.secondary.main,
                          fontSize: "0.8rem",
                        }}
                      >
                        {typeof coletor === 'object' 
                          ? (coletor.nome?.charAt(0) || 'C') 
                          : (coletor?.charAt(0) || 'C')}
                      </Avatar>
                      <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                        {typeof coletor === 'object' ? coletor.nome : coletor}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ color: themeColors.text.secondary, fontStyle: "italic" }}>
                  Nenhum coletor registrado
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Additional Info */}
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: themeColors.divider,
              },
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.5s both`,
            }}
          >
            <Chip
              label="Informações Adicionais"
              size="small"
              sx={{
                backgroundColor: alpha(themeColors.info.main, 0.1),
                color: themeColors.info.main,
                fontWeight: 600,
                borderRadius: "12px",
              }}
            />
          </Divider>

          <Grid
            container
            spacing={2}
            sx={{
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.6s both, ${keyframes.slideInUp} 0.5s ease-out 0.6s both`,
            }}
          >
            {/* Garagem */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.background.default, 0.5),
                  border: `1px solid ${themeColors.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Warehouse sx={{ color: themeColors.text.secondary, fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                    Garagem
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 500, color: themeColors.text.primary }}>
                  {removal?.garage || "Não informado"}
                </Typography>
              </Paper>
            </Grid>

            {/* Rota */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.background.default, 0.5),
                  border: `1px solid ${themeColors.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Route sx={{ color: themeColors.text.secondary, fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                    Rota
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 500, color: themeColors.text.primary }}>
                  {removal?.rota || removal?.route || "Não informado"}
                </Typography>
              </Paper>
            </Grid>

            {/* Horário de Saída */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.background.default, 0.5),
                  border: `1px solid ${themeColors.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <AccessTime sx={{ color: themeColors.text.secondary, fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                    Horário de Saída
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 500, color: themeColors.text.primary }}>
                  {removal?.hora_saida_frota || removal?.departureTime || "Não informado"}
                </Typography>
              </Paper>
            </Grid>

            {/* Tipo de Veículo */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.background.default, 0.5),
                  border: `1px solid ${themeColors.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <DirectionsCar sx={{ color: themeColors.text.secondary, fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                    Tipo de Veículo
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 500, color: themeColors.text.primary }}>
                  {removal?.tipo_veiculo_selecionado || removal?.vehicle || "Não informado"}
                </Typography>
              </Paper>
            </Grid>

            {/* Bairro/Localização */}
            {removal?.bairro && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    backgroundColor: alpha(themeColors.background.default, 0.5),
                    border: `1px solid ${themeColors.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <LocationOn sx={{ color: themeColors.text.secondary, fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 600, color: themeColors.text.secondary, fontSize: "0.85rem" }}>
                      Bairro/Localização
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 500, color: themeColors.text.primary }}>
                    {removal?.bairro || removal?.location || "Não informado"}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
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
          onClick={handleCloseModal}
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
          Fechar
        </Button>
        <Button
          variant="contained"
          size="medium"
          startIcon={<Print />}
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
          Imprimir
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DetailModal
