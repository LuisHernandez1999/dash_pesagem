"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress,
  LinearProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Collapse,
  Tooltip,
  Backdrop,
  useMediaQuery,
  Grow,
  Slide,
  Zoom,
  Alert,
} from "@mui/material"
import {
  Visibility,
  VisibilityOff,
  Lock,
  CheckCircle,
  Badge,
  Security,
  ArrowBack,
  VpnKey,
  CheckCircleOutline,
  Info,
  LockReset,
  Fingerprint,
  Shield,
  VerifiedUser,
  Refresh,
  Login,
  ErrorOutline,
  PersonSearch,
} from "@mui/icons-material"
import { ThemeProvider, createTheme, alpha, keyframes } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import * as yup from "yup"

// Animações CSS personalizadas
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-30px,0); }
  70% { transform: translate3d(0,-15px,0); }
  90% { transform: translate3d(0,-4px,0); }
`

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`

// Tema personalizado com detalhes premium
const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32",
      light: "#4CAF50",
      dark: "#1B5E20",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#66BB6A",
      light: "#81C784",
      dark: "#388E3C",
    },
    success: {
      main: "#4CAF50",
      light: "#A5D6A7",
      dark: "#2E7D32",
    },
    background: {
      default: "#E8F5E9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#263238",
      secondary: "#546E7A",
    },
    error: {
      main: "#F44336",
    },
    warning: {
      main: "#FFA000",
    },
    info: {
      main: "#29B6F6",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: "-0.5px",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.25px",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#4CAF50",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#2E7D32",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 20px 80px rgba(0, 0, 0, 0.1), 0 10px 30px rgba(46, 125, 50, 0.2)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          overflow: "visible",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 25px 90px rgba(0, 0, 0, 0.15), 0 15px 40px rgba(46, 125, 50, 0.3)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: "none",
          fontSize: "1.1rem",
          fontWeight: 600,
          padding: "14px 28px",
          boxShadow: "0 4px 20px rgba(46, 125, 50, 0.3)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 8px 30px rgba(46, 125, 50, 0.4)",
            "&::before": {
              opacity: 1,
            },
          },
          "&:active": {
            transform: "translateY(-1px)",
            animation: `${pulse} 0.3s ease`,
          },
        },
        contained: {
          background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
          "&:hover": {
            background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
            animation: `${shimmer} 2s infinite`,
            backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            backgroundSize: "200px 100%",
            backgroundRepeat: "no-repeat",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            },
            "&.Mui-focused": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 20px rgba(46, 125, 50, 0.15)",
              animation: `${pulse} 0.5s ease`,
            },
            "&.Mui-error": {
              animation: `${shake} 0.5s ease`,
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 500,
          },
          "& .MuiInputAdornment-root": {
            "& .MuiSvgIcon-root": {
              transition: "transform 0.3s ease",
            },
          },
          "&:hover .MuiInputAdornment-root .MuiSvgIcon-root": {
            transform: "scale(1.1)",
            animation: `${float} 2s ease-in-out infinite`,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          "& .MuiAlert-icon": {
            fontSize: "1.5rem",
          },
        },
        standardError: {
          backgroundColor: alpha("#F44336", 0.1),
          border: `1px solid ${alpha("#F44336", 0.3)}`,
          "& .MuiAlert-icon": {
            color: "#F44336",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 6px 25px rgba(0, 0, 0, 0.1)",
          },
        },
        elevation1: {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            animation: `${pulse} 0.5s ease`,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: alpha("#4CAF50", 0.1),
          overflow: "hidden",
          "& .MuiLinearProgress-bar": {
            borderRadius: 8,
            background: "linear-gradient(90deg, #2E7D32, #4CAF50, #66BB6A)",
            backgroundSize: "200% 100%",
            animation: `${shimmer} 2s ease-in-out infinite`,
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontWeight: 500,
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
          "&.Mui-completed": {
            color: "#4CAF50",
            animation: `${bounce} 1s ease`,
          },
          "&.Mui-active": {
            color: "#2E7D32",
            animation: `${pulse} 2s ease-in-out infinite`,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha("#263238", 0.9),
          backdropFilter: "blur(8px)",
          borderRadius: 8,
          padding: "8px 12px",
          fontWeight: 500,
          fontSize: "0.8rem",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        },
        arrow: {
          color: alpha("#263238", 0.9),
        },
      },
    },
  },
})

