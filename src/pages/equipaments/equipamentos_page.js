"use client"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Box,
  Container,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from "@mui/material"
import { Construction, CheckCircle, Cancel, Today, Refresh, Menu as MenuIcon } from "@mui/icons-material"
import EquipmentTable from "../../components/equipamentes_table"
import WeeklyDistributionChart from "../../components/grafic_equipmanents"
import EquipmentListModal from "../../components/equipaments_list"

// Animation keyframes
const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideInUp: `
    @keyframes slideInUp {
      from {
        transform: translateY(15px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
  `,
}

// Theme colors
const themeColors = {
  primary: {
    main: "#3a86ff",
    light: "#5e9bff",
    dark: "#2970e6",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ff006e",
    light: "#ff4b93",
    dark: "#c8005a",
    contrastText: "#ffffff",
  },
  success: {
    main: "#00c896",
    light: "#33d3aa",
    dark: "#00a078",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ffbe0b",
    light: "#ffcb3d",
    dark: "#e6aa00",
    contrastText: "#ffffff",
  },
  error: {
    main: "#fb5607",
    light: "#fc7739",
    dark: "#e64e00",
    contrastText: "#ffffff",
  },
  info: {
    main: "#8338ec",
    light: "#9c5ff0",
    dark: "#6a2dbd",
    contrastText: "#ffffff",
  },
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    disabled: "#94a3b8",
  },
  background: {
    default: "#ffffff",
    paper: "#ffffff",
    card: "#ffffff",
    dark: "#0f172a",
  },
  divider: "rgba(226, 232, 240, 0.8)",
}

// Custom stat card component with click functionality
const CustomStatCard = ({ title, value, icon: Icon, color, highlight, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      background: "#ffffff",
      height: "100%",
      transition: "all 0.3s ease",
      cursor: "pointer",
      "&:hover": {
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        transform: "translateY(-4px)",
        "& .card-icon": {
          transform: "scale(1.1)",
        },
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        background: color,
        zIndex: 1,
      },
      animation: highlight ? `${keyframes.fadeIn} 0.6s ease-out` : `${keyframes.fadeIn} 0.6s ease-out`,
    }}
  >
    <Box
      className="card-icon"
      sx={{
        position: "absolute",
        top: "20px",
        right: "20px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: alpha(color, 0.1),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.3s ease",
      }}
    >
      <Icon sx={{ fontSize: 24, color: color }} />
    </Box>
    <CardContent sx={{ p: 3, pt: 4, pb: 5 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", sm: "2.5rem" },
          color: themeColors.text.primary,
          mb: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: themeColors.text.secondary,
          fontWeight: 500,
          fontSize: "0.95rem",
        }}
      >
        {title}
      </Typography>
    </CardContent>
  </Card>
)

