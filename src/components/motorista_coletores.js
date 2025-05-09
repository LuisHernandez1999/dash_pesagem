"use client"
import { Box, Typography, Fade, alpha, Chip, Divider, Card } from "@mui/material"
import { Person, Group } from "@mui/icons-material"

// Dados dos motoristas e coletores que saíram
const stats = {
  totalDrivers: 23,
  totalCollectors: 42,
}

const DriverCollectorExitChart = ({ themeColors, chartsLoaded }) => {
  return (
    <Fade in={chartsLoaded} timeout={800}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Divider sx={{ mb: 3 }}>
          <Chip
            label="Saídas de Funcionários"
            size="small"
            sx={{
              backgroundColor: alpha(themeColors.success.main, 0.1),
              color: themeColors.success.main,
              fontWeight: 600,
            }}
          />
        </Divider>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          <Card
            elevation={0}
            sx={{
              p: 2,
              flex: "1 1 calc(50% - 12px)",
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              backgroundColor: alpha(themeColors.primary.main, 0.05),
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: alpha(themeColors.primary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Person sx={{ color: themeColors.primary.main, fontSize: 24 }} />
              </Box>
              <Typography sx={{ fontWeight: 600, color: themeColors.primary.main, fontSize: "1.1rem" }}>
                Motoristas que Saíram
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: "2.5rem", color: themeColors.text.primary, mb: 1 }}>
              {stats.totalDrivers}
            </Typography>
          </Card>

          <Card
            elevation={0}
            sx={{
              p: 2,
              flex: "1 1 calc(50% - 12px)",
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              backgroundColor: alpha(themeColors.secondary.main, 0.05),
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: alpha(themeColors.secondary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Group sx={{ color: themeColors.secondary.main, fontSize: 24 }} />
              </Box>
              <Typography sx={{ fontWeight: 600, color: themeColors.secondary.main, fontSize: "1.1rem" }}>
                Coletores que Saíram
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: "2.5rem", color: themeColors.text.primary, mb: 1 }}>
              {stats.totalCollectors}
            </Typography>
          </Card>
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Card
            elevation={0}
            sx={{
              p: 2,
              width: "100%",
              borderRadius: "16px",
              border: `1px solid ${themeColors.divider}`,
              backgroundColor: alpha(themeColors.success.main, 0.05),
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 600, color: themeColors.success.main }}>
                Total de Funcionários que Saíram:
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: themeColors.success.main }}>
                {stats.totalDrivers + stats.totalCollectors}
              </Typography>
            </Box>
          </Card>
        </Box>
      </Box>
    </Fade>
  )
}

export default DriverCollectorExitChart
