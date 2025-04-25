import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Divider,
  alpha,
  Slide,
  Avatar,
} from "@mui/material"
import { Close, DirectionsCar, Person, Group, Warehouse, SupervisorAccount } from "@mui/icons-material"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const RegisterModal = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  themeColors,
  loading,
}) => {
  const keyframes = {
    pulse: `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
      }
    `,
  }

  return (
    <>
      <style>{keyframes.pulse}</style>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 600,
                width: 36,
                height: 36,
                mr: 1.5,
                animation: `pulse 2s infinite ease-in-out`,
              }}
            >
              <DirectionsCar />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Cadastrar Nova Soltura
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              padding: "0.5rem",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transform: "rotate(90deg)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: "1.5rem" }}>
          <Grid container spacing={3}>
            {/* Motorista */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Person sx={{ color: themeColors.primary.main, mr: 1 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>Dados do Motorista</Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Nome do Motorista"
                  variant="outlined"
                  value={formData.driver}
                  onChange={(e) => onChange("driver", e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Matrícula do Motorista"
                  variant="outlined"
                  value={formData.driverId}
                  onChange={(e) => onChange("driverId", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Equipe e Turno */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Group sx={{ color: themeColors.success.main, mr: 1 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>Equipe e Turno</Typography>
                </Box>
                <FormControl
                  fullWidth
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                >
                  <InputLabel>Equipe</InputLabel>
                  <Select value={formData.team} label="Equipe" onChange={(e) => onChange("team", e.target.value)}>
                    <MenuItem value="Equipe1(Matutino)">Equipe 1 (Matutino)</MenuItem>
                    <MenuItem value="Equipe2(Vespertino)">Equipe 2 (Vespertino)</MenuItem>
                    <MenuItem value="Equipe3(Noturno)">Equipe 3 (Noturno)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                >
                  <InputLabel>Turno</InputLabel>
                  <Select value={formData.shift} label="Turno" onChange={(e) => onChange("shift", e.target.value)}>
                    <MenuItem value="Manhã">Manhã</MenuItem>
                    <MenuItem value="Tarde">Tarde</MenuItem>
                    <MenuItem value="Noite">Noite</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Veículo */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <DirectionsCar sx={{ color: themeColors.warning.main, mr: 1 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>Dados do Veículo</Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Prefixo do Veículo"
                  variant="outlined"
                  value={formData.vehiclePrefix}
                  onChange={(e) => onChange("vehiclePrefix", e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                >
                  <InputLabel>Tipo de Veículo</InputLabel>
                  <Select
                    value={formData.vehicleType}
                    label="Tipo de Veículo"
                    onChange={(e) => onChange("vehicleType", e.target.value)}
                  >
                    <MenuItem value="BASCULANTE">BASCULANTE</MenuItem>
                    <MenuItem value="BAU">BAU</MenuItem>
                    <MenuItem value="SELETOLIX">SELETOLIX</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* PA e Rota */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Warehouse sx={{ color: themeColors.info.main, mr: 1 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>PA e Rota</Typography>
                </Box>
                <FormControl
                  fullWidth
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                >
                  <InputLabel>PA (Garagem)</InputLabel>
                  <Select
                    value={formData.garage}
                    label="PA (Garagem)"
                    onChange={(e) => onChange("garage", e.target.value)}
                  >
                    <MenuItem value="PA1">PA1</MenuItem>
                    <MenuItem value="PA2">PA2</MenuItem>
                    <MenuItem value="PA3">PA3</MenuItem>
                    <MenuItem value="PA4">PA4</MenuItem>
                    <MenuItem value="PA5">PA5</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Rota"
                  variant="outlined"
                  value={formData.route}
                  onChange={(e) => onChange("route", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Coletores */}
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Group sx={{ color: themeColors.error.main, mr: 1 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>Coletores (até 3)</Typography>
                </Box>
                <Grid container spacing={2}>
                  {formData.collectors.map((collector, index) => (
                    <Grid item xs={12} md={4} key={`collector-${index}`}>
                      <TextField
                        fullWidth
                        label={`Coletor ${index + 1}`}
                        variant="outlined"
                        value={collector}
                        onChange={(e) => onChange("collectors", e.target.value, index)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Líderes */}
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <SupervisorAccount sx={{ color: themeColors.secondary.main, mr: 1 }} />
                  <Typography sx={{ fontWeight: 600, color: themeColors.text.primary }}>Líderes (até 2)</Typography>
                </Box>
                {formData.leaders.map((leader, index) => (
                  <Grid container spacing={2} key={`leader-${index}`} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={`Nome do Líder ${index + 1}`}
                        variant="outlined"
                        value={leader}
                        onChange={(e) => onChange("leaders", e.target.value, index)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={`Telefone do Líder ${index + 1}`}
                        variant="outlined"
                        value={formData.leaderPhones[index]}
                        onChange={(e) => onChange("leaderPhones", e.target.value, index)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${themeColors.divider}`,
            justifyContent: "space-between",
            background: alpha(themeColors.background.default, 0.5),
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
            startIcon={<Close />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 500,
              borderColor: themeColors.divider,
              color: themeColors.text.secondary,
              "&:hover": {
                borderColor: themeColors.primary.main,
                color: themeColors.primary.main,
                backgroundColor: alpha(themeColors.primary.main, 0.05),
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={<DirectionsCar />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: themeColors.primary.main,
              boxShadow: `0 4px 12px ${alpha(themeColors.primary.main, 0.2)}`,
              "&:hover": {
                backgroundColor: themeColors.primary.dark,
                boxShadow: `0 6px 16px ${alpha(themeColors.primary.main, 0.3)}`,
              },
            }}
          >
            {loading ? "Cadastrando..." : "Cadastrar Soltura"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RegisterModal
