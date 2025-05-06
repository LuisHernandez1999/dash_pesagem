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
  Grid,
  Paper,
  Divider,
  Chip,
  Stack,
  alpha,
  IconButton,
} from "@mui/material"
import {
  Close,
  Description,
  Person,
  CalendarMonth,
  AccessTime,
  Warehouse,
  Route,
  LocalShipping,
  Notes,
  Edit,
} from "@mui/icons-material"

// Constante para o domínio base da API
const API_BASE_URL = "http://127.0.0.1:8000"

// Função para obter a URL completa da imagem
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null
  // Se a imagem já começa com http, é uma URL completa
  if (imagePath.startsWith("http")) return imagePath
  // Caso contrário, adiciona o domínio base
  return `${API_BASE_URL}${imagePath}`
}

// Detail Modal Component
const DetailModal = ({ open, onClose, inspection, themeColors, keyframes }) => {
  if (!inspection) return null

  // Log para depuração
  console.log("Fotos no modal de detalhes:", inspection.photos)

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          background: `linear-gradient(135deg, ${themeColors.info.main} 0%, ${themeColors.info.light} 100%)`,
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
            <Description />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
            Detalhes da Averiguação
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

      <DialogContent sx={{ padding: "1.5rem", overflowY: "auto" }}>
        <Stack spacing={3}>
          {/* Inspector Section */}
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
                {inspection.inspector}
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
                <Person fontSize="small" sx={{ fontSize: 16, opacity: 0.7 }} /> Averiguador
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
                backgroundColor: alpha(themeColors.info.main, 0.1),
                color: themeColors.info.main,
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
            {/* Date */}
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
                  <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>Data</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem" }}>
                  {inspection.date}
                </Typography>
              </Paper>
            </Grid>

            {/* Time */}
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
                  <AccessTime sx={{ color: themeColors.success.main, fontSize: 20 }} />
                  <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>Hora</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem" }}>
                  {inspection.time}
                </Typography>
              </Paper>
            </Grid>

            {/* PA */}
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Warehouse sx={{ color: themeColors.warning.main, fontSize: 20 }} />
                  <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>PA</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem" }}>
                  {inspection.pa}
                </Typography>
              </Paper>
            </Grid>

            {/* Route */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  backgroundColor: alpha(themeColors.primary.main, 0.05),
                  border: `1px solid ${alpha(themeColors.primary.main, 0.2)}`,
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
                  <Route sx={{ color: themeColors.primary.main, fontSize: 20 }} />
                  <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.85rem" }}>Rota</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: themeColors.text.primary, fontSize: "1rem" }}>
                  {inspection.route}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Fleet Type */}
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
                  <LocalShipping />
                </Avatar>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: themeColors.text.primary,
                    fontSize: "1rem",
                  }}
                >
                  Tipo de Frota
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor: alpha(
                    inspection.fleetType === "Remoção"
                      ? themeColors.primary.main
                      : inspection.fleetType === "Varrição"
                        ? themeColors.success.main
                        : themeColors.warning.main,
                    0.1,
                  ),
                  border: `1px solid ${alpha(
                    inspection.fleetType === "Remoção"
                      ? themeColors.primary.main
                      : inspection.fleetType === "Varrição"
                        ? themeColors.success.main
                        : themeColors.warning.main,
                    0.2,
                  )}`,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color:
                      inspection.fleetType === "Remoção"
                        ? themeColors.primary.main
                        : inspection.fleetType === "Varrição"
                          ? themeColors.success.main
                          : themeColors.warning.main,
                    fontSize: "1.1rem",
                  }}
                >
                  {inspection.fleetType}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Photos Section */}
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: themeColors.divider,
              },
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.5s both`,
            }}
          >
            <Chip
              label="Fotos da Averiguação"
              size="small"
              sx={{
                backgroundColor: alpha(themeColors.secondary.main, 0.1),
                color: themeColors.secondary.main,
                fontWeight: 600,
                borderRadius: "12px",
              }}
            />
          </Divider>

          {/* Photos - Modificado para usar getFullImageUrl */}
          <Grid
            container
            spacing={2}
            sx={{
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.6s both, ${keyframes.slideInUp} 0.5s ease-out 0.6s both`,
            }}
          >
            {inspection.photos && inspection.photos.length > 0 ? (
              inspection.photos.map(
                (photo, index) =>
                  photo && (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: "16px",
                          overflow: "hidden",
                          height: "180px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={getFullImageUrl(photo)}
                          alt={`Foto ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            console.error("Erro ao carregar imagem no modal:", photo)
                            e.target.onerror = null
                            e.target.src = "/abstract-geometric-shapes.png"
                          }}
                        />
                      </Paper>
                    </Grid>
                  ),
              )
            ) : (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    borderRadius: "16px",
                    backgroundColor: alpha(themeColors.background.default, 0.5),
                    border: `1px dashed ${themeColors.divider}`,
                  }}
                >
                  <Typography sx={{ color: themeColors.text.secondary, fontStyle: "italic" }}>
                    Nenhuma foto disponível
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Observations */}
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: themeColors.divider,
              },
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.7s both`,
            }}
          >
            <Chip
              label="Observações"
              size="small"
              sx={{
                backgroundColor: alpha(themeColors.info.main, 0.1),
                color: themeColors.info.main,
                fontWeight: 600,
                borderRadius: "12px",
              }}
            />
          </Divider>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              backgroundColor: alpha(themeColors.background.default, 0.5),
              border: `1px solid ${themeColors.divider}`,
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.8s both, ${keyframes.slideInUp} 0.5s ease-out 0.8s both`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Notes sx={{ color: themeColors.info.main, mt: 0.5 }} />
              <Typography sx={{ color: themeColors.text.primary, lineHeight: 1.6 }}>
                {inspection.observations || "Nenhuma observação registrada."}
              </Typography>
            </Box>
          </Paper>
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
          Fechar
        </Button>
        <Button
          variant="contained"
          size="medium"
          startIcon={<Edit />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            backgroundColor: themeColors.info.main,
            boxShadow: `0 4px 12px ${alpha(themeColors.info.main, 0.2)}`,
            "&:hover": {
              backgroundColor: themeColors.info.dark,
              boxShadow: `0 6px 16px ${alpha(themeColors.info.main, 0.3)}`,
            },
          }}
        >
          Editar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DetailModal
