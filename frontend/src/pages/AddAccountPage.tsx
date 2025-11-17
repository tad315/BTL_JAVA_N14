import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, Card, Grid,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import DashboardLayout from '../components/DashboardLayout'
import api from '../api'

const AddAccountPage = () => {
  const navigate = useNavigate()

  const [walletType, setWalletType] = useState('Bank')
  const [selectedBank, setSelectedBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [initialBalance, setInitialBalance] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let newWallet: any = {
      type: walletType,
      balance: Number(initialBalance),
      userId: 1,
    }

    if (walletType === "Bank") {
      newWallet.walletName = selectedBank
      newWallet.bankLinked = selectedBank
      newWallet.accountNumber = accountNumber
      newWallet.accountName = accountName
    }

    if (walletType === "Cash") {
      newWallet.walletName = accountName
      newWallet.bankLinked = null
      newWallet.accountNumber = null
      newWallet.accountName = accountName
    }

    if (walletType === "E-Wallet") {
      newWallet.walletName = accountName
      newWallet.bankLinked = "E-Wallet"
      newWallet.accountNumber = null
      newWallet.accountName = accountName
    }

    try {
      await api.post('/wallets', newWallet)
      navigate('/accounts')
    } catch (err) {
      console.error('❌ Lỗi khi tạo ví:', err)
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
            Thêm ví mới
          </Typography>
        </Box>

        <Card sx={{ maxWidth: 600, mx: 'auto', p: 4, borderRadius: '20px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              {/* Chọn loại ví */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Loại ví</InputLabel>
                  <Select value={walletType} label="Loại ví" onChange={(e) => setWalletType(e.target.value)}>
                    <MenuItem value="Bank">Liên kết ngân hàng</MenuItem>
                    <MenuItem value="Cash">Ví tiền mặt</MenuItem>
                    <MenuItem value="E-Wallet">Ví điện tử</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Nếu là ngân hàng */}
              {walletType === "Bank" && (
                <>
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
                    <TextField fullWidth label="Tên chủ tài khoản" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
                  </Grid>
                </>
              )}

              {/* Ví tiền mặt & ví điện tử */}
              {walletType !== "Bank" && (
                <Grid item xs={12}>
                  <TextField fullWidth label="Tên ví" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
                </Grid>
              )}

              {/* Số dư */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số dư ban đầu"
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/accounts')} sx={{ mr: 2 }}>Hủy</Button>
                <Button variant="contained" type="submit" sx={{ backgroundColor: '#6B8E7F' }}>Thêm ví</Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Box>
    </DashboardLayout>
  )
}

export default AddAccountPage
