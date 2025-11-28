import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import DashboardLayout from '../components/DashboardLayout'
import EmptyState from '../components/EmptyState'
import api from '../api'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(107, 142, 127, 0.2)',
  minHeight: '80px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}))

const ChartCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  backdropFilter: 'blur(10px)',
}))

interface Transaction {
  id: number
  transactionDate?: string
  date?: string
  description: string
  amount: number
  isIncome: boolean
  category: string
}

interface Wallet {
  id: number
  balance: number
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const currentUserId = Number(localStorage.getItem('userId')) || null
  const [stats, setStats] = useState([
    { title: 'Thu nhập tháng này', value: '0 VNĐ' },
    { title: 'Chi tiêu tháng này', value: '0 VNĐ' },
    { title: 'Số dư hiện tại', value: '0 VNĐ' },
  ])
  const [pieData, setPieData] = useState<{
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor: string[]
      borderWidth: number
      amounts?: number[] // Thêm để lưu số tiền thực tế
    }[]
  }>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#2E5B47', '#4A7C59', '#6B8E7F', '#8BA89D', '#A8C5B8', '#7FA89B'],
      borderWidth: 0,
      amounts: [],
    }],
  })
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false)
      return
    }
    fetchDashboardData()
    fetchTransactionsForBarChart()
  }, [currentUserId])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const currentMonth = new Date().toISOString().slice(0, 7)
      if (!currentUserId) {
        setLoading(false)
        return
      }

      console.log('🔍 Fetching dashboard data for userId:', currentUserId)
      console.log('📅 Current month:', currentMonth)

      // Fetch transactions
      const transactionsRes = await api.get('/transactions', {
        params: {
          userId: currentUserId,
          page: 0,
          limit: 100,
          sortBy: 'transactionDate',
          order: 'DESC'
        }
      })
      const allTransactions: Transaction[] = transactionsRes.data.content || []
      console.log('📦 All transactions:', allTransactions.length, allTransactions)

      // Fetch wallets
      const walletsRes = await api.get('/wallets', {
        params: { userId: currentUserId }
      })
      const wallets: Wallet[] = walletsRes.data || []
      console.log('💼 Wallets:', wallets.length, wallets)

      // Tính toán stats
      const currentMonthTransactions = allTransactions.filter(t => {
        const isMatch = t.transactionDate?.startsWith(currentMonth)
        console.log(`📊 Transaction ${t.id} (${t.transactionDate}): isCurrentMonth=${isMatch}`)
        return isMatch
      })
      
      console.log('📅 Current month transactions:', currentMonthTransactions.length, currentMonthTransactions)
      
      const totalIncome = currentMonthTransactions
        .filter(t => t.isIncome)
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      
      const totalExpense = currentMonthTransactions
        .filter(t => !t.isIncome)
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      
      const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0)

      console.log('💰 Stats:', { totalIncome, totalExpense, totalBalance })

      setStats([
        { title: 'Thu nhập tháng này', value: formatCurrency(totalIncome) },
        { title: 'Chi tiêu tháng này', value: formatCurrency(totalExpense) },
        { title: 'Số dư hiện tại', value: formatCurrency(totalBalance) },
      ])

      // Tính toán pie chart data (phân bố chi tiêu theo category)
      const expenseByCategory: { [key: string]: number } = {}
      const expenseTransactions = currentMonthTransactions.filter(t => !t.isIncome)
      console.log('💸 Expense transactions for pie chart:', expenseTransactions.length, expenseTransactions)
      
      expenseTransactions.forEach(t => {
        const cat = t.category || 'Khác'
        expenseByCategory[cat] = (expenseByCategory[cat] || 0) + (t.amount || 0)
        console.log(`  - ${cat}: +${t.amount} = ${expenseByCategory[cat]}`)
      })

      const categories = Object.keys(expenseByCategory)
      const amounts = Object.values(expenseByCategory)
      const totalExpenseForPie = amounts.reduce((sum, a) => sum + a, 0)
      const percentages = amounts.map(a => totalExpenseForPie > 0 ? Math.round((a / totalExpenseForPie) * 100) : 0)

      console.log('🥧 Pie data:', { categories, amounts, percentages })

      setPieData({
        labels: categories,
        datasets: [{
          data: percentages,
          backgroundColor: ['#2E5B47', '#4A7C59', '#6B8E7F', '#8BA89D', '#A8C5B8', '#7FA89B', '#B8D4CB', '#C5DED6'],
          borderWidth: 0,
          amounts: amounts, // Lưu số tiền thực tế
        }],
      })

      // Recent transactions (5 giao dịch gần nhất)
      setRecentTransactions(allTransactions.slice(0, 5))

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || 'Khác'
            const percentage = context.parsed || 0
            const amounts = context.dataset.amounts || []
            const amount = amounts[context.dataIndex] || 0
            const formattedAmount = formatCurrency(amount)
            return `${label}: ${percentage}% (${formattedAmount})`
          }
        }
      }
    },
  }

  const PieChartComponent = () => {
    if (pieData.labels.length === 0) {
      return (
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Chưa có dữ liệu chi tiêu trong tháng này</Typography>
        </Box>
      )
    }
    return (
    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'space-around', p: 3 }}>
      <Box sx={{ width: 200, height: 200 }}>
        <Pie data={pieData} options={pieOptions} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: '60%' }}>
        {pieData.labels.map((label, index) => {
          const amount = pieData.datasets[0].amounts?.[index] || 0
          const percentage = pieData.datasets[0].data[index]
          return (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                bgcolor: pieData.datasets[0].backgroundColor[index % pieData.datasets[0].backgroundColor.length],
                flexShrink: 0
              }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {label} ({percentage}%)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {formatCurrency(amount)}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
  }

  // Bar Chart Data - Thu nhập vs Chi tiêu theo tháng (tính từ transactions)
  const [barData, setBarData] = useState({
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Chi tiêu',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#8BA89D',
        borderRadius: 4,
      },
      {
        label: 'Thu nhập',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#2E5B47',
        borderRadius: 4,
      },
    ],
  })

  const fetchTransactionsForBarChart = async () => {
    try {
      if (!currentUserId) return
      const currentYear = new Date().getFullYear()
      console.log('📊 Fetching bar chart data for year:', currentYear)
      
      const res = await api.get('/transactions', {
        params: {
          userId: currentUserId,
          page: 0,
          limit: 1000,
        }
      })
      const transactions: Transaction[] = res.data.content || []
      console.log('📈 Transactions for bar chart:', transactions.length)

      const monthlyData: { [key: number]: { income: number, expense: number } } = {}
      for (let i = 0; i < 12; i++) {
        monthlyData[i] = { income: 0, expense: 0 }
      }

      transactions.forEach(t => {
        if (t.transactionDate) {
          const date = new Date(t.transactionDate)
          const year = date.getFullYear()
          const month = date.getMonth()
          
          if (year === currentYear) {
            const amountInMillion = (t.amount || 0) / 1000000
            if (t.isIncome) {
              monthlyData[month].income += amountInMillion
              console.log(`  📈 Month ${month + 1}: +Income ${amountInMillion.toFixed(2)}tr`)
            } else {
              monthlyData[month].expense += amountInMillion
              console.log(`  📉 Month ${month + 1}: +Expense ${amountInMillion.toFixed(2)}tr`)
            }
          } else {
            console.log(`  ⏭️ Skipping transaction from ${year}`)
          }
        }
      })

      const expenseData = Object.values(monthlyData).map(d => Math.round(d.expense * 10) / 10)
      const incomeData = Object.values(monthlyData).map(d => Math.round(d.income * 10) / 10)
      
      console.log('📊 Bar chart data:', { expenseData, incomeData, monthlyData })

      setBarData({
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            label: 'Chi tiêu',
            data: expenseData,
            backgroundColor: '#8BA89D',
            borderRadius: 4,
          },
          {
            label: 'Thu nhập',
            data: incomeData,
            backgroundColor: '#2E5B47',
            borderRadius: 4,
          },
        ],
      })
    } catch (error) {
      console.error('❌ Error fetching bar chart data:', error)
    }
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y
            if (value === 0) return context.dataset.label + ': 0 VNĐ'
            if (value < 1) {
              return context.dataset.label + ': ' + (value * 1000).toFixed(0) + ' nghìn VNĐ'
            }
            return context.dataset.label + ': ' + value.toFixed(1) + ' triệu VNĐ'
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            if (value === 0) return '0'
            return value + 'tr'
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

  const BarChartComponent = () => (
    <Box sx={{ height: 300, p: 2 }}>
      <Bar data={barData} options={barOptions} />
    </Box>
  )

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  if (!currentUserId) {
    return (
      <DashboardLayout>
        <Box>
          <Typography variant="h6" color="error">
            Không tìm thấy thông tin người dùng
          </Typography>
          <Typography>Vui lòng đăng nhập lại để xem Dashboard.</Typography>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box>
        {/* Stats Cards */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatsCard>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9, 
                    mb: 0.5, 
                    fontSize: { xs: '0.75rem', md: '0.8rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {stat.value}
                </Typography>
              </StatsCard>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Pie Chart */}
          <Grid item xs={12} lg={6}>
            <ChartCard>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Phân bố chi tiêu:
              </Typography>
              <PieChartComponent />
            </ChartCard>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} lg={6}>
            <ChartCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Biểu đồ chi tiêu:
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Năm {new Date().getFullYear()}
                </Typography>
              </Box>
              <BarChartComponent />
            </ChartCard>
          </Grid>
        </Grid>

        {/* Recent Transactions */}
        <ChartCard>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Giao dịch gần đây:
          </Typography>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: { xs: 600, md: 'auto' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '2px dashed #ccc', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    Thời gian
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '2px dashed #ccc', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    Nội dung
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '2px dashed #ccc', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    Số tiền
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '2px dashed #ccc', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    Danh mục
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography>Đang tải dữ liệu...</Typography>
                    </TableCell>
                  </TableRow>
                ) : recentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <EmptyState
                        title="Chưa có giao dịch nào"
                        description="Bạn sẽ nhìn thấy danh sách giao dịch gần đây sau khi thêm giao dịch đầu tiên."
                        actionText="Thêm giao dịch"
                        onAction={() => navigate('/transactions')}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                    <TableCell sx={{ borderBottom: '1px dashed #ddd', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        {formatDate(transaction.transactionDate || transaction.date || '')}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px dashed #ddd', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        {transaction.description || 'Không có mô tả'}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        borderBottom: '1px dashed #ddd',
                          color: transaction.isIncome ? '#2e7d32' : '#d32f2f',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                      }}
                    >
                        {transaction.isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount || 0))}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px dashed #ddd', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        {transaction.category || 'Khác'}
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </ChartCard>
      </Box>
    </DashboardLayout>
  )
}

export default DashboardPage