// Esquemas de validação Yup
const matriculaSchema = yup.object({
  matricula: yup
    .string()
    .required("Matrícula é obrigatória")
    .min(4, "Matrícula deve ter pelo menos 4 caracteres")
    .max(20, "Matrícula deve ter no máximo 20 caracteres")
    .matches(/^[a-zA-Z0-9]+$/, "Matrícula deve conter apenas letras e números"),
})

const passwordSchema = yup.object({
  password: yup
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .matches(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .matches(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/, "Deve conter pelo menos um número")
    .matches(/[^a-zA-Z0-9]/, "Deve conter pelo menos um caractere especial")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas devem ser iguais")
    .required("Confirmação de senha é obrigatória"),
})

// Simulação de banco de dados de matrículas válidas
const validMatriculas = [
  "LG2024001",
  "LG2024002",
  "LG2024003",
  "LG2023001",
  "LG2023002",
  "ADMIN001",
  "FUNC001",
  "FUNC002",
  "MED001",
  "MED002",
  "ENF001",
  "ENF002",
  "TEC001",
  "TEC002",
  "12345",
  "TESTE123",
]

// Componente de animação personalizado
const AnimatedBox = ({ children, delay = 0, direction = "up", ...props }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  if (direction === "up") {
    return (
      <Slide direction="up" in={show} timeout={800} {...props}>
        <Box>{children}</Box>
      </Slide>
    )
  }

  return (
    <Fade in={show} timeout={800} {...props}>
      <Box>{children}</Box>
    </Fade>
  )
}

export default function ResetPasswordPage() {
  const [step, setStep] = useState(0) // 0: matricula, 1: new password, 2: success
  const [matricula, setMatricula] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [showTooltips, setShowTooltips] = useState(false)
  const [matriculaNotFound, setMatriculaNotFound] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const steps = ["Verificação", "Nova Senha", "Concluído"]

  // Mostrar tooltips após um tempo
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltips(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Calcular força da senha
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0

    let strength = 0
    // Comprimento
    if (pwd.length >= 8) strength += 20
    if (pwd.length >= 12) strength += 5

    // Complexidade
    if (/[a-z]/.test(pwd)) strength += 15
    if (/[A-Z]/.test(pwd)) strength += 15
    if (/[0-9]/.test(pwd)) strength += 15
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 15

    // Variedade
    const variety = new Set(pwd).size
    strength += Math.min((variety / pwd.length) * 15, 15)

    return Math.min(strength, 100)
  }

  // Verificar se matrícula existe
  const checkMatricula = (mat) => {
    return validMatriculas.includes(mat.toUpperCase())
  }

  const handleMatriculaSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setMatriculaNotFound(false)

    try {
      await matriculaSchema.validate({ matricula }, { abortEarly: false })

      setLoading(true)
      setShowBackdrop(true)

      // Simular verificação de matrícula no servidor
      setTimeout(() => {
        const matriculaExists = checkMatricula(matricula)

        setLoading(false)
        setShowBackdrop(false)

        if (matriculaExists) {
          setTimeout(() => setStep(1), 100)
        } else {
          setMatriculaNotFound(true)
          setErrors({ matricula: "Matrícula não encontrada no sistema" })
        }
      }, 2000)
    } catch (err) {
      const validationErrors = {}
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message
      })
      setErrors(validationErrors)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setErrors({})

    try {
      await passwordSchema.validate({ password, confirmPassword }, { abortEarly: false })
      setLoading(true)
      setShowBackdrop(true)

      // Simular redefinição de senha
      setTimeout(() => {
        setLoading(false)
        setShowBackdrop(false)
        setTimeout(() => setStep(2), 100)
      }, 2000)
    } catch (err) {
      const validationErrors = {}
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message
      })
      setErrors(validationErrors)
    }
  }

  const handlePasswordChange = (value) => {
    setPassword(value)
    setPasswordStrength(calculatePasswordStrength(value))
  }

  const resetForm = () => {
    setStep(0)
    setMatricula("")
    setPassword("")
    setConfirmPassword("")
    setErrors({})
    setPasswordStrength(0)
    setMatriculaNotFound(false)
  }

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "error"
    if (passwordStrength < 70) return "warning"
    return "success"
  }

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Fraca"
    if (passwordStrength < 70) return "Média"
    if (passwordStrength < 90) return "Forte"
    return "Excelente"
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Backdrop para loading */}
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
        }}
        open={showBackdrop}
      >
        <Box sx={{ textAlign: "center", color: "white" }}>
          <CircularProgress color="primary" size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
            {step === 0 ? "Verificando matrícula..." : "Atualizando senha..."}
          </Typography>
        </Box>
      </Backdrop>

      {/* Container principal */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 25%, #4CAF50 50%, #66BB6A 75%, #81C784 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 2, sm: 4 },
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)
            `,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\') repeat',
          },
        }}
      >
        {/* Efeito de partículas */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 0,
            opacity: 0.6,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(2px)",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `${float} ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </Box>

        {/* Logo flutuante */}
        <Slide direction="right" in timeout={1000}>
          <Box
            sx={{
              position: "absolute",
              top: { xs: 20, sm: 40 },
              left: { xs: 20, sm: 40 },
              display: "flex",
              alignItems: "center",
              gap: 1,
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1B5E20, #4CAF50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(46, 125, 50, 0.4)",
                animation: `${float} 3s ease-in-out infinite`,
              }}
            >
              <Shield sx={{ fontSize: 24, color: "white" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 700,
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                display: { xs: "none", sm: "block" },
              }}
            >
              LimpaGyn
            </Typography>
          </Box>
        </Slide>

        <Container maxWidth="sm">
          <Zoom in timeout={1000}>
            <Card
              sx={{
                position: "relative",
                zIndex: 1,
                backdropFilter: "blur(20px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                overflow: "visible",
              }}
            >
              {loading && (
                <LinearProgress
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    borderRadius: "24px 24px 0 0",
                    height: 6,
                  }}
                />
              )}

              {/* Decoração 3D */}
              <Box
                sx={{
                  position: "absolute",
                  top: -15,
                  right: -15,
                  width: 80,
                  height: 80,
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, #4CAF50, #81C784)",
                  transform: "rotate(45deg)",
                  boxShadow: "0 8px 32px rgba(46, 125, 50, 0.3)",
                  zIndex: -1,
                  animation: `${spin} 20s linear infinite`,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -15,
                  left: -15,
                  width: 60,
                  height: 60,
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
                  transform: "rotate(45deg)",
                  boxShadow: "0 8px 32px rgba(46, 125, 50, 0.3)",
                  zIndex: -1,
                  animation: `${spin} 15s linear infinite reverse`,
                }}
              />

              <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                {/* Header com Logo */}
                <AnimatedBox delay={0.2}>
                  <Box textAlign="center" mb={4}>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1B5E20, #4CAF50, #66BB6A)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        boxShadow: "0 12px 40px rgba(46, 125, 50, 0.4)",
                        position: "relative",
                        animation: `${float} 4s ease-in-out infinite`,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          inset: 5,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #4CAF50, #66BB6A)",
                          zIndex: 0,
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          border: "2px dashed rgba(255,255,255,0.3)",
                          animation: `${spin} 30s linear infinite`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          zIndex: 1,
                          animation: step === 2 ? `${bounce} 1s ease` : "none",
                        }}
                      >
                        {step === 2 ? (
                          <CheckCircle sx={{ fontSize: 60, color: "white" }} />
                        ) : step === 1 ? (
                          <VpnKey sx={{ fontSize: 60, color: "white" }} />
                        ) : (
                          <PersonSearch sx={{ fontSize: 60, color: "white" }} />
                        )}
                      </Box>
                    </Box>

                    <Typography
                      variant="h3"
                      gutterBottom
                      sx={{
                        mb: 1,
                        background: "linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 2px 10px rgba(76, 175, 80, 0.3)",
                        fontWeight: 800,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      LimpaGyn
                    </Typography>

                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        fontWeight: 500,
                        textShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      Sistema de Redefinição de Senha
                    </Typography>

                    {/* Stepper */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 3,
                        mb: 4,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      }}
                    >
                      <Stepper activeStep={step} alternativeLabel>
                        {steps.map((label, index) => (
                          <Step key={label}>
                            <StepLabel
                              StepIconProps={{
                                sx: {
                                  "& .MuiStepIcon-text": {
                                    fill: index <= step ? "#fff" : undefined,
                                    fontWeight: 600,
                                  },
                                },
                              }}
                            >
                              {label}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Paper>
                  </Box>
                </AnimatedBox>

                {/* Conteúdo baseado no step */}
                {step === 2 ? (
                  // Tela de Sucesso
                  <AnimatedBox delay={0.3}>
                    <Box textAlign="center">
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: "50%",
                          background: alpha(theme.palette.success.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 24px",
                          position: "relative",
                          animation: `${bounce} 1s ease`,
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: 10,
                            borderRadius: "50%",
                            border: `4px solid ${theme.palette.success.main}`,
                            opacity: 0.5,
                          },
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: `2px dashed ${theme.palette.success.main}`,
                            opacity: 0.3,
                            animation: `${spin} 20s linear infinite`,
                          },
                        }}
                      >
                        <CheckCircleOutline
                          sx={{
                            fontSize: 80,
                            color: "success.main",
                            filter: "drop-shadow(0 4px 8px rgba(76, 175, 80, 0.5))",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                          mb: 2,
                          color: "success.main",
                          textShadow: "0 2px 10px rgba(76, 175, 80, 0.2)",
                        }}
                      >
                        🎉 Senha Redefinida com Sucesso!
                      </Typography>

                      <Typography
                        color="text.secondary"
                        paragraph
                        sx={{ mb: 4, fontSize: "1.1rem", maxWidth: "90%", mx: "auto" }}
                      >
                        Sua senha foi alterada com segurança. Agora você pode fazer login com sua nova senha para
                        acessar sua conta.
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "center",
                          flexWrap: "wrap",
                          mb: 3,
                        }}
                      >
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<Login />}
                          onClick={resetForm}
                          sx={{
                            background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
                            },
                          }}
                        >
                          Fazer Login
                        </Button>

                        <Button variant="outlined" size="large" startIcon={<Refresh />} onClick={resetForm}>
                          Nova Redefinição
                        </Button>
                      </Box>

                      {/* Dicas de segurança */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          backgroundColor: alpha(theme.palette.info.main, 0.05),
                          borderRadius: 3,
                          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Info color="info" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" color="info.main" fontWeight={600}>
                            Dicas de Segurança
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" align="left">
                          • Nunca compartilhe sua senha com ninguém
                          <br />• Evite usar a mesma senha em vários sites
                          <br />• Considere usar um gerenciador de senhas
                        </Typography>
                      </Paper>
                    </Box>
                  </AnimatedBox>
                ) : step === 1 ? (
                  // Tela de Nova Senha
                  <AnimatedBox delay={0.3}>
                    <form onSubmit={handlePasswordReset}>
                      <Box textAlign="center" mb={4}>
                        <Typography
                          variant="h4"
                          gutterBottom
                          sx={{
                            color: "primary.dark",
                            fontWeight: 700,
                          }}
                        >
                          🔐 Defina sua Nova Senha
                        </Typography>

                        <Typography color="text.secondary" sx={{ fontSize: "1.1rem", mb: 1 }}>
                          Crie uma senha forte e segura para sua conta
                        </Typography>

                        <Chip
                          label={`Redefinindo senha para matrícula ${matricula.toUpperCase()}`}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Nova Senha"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip
                                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                arrow
                                placement="top"
                                open={showTooltips && !showPassword}
                              >
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{
                                    transition: "all 0.3s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                  }}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Indicador de Força da Senha */}
                      {password && (
                        <Grow in timeout={500}>
                          <Box sx={{ mt: 1, mb: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Força da senha:
                              </Typography>
                              <Chip
                                label={getStrengthText()}
                                color={getStrengthColor()}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                              <Box sx={{ flex: 1 }} />
                              <Typography variant="body2" color={getStrengthColor() + ".main"} fontWeight={600}>
                                {passwordStrength}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={passwordStrength}
                              color={getStrengthColor()}
                              sx={{
                                height: 8,
                                borderRadius: 3,
                                background: alpha(theme.palette.primary.main, 0.1),
                              }}
                            />
                          </Box>
                        </Grow>
                      )}

                      <TextField
                        fullWidth
                        label="Confirmar Nova Senha"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                                sx={{
                                  transition: "all 0.3s ease",
                                  "&:hover": { transform: "scale(1.1)" },
                                }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                      />

                      {/* Requisitos da Senha */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          borderRadius: 3,
                          mb: 4,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                      >
                        <Typography variant="subtitle2" color="primary.dark" gutterBottom fontWeight={600}>
                          Requisitos de Segurança
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                          {[
                            {
                              test: password.length >= 8,
                              text: "8+ caracteres",
                              icon: <Fingerprint fontSize="small" />,
                            },
                            { test: /[a-z]/.test(password), text: "Minúscula", icon: <LockReset fontSize="small" /> },
                            { test: /[A-Z]/.test(password), text: "Maiúscula", icon: <LockReset fontSize="small" /> },
                            { test: /[0-9]/.test(password), text: "Número", icon: <Fingerprint fontSize="small" /> },
                            {
                              test: /[^a-zA-Z0-9]/.test(password),
                              text: "Especial",
                              icon: <Security fontSize="small" />,
                            },
                          ].map((req, index) => (
                            <Chip
                              key={index}
                              label={req.text}
                              size="small"
                              color={req.test ? "success" : "default"}
                              variant={req.test ? "filled" : "outlined"}
                              icon={req.test ? <CheckCircleOutline fontSize="small" /> : req.icon}
                              sx={{
                                fontWeight: 500,
                                transition: "all 0.3s ease",
                                transform: req.test ? "scale(1.05)" : "scale(1)",
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>

                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => setStep(0)}
                          startIcon={<ArrowBack />}
                          sx={{ flex: 1 }}
                        >
                          Voltar
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          sx={{
                            flex: 2,
                            background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
                            },
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <>
                              <LockReset sx={{ mr: 1 }} /> Redefinir Senha
                            </>
                          )}
                        </Button>
                      </Box>
                    </form>
                  </AnimatedBox>
                ) : (
                  // Tela de Matrícula
                  <AnimatedBox delay={0.3}>
                    <form onSubmit={handleMatriculaSubmit}>
                      <Box textAlign="center" mb={4}>
                        <Typography
                          variant="h4"
                          gutterBottom
                          sx={{
                            color: "primary.dark",
                            fontWeight: 700,
                          }}
                        >
                          🆔 Verificação de Matrícula
                        </Typography>

                        <Typography color="text.secondary" sx={{ fontSize: "1.1rem", mb: 2 }}>
                          Digite sua matrícula para redefinir sua senha
                        </Typography>
                      </Box>

                      {/* Alert de matrícula não encontrada */}
                      {matriculaNotFound && (
                        <Fade in timeout={500}>
                          <Alert
                            severity="error"
                            sx={{
                              mb: 3,
                              animation: `${shake} 0.5s ease`,
                            }}
                            icon={<ErrorOutline />}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Matrícula não encontrada!
                            </Typography>
                            <Typography variant="body2">
                              Verifique se digitou corretamente ou entre em contato com o suporte.
                            </Typography>
                          </Alert>
                        </Fade>
                      )}

                      <TextField
                        fullWidth
                        label="Sua Matrícula"
                        type="text"
                        value={matricula}
                        onChange={(e) => {
                          setMatricula(e.target.value)
                          setMatriculaNotFound(false)
                          setErrors({})
                        }}
                        error={!!errors.matricula}
                        helperText={errors.matricula || "Digite sua matrícula de funcionário da LimpaGyn"}
                        margin="normal"
                        placeholder="Ex: LG2024001, ADMIN001, etc."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Badge color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 4 }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonSearch />}
                        sx={{
                          mb: 3,
                          background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
                          },
                        }}
                      >
                        {loading ? "Verificando..." : "Verificar Matrícula"}
                      </Button>

                      <Divider sx={{ my: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          ou
                        </Typography>
                      </Divider>

                      <Button fullWidth variant="text" sx={{ color: "primary.main" }}>
                        Lembrei minha senha
                      </Button>

                      {/* Informações sobre matrículas */}
                      <Collapse in={true}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            mt: 3,
                            backgroundColor: alpha(theme.palette.info.main, 0.05),
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Info color="info" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" color="info.main" fontWeight={600}>
                              Sobre sua Matrícula
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Sua matrícula é fornecida pelo RH da LimpaGyn no momento da contratação. Se não souber sua
                            matrícula, entre em contato com o departamento de recursos humanos.
                          </Typography>

                          {/* Exemplos de matrículas válidas para teste */}
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Matrículas de teste disponíveis:
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                              {validMatriculas.slice(0, 6).map((mat) => (
                                <Chip
                                  key={mat}
                                  label={mat}
                                  size="small"
                                  variant="outlined"
                                  onClick={() => setMatricula(mat)}
                                  sx={{
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Paper>
                      </Collapse>
                    </form>
                  </AnimatedBox>
                )}

                {/* Rodapé */}
                <Fade in timeout={2000}>
                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      © {new Date().getFullYear()} LimpaGyn • Todos os direitos reservados
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                      Protegido por criptografia avançada
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                      <VerifiedUser sx={{ fontSize: 16, color: "primary.main", mr: 0.5 }} />
                      <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                        Segurança Verificada
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              </CardContent>
            </Card>
          </Zoom>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
