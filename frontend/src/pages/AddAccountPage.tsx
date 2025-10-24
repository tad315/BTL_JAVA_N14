import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import DashboardLayout from '../components/DashboardLayout'
import vpbankLogo from '../assets/vpbank.png'
import mbbankLogo from '../assets/mbbank.png'
import viettinbankLogo from '../assets/viettinbank.png'

interface Bank {
  id: number
  name: string
  logo: string
}

const AddAccountPage = () => {
  const navigate = useNavigate()
  const [selectedBank, setSelectedBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [initialBalance, setInitialBalance] = useState('')

  const banks: Bank[] = [
    { id: 1, name: 'VPBank', logo: vpbankLogo },
    { id: 2, name: 'MB Bank', logo: mbbankLogo },
    { id: 3, name: 'VietinBank', logo: viettinbankLogo },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Xử lý thêm tài khoản
    console.log({ selectedBank, accountNumber, accountName, initialBalance })
    navigate('/accounts')
  }

  return (
    <DashboardLayout>
      <Box>
        {/* Header với nút quay lại */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/accounts')}
            sx={{
              color: '#6B8E7F',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'rgba(107, 142, 127, 0.1)',
              },
            }}
          >
            Quay lại
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#2E5B47' }}>
            Liên kết tài khoản mới
          </Typography>
        </Box>

        {/* Form */}
        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            p: 4,
            borderRadius: '20px',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Chọn ngân hàng */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Chọn ngân hàng</InputLabel>
                  <Select
                    value={selectedBank}
                    label="Chọn ngân hàng"
                    onChange={(e) => setSelectedBank(e.target.value)}
                    required
                    sx={{
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6B8E7F',
                      },
                    }}
                  >
                    {banks.map((bank) => (
                      <MenuItem key={bank.id} value={bank.name}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            component="img"
                            src={bank.logo}
                            alt={bank.name}
                            sx={{ height: 30, objectFit: 'contain' }}
                          />
                          <Typography>{bank.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Số tài khoản */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số tài khoản"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  placeholder="Nhập số tài khoản"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#6B8E7F',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Tên tài khoản */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên tài khoản"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                  placeholder="Nhập tên chủ tài khoản"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#6B8E7F',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Số dư ban đầu */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số dư ban đầu"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  required
                  type="number"
                  placeholder="Nhập số dư ban đầu"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#6B8E7F',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/accounts')}
                    sx={{
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5,
                      borderColor: '#6B8E7F',
                      color: '#6B8E7F',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#5A7A6D',
                        backgroundColor: 'rgba(107, 142, 127, 0.05)',
                      },
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5,
                      backgroundColor: '#6B8E7F',
                      color: 'white',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(107, 142, 127, 0.3)',
                      '&:hover': {
                        backgroundColor: '#5A7A6D',
                        boxShadow: '0 6px 16px rgba(107, 142, 127, 0.4)',
                      },
                    }}
                  >
                    Liên kết tài khoản
                  </Button>
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


