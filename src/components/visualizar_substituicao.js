"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  IconButton,
  alpha,
} from "@mui/material"
import { Close, LocalShipping, Person, Group, CalendarToday, AccessTime, Route, Assignment } from "@mui/icons-material"

// Componente reutilizável para modal de visualização
const VisualizacaoModal = ({ open, onClose, item }) => {
  if (!item) return null

  // Determinar ícone e cor com base no tipo de substituição
  let icon = <LocalShipping />
  let color = "#3a86ff"

  if (item.tipoSubstituicao === "Motorista") {
    icon = <Person />
    color = "#00c896"
  } else if (item.tipoSubstituicao === "Coletores") {
    icon = <Group />
    color = "#ffbe0b"
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha(color, 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: alpha(color, 0.2),
              color: color,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
              Detalhes da Substituição
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.tipoSubstituicao} - {item.motivoSubstituicao}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                Informações Básicas
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarToday sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Data
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(item.data).toLocaleDateString("pt-BR")}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTime sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Hora
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.hora.substring(0, 5)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Assignment sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        PA
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.pa}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Route sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Rota
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.rota}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 1 }}>
                <Chip
                  label={item.tipoServico}
                  size="small"
                  sx={{
                    borderRadius: "8px",
                    bgcolor: alpha(
                      item.tipoServico === "Remoção"
                        ? "#3a86ff"
                        : item.tipoServico === "Varrição"
                          ? "#00c896"
                          : "#ffbe0b",
                      0.1,
                    ),
                    color:
                      item.tipoServico === "Remoção"
                        ? "#3a86ff"
                        : item.tipoServico === "Varrição"
                          ? "#00c896"
                          : "#ffbe0b",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                Detalhes da Substituição
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Motivo
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.motivoSubstituicao}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Item Original
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.itemOriginal}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Item Substituto
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.itemSubstituto}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                Observações
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  bgcolor: "rgba(226, 232, 240, 0.3)",
                  minHeight: "80px",
                }}
              >
                <Typography variant="body2">{item.observacoes || "Nenhuma observação registrada."}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default VisualizacaoModal
