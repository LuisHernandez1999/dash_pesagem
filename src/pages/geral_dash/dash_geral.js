"use client"
import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Box,
  Container,
  alpha,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material"
import {
  LocalShipping,
  RecyclingOutlined,
  Refresh,
  Assessment,
  TrendingUp,
  DeleteSweepOutlined,
  Build,
  HomeOutlined,
  PlayArrow,
  CheckCircle,
  Person,
  Group,
  Warning,
} from "@mui/icons-material"
import { createTheme } from "@mui/material/styles"
import { getDashGeral } from "../../service/geral"

// No início do arquivo, adicionar breakpoint customizado
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      "2xl": 1920, // Para TVs
    },
  },
})

// Cores do tema
const themeColors = {
  primary: {
    main: "#2563eb",
    light: "#3b82f6",
    dark: "#1d4ed8",
  },
  secondary: {
    main: "#64748b",
    light: "#94a3b8",
    dark: "#475569",
  },
  success: {
    main: "#059669",
    light: "#10b981",
    dark: "#047857",
  },
  warning: {
    main: "#d97706",
    light: "#f59e0b",
    dark: "#b45309",
  },
  info: {
    main: "#0284c7",
    light: "#0ea5e9",
    dark: "#0369a1",
  },
  purple: {
    main: "#7c3aed",
    light: "#8b5cf6",
    dark: "#6d28d9",
  },
  green: {
    main: "#374151",
    light: "#4b5563",
    dark: "#1f2937",
  },
}

// Cores dos gráficos
const chartColors = ["#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#22d3ee", "#fb7185", "#a3e635", "#fb923c"]

