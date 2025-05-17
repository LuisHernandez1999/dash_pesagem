"use client"

import { useState, useEffect, useRef } from "react"
import { Box, Typography, alpha, Chip } from "@mui/material"

// Componente de gráfico de barras para distribuição semanal
const WeeklyDistributionChart = ({
  data,
  loading = false,
  themeColors,
  height = 300,
  animated = true,
  showLegend = true,
}) => {
  const [chartData, setChartData] = useState([])
  const [maxValue, setMaxValue] = useState(0)
  const canvasRef = useRef(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Cores para cada dia da semana
  const dayColors = {
    Segunda: { light: "#FF6B6B", main: "#EE5253" }, // vermelho coral
    Terça: { light: "#4ECDC4", main: "#33B5AA" }, // turquesa
    Quarta: { light: "#FFD166", main: "#FFAB00" }, // amarelo âmbar
    Quinta: { light: "#6A0572", main: "#5A0462" }, // roxo profundo
    Sexta: { light: "#1A936F", main: "#157F5D" }, // verde esmeralda
    Sábado: { light: "#3D5A80", main: "#2E4562" }, // azul marinho
    Domingo: { light: "#E76F51", main: "#D65F41" }, // laranja coral
  }

  // Dados de exemplo caso não sejam fornecidos
  const sampleData = [
    { day: "Segunda", value: 42, label: "42 saídas" },
    { day: "Terça", value: 38, label: "38 saídas" },
    { day: "Quarta", value: 45, label: "45 saídas" },
    { day: "Quinta", value: 40, label: "40 saídas" },
    { day: "Sexta", value: 50, label: "50 saídas" },
    { day: "Sábado", value: 25, label: "25 saídas" },
    { day: "Domingo", value: 15, label: "15 saídas" },
  ]

  // Efeito para inicializar os dados
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data)
      const max = Math.max(...data.map((item) => item.value))
      setMaxValue(max + max * 0.2) // Adiciona 20% ao valor máximo para espaço no topo
    } else {
      setChartData(sampleData)
      const max = Math.max(...sampleData.map((item) => item.value))
      setMaxValue(max + max * 0.2)
    }

    // Simular carregamento para animação
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [data])

  // Substitua a função drawChart para armazenar coordenadas mais precisas
  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Definir dimensões
    const width = canvas.width
    const height = canvas.height
    const padding = { top: 40, right: 20, bottom: 60, left: 50 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Desenhar eixos
    ctx.beginPath()
    ctx.strokeStyle = alpha(themeColors.text.secondary, 0.2)
    ctx.lineWidth = 1

    // Eixo Y
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, height - padding.bottom)

    // Eixo X
    ctx.moveTo(padding.left, height - padding.bottom)
    ctx.lineTo(width - padding.right, height - padding.bottom)
    ctx.stroke()

    // Desenhar linhas de grade horizontais
    const gridLines = 5
    ctx.beginPath()
    ctx.strokeStyle = alpha(themeColors.text.secondary, 0.1)
    ctx.lineWidth = 1

    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)

      // Adicionar valores no eixo Y
      const value = Math.round(maxValue - (maxValue / gridLines) * i)
      ctx.fillStyle = themeColors.text.secondary
      ctx.font = "12px Arial"
      ctx.textAlign = "right"
      ctx.fillText(value.toString(), padding.left - 10, y + 4)
    }
    ctx.stroke()

    // Calcular largura das barras (ainda mais finas)
    const barWidth = (chartWidth / chartData.length) * 0.3 // Reduzido de 0.4 para 0.3
    const barSpacing = (chartWidth / chartData.length) * 0.7 // Aumentado de 0.6 para 0.7
    const startX = padding.left + barSpacing / 2

    // Desenhar barras com cores diferentes
    chartData.forEach((item, index) => {
      const x = startX + (barWidth + barSpacing) * index
      const barHeight = (item.value / maxValue) * chartHeight
      const y = height - padding.bottom - barHeight

      // Usar cores diferentes para cada dia
      const dayColor = dayColors[item.day] || {
        light: themeColors.info.light,
        main: themeColors.info.main,
      }

      // Gradiente para as barras (sem efeito de hover)
      const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom)
      gradient.addColorStop(0, dayColor.light)
      gradient.addColorStop(1, dayColor.main)

      // Sombra para as barras em hover

      // Desenhar barra com animação se ativado
      ctx.fillStyle = gradient
      ctx.beginPath()

      // Usar roundRect se disponível, caso contrário usar rect
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, [6, 6, 0, 0])
      } else {
        // Fallback para navegadores que não suportam roundRect
        ctx.moveTo(x + 6, y)
        ctx.lineTo(x + barWidth - 6, y)
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + 6)
        ctx.lineTo(x + barWidth, height - padding.bottom)
        ctx.lineTo(x, height - padding.bottom)
        ctx.lineTo(x, y + 6)
        ctx.quadraticCurveTo(x, y, x + 6, y)
      }

      ctx.fill()

      // Resetar sombra
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Adicionar rótulos no eixo X
      ctx.fillStyle = themeColors.text.secondary
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(item.day, x + barWidth / 2, height - padding.bottom + 20)

      // Adicionar valores acima das barras
      ctx.fillStyle = dayColor.main
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 10)

      // Armazenar as coordenadas exatas da barra para detecção de hover
      item.coords = {
        x: x,
        y: y,
        width: barWidth,
        height: barHeight,
        bottom: height - padding.bottom,
      }
    })
  }

  // Renderizar o tooltip

  // Efeito para redimensionar o canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const container = canvas.parentElement
        if (container) {
          const { width } = container.getBoundingClientRect()
          setCanvasWidth(width)
          setCanvasHeight(typeof height === "number" ? height : 300)
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [height])

  // Efeito para desenhar o gráfico quando os dados ou dimensões mudam
  useEffect(() => {
    if (canvasWidth > 0 && canvasHeight > 0) {
      drawChart()
    }
  }, [chartData, canvasWidth, canvasHeight, isVisible])

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: height }}>
          <Typography>Carregando dados...</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: height,
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{
              width: "100%",
              height: "100%",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          />
        </Box>
      )}

      {showLegend && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1, flexWrap: "wrap" }}>
          {Object.keys(dayColors).map((day) => (
            <Chip
              key={day}
              label={day}
              size="small"
              sx={{
                backgroundColor: alpha(dayColors[day].light, 0.1),
                color: dayColors[day].main,
                fontWeight: 600,
                borderRadius: "12px",
                border: `1px solid ${alpha(dayColors[day].light, 0.3)}`,
                "&:hover": {
                  backgroundColor: alpha(dayColors[day].light, 0.2),
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default WeeklyDistributionChart
