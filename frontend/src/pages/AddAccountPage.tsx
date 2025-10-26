import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Button, Card, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import DashboardLayout from '../components/DashboardLayout'
import api from '../api'

const AddAccountPage = () => {
  const navigate = useNavigate()
  const [selectedBank, setSelectedBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [initialBalance, setInitialBalance] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newWallet = {
      walletName: selectedBank,
      type: 'Bank',
      balance: Number(initialBalance),
      bankLinked: selectedBank,
      accountNumber,
      accountName,
      userId: 1,
    }
    try {
      await api.post('/wallets', newWallet)
      navigate('/accounts')
    } catch (err) {
      console.error('❌ Lỗi khi tạo tài khoản:', err)
    }
  }

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/accounts')} sx={{ color: '#6B8E7F' }}>
            Quay lại
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#2E5B47' }}>
            Liên kết tài khoản mới
          </Typography>
        </Box>

        <Card sx={{ maxWidth: 600, mx: 'auto', p: 4, borderRadius: '20px', backgroundColor: 'white' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Chọn ngân hàng</InputLabel>
                  <Select value={selectedBank} label="Chọn ngân hàng" onChange={(e) => setSelectedBank(e.target.value)}>
                    <MenuItem value="VPBank">VPBank</MenuItem>
                    <MenuItem value="MB Bank">MB Bank</MenuItem>
                    <MenuItem value="VietinBank">VietinBank</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Số tài khoản" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Tên tài khoản" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Số dư ban đầu" type="number" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} required />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                  <Button variant="outlined" onClick={() => navigate('/accounts')}>Hủy</Button>
                  <Button variant="contained" type="submit" sx={{ backgroundColor: '#6B8E7F' }}>Liên kết</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Box>
    </DashboardLayout>
  )
}

export default AddAccountPage
