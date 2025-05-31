"use client"

import { useState, useEffect, useRef } from "react"
import { Box, Typography, Card, alpha, Skeleton } from "@mui/material"
import { WbSunny, Brightness3, People } from "@mui/icons-material"
// Remover esta importação:
// import { getQuantidadeMotoristasColetoresPorEquipe } from "../service/rsu"

// Helper function to check if data has changed
const hasDataChanged = (oldData, newData) => {
  if (!oldData || !newData) return true

  if (oldData.length !== newData.length) return true

  for (let i = 0; i < newData.length; i++) {
    if (
      oldData[i].equipe !== newData[i].equipe ||
      oldData[i].motoristas !== newData[i].motoristas ||
      oldData[i].coletores !== newData[i].coletores
    ) {
      return true
    }
  }

  return false
}

// Modificar o componente para receber data como prop
const ShiftDistributionChart = ({ themeColors, chartsLoaded = true, data }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processedData, setProcessedData] = useState([
    { equipe: "Equipe(Diurno)", motoristas: 0, coletores: 0 },
    { equipe: "Equipe(Noturno)", motoristas: 0, coletores: 0 },
  ])

  // Use ref to store previous data for comparison
  const prevDataRef = useRef(null)

  // Substituir fetchData por processData para usar os dados da prop
  const processData = () => {
    try {
      setLoading(true)
      console.log("Processando dados de distribuição por turno do componente pai...")

      if (!data || data.length === 0) {
        console.log("Dados ainda não disponíveis")
        return
      }

      // Transformar os dados da prop para o formato esperado pelo componente
      const transformedData = data.map((item) => ({
        equipe: item.name === "Diurno" ? "Equipe(Diurno)" : "Equipe(Noturno)",
        motoristas: item.motoristas || 0,
        coletores: item.coletores || 0,
      }))

      // Check if data has changed
      const dataChanged = hasDataChanged(prevDataRef.current, transformedData)

      if (dataChanged) {
        console.log("Dados mudaram, atualizando componente...")
        setProcessedData(transformedData)
        setError(null)

        // Update previous data ref
        prevDataRef.current = [...transformedData]
      } else {
        console.log("Dados não mudaram, pulando atualização")
      }
    } catch (err) {
      console.error("Erro ao processar dados de distribuição por turno:", err)
      setError("Falha ao processar dados de turnos")
    } finally {
      setLoading(false)
    }
  }

  // Atualizar o useEffect para observar mudanças na prop data
  useEffect(() => {
    if (data && data.length > 0) {
      processData()
    }
  }, [data])

  // Find data for each shift usando processedData
  const diurnoData = processedData.find((item) => item.equipe.toLowerCase().includes("diurno")) || {
    equipe: "Equipe(Diurno)",
    motoristas: 0,
    coletores: 0,
  }

  const noturnoData = processedData.find((item) => item.equipe.toLowerCase().includes("noturno")) || {
    equipe: "Equipe(Noturno)",
    motoristas: 0,
    coletores: 0,
  }

  // Calculate totals
  const totalDrivers = diurnoData.motoristas + noturnoData.motoristas
  const totalCollectors = diurnoData.coletores + noturnoData.coletores
  const totalEmployees = totalDrivers + totalCollectors

  // Calculate percentages for each shift
  const diurnoPercentage =
    totalEmployees > 0 ? ((diurnoData.motoristas + diurnoData.coletores) / totalEmployees) * 100 : 0
  const noturnoPercentage =
    totalEmployees > 0 ? ((noturnoData.motoristas + noturnoData.coletores) / totalEmployees) * 100 : 0

  // Shift card component
  const ShiftCard = ({ title, icon: Icon, color, driverCount, collectorCount, percentage, total }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: "12px",
        backgroundColor: alpha(color, 0.05),
        border: `1px solid ${alpha(color, 0.1)}`,
        height: "100%",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: `1px solid ${alpha(color, 0.1)}`,
        }}
      >
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            backgroundColor: alpha(color, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <Icon sx={{ color: color, fontSize: 24 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: color,
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontWeight: 500, color: themeColors.text.secondary }}>Motoristas</Typography>
          <Typography sx={{ fontWeight: 700, color: themeColors.text.primary }}>{driverCount}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 500, color: themeColors.text.secondary }}>Coletores</Typography>
          <Typography sx={{ fontWeight: 700, color: themeColors.text.primary }}>{collectorCount}</Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          backgroundColor: alpha(color, 0.1),
          borderTop: `1px solid ${alpha(color, 0.2)}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: "auto",
        }}
      >
        <Typography sx={{ fontWeight: 600, color: color }}>Total:</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 700, color: color, mr: 1 }}>{total}</Typography>
          <Box
            sx={{
              backgroundColor: alpha(color, 0.2),
              borderRadius: "12px",
              px: 1,
              py: 0.5,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: color, fontSize: "0.75rem" }}>
              {Math.round(percentage)}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  )

  if (loading && totalEmployees === 0) {
    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", gap: 3, mb: 3, flex: 1 }}>
          <Skeleton variant="rectangular" height={200} sx={{ flex: 1, borderRadius: "12px" }} />
          <Skeleton variant="rectangular" height={200} sx={{ flex: 1, borderRadius: "12px" }} />
        </Box>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: "12px" }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Shift Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 3, flex: 1 }}>
        {/* Day Shift */}
        <Box sx={{ flex: 1 }}>
          <ShiftCard
            title="Diurno"
            icon={WbSunny}
            color={themeColors.warning.main}
            driverCount={diurnoData.motoristas}
            collectorCount={diurnoData.coletores}
            percentage={diurnoPercentage}
            total={diurnoData.motoristas + diurnoData.coletores}
          />
        </Box>

        {/* Night Shift */}
        <Box sx={{ flex: 1 }}>
          <ShiftCard
            title="Noturno"
            icon={Brightness3}
            color={themeColors.info.main}
            driverCount={noturnoData.motoristas}
            collectorCount={noturnoData.coletores}
            percentage={noturnoPercentage}
            total={noturnoData.motoristas + noturnoData.coletores}
          />
        </Box>
      </Box>

      {/* Summary Row */}
      <Box
        sx={{
          borderRadius: "10px",
          backgroundColor: alpha(themeColors.success.main, 0.03),
          py: 1,
          px: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: `1px solid ${alpha(themeColors.success.main, 0.08)}`,
          mt: 0.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: alpha(themeColors.success.main, 0.15),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <People sx={{ color: themeColors.success.main, fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontWeight: 600, color: themeColors.success.main, fontSize: "0.9rem" }}>
            Total de funcionários em operação:
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: alpha(themeColors.success.main, 0.15),
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: themeColors.success.main,
            }}
          >
            {totalEmployees}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ShiftDistributionChart
