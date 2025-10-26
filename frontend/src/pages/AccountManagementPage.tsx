import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Card, IconButton, Button, Grid } from '@mui/material'
import { Visibility, VisibilityOff, Delete } from '@mui/icons-material'
import DashboardLayout from '../components/DashboardLayout'
import api from '../api'

interface Wallet {
  id: number
  walletName: string
  type: string
  balance: number
  bankLinked?: string
  accountNumber?: string
  accountName?: string
}

const AccountManagementPage = () => {
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(true)
  const [accounts, setAccounts] = useState<Wallet[]>([])

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/wallets')
      const data = res.data.filter((w: Wallet) => w.type === 'Bank')
      setAccounts(data)
    } catch (err) {
      console.error('❌ Lỗi tải tài khoản:', err)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này không?')) {
      await api.delete(`/wallets/${id}`)
      setAccounts((prev) => prev.filter((a) => a.id !== id))
    }
  }

  const totalBalance = accounts
    .reduce((sum, acc) => sum + (acc.balance || 0), 0)
    .toLocaleString()

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#2E5B47' }}>
            Tổng tài sản:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#2E5B47' }}>
              {showBalance ? `${totalBalance} VND` : '********'}
            </Typography>
            <IconButton onClick={() => setShowBalance(!showBalance)} sx={{ color: '#2E5B47' }}>
              {showBalance ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2E5B47' }}>
          Quản lý tài khoản:
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {accounts.map((account) => (
            <Grid item xs={12} md={6} key={account.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  border: '2px solid #6B8E7F',
                  backgroundColor: 'white',
                  '&:hover': { boxShadow: '0 8px 24px rgba(107, 142, 127, 0.2)' },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E5B47' }}>
                  {account.bankLinked || account.walletName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B8E7F' }}>
                  Số TK: {account.accountNumber || '-'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B8E7F' }}>
                  Chủ TK: {account.accountName || '-'}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2E5B47', mt: 1 }}>
                  {showBalance ? `${account.balance.toLocaleString()} VND` : '********'}
                </Typography>
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                  <IconButton sx={{ color: '#f44336' }} onClick={() => handleDelete(account.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/accounts/add')}
            sx={{
              backgroundColor: '#6B8E7F',
              color: 'white',
              borderRadius: '50px',
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(107, 142, 127, 0.3)',
              '&:hover': { backgroundColor: '#5A7A6D' },
            }}
          >
            + Liên kết tài khoản
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export default AccountManagementPage
