import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Card, IconButton, Button, Grid } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import DashboardLayout from '../components/DashboardLayout'
import vpbankLogo from '../assets/vpbank.png'
import mbbankLogo from '../assets/mbbank.png'
import viettinbankLogo from '../assets/viettinbank.png'

interface BankAccount {
  id: number
  bankName: string
  logo: string
  balance: string
}

const AccountManagementPage = () => {
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(true)

  const accounts: BankAccount[] = [
    { id: 1, bankName: 'VPBank', logo: vpbankLogo, balance: '100.000.000.000' },
    { id: 2, bankName: 'MB bank', logo: mbbankLogo, balance: '100.000.000.000' },
    { id: 3, bankName: 'VietinBank', logo: viettinbankLogo, balance: '100.000.000.000' },
  ]

  const totalBalance = '300.000.000.000'

  return (
    <DashboardLayout>
      <Box>
        {/* Tổng tài sản */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#2E5B47' }}>
            Tổng tài sản:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#2E5B47',
                letterSpacing: '1px'
              }}
            >
              {showBalance ? totalBalance : '******************'}
            </Typography>
            <IconButton 
              onClick={() => setShowBalance(!showBalance)}
              sx={{ color: '#2E5B47' }}
            >
              {showBalance ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Box>
        </Box>

        {/* Quản lý tài khoản */}
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
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(107, 142, 127, 0.2)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    component="img"
                    src={account.logo}
                    alt={account.bankName}
                    sx={{
                      height: 40,
                      objectFit: 'contain',
                    }}
                  />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#2E5B47',
                    letterSpacing: '1px'
                  }}
                >
                  {account.balance}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Nút Liên kết tài khoản */}
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
              '&:hover': {
                backgroundColor: '#5A7A6D',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(107, 142, 127, 0.4)',
              },
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

