import { useState } from 'react'
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputAdornment } from '@mui/material'
import { Search, Edit, Delete } from '@mui/icons-material'
import DashboardLayout from '../components/DashboardLayout'

const BudgetManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const budgets = [
    { category: 'Ăn uống', budget: '2.000.000 vnd', spent: '1.218.000 vnd', remaining: '782.000 vnd' },
    { category: 'Sinh hoạt', budget: '3.000.000 vnd', spent: '1.457.000 vnd', remaining: '1.543.000 vnd' },
    { category: 'Đi lại', budget: '1.000.000 vnd', spent: '243.000 vnd', remaining: '757.000 vnd' },
    { category: 'Giải trí', budget: '1.500.000 vnd', spent: '231.000 vnd', remaining: '1.000.000 vnd' },
    { category: 'Giáo dục', budget: '2.000.000 vnd', spent: '1.200.000 vnd', remaining: '800.000 vnd' },
    { category: 'Y tế', budget: '1.000.000 vnd', spent: '53.000 vnd', remaining: '947.000 vnd' },
  ]

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2E5B47' }}>
          Quản lý ngân sách:
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              minWidth: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                borderRadius: '25px',
                '& fieldset': {
                  borderColor: '#6B8E7F',
                },
                '&:hover fieldset': {
                  borderColor: '#2E5B47',
                },
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#6B8E7F' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#6B8E7F',
              color: '#fff',
              borderRadius: '25px',
              px: 4,
              py: 1,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#2E5B47',
              },
            }}
          >
            + Thêm danh mục
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#6B8E7F' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600, borderRight: '2px dashed rgba(255,255,255,0.3)' }}>Danh mục</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, borderRight: '2px dashed rgba(255,255,255,0.3)' }}>Ngân sách</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, borderRight: '2px dashed rgba(255,255,255,0.3)' }}>Tiêu thụ</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, borderRight: '2px dashed rgba(255,255,255,0.3)' }}>Còn lại</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map((budget, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    borderBottom: '2px dashed rgba(107, 142, 127, 0.2)'
                  }}
                >
                  <TableCell sx={{ borderRight: '2px dashed rgba(107, 142, 127, 0.2)' }}>{budget.category}</TableCell>
                  <TableCell sx={{ borderRight: '2px dashed rgba(107, 142, 127, 0.2)' }}>{budget.budget}</TableCell>
                  <TableCell sx={{ borderRight: '2px dashed rgba(107, 142, 127, 0.2)' }}>{budget.spent}</TableCell>
                  <TableCell sx={{ borderRight: '2px dashed rgba(107, 142, 127, 0.2)' }}>{budget.remaining}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: '#6B8E7F' }}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#f44336' }}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DashboardLayout>
  )
}

export default BudgetManagementPage

