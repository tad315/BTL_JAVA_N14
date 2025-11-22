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
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import CustomInput from '../components/CustomInput'
import CustomCard from '../components/CustomCard'
import backgroundImage from '../assets/nen.png'
import vissmartLogo from '../assets/Vissmart.png'
import api from '../api' // <-- THÊM MỚI: Import file axios config

const LoginPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  // THÊM MỚI: State để xử lý lỗi
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // ===================================
  // BẮT ĐẦU PHẦN CẬP NHẬT
  // ===================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Xóa lỗi cũ khi submit

    try {
      const { email, password } = formData

      // 1. Gọi API đăng nhập
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      // 2. Đăng nhập thành công, response.data chứa { token: "..." }
      console.log('Đăng nhập thành công:', response.data)

      // 3. Lưu token vào localStorage
      localStorage.setItem('token', response.data.token)
      // (Tùy chọn) Bạn cũng có thể lưu thông tin người dùng
      // localStorage.setItem('user', JSON.stringify({ fullName: response.data.fullName }))

      // 4. Điều hướng đến trang dashboard
      navigate('/dashboard')

    } catch (err: any) {
      // 5. Xử lý lỗi
      console.error('Lỗi khi đăng nhập:', err)
      if (err.message === 'Network Error') {
         setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
      } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        // Lỗi 401/403 thường là sai email hoặc mật khẩu (do Spring Security)
         setError('Sai email hoặc mật khẩu. Vui lòng thử lại.')
      } else {
         setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
      }
    }
  }
  // ===================================
  // KẾT THÚC PHẦN CẬP NHẬT
  // ===================================

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
          {/* ... Logo và Tiêu đề ... */}
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
            Đăng nhập
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Chào mừng bạn quay trở lại!
          </Typography>
        </Box>

        <CustomCard elevation={2}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* ... Input Email và Password ... */}
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


              <Box sx={{ textAlign: 'right' }}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Quên mật khẩu?
                </Link>
              </Box>

              {/* THÊM MỚI: Hiển thị lỗi */}
              {error && (
                <Typography color="error" variant="body2" textAlign="center">
                  {error}
                </Typography>
              )}

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
                Đăng nhập
              </Button>

              {/* Social Login Section (Giữ nguyên) */}
              <Box sx={{ textAlign: 'center', my: 3 }}>
                {/* ... code social ... */}
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có tài khoản?{' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Đăng ký ngay
                  </Link>
                </Typography>
              </Box>
            </Box>
          </form>
        </CustomCard>

        {/* ...Phần Quay lại trang chủ... */}
      </Container>
    </Box>
  )
}

export default LoginPage