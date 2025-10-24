import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
} from '@mui/icons-material'
import CustomInput from '../components/CustomInput'
import CustomCard from '../components/CustomCard'
import backgroundImage from '../assets/nen.png'
import vissmartLogo from '../assets/Vissmart.png'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }

    // TODO: Implement registration logic
    console.log('Register:', formData)
    navigate('/login')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component="img"
            src={vissmartLogo}
            alt="Vissmart"
            sx={{
              height: 60,
              mb: 1,
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Đăng ký
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tạo tài khoản mới để bắt đầu
          </Typography>
        </Box>

        <CustomCard elevation={2}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <CustomInput
                name="fullName"
                label="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <CustomInput
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <CustomInput
                name="phone"
                label="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <CustomInput
                name="password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <CustomInput
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Đăng ký
              </Button>

              {/* Social Login Section */}
              <Box sx={{ textAlign: 'center', my: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Hoặc đăng ký bằng:
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {/* Facebook Register */}
                  <Button
                    variant="outlined"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      minWidth: 'unset',
                      border: '2px solid #1877F2',
                      backgroundColor: '#1877F2',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#166FE5',
                        border: '2px solid #166FE5',
                      },
                    }}
                    onClick={() => {
                      // TODO: Implement Facebook register
                      console.log('Facebook register')
                    }}
                  >
                    <Box
                      component="svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </Box>
                  </Button>

                  {/* Google Register */}
                  <Button
                    variant="outlined"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      minWidth: 'unset',
                      border: '2px solid #DB4437',
                      backgroundColor: '#DB4437',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#C23321',
                        border: '2px solid #C23321',
                      },
                    }}
                    onClick={() => {
                      // TODO: Implement Google register
                      console.log('Google register')
                    }}
                  >
                    <Box
                      component="svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </Box>
                  </Button>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Đã có tài khoản?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Đăng nhập ngay
                  </Link>
                </Typography>
              </Box>
            </Box>
          </form>
        </CustomCard>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link
            component={RouterLink}
            to="/"
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              fontSize: '0.9rem',
              '&:hover': { color: 'primary.main' },
            }}
          >
            ← Quay lại trang chủ
          </Link>
        </Box>
      </Container>
    </Box>
  )
}

export default RegisterPage