// Componente para Solturas em Andamento - REDESENHADO PROFISSIONAL
const SolturasAndamentoCard = ({ title, data, height = 400 }) => {
  console.log("SolturasAndamentoCard recebeu dados:", data)
  const total = data && Array.isArray(data) ? data.reduce((sum, entry) => sum + entry.value, 0) : 0

  const ServiceItem = ({ service, value, icon: Icon, color }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 3,
        borderRadius: "20px",
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        border: `1px solid #e2e8f0`,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: "90px",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px) scale(1.02)",
          border: `1px solid #cbd5e1`,
          background: `linear-gradient(135deg, ${alpha(color, 0.03)}, ${alpha(color, 0.08)})`,
          boxShadow: `0 12px 40px ${alpha(color, 0.2)}`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          background: `linear-gradient(180deg, ${color}, ${alpha(color, 0.6)})`,
          borderRadius: "0 4px 4px 0",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "18px",
            border: `2px solid ${color}`,
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              background: alpha(color, 0.1),
              transform: "scale(1.05)",
              border: `2px solid ${color}`,
            },
          }}
        >
          <Icon sx={{ fontSize: 28, color: color }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "1.4rem",
              mb: 0.5,
              letterSpacing: "-0.01em",
            }}
          >
            {service}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontWeight: 500,
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                animation: "pulse 2s infinite",
              }}
            />
            Operação Ativa
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            color: color,
            fontSize: "2.8rem",
            lineHeight: 1,
            mb: 0.5,
            textShadow: `0 2px 8px ${alpha(color, 0.3)}`,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontWeight: 600,
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            background: alpha("#64748b", 0.1),
            px: 2,
            py: 0.5,
            borderRadius: "8px",
          }}
        >
          Solturas
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Card
      sx={{
        borderRadius: "28px",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
        overflow: "visible",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid #e2e8f0",
        position: "relative",
      }}
    >
      <CardContent sx={{ p: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 5,
            pb: 4,
            borderBottom: "2px solid #f1f5f9",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: "16px",
                border: `2px solid #60a5fa`,
                background: "transparent",
                mr: 3,
                boxShadow: "0 8px 24px rgba(96, 165, 250, 0.3)",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: `2px solid #3b82f6`,
                  transform: "scale(1.05)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                  right: "2px",
                  bottom: "2px",
                  borderRadius: "12px",
                  background: "rgba(96, 165, 250, 0.1)",
                },
              }}
            >
              <PlayArrow sx={{ fontSize: 32, color: "#3b82f6", position: "relative", zIndex: 1 }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: {
                    xs: "1.6rem",
                    xl: "1.6rem",
                    "2xl": "1.9rem",
                  },
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  fontWeight: 500,
                  fontSize: "1rem",
                  mt: 0.5,
                }}
              >
                Monitoramento em Tempo Real
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 4,
              py: 2,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #1e293b, #374151)",
              border: "2px solid #334155",
              boxShadow: "0 8px 24px rgba(30, 41, 59, 0.2)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
                animation: "shimmer 3s infinite",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: 700,
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                mr: 2,
              }}
            >
              Total Ativo:
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#ffffff",
                fontSize: "1.8rem",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              {total}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
          {data &&
            Array.isArray(data) &&
            data.map((entry, index) => {
              const icons = [LocalShipping, RecyclingOutlined, Build]
              const colors = ["#3b82f6", "#10b981", "#f59e0b"] // Azul, Verde, Amarelo
              return (
                <ServiceItem
                  key={entry.name}
                  service={entry.name}
                  value={entry.value}
                  icon={icons[index % icons.length]}
                  color={colors[index % colors.length]}
                />
              )
            })}
        </Box>
        <Box
          sx={{
            mt: "auto",
            p: 4,
            borderRadius: "20px",
            background: "linear-gradient(135deg, #1e293b 0%, #374151 50%, #475569 100%)",
            border: "2px solid #334155",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 12px 32px rgba(30, 41, 59, 0.4)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
              animation: "shimmer 4s infinite",
              "@keyframes shimmer": {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(100%)" },
              },
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CheckCircle sx={{ fontSize: 24, color: "#ffffff" }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#ffffff",
                    fontSize: "1.3rem",
                    mb: 0.5,
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Status Consolidado
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  Todas as operações monitoradas
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                color: "#ffffff",
                fontSize: "3.5rem",
                textShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                letterSpacing: "-0.02em",
              }}
            >
              {total}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// Componente para Detalhamento por Serviço com Alertas
const ServiceDetailCard = ({ serviceName, serviceData, apiData, color, icon: Icon }) => {
  // Dados das metas previstas por serviço - ATUALIZADOS COM OS VALORES CORRETOS
  const targets = {
    RSU: {
      motoristas: 59, // 15+14+15+15 = 59
      coletores: 178, // 45+43+45+45 = 178
    },
    SELETIVA: {
      motoristas: 18, // 4+5+4+5 = 18
      coletores: 36, // 8+10+8+10 = 36
    },
    REMOÇÃO: {
      equipamentos: 12,
      motoristas: 18,
      coletores: 18,
    },
  }

  // Dados previstos específicos por PA - NOVOS DADOS FORNECIDOS
  const predictedDataByPA = {
    RSU: {
      PA1: { motoristas: 15, coletores: 45 },
      PA2: { motoristas: 14, coletores: 43 },
      PA3: { motoristas: 15, coletores: 45 },
      PA4: { motoristas: 15, coletores: 45 },
    },
    SELETIVA: {
      PA1: { motoristas: 4, coletores: 8 },
      PA2: { motoristas: 5, coletores: 10 },
      PA3: { motoristas: 4, coletores: 8 },
      PA4: { motoristas: 5, coletores: 10 },
    },
    REMOÇÃO: {
      PA1: { motoristas: 0, coletores: 0 },
      PA2: { motoristas: 0, coletores: 0 },
      PA3: { motoristas: 0, coletores: 0 },
      PA4: { motoristas: 0, coletores: 0 },
    },
  }

  const target = targets[serviceName.toUpperCase()] || { equipamentos: 0, motoristas: 0, coletores: 0 }
  const predictedData = predictedDataByPA[serviceName.toUpperCase()] || {}

  // Calcular dados atuais baseados nos dados reais da API
  const currentData = {
    ...(serviceName === "REMOÇÃO" && { equipamentos: 0 }),
    motoristas: 0,
    coletores: 0,
  }

  // Processar dados da API para calcular totais atuais do serviço
  if (apiData?.resultado_por_pa) {
    Object.values(apiData.resultado_por_pa).forEach((pa) => {
      const serviceKey = serviceName === "RSU" ? "Rsu" : serviceName === "SELETIVA" ? "Seletiva" : "Remoção"
      if (pa[serviceKey]) {
        if (serviceName === "REMOÇÃO") {
          currentData.equipamentos += pa[serviceKey].equipamentos || 0
        }
        currentData.motoristas += pa[serviceKey].motoristas || 0
        currentData.coletores += pa[serviceKey].coletores || 0
      }
    })
  }

  // Calcular déficits
  const deficitMotoristas = Math.max(0, target.motoristas - currentData.motoristas)
  const deficitColetores = Math.max(0, target.coletores - currentData.coletores)
  const deficitEquipamentos =
    serviceName === "REMOÇÃO" ? Math.max(0, target.equipamentos - currentData.equipamentos) : 0

  const hasDeficit = deficitMotoristas > 0 || deficitColetores > 0 || deficitEquipamentos > 0

  const equipamentosPercent = Math.min((currentData.equipamentos / target.equipamentos) * 100, 100)
  const motoristasPercent = Math.min((currentData.motoristas / target.motoristas) * 100, 100)
  const coletoresPercent = Math.min((currentData.coletores / target.coletores) * 100, 100)

  const equipamentosStatus = equipamentosPercent >= 90 ? "success" : equipamentosPercent >= 70 ? "warning" : "danger"
  const motoristasStatus = motoristasPercent >= 90 ? "success" : motoristasPercent >= 70 ? "warning" : "danger"
  const coletoresStatus = coletoresPercent >= 90 ? "success" : motoristasPercent >= 70 ? "warning" : "danger"

  const statusColors = {
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
  }

  // Definir cores harmônicas para cada serviço
  let iconBorderColor = "#60a5fa" // Azul suave padrão
  if (serviceName === "RSU") {
    iconBorderColor = "#a78bfa" // Roxo suave
  } else if (serviceName === "SELETIVA") {
    iconBorderColor = "#34d399" // Verde suave
  } else if (serviceName === "REMOÇÃO") {
    iconBorderColor = "#fbbf24" // Amarelo suave
  }

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        p: 0,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 20px 40px ${alpha(iconBorderColor, 0.2)}`,
          border: "1px solid #cbd5e1",
        },
      }}
    >
      <CardContent sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header do Serviço */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              border: `2px solid ${iconBorderColor}`,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                background: alpha(iconBorderColor, 0.1),
                transform: "scale(1.05)",
              },
            }}
          >
            <Icon sx={{ fontSize: 32, color: iconBorderColor }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                fontSize: "1.5rem",
                mb: 0.5,
              }}
            >
              {serviceName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              Análise Operacional Completa
            </Typography>
          </Box>
        </Box>

        {/* Linha divisória */}
        <Divider sx={{ mb: 4, borderColor: "#E0E0E0", borderWidth: 1.5 }} />

        {/* Distribuição Detalhada por PA - DESTAQUE NO TOPO */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#475569",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              mb: 3,
              display: "block",
              textAlign: "center",
            }}
          >
            Distribuição Prevista por PA
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {["PA1", "PA2", "PA3", "PA4"].map((pa, index) => {
              // Usar dados previstos em vez dos dados da API
              const paPrevistoData = predictedData[pa] || { motoristas: 0, coletores: 0 }
              const equipamentos = Math.ceil((paPrevistoData.motoristas + paPrevistoData.coletores) / 8) // Estimativa de equipamentos
              const motoristas = paPrevistoData.motoristas
              const coletores = paPrevistoData.coletores

              let paBackgroundColor = ""
              let paBorderColor = ""
              if (serviceName === "RSU") {
                paBackgroundColor = alpha("#8b5cf6", 0.05)
                paBorderColor = alpha("#8b5cf6", 0.1)
              } else if (serviceName === "SELETIVA") {
                paBackgroundColor = alpha("#10b981", 0.05)
                paBorderColor = alpha("#10b981", 0.1)
              } else {
                paBackgroundColor = alpha("#f59e0b", 0.05)
                paBorderColor = alpha("#f59e0b", 0.1)
              }

              return (
                <Box key={pa} sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background: paBackgroundColor,
                      border: `2px solid ${paBorderColor}`,
                      transition: "all 0.3s ease",
                      minHeight: "120px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:hover": {
                        background: alpha("#3b82f6", 0.1),
                        border: `2px solid ${alpha("#3b82f6", 0.2)}`,
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px ${alpha("#3b82f6", 0.15)}`,
                      },
                    }}
                  >
                    {/* Header do PA */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: "#3b82f6",
                        fontSize: "1rem",
                        mb: 1.5,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {pa}
                    </Typography>
                    {/* Métricas */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                      {/* Equipamentos */}
                      {serviceName === "REMOÇÃO" && (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              border: `2px solid #fb7185`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "transparent",
                            }}
                          >
                            <LocalShipping sx={{ fontSize: 14, color: "#fb7185" }} />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: "#64748b",
                              fontSize: "0.9rem",
                              minWidth: "20px",
                            }}
                          >
                            {equipamentos}
                          </Typography>
                        </Box>
                      )}
                      {/* Motoristas */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            border: `2px solid #22d3ee`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                          }}
                        >
                          <Person sx={{ fontSize: 14, color: "#22d3ee" }} />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: "#64748b",
                            fontSize: "0.9rem",
                            minWidth: "20px",
                          }}
                        >
                          {motoristas}
                        </Typography>
                      </Box>
                      {/* Coletores */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            border: `2px solid #a3e635`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                          }}
                        >
                          <Group sx={{ fontSize: 14, color: "#a3e635" }} />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: "#64748b",
                            fontSize: "0.9rem",
                            minWidth: "20px",
                          }}
                        >
                          {coletores}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>

        {/* Linha divisória */}
        <Divider sx={{ mb: 4, borderColor: "#E0E0E0", borderWidth: 1.5 }} />

        {/* Saídas Realizadas por PA - NOVA SEÇÃO */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#475569",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              mb: 3,
              display: "block",
              textAlign: "center",
            }}
          >
            Saídas Realizadas por PA
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {["PA1", "PA2", "PA3", "PA4"].map((pa, index) => {
              const paData = apiData?.resultado_por_pa?.[pa] || {}
              const serviceKey = serviceName === "RSU" ? "Rsu" : serviceName === "SELETIVA" ? "Seletiva" : "Remoção"
              const paServiceData = paData[serviceKey] || {}

              const veiculos = paServiceData.veiculos || 0
              const motoristas = paServiceData.motoristas || 0
              const coletores = paServiceData.coletores || 0

              let paBackgroundColor = ""
              let paBorderColor = ""
              if (serviceName === "RSU") {
                paBackgroundColor = alpha("#8b5cf6", 0.05)
                paBorderColor = alpha("#8b5cf6", 0.1)
              } else if (serviceName === "SELETIVA") {
                paBackgroundColor = alpha("#10b981", 0.05)
                paBorderColor = alpha("#10b981", 0.1)
              } else {
                paBackgroundColor = alpha("#f59e0b", 0.05)
                paBorderColor = alpha("#f59e0b", 0.1)
              }

              return (
                <Box key={pa} sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background: paBackgroundColor,
                      border: `2px solid ${paBorderColor}`,
                      transition: "all 0.3s ease",
                      minHeight: "120px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:hover": {
                        background: alpha("#ef4444", 0.1),
                        border: `2px solid ${alpha("#ef4444", 0.2)}`,
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px ${alpha("#ef4444", 0.15)}`,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: "#ef4444",
                        fontSize: "1rem",
                        mb: 1.5,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {pa}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            border: `2px solid #fb7185`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                          }}
                        >
                          <LocalShipping sx={{ fontSize: 14, color: "#fb7185" }} />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: "#64748b",
                            fontSize: "0.9rem",
                            minWidth: "20px",
                          }}
                        >
                          {veiculos}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            border: `2px solid #22d3ee`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                          }}
                        >
                          <Person sx={{ fontSize: 14, color: "#22d3ee" }} />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: "#64748b",
                            fontSize: "0.9rem",
                            minWidth: "20px",
                          }}
                        >
                          {motoristas}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            border: `2px solid #a3e635`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                          }}
                        >
                          <Group sx={{ fontSize: 14, color: "#a3e635" }} />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: "#64748b",
                            fontSize: "0.9rem",
                            minWidth: "20px",
                          }}
                        >
                          {coletores}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>

        {/* Linha divisória */}
        <Divider sx={{ mb: 3, borderColor: "#E0E0E0", borderWidth: 1.5 }} />

        {/* Métricas de Performance */}
        <Box sx={{ mb: 3 }}>
          {/* Equipamentos */}
          {serviceName === "REMOÇÃO" && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: statusColors[equipamentosStatus],
                      mr: 1,
                      boxShadow: `0 0 0 2px ${alpha(statusColors[equipamentosStatus], 0.2)}`,
                    }}
                  />
                  Equipamentos
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 800,
                    color: statusColors[equipamentosStatus],
                    fontSize: "1.1rem",
                  }}
                >
                  {Math.round(equipamentosPercent)}%
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>
                  Atual: {currentData.equipamentos}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>
                  Meta: {target.equipamentos}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(statusColors[equipamentosStatus], 0.1),
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${equipamentosPercent}%`,
                    backgroundColor: statusColors[equipamentosStatus],
                    borderRadius: 3,
                    transition: "width 1s ease-in-out",
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Motoristas */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: statusColors[motoristasStatus],
                    mr: 1,
                    boxShadow: `0 0 0 2px ${alpha(statusColors[motoristasStatus], 0.2)}`,
                  }}
                />
                Motoristas
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 800,
                  color: statusColors[motoristasStatus],
                  fontSize: "1.1rem",
                }}
              >
                {Math.round(motoristasPercent)}%
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>
                Atual: {currentData.motoristas}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>
                Meta: {target.motoristas}
              </Typography>
            </Box>
            <Box
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(statusColors[motoristasStatus], 0.1),
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${motoristasPercent}%`,
                  backgroundColor: statusColors[motoristasStatus],
                  borderRadius: 3,
                  transition: "width 1s ease-in-out",
                }}
              />
            </Box>
          </Box>

          {/* Coletores */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: statusColors[coletoresStatus],
                    mr: 1,
                    boxShadow: `0 0 0 2px ${alpha(statusColors[coletoresStatus], 0.2)}`,
                  }}
                />
                Coletores
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 800,
                  color: statusColors[coletoresStatus],
                  fontSize: "1.1rem",
                }}
              >
                {Math.round(coletoresPercent)}%
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>
                Atual: {currentData.coletores}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>
                Meta: {target.coletores}
              </Typography>
            </Box>
            <Box
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(statusColors[coletoresStatus], 0.1),
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${coletoresPercent}%`,
                  backgroundColor: statusColors[coletoresStatus],
                  borderRadius: 3,
                  transition: "width 1s ease-in-out",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* ALERTA DE DÉFICIT - NOVA SEÇÃO */}
        {hasDeficit && (
          <Box sx={{ mt: "auto" }}>
            <Alert
              severity="warning"
              icon={<Warning />}
              sx={{
                borderRadius: "16px",
                border: "2px solid #f59e0b",
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                "& .MuiAlert-icon": {
                  color: "#d97706",
                },
                "& .MuiAlert-message": {
                  color: "#92400e",
                  fontWeight: 600,
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                ⚠️ Déficit Identificado para Meta
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {deficitMotoristas > 0 && (
                  <Typography variant="body2">
                    • Faltam <strong>{deficitMotoristas} motoristas</strong> para atingir a meta
                  </Typography>
                )}
                {deficitColetores > 0 && (
                  <Typography variant="body2">
                    • Faltam <strong>{deficitColetores} coletores</strong> para atingir a meta
                  </Typography>
                )}
                {deficitEquipamentos > 0 && (
                  <Typography variant="body2">
                    • Faltam <strong>{deficitEquipamentos} equipamentos</strong> para atingir a meta
                  </Typography>
                )}
              </Box>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default function FleetDashboard() {
  const [data, setData] = useState(null)
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [resumoData, setResumoData] = useState(null)
  const [solturasData, setSolturasData] = useState(null)
  const [pasData, setPasData] = useState(null)
  const [refreshingSection, setRefreshingSection] = useState(null)

  // Função principal que busca todos os dados
  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      const apiData = await getDashGeral()
      console.log("Dados recebidos da API:", apiData)
      setApiData(apiData)
      const processedData = processApiData(apiData)
      setData(processedData)

      // Atualizar todos os dados das seções
      setResumoData(processedData)
      setSolturasData(processedData)
      setPasData(processedData)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err.message || "Erro ao carregar dados do dashboard")
    } finally {
      setLoading(false)
    }
  }

  // função para refresh suave de seção específica
  const refreshSection = async (sectionName) => {
    setRefreshingSection(sectionName)
    try {
      const apiData = await getDashGeral()
      const processedData = processApiData(apiData)

      switch (sectionName) {
        case "resumo":
          setResumoData(processedData)
          break
        case "solturas":
          setSolturasData(processedData)
          break
        case "pas":
          setPasData(processedData)
          break
      }

      // Atualizar dados principais também
      setApiData(apiData)
      setData(processedData)
    } catch (err) {
      console.error(`Erro ao atualizar seção ${sectionName}:`, err)
    } finally {
      setTimeout(() => setRefreshingSection(null), 1000) // Remove indicador após 1s
    }
  }

  const processApiData = (apiData) => {
    if (!apiData || !apiData.resultado_por_pa) return null

    const processedData = {}

    Object.keys(apiData.resultado_por_pa).forEach((pa) => {
      const paData = apiData.resultado_por_pa[pa]

      const totalVeiculos =
        (paData.Seletiva?.veiculos || 0) + (paData.Rsu?.veiculos || 0) + (paData.Remoção?.veiculos || 0)
      const totalMotoristas =
        (paData.Seletiva?.motoristas || 0) + (paData.Rsu?.motoristas || 0) + (paData.Remoção?.motoristas || 0)
      const totalColetores =
        (paData.Seletiva?.coletores || 0) + (paData.Rsu?.coletores || 0) + (paData.Remoção?.coletores || 0)

      processedData[pa.toLowerCase()] = {
        veiculos: totalVeiculos,
        motoristas: totalMotoristas,
        coletores: totalColetores,
      }
    })

    // Manter a estrutura original da API para status_frota_andamento
    return {
      ...processedData,
      contagemPorGaragemEServico: apiData.resultado_por_pa,
      statusFrotaAndamento: apiData.status_frota_andamento,
      statusFrotaTotal: apiData.status_frota_andamento_mais_finalizado,
    }
  }

  useEffect(() => {
    // Carregamento inicial
    fetchAllData()

    // Refresh completo a cada 20 minutos
    const fullRefreshInterval = setInterval(fetchAllData, 20 * 60 * 1000)

    // Refresh individual das seções em tempos diferentes
    const resumoInterval = setInterval(() => refreshSection("resumo"), 5 * 60 * 1000) // 5 min
    const solturasInterval = setInterval(() => refreshSection("solturas"), 3 * 60 * 1000) // 3 min
    const pasInterval = setInterval(() => refreshSection("pas"), 6 * 60 * 1000) // 6 min

    return () => {
      clearInterval(fullRefreshInterval)
      clearInterval(resumoInterval)
      clearInterval(solturasInterval)
      clearInterval(pasInterval)
    }
  }, [])

  const handleRefresh = () => {
    fetchAllData()
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#fdfdfd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#3b82f6" }} />
        <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 600 }}>
          Carregando dados do dashboard...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fdfdfd", p: 4 }}>
        <Container maxWidth="md">
          <Alert
            severity="error"
            sx={{
              borderRadius: "16px",
              fontSize: "1.1rem",
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh} startIcon={<Refresh />}>
                Tentar Novamente
              </Button>
            }
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Erro ao carregar dashboard
            </Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        </Container>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fdfdfd", p: 4 }}>
        <Container maxWidth="md">
          <Alert severity="warning" sx={{ borderRadius: "16px" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Nenhum dado disponível
            </Typography>
            <Typography variant="body2">Os dados não foram carregados. Verifique a conexão com a API.</Typography>
            <Button onClick={handleRefresh} startIcon={<Refresh />} sx={{ mt: 2 }}>
              Tentar Novamente
            </Button>
          </Alert>
        </Container>
      </Box>
    )
  }

  console.log("Renderizando dashboard com dados:", data)

  // Dados para solturas em andamento - CORRIGIDO PARA USAR OS DADOS PROCESSADOS
  const solturasAndamentoData = [
    { name: "RSU", value: solturasData?.statusFrotaAndamento?.por_servico?.["Rsu"] || 0 },
    { name: "SELETIVA", value: solturasData?.statusFrotaAndamento?.por_servico?.["Seletiva"] || 0 },
    { name: "REMOÇÃO", value: solturasData?.statusFrotaAndamento?.por_servico?.["Remoção"] || 0 },
  ]

  console.log("Status Frota Andamento completo:", data?.statusFrotaAndamento)
  console.log("Por serviço processado:", data?.statusFrotaAndamento?.por_servico)
  console.log("Dados para solturas em andamento:", solturasAndamentoData)

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header Profissional BRANCO */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          color: "#1e293b",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar sx={{ py: 3, px: 6, minHeight: "90px" }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            {/* Logo - SEM QUADRADO, MAIOR */}
            <Box
              sx={{
                width: 120,
                height: 120,
                mr: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, transparent 30%, rgba(134, 239, 172, 0.1) 50%, transparent 70%)",
                  animation: "shimmer 4s infinite",
                  "@keyframes shimmer": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                  },
                },
              }}
            >
              <img
                src="/logolimpa.png"
                alt="Logo Sustentabilidade"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "20px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </Box>
            {/* Título e Subtítulo */}
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "2.5rem",
                    xl: "2.8rem",
                    "2xl": "3.2rem",
                  },
                  color: "#1e293b",
                  letterSpacing: "-0.03em",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5,
                }}
              >
                Dashboard Operacional
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#475569",
                  fontSize: {
                    xs: "1.2rem",
                    xl: "1.3rem",
                    "2xl": "1.5rem",
                  },
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.2)",
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": {
                        boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)",
                      },
                      "70%": {
                        boxShadow: "0 0 0 10px rgba(34, 197, 94, 0)",
                      },
                      "100%": {
                        boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)",
                      },
                    },
                  }}
                />
                Gestão Inteligente de Frota e Recursos
              </Typography>
            </Box>
          </Box>

          {/* Área de Status e Controles */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Status de Atualização */}
            {lastUpdate && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  px: 4,
                  py: 3,
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #f8fafc, #ffffff)",
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #f1f5f9, #f8fafc)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                    border: "2px solid #cbd5e1",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #86efac, #4ade80)",
                    border: "2px solid #22c55e",
                    boxShadow: "0 4px 12px rgba(134, 239, 172, 0.3)",
                  }}
                >
                  <Assessment sx={{ fontSize: 22, color: "#ffffff" }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#475569",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      display: "block",
                      lineHeight: 1,
                    }}
                  >
                    Última Atualização
                  </Typography>
                  <Typography
                    variant="h6"
                    suppressHydrationWarning={true}
                    sx={{
                      color: "#1e293b",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      fontFamily: "monospace",
                      mt: 0.5,
                    }}
                  >
                    {lastUpdate.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Botão de Atualização */}
            <Button
              onClick={handleRefresh}
              startIcon={<Refresh />}
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #86efac, #4ade80)",
                border: "2px solid #22c55e",
                color: "#ffffff",
                borderRadius: "18px",
                px: 4,
                py: 2.5,
                fontWeight: 700,
                fontSize: "1.1rem",
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(134, 239, 172, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4ade80, #22c55e)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(134, 239, 172, 0.4)",
                  border: "2px solid #16a34a",
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
                "&:disabled": {
                  background: "linear-gradient(135deg, #94a3b8, #64748b)",
                  color: "#ffffff",
                  transform: "none",
                  border: "2px solid #475569",
                },
              }}
            >
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth={{
          xs: "xl",
          xl: "xl",
          "2xl": false,
        }}
        sx={{
          py: 5,
          px: {
            xs: 4,
            xl: 4,
            "2xl": 6,
          },
        }}
      >
        {/* Detalhamento de Serviços */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: "14px",
                  border: `2px solid #60a5fa`,
                  background: "transparent",
                  mr: 3,
                  boxShadow: `0 8px 20px ${alpha("#60a5fa", 0.3)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: `2px solid #3b82f6`,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <TrendingUp sx={{ color: "#3b82f6", fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: {
                      xs: "1.8rem",
                      xl: "1.8rem",
                      "2xl": "2.2rem",
                    },
                    letterSpacing: "-0.01em",
                  }}
                >
                  Detalhamento de Serviços
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#64748b",
                    fontWeight: 500,
                    fontSize: "1rem",
                    mt: 0.5,
                  }}
                >
                  Análise completa por área de atuação
                </Typography>
              </Box>
            </Box>
            {refreshingSection === "pas" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CircularProgress size={20} sx={{ color: "#86efac" }} />
                <Typography variant="body2" sx={{ color: "#86efac", fontWeight: 600 }}>
                  Atualizando dados...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Linha divisória */}
          <Divider sx={{ mb: 5, borderColor: "#E0E0E0", borderWidth: 1.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 5,
            }}
          >
            <ServiceDetailCard
              serviceName="RSU"
              serviceData={pasData}
              apiData={apiData}
              color="#8b5cf6"
              icon={HomeOutlined}
            />
            <ServiceDetailCard
              serviceName="SELETIVA"
              serviceData={pasData}
              apiData={apiData}
              color="#10b981"
              icon={RecyclingOutlined}
            />
            <ServiceDetailCard
              serviceName="REMOÇÃO"
              serviceData={pasData}
              apiData={apiData}
              color="#f59e0b"
              icon={DeleteSweepOutlined}
            />
          </Box>
        </Box>

        {/* Solturas em Andamento - Última Seção */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: "14px",
                  border: `2px solid #34d399`,
                  background: "transparent",
                  mr: 3,
                  boxShadow: `0 8px 20px ${alpha("#34d399", 0.3)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: `2px solid #10b981`,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <PlayArrow sx={{ color: "#10b981", fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: {
                      xs: "1.8rem",
                      xl: "1.8rem",
                      "2xl": "2.2rem",
                    },
                    letterSpacing: "-0.01em",
                  }}
                >
                  Solturas em Andamento
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#64748b",
                    fontWeight: 500,
                    fontSize: "1rem",
                    mt: 0.5,
                  }}
                >
                  Operações ativas em tempo real
                </Typography>
              </Box>
            </Box>
            {refreshingSection === "solturas" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CircularProgress size={20} sx={{ color: "#86efac" }} />
                <Typography variant="body2" sx={{ color: "#86efac", fontWeight: 600 }}>
                  Atualizando dados...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Linha divisória */}
          <Divider sx={{ mb: 4, borderColor: "#E0E0E0", borderWidth: 1.5 }} />
          <SolturasAndamentoCard title="Solturas em Andamento" data={solturasAndamentoData} height={500} />
        </Box>

        {/* Footer Simples */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            borderRadius: "16px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#64748b",
              fontSize: "1.1rem",
              mb: 1,
            }}
          >
            Sistema de Monitoramento Inteligente
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#94a3b8",
              fontSize: "0.9rem",
            }}
          >
            Dashboard desenvolvido para otimização operacional e gestão eficiente de recursos
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
