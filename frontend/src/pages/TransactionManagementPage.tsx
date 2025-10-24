import { useState } from 'react'
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputAdornment } from '@mui/material'
import { Search, Edit, Delete } from '@mui/icons-material'
import DashboardLayout from '../components/DashboardLayout'

const TransactionManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const transactions = [
    { date: '4/10/2025', description: 'Ăn tối', amount: '-215.000 vnd', category: 'Ăn uống' },
    { date: '1/10/2025', description: 'Tiền điện', amount: '-516.000 vnd', category: 'Sinh hoạt' },
    { date: '28/9/2025', description: 'Đi chợ', amount: '-67.000 vnd', category: 'Sinh hoạt' },
    { date: '22/9/2025', description: 'Quà sinh nhật', amount: '+1.000.000 vnd', category: 'Thu nhập' },
    { date: '19/9/2025', description: 'Xem phim', amount: '-124.000 vnd', category: 'Sinh hoạt' },
    { date: '19/9/2025', description: 'Mua quần áo', amount: '-223.000 vnd', category: 'Sinh hoạt' },
    { date: '19/9/2025', description: 'Ăn tối', amount: '-150.000 vnd', category: 'Ăn uống' },
  ]

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2E5B47' }}>
          Quản lý giao dịch:
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
            + Thêm giao dịch
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
                <TableCell sx={{ color: '#fff', fontWeight: 600, borderRight: '2px dashed rgba(255,255,255,0.3)' }}>Thời gian</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, borderRight: '2px dashed rgba(255,255,255,0.3)' }}>Nội dung</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, borderRight: '2px dashed rgba(255,255,255,0.3)' }}>Số tiền</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, borderRight: '2px dashed rgba(255,255,255,0.3)' }}>Danh mục</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    borderBottom: '2px dashed rgba(107, 142, 127, 0.2)'
                  }}
                >
                  <TableCell sx={{ borderRight: '2px dashed rgba(107, 142, 127, 0.2)' }}>{transaction.date}</TableCell>
                  <TableCell sx={{ borderRight: '2px dashed rgba(107, 142, 127, 0.2)' }}>{transaction.description}</TableCell>
                  <TableCell sx={{ 
                    borderRight: '2px dashed rgba(107, 142, 127, 0.2)',
                    color: transaction.amount.startsWith('+') ? '#4CAF50' : '#f44336',
                    fontWeight: 600
                  }}>
                    {transaction.amount}
                  </TableCell>
                  <TableCell sx={{ borderRight: '2px dashed rgba(107, 142, 127, 0.2)' }}>{transaction.category}</TableCell>
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

export default TransactionManagementPage

