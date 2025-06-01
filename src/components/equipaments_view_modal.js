"use client"

import { Dialog, DialogContent, DialogTitle, Box, Typography, IconButton, Chip, alpha, Fade } from "@mui/material"
import { Close, DirectionsCar, CheckCircle, Cancel, Build, Visibility, ContentCopy } from "@mui/icons-material"
import { useState } from "react"

const EquipmentViewModal = ({ open, onClose, equipment, themeColors }) => {
  const [copied, setCopied] = useState("")

  if (!equipment) return null

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ativo":
        return <CheckCircle sx={{ color: "#10b981", fontSize: 22 }} />
      case "Inativo":
        return <Cancel sx={{ color: "#ef4444", fontSize: 22 }} />
      case "Manutenção":
        return <Build sx={{ color: "#f59e0b", fontSize: 22 }} />
      default:
        return <DirectionsCar sx={{ color: "#6b7280", fontSize: 22 }} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Ativo":
        return "#10b981"
      case "Inativo":
        return "#ef4444"
      case "Manutenção":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const getStatusGradient = (status) => {
    switch (status) {
      case "Ativo":
        return "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      case "Inativo":
        return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      case "Manutenção":
        return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      default:
        return "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
    }
  }

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(""), 2000)
  }

  const statusColor = getStatusColor(equipment.status)
  const statusGradient = getStatusGradient(equipment.status)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          border: `1px solid ${alpha(statusColor, 0.2)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: statusGradient,
          color: "#ffffff",
          padding: "24px 32px",
          position: "relative",
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
                background: alpha("#ffffff", 0.2),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha("#ffffff", 0.3)}`,
              }}
            >
              <Visibility sx={{ color: "#ffffff", fontSize: 24 }} />
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
                Detalhes do Equipamento
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: alpha("#ffffff", 0.9),
                  fontSize: "0.9rem",
                }}
              >
                Informações completas
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#ffffff",
              background: alpha("#ffffff", 0.15),
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha("#ffffff", 0.2)}`,
              width: 44,
              height: 44,
              "&:hover": {
                background: alpha("#ffffff", 0.25),
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: "32px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Prefixo */}
          <Fade in={open} timeout={600}>
            <Box
              onClick={() => handleCopy(equipment.prefix, "prefix")}
              sx={{
                padding: "20px",
                background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "16px",
                border: `2px solid ${alpha(statusColor, 0.1)}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: statusColor,
                  boxShadow: `0 12px 24px ${alpha(statusColor, 0.15)}`,
                  "& .copy-btn": {
                    opacity: 1,
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Prefixo
                </Typography>
                <IconButton
                  className="copy-btn"
                  size="small"
                  sx={{
                    opacity: copied === "prefix" ? 1 : 0,
                    color: statusColor,
                    backgroundColor: alpha(statusColor, 0.1),
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(statusColor, 0.2),
                    },
                  }}
                >
                  <ContentCopy sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#1e293b",
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  background: `linear-gradient(135deg, #1e293b 0%, ${statusColor} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {equipment.prefix}
              </Typography>
              {copied === "prefix" && (
                <Typography
                  variant="caption"
                  sx={{
                    color: statusColor,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    mt: 1,
                    display: "block",
                  }}
                >
                  ✓ Copiado!
                </Typography>
              )}
            </Box>
          </Fade>

          {/* Implemento */}
          <Fade in={open} timeout={800}>
            <Box
              onClick={() => handleCopy(equipment.type, "type")}
              sx={{
                padding: "20px",
                background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "16px",
                border: `2px solid ${alpha(statusColor, 0.1)}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: statusColor,
                  boxShadow: `0 12px 24px ${alpha(statusColor, 0.15)}`,
                  "& .copy-btn": {
                    opacity: 1,
                  },
                  "& .equipment-icon": {
                    color: statusColor,
                    transform: "scale(1.1)",
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Implemento
                </Typography>
                <IconButton
                  className="copy-btn"
                  size="small"
                  sx={{
                    opacity: copied === "type" ? 1 : 0,
                    color: statusColor,
                    backgroundColor: alpha(statusColor, 0.1),
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(statusColor, 0.2),
                    },
                  }}
                >
                  <ContentCopy sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${alpha(statusColor, 0.1)}, ${alpha(statusColor, 0.05)})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${alpha(statusColor, 0.2)}`,
                  }}
                >
                  <DirectionsCar
                    className="equipment-icon"
                    sx={{
                      color: "#64748b",
                      fontSize: 22,
                      transition: "all 0.2s ease",
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 600,
                      fontSize: "1.2rem",
                    }}
                  >
                    {equipment.type}
                  </Typography>
                  {copied === "type" && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: statusColor,
                        fontSize: "0.7rem",
                        fontWeight: 500,
                      }}
                    >
                      ✓ Copiado!
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Fade>

          {/* Status */}
          <Fade in={open} timeout={1000}>
            <Box
              onClick={() => handleCopy(equipment.status, "status")}
              sx={{
                padding: "20px",
                background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "16px",
                border: `2px solid ${alpha(statusColor, 0.2)}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: statusColor,
                  boxShadow: `0 16px 32px ${alpha(statusColor, 0.2)}`,
                  "& .copy-btn": {
                    opacity: 1,
                  },
                  "& .status-chip": {
                    transform: "scale(1.05)",
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Status Atual
                </Typography>
                <IconButton
                  className="copy-btn"
                  size="small"
                  sx={{
                    opacity: copied === "status" ? 1 : 0,
                    color: statusColor,
                    backgroundColor: alpha(statusColor, 0.1),
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(statusColor, 0.2),
                    },
                  }}
                >
                  <ContentCopy sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {getStatusIcon(equipment.status)}
                <Chip
                  className="status-chip"
                  label={equipment.status}
                  sx={{
                    background: statusGradient,
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    borderRadius: "10px",
                    height: "36px",
                    px: 2,
                    border: "none",
                    boxShadow: `0 4px 12px ${alpha(statusColor, 0.2)}`,
                    transition: "all 0.2s ease",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
              {copied === "status" && (
                <Typography
                  variant="caption"
                  sx={{
                    color: statusColor,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    mt: 1,
                    display: "block",
                  }}
                >
                  ✓ Status copiado!
                </Typography>
              )}
            </Box>
          </Fade>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EquipmentViewModal
