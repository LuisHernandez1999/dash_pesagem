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
  Card,
  CardContent,
  Tooltip,
  Badge,
  LinearProgress,
  Modal,
  Backdrop,
  Fade,
  Zoom,
} from "@mui/material"
import {
  Close,
  Description,
  Person,
  AccessTime,
  Warehouse,
  Route,
  LocalShipping,
  Notes,
  Edit,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  Speed,
  ElectricBolt,
  DirectionsCar,
  Security,
  Assignment,
  Engineering,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  DownloadForOffline,
  ArrowBack,
  ArrowForward,
  FullscreenExit,
} from "@mui/icons-material"
import { useState } from "react"

// Constante para o domínio base da API
const API_BASE_URL = "http://127.0.0.1:8000"

// Função para obter a URL completa da imagem
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null

  // Se a imagem já começa com http, é uma URL completa
  if (typeof imagePath === "string" && imagePath.startsWith("http")) return imagePath

  // Verificar se é uma string base64
  if (typeof imagePath === "string" && imagePath.startsWith("data:image")) {
    return imagePath
  }

  // Verificar se é uma string base64 sem o prefixo data:image
  if (
    typeof imagePath === "string" &&
    (imagePath.startsWith("/9j/") || imagePath.startsWith("iVBOR") || imagePath.startsWith("/4AA"))
  ) {
    return `data:image/jpeg;base64,${imagePath}`
  }

  // Verificar se o caminho já inclui /media/
  if (typeof imagePath === "string" && imagePath.startsWith("/media/")) {
    // Se o caminho tem duplicação /media/media/, corrigir
    if (imagePath.startsWith("/media/media/")) {
      const fixedPath = imagePath.replace("/media/media/", "/media/")
      return `${API_BASE_URL}${fixedPath}`
    }
    // Caso contrário, apenas adicionar o domínio base
    return `${API_BASE_URL}${imagePath}`
  }

  // Para outros caminhos, adicionar o domínio base e /media/
  if (typeof imagePath === "string") {
    return `${API_BASE_URL}/media/${imagePath}`
  }

  return "/placeholder.svg?key=image-placeholder"
}

// Componente para exibir status com ícone e cor
const StatusChip = ({ label, status }) => {
  let color = "default"
  let backgroundColor = "rgba(0, 0, 0, 0.08)"
  let textColor = "#666"
  let IconComponent = Info

  if (status === "conforme") {
    color = "success"
    backgroundColor = "rgba(46, 125, 50, 0.1)"
    textColor = "#2e7d32"
    IconComponent = CheckCircle
  } else if (status === "não conforme" || status === "inadequado") {
    color = "error"
    backgroundColor = "rgba(211, 47, 47, 0.1)"
    textColor = "#d32f2f"
    IconComponent = Cancel
  } else if (status === "médio" || status === "adequado") {
    color = "info"
    backgroundColor = "rgba(2, 136, 209, 0.1)"
    textColor = "#0288d1"
    IconComponent = Info
  } else if (status === "baixo") {
    color = "warning"
    backgroundColor = "rgba(237, 108, 2, 0.1)"
    textColor = "#ed6c02"
    IconComponent = Warning
  }

  return (
    <Chip
      icon={<IconComponent style={{ fontSize: "0.9rem" }} />}
      label={label}
      size="small"
      sx={{
        backgroundColor,
        color: textColor,
        fontWeight: 500,
        borderRadius: "8px",
        "& .MuiChip-icon": {
          color: textColor,
        },
      }}
    />
  )
}

