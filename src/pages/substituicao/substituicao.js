"use client"

import { useState, useEffect } from "react"
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  FormHelperText,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers"
import {
  Refresh,
  Close,
  Menu as MenuIcon,
  MoreVert,
  Delete,
  Search,
  Edit,
  Add,
  Save,
  SwapHoriz,
  ErrorOutline,
  LocalShipping,
  Person,
  Group,
  Visibility,
} from "@mui/icons-material"
import Sidebar from "@/components/sidebar"
import VisualizacaoModal from "../../components/visualizar_substituicao"

// API Base URL
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

// Search input component
const SearchInput = ({ icon: Icon, placeholder, value, onChange, suggestions = [] }) => {
  return (
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
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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

// Tipo de substituição card component
const TipoSubstituicaoCard = ({ icon: Icon, title, count, color, onClick, selected, clickable = true }) => {
  return (
    <Card
      onClick={clickable ? onClick : undefined}
      sx={{
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        background: "white",
        height: "100%",
        transition: "all 0.3s ease",
        cursor: clickable ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        border: selected ? `2px solid ${color}` : "2px solid transparent",
        "&:hover": clickable
          ? {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              transform: "translateY(-2px)",
            }
          : {},
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
      }}
    >
      <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              backgroundColor: alpha(color, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color,
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              ml: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              color: themeColors.text.primary,
            }}
          >
            {title}
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: "1.75rem",
            color: color,
            textAlign: "center",
            my: 1,
          }}
        >
          {count}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: themeColors.text.secondary,
            textAlign: "center",
            mt: "auto",
          }}
        >
          {clickable ? (selected ? "Selecionado" : "Clique para selecionar") : "Total de substituições"}
        </Typography>
      </CardContent>
    </Card>
  )
}

// Adicione este novo componente após o componente TipoSubstituicaoCard

