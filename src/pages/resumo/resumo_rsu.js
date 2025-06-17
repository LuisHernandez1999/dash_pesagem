"use client"

import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Fade,
  Zoom,
} from "@mui/material"
import {
  LocalShipping,
  People,
  Engineering,
  Today,
  Refresh,
  Menu as MenuIcon,
  RecyclingRounded,
  Home,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import StatCard from "../../components/rsu_stats"
import SummaryCard from "../../components/summary_rsu"
import EquipmentCard from "../../components/rsu_equipaments"
import WorkforceCard from "../../components/work"
import EquipmentChart from "../../components/equipament_chart"
import WorkforceChart from "../../components/work_chart"
import PADistributionChart from "../../components/pa_chart"
import CollectionTypeChart from "../../components/coleta_chart"
import { getDashGeral } from "../../service/geral"

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
  float: `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
      100% { transform: translateY(0px); }
    }
  `,
  gradientShift: `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `,
  rotate: `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0); }
    }
  `,
  glow: `
    @keyframes glow {
      0% { box-shadow: 0 0 5px rgba(26, 35, 126, 0.2); }
      50% { box-shadow: 0 0 15px rgba(26, 35, 126, 0.4); }
      100% { box-shadow: 0 0 5px rgba(26, 35, 126, 0.2); }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from {
        transform: translateX(15px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        transform: translateX(-15px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1
      }
    }
  `,
  zoomIn: `
    @keyframes zoomIn {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  heartbeat: `
    @keyframes heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.05); }
      28% { transform: scale(1); }
      42% { transform: scale(1.05); }
      70% { transform: scale(1); }
    }
  `,
  flashHighlight: `
  @keyframes flashHighlight {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 0 50px rgba(255, 193, 7, 0.6);
    }
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
    main: "#4CAF50",
    light: "#81C784",
    dark: "#388E3C",
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
    default: "#f8fafc",
    paper: "#ffffff",
    card: "#ffffff",
    dark: "#0f172a",
  },
  divider: "rgba(226, 232, 240, 0.8)",
}

// Valores fixos de previsto para RSU/Domiciliar
const PREVISTO_RSU = {
  equipamentos: 45,
  coletores: 178,
  motoristas: 59,
}

// Valores fixos de previsto para Seletiva
const PREVISTO_SELETIVA = {
  equipamentos: 45,
  coletores: 36,
  motoristas: 18,
}