// Componente para exibir informações em cards
const InfoCard = ({ title, value, icon: Icon, color, animation }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "12px",
        backgroundColor: alpha(color.main, 0.08),
        border: `1px solid ${alpha(color.main, 0.2)}`,
        height: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 8px 16px ${alpha(color.main, 0.15)}`,
          backgroundColor: alpha(color.main, 0.12),
        },
        animation: animation,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: alpha(color.main, 0.2),
              color: color.main,
              mr: 1.5,
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: alpha(color.main, 0.9),
              fontSize: "0.85rem",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: "text.primary",
            fontSize: "1rem",
            ml: 0.5,
          }}
        >
          {value || "Não informado"}
        </Typography>
      </CardContent>
    </Card>
  )
}

// Componente para exibir imagens em galeria com visualização em tela cheia
const ImageGallery = ({ images = [], themeColors, keyframes }) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)

  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          borderRadius: "12px",
          backgroundColor: alpha(themeColors.background.default, 0.5),
          border: `1px dashed ${themeColors.divider}`,
          minHeight: "150px",
        }}
      >
        <ImageIcon sx={{ fontSize: 40, color: alpha(themeColors.text.secondary, 0.5), mb: 1 }} />
        <Typography sx={{ color: themeColors.text.secondary, fontStyle: "italic" }}>Nenhuma foto disponível</Typography>
      </Box>
    )
  }

  // Filtrar imagens nulas ou vazias
  const validImages = images.filter((img) => img !== null && img !== "")

  if (validImages.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          borderRadius: "12px",
          backgroundColor: alpha(themeColors.background.default, 0.5),
          border: `1px dashed ${themeColors.divider}`,
          minHeight: "150px",
        }}
      >
        <ImageIcon sx={{ fontSize: 40, color: alpha(themeColors.text.secondary, 0.5), mb: 1 }} />
        <Typography sx={{ color: themeColors.text.secondary, fontStyle: "italic" }}>Nenhuma foto disponível</Typography>
      </Box>
    )
  }

  const handleOpenFullscreen = (index) => {
    setSelectedImageIndex(index)
    setFullscreenOpen(true)
    setZoomLevel(1) // Reset zoom level when opening
  }

  const handleCloseFullscreen = () => {
    setFullscreenOpen(false)
    setZoomLevel(1) // Reset zoom level when closing
  }

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1))
    setZoomLevel(1) // Reset zoom level when changing image
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0))
    setZoomLevel(1) // Reset zoom level when changing image
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5))
  }

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      handlePrevImage()
    } else if (event.key === "ArrowRight") {
      handleNextImage()
    } else if (event.key === "Escape") {
      handleCloseFullscreen()
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        {validImages.map((img, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                height: "180px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
                position: "relative",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.02)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                  "& .image-overlay": {
                    opacity: 1,
                  },
                },
                animation: `${keyframes.fadeIn} 0.5s ease-out ${0.1 * index}s both, ${keyframes.slideInUp} 0.5s ease-out ${
                  0.1 * index
                }s both`,
              }}
              onClick={() => handleOpenFullscreen(index)}
            >
              <Box
                component="img"
                src={getFullImageUrl(img)}
                alt={`Foto ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  console.error("Erro ao carregar imagem no modal:", img)
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?key=error-img"
                }}
              />
              <Box
                className="image-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <IconButton
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  <ZoomIn />
                </IconButton>
              </Box>
              <Badge
                badgeContent={index + 1}
                color="primary"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    height: "20px",
                    minWidth: "20px",
                    borderRadius: "10px",
                  },
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal de visualização em tela cheia */}
      <Modal
        open={fullscreenOpen}
        onClose={handleCloseFullscreen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(5px)",
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <Fade in={fullscreenOpen}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
            }}
          >
            {/* Barra superior */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                zIndex: 10,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Imagem {selectedImageIndex + 1} de {validImages.length}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Diminuir zoom">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleZoomOut()
                    }}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                    }}
                  >
                    <ZoomOut />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Aumentar zoom">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleZoomIn()
                    }}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                    }}
                  >
                    <ZoomIn />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Baixar imagem">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      // Lógica para download da imagem
                      const link = document.createElement("a")
                      link.href = getFullImageUrl(validImages[selectedImageIndex])
                      link.download = `averiguacao-imagem-${selectedImageIndex + 1}.jpg`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                    }}
                  >
                    <DownloadForOffline />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Fechar">
                  <IconButton
                    onClick={handleCloseFullscreen}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                    }}
                  >
                    <FullscreenExit />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Imagem central */}
            <Zoom in={fullscreenOpen} style={{ transitionDelay: fullscreenOpen ? "100ms" : "0ms" }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={getFullImageUrl(validImages[selectedImageIndex])}
                  alt={`Foto ${selectedImageIndex + 1}`}
                  sx={{
                    maxWidth: "90%",
                    maxHeight: "80%",
                    objectFit: "contain",
                    transform: `scale(${zoomLevel})`,
                    transition: "transform 0.3s ease",
                    cursor: "grab",
                    "&:active": {
                      cursor: "grabbing",
                    },
                  }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?key=error-fullscreen"
                  }}
                />
              </Box>
            </Zoom>

            {/* Botões de navegação */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                handlePrevImage()
              }}
              sx={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
                width: "48px",
                height: "48px",
              }}
            >
              <ArrowBack />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                handleNextImage()
              }}
              sx={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
                width: "48px",
                height: "48px",
              }}
            >
              <ArrowForward />
            </IconButton>

            {/* Miniaturas na parte inferior */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                padding: "16px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                overflowX: "auto",
                gap: 2,
              }}
            >
              {validImages.map((img, index) => (
                <Box
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageIndex(index)
                    setZoomLevel(1)
                  }}
                  sx={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border:
                      index === selectedImageIndex ? `3px solid ${themeColors.primary.main}` : "3px solid transparent",
                    opacity: index === selectedImageIndex ? 1 : 0.6,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 1,
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={getFullImageUrl(img)}
                    alt={`Miniatura ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?key=thumbnail-error"
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

// Detail Modal Component
const DetailModal = ({ open, onClose, inspection, themeColors, keyframes }) => {
  if (!inspection) return null

  // Obter os dados originais da API a partir do objeto inspection
  const originalData = inspection.originalData || {}

  // Log para depuração
  console.log("Dados da averiguação no modal:", originalData)

  // Determinar o tipo de serviço
  let tipoServico = originalData.tipoServico
  if (tipoServico === "1" || tipoServico === 1) {
    tipoServico = "Seletiva"
  } else if (tipoServico === "2" || tipoServico === 2) {
    tipoServico = "Remoção"
  } else if (tipoServico === "3" || tipoServico === 3) {
    tipoServico = "Varrição"
  }

  // Determinar a cor do tipo de serviço
  let servicoColor
  if (tipoServico === "Remoção") {
    servicoColor = themeColors.primary
  } else if (tipoServico === "Varrição") {
    servicoColor = themeColors.success
  } else {
    servicoColor = themeColors.warning
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
          maxWidth: "900px",
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
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
              Detalhes da Averiguação #{originalData.id || inspection.id}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 400 }}>
              Registrado em {inspection.date || new Date().toLocaleDateString()}
            </Typography>
          </Box>
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

      <LinearProgress
        variant="indeterminate"
        sx={{
          height: "2px",
          backgroundColor: alpha(themeColors.info.main, 0.2),
          "& .MuiLinearProgress-bar": {
            backgroundColor: themeColors.info.main,
          },
        }}
      />

      <DialogContent sx={{ padding: "1.5rem", overflowY: "auto" }}>
        <Stack spacing={3}>
          {/* Cabeçalho com informações do averiguador e tipo de serviço */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
              animation: `${keyframes.fadeIn} 0.5s ease-out, ${keyframes.slideInUp} 0.5s ease-out`,
              backgroundColor: alpha(themeColors.background.default, 0.5),
              borderRadius: "16px",
              padding: "1rem",
              border: `1px solid ${themeColors.divider}`,
            }}
          >
            {/* Averiguador */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                  {originalData.averiguador || inspection.inspector || "Não informado"}
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

            {/* Tipo de Serviço */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", md: "flex-end" },
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: themeColors.text.secondary,
                  fontWeight: 500,
                }}
              >
                Tipo de Serviço
              </Typography>
              <Chip
                label={tipoServico || "Não especificado"}
                sx={{
                  backgroundColor: alpha(servicoColor.main, 0.1),
                  color: servicoColor.main,
                  fontWeight: 600,
                  borderRadius: "8px",
                  padding: "0.25rem 0.5rem",
                  height: "auto",
                  "& .MuiChip-label": {
                    padding: "0.25rem 0.5rem",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Informações Principais em Cards */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                mb: 2,
                display: "flex",
                alignItems: "center",
                color: themeColors.text.primary,
                "&::before": {
                  content: '""',
                  display: "block",
                  width: "4px",
                  height: "20px",
                  backgroundColor: themeColors.info.main,
                  borderRadius: "2px",
                  marginRight: "0.75rem",
                },
              }}
            >
              Informações Principais
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Hora da Averiguação"
                  value={originalData.horaAveriguacao || inspection.time}
                  icon={AccessTime}
                  color={themeColors.info}
                  animation={`${keyframes.fadeIn} 0.5s ease-out 0.1s both, ${keyframes.slideInUp} 0.5s ease-out 0.1s both`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Hora de Início"
                  value={originalData.horaInicio}
                  icon={ElectricBolt}
                  color={themeColors.success}
                  animation={`${keyframes.fadeIn} 0.5s ease-out 0.2s both, ${keyframes.slideInUp} 0.5s ease-out 0.2s both`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Hora de Encerramento"
                  value={originalData.horaEncerramento}
                  icon={AccessTime}
                  color={themeColors.error}
                  animation={`${keyframes.fadeIn} 0.5s ease-out 0.3s both, ${keyframes.slideInUp} 0.5s ease-out 0.3s both`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="PA / Garagem"
                  value={originalData.garagem || inspection.pa}
                  icon={Warehouse}
                  color={themeColors.warning}
                  animation={`${keyframes.fadeIn} 0.5s ease-out 0.4s both, ${keyframes.slideInUp} 0.5s ease-out 0.4s both`}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Detalhes da Rota */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                mb: 2,
                display: "flex",
                alignItems: "center",
                color: themeColors.text.primary,
                "&::before": {
                  content: '""',
                  display: "block",
                  width: "4px",
                  height: "20px",
                  backgroundColor: themeColors.primary.main,
                  borderRadius: "2px",
                  marginRight: "0.75rem",
                },
              }}
            >
              Detalhes da Rota
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Rota"
                  value={originalData.rota || inspection.route}
                  icon={Route}
                  color={themeColors.primary}
                  animation={`${keyframes.fadeIn} 0.5s ease-out 0.5s both, ${keyframes.slideInUp} 0.5s ease-out 0.5s both`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Velocidade de Coleta"
                  value={originalData.velocidadeColeta}
                  icon={Speed}
                  color={themeColors.secondary}
                  animation={`${keyframes.fadeIn} 0.5s ease-out 0.6s both, ${keyframes.slideInUp} 0.5s ease-out 0.6s both`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Largura da Rua"
                  value={originalData.larguraRua}
                  icon={DirectionsCar}
                  color={themeColors.info}
                  animation={`${keyframes.fadeIn} 0.5s ease-out 0.7s both, ${keyframes.slideInUp} 0.5s ease-out 0.7s both`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Altura dos Fios"
                  value={originalData.alturaFios}
                  icon={ElectricBolt}
                  color={themeColors.warning}
                  animation={`${keyframes.fadeIn} 0.5s ease-out 0.8s both, ${keyframes.slideInUp} 0.5s ease-out 0.8s both`}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Conformidade */}
          <Box
            sx={{
              mt: 2,
              animation: `${keyframes.fadeIn} 0.5s ease-out 0.9s both, ${keyframes.slideInUp} 0.5s ease-out 0.9s both`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                mb: 2,
                display: "flex",
                alignItems: "center",
                color: themeColors.text.primary,
                "&::before": {
                  content: '""',
                  display: "block",
                  width: "4px",
                  height: "20px",
                  backgroundColor: themeColors.success.main,
                  borderRadius: "2px",
                  marginRight: "0.75rem",
                },
              }}
            >
              Conformidade e Equipamentos
            </Typography>

            <Card
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: `1px solid ${themeColors.divider}`,
                backgroundColor: alpha(themeColors.background.default, 0.5),
              }}
            >
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor: alpha(themeColors.background.paper, 0.7),
                        border: `1px solid ${themeColors.divider}`,
                        height: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: alpha(themeColors.success.main, 0.1),
                            color: themeColors.success.main,
                          }}
                        >
                          <Security fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle2">Equipamento de Proteção</Typography>
                      </Box>
                      <StatusChip
                        label={originalData.equipamentoProtecao || "Não informado"}
                        status={originalData.equipamentoProtecao}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor: alpha(themeColors.background.paper, 0.7),
                        border: `1px solid ${themeColors.divider}`,
                        height: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: alpha(themeColors.primary.main, 0.1),
                            color: themeColors.primary.main,
                          }}
                        >
                          <Person fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle2">Uniforme Completo</Typography>
                      </Box>
                      <StatusChip
                        label={originalData.uniformeCompleto || "Não informado"}
                        status={originalData.uniformeCompleto}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor: alpha(themeColors.background.paper, 0.7),
                        border: `1px solid ${themeColors.divider}`,
                        height: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: alpha(themeColors.info.main, 0.1),
                            color: themeColors.info.main,
                          }}
                        >
                          <Assignment fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle2">Documentação do Veículo</Typography>
                      </Box>
                      <StatusChip
                        label={originalData.documentacaoVeiculo || "Não informado"}
                        status={originalData.documentacaoVeiculo}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: alpha(themeColors.background.paper, 0.7),
                          border: `1px solid ${themeColors.divider}`,
                          height: "100%",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: alpha(themeColors.warning.main, 0.1),
                              color: themeColors.warning.main,
                            }}
                          >
                            <LocalShipping fontSize="small" />
                          </Avatar>
                          <Typography variant="subtitle2">Caminhão Usado</Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: themeColors.text.primary,
                            fontSize: "1rem",
                            ml: 0.5,
                          }}
                        >
                          {originalData.caminhaoUsado || "Não informado"}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: alpha(themeColors.background.paper, 0.7),
                          border: `1px solid ${themeColors.divider}`,
                          height: "100%",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: alpha(themeColors.secondary.main, 0.1),
                              color: themeColors.secondary.main,
                            }}
                          >
                            <Engineering fontSize="small" />
                          </Avatar>
                          <Typography variant="subtitle2">Quantidade de Viagens</Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: themeColors.text.primary,
                            fontSize: "1rem",
                            ml: 0.5,
                          }}
                        >
                          {originalData.quantidadeViagens || "0"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Inconformidades e Ações Corretivas */}
          <Box
            sx={{
              mt: 2,
              animation: `${keyframes.fadeIn} 0.5s ease-out 1s both, ${keyframes.slideInUp} 0.5s ease-out 1s both`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                mb: 2,
                display: "flex",
                alignItems: "center",
                color: themeColors.text.primary,
                "&::before": {
                  content: '""',
                  display: "block",
                  width: "4px",
                  height: "20px",
                  backgroundColor: themeColors.error.main,
                  borderRadius: "2px",
                  marginRight: "0.75rem",
                },
              }}
            >
              Inconformidades e Ações Corretivas
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: `1px solid ${alpha(themeColors.error.main, 0.3)}`,
                    backgroundColor: alpha(themeColors.error.main, 0.05),
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: alpha(themeColors.error.main, 0.2),
                          color: themeColors.error.main,
                        }}
                      >
                        <Warning fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeColors.error.main }}>
                        Inconformidades
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: themeColors.text.primary,
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {originalData.inconformidades
                        ? originalData.inconformidades
                        : "Nenhuma inconformidade registrada."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: `1px solid ${alpha(themeColors.success.main, 0.3)}`,
                    backgroundColor: alpha(themeColors.success.main, 0.05),
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: alpha(themeColors.success.main, 0.2),
                          color: themeColors.success.main,
                        }}
                      >
                        <CheckCircle fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeColors.success.main }}>
                        Ações Corretivas
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: themeColors.text.primary,
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {originalData.acoesCorretivas
                        ? originalData.acoesCorretivas
                        : "Nenhuma ação corretiva registrada."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Observações */}
          <Box
            sx={{
              mt: 2,
              animation: `${keyframes.fadeIn} 0.5s ease-out 1.1s both, ${keyframes.slideInUp} 0.5s ease-out 1.1s both`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                mb: 2,
                display: "flex",
                alignItems: "center",
                color: themeColors.text.primary,
                "&::before": {
                  content: '""',
                  display: "block",
                  width: "4px",
                  height: "20px",
                  backgroundColor: themeColors.info.main,
                  borderRadius: "2px",
                  marginRight: "0.75rem",
                },
              }}
            >
              Observações
            </Typography>

            <Card
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: `1px solid ${themeColors.divider}`,
                backgroundColor: alpha(themeColors.background.paper, 0.7),
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: alpha(themeColors.info.main, 0.1),
                      color: themeColors.info.main,
                    }}
                  >
                    <Notes fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle1">Observações da Operação</Typography>
                </Box>
                <Typography
                  sx={{
                    color: themeColors.text.primary,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                    p: 2,
                    borderRadius: "8px",
                    backgroundColor: alpha(themeColors.background.default, 0.5),
                  }}
                >
                  {originalData.observacoesOperacao
                    ? originalData.observacoesOperacao
                    : "Nenhuma observação registrada."}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Fotos */}
          <Box
            sx={{
              mt: 2,
              animation: `${keyframes.fadeIn} 0.5s ease-out 1.2s both, ${keyframes.slideInUp} 0.5s ease-out 1.2s both`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                mb: 2,
                display: "flex",
                alignItems: "center",
                color: themeColors.text.primary,
                "&::before": {
                  content: '""',
                  display: "block",
                  width: "4px",
                  height: "20px",
                  backgroundColor: themeColors.secondary.main,
                  borderRadius: "2px",
                  marginRight: "0.75rem",
                },
              }}
            >
              Fotos da Averiguação
            </Typography>

            <ImageGallery
              images={originalData.imagens || inspection.photos}
              themeColors={themeColors}
              keyframes={keyframes}
            />
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          padding: "1rem 1.5rem",
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
