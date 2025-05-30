"use client"

import { useState, useEffect } from "react"
import { Box, Typography, alpha, Skeleton, useTheme, Paper } from "@mui/material"
import {
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
  ReferenceLine,
  Area,
  ComposedChart,
  Label,
} from "recharts"
import { InfoIcon as InfoCircle, TrendingDown, TrendingUp, Minus } from "lucide-react"

const GraficoSeletivaSemanal = ({ themeColors, chartsLoaded, tabelaGraficoData }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const theme = useTheme()

  // Cores personalizadas para o gráfico - com laranja para baixo rendimento
  const customColors = {
    high: "#3a86ff", // Azul para alta quantidade
    medium: "#4895ef", // Azul médio para média quantidade
    low: "#ff9f1c", // Laranja para baixa quantidade
    areaFill: "url(#colorGradient)", // Gradiente para área
    referenceLine: "#8338ec", // Roxo para linha de referência
  }

  // Function to format day names to shorter versions
  const formatDayName = (fullDayName) => {
    const dayMap = {
      Domingo: "Dom",
      "Segunda-feira": "Seg",
      "Terça-feira": "Ter",
      "Quarta-feira": "Qua",
      "Quinta-feira": "Qui",
      "Sexta-feira": "Sex",
      Sábado: "Sáb",
    }
    return dayMap[fullDayName] || fullDayName
  }

  // Function to calculate efficiency based on number of collections
  // This is used only for coloring the dots
  const calculateEfficiency = (collections) => {
    if (collections >= 40) return 90
    if (collections >= 30) return 85
    if (collections >= 20) return 80
    if (collections >= 10) return 75
    return 70
  }

  // Process chart data when tabelaGraficoData changes
  useEffect(() => {
    console.log("GraficoSeletivaSemanal recebeu tabelaGraficoData:", tabelaGraficoData)

    if (tabelaGraficoData && tabelaGraficoData.resumoPorDiaDaSemana) {
      console.log("Dados resumoPorDiaDaSemana:", tabelaGraficoData.resumoPorDiaDaSemana)

      try {
        // Definir a ordem correta dos dias da semana
        const diasOrdenados = [
          "Domingo",
          "Segunda-feira",
          "Terça-feira",
          "Quarta-feira",
          "Quinta-feira",
          "Sexta-feira",
          "Sábado",
        ]

        // Verificar se resumoPorDiaDaSemana é um objeto
        if (
          typeof tabelaGraficoData.resumoPorDiaDaSemana === "object" &&
          !Array.isArray(tabelaGraficoData.resumoPorDiaDaSemana)
        ) {
          console.log("Convertendo objeto para array...")

          // Converter o objeto em array
          const chartData = diasOrdenados.map((dia, index) => ({
            dia: formatDayName(dia),
            diaCompleto: dia,
            coletas: tabelaGraficoData.resumoPorDiaDaSemana[dia] || 0,
            eficiencia: calculateEfficiency(tabelaGraficoData.resumoPorDiaDaSemana[dia] || 0),
            index: index, // Índice para ordenação
          }))

          console.log("Dados formatados para o gráfico:", chartData)
          setData(chartData)
          setLoading(false)
          setError(null)
        } else if (Array.isArray(tabelaGraficoData.resumoPorDiaDaSemana)) {
          // Caso seja um array (improvável, mas mantido por segurança)
          const chartData = tabelaGraficoData.resumoPorDiaDaSemana.map((item, index) => ({
            dia: formatDayName(item.dia),
            diaCompleto: item.dia,
            coletas: item.total,
            eficiencia: calculateEfficiency(item.total),
            index: index,
          }))

          setData(chartData)
          setLoading(false)
          setError(null)
        } else {
          throw new Error("Formato de dados inválido")
        }
      } catch (err) {
        console.error("Erro ao processar dados:", err)
        setError("Erro ao processar dados: " + err.message)

        // Dados de fallback para desenvolvimento
        const fallbackData = [
          { dia: "Dom", diaCompleto: "Domingo", coletas: 15, eficiencia: 75, index: 0 },
          { dia: "Seg", diaCompleto: "Segunda-feira", coletas: 35, eficiencia: 85, index: 1 },
          { dia: "Ter", diaCompleto: "Terça-feira", coletas: 28, eficiencia: 80, index: 2 },
          { dia: "Qua", diaCompleto: "Quarta-feira", coletas: 42, eficiencia: 90, index: 3 },
          { dia: "Qui", diaCompleto: "Quinta-feira", coletas: 32, eficiencia: 85, index: 4 },
          { dia: "Sex", diaCompleto: "Sexta-feira", coletas: 38, eficiencia: 85, index: 5 },
          { dia: "Sáb", diaCompleto: "Sábado", coletas: 22, eficiencia: 80, index: 6 },
        ]
        setData(fallbackData)
        setLoading(false)
      }
    } else if (tabelaGraficoData === null) {
      setLoading(true)
    } else {
      console.log("Dados não disponíveis, usando fallback")
      setError("Dados não disponíveis")

      // Dados de fallback para desenvolvimento
      const fallbackData = [
        { dia: "Dom", diaCompleto: "Domingo", coletas: 15, eficiencia: 75, index: 0 },
        { dia: "Seg", diaCompleto: "Segunda-feira", coletas: 35, eficiencia: 85, index: 1 },
        { dia: "Ter", diaCompleto: "Terça-feira", coletas: 28, eficiencia: 80, index: 2 },
        { dia: "Qua", diaCompleto: "Quarta-feira", coletas: 42, eficiencia: 90, index: 3 },
        { dia: "Qui", diaCompleto: "Quinta-feira", coletas: 32, eficiencia: 85, index: 4 },
        { dia: "Sex", diaCompleto: "Sexta-feira", coletas: 38, eficiencia: 85, index: 5 },
        { dia: "Sáb", diaCompleto: "Sábado", coletas: 22, eficiencia: 80, index: 6 },
      ]
      setData(fallbackData)
      setLoading(false)
    }
  }, [tabelaGraficoData])

  // Não precisa mais de useEffect para carregar dados, pois eles vêm via props

  // Calculate average
  const average = data.length > 0 ? data.reduce((acc, curr) => acc + curr.coletas, 0) / data.length : 0

  // Função para determinar o status baseado na comparação com a média
  const getStatusInfo = (value) => {
    const percentage = average > 0 ? (value / average) * 100 - 100 : 0

    if (value > average) {
      return {
        label: "Alto Rendimento",
        color: customColors.high,
        icon: <TrendingUp size={16} />,
        percentage: `+${Math.abs(percentage).toFixed(0)}%`,
      }
    } else if (value < average) {
      return {
        label: "Baixo Rendimento",
        color: customColors.low,
        icon: <TrendingDown size={16} />,
        percentage: `-${Math.abs(percentage).toFixed(0)}%`,
      }
    } else {
      return {
        label: "Rendimento Médio",
        color: customColors.medium,
        icon: <Minus size={16} />,
        percentage: "0%",
      }
    }
  }

  // Enhanced CustomTooltip with more visual appeal
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const statusInfo = getStatusInfo(data.coletas)

      return (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: `1px solid ${alpha(getColorByEfficiency(data.eficiencia), 0.3)}`,
            minWidth: "250px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Status Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: statusInfo.color,
              color: "white",
              padding: "4px 10px",
              borderBottomLeftRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Box>

          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: themeColors.text.primary,
              mb: 2,
              borderBottom: `2px solid ${alpha(getColorByEfficiency(data.eficiencia), 0.5)}`,
              paddingBottom: "8px",
              paddingRight: "100px", // Espaço para o badge
            }}
          >
            {data.diaCompleto}
          </Typography>

          {/* Valor principal destacado */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `3px solid ${getColorByEfficiency(data.eficiencia)}`,
                boxShadow: `0 0 15px ${alpha(getColorByEfficiency(data.eficiencia), 0.3)}`,
                position: "relative",
                backgroundColor: alpha(getColorByEfficiency(data.eficiencia), 0.1),
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: getColorByEfficiency(data.eficiencia),
                }}
              >
                {data.coletas}
              </Typography>
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography sx={{ fontSize: "0.9rem", color: themeColors.text.secondary }}>Coletas</Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: statusInfo.color,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {statusInfo.icon}
                {statusInfo.percentage} da média
              </Typography>
            </Box>
          </Box>

          {/* Informações adicionais */}
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${alpha(themeColors.text.secondary, 0.2)}` }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.85rem", color: themeColors.text.secondary }}>Média semanal:</Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: customColors.referenceLine }}>
                {average.toFixed(0)} coletas
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography sx={{ fontSize: "0.85rem", color: themeColors.text.secondary }}>
                Posição na semana:
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: themeColors.text.primary }}>
                {data.index + 1}º dia
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }
    return null
  }

  const getColorByEfficiency = (efficiency) => {
    if (efficiency >= 85) return customColors.high
    if (efficiency >= 75) return customColors.medium
    return customColors.low // Laranja para baixo rendimento
  }

  // Ordenar os dados por dia da semana para garantir a exibição correta
  const sortedData = [...data].sort((a, b) => a.index - b.index)

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "500px", // Aumentado para melhor visualização
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {loading ? (
        <Box
          sx={{
            width: "100%",
            height: "500px", // Aumentado para corresponder ao gráfico
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={450}
            sx={{ bgcolor: alpha(themeColors.text.primary, 0.1), borderRadius: "12px" }}
          />
        </Box>
      ) : error ? (
        <Box
          sx={{
            width: "100%",
            height: "500px", // Aumentado para corresponder ao gráfico
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography sx={{ color: themeColors.error.main, fontWeight: 500 }}>
            Erro ao carregar dados do gráfico
          </Typography>
          <Typography variant="body2" sx={{ color: themeColors.text.secondary }}>
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Indicador de média destacado */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 20,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: alpha(customColors.referenceLine, 0.1),
              padding: "6px 12px",
              borderRadius: "8px",
              border: `1px solid ${alpha(customColors.referenceLine, 0.3)}`,
              boxShadow: `0 4px 12px ${alpha(customColors.referenceLine, 0.2)}`,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: customColors.referenceLine,
                boxShadow: `0 0 8px ${alpha(customColors.referenceLine, 0.5)}`,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: customColors.referenceLine,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <InfoCircle size={16} />
              Média: {average.toFixed(0)} coletas
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={450}>
            {" "}
            {/* Aumentado para melhor visualização */}
            <ComposedChart
              data={sortedData}
              margin={{
                top: 40,
                right: 40,
                bottom: 80, // Aumentado de 60 para 80 para dar mais espaço aos rótulos
                left: 30,
              }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={alpha(customColors.high, 0.2)} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={alpha(customColors.high, 0.05)} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha(themeColors.text.primary, 0.08)} vertical={false} />
              <XAxis
                dataKey="dia"
                axisLine={{ stroke: alpha(themeColors.text.primary, 0.2), strokeWidth: 1 }}
                tickLine={false}
                tick={{
                  fill: themeColors.text.primary,
                  fontSize: 14,
                  fontWeight: 600,
                  dy: 15, // Aumentado de 10 para 15 para afastar mais os rótulos
                }}
                padding={{ left: 40, right: 40 }} // Aumentado de 30 para 40
                height={60} // Adicionando altura explícita para o eixo X
              />
              <YAxis
                dataKey="coletas"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: themeColors.text.secondary,
                  fontSize: 13,
                  dx: -10,
                }}
                domain={[
                  (dataMin) => Math.max(0, dataMin * 0.8), // Garantir que o mínimo seja pelo menos 0
                  (dataMax) => Math.ceil(dataMax * 1.2),
                ]}
                label={{
                  value: "Quantidade de Coletas",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: themeColors.text.secondary,
                    fontSize: 14,
                    fontWeight: 500,
                    dx: -15,
                  },
                }}
              />
              <ZAxis dataKey="eficiencia" range={[800, 2200]} name="Eficiência" unit="%" />{" "}
              {/* Aumentado o tamanho dos pontos */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: alpha(themeColors.text.primary, 0.2),
                  strokeWidth: 1,
                  strokeDasharray: "5 5",
                }}
              />
              <ReferenceLine
                y={average}
                stroke={customColors.referenceLine}
                strokeWidth={2.5}
                strokeDasharray="5 5"
                ifOverflow="extendDomain"
              >
                <Label
                  value="Média"
                  position="right"
                  fill={customColors.referenceLine}
                  fontSize={12}
                  fontWeight={600}
                />
              </ReferenceLine>
              <Area
                type="monotone"
                dataKey="coletas"
                fill={customColors.areaFill}
                stroke="none"
                animationDuration={1500}
                animationBegin={300}
                offset={5} // Adicionando offset para não chegar até o eixo X
              />
              <Scatter
                name="Coletas Seletivas"
                data={sortedData}
                fill={customColors.high}
                animationDuration={1800}
                animationBegin={500}
                shape="circle"
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorByEfficiency(entry.eficiencia)}
                    stroke={alpha("#ffffff", 0.8)}
                    strokeWidth={2}
                  />
                ))}
              </Scatter>
            </ComposedChart>
          </ResponsiveContainer>

          {/* Legenda melhorada */}
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mt: 3,
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: alpha(themeColors.background.paper, 0.9),
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              flexWrap: { xs: "wrap", md: "nowrap" },
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: alpha(customColors.high, 0.1),
                border: `1px solid ${alpha(customColors.high, 0.2)}`,
                minWidth: "120px",
              }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: customColors.high,
                  boxShadow: `0 0 10px ${alpha(customColors.high, 0.5)}`,
                  border: "2px solid white",
                  mb: 1,
                }}
              />
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: customColors.high, textAlign: "center" }}>
                Alta Quantidade
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: themeColors.text.secondary, textAlign: "center", mt: 0.5 }}>
                40+ coletas
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: alpha(customColors.medium, 0.1),
                border: `1px solid ${alpha(customColors.medium, 0.2)}`,
                minWidth: "120px",
              }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: customColors.medium,
                  boxShadow: `0 0 10px ${alpha(customColors.medium, 0.5)}`,
                  border: "2px solid white",
                  mb: 1,
                }}
              />
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: customColors.medium, textAlign: "center" }}>
                Média Quantidade
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: themeColors.text.secondary, textAlign: "center", mt: 0.5 }}>
                10-39 coletas
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: alpha(customColors.low, 0.1),
                border: `1px solid ${alpha(customColors.low, 0.2)}`,
                minWidth: "120px",
              }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: customColors.low,
                  boxShadow: `0 0 10px ${alpha(customColors.low, 0.5)}`,
                  border: "2px solid white",
                  mb: 1,
                }}
              />
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: customColors.low, textAlign: "center" }}>
                Baixa Quantidade
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: themeColors.text.secondary, textAlign: "center", mt: 0.5 }}>
                0-9 coletas
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: alpha(customColors.referenceLine, 0.1),
                border: `1px solid ${alpha(customColors.referenceLine, 0.2)}`,
                minWidth: "150px",
              }}
            >
              <Box
                sx={{
                  width: "70%",
                  height: 3,
                  backgroundColor: customColors.referenceLine,
                  borderRadius: "4px",
                  boxShadow: `0 0 10px ${alpha(customColors.referenceLine, 0.5)}`,
                  mb: 1.5,
                  mt: 0.5,
                  position: "relative",
                  "&::before, &::after": {
                    content: '""',
                    position: "absolute",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: customColors.referenceLine,
                    top: -2.5,
                  },
                  "&::before": {
                    left: 0,
                  },
                  "&::after": {
                    right: 0,
                  },
                }}
              />
              <Typography
                sx={{ fontSize: "0.9rem", fontWeight: 600, color: customColors.referenceLine, textAlign: "center" }}
              >
                Linha de Média
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: themeColors.text.secondary, textAlign: "center", mt: 0.5 }}>
                Média semanal: {average.toFixed(0)} coletas
              </Typography>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  )
}

export default GraficoSeletivaSemanal
