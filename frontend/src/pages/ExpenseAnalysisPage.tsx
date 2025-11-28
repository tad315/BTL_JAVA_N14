import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Card,
  Grid,
} from '@mui/material'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import DashboardLayout from '../components/DashboardLayout'
import api from '../api'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface Transaction {
  id: number
  amount: number
  category: string
  transactionDate: string
  isIncome: boolean
  userId: number
  description: string
  date: string
}

const ExpenseAnalysisPage = () => {
  const currentUserId = Number(localStorage.getItem('userId')) || null
  const [pieData, setPieData] = useState({
    labels: [] as string[],
    datasets: [{
      data: [] as number[],
      backgroundColor: [
        '#A8C5B8',
        '#6B8E7F',
        '#4A7260',
        '#5A8372',
        '#2E5B47',
        '#7FA89B',
      ],
      borderWidth: 0,
    }],
  })
  const [barData, setBarData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Chi tiêu (triệu VND)',
        data: [] as number[],
        backgroundColor: '#2E5B47',
        borderColor: '#2E5B47',
        borderWidth: 1,
      },
      {
        label: 'Thu nhập (triệu VND)',
        data: [] as number[],
        backgroundColor: '#A8C5B8',
        borderColor: '#A8C5B8',
        borderWidth: 1,
      },
    ],
  })
  const [loading, setLoading] = useState(true)

  // Hàm fetch data chính - SỬ DỤNG API ANALYTICS THAY VÌ TRANSACTIONS
  const fetchAnalysisData = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Sử dụng API analytics để lấy dữ liệu đã được xử lý
      const chartDataResponse = await api.get('/analytics/chart-data', {
        params: { userId: currentUserId }
      })
      const chartData = chartDataResponse.data

      console.log('📊 Dữ liệu từ analytics API:', chartData)

      if (chartData) {
        processChartData(chartData)
      } else {
        // Fallback: lấy dữ liệu từ transactions nếu analytics không có
        const transactions = await fetchDataFromTransactions()
        if (transactions && transactions.length > 0) {
          processAllData(transactions)
        }
      }
    } catch (error) {
      console.error('💥 Lỗi khi fetch dữ liệu analytics:', error)

      // Fallback to transactions API
      try {
        const transactions = await fetchDataFromTransactions()
        if (transactions && transactions.length > 0) {
          processAllData(transactions)
        }
      } catch (fallbackError) {
        console.error('💥 Lỗi fallback:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  // Auto refresh mỗi 30 giây
  useEffect(() => {
    fetchAnalysisData() // Load ngay lập tức

    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh data...')
      fetchAnalysisData()
    }, 30000) // 30 giây

    return () => clearInterval(interval)
  }, [fetchAnalysisData])

  // Xử lý dữ liệu từ analytics API
  const processChartData = (chartData: any) => {
    // Xử lý biểu đồ tròn từ categoryTotals
    if (chartData.categoryTotals && Object.keys(chartData.categoryTotals).length > 0) {
      const categories = Object.keys(chartData.categoryTotals)
      const amounts = Object.values(chartData.categoryTotals) as number[]
      const total = amounts.reduce((sum, a) => sum + a, 0)
      const percentages = amounts.map(a => total > 0 ? Math.round((a / total) * 100) : 0)

      setPieData({
        labels: categories,
        datasets: [{
          data: percentages,
          backgroundColor: [
            '#A8C5B8',
            '#6B8E7F',
            '#4A7260',
            '#5A8372',
            '#2E5B47',
            '#7FA89B',
          ],
          borderWidth: 0,
        }],
      })
    }

    // Xử lý biểu đồ cột từ monthlyIncomes và monthlyExpenses
    if (chartData.monthlyIncomes && chartData.monthlyExpenses) {
      const monthlyLabels = Object.keys(chartData.monthlyIncomes)
      const incomeData = Object.values(chartData.monthlyIncomes) as number[]
      const expenseData = Object.values(chartData.monthlyExpenses) as number[]

      // Chuyển đổi từ VND sang triệu VND
      const incomeInMillions = incomeData.map(amount => Math.round((amount / 1000000) * 100) / 100)
      const expenseInMillions = expenseData.map(amount => Math.round((amount / 1000000) * 100) / 100)

      // Tạo labels đẹp hơn
      const formattedLabels = monthlyLabels.map(period => {
        const [year, month] = period.split('-')
        return `Tháng ${parseInt(month)}/${year}`
      })

      setBarData({
        labels: formattedLabels,
        datasets: [
          {
            label: 'Chi tiêu (triệu VND)',
            data: expenseInMillions,
            backgroundColor: '#2E5B47',
            borderColor: '#2E5B47',
            borderWidth: 1,
          },
          {
            label: 'Thu nhập (triệu VND)',
            data: incomeInMillions,
            backgroundColor: '#A8C5B8',
            borderColor: '#A8C5B8',
            borderWidth: 1,
          },
        ],
      })
    }
  }

  // Fallback: lấy dữ liệu từ transactions API
  const fetchDataFromTransactions = async (): Promise<Transaction[]> => {
    try {
      const res = await api.get('/transactions', {
        params: {
          userId: currentUserId,
          page: 0,
          limit: 1000,
        }
      })

      const transactionsData: Transaction[] = res.data.content || []
      return transactionsData

    } catch (error) {
      console.error('💥 Lỗi khi fetch transactions:', error)
      return []
    }
  }

  const processAllData = (transactions: Transaction[]) => {
    processPieChartData(transactions)
    processBarChartData(transactions)
  }

  const processPieChartData = (transactions: Transaction[]) => {
    const expenseByCategory: { [key: string]: number } = {}

    const expenseTransactions = transactions.filter(t => !t.isIncome && t.category)

    expenseTransactions.forEach(t => {
      const category = t.category || 'Khác'
      expenseByCategory[category] = (expenseByCategory[category] || 0) + (t.amount || 0)
    })

    const categories = Object.keys(expenseByCategory)
    const amounts = Object.values(expenseByCategory)
    const total = amounts.reduce((sum, a) => sum + a, 0)
    const percentages = amounts.map(a => total > 0 ? Math.round((a / total) * 100) : 0)

    if (categories.length > 0) {
      setPieData({
        labels: categories,
        datasets: [{
          data: percentages,
          backgroundColor: [
            '#A8C5B8',
            '#6B8E7F',
            '#4A7260',
            '#5A8372',
            '#2E5B47',
            '#7FA89B',
          ],
          borderWidth: 0,
        }],
      })
    }
  }

  const processBarChartData = (transactions: Transaction[]) => {
    console.log('📈 Bắt đầu xử lý biểu đồ cột với dữ liệu transactions...')

    const monthlyData: { [key: string]: { income: number, expense: number } } = {}

    // Phân bố dữ liệu theo tháng thực tế từ transactionDate
    transactions.forEach((t) => {
      const date = new Date(t.transactionDate || t.date)
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyData[period]) {
        monthlyData[period] = { income: 0, expense: 0 }
      }

      if (t.isIncome) {
        monthlyData[period].income += (t.amount || 0)
      } else {
        monthlyData[period].expense += (t.amount || 0)
      }
    })

    console.log('📊 Dữ liệu thực theo tháng:', monthlyData)

    // Tạo danh sách 12 tháng gần nhất
    const allLabels: string[] = []
    const expenseData: number[] = []
    const incomeData: number[] = []

    const currentDate = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`

      allLabels.push(label)

      const monthly = monthlyData[period] || { income: 0, expense: 0 }
      expenseData.push(Math.round((monthly.expense / 1000000) * 100) / 100)
      incomeData.push(Math.round((monthly.income / 1000000) * 100) / 100)
    }

    console.log('🎯 Dữ liệu biểu đồ cột thực tế:', {
      labels: allLabels,
      expenseData,
      incomeData
    })

    setBarData({
      labels: allLabels,
      datasets: [
        {
          label: 'Chi tiêu (triệu VND)',
          data: expenseData,
          backgroundColor: '#2E5B47',
          borderColor: '#2E5B47',
          borderWidth: 1,
        },
        {
          label: 'Thu nhập (triệu VND)',
          data: incomeData,
          backgroundColor: '#A8C5B8',
          borderColor: '#A8C5B8',
          borderWidth: 1,
        },
      ],
    })
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          callback: function(value: any) {
            return value + ' tr'
          }
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
  }

  const chartContainerStyle = {
    height: '300px',
    width: '100%',
    position: 'relative' as const
  }

  if (!currentUserId) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Không tìm thấy thông tin người dùng
          </Typography>
          <Typography>
            Vui lòng đăng nhập lại để xem phân tích chi tiêu.
          </Typography>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* CHỈ GIỮ LẠI TIÊU ĐỀ - ĐÃ XÓA DEBUG VÀ CONTROLS */}
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2E5B47', mb: 3 }}>
          Phân tích chi tiêu
        </Typography>

        {/* CHỈ GIỮ LẠI BIỂU ĐỒ - ĐÃ XÓA DEBUG PANEL VÀ SUMMARY CARDS */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: '16px', backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2E5B47' }}>
                Phân bố chi tiêu theo danh mục
              </Typography>

              {loading ? (
                <Box sx={{ ...chartContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography>Đang tải dữ liệu...</Typography>
                </Box>
              ) : pieData.labels.length === 0 ? (
                <Box sx={{ ...chartContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <Typography color="text.secondary">Chưa có dữ liệu chi tiêu</Typography>
                </Box>
              ) : (
                <>
                  <Box sx={chartContainerStyle}>
                    <Pie data={pieData} options={chartOptions} />
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 3 }}>
                    {pieData.labels.map((label, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: pieData.datasets[0].backgroundColor[index], borderRadius: '2px' }} />
                        <Typography variant="body2" sx={{ color: '#2E5B47', fontWeight: 500 }}>
                          {label} ({pieData.datasets[0].data[index]}%)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: '16px', backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2E5B47' }}>
                Tổng thu chi theo tháng
              </Typography>

              {loading ? (
                <Box sx={{ ...chartContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography>Đang tải dữ liệu...</Typography>
                </Box>
              ) : barData.labels.length === 0 ? (
                <Box sx={{ ...chartContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Chưa có dữ liệu thu chi</Typography>
                </Box>
              ) : (
                <Box sx={chartContainerStyle}>
                  <Bar data={barData} options={barOptions} />
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}

export default ExpenseAnalysisPage