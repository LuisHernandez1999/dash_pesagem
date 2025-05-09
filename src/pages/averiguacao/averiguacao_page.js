"use client"

import { useState, useEffect, useMemo } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  IconButton,
  Box,
  Fade,
  Zoom,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
  InputBase,
  Snackbar,
  Alert,
  alpha,
  Autocomplete,
  ListItemText,
  Grid,
  ImageList,
  ImageListItem,
  Modal,
  CircularProgress,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import {
  Refresh,
  Close,
  Menu as MenuIcon,
  MoreVert,
  Delete,
  Search,
  Edit,
  BarChart,
  Visibility,
  FilterAlt,
  ViewList,
  Image as ImageIcon,
  ZoomIn,
  ErrorOutline,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import DetailModal from "../../components/visualizar_averiguacao"
import DataTable from "../../components/averiguacao_tabela"
import { getTodasAveriguacoes } from "../../service/averiguacao" // Usando a função existente
import AveriguacaoGrafico from "../../components/averiguacao_grafico"

// Adicione esta constante no início do arquivo, logo após a definição de API_BASE_URL no import
// Adicione esta linha após a importação da função getTodasAveriguacoes
const API_BASE_URL = "http://127.0.0.1:8000"

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

// Modifique o componente ImageGallery para adicionar o domínio base às URLs das imagens
// Substitua a função ImageGallery existente por esta versão atualizada:

// Image Gallery component for displaying images in the table
const ImageGallery = ({ images = [], themeColors }) => {
  // Adicionar no início do componente ImageGallery
  console.log("Imagens recebidas:", images)

  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleOpen = (image) => {
    setSelectedImage(image)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // Função para obter a URL completa da imagem
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null
    // Se a imagem já começa com http, é uma URL completa
    if (imagePath.startsWith("http")) return imagePath
    // Caso contrário, adiciona o domínio base
    return `${API_BASE_URL}${imagePath}`
  }

  // Se não há imagens, mostrar um placeholder
  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: themeColors.text.secondary,
          height: "100%",
        }}
      >
        <ImageIcon sx={{ mr: 1, fontSize: "1rem" }} />
        <Typography variant="caption">Sem imagens</Typography>
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation()
          handleOpen(images[0])
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "8px",
            overflow: "hidden",
            border: `1px solid ${themeColors.divider}`,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.03)",
          }}
        >
          <img
            src={getFullImageUrl(images[0]) || "/placeholder.svg"}
            alt="Imagem da averiguação"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              console.error("Erro ao carregar imagem:", images[0])
              e.target.onerror = null
              e.target.src = "/abstract-geometric-shapes.png"
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: themeColors.primary.main, fontWeight: 500 }}>
            {images.length} {images.length === 1 ? "imagem" : "imagens"}
          </Typography>
          <ZoomIn
            sx={{
              ml: 0.5,
              fontSize: "1rem",
              color: themeColors.primary.main,
            }}
          />
        </Box>
      </Box>

      {/* Image Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            p: 3,
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" id="image-modal-title">
              Imagens da Averiguação
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
          <ImageList
            sx={{
              width: "100%",
              maxHeight: "70vh",
            }}
            cols={images.length > 1 ? 2 : 1}
            gap={8}
          >
            {images.map((img, index) => (
              <ImageListItem key={index}>
                <img
                  src={getFullImageUrl(img) || "/placeholder.svg"}
                  alt={`Imagem ${index + 1}`}
                  loading="lazy"
                  style={{
                    borderRadius: "8px",
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    console.error("Erro ao carregar imagem no modal:", img)
                    e.target.onerror = null
                    e.target.src = "/abstract-geometric-shapes.png"
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Modal>
    </>
  )
}

// Search input component
const SearchInput = ({ icon: Icon, placeholder, value, onChange, suggestions = [] }) => {
  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      value={value}
      onChange={(_, newValue) => onChange({ target: { value: newValue || "" } })}
      onInputChange={(_, newInputValue) => onChange({ target: { value: newInputValue } })}
      sx={{
        flex: 1,
        width: "100%",
      }}
      renderInput={(params) => (
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            borderRadius: "20px",
            border: `2px solid ${themeColors.divider}`,
            overflow: "hidden",
            transition: "all 0.3s ease",
            background: themeColors.background.paper,
            height: "52px",
            width: "100%",
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.15)}`,
              borderColor: themeColors.primary.main,
            },
            "&:focus-within": {
              boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.2)}`,
              borderColor: themeColors.primary.main,
              animation: `${keyframes.glow} 2s infinite ease-in-out`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1.5,
              pl: 2,
              color: themeColors.primary.main,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
          <InputBase
            {...params.InputProps}
            placeholder={placeholder}
            sx={{
              flex: 1,
              fontSize: "1rem",
              color: themeColors.text.primary,
              py: 1,
              px: 1,
              width: "100%",
              "& input": {
                padding: "8px 0",
                transition: "all 0.2s ease",
              },
              "& input::placeholder": {
                color: themeColors.text.disabled,
                opacity: 1,
              },
            }}
            inputProps={{
              ...params.inputProps,
              style: { paddingLeft: 0 },
            }}
          />
          {value && (
            <IconButton
              size="small"
              onClick={() => onChange({ target: { value: "" } })}
              sx={{ mr: 1, color: themeColors.text.secondary }}
            >
              <Close fontSize="small" />
            </IconButton>
          )}
        </Paper>
      )}
      ListboxProps={{
        sx: {
          maxHeight: "300px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          mt: 1,
          "& .MuiAutocomplete-option": {
            padding: "10px 16px",
            borderRadius: "8px",
            margin: "2px 4px",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: alpha(themeColors.primary.main, 0.1),
            },
            "&.Mui-focused": {
              backgroundColor: alpha(themeColors.primary.main, 0.15),
            },
          },
        },
      }}
    />
  )
}

// Custom stat card component with dropdown filter - IMPROVED POSITIONING AND REDUCED HEIGHT
const CustomStatCard = ({
  title,
  value,
  color,
  highlight,
  pa,
  fleetTypeFilter,
  onFilterChange,
  fleetCounts,
  averiguacaoNumber,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleFilterSelect = (type) => {
    onFilterChange(pa, type)
    handleClose()
  }

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        background: "white",
        height: "100%",
        maxHeight: "120px", // Reduced height
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
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
        animation: highlight ? `${keyframes.flashHighlight} 1s ease-out` : `${keyframes.fadeIn} 0.6s ease-out`,
      }}
    >
      <CardContent sx={{ p: 1.5, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              color: alpha(color, 0.8),
              fontWeight: 600,
              fontSize: "0.7rem",
              backgroundColor: alpha(color, 0.1),
              borderRadius: "6px",
              padding: "3px 6px",
            }}
          >
            #{averiguacaoNumber}
          </Typography>
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              color: themeColors.text.secondary,
              backgroundColor: alpha(themeColors.background.default, 0.7),
              borderRadius: "6px",
              padding: "3px",
              "&:hover": {
                backgroundColor: alpha(color, 0.1),
                color: color,
              },
            }}
          >
            <FilterAlt sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            my: 0.5,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
              color: themeColors.text.primary,
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: themeColors.text.secondary,
              fontWeight: 500,
              fontSize: "0.8rem",
              textAlign: "right",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ mt: "auto", display: "flex", justifyContent: "flex-start" }}>
          <Chip
            label={fleetTypeFilter === "all" ? "Todos" : fleetTypeFilter}
            size="small"
            sx={{
              backgroundColor: alpha(color, 0.1),
              color: color,
              fontWeight: 500,
              borderRadius: "6px",
              height: "20px",
              fontSize: "0.7rem",
            }}
          />
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            minWidth: "180px",
          },
        }}
      >
        <MenuItem
          onClick={() => handleFilterSelect("all")}
          selected={fleetTypeFilter === "all"}
          sx={{
            borderRadius: "8px",
            mx: 0.5,
            my: 0.3,
            "&:hover": {
              backgroundColor: alpha(color, 0.1),
            },
            "&.Mui-selected": {
              backgroundColor: alpha(color, 0.1),
              "&:hover": {
                backgroundColor: alpha(color, 0.2),
              },
            },
          }}
        >
          <ListItemText primary="Todos os tipos" secondary={`Total: ${fleetCounts.total}`} />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {["Remoção", "Varrição", "Seletiva"].map((type) => (
          <MenuItem
            key={type}
            onClick={() => handleFilterSelect(type)}
            selected={fleetTypeFilter === type}
            sx={{
              borderRadius: "8px",
              mx: 0.5,
              my: 0.3,
              "&:hover": {
                backgroundColor: alpha(color, 0.1),
              },
              "&.Mui-selected": {
                backgroundColor: alpha(color, 0.1),
                "&:hover": {
                  backgroundColor: alpha(color, 0.2),
                },
              },
            }}
          >
            <ListItemText primary={type} secondary={`Total: ${fleetCounts[type] || 0}`} />
          </MenuItem>
        ))}
      </Menu>
    </Card>
  )
}

// Error state component
const ErrorState = ({ message, onRetry }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        textAlign: "center",
      }}
    >
      <ErrorOutline
        sx={{
          fontSize: 60,
          color: themeColors.error.main,
          mb: 2,
        }}
      />
      <Typography variant="h6" gutterBottom>
        Erro ao carregar dados
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
        {message || "Ocorreu um erro ao carregar os dados. Por favor, tente novamente."}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onRetry}
        startIcon={<Refresh />}
        sx={{
          borderRadius: 2,
          textTransform: "none",
        }}
      >
        Tentar novamente
      </Button>
    </Box>
  )
}

export default function AveriguacaoDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State variables
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [paFilter, setPaFilter] = useState("all")
  const [fleetTypeFilter, setFleetTypeFilter] = useState("all")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortField, setSortField] = useState("data")
  const [sortDirection, setSortDirection] = useState("desc")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [highlightedStat, setHighlightedStat] = useState(null)

  // Card filter states
  const [pa1FleetFilter, setPa1FleetFilter] = useState("all")
  const [pa2FleetFilter, setPa2FleetFilter] = useState("all")
  const [pa3FleetFilter, setPa3FleetFilter] = useState("all")
  const [pa4FleetFilter, setPa4FleetFilter] = useState("all")

  // Action menu states
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Detail modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState(null)

  // API data
  const [inspections, setInspections] = useState([])

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar todas as averiguações usando a função correta
      const averiguacoes = await getTodasAveriguacoes()
      console.log("Dados obtidos da API:", averiguacoes)

      if (!averiguacoes || !Array.isArray(averiguacoes) || averiguacoes.length === 0) {
        throw new Error("Nenhuma averiguação encontrada ou formato inválido")
      }

      // Modifique a função fetchData para incluir os campos garagem e tipo_servico
      // Substitua o trecho dentro da função fetchData onde os dados são transformados:

      // Transform the API response to match the table's expected format
      const formattedData = averiguacoes.map((averiguacao) => {
        console.log(
          "Processando averiguação:",
          averiguacao.id,
          "imagens:",
          averiguacao.imagens,
          "garagem:",
          averiguacao.garagem,
          "tipo_servico:",
          averiguacao.tipo_servico,
        )

        // Transformar tipo_servico "1" em "Seletiva"
        let fleetType = averiguacao.tipo_servico
        if (fleetType === "1" || fleetType === 1) {
          fleetType = "Seletiva"
        }

        return {
          id: averiguacao.id,
          date: averiguacao.data,
          time: averiguacao.hora_averiguacao,
          pa: averiguacao.garagem, // Usar garagem como PA
          route: averiguacao.rota,
          fleetType: fleetType, // Usar o valor transformado
          photos: Array.isArray(averiguacao.imagens)
            ? averiguacao.imagens
            : averiguacao.imagens
              ? [averiguacao.imagens]
              : [],
          inspector: averiguacao.averiguador,
          observations: "",
        }
      })

      setInspections(formattedData)
      setLoading(false)

      // Mostrar mensagem de sucesso
      setSnackbarMessage(`${formattedData.length} averiguações carregadas com sucesso`)
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Erro ao processar dados:", error)
      setError(`Erro ao carregar dados: ${error.message}`)
      setSnackbarMessage("Erro ao carregar dados")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      setLoading(false)

      // Dados de exemplo para quando a API falhar
      const mockData = [
        {
          id: 1,
          data: new Date().toISOString().split("T")[0],
          hora_averiguacao: new Date().toTimeString().split(" ")[0],
          imagens: [
            "https://via.placeholder.com/300/3a86ff/ffffff?text=Foto+Averiguação+1",
            "https://via.placeholder.com/300/4CAF50/ffffff?text=Foto+Averiguação+2",
          ],
          averiguador: "Sistema (Mock 1)",
          rota: "PA1-R101",
          garagem: "PA1", // Adicionado
          tipo_servico: "Remoção", // Adicionado
        },
        {
          id: 2,
          data: new Date(Date.now() - 86400000).toISOString().split("T")[0],
          hora_averiguacao: "10:30:00",
          imagens: ["https://via.placeholder.com/300/fb5607/ffffff?text=Foto+Averiguação+3"],
          averiguador: "Sistema (Mock 2)",
          rota: "PA2-V202",
          garagem: "PA2", // Adicionado
          tipo_servico: "Varrição", // Adicionado
        },
        {
          id: 3,
          data: new Date(Date.now() - 172800000).toISOString().split("T")[0],
          hora_averiguacao: "14:15:00",
          imagens: [],
          averiguador: "Sistema (Mock 3)",
          rota: "PA3-S303",
          garagem: "PA3", // Adicionado
          tipo_servico: "Seletiva", // Adicionado
        },
        {
          id: 4,
          data: new Date(Date.now() - 259200000).toISOString().split("T")[0],
          hora_averiguacao: "09:45:00",
          imagens: [
            "https://via.placeholder.com/300/8338ec/ffffff?text=Foto+Averiguação+4",
            "https://via.placeholder.com/300/ffbe0b/ffffff?text=Foto+Averiguação+5",
          ],
          averiguador: "Sistema (Mock 4)",
          rota: "PA4-R404",
          garagem: "PA4", // Adicionado
          tipo_servico: "Remoção", // Adicionado
        },
        {
          id: 5,
          data: new Date(Date.now() - 345600000).toISOString().split("T")[0],
          hora_averiguacao: "16:20:00",
          imagens: ["https://via.placeholder.com/300/3a86ff/ffffff?text=Foto+Averiguação+7"],
          averiguador: "Sistema (Mock 5)",
          rota: "PA1-V105",
          garagem: "PA1", // Adicionado
          tipo_servico: "Varrição", // Adicionado
        },
      ]

      const formattedMockData = mockData.map((averiguacao) => {
        // Transformar tipo_servico "1" em "Seletiva"
        let fleetType = averiguacao.tipo_servico
        if (fleetType === "1" || fleetType === 1) {
          fleetType = "Seletiva"
        }

        return {
          id: averiguacao.id,
          date: averiguacao.data,
          time: averiguacao.hora_averiguacao,
          pa: averiguacao.garagem, // Usar garagem diretamente
          route: averiguacao.rota,
          fleetType: fleetType, // Usar o valor transformado
          photos: averiguacao.imagens || [],
          inspector: averiguacao.averiguador,
          observations: "",
        }
      })

      setInspections(formattedMockData)
      setSnackbarMessage("Usando dados de exemplo devido a erro na API")
      setSnackbarSeverity("warning")
      setSnackbarOpen(true)
    }
  }

  // Fetch data from API
  useEffect(() => {
    fetchData()
  }, [])

  // Remova ou comente as funções extractPAFromRoute e determineFleetType, pois não serão mais necessárias
  // E substitua todas as chamadas a essas funções nos dados de exemplo:

  // Helper function to extract PA from route
  // const extractPAFromRoute = (route) => {
  //   // This is a placeholder - implement the actual logic based on your route format
  //   if (route && route.startsWith("PA")) {
  //     return route.substring(0, 3)
  //   }
  //   return "PA1" // Default value
  // }

  // Helper function to determine fleet type from route or other data
  // const determineFleetType = (route) => {
  //   // This is a placeholder - implement the actual logic based on your business rules
  //   if (route && route.includes("R")) return "Remoção"
  //   if (route && route.includes("V")) return "Varrição"
  //   if (route && route.includes("S")) return "Seletiva"
  //   return "Seletiva" // Default value
  // }

  // Calculate fleet counts by PA
  const getFleetCountsByPA = (pa) => {
    const paInspections = inspections.filter((i) => i.pa === pa)

    // Inicializar o objeto de contagem com as categorias fixas
    const counts = {
      total: paInspections.length,
      Remoção: 0,
      Varrição: 0,
      Seletiva: 0,
    }

    // Contar cada inspeção na categoria apropriada
    paInspections.forEach((inspection) => {
      const type = String(inspection.fleetType).toLowerCase()
      if (type.includes("remo")) {
        counts["Remoção"]++
      } else if (type.includes("varri")) {
        counts["Varrição"]++
      } else if (type.includes("selet") || type === "1") {
        counts["Seletiva"]++
      } else {
        // Se não corresponder a nenhuma categoria conhecida, adicionar à categoria mais próxima
        // ou criar uma nova categoria se necessário
        counts["Seletiva"]++ // Padrão para categoria desconhecida
      }
    })

    return counts
  }

  // Calculate statistics
  const statsData = useMemo(() => {
    const pa1Counts = getFleetCountsByPA("PA1")
    const pa2Counts = getFleetCountsByPA("PA2")
    const pa3Counts = getFleetCountsByPA("PA3")
    const pa4Counts = getFleetCountsByPA("PA4")

    return {
      pa1Inspections: pa1FleetFilter === "all" ? pa1Counts.total : pa1Counts[pa1FleetFilter] || 0,
      pa2Inspections: pa2FleetFilter === "all" ? pa2Counts.total : pa2Counts[pa2FleetFilter] || 0,
      pa3Inspections: pa3FleetFilter === "all" ? pa3Counts.total : pa3Counts[pa3FleetFilter] || 0,
      pa4Inspections: pa4FleetFilter === "all" ? pa4Counts.total : pa4Counts[pa4FleetFilter] || 0,
      pa1Counts,
      pa2Counts,
      pa3Counts,
      pa4Counts,
      totalInspections: inspections.length,
    }
  }, [inspections, pa1FleetFilter, pa2FleetFilter, pa3FleetFilter, pa4FleetFilter])

  // Modifique a função fleetTypeData para tratar o valor "1" como "Seletiva"
  // Substitua o useMemo do fleetTypeData por:

  // Fleet type distribution data
  const fleetTypeData = useMemo(() => {
    // Primeiro, agrupe os dados por tipo de frota, tratando "1" como "Seletiva"
    const groupedData = inspections.reduce((acc, item) => {
      // Determinar o tipo de frota a ser exibido
      let displayType = item.fleetType

      // Se o tipo for "1", exibir como "Seletiva"
      if (displayType === "1" || displayType === 1) {
        displayType = "Seletiva"
      }

      // Agrupar por tipo de exibição
      acc[displayType] = (acc[displayType] || 0) + 1
      return acc
    }, {})

    // Transformar em array para o gráfico
    return Object.keys(groupedData).map((type) => {
      // Determinar a cor com base no tipo
      let color
      if (type === "Remoção" || type.toLowerCase().includes("remo")) {
        color = themeColors.primary.main
      } else if (type === "Varrição" || type.toLowerCase().includes("varri")) {
        color = themeColors.success.main
      } else {
        color = themeColors.warning.main
      }

      return {
        name: type,
        value: groupedData[type],
        color: color,
      }
    })
  }, [inspections])

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  // Handle card filter change
  const handleCardFilterChange = (pa, fleetType) => {
    switch (pa) {
      case "PA1":
        setPa1FleetFilter(fleetType)
        break
      case "PA2":
        setPa2FleetFilter(fleetType)
        break
      case "PA3":
        setPa3FleetFilter(fleetType)
        break
      case "PA4":
        setPa4FleetFilter(fleetType)
        break
      default:
        break
    }
  }

  // Handle action menu
  const handleActionMenuOpen = (event, id) => {
    event.stopPropagation()
    setActionMenuAnchor(event.currentTarget)
    setSelectedRowId(id)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
    setSelectedRowId(null)
  }

  // Handle view details
  const handleViewDetails = (inspection) => {
    setSelectedInspection(inspection)
    setDetailModalOpen(true)
    handleActionMenuClose()
  }

  // Handle delete
  const handleDeleteConfirmOpen = () => {
    setDeleteConfirmOpen(true)
    setActionMenuAnchor(null)
  }

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false)
  }

  const handleDelete = () => {
    setInspections((prev) => prev.filter((item) => item.id !== selectedRowId))
    setDeleteConfirmOpen(false)
    setSnackbarMessage("Averiguação excluída com sucesso!")
    setSnackbarSeverity("success")
    setSnackbarOpen(true)
  }

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle sorting
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc"
    setSortDirection(isAsc ? "desc" : "asc")
    setSortField(field)
  }

  // Apply filters
  const applyFilters = () => {
    // This function applies all filters at once
    const filtered = inspections.filter((item) => {
      // Search filter
      const searchMatch =
        searchValue === "" ||
        item.inspector.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.route.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.pa.toLowerCase().includes(searchValue.toLowerCase())

      // Date filter
      let dateMatch = true
      if (selectedDate) {
        const itemDate = new Date(item.date)
        const filterDate = new Date(selectedDate)
        dateMatch =
          itemDate.getDate() === filterDate.getDate() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
      }

      // PA filter
      const paMatch = paFilter === "all" || item.pa === paFilter

      // Fleet type filter - mapear os tipos de frota para os filtros fixos
      let fleetMatch = fleetTypeFilter === "all"
      if (!fleetMatch) {
        if (fleetTypeFilter === "Remoção") {
          fleetMatch =
            item.fleetType === "Remoção" ||
            item.fleetType === "remocao" ||
            item.fleetType.toLowerCase().includes("remo")
        } else if (fleetTypeFilter === "Varrição") {
          fleetMatch =
            item.fleetType === "Varrição" ||
            item.fleetType === "varricao" ||
            item.fleetType.toLowerCase().includes("varri")
        } else if (fleetTypeFilter === "Seletiva") {
          fleetMatch =
            item.fleetType === "Seletiva" ||
            item.fleetType === "seletiva" ||
            item.fleetType.toLowerCase().includes("selet") ||
            item.fleetType === "1" ||
            item.fleetType === 1
        } else {
          fleetMatch = item.fleetType === fleetTypeFilter
        }
      }

      return searchMatch && dateMatch && paMatch && fleetMatch
    })

    return filtered
  }

  // Filter inspections
  const filteredInspections = useMemo(() => {
    const filtered = applyFilters()

    // Apply sorting
    return filtered.sort((a, b) => {
      const factor = sortDirection === "asc" ? 1 : -1

      if (sortField === "data") {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return factor * (dateA - dateB)
      }

      if (sortField === "inspector") {
        return factor * a.inspector.localeCompare(b.inspector)
      }

      if (sortField === "pa") {
        return factor * a.pa.localeCompare(b.pa)
      }

      if (sortField === "route") {
        return factor * a.route.localeCompare(b.route)
      }

      return 0
    })
  }, [inspections, searchValue, selectedDate, paFilter, fleetTypeFilter, sortField, sortDirection])

  // Reset all filters
  const resetFilters = () => {
    setSearchValue("")
    setSelectedDate(null)
    setPaFilter("all")
    setFleetTypeFilter("all")
    setSnackbarMessage("Filtros resetados com sucesso!")
    setSnackbarSeverity("info")
    setSnackbarOpen(true)
  }

  // Table columns configuration - updated to match API data structure and include images
  const tableColumns = [
    {
      field: "date",
      headerName: "Data",
      sortable: true,
    },
    {
      field: "time",
      headerName: "Hora",
      sortable: true,
    },
    {
      field: "pa",
      headerName: "PA",
      sortable: true,
    },
    {
      field: "route",
      headerName: "Rota",
      sortable: true,
    },
    {
      field: "inspector",
      headerName: "Averiguador",
      sortable: true,
      renderCell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: alpha(themeColors.secondary.main, 0.1),
              color: themeColors.secondary.main,
              fontWeight: 600,
            }}
          >
            {row.inspector.charAt(0)}
          </Avatar>
          <Typography sx={{ fontWeight: 500 }}>{row.inspector}</Typography>
        </Box>
      ),
    },
    {
      field: "photos",
      headerName: "Imagens",
      renderCell: (row) => <ImageGallery images={row.photos} themeColors={themeColors} />,
    },
    {
      field: "fleetType",
      headerName: "Tipo de Frota",
      renderCell: (row) => (
        <Chip
          label={row.fleetType}
          size="small"
          sx={{
            backgroundColor: alpha(
              row.fleetType === "Remoção" || row.fleetType === "remocao"
                ? themeColors.primary.main
                : row.fleetType === "Varrição" || row.fleetType === "varricao"
                  ? themeColors.success.main
                  : themeColors.warning.main,
              0.1,
            ),
            color:
              row.fleetType === "Remoção" || row.fleetType === "remocao"
                ? themeColors.primary.main
                : row.fleetType === "Varrição" || row.fleetType === "varricao"
                  ? themeColors.success.main
                  : themeColors.warning.main,
            fontWeight: 600,
            height: "1.5rem",
            borderRadius: "12px",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      align: "center",
      renderCell: (row) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            handleActionMenuOpen(e, row.id)
          }}
          sx={{
            color: themeColors.text.secondary,
            "&:hover": {
              backgroundColor: alpha(themeColors.secondary.main, 0.1),
              color: themeColors.secondary.main,
            },
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      ),
    },
  ]

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
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* Vertical green line instead of icon - ADJUSTED POSITION */}
                  <Box
                    sx={{
                      width: "6px",
                      height: "42px", // Reduced height
                      borderRadius: "3px",
                      background: themeColors.secondary.main,
                      mr: 2,
                      mt: 1, // Added margin top to lower the line
                      boxShadow: `0 4px 12px ${alpha(themeColors.secondary.main, 0.3)}`,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 400, // Mantendo o peso da fonte mais leve
                      fontSize: { xs: "1.35rem", sm: "1.8rem" },
                      color: themeColors.text.primary,
                      letterSpacing: "0.02em",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    SISTEMA DE AVERIGUAÇÃO
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: themeColors.text.secondary,
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    ml: { xs: "0", sm: "2.5rem" },
                    mt: "-0.3rem",
                    fontWeight: 400,
                    fontFamily: "'Roboto', sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  Controle e monitoramento de rotas e veículos
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  sx={{
                    color: themeColors.text.secondary,
                    "&:hover": { color: themeColors.secondary.main },
                  }}
                  onClick={() => {
                    setLoading(true)
                    fetchData()
                  }}
                >
                  <Refresh />
                </IconButton>
              </Box>
            </Toolbar>
            <Divider
              sx={{
                height: "1px",
                background: `${alpha(themeColors.secondary.main, 0.2)}`,
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
            }}
          >
            <Container maxWidth="xl" disableGutters>
              {/* Stats Cards */}
              <Box component="section">
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
                      <CustomStatCard
                        title="Averiguações PA1"
                        value={statsData.pa1Inspections}
                        color={themeColors.primary.main}
                        highlight={highlightedStat === "pa1Inspections"}
                        pa="PA1"
                        fleetTypeFilter={pa1FleetFilter}
                        onFilterChange={handleCardFilterChange}
                        fleetCounts={statsData.pa1Counts}
                        averiguacaoNumber="1"
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                    <Box>
                      <CustomStatCard
                        title="Averiguações PA2"
                        value={statsData.pa2Inspections}
                        color={themeColors.success.main}
                        highlight={highlightedStat === "pa2Inspections"}
                        pa="PA2"
                        fleetTypeFilter={pa2FleetFilter}
                        onFilterChange={handleCardFilterChange}
                        fleetCounts={statsData.pa2Counts}
                        averiguacaoNumber="2"
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                    <Box>
                      <CustomStatCard
                        title="Averiguações PA3"
                        value={statsData.pa3Inspections}
                        color={themeColors.warning.main}
                        highlight={highlightedStat === "pa3Inspections"}
                        pa="PA3"
                        fleetTypeFilter={pa3FleetFilter}
                        onFilterChange={handleCardFilterChange}
                        fleetCounts={statsData.pa3Counts}
                        averiguacaoNumber="3"
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
                    <Box>
                      <CustomStatCard
                        title="Averiguações PA4"
                        value={statsData.pa4Inspections}
                        color={themeColors.error.main}
                        highlight={highlightedStat === "pa4Inspections"}
                        pa="PA4"
                        fleetTypeFilter={pa4FleetFilter}
                        onFilterChange={handleCardFilterChange}
                        fleetCounts={statsData.pa4Counts}
                        averiguacaoNumber="4"
                      />
                    </Box>
                  </Fade>
                </Box>
              </Box>

              {/* Inspections Table */}
              <Box component="section">
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "500ms" : "0ms" }}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                      },
                      background: themeColors.background.card,
                      mb: 4,
                    }}
                  >
                    <CardHeader
                      title={
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Box
                            sx={{
                              width: { xs: "40px", sm: "48px" },
                              height: { xs: "40px", sm: "48px" },
                              borderRadius: "16px",
                              background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.light})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                              boxShadow: `0 6px 16px ${alpha(themeColors.secondary.main, 0.3)}`,
                            }}
                          >
                            <ViewList
                              sx={{
                                color: "white",
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                                color: themeColors.text.primary,
                                letterSpacing: "0.01em",
                                fontFamily: "'Montserrat', sans-serif",
                              }}
                            >
                              Averiguações Registradas
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                color: themeColors.text.secondary,
                                fontWeight: 400,
                                mt: 0.5,
                                fontFamily: "'Roboto', sans-serif",
                                fontStyle: "italic",
                              }}
                            >
                              Lista de todas as averiguações
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        padding: "1.5rem",
                        paddingBottom: "1rem",
                        borderBottom: `1px solid ${alpha(themeColors.divider, 0.6)}`,
                        "& .MuiCardHeader-title": {
                          fontWeight: 600,
                          fontSize: "1.125rem",
                          color: themeColors.text.primary,
                        },
                      }}
                    />
                    <CardContent sx={{ padding: "1.5rem" }}>
                      {/* Search and Filter Section */}
                      <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            border: `1px solid ${themeColors.divider}`,
                            background: alpha(themeColors.background.paper, 0.8),
                          }}
                        >
                          <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 2 }}>
                            <Box sx={{ flex: 1, width: "100%" }}>
                              <SearchInput
                                icon={Search}
                                placeholder="Buscar por averiguador ou rota..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                              />
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                label="Filtrar por data"
                                value={selectedDate}
                                onChange={(newDate) => setSelectedDate(newDate)}
                                slotProps={{
                                  textField: {
                                    variant: "outlined",
                                    size: "small",
                                    sx: {
                                      minWidth: "180px",
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: "white",
                                        height: "52px",
                                      },
                                    },
                                  },
                                }}
                                format="dd/MM/yyyy"
                                clearable
                                clearText="Limpar"
                              />
                            </LocalizationProvider>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                color: themeColors.text.secondary,
                                fontSize: "0.85rem",
                              }}
                            >
                              Filtros:
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    color: themeColors.text.secondary,
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  Por PA:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {["all", "PA1", "PA2", "PA3", "PA4"].map((pa) => (
                                    <Chip
                                      key={pa}
                                      label={pa === "all" ? "Todos" : pa}
                                      clickable
                                      onClick={() => setPaFilter(pa)}
                                      sx={{
                                        borderRadius: "12px",
                                        fontWeight: 500,
                                        backgroundColor:
                                          paFilter === pa
                                            ? alpha(themeColors.secondary.main, 0.1)
                                            : alpha(themeColors.background.default, 0.5),
                                        color:
                                          paFilter === pa ? themeColors.secondary.main : themeColors.text.secondary,
                                        border: `1px solid ${
                                          paFilter === pa ? themeColors.secondary.main : themeColors.divider
                                        }`,
                                        "&:hover": {
                                          backgroundColor: alpha(themeColors.secondary.main, 0.1),
                                          color: themeColors.secondary.main,
                                        },
                                        transition: "all 0.2s ease",
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    color: themeColors.text.secondary,
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  Por Tipo de Frota:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {["all", "Remoção", "Varrição", "Seletiva"].map((type) => (
                                    <Chip
                                      key={type}
                                      label={type === "all" ? "Todos" : type}
                                      clickable
                                      onClick={() => setFleetTypeFilter(type)}
                                      sx={{
                                        borderRadius: "12px",
                                        fontWeight: 500,
                                        backgroundColor:
                                          fleetTypeFilter === type
                                            ? alpha(themeColors.success.main, 0.1)
                                            : alpha(themeColors.background.default, 0.5),
                                        color:
                                          fleetTypeFilter === type
                                            ? themeColors.success.main
                                            : themeColors.text.secondary,
                                        border: `1px solid ${
                                          fleetTypeFilter === type ? themeColors.success.main : themeColors.divider
                                        }`,
                                        "&:hover": {
                                          backgroundColor: alpha(themeColors.success.main, 0.1),
                                          color: themeColors.success.main,
                                        },
                                        transition: "all 0.2s ease",
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={resetFilters}
                              startIcon={<Close />}
                              sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                borderColor: themeColors.divider,
                                color: themeColors.text.secondary,
                                "&:hover": {
                                  borderColor: themeColors.secondary.main,
                                  color: themeColors.secondary.main,
                                  backgroundColor: alpha(themeColors.secondary.main, 0.05),
                                },
                              }}
                            >
                              Limpar Filtros
                            </Button>
                          </Box>
                        </Paper>
                      </Box>

                      {/* Loading, Error or Table */}
                      {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
                          <CircularProgress color="secondary" />
                          <Typography sx={{ ml: 2, color: themeColors.text.secondary }}>
                            Carregando averiguações...
                          </Typography>
                        </Box>
                      ) : error ? (
                        <ErrorState message={error} onRetry={fetchData} />
                      ) : (
                        <DataTable
                          data={filteredInspections}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          sortField={sortField}
                          sortDirection={sortDirection}
                          themeColors={themeColors}
                          onPageChange={handlePageChange}
                          onRowsPerPageChange={handleRowsPerPageChange}
                          onSort={handleSort}
                          onRowClick={handleViewDetails}
                          onActionClick={handleActionMenuOpen}
                          loading={loading}
                          columns={tableColumns}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>

              {/* Bar Chart (replaced Pie Chart) */}
              <Box component="section" sx={{ mb: 4 }}>
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "600ms" : "0ms" }}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                      },
                      background: themeColors.background.card,
                    }}
                  >
                    <CardHeader
                      title={
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Box
                            sx={{
                              width: { xs: "40px", sm: "48px" },
                              height: { xs: "40px", sm: "48px" },
                              borderRadius: "16px",
                              background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.light})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              animation: `${keyframes.pulse} 2s ease-in-out infinite`,
                              boxShadow: `0 6px 16px ${alpha(themeColors.secondary.main, 0.3)}`,
                            }}
                          >
                            <BarChart
                              sx={{
                                color: "white",
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                                color: themeColors.text.primary,
                                letterSpacing: "0.01em",
                                fontFamily: "'Montserrat', sans-serif",
                              }}
                            >
                              Distribuição por Tipo de Frota
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                color: themeColors.text.secondary,
                                fontWeight: 400,
                                mt: 0.5,
                                fontFamily: "'Roboto', sans-serif",
                                fontStyle: "italic",
                              }}
                            >
                              Análise de averiguações por tipo de veículo
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        padding: "1.5rem",
                        paddingBottom: "1rem",
                        borderBottom: `1px solid ${alpha(themeColors.divider, 0.6)}`,
                      }}
                    />

                    <CardContent sx={{ padding: "1.5rem" }}>
                      {/* Novo componente de gráfico */}
                      <AveriguacaoGrafico
                        data={fleetTypeData}
                        themeColors={themeColors}
                        title="Tipo de Frota"
                        loading={loading}
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            const inspection = inspections.find((item) => item.id === selectedRowId)
            if (inspection) {
              handleViewDetails(inspection)
            }
          }}
          sx={{
            borderRadius: "8px",
            py: 1,
            px: 1.5,
            "&:hover": {
              backgroundColor: alpha(themeColors.secondary.main, 0.1),
            },
          }}
        >
          <Visibility fontSize="small" sx={{ mr: 1, color: themeColors.secondary.main }} />
          Visualizar
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleActionMenuClose()
            // Edit logic would go here
          }}
          sx={{
            borderRadius: "8px",
            py: 1,
            px: 1.5,
            "&:hover": {
              backgroundColor: alpha(themeColors.info.main, 0.1),
            },
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1, color: themeColors.info.main }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={handleDeleteConfirmOpen}
          sx={{
            borderRadius: "8px",
            py: 1,
            px: 1.5,
            "&:hover": {
              backgroundColor: alpha(themeColors.error.main, 0.1),
            },
          }}
        >
          <Delete fontSize="small" sx={{ mr: 1, color: themeColors.error.main }} />
          Excluir
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "0.5rem",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
          {"Confirmar Exclusão?"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Você tem certeza que deseja excluir esta averiguação? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={handleDeleteConfirmClose}
            variant="outlined"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            autoFocus
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: `0 4px 12px ${alpha(themeColors.error.main, 0.2)}`,
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Modal */}
      <DetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        inspection={selectedInspection}
        themeColors={themeColors}
        keyframes={keyframes}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
