"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material"
import { Search, MoreVert, DirectionsCar } from "@mui/icons-material"
import { getSolturasDetalhada } from "../service/dashboard"

const SolturasTable = () => {
  const [solturas, setSolturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getSolturasDetalhada()

        if (data.error) {
          setError(data.error)
        } else {
          setSolturas(data)
          console.log("Dados carregados com sucesso:", data)
        }
      } catch (err) {
        setError("Erro ao carregar dados: " + err.message)
        console.error("Erro ao carregar dados:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  // Filtrar dados com base no termo de pesquisa
  const filteredData = solturas.filter(
    (soltura) =>
      (soltura.motorista && soltura.motorista.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (soltura.prefixo && soltura.prefixo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (soltura.tipo_equipe && soltura.tipo_equipe.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Paginação dos dados filtrados
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Carregando dados...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
        <Typography>Erro: {error}</Typography>
      </Box>
    )
  }

  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por motorista, prefixo ou equipe..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            sx: { borderRadius: "12px" },
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="tabela de solturas">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Motorista</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Matrícula</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Prefixo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Equipe</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Data</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hora Saída</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((soltura, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    cursor: "pointer",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "primary.light",
                          fontSize: "0.875rem",
                        }}
                      >
                        {typeof soltura.motorista === "string" ? soltura.motorista.charAt(0).toUpperCase() : "?"}
                      </Avatar>
                      {typeof soltura.motorista === "string" ? soltura.motorista : "Não informado"}
                    </Box>
                  </TableCell>
                  <TableCell>{soltura.matricula_motorista || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      icon={<DirectionsCar />}
                      label={soltura.prefixo || "N/A"}
                      size="small"
                      sx={{
                        bgcolor: "primary.light",
                        color: "white",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>{soltura.tipo_equipe || "N/A"}</TableCell>
                  <TableCell>{soltura.data || "N/A"}</TableCell>
                  <TableCell>{soltura.hora_saida_frota || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={soltura.status_frota || "Não definido"}
                      size="small"
                      color={soltura.status_frota === "Em andamento" ? "primary" : "success"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography sx={{ py: 2 }}>
                    {searchTerm ? "Nenhum resultado encontrado" : "Nenhum dado disponível"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  )
}

export default SolturasTable