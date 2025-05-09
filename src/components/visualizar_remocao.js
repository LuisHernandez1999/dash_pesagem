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
  Divider,
  Chip,
  Paper,
  IconButton,
  Grid,
  alpha,
} from "@mui/material"
import { DirectionsCar, Close, Person, Group, Route, WbSunny, Print, Timeline, CheckCircle } from "@mui/icons-material"
import { Slide } from "@mui/material"

const DetailModal = ({ open, onClose, removal, onEdit, themeColors, keyframes }) => {
  if (!removal) return null

  // Format date in Brazilian format
  const formatDateBR = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return dateString
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
            Detalhes da Remoção
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                width: 48,
                height: 48,
                boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.15)}`,
                animation: `${keyframes.pulse} 3s infinite ease-in-out`,
              }}
            >
              <Person />
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: themeColors.text.primary,
                  fontSize: "1.1rem",
                  animation: `${keyframes.fadeIn} 0.5s ease-out`,
                }}
              >
                {removal.driver || "Não informado"}
              </Typography>
              <Typography
                sx={{
                  color: themeColors.text.secondary,
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  animation: `${keyframes.fadeIn} 0.5s ease-out 0.1s both`,
                }}
              >
                <Person fontSize="small" sx={{ fontSize: 14, opacity: 0.7 }} /> Motorista
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
              label="Equipe"
              size="small"
              sx={{
                backgroundColor: alpha(themeColors.primary.main, 0.1),
                color: themeColors.primary.main,
                fontWeight: 600,
                borderRadius: "12px",
              }}
            />
          </Divider>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.3s both, ${keyframes.slideInUp} 0.5s ease-out 0.3s both`,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: alpha(themeColors.success.main, 0.1),
                color: themeColors.success.main,
                fontWeight: 600,
                width: 48,
                height: 48,
                boxShadow: `0 4px 12px ${alpha(themeColors.success.main, 0.15)}`,
                animation: `${keyframes.pulse} 3s infinite ease-in-out`,
              }}
            >
              <Group />
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: themeColors.text.primary,
                  fontSize: "1.1rem",
                }}
              >
                {removal.collectors?.join(", ") || "Não informado"}
              </Typography>
              <Typography
                sx={{
                  color: themeColors.text.secondary,
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Group fontSize="small" sx={{ fontSize: 14, opacity: 0.7 }} /> Coletores
              </Typography>
            </Box>
          </Box>

          <Grid
            container
            spacing={2}
            sx={{
              mt: 1,
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.4s both, ${keyframes.slideInUp} 0.5s ease-out 0.4s both`,
            }}
          >
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.background.default, 0.5),
                  border: `1px solid ${themeColors.divider}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  height: "100%",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-4px)",
                    backgroundColor: alpha(themeColors.primary.main, 0.05),
                  },
                }}
              >
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: alpha(themeColors.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                    animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                  }}
                >
                  <DirectionsCar sx={{ color: themeColors.primary.main }} />
                </Box>
                <Typography
                  sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem", textAlign: "center" }}
                >
                  {removal.vehiclePrefix || "Não informado"}
                </Typography>
                <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.75rem", mt: 0.5 }}>
                  Prefixo
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.background.default, 0.5),
                  border: `1px solid ${themeColors.divider}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  height: "100%",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-4px)",
                    backgroundColor: alpha(themeColors.warning.main, 0.05),
                  },
                }}
              >
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: alpha(themeColors.warning.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                    animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                  }}
                >
                  <WbSunny sx={{ color: themeColors.warning.main }} />
                </Box>
                <Typography
                  sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem", textAlign: "center" }}
                >
                  {removal.team || "Não informado"}
                </Typography>
                <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.75rem", mt: 0.5 }}>Equipe</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.background.default, 0.5),
                  border: `1px solid ${themeColors.divider}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  height: "100%",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-4px)",
                    backgroundColor: alpha(themeColors.error.main, 0.05),
                  },
                }}
              >
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: alpha(themeColors.error.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                    animation: `${keyframes.pulse} 3s infinite ease-in-out`,
                  }}
                >
                  <Route sx={{ color: themeColors.error.main }} />
                </Box>
                <Typography
                  sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem", textAlign: "center" }}
                >
                  {removal.route || "Não informado"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.5s both, ${keyframes.slideInUp} 0.5s ease-out 0.5s both`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                p: 2,
                borderRadius: "16px",
                backgroundColor:
                  removal.status === "Finalizado"
                    ? alpha(themeColors.success.main, 0.1)
                    : alpha(themeColors.primary.main, 0.1),
                width: "100%",
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: themeColors.text.secondary }}>
                Status
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {removal.status === "Finalizado" ? (
                  <CheckCircle sx={{ color: themeColors.success.main }} />
                ) : (
                  <Timeline sx={{ color: themeColors.primary.main }} />
                )}
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: removal.status === "Finalizado" ? themeColors.success.main : themeColors.primary.main,
                    fontSize: "1.1rem",
                  }}
                >
                  {removal.status || "Não informado"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.6s both, ${keyframes.slideInUp} 0.5s ease-out 0.6s both`,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "16px",
                backgroundColor: alpha(themeColors.background.default, 0.5),
                border: `1px solid ${themeColors.divider}`,
                width: "100%",
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: themeColors.text.secondary, mb: 1 }}>
                Informações adicionais
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>Data:</Typography>
                <Typography sx={{ fontWeight: 500, color: themeColors.text.primary, fontSize: "0.85rem" }}>
                  {removal.date ? formatDateBR(removal.date) : "Não informado"}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
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
          Fechar
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
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
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default DetailModal