export default function RCUControlDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State variables
  const [currentTime, setCurrentTime] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [tabValue, setTabValue] = useState(0)
  const [highlightedStat, setHighlightedStat] = useState(null)
  const [chartsLoaded, setChartsLoaded] = useState(false)

  // API Data State
  const [apiData, setApiData] = useState(null)
  const [currentDate, setCurrentDate] = useState("")

  // Dados processados da API
  const [domiciliarEquipamentos, setDomiciliarEquipamentos] = useState([])
  const [domiciliarMaoDeObra, setDomiciliarMaoDeObra] = useState([])
  const [domiciliarResumo, setDomiciliarResumo] = useState([])
  const [seletivaEquipamentos, setSeletivaEquipamentos] = useState([])
  const [seletivaMaoDeObra, setSeletivaMaoDeObra] = useState([])
  const [seletivaResumo, setSeletivaResumo] = useState([])
  const [equipamentosChartData, setEquipamentosChartData] = useState([])
  const [maoDeObraChartData, setMaoDeObraChartData] = useState([])
  const [paDistributionData, setPaDistributionData] = useState([])
  const [collectionTypeData, setCollectionTypeData] = useState([])

  const [domiciliarEquipamentosChartData, setDomiciliarEquipamentosChartData] = useState([])
  const [domiciliarMaoDeObraChartData, setDomiciliarMaoDeObraChartData] = useState([])
  const [domiciliarPaDistributionData, setDomiciliarPaDistributionData] = useState([])
  const [domiciliarCollectionTypeData, setDomiciliarCollectionTypeData] = useState([])

  const [seletivaEquipamentosChartData, setSeletivaEquipamentosChartData] = useState([])
  const [seletivaMaoDeObraChartData, setSeletivaMaoDeObraChartData] = useState([])
  const [seletivaPaDistributionData, setSeletivaPaDistributionData] = useState([])
  const [seletivaCollectionTypeData, setSeletivaCollectionTypeData] = useState([])

  // Estatísticas gerais
  const [statsData, setStatsData] = useState({
    domiciliar: {
      totalEquipamentos: 0,
      totalMotoristas: 0,
      totalColetores: 0,
      totalFaltas: 0,
    },
    seletiva: {
      totalEquipamentos: 0,
      totalMotoristas: 0,
      totalColetores: 0,
      totalFaltas: 0,
    },
  })

  // Corrigir erro de hidratação
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Atualizar relógio a cada segundo
  useEffect(() => {
    if (!isClient) return

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }

    updateTime() // Atualizar imediatamente
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [isClient])

  // Função para processar dados da API
  const processApiData = (data) => {
    if (!data) return

    console.log("Processando dados da API:", data)

    // Processar dados para Domiciliar (RSU)
    const domiciliarEquip = []
    const domiciliarMO = []
    let totalDomiciliarEquipRealizado = 0
    let totalDomiciliarMotoristasRealizado = 0
    let totalDomiciliarColetoresRealizado = 0

    // Processar dados para Seletiva
    const seletivaEquip = []
    const seletivaMO = []
    let totalSeletivaEquipRealizado = 0
    let totalSeletivaMotoristasRealizado = 0
    let totalSeletivaColetoresRealizado = 0

    // Dados para gráficos
    const equipChartData = []
    const moChartData = []
    const paDistData = []

    // Processar cada PA
    const pasArray = ["PA1", "PA2", "PA3", "PA4"]

    pasArray.forEach((pa, index) => {
      const paNumber = (index + 1).toString()
      const paData = data[pa]

      console.log(`Processando ${pa}:`, paData)

      if (paData) {
        // Domiciliar (RSU na API)
        const domiciliar = paData.Domiciliar
        if (domiciliar) {
          console.log(`${pa} - Domiciliar:`, domiciliar)

          const realizadoVeiculos = domiciliar.veiculos || 0
          const realizadoMotoristas = domiciliar.motoristas || 0
          const realizadoColetores = domiciliar.coletores || 0

          // Para equipamentos, usar o valor de veículos como base
          domiciliarEquip.push({
            pa: paNumber,
            previsto: Math.round(PREVISTO_RSU.equipamentos / 4), // Dividir por 4 PAs
            realizado: realizadoVeiculos,
            manutencao: 0,
            reservas: 0,
          })

          domiciliarMO.push({
            pa: paNumber,
            previstoMotorista: Math.round(PREVISTO_RSU.motoristas / 4), // Dividir por 4 PAs
            realizadoMotorista: realizadoMotoristas,
            previstoColetores: Math.round(PREVISTO_RSU.coletores / 4), // Dividir por 4 PAs
            realizadoColetores: realizadoColetores,
            faltas:
              Math.round(PREVISTO_RSU.motoristas / 4) -
              realizadoMotoristas +
              (Math.round(PREVISTO_RSU.coletores / 4) - realizadoColetores),
          })

          totalDomiciliarEquipRealizado += realizadoVeiculos
          totalDomiciliarMotoristasRealizado += realizadoMotoristas
          totalDomiciliarColetoresRealizado += realizadoColetores
        } else {
          // Adicionar dados zerados se não houver dados
          domiciliarEquip.push({
            pa: paNumber,
            previsto: Math.round(PREVISTO_RSU.equipamentos / 4),
            realizado: 0,
            manutencao: 0,
            reservas: 0,
          })

          domiciliarMO.push({
            pa: paNumber,
            previstoMotorista: Math.round(PREVISTO_RSU.motoristas / 4),
            realizadoMotorista: 0,
            previstoColetores: Math.round(PREVISTO_RSU.coletores / 4),
            realizadoColetores: 0,
            faltas: Math.round(PREVISTO_RSU.motoristas / 4) + Math.round(PREVISTO_RSU.coletores / 4),
          })
        }

        // Seletiva
        const seletiva = paData.Seletiva
        if (seletiva) {
          console.log(`${pa} - Seletiva:`, seletiva)

          const realizadoVeiculos = seletiva.veiculos || 0
          const realizadoMotoristas = seletiva.motoristas || 0
          const realizadoColetores = seletiva.coletores || 0

          seletivaEquip.push({
            pa: paNumber,
            previsto: Math.round(PREVISTO_SELETIVA.equipamentos / 4),
            realizado: realizadoVeiculos,
            manutencao: 0,
            reservas: 0,
          })

          seletivaMO.push({
            pa: paNumber,
            previstoMotorista: Math.round(PREVISTO_SELETIVA.motoristas / 4),
            realizadoMotorista: realizadoMotoristas,
            previstoColetores: Math.round(PREVISTO_SELETIVA.coletores / 4),
            realizadoColetores: realizadoColetores,
            faltas:
              Math.round(PREVISTO_SELETIVA.motoristas / 4) -
              realizadoMotoristas +
              (Math.round(PREVISTO_SELETIVA.coletores / 4) - realizadoColetores),
          })

          totalSeletivaEquipRealizado += realizadoVeiculos
          totalSeletivaMotoristasRealizado += realizadoMotoristas
          totalSeletivaColetoresRealizado += realizadoColetores
        } else {
          // Adicionar dados zerados se não houver dados
          seletivaEquip.push({
            pa: paNumber,
            previsto: Math.round(PREVISTO_SELETIVA.equipamentos / 4),
            realizado: 0,
            manutencao: 0,
            reservas: 0,
          })

          seletivaMO.push({
            pa: paNumber,
            previstoMotorista: Math.round(PREVISTO_SELETIVA.motoristas / 4),
            realizadoMotorista: 0,
            previstoColetores: Math.round(PREVISTO_SELETIVA.coletores / 4),
            realizadoColetores: 0,
            faltas: Math.round(PREVISTO_SELETIVA.motoristas / 4) + Math.round(PREVISTO_SELETIVA.coletores / 4),
          })
        }

        // Dados para gráficos
        const totalEquipPA = (domiciliar?.veiculos || 0) + (seletiva?.veiculos || 0)
        const totalMotoristasPA = (domiciliar?.motoristas || 0) + (seletiva?.motoristas || 0)
        const totalColetoresPA = (domiciliar?.coletores || 0) + (seletiva?.coletores || 0)

        equipChartData.push({
          name: `PA${paNumber}`,
          previsto: Math.round((PREVISTO_RSU.equipamentos + PREVISTO_SELETIVA.equipamentos) / 4),
          realizado: totalEquipPA,
          manutencao: 0,
          reservas: 0,
        })

        moChartData.push({
          name: `PA${paNumber}`,
          motoristas: totalMotoristasPA,
          coletores: totalColetoresPA,
        })

        paDistData.push({
          name: `PA${paNumber}`,
          value: totalEquipPA,
          color: [themeColors.primary.main, themeColors.success.main, themeColors.warning.main, themeColors.error.main][
            index
          ],
        })
      }
    })

    // Dados específicos para gráficos da Seletiva
    const seletivaEquipChartData = []
    const seletivaMoChartData = []
    const seletivaPaDistData = []

    // Dados específicos para gráficos da Domiciliar
    const domiciliarEquipChartData = []
    const domiciliarMoChartData = []
    const domiciliarPaDistData = []

    // Processar dados específicos por seção
    pasArray.forEach((pa, index) => {
      const paNumber = (index + 1).toString()
      const paData = data[pa]

      if (paData) {
        const domiciliar = paData.Domiciliar
        const seletiva = paData.Seletiva

        // Gráficos específicos para Domiciliar
        domiciliarEquipChartData.push({
          name: `PA${paNumber}`,
          previsto: Math.round(PREVISTO_RSU.equipamentos / 4),
          realizado: domiciliar?.veiculos || 0,
          manutencao: 0,
          reservas: 0,
        })

        domiciliarMoChartData.push({
          name: `PA${paNumber}`,
          motoristas: domiciliar?.motoristas || 0,
          coletores: domiciliar?.coletores || 0,
        })

        domiciliarPaDistData.push({
          name: `PA${paNumber}`,
          value: domiciliar?.veiculos || 0,
          color: [themeColors.primary.main, themeColors.success.main, themeColors.warning.main, themeColors.error.main][
            index
          ],
        })

        // Gráficos específicos para Seletiva
        seletivaEquipChartData.push({
          name: `PA${paNumber}`,
          previsto: Math.round(PREVISTO_SELETIVA.equipamentos / 4),
          realizado: seletiva?.veiculos || 0,
          manutencao: 0,
          reservas: 0,
        })

        seletivaMoChartData.push({
          name: `PA${paNumber}`,
          motoristas: seletiva?.motoristas || 0,
          coletores: seletiva?.coletores || 0,
        })

        seletivaPaDistData.push({
          name: `PA${paNumber}`,
          value: seletiva?.veiculos || 0,
          color: [themeColors.primary.main, themeColors.success.main, themeColors.warning.main, themeColors.error.main][
            index
          ],
        })
      }
    })

    // Dados específicos para tipos de coleta por seção
    const domiciliarCollectionData = [
      { name: "Domiciliar", value: totalDomiciliarEquipRealizado, color: themeColors.primary.main },
    ]

    const seletivaCollectionData = [
      { name: "Seletiva", value: totalSeletivaEquipRealizado, color: themeColors.success.main },
    ]

    // Calcular faltas totais e separadas
    const totalDomiciliarFaltas =
      PREVISTO_RSU.motoristas -
      totalDomiciliarMotoristasRealizado +
      (PREVISTO_RSU.coletores - totalDomiciliarColetoresRealizado)
    const totalSeletivaFaltas =
      PREVISTO_SELETIVA.motoristas -
      totalSeletivaMotoristasRealizado +
      (PREVISTO_SELETIVA.coletores - totalSeletivaColetoresRealizado)

    // Faltas separadas
    const faltasMotoristasRSU = PREVISTO_RSU.motoristas - totalDomiciliarMotoristasRealizado
    const faltasColetoresRSU = PREVISTO_RSU.coletores - totalDomiciliarColetoresRealizado
    const faltasMotoristasSelativa = PREVISTO_SELETIVA.motoristas - totalSeletivaMotoristasRealizado
    const faltasColetoresSeletiva = PREVISTO_SELETIVA.coletores - totalSeletivaColetoresRealizado

    console.log("Totais calculados:")
    console.log(
      "Domiciliar - Equipamentos:",
      totalDomiciliarEquipRealizado,
      "Motoristas:",
      totalDomiciliarMotoristasRealizado,
      "Coletores:",
      totalDomiciliarColetoresRealizado,
      "Faltas:",
      totalDomiciliarFaltas,
    )
    console.log(
      "Seletiva - Equipamentos:",
      totalSeletivaEquipRealizado,
      "Motoristas:",
      totalSeletivaMotoristasRealizado,
      "Coletores:",
      totalSeletivaColetoresRealizado,
      "Faltas:",
      totalSeletivaFaltas,
    )

    // Resumos com faltas separadas
    const domiciliarRes = [
      { label: "Mot. Previsto", value: PREVISTO_RSU.motoristas },
      { label: "Mot. Realizado", value: totalDomiciliarMotoristasRealizado },
      { label: "Mot. Faltantes", value: faltasMotoristasRSU },
      { label: "Col. Previsto", value: PREVISTO_RSU.coletores },
      { label: "Col. Realizado", value: totalDomiciliarColetoresRealizado },
      { label: "Col. Faltantes", value: faltasColetoresRSU },
      { label: "Faltas Totais", value: totalDomiciliarFaltas },
    ]

    const seletivaRes = [
      { label: "Mot. Previsto", value: PREVISTO_SELETIVA.motoristas },
      { label: "Mot. Realizado", value: totalSeletivaMotoristasRealizado },
      { label: "Mot. Faltantes", value: faltasMotoristasSelativa },
      { label: "Col. Previsto", value: PREVISTO_SELETIVA.coletores },
      { label: "Col. Realizado", value: totalSeletivaColetoresRealizado },
      { label: "Col. Faltantes", value: faltasColetoresSeletiva },
      { label: "Faltas Totais", value: totalSeletivaFaltas },
    ]

    const collectionData = [
      { name: "Domiciliar", value: totalDomiciliarEquipRealizado, color: themeColors.primary.main },
      { name: "Seletiva", value: totalSeletivaEquipRealizado, color: themeColors.success.main },
    ]

    // Atualizar states
    setDomiciliarEquipamentos(domiciliarEquip)
    setDomiciliarMaoDeObra(domiciliarMO)
    setDomiciliarResumo(domiciliarRes)
    setSeletivaEquipamentos(seletivaEquip)
    setSeletivaMaoDeObra(seletivaMO)
    setSeletivaResumo(seletivaRes)
    setEquipamentosChartData(equipChartData)
    setMaoDeObraChartData(moChartData)
    setPaDistributionData(paDistData)
    setCollectionTypeData(collectionData)

    // Atualizar states específicos
    setDomiciliarEquipamentosChartData(domiciliarEquipChartData)
    setDomiciliarMaoDeObraChartData(domiciliarMoChartData)
    setDomiciliarPaDistributionData(domiciliarPaDistData)
    setDomiciliarCollectionTypeData(domiciliarCollectionData)

    setSeletivaEquipamentosChartData(seletivaEquipChartData)
    setSeletivaMaoDeObraChartData(seletivaMoChartData)
    setSeletivaPaDistributionData(seletivaPaDistData)
    setSeletivaCollectionTypeData(seletivaCollectionData)

    setStatsData({
      domiciliar: {
        totalEquipamentos: totalDomiciliarEquipRealizado,
        totalMotoristas: totalDomiciliarMotoristasRealizado,
        totalColetores: totalDomiciliarColetoresRealizado,
        totalFaltas: totalDomiciliarFaltas,
      },
      seletiva: {
        totalEquipamentos: totalSeletivaEquipRealizado,
        totalMotoristas: totalSeletivaMotoristasRealizado,
        totalColetores: totalSeletivaColetoresRealizado,
        totalFaltas: totalSeletivaFaltas,
      },
    })

    console.log("Dados processados com sucesso!")
  }

  // Carregar dados da API
  const loadData = async () => {
    try {
      setLoading(true)
      console.log("Carregando dados da API...")
      const data = await getDashGeral()
      console.log("Dados recebidos da API:", data)
      setApiData(data)
      setCurrentDate(data.data || "")
      processApiData(data)
      setChartsLoaded(true)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setSnackbarMessage("Erro ao carregar dados da API: " + error.message)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados na inicialização
  useEffect(() => {
    loadData()
  }, [])

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Handle refresh data
  const handleRefreshData = () => {
    loadData()
    setSnackbarMessage("Dados atualizados com sucesso!")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)
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
          ${keyframes.float}
          ${keyframes.gradientShift}
          ${keyframes.shimmer}
          ${keyframes.rotate}
          ${keyframes.bounce}
          ${keyframes.glow}
          ${keyframes.slideInRight}
          ${keyframes.slideInLeft}
          ${keyframes.zoomIn}
          ${keyframes.heartbeat}
          ${keyframes.flashHighlight}
        `}
      </style>
      {/* Main Content */}
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar onCollapse={handleSidebarCollapse} />

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#ffffff",
            marginLeft: {
              xs: 0,
              sm: sidebarCollapsed ? "80px" : "280px",
            },
            width: {
              xs: "100%",
              sm: sidebarCollapsed ? "calc(100% - 80px)" : "calc(100% - 280px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {/* Header */}
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: "#ffffff",
              color: themeColors.text.primary,
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              position: "relative",
              zIndex: 10,
              transition: "all 0.3s ease",
              borderBottom: `2px solid ${alpha(themeColors.primary.main, 0.1)}`,
            }}
          >
            <Toolbar sx={{ minHeight: { xs: 64, sm: 80 }, px: { xs: 2, sm: 3 } }}>
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{
                    mr: 2,
                    backgroundColor: alpha(themeColors.primary.main, 0.1),
                    "&:hover": { backgroundColor: alpha(themeColors.primary.main, 0.2) },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  gap: 3,
                }}
              >
                {/* Logo e Título */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                 

                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.2rem" },
                        color: themeColors.text.primary,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      Controle de Rsu e Seletiva
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: themeColors.text.secondary,
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Sistema de Gestão Operacional
                    </Typography>
                  </Box>
                </Box>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Data e Relógio */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: alpha(themeColors.primary.main, 0.05),
                    borderRadius: "12px",
                    padding: { xs: "8px 12px", sm: "12px 16px" },
                    border: `1px solid ${alpha(themeColors.primary.main, 0.1)}`,
                  }}
                >
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: themeColors.text.secondary,
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {currentDate || "Carregando..."}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: themeColors.text.primary,
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                        letterSpacing: "1px",
                      }}
                    >
                      {isClient ? currentTime : "--:--:--"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      animation: `${keyframes.pulse} 2s infinite`,
                      boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
                    }}
                  />
                </Box>

                {/* Botão de Refresh */}
                <IconButton
                  sx={{
                    color: themeColors.text.secondary,
                    backgroundColor: alpha(themeColors.primary.main, 0.05),
                    border: `1px solid ${alpha(themeColors.primary.main, 0.1)}`,
                    "&:hover": {
                      backgroundColor: alpha(themeColors.primary.main, 0.1),
                      transform: "scale(1.05)",
                      color: themeColors.primary.main,
                    },
                    transition: "all 0.2s ease",
                  }}
                  onClick={handleRefreshData}
                >
                  <Refresh />
                </IconButton>
              </Box>
            </Toolbar>

            {/* Linha decorativa */}
            <Box
              sx={{
                height: "3px",
                background: `linear-gradient(90deg, ${themeColors.primary.main} 0%, ${themeColors.success.main} 50%, ${themeColors.info.main} 100%)`,
                animation: `${keyframes.gradientShift} 3s ease infinite`,
                backgroundSize: "200% 200%",
              }}
            />
          </AppBar>

          {/* Tabs */}
          <Box sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)" }}>
            <Container maxWidth="xl">
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    minHeight: 56,
                  },
                  "& .Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.primary.main,
                    height: 3,
                  },
                }}
              >
                <Tab icon={<Home sx={{ fontSize: 20 }} />} iconPosition="start" label="Coleta Domiciliar - Diurno" />
                <Tab
                  icon={<RecyclingRounded sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Coleta Seletiva - Diurno"
                />
              </Tabs>
            </Container>
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flex: 1,
              padding: { xs: "1rem", sm: "1.5rem" },
              animation: "fadeIn 1s ease-out",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Container maxWidth="xl">
              {/* Coleta Domiciliar */}
              {tabValue === 0 && (
                <>
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        backgroundColor: "#009fe3",
                        color: "white",
                        py: 2,
                        px: 3,
                        borderRadius: "8px",
                        mb: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        COLETA DOMICILIAR - DIURNO
                      </Typography>
                    </Box>

                    {/* Stats Cards */}
                    <Box
                      sx={{
                        display: "grid",
                        gap: "1rem",
                        gridTemplateColumns: {
                          xs: "repeat(1, 1fr)",
                          sm: "repeat(2, 1fr)",
                          lg: "repeat(4, 1fr)",
                        },
                        mb: 3,
                      }}
                    >
                      <Fade in={!loading} timeout={500}>
                        <Box>
                          <StatCard
                            title="Total de Equipamentos"
                            value={statsData.domiciliar.totalEquipamentos.toString()}
                            icon={<LocalShipping />}
                            color={themeColors.primary.main}
                            highlight={highlightedStat === "totalEquipamentos"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Motoristas"
                            value={statsData.domiciliar.totalMotoristas.toString()}
                            icon={<People />}
                            color={themeColors.secondary.main}
                            highlight={highlightedStat === "totalMotoristas"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Coletores"
                            value={statsData.domiciliar.totalColetores.toString()}
                            icon={<Engineering />}
                            color={themeColors.warning.main}
                            highlight={highlightedStat === "totalColetores"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Faltas"
                            value={statsData.domiciliar.totalFaltas.toString()}
                            icon={<Today />}
                            color={themeColors.error.main}
                            highlight={highlightedStat === "totalFaltas"}
                          />
                        </Box>
                      </Fade>
                    </Box>

                    {/* Equipamentos e Mão de Obra */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "400ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <EquipmentCard
                            title="EQUIPAMENTOS"
                            data={domiciliarEquipamentos}
                            color="#c0c0c0"
                            textColor="#000"
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <WorkforceCard
                            title="MÃO DE OBRA"
                            data={domiciliarMaoDeObra}
                            color="#c0c0c0"
                            textColor="#000"
                          />
                        </Box>
                      </Zoom>
                    </Box>

                    {/* Resumo Geral */}
                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "600ms" : "0ms" }}>
                      <Box sx={{ mb: 3 }}>
                        <SummaryCard
                          title="RESUMO GERAL M.O. - DOMICILIAR"
                          data={domiciliarResumo}
                          color="#ffff00"
                          textColor="#000"
                        />
                      </Box>
                    </Zoom>

                    {/* Gráficos */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "700ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <EquipmentChart
                            title="Equipamentos por PA"
                            data={domiciliarEquipamentosChartData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "800ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <WorkforceChart
                            title="Mão de Obra por PA"
                            data={domiciliarMaoDeObraChartData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                    </Box>

                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "900ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <PADistributionChart
                            title="Distribuição por PA"
                            data={domiciliarPaDistributionData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "1000ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <CollectionTypeChart
                            title="Tipos de Coleta"
                            data={domiciliarCollectionTypeData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                    </Box>
                  </Box>
                </>
              )}

              {/* Coleta Seletiva */}
              {tabValue === 1 && (
                <>
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        backgroundColor: "#00a651",
                        color: "white",
                        py: 2,
                        px: 3,
                        borderRadius: "8px",
                        mb: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        COLETA SELETIVA - DIURNO
                      </Typography>
                    </Box>

                    {/* Stats Cards */}
                    <Box
                      sx={{
                        display: "grid",
                        gap: "1rem",
                        gridTemplateColumns: {
                          xs: "repeat(1, 1fr)",
                          sm: "repeat(2, 1fr)",
                          lg: "repeat(4, 1fr)",
                        },
                        mb: 3,
                      }}
                    >
                      <Fade in={!loading} timeout={500}>
                        <Box>
                          <StatCard
                            title="Total de Equipamentos"
                            value={statsData.seletiva.totalEquipamentos.toString()}
                            icon={<LocalShipping />}
                            color={themeColors.primary.main}
                            highlight={highlightedStat === "totalEquipamentos"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Motoristas"
                            value={statsData.seletiva.totalMotoristas.toString()}
                            icon={<People />}
                            color={themeColors.secondary.main}
                            highlight={highlightedStat === "totalMotoristas"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Coletores"
                            value={statsData.seletiva.totalColetores.toString()}
                            icon={<Engineering />}
                            color={themeColors.warning.main}
                            highlight={highlightedStat === "totalColetores"}
                          />
                        </Box>
                      </Fade>
                      <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                        <Box>
                          <StatCard
                            title="Total de Faltas"
                            value={statsData.seletiva.totalFaltas.toString()}
                            icon={<Today />}
                            color={themeColors.error.main}
                            highlight={highlightedStat === "totalFaltas"}
                          />
                        </Box>
                      </Fade>
                    </Box>

                    {/* Equipamentos e Mão de Obra */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "400ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <EquipmentCard
                            title="EQUIPAMENTOS"
                            data={seletivaEquipamentos}
                            color="#c0c0c0"
                            textColor="#000"
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <WorkforceCard
                            title="MÃO DE OBRA"
                            data={seletivaMaoDeObra}
                            color="#c0c0c0"
                            textColor="#000"
                          />
                        </Box>
                      </Zoom>
                    </Box>

                    {/* Resumo Geral */}
                    <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "600ms" : "0ms" }}>
                      <Box sx={{ mb: 3 }}>
                        <SummaryCard
                          title="RESUMO GERAL M.O. - SELETIVA"
                          data={seletivaResumo}
                          color="#ffff00"
                          textColor="#000"
                        />
                      </Box>
                    </Zoom>

                    {/* Gráficos */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "700ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <EquipmentChart
                            title="Equipamentos por PA"
                            data={seletivaEquipamentosChartData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "800ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <WorkforceChart
                            title="Mão de Obra por PA"
                            data={seletivaMaoDeObraChartData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                    </Box>

                    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "900ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <PADistributionChart
                            title="Distribuição por PA"
                            data={seletivaPaDistributionData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                      <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "1000ms" : "0ms" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                          <CollectionTypeChart
                            title="Tipos de Coleta"
                            data={seletivaCollectionTypeData}
                            themeColors={themeColors}
                            chartsLoaded={chartsLoaded}
                          />
                        </Box>
                      </Zoom>
                    </Box>
                  </Box>
                </>
              )}
            </Container>
          </Box>
        </Box>
      </Box>

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
