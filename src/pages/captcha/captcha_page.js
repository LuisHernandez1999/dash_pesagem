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
  Paper,
  Divider,
  Tooltip,
  Backdrop,
  useMediaQuery,
  Slide,
  Zoom,
  Alert,
} from "@mui/material"
import {
  Security,
  Refresh,
  CheckCircle,
  Shield,
  VerifiedUser,
  ErrorOutline,
  Fingerprint,
  VpnKey,
  CheckCircleOutline,
  Info,
} from "@mui/icons-material"
import { ThemeProvider, createTheme, alpha, keyframes } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { getCaptcha } from "../../service/captcha"

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
        standardSuccess: {
          backgroundColor: alpha("#4CAF50", 0.1),
          border: `1px solid ${alpha("#4CAF50", 0.3)}`,
          "& .MuiAlert-icon": {
            color: "#4CAF50",
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

export default function CaptchaPage() {
  const [captchaData, setCaptchaData] = useState(null)
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [showTooltips, setShowTooltips] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Mostrar tooltips após um tempo
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltips(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const fetchCaptcha = async () => {
    setLoading(true)
    setError("")
    setShowBackdrop(true)

    try {
      const data = await getCaptcha()
      setCaptchaData(data)
    } catch (err) {
      console.error("Erro ao carregar captcha:", err)
      setError("Erro ao carregar captcha. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
      setShowBackdrop(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userInput.trim()) {
      setError("Por favor, digite o código do captcha.")
      return
    }

    setLoading(true)
    setShowBackdrop(true)

    // Simular verificação
    setTimeout(() => {
      if (userInput.toLowerCase() === captchaData?.captchaText?.toLowerCase()) {
        setSuccess(true)
        setError("")
        setAttempts(0)
      } else {
        setError("Código incorreto. Tente novamente.")
        setUserInput("")
        setAttempts((prev) => prev + 1)

        // Auto-refresh após 3 tentativas
        if (attempts >= 2) {
          setTimeout(() => {
            handleRefresh()
            setAttempts(0)
          }, 1000)
        }
      }
      setLoading(false)
      setShowBackdrop(false)
    }, 1500)
  }

  const handleRefresh = () => {
    setUserInput("")
    setError("")
    setSuccess(false)
    fetchCaptcha()
  }

  const resetForm = () => {
    setSuccess(false)
    setUserInput("")
    setError("")
    setAttempts(0)
    fetchCaptcha()
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

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
            {loading && !success ? "Processando..." : "Carregando captcha..."}
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
                          animation: success ? `${bounce} 1s ease` : "none",
                        }}
                      >
                        {success ? (
                          <CheckCircle sx={{ fontSize: 60, color: "white" }} />
                        ) : (
                          <Security sx={{ fontSize: 60, color: "white" }} />
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
                      {success ? "🎉 Verificação Concluída!" : "🔐 Verificação de Segurança"}
                    </Typography>
                  </Box>
                </AnimatedBox>

                {success ? (
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
                        Verificação Realizada com Sucesso!
                      </Typography>

                      <Typography
                        color="text.secondary"
                        paragraph
                        sx={{ mb: 4, fontSize: "1.1rem", maxWidth: "90%", mx: "auto" }}
                      >
                        Você passou na verificação de segurança. Agora pode prosseguir com segurança para acessar o
                        sistema.
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
                          startIcon={<VpnKey />}
                          sx={{
                            background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
                            },
                          }}
                        >
                          Continuar
                        </Button>

                        <Button variant="outlined" size="large" startIcon={<Refresh />} onClick={resetForm}>
                          Nova Verificação
                        </Button>
                      </Box>

                      {/* Informações de segurança */}
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
                          <VerifiedUser color="info" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" color="info.main" fontWeight={600}>
                            Segurança Verificada
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" align="left">
                          • Sua identidade foi verificada com sucesso
                          <br />• Conexão protegida por criptografia avançada
                          <br />• Sistema monitorado 24/7 para sua segurança
                        </Typography>
                      </Paper>
                    </Box>
                  </AnimatedBox>
                ) : (
                  // Tela de Captcha
                  <AnimatedBox delay={0.3}>
                    <form onSubmit={handleSubmit}>
                      <Box textAlign="center" mb={4}>
                        <Typography
                          variant="h4"
                          gutterBottom
                          sx={{
                            color: "primary.dark",
                            fontWeight: 700,
                          }}
                        >
                          Digite o Código de Verificação
                        </Typography>

                        <Typography color="text.secondary" sx={{ fontSize: "1.1rem", mb: 2 }}>
                          Para sua segurança, confirme que você não é um robô
                        </Typography>

                        {attempts > 0 && (
                          <Chip
                            label={`Tentativa ${attempts + 1} de 3`}
                            color={attempts >= 2 ? "error" : "warning"}
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        )}
                      </Box>

                      {/* Captcha Image */}
                      <Paper
                        elevation={0}
                        sx={{
                          mb: 3,
                          p: 3,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          borderRadius: 3,
                          border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          textAlign: "center",
                        }}
                      >
                        {loading && !captchaData ? (
                          <Box sx={{ py: 4 }}>
                            <CircularProgress sx={{ color: "#4caf50" }} />
                            <Typography variant="body2" sx={{ mt: 2, color: "#2e7d32" }}>
                              Gerando captcha...
                            </Typography>
                          </Box>
                        ) : captchaData ? (
                          <Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                p: 2,
                                borderRadius: 2,
                                background: "white",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                border: "1px solid #e0e0e0",
                                mb: 2,
                              }}
                            >
                              <img
                                src={captchaData.imageBase64 || "/placeholder.svg"}
                                alt="Captcha"
                                style={{
                                  maxWidth: "100%",
                                  height: "auto",
                                  display: "block",
                                }}
                              />
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                              <Tooltip title="Gerar novo código" arrow placement="top" open={showTooltips}>
                                <IconButton
                                  onClick={handleRefresh}
                                  disabled={loading}
                                  sx={{
                                    color: "#4caf50",
                                    "&:hover": {
                                      backgroundColor: "#e8f5e8",
                                      transform: "scale(1.1)",
                                    },
                                  }}
                                >
                                  <Refresh />
                                </IconButton>
                              </Tooltip>
                              <Typography variant="caption" sx={{ color: "#666" }}>
                                Clique para gerar novo código
                              </Typography>
                            </Box>
                          </Box>
                        ) : null}
                      </Paper>

                      {/* Error/Success Messages */}
                      {error && (
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
                              {error}
                            </Typography>
                            {attempts >= 2 && (
                              <Typography variant="body2">Gerando novo captcha automaticamente...</Typography>
                            )}
                          </Alert>
                        </Fade>
                      )}

                      {/* Input Field */}
                      <TextField
                        fullWidth
                        label="Digite o código"
                        variant="outlined"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                        disabled={loading || success}
                        placeholder="Ex: ABC123"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Fingerprint color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 4 }}
                      />

                      {/* Action Buttons */}
                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={handleRefresh}
                          disabled={loading}
                          startIcon={<Refresh />}
                          sx={{ flex: 1 }}
                        >
                          Novo Código
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading || !userInput.trim()}
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
                              <Security sx={{ mr: 1 }} /> Verificar
                            </>
                          )}
                        </Button>
                      </Box>

                      {/* Informações sobre captcha */}
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
                            Sobre a Verificação
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Este captcha protege nosso sistema contra acessos automatizados. Digite exatamente o código
                          mostrado na imagem, respeitando maiúsculas e minúsculas.
                        </Typography>
                      </Paper>
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
