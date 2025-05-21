"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Box, Typography, Fade, alpha, Chip } from "@mui/material"
import { getSolturasPorGaragemRSU } from "../service/rsu"

// PA Distribution Chart Component
const PADistributionChart = ({ chartsLoaded = true, themeColors }) => {
  const [paData, setPaData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [totalValue, setTotalValue] = useState(0)

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching distribution data...")
      const distribuicaoPorPA = await getSolturasPorGaragemRSU()

      // Log the raw response
      console.log("Raw API response:", distribuicaoPorPA)

      // Find the total item and extract its value
      const totalItem = distribuicaoPorPA.find((item) => item.garagem === "Total")
      const totalValue = totalItem ? totalItem.quantidade : 0
      setTotalValue(totalValue)

      // Transform API data to the format needed by the chart
      // Filter out the Total item as we'll display it separately
      const transformedData = distribuicaoPorPA
        .filter((item) => item.garagem !== "Total")
        .map((item, index) => {
          // Assign colors based on index
          const colors = [
            { main: "#9c27b0", light: "#ba68c8" }, // Purple for PA1
            { main: "#2196f3", light: "#64b5f6" }, // Blue for PA2
            { main: "#ff9800", light: "#ffb74d" }, // Orange for PA3
            { main: "#4caf50", light: "#81c784" }, // Green for PA4
          ]

          // Get color based on PA name to keep consistent colors
          let colorIndex = 0
          if (item.garagem === "PA1") colorIndex = 0
          else if (item.garagem === "PA2") colorIndex = 1
          else if (item.garagem === "PA3") colorIndex = 2
          else if (item.garagem === "PA4") colorIndex = 3

          return {
            name: item.garagem,
            value: Number(item.quantidade) || 0, // Ensure value is a valid number
            color: colors[colorIndex],
          }
        })

      console.log("Transformed data for chart:", transformedData)
      setPaData(transformedData)
      setLastUpdated(new Date())

      // Start animation
      startAnimation()
    } catch (err) {
      console.error("Error fetching PA distribution data:", err)
      setError("Falha ao carregar dados de distribuição")
    } finally {
      setLoading(false)
    }
  }

  // Animation function
  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    setAnimationProgress(0)

    let startTime = null
    const duration = 800 // Animation duration in ms

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      setAnimationProgress(easedProgress)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Initial data fetch
  useEffect(() => {
    fetchData()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Auto-refresh every 4 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData()
    }, 240000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const canvas = canvasRef.current
        const container = containerRef.current
        const { width, height } = container.getBoundingClientRect()

        // Set a fixed height that fits within the card
        const fixedHeight = Math.min(height, 250)

        const devicePixelRatio = window.devicePixelRatio || 1

        canvas.width = width * devicePixelRatio
        canvas.height = fixedHeight * devicePixelRatio
        canvas.style.width = `${width}px`
        canvas.style.height = `${fixedHeight}px`

        const ctx = canvas.getContext("2d")
        ctx.scale(devicePixelRatio, devicePixelRatio)

        setCanvasWidth(width)
        setCanvasHeight(fixedHeight)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Draw the chart
  const drawChart = useCallback(() => {
    if (!canvasRef.current || paData.length === 0 || canvasWidth === 0 || canvasHeight === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Chart dimensions - reduced padding to fit better
    const padding = { top: 20, right: 20, bottom: 20, left: 60 }
    const chartWidth = canvasWidth - padding.left - padding.right
    const chartHeight = canvasHeight - padding.top - padding.bottom

    // Calculate max value for scaling
    // If all values are 0, set maxValue to 1 to avoid division by zero
    const allValuesZero = paData.every((item) => item.value === 0)
    const maxValue = allValuesZero ? 1 : Math.max(...paData.map((item) => item.value), 1)

    // Draw background grid
    ctx.beginPath()
    ctx.strokeStyle = alpha("#757575", 0.1)
    ctx.lineWidth = 1

    // Horizontal grid lines
    const gridLines = 4
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i
      ctx.moveTo(padding.left, y)
      ctx.lineTo(canvasWidth - padding.right, y)

      // Add value labels
      const value = Math.round(maxValue - (maxValue / gridLines) * i)
      ctx.fillStyle = "#757575"
      ctx.font = '500 10px "Inter", sans-serif'
      ctx.textAlign = "right"
      ctx.fillText(value.toString(), padding.left - 5, y + 4)
    }
    ctx.stroke()

    // Calculate bar height and spacing
    const barHeight = Math.min(30, (chartHeight / Math.max(paData.length, 1)) * 0.7)
    const barSpacing = chartHeight / Math.max(paData.length, 1) - barHeight

    // Draw bars and labels
    paData.forEach((item, index) => {
      const y = padding.top + (barHeight + barSpacing) * index + barSpacing / 2

      // Ensure barWidth is a valid number
      let barWidth = 0
      if (maxValue > 0 && isFinite(maxValue) && isFinite(item.value) && isFinite(animationProgress)) {
        barWidth = (item.value / maxValue) * chartWidth * animationProgress
      }

      // Ensure barWidth is valid and not too small
      barWidth = Math.max(0, Math.min(chartWidth, barWidth || 0))

      // Bar background
      ctx.fillStyle = alpha(item.color.light, 0.2)
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(padding.left, y, chartWidth, barHeight, [4])
      } else {
        // Fallback for browsers that don't support roundRect
        ctx.rect(padding.left, y, chartWidth, barHeight)
      }
      ctx.fill()

      // Actual bar - only draw if barWidth is valid
      if (barWidth > 0) {
        // Ensure all gradient coordinates are valid numbers
        const x1 = padding.left
        const y1 = 0
        const x2 = padding.left + barWidth
        const y2 = 0

        if (isFinite(x1) && isFinite(y1) && isFinite(x2) && isFinite(y2)) {
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
          gradient.addColorStop(0, item.color.main)
          gradient.addColorStop(1, alpha(item.color.light, 0.8))

          ctx.fillStyle = gradient
          ctx.beginPath()
          if (ctx.roundRect) {
            ctx.roundRect(padding.left, y, barWidth, barHeight, [4])
          } else {
            // Fallback for browsers that don't support roundRect
            ctx.rect(padding.left, y, barWidth, barHeight)
          }
          ctx.fill()

          // Add shine effect - only if barHeight is valid
          if (barHeight > 0) {
            const shineY1 = y
            const shineY2 = y + barHeight

            if (isFinite(shineY1) && isFinite(shineY2)) {
              const shineGradient = ctx.createLinearGradient(padding.left, shineY1, padding.left, shineY2)
              shineGradient.addColorStop(0, alpha("#ffffff", 0.3))
              shineGradient.addColorStop(0.5, alpha("#ffffff", 0))

              ctx.fillStyle = shineGradient
              ctx.beginPath()
              if (ctx.roundRect) {
                ctx.roundRect(padding.left, y, barWidth, barHeight / 2, [4, 4, 0, 0])
              } else {
                // Fallback for browsers that don't support roundRect
                ctx.rect(padding.left, y, barWidth, barHeight / 2)
              }
              ctx.fill()
            }
          }
        }
      }

      // PA name label
      ctx.fillStyle = hoveredItem === index ? "#000000" : "#757575"
      ctx.font = `${hoveredItem === index ? "600" : "500"} 12px "Inter", sans-serif`
      ctx.textAlign = "right"
      ctx.fillText(item.name, padding.left - 10, y + barHeight / 2 + 4)

      // Value label
      if (barWidth > 40) {
        ctx.fillStyle = "#ffffff"
        ctx.font = '600 12px "Inter", sans-serif'
        ctx.textAlign = "left"
        ctx.fillText(item.value.toString(), padding.left + barWidth - 30, y + barHeight / 2 + 4)
      } else {
        ctx.fillStyle = "#000000"
        ctx.font = '600 12px "Inter", sans-serif'
        ctx.textAlign = "left"
        ctx.fillText(item.value.toString(), padding.left + barWidth + 10, y + barHeight / 2 + 4)
      }

      // Store coordinates for hover detection
      item.coords = {
        x: padding.left,
        y,
        width: chartWidth,
        height: barHeight,
      }
    })

    // Draw title
    ctx.fillStyle = "#000000"
    ctx.font = '600 14px "Inter", sans-serif'
    ctx.textAlign = "left"
    ctx.fillText("Distribuição por PA", padding.left, padding.top - 8)

    // Draw total
    ctx.fillStyle = "#2196f3"
    ctx.font = '600 12px "Inter", sans-serif'
    ctx.textAlign = "right"
    ctx.fillText(`Total: ${totalValue}`, canvasWidth - padding.right, padding.top - 8)
  }, [paData, canvasWidth, canvasHeight, animationProgress, hoveredItem, totalValue])

  // Draw chart when data or dimensions change
  useEffect(() => {
    drawChart()
  }, [drawChart, paData, canvasWidth, canvasHeight, animationProgress, hoveredItem])

  // Handle mouse interactions
  const handleMouseMove = useCallback(
    (e) => {
      if (!canvasRef.current || paData.length === 0) return

      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      let hovered = null

      // Check if mouse is over any bar
      for (let i = 0; i < paData.length; i++) {
        const item = paData[i]
        if (
          item.coords &&
          x >= item.coords.x &&
          x <= item.coords.x + item.coords.width &&
          y >= item.coords.y &&
          y <= item.coords.y + item.coords.height
        ) {
          hovered = i
          break
        }
      }

      setHoveredItem(hovered)

      // Update cursor style
      canvas.style.cursor = hovered !== null ? "pointer" : "default"
    },
    [paData],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null)
  }, [])

  // Render loading state
  if (loading && paData.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography variant="body1">Carregando dados de distribuição...</Typography>
      </Box>
    )
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Fade in={chartsLoaded} timeout={800}>
      <Box
        ref={containerRef}
        sx={{
          height: "100%",
          maxHeight: "300px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {paData.length > 0 ? (
          <>
            <Box
              sx={{
                position: "relative",
                flex: 1,
                width: "100%",
                mb: 1,
              }}
            >
              <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 0.5,
                px: 1,
                pb: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {paData.map((item) => (
                  <Chip
                    key={item.name}
                    label={item.name}
                    size="small"
                    sx={{
                      backgroundColor: alpha(item.color.main, 0.1),
                      color: item.color.main,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      height: "20px",
                      "&:hover": {
                        backgroundColor: alpha(item.color.main, 0.2),
                      },
                    }}
                  />
                ))}
              </Box>

              {lastUpdated && (
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "#757575",
                    fontStyle: "italic",
                  }}
                >
                  Atualizado: {lastUpdated.toLocaleTimeString()}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
            <Typography>Nenhum dado disponível</Typography>
          </Box>
        )}
      </Box>
    </Fade>
  )
}

export default PADistributionChart
