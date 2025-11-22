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
import api from '../api' // <-- THÊM MỚI: Import file axios config

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
  // Thêm state để xử lý lỗi từ backend
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

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!')
      return
    }

    try {
      // Tách dữ liệu cần gửi (không gửi confirmPassword)
      const { fullName, email, phone, password } = formData

      // Gọi API đăng ký
      const response = await api.post('/auth/register', {
        fullName,
        email,
        phone,
        password,
      })

      // response.data sẽ chứa { token: "...", fullName: "..." }
      console.log('Đăng ký thành công:', response.data)

      // Thông báo và chuyển hướng đến trang đăng nhập
      alert('Đăng ký thành công! Vui lòng đăng nhập.')
      navigate('/login')

    } catch (err: any) {
      // Xử lý lỗi từ backend
      console.error('Lỗi khi đăng ký:', err)
      if (err.response && err.response.data && err.response.data.message) {
        // Nếu backend trả về lỗi cụ thể (ví dụ: Email đã tồn tại)
        setError(err.response.data.message)
      } else if (err.message === 'Network Error') {
         setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
      } else {
        setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.')
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
              {/* Các trường Input (fullName, email, phone, password...) */}

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
                required // Bạn có thể bỏ required nếu SĐT không bắt buộc
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
                Đăng ký
              </Button>

              {/* Social Login Section (Giữ nguyên) */}
              <Box sx={{ textAlign: 'center', my: 3 }}>
                {/* ... code social ... */}
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

        {/* ...Phần Quay lại trang chủ... */}
      </Container>
    </Box>
  )
}

export default RegisterPage