export default function EquipmentDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // State variables
  const [loading, setLoading] = useState(false)
  const [statsData, setStatsData] = useState({
    totalEquipments: 45,
    activeEquipments: 38,
    inactiveEquipments: 7,
    maintenanceToday: 3,
  })

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  // Equipment list modal state
  const [listModalOpen, setListModalOpen] = useState(false)
  const [listModalTitle, setListModalTitle] = useState("")
  const [listModalFilter, setListModalFilter] = useState("")

  // Mock equipment data
  const [equipments, setEquipments] = useState([
    {
      id: 1,
      prefix: "CAR-001",
      type: "Carroceria",
      model: "Mercedes-Benz Atego 1719",
      status: "Ativo",
      location: "PA1 - Centro",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      operator: "João Silva",
      workingHours: 1250,
    },
    {
      id: 2,
      prefix: "PC-002",
      type: "Pá Carregadeira",
      model: "Caterpillar 924K",
      status: "Ativo",
      location: "PA2 - Norte",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-04-10",
      operator: "Maria Santos",
      workingHours: 980,
    },
    {
      id: 3,
      prefix: "RE-003",
      type: "Retroescavadeira",
      model: "JCB 3CX",
      status: "Inativo",
      location: "Oficina Central",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-02-20",
      operator: "-",
      workingHours: 1450,
    },
    {
      id: 4,
      prefix: "CAR-004",
      type: "Carroceria",
      model: "Volvo VM 270",
      status: "Ativo",
      location: "PA3 - Sul",
      lastMaintenance: "2024-01-12",
      nextMaintenance: "2024-04-12",
      operator: "Pedro Costa",
      workingHours: 1100,
    },
    {
      id: 5,
      prefix: "PC-005",
      type: "Pá Carregadeira",
      model: "Komatsu WA200",
      status: "Ativo",
      location: "PA1 - Centro",
      lastMaintenance: "2024-01-18",
      nextMaintenance: "2024-04-18",
      operator: "Ana Oliveira",
      workingHours: 850,
    },
    {
      id: 6,
      prefix: "RE-006",
      type: "Retroescavadeira",
      model: "Case 580N",
      status: "Manutenção",
      location: "Oficina Central",
      lastMaintenance: "2024-01-22",
      nextMaintenance: "2024-04-22",
      operator: "-",
      workingHours: 1320,
    },
  ])

  // Weekly distribution data
  const [weeklyData, setWeeklyData] = useState([
    { day: "Segunda", carroceria: 8, paCarregadeira: 5, retroescavadeira: 3 },
    { day: "Terça", carroceria: 10, paCarregadeira: 6, retroescavadeira: 4 },
    { day: "Quarta", carroceria: 12, paCarregadeira: 7, retroescavadeira: 5 },
    { day: "Quinta", carroceria: 9, paCarregadeira: 5, retroescavadeira: 3 },
    { day: "Sexta", carroceria: 11, paCarregadeira: 6, retroescavadeira: 4 },
    { day: "Sábado", carroceria: 6, paCarregadeira: 3, retroescavadeira: 2 },
    { day: "Domingo", carroceria: 4, paCarregadeira: 2, retroescavadeira: 1 },
  ])

  // Handle card clicks
  const handleCardClick = (cardType) => {
    switch (cardType) {
      case "total":
        setListModalTitle("Todos os Equipamentos")
        setListModalFilter("")
        break
      case "active":
        setListModalTitle("Equipamentos Ativos")
        setListModalFilter("Ativo")
        break
      case "inactive":
        setListModalTitle("Equipamentos Inativos")
        setListModalFilter("Inativo")
        break
      case "maintenance":
        setListModalTitle("Equipamentos em Manutenção")
        setListModalFilter("Manutenção")
        break
    }
    setListModalOpen(true)
  }

  // Handle refresh data
  const handleRefreshData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSnackbarMessage("Dados atualizados com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      setLoading(false)
    }, 1000)
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <style>
        {`
          ${keyframes.fadeIn}
          ${keyframes.slideInUp}
          ${keyframes.pulse}
        `}
      </style>

      {/* Main Content */}
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#ffffff" }}>
        {/* Header */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: `${themeColors.background.paper} !important`,
            color: `${themeColors.text.primary} !important`,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05) !important",
            position: "relative",
            zIndex: 10,
            transition: "all 0.3s ease",
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  pl: { xs: 0, sm: 2 },
                }}
              >
                <Box
                  sx={{
                    width: "6px",
                    height: { xs: "40px", sm: "60px" },
                    borderRadius: "8px",
                    background: `linear-gradient(180deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`,
                    mr: 3,
                    boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.4)}`,
                    animation: `${keyframes.pulse} 3s ease-in-out infinite`,
                  }}
                />
                <Box sx={{ position: "relative" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.7rem", sm: "2.3rem" },
                      color: themeColors.text.primary,
                      letterSpacing: "-0.01em",
                      fontFamily: "'Poppins', sans-serif",
                      position: "relative",
                      display: "inline-block",
                      background: `linear-gradient(90deg, ${themeColors.primary.dark} 0%, ${themeColors.primary.main} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0px 2px 5px rgba(0,0,0,0.05)",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "-6px",
                        left: "0",
                        width: "60%",
                        height: "4px",
                        background: `linear-gradient(90deg, ${themeColors.primary.main}, ${alpha(themeColors.primary.light, 0)})`,
                        borderRadius: "2px",
                      },
                    }}
                  >
                    Dashboard de Equipamentos
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: themeColors.text.secondary,
                      fontSize: { xs: "0.95rem", sm: "1.05rem" },
                      mt: "1rem",
                      fontWeight: 500,
                      letterSpacing: "0.03em",
                      opacity: 0.9,
                      pl: 0.5,
                      fontStyle: "italic",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: "-10px",
                        top: "50%",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: themeColors.primary.main,
                        boxShadow: `0 0 8px ${themeColors.primary.main}`,
                      },
                    }}
                  >
                    Gerenciamento de maquinário e equipamentos
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  color: themeColors.text.secondary,
                  "&:hover": {
                    color: themeColors.primary.main,
                    transform: "rotate(180deg)",
                    transition: "transform 0.5s ease-in-out",
                  },
                }}
                onClick={handleRefreshData}
              >
                <Refresh />
              </IconButton>
            </Box>
          </Toolbar>
          <Divider
            sx={{
              height: "1px",
              background: `linear-gradient(to right, ${alpha(themeColors.primary.main, 0.4)}, ${alpha(themeColors.primary.light, 0.1)})`,
            }}
          />
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            padding: { xs: "1rem", sm: "1.5rem" },
            animation: "fadeIn 1s ease-out",
            backgroundColor: "#ffffff",
          }}
        >
          <Container maxWidth="xl" disableGutters>
            {/* Stats Cards */}
            <Box component="section">
              <Box
                sx={{
                  display: "grid",
                  gap: "1.5rem",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  mb: 4,
                }}
              >
                <CustomStatCard
                  title="Total de Equipamentos"
                  value={statsData.totalEquipments}
                  icon={Construction}
                  color={themeColors.primary.main}
                  onClick={() => handleCardClick("total")}
                />
                <CustomStatCard
                  title="Equipamentos Ativos"
                  value={statsData.activeEquipments}
                  icon={CheckCircle}
                  color={themeColors.success.main}
                  onClick={() => handleCardClick("active")}
                />
                <CustomStatCard
                  title="Equipamentos Inativos"
                  value={statsData.inactiveEquipments}
                  icon={Cancel}
                  color={themeColors.error.main}
                  onClick={() => handleCardClick("inactive")}
                />
                <CustomStatCard
                  title="Em Manutenção"
                  value={statsData.maintenanceToday}
                  icon={Today}
                  color={themeColors.warning.main}
                  onClick={() => handleCardClick("maintenance")}
                />
              </Box>
            </Box>

            {/* Equipment Table */}
            <EquipmentTable
              equipments={equipments}
              loading={loading}
              themeColors={themeColors}
              onRefresh={handleRefreshData}
            />

            {/* Weekly Distribution Chart */}
            <WeeklyDistributionChart weeklyData={weeklyData} themeColors={themeColors} onRefresh={handleRefreshData} />
          </Container>
        </Box>
      </Box>

      {/* Equipment List Modal */}
      <EquipmentListModal
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        title={listModalTitle}
        equipments={equipments}
        themeColors={themeColors}
        statusFilter={listModalFilter}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
