import api from '../api'

export interface AiContextResponse {
  userName: string
  month: string
  summary: {
    totalIncome: number
    totalExpense: number
    netIncome: number
    savingRate: number
    averageDailyExpense: number
  }
  recentTransactions: Array<{
    id: number
    date: string
    description: string
    amount: number
    income: boolean
    category: string
  }>
  topCategories: Array<{
    category: string
    amount: number
    percentage: number
  }>
  budgets: Array<{
    id: number
    category: string
    limitAmount: number
    spent: number
    utilization: number
    status: 'OVER_LIMIT' | 'NEAR_LIMIT' | 'ON_TRACK' | 'NO_LIMIT'
  }>
  wallets: Array<{
    id: number
    name: string
    type: string
    balance: number
  }>
  alerts: string[]
  lastUpdated: string
}

export const fetchChatContext = async (question?: string): Promise<AiContextResponse> => {
  const response = await api.get('/chat/context', {
    params: question ? { question } : undefined,
  })
  return response.data
}

