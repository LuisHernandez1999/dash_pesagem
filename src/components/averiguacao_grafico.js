"use client"

import { Box, alpha, Typography } from "@mui/material"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  LabelList,
  ReferenceLine,
} from "recharts"
import { useState, useEffect } from "react"

// Componente de tooltip personalizado com design profissional
const CustomTooltip = ({ active, payload, label, themeColors }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: "white",
          padding: "16px",
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          minWidth: "200px",
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: "-8px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "16px",
            height: "16px",
            backgroundColor: "white",
            boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.08)",
            zIndex: -1,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: themeColors.text.primary,
            marginBottom: "8px",
            borderBottom: `1px solid ${alpha(themeColors.divider, 0.5)}`,
            paddingBottom: "8px",
            textAlign: "center",
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "3px",
              backgroundColor: payload[0].color,
            }}
          />
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              color: payload[0].color,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {payload[0].value}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: "12px",
            color: themeColors.text.secondary,
            fontStyle: "italic",
          }}
        >
          {Math.round((payload[0].value / 8) * 100)}% do total de averiguações
        </Typography>
      </Box>
    )
  }
  return null
}

// Componente de rótulo personalizado para as barras
const CustomizedLabel = (props) => {
  const { x, y, width, height, value, fill } = props
  return (
    <text
      x={x + width / 2}
      y={y - 10}
      fill={fill}
      textAnchor="middle"
      dominantBaseline="middle"
      fontWeight="600"
      fontSize="13"
    >
      {value}
    </text>
  )
}

const BarChartComponent = ({ data, themeColors, title, loading = false }) => {
  const [activeIndex, setActiveIndex] = useState(null)
  const [animatedData, setAnimatedData] = useState(data.map((item) => ({ ...item, value: 0 })))

  // Efeito de animação para os dados
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setAnimatedData(data)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [data, loading])

  // Adicionar gradientes para cada barra
  const renderGradients = () => {
    return data.map((entry, index) => (
      <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
        <stop offset="95%" stopColor={alpha(entry.color, 0.6)} stopOpacity={1} />
      </linearGradient>
    ))
  }

  // Calcular o valor máximo para o eixo Y com um pouco de espaço extra
  const maxValue = Math.max(...data.map((item) => item.value)) * 1.3

  // Manipuladores de eventos para interatividade
  const handleMouseEnter = (_, index) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "500px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: "20px 10px",
        borderRadius: "16px",
        background: "white", // Fundo branco simples, sem detalhe cinza
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)",
      }}
    >
      {!loading ? (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={animatedData}
            margin={{
              top: 50,
              right: 40,
              left: 20,
              bottom: 60,
            }}
            barSize={40} // Largura das barras
            barGap={12}
            barCategoryGap="25%"
            onMouseMove={(e) => e && e.activeTooltipIndex !== undefined && handleMouseEnter(e, e.activeTooltipIndex)}
            onMouseLeave={handleMouseLeave}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            <defs>
              {renderGradients()}

              {/* Sombra para as barras */}
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
              </filter>

              {/* Efeito 3D para as barras */}
              <filter id="bevel" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
                <feSpecularLighting
                  in="blur"
                  surfaceScale="5"
                  specularConstant="0.5"
                  specularExponent="10"
                  lightingColor="white"
                  result="specOut"
                >
                  <fePointLight x="-5000" y="-10000" z="20000" />
                </feSpecularLighting>
                <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                <feComposite
                  in="SourceGraphic"
                  in2="specOut"
                  operator="arithmetic"
                  k1="0"
                  k2="1"
                  k3="1"
                  k4="0"
                  result="litPaint"
                />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="litPaint" />
                </feMerge>
              </filter>
            </defs>

            {/* Fundo estilizado */}
            <rect width="100%" height="100%" fill="white" />

            {/* Linhas de grade mais visíveis */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true} // Adicionando linhas verticais
              horizontal={true} // Mantendo linhas horizontais
              stroke={alpha(themeColors.divider, 0.6)} // Tornando as linhas mais visíveis
              strokeWidth={1}
            />

            {/* Linha de referência para zero */}
            <ReferenceLine y={0} stroke={themeColors.divider} strokeWidth={1.5} />

            {/* Eixo X com estilo melhorado */}
            <XAxis
              dataKey="name"
              tick={{
                fill: themeColors.text.primary,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Montserrat', sans-serif",
              }}
              axisLine={{ stroke: themeColors.divider, strokeWidth: 1.5 }}
              tickLine={false}
              dy={12}
              padding={{ left: 40, right: 40 }}
            />

            {/* Eixo Y com estilo melhorado */}
            <YAxis
              tick={{
                fill: themeColors.text.secondary,
                fontSize: 12,
                fontFamily: "'Roboto', sans-serif",
              }}
              axisLine={{ stroke: themeColors.divider, strokeWidth: 0.5 }}
              tickLine={false}
              dx={-10}
              tickFormatter={(value) => value.toLocaleString()}
              domain={[0, maxValue]}
              padding={{ top: 30 }}
              allowDecimals={false}
            />

            {/* Tooltip personalizado */}
            <Tooltip
              content={<CustomTooltip themeColors={themeColors} />}
              cursor={{ fill: alpha(themeColors.primary.main, 0.05) }}
            />

            {/* Legenda estilizada */}
            <Legend
              verticalAlign="top"
              height={60}
              formatter={(value) => (
                <span
                  style={{
                    color: themeColors.text.primary,
                    fontSize: "15px",
                    fontWeight: 600,
                    fontFamily: "'Montserrat', sans-serif",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: alpha(themeColors.background.default, 0.5),
                  }}
                >
                  {value === "Quantidade de Averiguações" ? "Averiguações" : value}
                </span>
              )}
              wrapperStyle={{
                paddingTop: "15px",
              }}
            />

            {/* Barras com animação e estilo melhorados */}
            <Bar
              dataKey="value"
              name="Averiguações"
              radius={[8, 8, 0, 0]} // Bordas arredondadas no topo
              animationDuration={2000}
              animationEasing="ease-in-out"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#barGradient-${index})`}
                  stroke={entry.color}
                  strokeWidth={1.5}
                  style={{
                    filter:
                      activeIndex === index
                        ? "url(#bevel) drop-shadow(0 6px 8px rgba(0,0,0,0.2)) brightness(1.1)"
                        : "url(#shadow)",
                    cursor: "pointer",
                    transition: "filter 0.3s ease, transform 0.3s ease",
                    transform: activeIndex === index ? "translateY(-5px)" : "translateY(0)",
                  }}
                />
              ))}

              {/* Rótulos nas barras */}
              <LabelList dataKey="value" position="top" content={<CustomizedLabel />} />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      ) : (
        <Box
          sx={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.light})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            animation: `pulse 1.5s ease-in-out infinite`,
          }}
        />
      )}

      {/* Título do gráfico */}
      <Typography
        sx={{
          position: "absolute",
          top: 10,
          left: 20,
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: 600,
          color: themeColors.text.secondary,
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          background: alpha(themeColors.background.paper, 0.7),
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {title || "Distribuição por Tipo"}
      </Typography>

      {/* Nota de rodapé */}
      <Typography
        sx={{
          position: "absolute",
          bottom: 10,
          right: 20,
          fontSize: "11px",
          fontStyle: "italic",
          color: themeColors.text.disabled,
          background: alpha(themeColors.background.paper, 0.7),
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        Dados atualizados em tempo real
      </Typography>
    </Box>
  )
}

export default BarChartComponent
