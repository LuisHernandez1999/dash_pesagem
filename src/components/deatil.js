"use client"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, Box } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { Close, Share, Print, Edit } from "@mui/icons-material"

const DetailModal = ({ open, onClose, removal, onEdit, themeColors, keyframes }) => {
  const handleCloseModal = () => {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Detalhes da Remoção
          <IconButton onClick={handleCloseModal}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1">
          <strong>ID:</strong> {removal?.id}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Data de Solicitação:</strong> {removal?.requestDate}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Status:</strong> {removal?.status}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Tipo de Remoção:</strong> {removal?.removalType}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Descrição:</strong> {removal?.description}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Localização:</strong> {removal?.location}
        </Typography>
        {/* Remove the "Informações adicionais" section */}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<Edit />}
          onClick={(e) => {
            e.stopPropagation()
            onEdit(removal)
            handleCloseModal()
          }}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            borderColor: themeColors.warning.main,
            color: themeColors.warning.main,
            "&:hover": {
              backgroundColor: alpha(themeColors.warning.main, 0.05),
              boxShadow: `0 4px 12px ${alpha(themeColors.warning.main, 0.1)}`,
            },
          }}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          size="medium"
          startIcon={<Share />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            backgroundColor: themeColors.primary.main,
            "&:hover": {
              backgroundColor: themeColors.primary.dark,
            },
          }}
        >
          Compartilhar
        </Button>
        <Button
          variant="contained"
          size="medium"
          startIcon={<Print />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            backgroundColor: themeColors.success.main,
            "&:hover": {
              backgroundColor: themeColors.success.dark,
            },
          }}
        >
          Imprimir
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DetailModal
