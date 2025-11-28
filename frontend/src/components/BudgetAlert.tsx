import { Alert, AlertTitle, Box, Typography, LinearProgress, Chip } from '@mui/material'
import { Warning, ErrorOutline, CheckCircle } from '@mui/icons-material'

interface Budget {
  id: number
  category: string
  limitAmount: number
  spent: number
  month: string
}

interface BudgetAlertProps {
  budgets: Budget[]
  compact?: boolean // Hiển thị gọn cho Dashboard
}

const BudgetAlert = ({ budgets, compact = false }: BudgetAlertProps) => {
  // Tính toán các budget có cảnh báo
  const budgetWarnings = budgets.map(budget => {
    const percentage = budget.limitAmount > 0 ? (budget.spent / budget.limitAmount) * 100 : 0
    
    let severity: 'success' | 'warning' | 'error' | 'info' = 'success'
    let message = ''
    let icon = <CheckCircle />
    
    if (percentage >= 100) {
      severity = 'error'
      message = `Đã vượt ngân sách ${Math.round(percentage - 100)}%`
      icon = <ErrorOutline />
    } else if (percentage >= 90) {
      severity = 'error'
      message = `Sắp vượt ngân sách (${Math.round(percentage)}%)`
      icon = <ErrorOutline />
    } else if (percentage >= 80) {
      severity = 'warning'
      message = `Sắp hết ngân sách (${Math.round(percentage)}%)`
      icon = <Warning />
    }
    
    return {
      budget,
      percentage: Math.round(percentage),
      severity,
      message,
      icon,
      needsAlert: percentage >= 80
    }
  }).filter(w => w.needsAlert)

  // Nếu không có cảnh báo nào
  if (budgetWarnings.length === 0) {
    if (compact) return null // Không hiển thị gì trong compact mode
    
    return (
      <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
        <AlertTitle>✅ Ngân sách ổn định</AlertTitle>
        Tất cả các ngân sách của bạn đều trong mức an toàn. Tiếp tục duy trì!
      </Alert>
    )
  }

  // Compact mode cho Dashboard
  if (compact) {
    return (
      <Alert 
        severity={budgetWarnings[0].severity} 
        sx={{ mb: 2, borderRadius: '12px' }}
        icon={budgetWarnings[0].icon}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>
          ⚠️ Cảnh báo ngân sách ({budgetWarnings.length})
        </AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Bạn có {budgetWarnings.length} danh mục cần lưu ý chi tiêu
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {budgetWarnings.slice(0, 3).map((warning) => (
            <Chip
              key={warning.budget.id}
              label={`${warning.budget.category}: ${warning.percentage}%`}
              color={warning.severity}
              size="small"
            />
          ))}
          {budgetWarnings.length > 3 && (
            <Chip label={`+${budgetWarnings.length - 3} nữa`} size="small" variant="outlined" />
          )}
        </Box>
      </Alert>
    )
  }

  // Full mode cho Budget Management Page
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#2E5B47', fontWeight: 600 }}>
        🔔 Cảnh báo ngân sách ({budgetWarnings.length})
      </Typography>
      
      {budgetWarnings.map((warning) => (
        <Alert 
          key={warning.budget.id}
          severity={warning.severity}
          icon={warning.icon}
          sx={{ mb: 2, borderRadius: '12px' }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>
            {warning.budget.category} - {warning.message}
          </AlertTitle>
          
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Đã chi: {new Intl.NumberFormat('vi-VN').format(warning.budget.spent)} đ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngân sách: {new Intl.NumberFormat('vi-VN').format(warning.budget.limitAmount)} đ
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={Math.min(warning.percentage, 100)} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: 
                    warning.severity === 'error' ? '#d32f2f' :
                    warning.severity === 'warning' ? '#ed6c02' : '#2e7d32'
                }
              }}
            />
            
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 0.5, 
                display: 'block',
                fontWeight: 600,
                color: 
                  warning.severity === 'error' ? '#d32f2f' :
                  warning.severity === 'warning' ? '#ed6c02' : '#2e7d32'
              }}
            >
              {warning.percentage}% đã sử dụng
            </Typography>

            {warning.percentage >= 100 && (
              <Typography variant="body2" sx={{ mt: 1, color: '#d32f2f', fontWeight: 500 }}>
                💡 Gợi ý: Hãy cân nhắc giảm chi tiêu hoặc tăng ngân sách cho danh mục này
              </Typography>
            )}
            
            {warning.percentage >= 80 && warning.percentage < 100 && (
              <Typography variant="body2" sx={{ mt: 1, color: '#ed6c02', fontWeight: 500 }}>
                💡 Gợi ý: Còn {new Intl.NumberFormat('vi-VN').format(warning.budget.limitAmount - warning.budget.spent)} đ. 
                Hãy chi tiêu cẩn thận!
              </Typography>
            )}
          </Box>
        </Alert>
      ))}
    </Box>
  )
}

export default BudgetAlert

