"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, Box, Typography, alpha, IconButton, Chip } from "@mui/material"
import { LocalShipping, Construction, Agriculture, Refresh, TrendingUp, Assessment } from "@mui/icons-material"

const EquipmentTypeSummary = React.memo(({ equipmentData, loading = false, onRefresh, themeColors }) => {
  // Processar dados dos equipamentos por tipo
  const equipmentStats = useMemo(() => {
    if (!equipmentData?.todos || !Array.isArray(equipmentData.todos)) {
      return {
        carroceria: { count: 0, percentage: 0 },
        retroescavadeira: { count: 0, percentage: 0 },
        paCarregadeira: { count: 0, percentage: 0 },
        total: 0,
      }
    }

    const todos = equipmentData.todos
    const total = todos.length

    // Normalizar nomes para comparação
    const normalizeType = (type) => {
      return type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9]/g, "") // Remove caracteres especiais
    }

    // Contar equipamentos por tipo
    const counts = {
      carroceria: 0,
      retroescavadeira: 0,
      paCarregadeira: 0,
    }

    todos.forEach((equipment) => {
      const normalizedType = normalizeType(equipment.implemento || "")

      if (normalizedType.includes("carroceria") || normalizedType.includes("caminhao")) {
        counts.carroceria++
      } else if (normalizedType.includes("retroescavadeira") || normalizedType.includes("retro")) {
        counts.retroescavadeira++
      } else if (normalizedType.includes("pacarregadeira") || normalizedType.includes("carregadeira")) {
        counts.paCarregadeira++
      }
    })

    // Calcular percentuais
    const stats = {
      carroceria: {
        count: counts.carroceria,
        percentage: total > 0 ? (counts.carroceria / total) * 100 : 0,
      },
      retroescavadeira: {
        count: counts.retroescavadeira,
        percentage: total > 0 ? (counts.retroescavadeira / total) * 100 : 0,
      },
      paCarregadeira: {
        count: counts.paCarregadeira,
        percentage: total > 0 ? (counts.paCarregadeira / total) * 100 : 0,
      },
      total,
    }

    return stats
  }, [equipmentData])

  // Configurações dos tipos de equipamentos
  const equipmentTypes = useMemo(
    () => [
      {
        key: "carroceria",
        label: "Caminhão Carroceria",
        icon: LocalShipping,
        color: "#3B82F6",
        lightColor: "#60A5FA",
        darkColor: "#1D4ED8",
        gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
      },
      {
        key: "retroescavadeira",
        label: "Retroescavadeira",
        icon: Construction,
        color: "#06B6D4",
        lightColor: "#22D3EE",
        darkColor: "#0891B2",
        gradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)",
      },
      {
        key: "paCarregadeira",
        label: "Pá Carregadeira",
        icon: Agriculture,
        color: "#8B5CF6",
        lightColor: "#A78BFA",
        darkColor: "#7C3AED",
        gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
      },
    ],
    [],
  )

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          mb: 4,
          border: "1px solid rgba(0, 0, 0, 0.05)",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
        }}
      >
        <CardContent sx={{ padding: "2rem", textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            Carregando estatísticas de equipamentos...
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-2px)",
        },
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        mb: 4,
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${alpha("#3B82F6", 0.1)}, ${alpha("#8B5CF6", 0.05)})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${alpha("#3B82F6", 0.15)}`,
              }}
            >
              <Assessment
                sx={{
                  color: "#3B82F6",
                  fontSize: "1.5rem",
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "#111827",
                  letterSpacing: "-0.025em",
                  mb: 0.5,
                }}
              >
                Distribuição por Tipo
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUp
                  sx={{
                    fontSize: "0.9rem",
                    color: "#10B981",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "#6B7280",
                    fontWeight: 500,
                  }}
                >
                  Análise detalhada por categoria de equipamento
                </Typography>
              </Box>
            </Box>
          </Box>
        }
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`${equipmentStats.total} Total`}
              size="small"
              sx={{
                backgroundColor: alpha("#10B981", 0.1),
                color: "#10B981",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "24px",
              }}
            />
            {onRefresh && (
              <IconButton
                sx={{
                  color: "#6B7280",
                  background: alpha("#3B82F6", 0.06),
                  borderRadius: "10px",
                  width: "36px",
                  height: "36px",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  transition: "all 0.1s ease",
                  "&:hover": {
                    color: "white",
                    background: `linear-gradient(135deg, #3B82F6, #8B5CF6)`,
                    transform: "rotate(180deg)",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  },
                }}
                onClick={onRefresh}
              >
                <Refresh sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            )}
          </Box>
        }
        sx={{
          padding: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          "& .MuiCardHeader-action": {
            margin: 0,
          },
        }}
      />

      <CardContent sx={{ padding: "1.5rem" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {equipmentTypes.map((type) => {
            const stats = equipmentStats[type.key]
            const IconComponent = type.icon

            return (
              <Box
                key={type.key}
                sx={{
                  position: "relative",
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${alpha(type.color, 0.02)}, ${alpha(type.lightColor, 0.01)})`,
                  border: `1px solid ${alpha(type.color, 0.1)}`,
                  padding: "1.5rem",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: `0 12px 40px ${alpha(type.color, 0.15)}`,
                    background: `linear-gradient(135deg, ${alpha(type.color, 0.05)}, ${alpha(type.lightColor, 0.02)})`,
                    "& .equipment-icon": {
                      transform: "scale(1.1) rotate(5deg)",
                    },
                    "& .progress-bar": {
                      transform: "scaleX(1.02)",
                    },
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: type.gradient,
                    borderRadius: "16px 16px 0 0",
                  },
                }}
              >
                {/* Ícone e Título */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    className="equipment-icon"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: type.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 12px ${alpha(type.color, 0.3)}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <IconComponent
                      sx={{
                        color: "white",
                        fontSize: "1.25rem",
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#374151",
                        lineHeight: 1.2,
                      }}
                    >
                      {type.label}
                    </Typography>
                  </Box>
                </Box>

                {/* Número Principal */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "2.5rem",
                      color: type.color,
                      lineHeight: 1,
                      background: type.gradient,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: `0 2px 4px ${alpha(type.color, 0.2)}`,
                    }}
                  >
                    {stats.count}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#6B7280",
                      fontWeight: 500,
                      mt: 0.5,
                    }}
                  >
                    equipamentos
                  </Typography>
                </Box>

                {/* Barra de Progresso */}
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        fontWeight: 500,
                      }}
                    >
                      Participação
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: type.color,
                      }}
                    >
                      {stats.percentage.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: "relative",
                      height: "6px",
                      borderRadius: "3px",
                      backgroundColor: alpha(type.color, 0.1),
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      className="progress-bar"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: `${stats.percentage}%`,
                        background: type.gradient,
                        borderRadius: "3px",
                        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: `0 2px 8px ${alpha(type.color, 0.3)}`,
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "50%",
                          background: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "3px 3px 0 0",
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Status Badge */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Chip
                    label={stats.count > 0 ? "Disponível" : "Indisponível"}
                    size="small"
                    sx={{
                      backgroundColor: stats.count > 0 ? alpha("#10B981", 0.1) : alpha("#EF4444", 0.1),
                      color: stats.count > 0 ? "#10B981" : "#EF4444",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      height: "20px",
                      border: `1px solid ${stats.count > 0 ? alpha("#10B981", 0.2) : alpha("#EF4444", 0.2)}`,
                    }}
                  />
                </Box>
              </Box>
            )
          })}
        </Box>

        {/* Resumo Total */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: "1px solid rgba(0, 0, 0, 0.05)",
            borderRadius: "12px",
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))`,
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#6B7280",
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            Total de equipamentos cadastrados
          </Typography>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {equipmentStats.total}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
})

EquipmentTypeSummary.displayName = "EquipmentTypeSummary"

export default EquipmentTypeSummary
