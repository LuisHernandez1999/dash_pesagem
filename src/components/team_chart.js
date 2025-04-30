"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { Box, Typography, alpha, useTheme, CircularProgress } from "@mui/material"
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
  Cell,
} from "recharts"
import { getQuantidadeSolturaEquipesDiaTipo } from "../service/dashboard"

// Componente de gráfico de equipes
function TeamChart() {
  const theme = useTheme()
  const [teamData, setTeamData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const previousDataRef = useRef(null)
  
  // Cores vibrantes para as equipes
  const TEAM_COLORS = {
    "Equipe1(Matutino)": {
      main: "#4361ee",
      gradient: ["#4361ee", "#3a0ca3"]
    },
    "Equipe2(Vespertino)": {
      main: "#f72585",
      gradient: ["#f72585", "#7209b7"]
    },
    "Equipe3(Noturno)": {
      main: "#ffd60a",
      gradient: ["#ffd60a", "#fb8500"]
    }
  }

  // Função para verificar se os dados mudaram
  const haveDataChanged = (newData, oldData) => {
    if (!oldData || oldData.length !== newData.length) return true
    
    return JSON.stringify(newData.map(item => item.value)) !== 
           JSON.stringify(oldData.map(item => item.value))
  }

  // Função para carregar dados
  const loadTeamData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      // Obter dados da API
      const equipesData = await getQuantidadeSolturaEquipesDiaTipo()
      console.log("Dados recebidos da API:", equipesData)

      // Verificar se temos dados válidos
      if (!equipesData) {
        throw new Error("Dados não recebidos da API")
      }

      // Processar os dados com base na estrutura retornada
      let formattedData = []

      if (equipesData.dadosEquipes && Array.isArray(equipesData.dadosEquipes)) {
        // Formato: { dadosEquipes: [{ tipoEquipe: "...", quantidade: X }, ...] }
        formattedData = equipesData.dadosEquipes.map((item, index) => {
          const teamKey = item.tipoEquipe || `Equipe${index + 1}`
          const teamColor = TEAM_COLORS[teamKey] || {
            main: ["#4cc9f0", "#4895ef", "#4361ee"][index % 3],
            gradient: [["#4cc9f0", "#4895ef"], ["#f72585", "#7209b7"], ["#ffd60a", "#fb8500"]][index % 3]
          }
          
          return {
            name: item.tipoEquipe || `Equipe ${index + 1}`,
            value: item.quantidade || 0,
            color: teamColor.main,
            gradient: teamColor.gradient,
            label: `${item.quantidade || 0}`,
            fullName: item.tipoEquipe || `Equipe ${index + 1}`
          }
        })
      } else {
        // Formato alternativo: { "Equipe1(Matutino)": X, "Equipe2(Vespertino)": Y, ... }
        formattedData = Object.entries(equipesData).map(([name, value], index) => {
          const teamColor = TEAM_COLORS[name] || {
            main: ["#4cc9f0", "#4895ef", "#4361ee"][index % 3],
            gradient: [["#4cc9f0", "#4895ef"], ["#f72585", "#7209b7"], ["#ffd60a", "#fb8500"]][index % 3]
          }
          
          return {
            name: name.split("(")[0],
            value: typeof value === "number" ? value : 0,
            color: teamColor.main,
            gradient: teamColor.gradient,
            label: `${typeof value === "number" ? value : 0}`,
            fullName: name
          }
        })
      }

      console.log("Dados formatados para o gráfico:", formattedData)

      // Se não temos dados, usar dados de exemplo para desenvolvimento
      if (formattedData.length === 0) {
        formattedData = [
          { 
            name: "Equipe1", 
            value: 35, 
            color: "#4361ee", 
            gradient: ["#4361ee", "#3a0ca3"],
            label: "35", 
            fullName: "Equipe1(Matutino)" 
          },
          { 
            name: "Equipe2", 
            value: 25, 
            color: "#f72585", 
            gradient: ["#f72585", "#7209b7"],
            label: "25", 
            fullName: "Equipe2(Vespertino)" 
          },
          { 
            name: "Equipe3", 
            value: 40, 
            color: "#ffd60a", 
            gradient: ["#ffd60a", "#fb8500"],
            label: "40", 
            fullName: "Equipe3(Noturno)" 
          },
        ]
        console.log("Usando dados de exemplo:", formattedData)
      }

      // Verificar se os dados mudaram antes de atualizar o estado
      if (haveDataChanged(formattedData, previousDataRef.current)) {
        console.log("Dados mudaram, atualizando gráfico")
        setTeamData(formattedData)
        previousDataRef.current = formattedData
      } else {
        console.log("Dados não mudaram, mantendo gráfico atual")
      }
    } catch (error) {
      console.error("Erro ao carregar dados de equipes:", error)
      setError("Falha ao carregar dados")

      // Usar dados de exemplo em caso de erro
      if (!previousDataRef.current) {
        const fallbackData = [
          { 
            name: "Equipe1", 
            value: 35, 
            color: "#4361ee", 
            gradient: ["#4361ee", "#3a0ca3"],
            label: "35", 
            fullName: "Equipe1(Matutino)" 
          },
          { 
            name: "Equipe2", 
            value: 25, 
            color: "#f72585", 
            gradient: ["#f72585", "#7209b7"],
            label: "25", 
            fullName: "Equipe2(Vespertino)" 
          },
          { 
            name: "Equipe3", 
            value: 40, 
            color: "#ffd60a", 
            gradient: ["#ffd60a", "#fb8500"],
            label: "40", 
            fullName: "Equipe3(Noturno)" 
          },
        ]
        setTeamData(fallbackData)
        previousDataRef.current = fallbackData
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Carregar dados iniciais
  useEffect(() => {
    loadTeamData()
  }, [loadTeamData])

  // Configurar refresh automático
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadTeamData(true)
    }, 10000) // Atualiza a cada 30 segundos

    return () => clearInterval(intervalId)
  }, [loadTeamData])

  // Tooltip personalizado para o gráfico
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: "none",
            borderRadius: "16px",
            padding: "1.2rem",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            maxWidth: "280px",
            position: "relative",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: `linear-gradient(90deg, ${data.gradient[0]}, ${data.gradient[1]})`,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.2rem",
              marginBottom: "0.75rem",
              color: theme.palette.text.primary,
              borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
              paddingBottom: "0.5rem",
            }}
          >
            {`${data.fullName}`}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "4px",
                  marginRight: "0.75rem",
                  background: `linear-gradient(135deg, ${data.gradient[0]}, ${data.gradient[1]})`,
                }}
              />
              <Typography sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>Solturas:</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{data.value}</Typography>
          </Box>
        </Box>
      )
    }
    return null
  }

  // Renderizar gráfico de barras
  return (
    <Box
      sx={{
        width: "100%",
        height: 300,
        position: "relative",
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes barAnimation {
            0% { height: 0; opacity: 0; }
            100% { height: 100%; opacity: 1; }
          }
          @keyframes refreshPulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 2,
          }}
        >
          <CircularProgress 
            size={50} 
            sx={{ 
              color: "#4361ee",
              boxShadow: "0 0 20px rgba(67, 97, 238, 0.3)",
            }} 
          />
          <Typography 
            sx={{ 
              color: theme.palette.text.secondary,
              animation: "pulse 1.5s infinite ease-in-out",
              fontWeight: 500,
            }}
          >
            Carregando dados das equipes...
          </Typography>
        </Box>
      ) : teamData.length > 0 ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            animation: refreshing ? "refreshPulse 1.5s infinite ease-in-out" : "none",
          }}
        >
          {refreshing && (
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "4px 10px",
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                animation: "float 2s infinite ease-in-out",
              }}
            >
              <CircularProgress size={16} sx={{ color: "#4361ee" }} />
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: "#4361ee" }}>
                Atualizando...
              </Typography>
            </Box>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={teamData} 
              margin={{ top: 30, right: 30, left: 20, bottom: 40 }}
              barGap={12}
              barCategoryGap={40}
              animationDuration={1000}
              animationBegin={0}
              animationEasing="ease-out"
            >
              <defs>
                {teamData.map((entry, index) => (
                  <linearGradient 
                    key={`gradient-${index}`} 
                    id={`colorTeam${index}`} 
                    x1="0" 
                    y1="0" 
                    x2="0" 
                    y2="1"
                    gradientTransform="rotate(10)"
                  >
                    <stop offset="0%" stopColor={entry.gradient[0]} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.gradient[1]} stopOpacity={0.8} />
                  </linearGradient>
                ))}
                <filter id="teamShadow" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.15" />
                </filter>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid 
                strokeDasharray="5 5" 
                vertical={false} 
                stroke={theme.palette.divider} 
                strokeOpacity={0.6} 
              />
              <XAxis
                dataKey="name"
                tick={{ 
                  fill: theme.palette.text.primary, 
                  fontSize: 13, 
                  fontWeight: 600 
                }}
                tickLine={false}
                axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                dy={10}
              />
              <YAxis
                tick={{ 
                  fill: theme.palette.text.primary, 
                  fontSize: 12, 
                  fontWeight: 500 
                }}
                tickLine={false}
                axisLine={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                tickFormatter={(value) => `${value}`}
                dx={-10}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: "rgba(241, 245, 249, 0.5)" }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingBottom: 20 }}
                formatter={(value, entry, index) => (
                  <span
                    style={{
                      color: teamData[index]?.color,
                      fontWeight: 600,
                      fontSize: "14px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      backgroundColor: alpha(teamData[index]?.color || "#3a86ff", 0.1),
                      boxShadow: `0 2px 8px ${alpha(teamData[index]?.color || "#3a86ff", 0.15)}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {value}
                  </span>
                )}
              />
              <Bar 
                dataKey="value" 
                name="Solturas" 
                radius={[8, 8, 0, 0]} 
                filter="url(#teamShadow)" 
                barSize={60}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {teamData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#colorTeam${index})`} 
                    filter="url(#glow)"
                    style={{
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
                <LabelList
                  dataKey="label"
                  position="top"
                  fill={theme.palette.text.primary}
                  fontSize={16}
                  fontWeight={700}
                  formatter={(value) => `${value}`}
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 2,
            padding: 3,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {error ? `Erro: ${error}` : "Nenhum dado de equipe disponível"}
          </Typography>
          <Typography 
            sx={{ 
              color: alpha(theme.palette.text.secondary, 0.7),
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            Tente novamente mais tarde ou contate o suporte
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default TeamChart
