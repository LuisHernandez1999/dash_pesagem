"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Box, Typography, alpha, Chip, CircularProgress } from "@mui/material"
import { TrendingUp } from "@mui/icons-material"
import { getSolturasPorDiaDaSemanaRSU } from "../service/rsu"

// Mapeamento de dias da semana para formato abreviado para exibição
const dayMapping = {
  Domingo: "Dom",
  "Segunda-feira": "Seg",
  "Terça-feira": "Ter",
  "Quarta-feira": "Qua",
  "Quinta-feira": "Qui",
  "Sexta-feira": "Sex",
  Sábado: "Sáb",
}

// Paleta de cores pré-definida para cada dia da semana
const dayColors = {
  Dom: {
    light: "#F94144",
    main: "#F8961E",
    gradient: ["#F94144", "#F8961E"],
  },
  Seg: {
    light: "#4361EE",
    main: "#3A0CA3",
    gradient: ["#4361EE", "#3A0CA3"],
  },
  Ter: {
    light: "#4CC9F0",
    main: "#4895EF",
    gradient: ["#4CC9F0", "#4895EF"],
  },
  Qua: {
    light: "#F72585",
    main: "#B5179E",
    gradient: ["#F72585", "#B5179E"],
  },
  Qui: {
    light: "#7209B7",
    main: "#560BAD",
    gradient: ["#7209B7", "#560BAD"],
  },
  Sex: {
    light: "#F9C74F",
    main: "#F3722C",
    gradient: ["#F9C74F", "#F3722C"],
  },
  Sáb: {
    light: "#90BE6D",
    main: "#43AA8B",
    gradient: ["#90BE6D", "#43AA8B"],
  },
}

