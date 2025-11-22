import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  Grid,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import DashboardLayout from '../components/DashboardLayout'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const ExpenseAnalysisPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Ăn uống')

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
  }

  // Dữ liệu biểu đồ tròn
  const pieData = {
    labels: ['Ăn uống', 'Sinh hoạt', 'Đi lại', 'Giải trí', 'Giáo dục', 'Y tế'],
    datasets: [
      {
        data: [35, 25, 15, 12, 8, 5],
        backgroundColor: [
          '#A8C5B8',
          '#6B8E7F',
          '#4A7260',
          '#5A8372',
          '#2E5B47',
          '#7FA89B',
        ],
        borderWidth: 0,
      },
    ],
  }

  // Dữ liệu biểu đồ cột (chi tiết theo tháng)
  const barData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
      {
        label: 'Chi tiêu',
        data: [5, 6, 8, 5, 7, 6, 5, 4, 9, 4, 6, 5],
        backgroundColor: '#2E5B47',
      },
      {
        label: 'Thu nhập',
        data: [4, 5, 6, 4, 5, 4, 3, 2, 7, 3, 5, 4],
        backgroundColor: '#A8C5B8',
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
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 12,
        ticks: {
          stepSize: 2,
        },
      },
    },
  }

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: '#2E5B47' }}>
          Phân tích chi tiêu:
        </Typography>

        <Grid container spacing={4}>
          {/* Biểu đồ tròn */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                borderRadius: '20px',
                backgroundColor: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                height: '100%',
              }}
            >
              <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                <Pie data={pieData} options={chartOptions} />
              </Box>

              {/* Legend */}
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
            </Card>
          </Grid>

          {/* Biểu đồ cột với dropdown */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                borderRadius: '20px',
                backgroundColor: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2E5B47' }}>
                Thống kê chi tiết:
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: '#6B8E7F',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  {pieData.labels.map((label) => (
                    <MenuItem key={label} value={label}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Bar data={barData} options={barOptions} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}

export default ExpenseAnalysisPage

