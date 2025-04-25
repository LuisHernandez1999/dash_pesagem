import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts"
import { Box, Typography, Paper, alpha, Fade, Chip, Divider, IconButton, Tooltip as MuiTooltip } from "@mui/material"
import { TrendingUp, TrendingDown, Info } from "@mui/icons-material"

// PA Distribution Chart Component
const PADistributionChart = ({ chartsLoaded, themeColors }) => {
  // Sample data for PA distribution
  const paData = [
    { name: "PA1", value: 42, color: themeColors.info.main, percent: "45%", trend: "+5%", trendType: "up" },
    { name: "PA2", value: 28, color: themeColors.primary.main, percent: "30%", trend: "+2%", trendType: "up" },
    { name: "PA3", value: 15, color: themeColors.warning.main, percent: "16%", trend: "-3%", trendType: "down" },
    { name: "PA4", value: 8, color: themeColors.success.main, percent: "9%", trend: "+1%", trendType: "up" },
  ]

  // Custom tooltip for the chart
  const PATooltip = ({ active, payload }) => {
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
              background: `linear-gradient(90deg, ${data.color}, ${alpha(data.color, 0.7)})`,
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
              color: themeColors.text.primary,
              borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
              paddingBottom: "0.5rem",
            }}
          >
            {data.name}
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
                  backgroundColor: data.color,
                }}
              />
              <Typography sx={{ color: themeColors.text.secondary, fontWeight: 500 }}>Veículos:</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>{data.value}</Typography>
          </Box>

          <Box sx={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(226, 232, 240, 0.8)" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ color: themeColors.text.secondary, fontWeight: 500, fontSize: "0.875rem" }}>
                Percentual:
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: data.color,
                }}
              >
                {data.percent}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 1,
              }}
            >
              <Typography sx={{ color: themeColors.text.secondary, fontWeight: 500, fontSize: "0.875rem" }}>
                Tendência:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: data.trendType === "up" ? themeColors.success.main : themeColors.error.main,
                }}
              >
                {data.trendType === "up" ? (
                  <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  {data.trend}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )
    }
    return null
  }

  return (
    <Fade in={chartsLoaded} timeout={800}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Chart Section */}
        <Box
          sx={{
            flex: 1,
            height: { xs: "250px", md: "100%" },
            width: { xs: "100%", md: "60%" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: themeColors.text.primary, fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip content={<PATooltip />} />
              <Bar dataKey="value" name="Veículos" radius={[0, 4, 4, 0]} barSize={30}>
                {paData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    filter={`drop-shadow(0px 2px 3px ${alpha(entry.color, 0.3)})`}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  fill={themeColors.text.primary}
                  fontSize={12}
                  fontWeight={600}
                  formatter={(value) => `${value} veículos`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 2,
            width: { xs: "100%", md: "40%" },
          }}
        >
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: themeColors.text.primary,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Distribuição de Veículos por Garagem
              </Typography>
              <MuiTooltip title="Dados atualizados hoje às 08:00">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </MuiTooltip>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              {paData.map((item) => (
                <Paper
                  key={item.name}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: `1px solid ${themeColors.divider}`,
                    background: alpha(item.color, 0.05),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 16px ${alpha(item.color, 0.15)}`,
                      border: `1px solid ${alpha(item.color, 0.3)}`,
                    },
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "5px",
                      height: "100%",
                      background: item.color,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mb: 1 }}>
                    <Chip
                      label={item.name}
                      size="small"
                      sx={{
                        backgroundColor: alpha(item.color, 0.1),
                        color: item.color,
                        fontWeight: 600,
                        height: "24px",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: item.color,
                      mb: 0.5,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: themeColors.text.secondary,
                      fontSize: "0.8rem",
                    }}
                  >
                    {item.percent} do total
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Summary Section removed as requested */}
        </Box>
      </Box>
    </Fade>
  )
}

export default PADistributionChart
