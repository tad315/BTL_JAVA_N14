import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
} from '@mui/material'
import DashboardLayout from '../components/DashboardLayout'

interface Category {
  id: number;
  name: string;
  type: string;
  icon?: string;
  color?: string;
}

const SettingsPage = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  // Load user profile từ API
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const getAuthToken = () => {
    return localStorage.getItem('token') || ''
  }

  const fetchUserProfile = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:8080/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUserInfo({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
        })
      } else {
        showSnackbar('Lỗi khi tải thông tin người dùng', 'error')
      }
    } catch (error) {
      showSnackbar('Lỗi kết nối đến server', 'error')
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleSaveProfile = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: userInfo.fullName,
          phone: userInfo.phone,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Cập nhật localStorage để header hiển thị tên mới ngay lập tức
        localStorage.setItem('userFullName', userInfo.fullName)
        
        // Dispatch custom event để DashboardLayout cập nhật
        window.dispatchEvent(new Event('userProfileUpdated'))
        
        showSnackbar('Thông tin cá nhân đã được cập nhật!', 'success')
      } else {
        showSnackbar(result.error || 'Cập nhật thất bại', 'error')
      }
    } catch (error) {
      showSnackbar('Lỗi kết nối đến server', 'error')
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSnackbar('Mật khẩu mới không khớp!', 'error')
      return
    }

    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:8080/api/user/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showSnackbar('Mật khẩu đã được thay đổi!', 'success')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        showSnackbar(result.error || 'Đổi mật khẩu thất bại', 'error')
      }
    } catch (error) {
      showSnackbar('Lỗi kết nối đến server', 'error')
    }
  }

  const handleBackup = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:8080/api/backup', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        // Tạo file JSON để download
        const dataStr = JSON.stringify(data, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        
        // Tạo link download
        const url = window.URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `vissmart-backup-${Date.now()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        showSnackbar('Dữ liệu đã được sao lưu thành công!', 'success')
      } else {
        showSnackbar('Sao lưu thất bại', 'error')
      }
    } catch (error) {
      console.error('Backup error:', error)
      showSnackbar('Lỗi kết nối đến server', 'error')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:8080/api/user/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showSnackbar('Tài khoản đã được xóa thành công!', 'success')
        
        // Xóa dữ liệu localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userFullName')
        localStorage.removeItem('userEmail')
        
        // Redirect về trang login sau 2 giây
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        showSnackbar(result.error || 'Xóa tài khoản thất bại', 'error')
      }
    } catch (error) {
      console.error('Delete account error:', error)
      showSnackbar('Lỗi kết nối đến server', 'error')
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2E5B47' }}>
          Cài đặt:
        </Typography>

        <Grid container spacing={3}>
          {/* Thông tin cá nhân */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2E5B47', fontWeight: 600 }}>
                Thông tin cá nhân
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Họ và tên"
                  value={userInfo.fullName}
                  onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Số điện thoại"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  sx={{
                    backgroundColor: '#6B8E7F',
                    '&:hover': { backgroundColor: '#2E5B47' },
                    mt: 1,
                  }}
                >
                  Lưu thay đổi
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Thay đổi mật khẩu */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2E5B47', fontWeight: 600 }}>
                Thay đổi mật khẩu
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Mật khẩu hiện tại"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Mật khẩu mới"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  fullWidth
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={handleChangePassword}
                  sx={{
                    backgroundColor: '#6B8E7F',
                    '&:hover': { backgroundColor: '#2E5B47' },
                    mt: 1,
                  }}
                >
                  Đổi mật khẩu
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Sao lưu/khôi phục dữ liệu */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2E5B47', fontWeight: 600 }}>
                Sao lưu & Khôi phục
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="info">
                  Sao lưu dữ liệu của bạn để tránh mất mát thông tin quan trọng.
                </Alert>
                <Button
                  variant="contained"
                  onClick={handleBackup}
                  sx={{
                    backgroundColor: '#6B8E7F',
                    '&:hover': { backgroundColor: '#2E5B47' },
                  }}
                >
                  Sao lưu dữ liệu
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Xóa tài khoản */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid #f44336' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#f44336', fontWeight: 600 }}>
                Vùng nguy hiểm
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="error">
                  Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
                </Alert>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Xóa tài khoản
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Dialog xác nhận xóa tài khoản */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle sx={{ color: '#f44336' }}>
            Xác nhận xóa tài khoản
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa tài khoản? Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: '#6B8E7F' }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
            >
              Xóa tài khoản
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar thông báo */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Box>
    </DashboardLayout>
  )
}

export default SettingsPage
