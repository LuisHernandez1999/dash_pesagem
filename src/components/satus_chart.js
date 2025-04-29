"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Box, Typography, alpha, useTheme, CircularProgress } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts"
import { getDistribuicaoPorStatusTipo } from "../service/dashboard"

// Componente de gráfico de status
function StatusChart() {
  const theme = useTheme()
  const [activeIndex, setActiveIndex] = useState(0)
  const [statusData, setStatusData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const previousDataRef = useRef(null)

  // Cores para os status
  const STATUS_COLORS = {
    Finalizado: "#00c896",
    "Em andamento": "#3a86ff",
  }

  // Função para verificar se os dados mudaram
  const haveDataChanged = (newData, oldData) => {
    if (!oldData || oldData.length !== newData.length) return true

    return JSON.stringify(newData.map((item) => item.value)) !== JSON.stringify(oldData.map((item) => item.value))
  }

  // Função para carregar dados
  const loadStatusData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }
        setError(null)

        // Obter dados da API
        const statusDistribution = await getDistribuicaoPorStatusTipo()
        console.log("Dados recebidos da API de status:", statusDistribution)

        // Verificar se temos dados válidos
        if (!statusDistribution) {
          throw new Error("Dados não recebidos da API de status")
        }

        // Modificar a função de formatação de dados para evitar duplicação na legenda
        // Dentro da função loadStatusData, substitua o bloco de formatação de dados por:

        // Formatar dados para o gráfico
        const formattedData = []
        const statusMap = new Map()

        // Adicionar status "Finalizado" se existir
        if (statusDistribution.finalizado > 0) {
          formattedData.push({
            name: "Finalizado",
            value: statusDistribution.finalizado,
            color: STATUS_COLORS["Finalizado"],
          })
          statusMap.set("finalizado", true)
        }

        // Adicionar status "Em andamento" se existir
        if (statusDistribution.emAndamento > 0) {
          formattedData.push({
            name: "Em andamento",
            value: statusDistribution.emAndamento,
            color: STATUS_COLORS["Em andamento"],
          })
          statusMap.set("emandamento", true)
        }

        // Adicionar outros status do resultado, se existirem
        if (statusDistribution.resultado && typeof statusDistribution.resultado === "object") {
          Object.entries(statusDistribution.resultado).forEach(([key, value]) => {
            // Evitar duplicar os status já adicionados
            const normalizedKey = key.toLowerCase().replace(/\s+/g, "")
            if (!statusMap.has(normalizedKey) && value > 0) {
              formattedData.push({
                name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
                value: value,
                color: theme.palette.primary[key] || theme.palette.info.main,
              })
              statusMap.set(normalizedKey, true)
            }
          })
        }

        console.log("Dados formatados para o gráfico de status:", formattedData)

        // Melhorar a lógica de atualização para garantir que o refresh só ocorra quando os dados mudarem
        // Substitua o bloco de verificação de mudança de dados por:

        // Verificar se os dados mudaram antes de atualizar o estado
        if (haveDataChanged(formattedData, previousDataRef.current)) {
          console.log("Dados de status mudaram, atualizando gráfico")
          setStatusData(formattedData)
          previousDataRef.current = formattedData
          // Apenas mostrar o indicador de atualização quando os dados realmente mudarem
          if (isRefresh) {
            // Mostrar indicador de atualização brevemente
            setRefreshing(true)
            setTimeout(() => setRefreshing(false), 1500)
          }
        } else {
          console.log("Dados de status não mudaram, mantendo gráfico atual")
          // Não mostrar indicador de atualização quando os dados não mudarem
          setRefreshing(false)
        }
      } catch (error) {
        console.error("Erro ao carregar dados de status:", error)
        setError("Falha ao carregar dados de status")

        // Usar dados de exemplo em caso de erro
        if (!previousDataRef.current) {
          const fallbackData = [
            { name: "Finalizado", value: 63, color: STATUS_COLORS["Finalizado"] },
            { name: "Em andamento", value: 37, color: STATUS_COLORS["Em andamento"] },
          ]
          setStatusData(fallbackData)
          previousDataRef.current = fallbackData
        }
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [theme.palette],
  )

  // Carregar dados iniciais
  useEffect(() => {
    loadStatusData()
  }, [loadStatusData])

  // Configurar refresh automático
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadStatusData(true)
    }, 30000) // Atualiza a cada 30 segundos

    return () => clearInterval(intervalId)
  }, [loadStatusData])

  // Renderiza o setor ativo com efeitos visuais
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    return (
      <g>
        <text x={cx} y={cy - 15} textAnchor="middle" fill={fill} fontSize={18} fontWeight="bold">
          {payload.name}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" fill={theme.palette.text.primary} fontSize={16}>
          {`${value} (${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={payload.color}
          stroke="#fff"
          strokeWidth={3}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 12}
          fill={payload.color}
          stroke={payload.color}
          strokeWidth={1}
          strokeOpacity={0.8}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={payload.color} fill="none" strokeWidth={2} />
        <circle cx={ex} cy={ey} r={2} fill={payload.color} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill={theme.palette.text.primary}
          fontSize={14}
          fontWeight={500}
        >{`${value} (${(percent * 100).toFixed(0)}%)`}</text>
      </g>
    )
  }

  // Manipula o evento de hover no gráfico
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

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
              color: "#00c896",
              boxShadow: "0 0 20px rgba(0, 200, 150, 0.3)",
            }}
          />
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              animation: "pulse 1.5s infinite ease-in-out",
              fontWeight: 500,
            }}
          >
            Carregando dados de status...
          </Typography>
        </Box>
      ) : statusData.length > 0 ? (
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
              <CircularProgress size={16} sx={{ color: "#00c896" }} />
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: "#00c896" }}>Atualizando...</Typography>
            </Box>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {statusData.map((entry, index) => (
                  <filter key={`filter-${index}`} id={`glow-${index}`} height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
              </defs>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                paddingAngle={2}
                filter={`url(#glow-${activeIndex})`}
                animationDuration={1000}
                animationBegin={0}
                animationEasing="ease-out"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                layout="horizontal"
                align="center"
                wrapperStyle={{ paddingTop: 30 }}
                formatter={(value, entry, index) => (
                  <span
                    style={{
                      color: statusData[index].color,
                      fontWeight: 600,
                      fontSize: "14px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      backgroundColor: alpha(statusData[index].color, 0.1),
                      boxShadow: `0 2px 8px ${alpha(statusData[index].color, 0.15)}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {value}
                  </span>
                )}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value} (${((value / statusData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`,
                  name,
                ]}
                contentStyle={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                  border: "none",
                  padding: "12px 16px",
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                }}
              />
            </PieChart>
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
            {error ? `Erro: ${error}` : "Nenhum dado de status disponível"}
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

export default StatusChart