// Componente de gráfico de barras para distribuição semanal com design moderno
const WeeklyDistributionChart = ({
  loading = false,
  themeColors,
  height = 300,
  animated = false, // Desativado por padrão para melhor performance
  showLegend = true,
}) => {
  const [chartData, setChartData] = useState([])
  const [maxValue, setMaxValue] = useState(0)
  const [average, setAverage] = useState(0)
  const canvasRef = useRef(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [isVisible, setIsVisible] = useState(true) // Começar visível para renderização mais rápida
  const [hoveredBar, setHoveredBar] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const requestRef = useRef()
  const startTimeRef = useRef()
  const dataFetchedRef = useRef(false)

  // Buscar dados da API - Otimizado para evitar chamadas duplicadas
  useEffect(() => {
    // Evitar múltiplas chamadas à API
    if (dataFetchedRef.current) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        dataFetchedRef.current = true

        // Usar dados mockados para desenvolvimento rápido se necessário
        // const mockData = getMockData();
        // if (mockData) {
        //   processData(mockData);
        //   return;
        // }

        const resultadoDetalhado = await getSolturasPorDiaDaSemanaRSU()

        // Verificar se os dados são válidos
        if (!resultadoDetalhado || !Array.isArray(resultadoDetalhado) || resultadoDetalhado.length === 0) {
          console.warn("Dados inválidos recebidos da API")
          setError("Dados inválidos recebidos da API")
          setIsLoading(false)
          return
        }

        processData(resultadoDetalhado)
      } catch (error) {
        console.error("Erro ao buscar dados para o gráfico:", error)
        setError("Erro ao buscar dados. Por favor, tente novamente mais tarde.")
        setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animated])

  // Função para processar os dados recebidos da API
  const processData = useCallback(
    (resultadoDetalhado) => {
      // Transformar os dados para o formato esperado pelo gráfico
      const formattedData = resultadoDetalhado.map((item) => ({
        day: dayMapping[item.diaSemana] || item.diaSemana,
        value: item.quantidade,
        label: `${item.quantidade} saídas`,
        fullDayName: item.diaSemana, // Manter o nome completo para exibição no tooltip
      }))

      // Calcular o valor máximo e média
      const max = Math.max(...formattedData.map((item) => item.value))
      setMaxValue(max > 0 ? max + max * 0.2 : 10) // Adiciona 20% ao valor máximo para espaço no topo, ou usa 10 se todos forem zero

      // Calcular média
      const sum = formattedData.reduce((acc, item) => acc + item.value, 0)
      setAverage(Math.round(sum / formattedData.length))

      setChartData(formattedData)
      setIsLoading(false)

      // Iniciar animação apenas se solicitado
      if (animated) {
        startTimeRef.current = null
        setAnimationProgress(0)
        requestRef.current = requestAnimationFrame(animateChart)
      } else {
        setAnimationProgress(1) // Renderizar imediatamente sem animação
      }
    },
    [animated],
  )

  // Função de animação otimizada
  const animateChart = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp
    const elapsed = timestamp - startTimeRef.current
    const duration = 800 // Reduzido para 800ms para animação mais rápida

    let progress = Math.min(elapsed / duration, 1)
    // Função de easing para animação mais suave
    progress = 1 - Math.pow(1 - progress, 2) // Easing quadrático (mais rápido que cúbico)

    setAnimationProgress(progress)

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animateChart)
    }
  }, [])

  // Memoizar as cores do tema para evitar re-renderizações desnecessárias
  const memoizedThemeColors = useMemo(() => themeColors, [themeColors])

  // Função para desenhar o gráfico - Otimizada
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || chartData.length === 0) return

    const ctx = canvas.getContext("2d", { alpha: false }) // Desativar alpha para melhor performance
    if (!ctx) return

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Definir dimensões
    const width = canvas.width
    const height = canvas.height
    const padding = { top: 40, right: 40, bottom: 60, left: 50 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Desenhar fundo do gráfico (opcional)
    ctx.fillStyle = alpha(memoizedThemeColors.background.paper, 0.5)
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight)

    // Desenhar linhas de grade horizontais (pontilhadas)
    const gridLines = 5
    ctx.beginPath()
    ctx.strokeStyle = alpha(memoizedThemeColors.text.secondary, 0.1)
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3]) // Linha pontilhada

    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)

      // Adicionar valores no eixo Y com fonte melhorada
      const value = Math.round(maxValue - (maxValue / gridLines) * i)
      ctx.fillStyle = memoizedThemeColors.text.secondary
      ctx.font = "500 11px 'Inter', 'Roboto', sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(value.toString(), padding.left - 10, y + 4)
    }
    ctx.stroke()
    ctx.setLineDash([]) // Resetar para linha sólida

    // Desenhar eixos
    ctx.beginPath()
    ctx.strokeStyle = alpha(memoizedThemeColors.text.secondary, 0.2)
    ctx.lineWidth = 1

    // Eixo Y
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, height - padding.bottom)

    // Eixo X
    ctx.moveTo(padding.left, height - padding.bottom)
    ctx.lineTo(width - padding.right, height - padding.bottom)
    ctx.stroke()

    // Calcular largura das barras
    const barWidth = (chartWidth / chartData.length) * 0.2 // Barras mais finas conforme solicitado
    const barSpacing = (chartWidth / chartData.length) * 0.5 // Menos espaço entre barras
    const startX = padding.left + barSpacing / 2

    // Desenhar linha de média
    const averageY = height - padding.bottom - (average / maxValue) * chartHeight * animationProgress
    ctx.beginPath()
    ctx.strokeStyle = alpha("#757575", 0.7) // Cor mais neutra para a linha de média
    ctx.lineWidth = 1.5
    ctx.setLineDash([5, 3])
    ctx.moveTo(padding.left, averageY)
    ctx.lineTo(width - padding.right, averageY)
    ctx.stroke()
    ctx.setLineDash([])

    // Adicionar rótulo de média
    ctx.fillStyle = "#757575" // Cor mais neutra para o texto
    ctx.font = "600 10px 'Inter', 'Roboto', sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`Média: ${average}`, width - padding.right + 5, averageY + 4)

    // Desenhar barras com cores diferentes e efeitos modernos
    chartData.forEach((item, index) => {
      const x = startX + (barWidth + barSpacing) * index
      const fullBarHeight = (item.value / maxValue) * chartHeight
      // Aplicar animação à altura da barra
      const barHeight = fullBarHeight * animationProgress
      const y = height - padding.bottom - barHeight

      // Usar cores diferentes para cada dia
      const dayColor = dayColors[item.day] || {
        light: memoizedThemeColors.primary.light,
        main: memoizedThemeColors.primary.main,
        gradient: [memoizedThemeColors.primary.light, memoizedThemeColors.primary.main],
      }

      // Verificar se esta barra está sendo hover
      const isHovered = hoveredBar === index

      // Gradiente para as barras
      const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom)
      gradient.addColorStop(0, dayColor.gradient[0])
      gradient.addColorStop(1, dayColor.gradient[1])

      // Adicionar sombra para barras em hover
      if (isHovered) {
        ctx.shadowColor = alpha(dayColor.main, 0.5)
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 4
      }

      // Desenhar barra com cantos arredondados
      ctx.fillStyle = gradient
      ctx.beginPath()

      // Usar roundRect se disponível, caso contrário usar caminho personalizado
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0])
      } else {
        // Fallback para navegadores que não suportam roundRect
        const radius = 8
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + barWidth - radius, y)
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius)
        ctx.lineTo(x + barWidth, height - padding.bottom)
        ctx.lineTo(x, height - padding.bottom)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
      }

      ctx.fill()

      // Adicionar borda sutil
      ctx.strokeStyle = alpha(dayColor.light, 0.8)
      ctx.lineWidth = 1
      ctx.stroke()

      // Adicionar efeito de brilho no topo da barra
      const glowGradient = ctx.createLinearGradient(x, y, x, y + 10)
      glowGradient.addColorStop(0, alpha("#ffffff", 0.3))
      glowGradient.addColorStop(1, alpha("#ffffff", 0))

      ctx.fillStyle = glowGradient
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, 10, [8, 8, 0, 0])
      } else {
        const radius = 8
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + barWidth - radius, y)
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius)
        ctx.lineTo(x + barWidth, y + 10)
        ctx.lineTo(x, y + 10)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
      }
      ctx.fill()

      // Resetar sombra
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Adicionar rótulos no eixo X com fonte melhorada
      ctx.fillStyle = isHovered ? memoizedThemeColors.text.primary : memoizedThemeColors.text.secondary
      ctx.font = isHovered ? "600 12px 'Inter', 'Roboto', sans-serif" : "500 11px 'Inter', 'Roboto', sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(item.day, x + barWidth / 2, height - padding.bottom + 20)

      // Adicionar valores acima das barras com estilo melhorado
      if (animationProgress > 0.7 || !animated) {
        // Mostrar valores imediatamente se não houver animação
        const fadeInAlpha = animated ? (animationProgress - 0.7) / 0.3 : 1 // Fade in dos valores
        ctx.fillStyle = alpha(dayColor.main, fadeInAlpha)
        ctx.font = `600 ${isHovered ? "13px" : "11px"} 'Inter', 'Roboto', sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(item.value.toString(), x + barWidth / 2, y - 10)
      }

      // Armazenar as coordenadas exatas da barra para detecção de hover
      // Adicionando uma margem de tolerância para facilitar o hover
      const hoverTolerance = 4 // pixels de tolerância extra
      item.coords = {
        x: x - hoverTolerance,
        y: y - hoverTolerance,
        width: barWidth + hoverTolerance * 2,
        height: barHeight + hoverTolerance,
        bottom: height - padding.bottom + hoverTolerance,
        centerX: x + barWidth / 2,
      }
    })
  }, [
    chartData,
    canvasWidth,
    canvasHeight,
    hoveredBar,
    maxValue,
    memoizedThemeColors,
    animationProgress,
    average,
    animated,
  ])

  // Efeito para redimensionar o canvas - Otimizado com debounce
  useEffect(() => {
    let resizeTimer

    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (canvasRef.current) {
          const canvas = canvasRef.current
          const container = canvas.parentElement
          if (container) {
            const { width } = container.getBoundingClientRect()
            const devicePixelRatio = window.devicePixelRatio || 1

            // Ajustar para tela de alta resolução
            canvas.width = width * devicePixelRatio
            canvas.height = (typeof height === "number" ? height : 300) * devicePixelRatio
            canvas.style.width = `${width}px`
            canvas.style.height = `${typeof height === "number" ? height : 300}px`

            // Escalar o contexto
            const ctx = canvas.getContext("2d")
            ctx.scale(devicePixelRatio, devicePixelRatio)

            setCanvasWidth(width)
            setCanvasHeight(typeof height === "number" ? height : 300)
          }
        }
      }, 100) // Debounce de 100ms
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [height])

  // Efeito para desenhar o gráfico quando os dados ou dimensões mudam
  useEffect(() => {
    if (canvasWidth > 0 && canvasHeight > 0 && chartData.length > 0) {
      // Usar requestAnimationFrame para melhor performance
      const rafId = requestAnimationFrame(() => {
        drawChart()
      })
      return () => cancelAnimationFrame(rafId)
    }
  }, [chartData, canvasWidth, canvasHeight, isVisible, hoveredBar, animationProgress, drawChart])

  // Manipulador de movimento do mouse para detecção de hover - Otimizado com throttle
  const handleMouseMove = useCallback(
    (e) => {
      if (!canvasRef.current || chartData.length === 0) return

      // Throttle para melhorar performance
      if (handleMouseMove.throttleTimeout) return

      handleMouseMove.throttleTimeout = setTimeout(() => {
        handleMouseMove.throttleTimeout = null

        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Verificar se o mouse está sobre alguma barra
        let hoveredIndex = -1

        // Percorrer as barras em ordem inversa para priorizar as que estão na frente
        for (let i = chartData.length - 1; i >= 0; i--) {
          const item = chartData[i]
          if (
            item.coords &&
            x >= item.coords.x &&
            x <= item.coords.x + item.coords.width &&
            y >= item.coords.y &&
            y <= item.coords.bottom
          ) {
            hoveredIndex = i

            // Ajustar posição do tooltip para evitar que saia da tela
            const tooltipX = Math.min(
              Math.max(item.coords.centerX, 100), // Não deixar muito à esquerda
              canvasWidth - 100, // Não deixar muito à direita
            )

            setTooltipPosition({
              x: tooltipX,
              y: item.coords.y - 10,
            })

            break // Parar no primeiro encontrado (que é o mais à frente visualmente)
          }
        }

        setHoveredBar(hoveredIndex >= 0 ? hoveredIndex : null)
      }, 16) // ~60fps
    },
    [chartData, canvasWidth],
  )

  // Manipulador para saída do mouse
  const handleMouseLeave = useCallback(() => {
    setHoveredBar(null)
    if (handleMouseMove.throttleTimeout) {
      clearTimeout(handleMouseMove.throttleTimeout)
      handleMouseMove.throttleTimeout = null
    }
  }, [])

  // Manipulador para clique - Otimizado
  const handleClick = useCallback(
    (e) => {
      if (!canvasRef.current || chartData.length === 0) return

      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Verificar se o clique foi em alguma barra
      let clickedIndex = -1

      for (let i = chartData.length - 1; i >= 0; i--) {
        const item = chartData[i]
        if (
          item.coords &&
          x >= item.coords.x &&
          x <= item.coords.x + item.coords.width &&
          y >= item.coords.y &&
          y <= item.coords.bottom
        ) {
          clickedIndex = i

          // Ajustar posição do tooltip
          const tooltipX = Math.min(Math.max(item.coords.centerX, 100), canvasWidth - 100)

          setTooltipPosition({
            x: tooltipX,
            y: item.coords.y - 10,
          })

          break
        }
      }

      // Toggle hover state on click
      setHoveredBar(hoveredBar === clickedIndex ? null : clickedIndex >= 0 ? clickedIndex : null)
    },
    [chartData, hoveredBar, canvasWidth],
  )

  // Renderização simplificada para melhor performance
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {isLoading || loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: height,
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={40} color="primary" />
          <Typography variant="body2" color="textSecondary">
            Carregando dados do gráfico...
          </Typography>
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: height,
            flexDirection: "column",
            gap: 2,
            p: 3,
          }}
        >
          <Typography color="error" align="center">
            {error}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            O gráfico será exibido com dados vazios.
          </Typography>
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
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{
              width: "100%",
              height: "100%",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              cursor: hoveredBar !== null ? "pointer" : "default",
            }}
          />

          {/* Tooltip moderno - Renderizado apenas quando necessário */}
          {hoveredBar !== null && chartData[hoveredBar] && (
            <Box
              sx={{
                position: "absolute",
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y - 60}px`,
                transform: "translateX(-50%)",
                backgroundColor: alpha(memoizedThemeColors.background.paper, 0.95),
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                padding: "8px 12px",
                zIndex: 10,
                border: `1px solid ${alpha(memoizedThemeColors.divider, 0.2)}`,
                backdropFilter: "blur(8px)",
                animation: "fadeIn 0.2s ease-out",
                maxWidth: "200px", // Limitar largura máxima
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateX(-50%) translateY(10px)" },
                  to: { opacity: 1, transform: "translateX(-50%) translateY(0)" },
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  marginLeft: "-6px",
                  borderWidth: "6px",
                  borderStyle: "solid",
                  borderColor: `${alpha(memoizedThemeColors.background.paper, 0.95)} transparent transparent transparent`,
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: dayColors[chartData[hoveredBar].day]?.main || memoizedThemeColors.primary.main,
                  mb: 0.5,
                }}
              >
                {chartData[hoveredBar].fullDayName || chartData[hoveredBar].day}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: dayColors[chartData[hoveredBar].day]?.main || memoizedThemeColors.primary.main,
                  }}
                />
                <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {chartData[hoveredBar].value} saídas
                </Typography>
              </Box>
              {average > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                    fontSize: "0.8rem",
                    color:
                      chartData[hoveredBar].value > average
                        ? memoizedThemeColors.success.main
                        : memoizedThemeColors.error.main,
                  }}
                >
                  {chartData[hoveredBar].value > average ? (
                    <>
                      <TrendingUp fontSize="small" />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {Math.round((chartData[hoveredBar].value / average - 1) * 100)}% acima da média
                      </Typography>
                    </>
                  ) : (
                    <>
                      <TrendingUp fontSize="small" sx={{ transform: "rotate(180deg)" }} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {Math.round((1 - chartData[hoveredBar].value / average) * 100)}% abaixo da média
                      </Typography>
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}

      {showLegend && !isLoading && !loading && chartData.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 1.5,
            gap: 1,
            flexWrap: "wrap",
            padding: "6px 12px",
            borderRadius: "8px",
            backgroundColor: alpha(memoizedThemeColors.background.paper, 0.4),
          }}
        >
          {/* Legenda de média */}
          <Chip
            icon={
              <Box
                sx={{
                  width: 20,
                  height: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 1.5,
                    backgroundColor: "#757575",
                    position: "relative",
                    "&::before, &::after": {
                      content: '""',
                      position: "absolute",
                      width: 1.5,
                      height: 1.5,
                      backgroundColor: "#757575",
                      borderRadius: "50%",
                      top: 0,
                    },
                    "&::before": { left: 2 },
                    "&::after": { left: 6 },
                  }}
                />
              </Box>
            }
            label={`Média: ${average}`}
            size="small"
            sx={{
              backgroundColor: alpha("#757575", 0.1),
              color: "#757575",
              fontWeight: 600,
              borderRadius: "6px",
              height: "24px",
              fontSize: "0.75rem",
              border: `1px solid ${alpha("#757575", 0.2)}`,
              "& .MuiChip-icon": {
                color: "#757575",
              },
            }}
          />

          {/* Chips para cada dia */}
          {chartData.map((item, index) => (
            <Chip
              key={item.day}
              icon={
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "2px",
                    background: `linear-gradient(180deg, ${dayColors[item.day]?.gradient[0] || memoizedThemeColors.primary.light} 0%, ${dayColors[item.day]?.gradient[1] || memoizedThemeColors.primary.main} 100%)`,
                    boxShadow: `0 1px 3px ${alpha(dayColors[item.day]?.main || memoizedThemeColors.primary.main, 0.3)}`,
                  }}
                />
              }
              label={item.fullDayName || item.day}
              size="small"
              onClick={() => {
                setHoveredBar(hoveredBar === index ? null : index)
                if (item.coords) {
                  // Ajustar posição do tooltip para evitar que saia da tela
                  const tooltipX = Math.min(Math.max(item.coords.centerX, 100), canvasWidth - 100)

                  setTooltipPosition({
                    x: tooltipX,
                    y: item.coords.y - 10,
                  })
                }
              }}
              sx={{
                backgroundColor: alpha(dayColors[item.day]?.light || memoizedThemeColors.primary.light, 0.1),
                color: dayColors[item.day]?.main || memoizedThemeColors.primary.main,
                fontWeight: 600,
                borderRadius: "6px",
                height: "24px",
                fontSize: "0.75rem",
                border: `1px solid ${alpha(dayColors[item.day]?.light || memoizedThemeColors.primary.light, 0.2)}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(dayColors[item.day]?.light || memoizedThemeColors.primary.light, 0.2),
                  transform: "translateY(-1px)",
                  boxShadow: `0 2px 5px ${alpha(dayColors[item.day]?.main || memoizedThemeColors.primary.main, 0.2)}`,
                },
                "& .MuiChip-icon": {
                  color: dayColors[item.day]?.main || memoizedThemeColors.primary.main,
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
