import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AccountManagementPage from './pages/AccountManagementPage'
import AddAccountPage from './pages/AddAccountPage'
import TransactionManagementPage from './pages/TransactionManagementPage'
import BudgetManagementPage from './pages/BudgetManagementPage'
import ExpenseAnalysisPage from './pages/ExpenseAnalysisPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

// Tạo theme tùy chỉnh
const theme = createTheme({
  palette: {
    primary: {
      main: '#6B8E7F', // Màu xanh lá như trong mockup
      light: '#8BA89D',
      dark: '#567165',
    },
    secondary: {
      main: '#D4A574', // Màu vàng nâu
    },
    background: {
      default: '#F5F3EE', // Màu nền be nhạt
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountManagementPage />} />
          <Route path="/accounts/add" element={<AddAccountPage />} />
          <Route path="/transactions" element={<TransactionManagementPage />} />
          <Route path="/budgets" element={<BudgetManagementPage />} />
          <Route path="/analysis" element={<ExpenseAnalysisPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

