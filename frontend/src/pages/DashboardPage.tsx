import { Box, Grid, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import DashboardLayout from '../components/DashboardLayout'

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

const DashboardPage = () => {
  // Stats data
  const stats = [
    { title: 'Thu nhập tháng này', value: '100.000.000.000' },
    { title: 'Chi tiêu tháng này', value: '100.000.000.000' },
    { title: 'Số dư hiện tại', value: '100.000.000.000' },
  ]

  // Pie Chart Data - Phân bố chi tiêu theo danh mục
  const pieData = {
    labels: ['Ăn uống', 'Sinh hoạt', 'Đi lại', 'Giải trí'],
    datasets: [
      {
        data: [30, 25, 25, 20],
        backgroundColor: ['#2E5B47', '#4A7C59', '#6B8E7F', '#8BA89D'],
        borderWidth: 0,
      },
    ],
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
            return context.label + ': ' + context.parsed + '%'
          }
        }
      }
    },
  }

  const PieChartComponent = () => (
    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'space-around', p: 3 }}>
      <Box sx={{ width: 200, height: 200 }}>
        <Pie data={pieData} options={pieOptions} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {pieData.labels.map((label, index) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: pieData.datasets[0].backgroundColor[index] }} />
            <Typography variant="body2">{label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )

  // Bar Chart Data - Thu nhập vs Chi tiêu theo tháng
  const barData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Chi tiêu',
        data: [8, 12, 11, 10, 9, 11, 10, 12, 13, 12, 11, 10],
        backgroundColor: '#8BA89D',
        borderRadius: 4,
      },
      {
        label: 'Thu nhập',
        data: [11, 13, 12, 11, 10, 12, 11, 13, 14, 13, 12, 11],
        backgroundColor: '#2E5B47',
        borderRadius: 4,
      },
    ],
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
            return context.dataset.label + ': ' + context.parsed.y + ' triệu'
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 15,
        ticks: {
          stepSize: 3,
          callback: function(value: any) {
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

  // Recent transactions data
  const recentTransactions = [
    { time: '4/10/2025', description: 'Ăn tối', amount: '-215.000 vnđ', category: 'Ăn uống' },
    { time: '1/10/2025', description: 'Tiền điện', amount: '-516.000 vnđ', category: 'Sinh hoạt' },
    { time: '29/9/2025', description: 'Đi chợ', amount: '-67.000 vnđ', category: 'Sinh hoạt' },
    { time: '22/9/2025', description: 'Quà sinh nhật', amount: '+1.000.000 vnđ', category: 'Thu nhập' },
  ]

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
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Biểu đồ chi tiêu:
              </Typography>
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
                {recentTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ borderBottom: '1px dashed #ddd', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      {transaction.time}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px dashed #ddd', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      {transaction.description}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        borderBottom: '1px dashed #ddd',
                        color: transaction.amount.startsWith('-') ? '#d32f2f' : '#2e7d32',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                      }}
                    >
                      {transaction.amount}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px dashed #ddd', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      {transaction.category}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ChartCard>
      </Box>
    </DashboardLayout>
  )
}

export default DashboardPage