// Motivo substituição card component
const MotivoSubstituicaoCard = ({ title, description, onClick, selected }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        background: "white",
        height: "100%",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        border: selected ? `2px solid ${themeColors.secondary.main}` : "2px solid transparent",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: "0.9rem",
            color: themeColors.text.primary,
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: themeColors.text.secondary,
            fontSize: "0.8rem",
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function RegistroSubstituicoes() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State variables
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [paFilter, setPaFilter] = useState("all")
  const [tipoServicoFilter, setTipoServicoFilter] = useState("all")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortField, setSortField] = useState("data")
  const [sortDirection, setSortDirection] = useState("desc")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  // Substituição form state
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    data: new Date(),
    hora: new Date(),
    pa: "",
    rota: "",
    tipoServico: "",
    tipoSubstituicao: "",
    motivoSubstituicao: "",
    itemOriginal: "",
    itemSubstituto: "",
    observacoes: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [tipoSubstituicaoSelecionado, setTipoSubstituicaoSelecionado] = useState("")

  // Modifique o estado do componente principal para incluir os motivos específicos
  // Adicione após a declaração de tipoSubstituicaoSelecionado

  const [motivoSelecionado, setMotivoSelecionado] = useState("")

  // Estado para o modal de visualização
  const [visualizacaoOpen, setVisualizacaoOpen] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState(null)

  // Action menu states
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // API data
  const [substituicoes, setSubstituicoes] = useState([])

  // Adicione estes arrays de motivos após a declaração de substituicoes

  // Motivos específicos para cada tipo de substituição
  const motivosVeiculo = [
    { id: "quebra", title: "Quebra Mecânica", description: "Veículo com falha mecânica ou elétrica" },
    { id: "manutencao", title: "Manutenção Preventiva", description: "Veículo em manutenção programada" },
    { id: "acidente", title: "Acidente", description: "Veículo envolvido em acidente" },
    { id: "combustivel", title: "Problema de Combustível", description: "Falha no sistema de combustível" },
    { id: "pneu", title: "Problema de Pneu", description: "Pneu furado ou desgastado" },
    { id: "outro_veiculo", title: "Outro Motivo", description: "Outro motivo não listado" },
  ]

  const motivosMotorista = [
    { id: "falta", title: "Falta", description: "Motorista não compareceu ao trabalho" },
    { id: "atestado", title: "Atestado Médico", description: "Motorista apresentou atestado médico" },
    { id: "ferias", title: "Férias", description: "Motorista em período de férias" },
    { id: "licenca", title: "Licença", description: "Motorista em licença (paternidade, etc.)" },
    { id: "realocacao", title: "Realocação", description: "Motorista realocado para outra rota" },
    { id: "outro_motorista", title: "Outro Motivo", description: "Outro motivo não listado" },
  ]

  const motivosColetores = [
    { id: "falta_equipe", title: "Falta da Equipe", description: "Equipe não compareceu ao trabalho" },
    { id: "atestado_equipe", title: "Atestado Médico", description: "Um ou mais coletores com atestado" },
    { id: "equipe_incompleta", title: "Equipe Incompleta", description: "Número insuficiente de coletores" },
    { id: "realocacao_equipe", title: "Realocação", description: "Equipe realocada para outra rota" },
    { id: "treinamento", title: "Treinamento", description: "Equipe em treinamento" },
    { id: "outro_coletores", title: "Outro Motivo", description: "Outro motivo não listado" },
  ]

  // Mock data for development
  const mockSubstituicoes = [
    {
      id: 1,
      data: new Date().toISOString().split("T")[0],
      hora: new Date().toTimeString().split(" ")[0],
      pa: "PA1",
      rota: "PA1-R101",
      tipoServico: "Remoção",
      tipoSubstituicao: "Veículo",
      motivoSubstituicao: "Quebra mecânica",
      itemOriginal: "Basculante - XYZ-1234",
      itemSubstituto: "Basculante - ABC-5678",
      observacoes: "Veículo original com problema no sistema hidráulico",
      registradoPor: "João Silva",
    },
    {
      id: 2,
      data: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      hora: "10:30:00",
      pa: "PA2",
      rota: "PA2-V202",
      tipoServico: "Varrição",
      tipoSubstituicao: "Motorista",
      motivoSubstituicao: "Falta",
      itemOriginal: "Carlos Pereira",
      itemSubstituto: "Marcos Oliveira",
      observacoes: "Motorista original não compareceu ao trabalho",
      registradoPor: "Ana Costa",
    },
    {
      id: 3,
      data: new Date(Date.now() - 172800000).toISOString().split("T")[0],
      hora: "14:15:00",
      pa: "PA3",
      rota: "PA3-S303",
      tipoServico: "Seletiva",
      tipoSubstituicao: "Coletores",
      motivoSubstituicao: "Atestado médico",
      itemOriginal: "Equipe A (3 coletores)",
      itemSubstituto: "Equipe B (3 coletores)",
      observacoes: "Substituição de toda a equipe de coleta",
      registradoPor: "Roberto Santos",
    },
    {
      id: 4,
      data: new Date(Date.now() - 259200000).toISOString().split("T")[0],
      hora: "09:45:00",
      pa: "PA4",
      rota: "PA4-R404",
      tipoServico: "Remoção",
      tipoSubstituicao: "Veículo",
      motivoSubstituicao: "Manutenção preventiva",
      itemOriginal: "Baú - DEF-9012",
      itemSubstituto: "Baú - GHI-3456",
      observacoes: "Veículo original em manutenção programada",
      registradoPor: "Fernanda Lima",
    },
    {
      id: 5,
      data: new Date(Date.now() - 345600000).toISOString().split("T")[0],
      hora: "16:20:00",
      pa: "PA1",
      rota: "PA1-V105",
      tipoServico: "Varrição",
      tipoSubstituicao: "Coletores",
      motivoSubstituicao: "Realocação",
      itemOriginal: "Equipe C (2 coletores)",
      itemSubstituto: "Equipe D (2 coletores)",
      observacoes: "Realocação de equipe para atender demanda emergencial",
      registradoPor: "Paulo Mendes",
    },
    {
      id: 6,
      data: new Date(Date.now() - 432000000).toISOString().split("T")[0],
      hora: "08:15:00",
      pa: "PA2",
      rota: "PA2-R205",
      tipoServico: "Remoção",
      tipoSubstituicao: "Veículo",
      motivoSubstituicao: "Problema de Combustível",
      itemOriginal: "Basculante - JKL-7890",
      itemSubstituto: "Basculante - MNO-1234",
      observacoes: "Veículo com problema no sistema de injeção de combustível",
      registradoPor: "Ricardo Alves",
    },
    {
      id: 7,
      data: new Date(Date.now() - 518400000).toISOString().split("T")[0],
      hora: "11:30:00",
      pa: "PA3",
      rota: "PA3-V301",
      tipoServico: "Varrição",
      tipoSubstituicao: "Motorista",
      motivoSubstituicao: "Férias",
      itemOriginal: "André Santos",
      itemSubstituto: "Felipe Martins",
      observacoes: "Substituição programada por período de férias",
      registradoPor: "Carla Mendes",
    },
    {
      id: 8,
      data: new Date(Date.now() - 604800000).toISOString().split("T")[0],
      hora: "13:45:00",
      pa: "PA4",
      rota: "PA4-S401",
      tipoServico: "Seletiva",
      tipoSubstituicao: "Coletores",
      motivoSubstituicao: "Equipe Incompleta",
      itemOriginal: "Equipe E (3 coletores)",
      itemSubstituto: "Equipe F (3 coletores)",
      observacoes: "Equipe original com apenas 2 coletores disponíveis",
      registradoPor: "Marcelo Souza",
    },
    {
      id: 9,
      data: new Date(Date.now() - 691200000).toISOString().split("T")[0],
      hora: "07:30:00",
      pa: "PA1",
      rota: "PA1-R102",
      tipoServico: "Remoção",
      tipoSubstituicao: "Veículo",
      motivoSubstituicao: "Acidente",
      itemOriginal: "Baú - PQR-5678",
      itemSubstituto: "Baú - STU-9012",
      observacoes: "Veículo envolvido em acidente leve, sem feridos",
      registradoPor: "Juliana Costa",
    },
    {
      id: 10,
      data: new Date(Date.now() - 777600000).toISOString().split("T")[0],
      hora: "15:00:00",
      pa: "PA2",
      rota: "PA2-S201",
      tipoServico: "Seletiva",
      tipoSubstituicao: "Motorista",
      motivoSubstituicao: "Licença",
      itemOriginal: "Roberto Oliveira",
      itemSubstituto: "Lucas Ferreira",
      observacoes: "Motorista em licença paternidade",
      registradoPor: "Amanda Silva",
    },
    {
      id: 11,
      data: new Date(Date.now() - 864000000).toISOString().split("T")[0],
      hora: "10:00:00",
      pa: "PA3",
      rota: "PA3-R302",
      tipoServico: "Remoção",
      tipoSubstituicao: "Veículo",
      motivoSubstituicao: "Problema de Pneu",
      itemOriginal: "Basculante - VWX-3456",
      itemSubstituto: "Basculante - YZA-7890",
      observacoes: "Veículo com pneus desgastados, enviado para troca",
      registradoPor: "Rodrigo Santos",
    },
    {
      id: 12,
      data: new Date(Date.now() - 950400000).toISOString().split("T")[0],
      hora: "12:30:00",
      pa: "PA4",
      rota: "PA4-V402",
      tipoServico: "Varrição",
      tipoSubstituicao: "Coletores",
      motivoSubstituicao: "Treinamento",
      itemOriginal: "Equipe G (2 coletores)",
      itemSubstituto: "Equipe H (2 coletores)",
      observacoes: "Equipe original em treinamento de segurança",
      registradoPor: "Fernanda Almeida",
    },
    {
      id: 13,
      data: new Date(Date.now() - 1036800000).toISOString().split("T")[0],
      hora: "08:45:00",
      pa: "PA1",
      rota: "PA1-S101",
      tipoServico: "Seletiva",
      tipoSubstituicao: "Veículo",
      motivoSubstituicao: "Manutenção preventiva",
      itemOriginal: "Seletolixo - BCD-1234",
      itemSubstituto: "Seletolixo - EFG-5678",
      observacoes: "Veículo em manutenção preventiva programada",
      registradoPor: "Carlos Eduardo",
    },
    {
      id: 14,
      data: new Date(Date.now() - 1123200000).toISOString().split("T")[0],
      hora: "14:00:00",
      pa: "PA2",
      rota: "PA2-R203",
      tipoServico: "Remoção",
      tipoSubstituicao: "Motorista",
      motivoSubstituicao: "Atestado médico",
      itemOriginal: "Paulo Roberto",
      itemSubstituto: "José Carlos",
      observacoes: "Motorista com atestado médico de 3 dias",
      registradoPor: "Mariana Costa",
    },
    {
      id: 15,
      data: new Date(Date.now() - 1209600000).toISOString().split("T")[0],
      hora: "09:15:00",
      pa: "PA3",
      rota: "PA3-V304",
      tipoServico: "Varrição",
      tipoSubstituicao: "Coletores",
      motivoSubstituicao: "Falta da Equipe",
      itemOriginal: "Equipe I (3 coletores)",
      itemSubstituto: "Equipe J (3 coletores)",
      observacoes: "Equipe original não compareceu ao trabalho",
      registradoPor: "Antônio Silva",
    },
    {
      id: 16,
      data: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Ontem
      hora: "08:30:00",
      pa: "PA1",
      rota: "PA1-R106",
      tipoServico: "Remoção",
      tipoSubstituicao: "Veículo",
      motivoSubstituicao: "Quebra mecânica",
      itemOriginal: "Basculante - HIJ-5678",
      itemSubstituto: "Basculante - KLM-9012",
      observacoes: "Veículo com problema no sistema de freios",
      registradoPor: "Marcos Silva",
    },
    {
      id: 17,
      data: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Ontem
      hora: "09:45:00",
      pa: "PA2",
      rota: "PA2-V207",
      tipoServico: "Varrição",
      tipoSubstituicao: "Motorista",
      motivoSubstituicao: "Atestado médico",
      itemOriginal: "Fernando Santos",
      itemSubstituto: "Ricardo Oliveira",
      observacoes: "Motorista com atestado de 2 dias",
      registradoPor: "Carla Mendes",
    },
    {
      id: 18,
      data: new Date(Date.now() - 172800000).toISOString().split("T")[0], // 2 dias atrás
      hora: "10:15:00",
      pa: "PA3",
      rota: "PA3-S305",
      tipoServico: "Seletiva",
      tipoSubstituicao: "Coletores",
      motivoSubstituicao: "Falta da Equipe",
      itemOriginal: "Equipe K (3 coletores)",
      itemSubstituto: "Equipe L (3 coletores)",
      observacoes: "Equipe original não compareceu ao trabalho",
      registradoPor: "Juliana Costa",
    },
    {
      id: 19,
      data: new Date(Date.now() - 172800000).toISOString().split("T")[0], // 2 dias atrás
      hora: "14:30:00",
      pa: "PA4",
      rota: "PA4-R405",
      tipoServico: "Remoção",
      tipoSubstituicao: "Veículo",
      motivoSubstituicao: "Manutenção preventiva",
      itemOriginal: "Baú - NOP-3456",
      itemSubstituto: "Baú - QRS-7890",
      observacoes: "Veículo em manutenção programada",
      registradoPor: "Roberto Alves",
    },
    {
      id: 20,
      data: new Date(Date.now() - 259200000).toISOString().split("T")[0], // 3 dias atrás
      hora: "11:00:00",
      pa: "PA1",
      rota: "PA1-V108",
      tipoServico: "Varrição",
      tipoSubstituicao: "Coletores",
      motivoSubstituicao: "Realocação",
      itemOriginal: "Equipe M (2 coletores)",
      itemSubstituto: "Equipe N (2 coletores)",
      observacoes: "Realocação para atender demanda urgente",
      registradoPor: "Ana Paula",
    },
  ]

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulando chamada à API
      setTimeout(() => {
        setSubstituicoes(mockSubstituicoes)
        setLoading(false)
        setSnackbarMessage(`${mockSubstituicoes.length} substituições carregadas com sucesso`)
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
      }, 1000)
    } catch (error) {
      console.error("Erro ao processar dados:", error)
      setError(`Erro ao carregar dados: ${error.message}`)
      setSnackbarMessage("Erro ao carregar dados")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
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

  // Handle edit
  const handleEdit = () => {
    const substituicao = substituicoes.find((item) => item.id === selectedRowId)
    if (substituicao) {
      setFormData({
        data: new Date(substituicao.data),
        hora: new Date(`2000-01-01T${substituicao.hora}`),
        pa: substituicao.pa,
        rota: substituicao.rota,
        tipoServico: substituicao.tipoServico,
        tipoSubstituicao: substituicao.tipoSubstituicao,
        motivoSubstituicao: substituicao.motivoSubstituicao,
        itemOriginal: substituicao.itemOriginal,
        itemSubstituto: substituicao.itemSubstituto,
        observacoes: substituicao.observacoes,
      })
      setTipoSubstituicaoSelecionado(substituicao.tipoSubstituicao)

      // Encontrar o ID do motivo com base no título
      let motivoId = ""
      if (substituicao.tipoSubstituicao === "Veículo") {
        const motivo = motivosVeiculo.find((m) => m.title === substituicao.motivoSubstituicao)
        motivoId = motivo ? motivo.id : ""
      } else if (substituicao.tipoSubstituicao === "Motorista") {
        const motivo = motivosMotorista.find((m) => m.title === substituicao.motivoSubstituicao)
        motivoId = motivo ? motivo.id : ""
      } else if (substituicao.tipoSubstituicao === "Coletores") {
        const motivo = motivosColetores.find((m) => m.title === substituicao.motivoSubstituicao)
        motivoId = motivo ? motivo.id : ""
      }
      setMotivoSelecionado(motivoId)

      setFormOpen(true)
    }
    handleActionMenuClose()
  }

  // Handle view
  const handleView = (item) => {
    setItemSelecionado(item)
    setVisualizacaoOpen(true)
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
    setSubstituicoes((prev) => prev.filter((item) => item.id !== selectedRowId))
    setDeleteConfirmOpen(false)
    setSnackbarMessage("Substituição excluída com sucesso!")
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

  // Handle form open/close
  const handleFormOpen = () => {
    setFormData({
      data: new Date(),
      hora: new Date(),
      pa: "",
      rota: "",
      tipoServico: "",
      tipoSubstituicao: "",
      motivoSubstituicao: "",
      itemOriginal: "",
      itemSubstituto: "",
      observacoes: "",
    })
    setTipoSubstituicaoSelecionado("")
    setFormErrors({})
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  // Handle date/time change
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      data: date,
    }))
  }

  const handleTimeChange = (time) => {
    setFormData((prev) => ({
      ...prev,
      hora: time,
    }))
  }

  // Adicione esta função para obter os motivos com base no tipo selecionado
  // Adicione após a função handleTipoSubstituicaoSelect

  // Obter motivos com base no tipo de substituição
  const getMotivos = () => {
    switch (tipoSubstituicaoSelecionado) {
      case "Veículo":
        return motivosVeiculo
      case "Motorista":
        return motivosMotorista
      case "Coletores":
        return motivosColetores
      default:
        return []
    }
  }

  // Adicione esta função para lidar com a seleção de motivo
  // Adicione após a função getMotivos

  // Handle motivo selection
  const handleMotivoSelect = (motivo) => {
    setMotivoSelecionado(motivo.id)
    setFormData((prev) => ({
      ...prev,
      motivoSubstituicao: motivo.title,
    }))

    // Clear error for this field if it exists
    if (formErrors.motivoSubstituicao) {
      setFormErrors((prev) => ({
        ...prev,
        motivoSubstituicao: undefined,
      }))
    }
  }

  // Modifique a função handleTipoSubstituicaoSelect para resetar o motivo quando o tipo muda
  // Substitua a função handleTipoSubstituicaoSelect existente

  // Handle tipo substituição selection
  const handleTipoSubstituicaoSelect = (tipo) => {
    setTipoSubstituicaoSelecionado(tipo)
    setMotivoSelecionado("") // Reset motivo quando o tipo muda
    setFormData((prev) => ({
      ...prev,
      tipoSubstituicao: tipo,
      motivoSubstituicao: "", // Reset motivo no form data também
    }))

    // Clear error for this field if it exists
    if (formErrors.tipoSubstituicao) {
      setFormErrors((prev) => ({
        ...prev,
        tipoSubstituicao: undefined,
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    if (!formData.data) errors.data = "Data é obrigatória"
    if (!formData.hora) errors.hora = "Hora é obrigatória"
    if (!formData.pa) errors.pa = "PA é obrigatório"
    if (!formData.rota) errors.rota = "Rota é obrigatória"
    if (!formData.tipoServico) errors.tipoServico = "Tipo de serviço é obrigatório"
    if (!formData.tipoSubstituicao) errors.tipoSubstituicao = "Tipo de substituição é obrigatório"
    if (!formData.motivoSubstituicao) errors.motivoSubstituicao = "Motivo da substituição é obrigatório"
    if (!formData.itemOriginal) errors.itemOriginal = "Item original é obrigatório"
    if (!formData.itemSubstituto) errors.itemSubstituto = "Item substituto é obrigatório"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submit
  const handleFormSubmit = () => {
    if (!validateForm()) {
      setSnackbarMessage("Por favor, preencha todos os campos obrigatórios")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      return
    }

    // Format data for submission
    const formattedData = {
      id: selectedRowId || Date.now(),
      data: formData.data.toISOString().split("T")[0],
      hora: formData.hora.toTimeString().split(" ")[0],
      pa: formData.pa,
      rota: formData.rota,
      tipoServico: formData.tipoServico,
      tipoSubstituicao: formData.tipoSubstituicao,
      motivoSubstituicao: formData.motivoSubstituicao,
      itemOriginal: formData.itemOriginal,
      itemSubstituto: formData.itemSubstituto,
      observacoes: formData.observacoes,
      registradoPor: "Usuário Atual", // Normalmente viria do contexto de autenticação
    }

    if (selectedRowId) {
      // Update existing
      setSubstituicoes((prev) => prev.map((item) => (item.id === selectedRowId ? formattedData : item)))
      setSnackbarMessage("Substituição atualizada com sucesso!")
    } else {
      // Add new
      setSubstituicoes((prev) => [...prev, formattedData])
      setSnackbarMessage("Substituição registrada com sucesso!")
    }

    setSnackbarSeverity("success")
    setSnackbarOpen(true)
    setFormOpen(false)
  }

  // Apply filters
  const applyFilters = () => {
    return substituicoes.filter((item) => {
      // Search filter
      const searchMatch =
        searchValue === "" ||
        item.rota.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.pa.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.tipoSubstituicao.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.itemOriginal.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.itemSubstituto.toLowerCase().includes(searchValue.toLowerCase())

      // Date filter
      let dateMatch = true
      if (selectedDate) {
        const itemDate = new Date(item.data)
        const filterDate = new Date(selectedDate)
        dateMatch =
          itemDate.getDate() === filterDate.getDate() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
      }

      // PA filter
      const paMatch = paFilter === "all" || item.pa === paFilter

      // Tipo serviço filter
      const tipoServicoMatch = tipoServicoFilter === "all" || item.tipoServico === tipoServicoFilter

      return searchMatch && dateMatch && paMatch && tipoServicoMatch
    })
  }

  // Filter and sort substituicoes
  const filteredSubstituicoes = applyFilters().sort((a, b) => {
    const factor = sortDirection === "asc" ? 1 : -1

    if (sortField === "data") {
      const dateA = new Date(a.data + "T" + a.hora)
      const dateB = new Date(b.data + "T" + b.hora)
      return factor * (dateA - dateB)
    }

    if (sortField === "pa") {
      return factor * a.pa.localeCompare(b.pa)
    }

    if (sortField === "rota") {
      return factor * a.rota.localeCompare(b.rota)
    }

    if (sortField === "tipoSubstituicao") {
      return factor * a.tipoSubstituicao.localeCompare(b.tipoSubstituicao)
    }

    return 0
  })

  // Reset all filters
  const resetFilters = () => {
    setSearchValue("")
    setSelectedDate(new Date())
    setPaFilter("all")
    setTipoServicoFilter("all")
    setSnackbarMessage("Filtros resetados com sucesso!")
    setSnackbarSeverity("info")
    setSnackbarOpen(true)
  }

  // Calculate statistics
  const statsData = {
    totalSubstituicoes: substituicoes.length,
    substituicoesVeiculo: substituicoes.filter((s) => s.tipoSubstituicao === "Veículo").length,
    substituicoesMotorista: substituicoes.filter((s) => s.tipoSubstituicao === "Motorista").length,
    substituicoesColetores: substituicoes.filter((s) => s.tipoSubstituicao === "Coletores").length,
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
                  {/* Vertical green line instead of icon */}
                  <Box
                    sx={{
                      width: "6px",
                      height: "42px",
                      borderRadius: "3px",
                      background: themeColors.secondary.main,
                      mr: 2,
                      mt: 1,
                      boxShadow: `0 4px 12px ${alpha(themeColors.secondary.main, 0.3)}`,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: "1.35rem", sm: "1.8rem" },
                      color: themeColors.text.primary,
                      letterSpacing: "0.02em",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    REGISTRO DE SUBSTITUIÇÕES
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
                  Controle de substituições de veículos, motoristas e coletores
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
                      sm: "repeat(3, 1fr)",
                    },
                    mb: 3,
                  }}
                >
                  <Fade in={!loading} timeout={500}>
                    <Box>
                      <TipoSubstituicaoCard
                        icon={LocalShipping}
                        title="Veículos"
                        count={statsData.substituicoesVeiculo}
                        color={themeColors.primary.main}
                        clickable={false}
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "100ms" : "0ms" }}>
                    <Box>
                      <TipoSubstituicaoCard
                        icon={Person}
                        title="Motoristas"
                        count={statsData.substituicoesMotorista}
                        color={themeColors.success.main}
                        clickable={false}
                      />
                    </Box>
                  </Fade>
                  <Fade in={!loading} timeout={500} style={{ transitionDelay: !loading ? "200ms" : "0ms" }}>
                    <Box>
                      <TipoSubstituicaoCard
                        icon={Group}
                        title="Coletores"
                        count={statsData.substituicoesColetores}
                        color={themeColors.warning.main}
                        clickable={false}
                      />
                    </Box>
                  </Fade>
                </Box>
              </Box>

              {/* Action Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Add />}
                  onClick={handleFormOpen}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${alpha(themeColors.secondary.main, 0.3)}`,
                    padding: "10px 20px",
                    "&:hover": {
                      boxShadow: `0 6px 16px ${alpha(themeColors.secondary.main, 0.4)}`,
                    },
                  }}
                >
                  Nova Substituição
                </Button>
              </Box>

              {/* Substituições Table */}
              <Box component="section">
                <Zoom in={!loading} timeout={500} style={{ transitionDelay: !loading ? "300ms" : "0ms" }}>
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
                            <SwapHoriz
                              sx={{
                                color: "white",
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                              }}
                            />
                          </Box>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  fontSize: { xs: "1.3rem", sm: "1.5rem" },
                                  color: themeColors.text.primary,
                                  letterSpacing: "0.01em",
                                  fontFamily: "'Montserrat', sans-serif",
                                }}
                              >
                                Substituições Registradas
                              </Typography>
                              <Chip
                                label={`${filteredSubstituicoes.length} registros`}
                                size="small"
                                sx={{
                                  ml: 2,
                                  backgroundColor: alpha(themeColors.secondary.main, 0.1),
                                  color: themeColors.secondary.main,
                                  fontWeight: 600,
                                  borderRadius: "12px",
                                }}
                              />
                            </Box>
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
                              Lista de todas as substituições
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
                                placeholder="Buscar por rota, veículo, motorista..."
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
                                  Por Tipo de Serviço:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {["all", "Remoção", "Varrição", "Seletiva"].map((type) => (
                                    <Chip
                                      key={type}
                                      label={type === "all" ? "Todos" : type}
                                      clickable
                                      onClick={() => setTipoServicoFilter(type)}
                                      sx={{
                                        borderRadius: "12px",
                                        fontWeight: 500,
                                        backgroundColor:
                                          tipoServicoFilter === type
                                            ? alpha(themeColors.success.main, 0.1)
                                            : alpha(themeColors.background.default, 0.5),
                                        color:
                                          tipoServicoFilter === type
                                            ? themeColors.success.main
                                            : themeColors.text.secondary,
                                        border: `1px solid ${
                                          tipoServicoFilter === type ? themeColors.success.main : themeColors.divider
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
                            Carregando substituições...
                          </Typography>
                        </Box>
                      ) : error ? (
                        <ErrorState message={error} onRetry={fetchData} />
                      ) : (
                        <>
                          <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "none" }}>
                            <Table sx={{ minWidth: 650 }} aria-label="tabela de substituições">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 600 }}>Data/Hora</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>PA/Rota</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>Tipo de Serviço</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>Tipo de Substituição</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>Item Original</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>Item Substituto</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {filteredSubstituicoes
                                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  .map((row) => (
                                    <TableRow
                                      key={row.id}
                                      sx={{
                                        "&:hover": { backgroundColor: alpha(themeColors.primary.main, 0.05) },
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleView(row)}
                                    >
                                      <TableCell>
                                        {new Date(row.data).toLocaleDateString("pt-BR")} {row.hora.substring(0, 5)}
                                      </TableCell>
                                      <TableCell>
                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {row.pa}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {row.rota}
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={row.tipoServico}
                                          size="small"
                                          sx={{
                                            backgroundColor: alpha(
                                              row.tipoServico === "Remoção"
                                                ? themeColors.primary.main
                                                : row.tipoServico === "Varrição"
                                                  ? themeColors.success.main
                                                  : themeColors.warning.main,
                                              0.1,
                                            ),
                                            color:
                                              row.tipoServico === "Remoção"
                                                ? themeColors.primary.main
                                                : row.tipoServico === "Varrição"
                                                  ? themeColors.success.main
                                                  : themeColors.warning.main,
                                            fontWeight: 600,
                                            height: "1.5rem",
                                            borderRadius: "12px",
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={row.tipoSubstituicao}
                                          size="small"
                                          sx={{
                                            backgroundColor: alpha(
                                              row.tipoSubstituicao === "Veículo"
                                                ? themeColors.primary.main
                                                : row.tipoSubstituicao === "Motorista"
                                                  ? themeColors.success.main
                                                  : themeColors.warning.main,
                                              0.1,
                                            ),
                                            color:
                                              row.tipoSubstituicao === "Veículo"
                                                ? themeColors.primary.main
                                                : row.tipoSubstituicao === "Motorista"
                                                  ? themeColors.success.main
                                                  : themeColors.warning.main,
                                            fontWeight: 600,
                                            height: "1.5rem",
                                            borderRadius: "12px",
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell>{row.itemOriginal}</TableCell>
                                      <TableCell>{row.itemSubstituto}</TableCell>
                                      <TableCell>
                                        <Box sx={{ display: "flex" }}>
                                          <IconButton
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleView(row)
                                            }}
                                            sx={{
                                              color: themeColors.info.main,
                                              mr: 1,
                                              "&:hover": {
                                                backgroundColor: alpha(themeColors.info.main, 0.1),
                                              },
                                            }}
                                          >
                                            <Visibility fontSize="small" />
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            onClick={(e) => handleActionMenuOpen(e, row.id)}
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
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                {filteredSubstituicoes.length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                      <Typography variant="body2" color="text.secondary">
                                        Nenhuma substituição encontrada
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredSubstituicoes.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            labelRowsPerPage="Linhas por página:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                          />
                        </>
                      )}
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
          onClick={handleEdit}
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
            Você tem certeza que deseja excluir este registro de substituição? Esta ação não pode ser desfeita.
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

      {/* Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "0.5rem",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
          <SwapHoriz sx={{ mr: 1, color: themeColors.secondary.main }} />
          {selectedRowId ? "Editar Substituição" : "Nova Substituição"}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Seção de Tipo de Substituição */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: `1px solid ${themeColors.divider}`,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: themeColors.text.primary,
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <SwapHoriz sx={{ mr: 1, color: themeColors.secondary.main, fontSize: "1.2rem" }} />
                    Selecione o tipo de substituição:
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gap: "1rem",
                      gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(3, 1fr)",
                      },
                    }}
                  >
                    <TipoSubstituicaoCard
                      icon={LocalShipping}
                      title="Veículo"
                      count={statsData.substituicoesVeiculo}
                      color={themeColors.primary.main}
                      onClick={() => handleTipoSubstituicaoSelect("Veículo")}
                      selected={tipoSubstituicaoSelecionado === "Veículo"}
                    />
                    <TipoSubstituicaoCard
                      icon={Person}
                      title="Motorista"
                      count={statsData.substituicoesMotorista}
                      color={themeColors.success.main}
                      onClick={() => handleTipoSubstituicaoSelect("Motorista")}
                      selected={tipoSubstituicaoSelecionado === "Motorista"}
                    />
                    <TipoSubstituicaoCard
                      icon={Group}
                      title="Coletores"
                      count={statsData.substituicoesColetores}
                      color={themeColors.warning.main}
                      onClick={() => handleTipoSubstituicaoSelect("Coletores")}
                      selected={tipoSubstituicaoSelecionado === "Coletores"}
                    />
                  </Box>
                  {formErrors.tipoSubstituicao && (
                    <FormHelperText error sx={{ mt: 1, ml: 1 }}>
                      {formErrors.tipoSubstituicao}
                    </FormHelperText>
                  )}
                </Paper>
              </Grid>

              {/* Seção de Motivo de Substituição - Aparece apenas quando um tipo é selecionado */}
              {tipoSubstituicaoSelecionado && (
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      border: `1px solid ${themeColors.divider}`,
                      mb: 2,
                      background: alpha(themeColors.background.default, 0.5),
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: themeColors.text.primary,
                        fontSize: "1rem",
                      }}
                    >
                      Motivo da substituição:
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gap: "1rem",
                        gridTemplateColumns: {
                          xs: "repeat(1, 1fr)",
                          sm: "repeat(2, 1fr)",
                          md: "repeat(3, 1fr)",
                        },
                      }}
                    >
                      {getMotivos().map((motivo) => (
                        <MotivoSubstituicaoCard
                          key={motivo.id}
                          title={motivo.title}
                          description={motivo.description}
                          onClick={() => handleMotivoSelect(motivo)}
                          selected={motivoSelecionado === motivo.id}
                        />
                      ))}
                    </Box>
                    {formErrors.motivoSubstituicao && (
                      <FormHelperText error sx={{ mt: 1, ml: 1 }}>
                        {formErrors.motivoSubstituicao}
                      </FormHelperText>
                    )}
                  </Paper>
                </Grid>
              )}

              {/* Seção de Informações Básicas */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: `1px solid ${themeColors.divider}`,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: themeColors.text.primary,
                      fontSize: "1rem",
                    }}
                  >
                    Informações básicas:
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Data da Substituição"
                          value={formData.data}
                          onChange={handleDateChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: "outlined",
                              error: !!formErrors.data,
                              helperText: formErrors.data,
                              size: "small",
                            },
                          }}
                          format="dd/MM/yyyy"
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          label="Hora da Substituição"
                          value={formData.hora}
                          onChange={handleTimeChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: "outlined",
                              error: !!formErrors.hora,
                              helperText: formErrors.hora,
                              size: "small",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth error={!!formErrors.pa} size="small">
                        <InputLabel id="pa-label">PA</InputLabel>
                        <Select
                          labelId="pa-label"
                          id="pa"
                          name="pa"
                          value={formData.pa}
                          onChange={handleInputChange}
                          label="PA"
                        >
                          <MenuItem value="">Selecione</MenuItem>
                          <MenuItem value="PA1">PA1</MenuItem>
                          <MenuItem value="PA2">PA2</MenuItem>
                          <MenuItem value="PA3">PA3</MenuItem>
                          <MenuItem value="PA4">PA4</MenuItem>
                        </Select>
                        {formErrors.pa && <FormHelperText>{formErrors.pa}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth error={!!formErrors.tipoServico} size="small">
                        <InputLabel id="tipo-servico-label">Tipo de Serviço</InputLabel>
                        <Select
                          labelId="tipo-servico-label"
                          id="tipoServico"
                          name="tipoServico"
                          value={formData.tipoServico}
                          onChange={handleInputChange}
                          label="Tipo de Serviço"
                        >
                          <MenuItem value="">Selecione</MenuItem>
                          <MenuItem value="Remoção">Remoção</MenuItem>
                          <MenuItem value="Varrição">Varrição</MenuItem>
                          <MenuItem value="Seletiva">Seletiva</MenuItem>
                        </Select>
                        {formErrors.tipoServico && <FormHelperText>{formErrors.tipoServico}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Rota"
                        name="rota"
                        value={formData.rota}
                        onChange={handleInputChange}
                        error={!!formErrors.rota}
                        helperText={formErrors.rota}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Seção de Itens Substituídos */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: `1px solid ${themeColors.divider}`,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: themeColors.text.primary,
                      fontSize: "1rem",
                    }}
                  >
                    Itens substituídos:
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={
                          tipoSubstituicaoSelecionado === "Veículo"
                            ? "Veículo Original"
                            : tipoSubstituicaoSelecionado === "Motorista"
                              ? "Motorista Original"
                              : "Coletores Originais"
                        }
                        name="itemOriginal"
                        value={formData.itemOriginal}
                        onChange={handleInputChange}
                        error={!!formErrors.itemOriginal}
                        helperText={formErrors.itemOriginal}
                        placeholder={
                          tipoSubstituicaoSelecionado === "Veículo"
                            ? "Ex: Basculante - XYZ-1234"
                            : tipoSubstituicaoSelecionado === "Motorista"
                              ? "Ex: João Silva"
                              : "Ex: Equipe A (3 coletores)"
                        }
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={
                          tipoSubstituicaoSelecionado === "Veículo"
                            ? "Veículo Substituto"
                            : tipoSubstituicaoSelecionado === "Motorista"
                              ? "Motorista Substituto"
                              : "Coletores Substitutos"
                        }
                        name="itemSubstituto"
                        value={formData.itemSubstituto}
                        onChange={handleInputChange}
                        error={!!formErrors.itemSubstituto}
                        helperText={formErrors.itemSubstituto}
                        placeholder={
                          tipoSubstituicaoSelecionado === "Veículo"
                            ? "Ex: Basculante - ABC-5678"
                            : tipoSubstituicaoSelecionado === "Motorista"
                              ? "Ex: Carlos Pereira"
                              : "Ex: Equipe B (3 coletores)"
                        }
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Seção de Observações */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: `1px solid ${themeColors.divider}`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: themeColors.text.primary,
                      fontSize: "1rem",
                    }}
                  >
                    Observações adicionais:
                  </Typography>

                  <TextField
                    fullWidth
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Informações adicionais sobre a substituição..."
                    size="small"
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={handleFormClose}
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
            onClick={handleFormSubmit}
            color="secondary"
            variant="contained"
            startIcon={<Save />}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: `0 4px 12px ${alpha(themeColors.secondary.main, 0.2)}`,
            }}
          >
            {selectedRowId ? "Atualizar" : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Visualização */}
      <VisualizacaoModal open={visualizacaoOpen} onClose={() => setVisualizacaoOpen(false)} item={itemSelecionado} />

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
