"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Card, CardContent, alpha, Skeleton, Divider } from "@mui/material"
import { LocalShipping, LocationOn, Speed } from "@mui/icons-material"
import { contarSolturasSeletivaPorGaragem } from "../../../service/seletiva"

const PADistribution = ({ themeColors, chartsLoaded, keyframes }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalVehicles, setTotalVehicles] = useState(0)
  const [error, setError] = useState(null)

  const loadPAData = async () => {
    try {
      setLoading(true)
      const response = await contarSolturasSeletivaPorGaragem()

      if (response.success) {
        // Map the API response to our component's data format
        const colors = [
          themeColors.primary.main,
          themeColors.info.main,
          themeColors.warning.main,
          themeColors.secondary.main,
        ]

        const mappedData = response.garages.map((garage, index) => ({
          name: garage.garagem,
          value: garage.count,
          color: colors[index % colors.length],
          icon: <LocalShipping />,
          trend: "0%", // We don't have trend data from the API
          trendUp: true,
        }))

        setData(mappedData)
        setTotalVehicles(response.total)
        setError(null)
      } else {
        console.error("Erro ao carregar dados de distribuição por garagem:", response.error)
        setError(response.error || "Erro ao carregar dados")
      }
    } catch (err) {
      console.error("Erro ao carregar dados de distribuição por garagem:", err)
      setError("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPAData()

    // Set up refresh interval (8 minutes)
    const refreshInterval = setInterval(
      () => {
        loadPAData()
      },
      8 * 60 * 1000,
    )

    return () => clearInterval(refreshInterval)
  }, [themeColors])

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Total Card */}
        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            background: "#FFFFFF",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          {loading ? (
            <CardContent sx={{ p: 3 }}>
              <Skeleton
                variant="rectangular"
                width="60%"
                height={30}
                sx={{ bgcolor: alpha("#fff", 0.2), mb: 2, borderRadius: "8px" }}
              />
              <Skeleton
                variant="rectangular"
                width="40%"
                height={50}
                sx={{ bgcolor: alpha("#fff", 0.2), borderRadius: "8px" }}
              />
            </CardContent>
          ) : (
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography
                    sx={{
                      color: themeColors.text.primary,
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Speed /> Total de Veículos Saídos
                  </Typography>
                  <Typography
                    sx={{
                      color: themeColors.text.primary,
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      // animation removed
                    }}
                  >
                    {totalVehicles}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: alpha(themeColors.primary.main, 0.15),
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <LocalShipping sx={{ fontSize: 40, color: themeColors.primary.main }} />
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: `1px solid ${alpha("#fff", 0.2)}`,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ color: themeColors.text.secondary, fontSize: "0.9rem" }}>
                  Distribuídos em {data.length} pontos de apoio
                </Typography>
                {error ? (
                  <Typography
                    sx={{
                      color: themeColors.error.main,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Erro ao carregar dados
                  </Typography>
                ) : null}
              </Box>
            </CardContent>
          )}

          {/* Background decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: alpha(themeColors.primary.main, 0.05),
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: "50%",
              backgroundColor: alpha(themeColors.primary.main, 0.05),
              zIndex: 0,
            }}
          />
        </Card>

        {/* PA Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {loading
            ? // Skeleton loaders for PA cards
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <Card
                    key={index}
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                      height: 180,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: 3,
                    }}
                  >
                    <Skeleton variant="circular" width={50} height={50} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={40} />
                  </Card>
                ))
            : // Actual PA cards
              data.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    // animation removed
                    overflow: "hidden",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 12px 30px ${alpha(item.color, 0.2)}`,
                      "& .icon-container": {
                        transform: "scale(1.1)",
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "4px",
                      backgroundColor: item.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      className="icon-container"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "12px",
                        backgroundColor: alpha(item.color, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color,
                        mb: 2,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <LocationOn sx={{ fontSize: 30 }} />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: themeColors.text.primary,
                        mb: 0.5,
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                      <Typography
                        sx={{
                          fontSize: "2rem",
                          fontWeight: 700,
                          color: item.color,
                          lineHeight: 1,
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: themeColors.text.secondary,
                      }}
                    >
                      Veículos saídos hoje
                    </Typography>
                  </CardContent>
                </Card>
              ))}
        </Box>
      </Box>
    </>
  )
}

export default PADistribution
