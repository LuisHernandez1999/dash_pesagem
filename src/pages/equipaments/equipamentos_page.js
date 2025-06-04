"use client"

import React from "react"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
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
import EquipmentTypeSummary from "../../components/equipament_summary"
import EquipmentListModal from "../../components/equipaments_list"
import Sidebar from "../../components/sidebar"
import {
  listarPrefixosEImplementos,
  listarEquipamentosTable,
  contarEquipamentosSemana,
} from "../../service/equipamento"

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
      0% { transform: scale(1); box-shadow: 0 0 0 rgba(0, 0, 0, 0.1); }
      50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); }
      100% { transform: scale(1); box-shadow: 0 0 0 rgba(0, 0, 0, 0.1); }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
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

// Optimized stat card component with memoization
const CustomStatCard = ({ title, value, icon: Icon, color, highlight, onClick, isUpdating }) => (
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
      "&::after": isUpdating
        ? {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${alpha(color, 0.1)}, transparent)`,
            animation: `${keyframes.shimmer} 1.5s ease-in-out infinite`,
            zIndex: 2,
          }
        : {},
      animation: highlight ? `${keyframes.pulse} 1.5s ease-out` : "none",
      border: highlight ? `2px solid ${color}` : "none",
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
        zIndex: 3,
      }}
    >
      <Icon sx={{ fontSize: 24, color: color }} />
    </Box>
    <CardContent sx={{ p: 3, pt: 4, pb: 5, position: "relative", zIndex: 3 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", sm: "2.5rem" },
          color: themeColors.text.primary,
          mb: 1,
          animation: highlight ? `${keyframes.fadeIn} 0.6s ease-out` : "none",
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

// Memoized card component to prevent unnecessary re-renders
const MemoizedStatCard = React.memo(CustomStatCard, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.highlight === nextProps.highlight &&
    prevProps.isUpdating === nextProps.isUpdating
  )
})

// Function to transform API equipment data to match modal component expectations
const transformEquipmentData = (equipmentList) => {
  if (!Array.isArray(equipmentList)) return []

  return equipmentList.map((equipment, index) => ({
    id: index + 1,
    prefix: equipment.prefixo_equipamento || equipment.prefixo || "",
    status: equipment.status_equipamento || equipment.status || "",
    type: equipment.implemento || "",
  }))
}

// Function to transform table equipment data from API for maintenance modal
const transformMaintenanceEquipmentData = (equipmentList) => {
  if (!Array.isArray(equipmentList)) return []

  return equipmentList.map((equipment, index) => ({
    id: index + 1,
    prefix: equipment.prefixo_equipamento || equipment.prefixo || "",
    status: "Manutenção",
    type: equipment.implemento || "",
  }))
}

// Function to transform table equipment data from API
const transformTableEquipmentData = (equipmentList) => {
  if (!Array.isArray(equipmentList)) return []

  return equipmentList.map((equipment, index) => ({
    id: index + 1,
    prefix: equipment.prefixo_equipamento || "",
    type: equipment.implemento || "",
    status: equipment.status_equipamento || "",
    model: equipment.modelo || "N/A",
    location: equipment.localizacao || "N/A",
    lastMaintenance: equipment.ultima_manutencao || "N/A",
    nextMaintenance: equipment.proxima_manutencao || "N/A",
    operator: equipment.operador || "N/A",
    workingHours: equipment.horas_trabalhadas || 0,
  }))
}

// Function to transform weekly API data to chart format
const transformWeeklyData = (equipamentos) => {
  console.log("🔍 Iniciando transformação dos dados semanais")
  console.log("📊 Equipamentos recebidos:", equipamentos)

  if (!Array.isArray(equipamentos) || equipamentos.length === 0) {
    console.log("❌ Nenhum equipamento válido encontrado")
    return []
  }

  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

  // Função para normalizar nomes de equipamentos (remover acentos, aspas, etc.)
  const normalizeEquipmentName = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/['"]/g, "") // Remove aspas
      .replace(/\s+/g, "") // Remove espaços
  }

  // Mapeamento de nomes de equipamentos para as chaves do gráfico
  const equipmentMapping = {
    retroescavadeira: "retroescavadeira",
    pacarregadeira: "paCarregadeira",
    caminhaocarroceria: "carroceria",
    carroceria: "carroceria",
    caminhaocarroceiria: "carroceria", // Corrigindo o erro de digitação
  }

  // Detectar todos os tipos de equipamentos únicos
  const uniqueEquipmentTypes = [...new Set(equipamentos.map((eq) => normalizeEquipmentName(eq.equipamento)))]
  console.log("🔧 Tipos de equipamentos detectados:", uniqueEquipmentTypes)

  // Criar um objeto com todos os tipos de equipamentos inicializados com 0
  const createEmptyDayData = (day) => {
    const dayData = { day }

    // Garantir que sempre temos as três propriedades padrão
    dayData.carroceria = 0
    dayData.paCarregadeira = 0
    dayData.retroescavadeira = 0

    return dayData
  }

  const result = days.map((day) => {
    const dayData = createEmptyDayData(day)

    console.log(`📅 Processando dia: ${day}`)

    equipamentos.forEach((equipment) => {
      const equipmentName = equipment.equipamento
      const normalizedName = normalizeEquipmentName(equipmentName)
      const mappedName = equipmentMapping[normalizedName] || normalizedName

      // Mapear o nome do dia para a propriedade correspondente
      let dayValue = 0
      switch (day) {
        case "Segunda":
          dayValue = equipment.segunda || 0
          break
        case "Terça":
          dayValue = equipment.terca || 0
          break
        case "Quarta":
          dayValue = equipment.quarta || 0
          break
        case "Quinta":
          dayValue = equipment.quinta || 0
          break
        case "Sexta":
          dayValue = equipment.sexta || 0
          break
        case "Sábado":
          dayValue = equipment.sabado || 0
          break
        case "Domingo":
          dayValue = equipment.domingo || 0
          break
      }

      console.log(`🔧 Equipamento: ${equipmentName}, Normalizado: ${normalizedName}, Mapeado para: ${mappedName}`)
      console.log(`📊 Valor para ${day}:`, dayValue)

      if (dayData.hasOwnProperty(mappedName)) {
        dayData[mappedName] = dayValue
        console.log(`✅ Atribuído ${dayValue} para ${mappedName} no dia ${day}`)
      } else {
        console.log(`❌ Propriedade ${mappedName} não encontrada no dayData`)
      }
    })

    console.log(`📊 Dados finais para ${day}:`, dayData)
    return dayData
  })

  console.log("🎯 Resultado final da transformação:", result)
  return result
}

export default function EquipmentDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // API data state for cards
  const [apiData, setApiData] = useState({
    contagem_total: 0,
    contagem_ativos: 0,
    contagem_inativos: 0,
    contagem_manutencao: 0,
    todos: [],
    ativos: [],
    inativos: [],
  })

  // User data state (from API or authentication)
  const [user, setUser] = useState(null)

  // Optimized state management
  const [cardHighlights, setCardHighlights] = useState({
    total: false,
    active: false,
    inactive: false,
    maintenance: false,
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Use refs to avoid dependency issues
  const prevApiDataRef = useRef({
    contagem_total: 0,
    contagem_ativos: 0,
    contagem_inativos: 0,
    contagem_manutencao: 0,
  })

  const intervalRef = useRef(null)
  const isUpdatingRef = useRef(false)

  // Table data state (from API)
  const [tableData, setTableData] = useState({
    equipamentos: [],
    pagina_atual: 1,
    total_paginas: 1,
    total_equipamentos: 0,
  })

  // Current equipment list for modal
  const [currentModalList, setCurrentModalList] = useState([])

  // Loading states
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(true)

  // Weekly distribution data from API
  const [weeklyData, setWeeklyData] = useState([])
  const [weeklyLoading, setWeeklyLoading] = useState(true)

  // Optimized data comparison function
  const compareCardData = useCallback((current, previous) => {
    return {
      total: current.contagem_total !== previous.contagem_total,
      active: current.contagem_ativos !== previous.contagem_ativos,
      inactive: current.contagem_inativos !== previous.contagem_inativos,
      maintenance: current.contagem_manutencao !== previous.contagem_manutencao,
    }
  }, [])

  // Function to fetch equipment by status using listarEquipamentosTable
  const fetchEquipmentsByStatus = useCallback(async (status, motivo_inatividade = null) => {
    try {
      console.log(
        `🔍 Buscando equipamentos com status: ${status}${motivo_inatividade ? ` e motivo: ${motivo_inatividade}` : ""}`,
      )

      const params = {
        status: status,
        pagina: 1,
        itensPorPagina: 1000, // Buscar todos
      }

      if (motivo_inatividade) {
        params.motivo_inatividade = motivo_inatividade
      }

      const data = await listarEquipamentosTable(params)

      console.log(`✅ Encontrados ${data.equipamentos?.length || 0} equipamentos`)

      return data.equipamentos || []
    } catch (error) {
      console.error(`❌ Erro ao buscar equipamentos com status ${status}:`, error)
      return []
    }
  }, [])

  // Function to fetch maintenance equipments
  const fetchMaintenanceEquipments = useCallback(async () => {
    return await fetchEquipmentsByStatus("Inativo", "Manutenção")
  }, [fetchEquipmentsByStatus])

  // Optimized fetch function with debouncing
  const fetchEquipmentData = useCallback(
    async (isAutoRefresh = false) => {
      // Prevent multiple simultaneous calls
      if (isUpdatingRef.current) {
        console.log("🚫 Fetch já em andamento, ignorando chamada")
        return
      }

      try {
        isUpdatingRef.current = true
        if (isAutoRefresh) {
          setIsUpdating(true)
        } else {
          setLoading(true)
        }

        console.log(`🔄 ${isAutoRefresh ? "Auto-refresh" : "Fetch inicial"}: Buscando dados dos cards`)

        const data = await listarPrefixosEImplementos()

        const currentData = {
          contagem_total: data.contagem_total || 0,
          contagem_ativos: data.contagem_ativos || 0,
          contagem_inativos: data.contagem_inativos || 0,
          contagem_manutencao: data.contagem_manutencao || 0,
        }

        // Only update if data has changed (for auto-refresh)
        if (isAutoRefresh) {
          const changes = compareCardData(currentData, prevApiDataRef.current)
          const hasAnyChanges = Object.values(changes).some(Boolean)

          if (hasAnyChanges) {
            console.log("✅ Auto-refresh: Dados alterados, atualizando", changes)

            // Update API data
            setApiData({
              ...currentData,
              todos: data.todos || [],
              ativos: data.ativos || [],
              inativos: data.inativos || [],
            })

            // Set highlights for changed cards
            setCardHighlights(changes)
            setLastUpdate(new Date())

            // Reset highlights after animation
            setTimeout(() => {
              setCardHighlights({
                total: false,
                active: false,
                inactive: false,
                maintenance: false,
              })
            }, 2000)

            // Update previous data reference
            prevApiDataRef.current = currentData
          } else {
            console.log("ℹ️ Auto-refresh: Nenhuma alteração nos dados")
          }
        } else {
          // Initial load - always update
          setApiData({
            ...currentData,
            todos: data.todos || [],
            ativos: data.ativos || [],
            inativos: data.inativos || [],
          })
          prevApiDataRef.current = currentData
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados dos cards:", error)
        setSnackbarMessage("Erro ao carregar dados dos cards")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } finally {
        isUpdatingRef.current = false
        setLoading(false)
        setIsUpdating(false)
      }
    },
    [compareCardData],
  )

  // Initial data fetch
  useEffect(() => {
    fetchEquipmentData(false)
  }, [fetchEquipmentData])

  // Optimized auto-refresh setup
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up new interval for auto-refresh (7 minutes)
    intervalRef.current = setInterval(() => {
      fetchEquipmentData(true)
    }, 420000) // 7 minutes

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchEquipmentData])

  // Fetch table data from API
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setTableLoading(true)
        const data = await listarEquipamentosTable({
          pagina: 1,
          itensPorPagina: 100,
        })

        console.log("Table API Response:", data)

        setTableData(data)
      } catch (error) {
        console.error("Erro ao carregar dados da tabela:", error)
        setSnackbarMessage("Erro ao carregar dados da tabela")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } finally {
        setTableLoading(false)
      }
    }

    fetchTableData()
  }, [])

  // Fetch weekly distribution data from API
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setWeeklyLoading(true)
        console.log("🚀 Iniciando busca dos dados semanais")

        const data = await contarEquipamentosSemana()

        console.log("📡 Resposta completa da API:", data)

        if (data && data.equipamentos && Array.isArray(data.equipamentos) && data.equipamentos.length > 0) {
          console.log("✅ Dados válidos encontrados, iniciando transformação")
          const transformedData = transformWeeklyData(data.equipamentos)
          console.log("🎯 Dados transformados:", transformedData)
          setWeeklyData(transformedData)
        } else {
          console.log("❌ Nenhum equipamento válido encontrado")
          setWeeklyData([])
        }
      } catch (error) {
        console.error("💥 Erro ao carregar dados semanais:", error)
        setSnackbarMessage("Erro ao carregar dados do gráfico semanal")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
        setWeeklyData([])
      } finally {
        setWeeklyLoading(false)
      }
    }

    fetchWeeklyData()
  }, [])

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  // Equipment list modal state
  const [listModalOpen, setListModalOpen] = useState(false)
  const [listModalTitle, setListModalTitle] = useState("")

  // Handle card clicks
  const handleCardClick = useCallback(
    async (cardType) => {
      let equipmentList = []

      switch (cardType) {
        case "total":
          setListModalTitle("Todos os Equipamentos")
          try {
            // Buscar todos os equipamentos usando a API de tabela
            const allEquipments = await fetchEquipmentsByStatus("", null) // Sem filtro de status
            equipmentList = transformEquipmentData(allEquipments)
          } catch (error) {
            console.error("❌ Erro ao buscar todos os equipamentos:", error)
            // Fallback para os dados da primeira API (mesmo com discrepância)
            equipmentList = transformEquipmentData(apiData.todos)
          }
          break
        case "active":
          setListModalTitle("Equipamentos Ativos")
          try {
            // Buscar equipamentos ativos usando a API de tabela
            const activeEquipments = await fetchEquipmentsByStatus("Ativo")
            equipmentList = transformEquipmentData(activeEquipments)
          } catch (error) {
            console.error("❌ Erro ao buscar equipamentos ativos:", error)
            // Fallback para os dados da primeira API
            equipmentList = transformEquipmentData(apiData.ativos)
          }
          break
        case "inactive":
          setListModalTitle("Equipamentos Inativos")
          try {
            // Buscar equipamentos inativos usando a API de tabela
            const inactiveEquipments = await fetchEquipmentsByStatus("Inativo")
            equipmentList = transformEquipmentData(inactiveEquipments)
          } catch (error) {
            console.error("❌ Erro ao buscar equipamentos inativos:", error)
            // Fallback para os dados da primeira API
            equipmentList = transformEquipmentData(apiData.inativos)
          }
          break
        case "maintenance":
          setListModalTitle("Equipamentos em Manutenção")
          try {
            // Buscar equipamentos em manutenção da API
            const maintenanceEquipments = await fetchMaintenanceEquipments()
            equipmentList = transformMaintenanceEquipmentData(maintenanceEquipments)
            console.log("🔧 Lista de equipamentos em manutenção:", equipmentList)
          } catch (error) {
            console.error("❌ Erro ao buscar equipamentos em manutenção:", error)
            setSnackbarMessage("Erro ao carregar equipamentos em manutenção")
            setSnackbarSeverity("error")
            setSnackbarOpen(true)
            equipmentList = []
          }
          break
      }

      setCurrentModalList(equipmentList)
      setListModalOpen(true)
    },
    [apiData, fetchMaintenanceEquipments, fetchEquipmentsByStatus],
  )

  // Handle refresh data
  const handleRefreshData = useCallback(async () => {
    try {
      console.log("🔄 Iniciando atualização manual de todos os dados")
      setLoading(true)
      setTableLoading(true)
      setWeeklyLoading(true)

      // Refresh all data
      await Promise.all([
        fetchEquipmentData(false),
        (async () => {
          const tableDataResponse = await listarEquipamentosTable({
            pagina: 1,
            itensPorPagina: 100,
          })
          setTableData(tableDataResponse)
        })(),
        (async () => {
          const weeklyDataResponse = await contarEquipamentosSemana()
          if (weeklyDataResponse && weeklyDataResponse.equipamentos) {
            const transformedWeeklyData = transformWeeklyData(weeklyDataResponse.equipamentos)
            setWeeklyData(transformedWeeklyData)
          }
        })(),
      ])

      setSnackbarMessage("Todos os dados atualizados com sucesso!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("❌ Erro ao atualizar dados:", error)
      setSnackbarMessage("Erro ao atualizar dados")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
      setTableLoading(false)
      setWeeklyLoading(false)
    }
  }, [fetchEquipmentData])

  // Handle table refresh
  const handleTableRefresh = useCallback(async () => {
    try {
      setTableLoading(true)
      const data = await listarEquipamentosTable({
        pagina: 1,
        itensPorPagina: 100,
      })
      setTableData(data)
      setSnackbarMessage("Dados da tabela atualizados!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("❌ Erro ao atualizar tabela:", error)
      setSnackbarMessage("Erro ao atualizar tabela")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setTableLoading(false)
    }
  }, [])

  // Handle weekly chart refresh
  const handleWeeklyRefresh = useCallback(async () => {
    try {
      setWeeklyLoading(true)
      const data = await contarEquipamentosSemana()

      if (data && data.equipamentos) {
        const transformedData = transformWeeklyData(data.equipamentos)
        setWeeklyData(transformedData)
        setSnackbarMessage("Dados do gráfico semanal atualizados!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar dados semanais:", error)
      setSnackbarMessage("Erro ao atualizar dados do gráfico semanal")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setWeeklyLoading(false)
    }
  }, [])

  // Handle equipment type summary refresh
  const handleEquipmentTypeSummaryRefresh = useCallback(async () => {
    await fetchEquipmentData(false)
    setSnackbarMessage("Dados de tipos de equipamentos atualizados!")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)
  }, [fetchEquipmentData])

  // Handle snackbar close
  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false)
  }, [])

  // Handle sidebar collapse
  const handleSidebarCollapse = useCallback((collapsed) => {
    setSidebarCollapsed(collapsed)
  }, [])

  // Memoized last update display
  const lastUpdateDisplay = useMemo(() => {
    if (!lastUpdate) return ""
    return `Última atualização: ${lastUpdate.toLocaleTimeString()}`
  }, [lastUpdate])

  return (
    <>
      <style>
        {`
          ${keyframes.fadeIn}
          ${keyframes.slideInUp}
          ${keyframes.pulse}
          ${keyframes.shimmer}
        `}
      </style>

      {/* Layout with Sidebar */}
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <Sidebar onCollapse={handleSidebarCollapse} user={user} />

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#ffffff",
            marginLeft: sidebarCollapsed ? "80px" : "280px",
            transition: "margin-left 0.3s ease",
            width: `calc(100% - ${sidebarCollapsed ? "80px" : "280px"})`,
            [theme.breakpoints.down("sm")]: {
              marginLeft: 0,
              width: "100%",
            },
          }}
        >
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
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
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
                {lastUpdate && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: themeColors.text.secondary,
                      fontSize: "0.75rem",
                      opacity: 0.8,
                    }}
                  >
                    {lastUpdateDisplay}
                  </Typography>
                )}
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
                  <MemoizedStatCard
                    title="Total de Equipamentos"
                    value={apiData.contagem_total}
                    icon={Construction}
                    color={themeColors.primary.main}
                    highlight={cardHighlights.total}
                    isUpdating={isUpdating}
                    onClick={() => handleCardClick("total")}
                  />
                  <MemoizedStatCard
                    title="Equipamentos Ativos"
                    value={apiData.contagem_ativos}
                    icon={CheckCircle}
                    color={themeColors.success.main}
                    highlight={cardHighlights.active}
                    isUpdating={isUpdating}
                    onClick={() => handleCardClick("active")}
                  />
                  <MemoizedStatCard
                    title="Equipamentos Inativos"
                    value={apiData.contagem_inativos}
                    icon={Cancel}
                    color={themeColors.error.main}
                    highlight={cardHighlights.inactive}
                    isUpdating={isUpdating}
                    onClick={() => handleCardClick("inactive")}
                  />
                  <MemoizedStatCard
                    title="Em Manutenção"
                    value={apiData.contagem_manutencao}
                    icon={Today}
                    color={themeColors.warning.main}
                    highlight={cardHighlights.maintenance}
                    isUpdating={isUpdating}
                    onClick={() => handleCardClick("maintenance")}
                  />
                </Box>
              </Box>

              {/* Equipment Table - Using real API data */}
              <EquipmentTable
                equipments={transformTableEquipmentData(tableData.equipamentos)}
                loading={tableLoading}
                themeColors={themeColors}
                onRefresh={handleTableRefresh}
              />

              {/* Equipment Type Summary - NEW COMPONENT */}
              <EquipmentTypeSummary
                equipmentData={apiData}
                loading={loading}
                onRefresh={handleEquipmentTypeSummaryRefresh}
                themeColors={themeColors}
                apiFunction={listarPrefixosEImplementos}
              />

              {/* Weekly Distribution Chart - Now using real API data */}
              <WeeklyDistributionChart
                weeklyData={weeklyData}
                themeColors={themeColors}
                onRefresh={handleWeeklyRefresh}
                loading={weeklyLoading}
              />
            </Container>
          </Box>
        </Box>
      </Box>

      {/* Equipment List Modal - Using real API data */}
      <EquipmentListModal
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        title={listModalTitle}
        equipments={currentModalList}
        themeColors={themeColors}
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
