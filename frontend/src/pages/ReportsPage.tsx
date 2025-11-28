// ReportsPage.tsx - Phiên bản hoàn chỉnh
import {
  Box,
  Typography,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement)

interface ReportData {
  totalIncome: number
  totalExpense: number
  balance: number
  period: string
  categorySummary: { [key: string]: number }
  percentageSummary?: { [key: string]: number }
  transactionCount: number
  averageTransaction: number
}

interface TrendData {
  period: string
  income: number
  expense: number
  balance: number
}

const ReportsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [chartData, setChartData] = useState<any>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(false)

  // Lấy token từ localStorage
  const getToken = () => {
    return localStorage.getItem('token') || ''
  }

  // Kiểm tra authentication
  const checkAuth = () => {
    const token = getToken()
    if (!token) {
      setAuthError(true)
      return false
    }
    setAuthError(false)
    return true
  }

  useEffect(() => {
    if (checkAuth()) {
      fetchReportData()
      fetchChartData()
      fetchTrendData()
    }
  }, [selectedMonth, selectedYear])

  const fetchReportData = async () => {
    if (!checkAuth()) return

    setLoading(true)
    try {
      const startDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`
      const endDate = getEndDate()
      const token = getToken()

      const response = await fetch(
        `http://localhost:8080/api/reports/analytics/summary?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        if (response.status === 403) {
          setAuthError(true)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error('Error fetching report data:', error)
      setReportData(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    if (!checkAuth()) return

    try {
      const startDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`
      const endDate = getEndDate()
      const token = getToken()

      const response = await fetch(
        `http://localhost:8080/api/reports/analytics/chart-data?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        if (response.status === 403) {
          setAuthError(true)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setChartData(data)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  const fetchTrendData = async () => {
    if (!checkAuth()) return

    try {
      const token = getToken()

      const response = await fetch(
        'http://localhost:8080/api/reports/analytics/trends?months=12',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        if (response.status === 403) {
          setAuthError(true)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setTrendData(data)
    } catch (error) {
      console.error('Error fetching trend data:', error)
    }
  }

  const getEndDate = () => {
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate()
    return `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${lastDay}`
  }

  const handleExportPdf = async () => {
    if (!checkAuth()) return

    try {
      const token = getToken()

      const response = await fetch(
        `http://localhost:8080/api/reports/export/pdf?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `financial-report-${selectedMonth}-${selectedYear}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        alert('Đã xuất PDF thành công!')
      } else {
        alert('Có lỗi xảy ra khi xuất PDF')
      }
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Có lỗi xảy ra khi xuất PDF')
    }
  }

  const handleExportCsv = async () => {
    if (!checkAuth()) return

    try {
      const token = getToken()

      const response = await fetch(
        `http://localhost:8080/api/reports/export/csv?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `financial-report-${selectedMonth}-${selectedYear}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        alert('Đã xuất CSV thành công!')
      } else {
        alert('Có lỗi xảy ra khi xuất CSV')
      }
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Có lỗi xảy ra khi xuất CSV')
    }
  }

  // Dữ liệu biểu đồ tròn từ dữ liệu thật
  const pieData = {
    labels: reportData && reportData.categorySummary ? Object.keys(reportData.categorySummary) : [],
    datasets: [
      {
        data: reportData && reportData.categorySummary ? Object.values(reportData.categorySummary) : [],
        backgroundColor: [
          '#A8C5B8', '#6B8E7F', '#4A7260', '#5A8372', '#2E5B47', '#7FA89B',
          '#8FB9A8', '#3D5B4F', '#6D8B74', '#9FB8AD', '#2F4F4F', '#708090'
        ],
        borderWidth: 0,
      },
    ],
  }

  // Dữ liệu biểu đồ đường từ trend data
  const lineData = {
    labels: trendData.map(item => {
      const [year, month] = item.period.split('-')
      return `T${month}/${year}`
    }),
    datasets: [
      {
        label: 'Chi tiêu',
        data: trendData.map(item => item.expense / 1000000),
        borderColor: '#d32f2f',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Thu nhập',
        data: trendData.map(item => item.income / 1000000),
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} triệu VNĐ`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + ' tr'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
  }

  const hasData = reportData &&
    (reportData.totalIncome > 0 || reportData.totalExpense > 0) &&
    reportData.categorySummary &&
    Object.keys(reportData.categorySummary).length > 0

  // Hiển thị lỗi authentication
  if (authError) {
    return (
      <DashboardLayout>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
            Vui lòng đăng nhập để xem báo cáo
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/login'}
            sx={{ backgroundColor: '#2E5B47' }}
          >
            Đăng nhập
          </Button>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2E5B47' }}>
            Báo cáo
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Tháng</InputLabel>
              <Select
                value={selectedMonth}
                label="Tháng"
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                  <MenuItem key={month} value={month}>Tháng {month}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Năm</InputLabel>
              <Select
                value={selectedYear}
                label="Năm"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[2025, 2024, 2023].map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleExportPdf}
              disabled={!hasData}
              sx={{ backgroundColor: '#2E5B47', '&:disabled': { opacity: 0.5 } }}
            >
              Export PDF
            </Button>

            <Button
              variant="contained"
              onClick={handleExportCsv}
              disabled={!hasData}
              sx={{ backgroundColor: '#2E5B47', '&:disabled': { opacity: 0.5 } }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress sx={{ color: '#2E5B47' }} />
          </Box>
        )}

        {!loading && !hasData && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Không có dữ liệu giao dịch cho tháng {selectedMonth}/{selectedYear}.
            Vui lòng chọn thời gian khác hoặc thêm giao dịch mới.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Biểu đồ xu hướng */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: '20px', backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2E5B47' }}>
                Xu hướng thu chi 12 tháng gần nhất:
              </Typography>
              {trendData && trendData.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <Line data={lineData} options={lineOptions} />
                </Box>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="textSecondary">
                    Không có đủ dữ liệu để hiển thị biểu đồ xu hướng
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Tổng quan và biểu đồ tròn */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: '20px', backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E5B47', mb: 3 }}>
                Tổng quan tháng {selectedMonth}:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E5B47', mb: 1 }}>
                    Thu nhập:
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                    {reportData ? new Intl.NumberFormat('vi-VN').format(reportData.totalIncome) + ' đ' : '0 đ'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E5B47', mb: 1 }}>
                    Chi tiêu:
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#d4a574' }}>
                    {reportData ? new Intl.NumberFormat('vi-VN').format(reportData.totalExpense) + ' đ' : '0 đ'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E5B47', mb: 1 }}>
                    Còn lại:
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: reportData && reportData.balance >= 0 ? '#2e7d32' : '#d32f2f' }}>
                    {reportData ? new Intl.NumberFormat('vi-VN').format(reportData.balance) + ' đ' : '0 đ'}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, borderRadius: '20px', backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2E5B47' }}>
                Phân bổ chi tiêu:
              </Typography>

              {hasData && pieData.labels.length > 0 ? (
                <>
                  <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                    <Pie data={pieData} options={chartOptions} />
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 3 }}>
                    {pieData.labels.map((label, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: pieData.datasets[0].backgroundColor[index],
                            borderRadius: '4px',
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#2E5B47', fontWeight: 500 }}>
                          {label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    Không có dữ liệu chi tiêu để hiển thị biểu đồ
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Bảng chi tiết */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: '20px', backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2E5B47' }}>
                Chi tiết chi tiêu theo danh mục:
              </Typography>

              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#6B8E7F' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Danh mục</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Số tiền</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tỷ lệ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hasData ? (
                      Object.entries(reportData.categorySummary).map(([category, amount], index) => {
                        const percentage = reportData.totalExpense > 0 ?
                          (((amount as number) / reportData.totalExpense) * 100).toFixed(1) : '0.0'
                        return (
                          <TableRow
                            key={category}
                            sx={{
                              '&:nth-of-type(odd)': { backgroundColor: '#F5F3EE' },
                              '&:last-child td': { border: 0 },
                            }}
                          >
                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  backgroundColor: pieData.datasets[0].backgroundColor[index],
                                  borderRadius: '50%',
                                }}
                              />
                              <Typography sx={{ fontWeight: 500, color: '#2E5B47' }}>
                                {category}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#2E5B47' }}>
                              {new Intl.NumberFormat('vi-VN').format(amount as number)} đ
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#2E5B47' }}>
                              {percentage}%
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ textAlign: 'center', color: '#666', py: 4 }}>
                          Không có dữ liệu chi tiêu
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}

export default ReportsPage