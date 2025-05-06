"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  alpha,
} from "@mui/material"
import { ArrowUpward, ArrowDownward } from "@mui/icons-material"

// Sort indicator component
const SortIndicator = ({ field, sortField, sortDirection }) => {
  if (sortField !== field) return null
  return sortDirection === "asc" ? (
    <ArrowUpward sx={{ fontSize: 16, ml: 0.5 }} />
  ) : (
    <ArrowDownward sx={{ fontSize: 16, ml: 0.5 }} />
  )
}

const DataTable = ({
  data,
  page,
  rowsPerPage,
  sortField,
  sortDirection,
  themeColors,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  onRowClick,
  onActionClick,
  loading = false,
  columns = [],
}) => {
  // Get paginated data
  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Handle sorting
  const handleSort = (field) => {
    onSort(field)
  }

  return (
    <>
      <TableContainer
        sx={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          border: `1px solid ${alpha(themeColors.divider, 0.8)}`,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: alpha(themeColors.secondary.light, 0.05) }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  onClick={() => (column.sortable ? handleSort(column.field) : null)}
                  sx={{
                    cursor: column.sortable ? "pointer" : "default",
                    fontWeight: 600,
                    color: sortField === column.field ? themeColors.secondary.main : themeColors.text.secondary,
                    "&:hover": column.sortable ? { color: themeColors.secondary.main } : {},
                    borderBottom: `1px solid ${themeColors.divider}`,
                    py: 1.8,
                    px: 2.5,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.headerName}
                  {column.sortable && (
                    <SortIndicator field={column.field} sortField={sortField} sortDirection={sortDirection} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(themeColors.background.default, 0.7),
                    },
                    transition: "background-color 0.2s",
                    cursor: "pointer",
                    backgroundColor: index % 2 === 0 ? "transparent" : alpha(themeColors.background.default, 0.3),
                  }}
                  onClick={() => onRowClick(row)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${row.id}-${column.field}`}
                      sx={{ py: 1.8, px: 2.5, textAlign: column.align || "left" }}
                    >
                      {column.renderCell ? column.renderCell(row) : row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" sx={{ color: themeColors.text.secondary }}>
                    {loading ? "Carregando dados..." : "Nenhum registro encontrado"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{
          ".MuiTablePagination-actions": {
            "& .MuiIconButton-root": {
              color: themeColors.text.secondary,
              "&:hover": {
                backgroundColor: alpha(themeColors.secondary.main, 0.1),
                color: themeColors.secondary.main,
              },
            },
          },
        }}
      />
    </>
  )
}

export default DataTable
