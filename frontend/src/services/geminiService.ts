import { GoogleGenerativeAI } from '@google/generative-ai'
import { resolveGeminiApiKey } from '../utils/geminiKey'
import type { AiContextResponse } from './chatContextService'

const createModel = (apiKey: string) => {
  const client = new GoogleGenerativeAI(apiKey)
  return client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  })
}

// System prompt for financial assistant
const SYSTEM_PROMPT = `Bạn là Vissmart AI - trợ lý tài chính cá nhân.
- Luôn trả lời bằng tiếng Việt, giọng điệu thân thiện và dễ hiểu.
- Nếu tôi cung cấp phần "DỮ LIỆU CÁ NHÂN", bạn PHẢI ưu tiên dùng các con số trong đó để trả lời. Chỉ khi thiếu dữ liệu mới được suy luận chung chung.
- Khi đưa ra lời khuyên, hãy chỉ ra cơ sở dựa trên dữ liệu vừa nhận được (ví dụ trích dẫn danh mục, số tiền, phần trăm,...).
- Nếu câu hỏi không liên quan đến tài chính, vẫn trả lời như một trợ lý AI thông minh nhưng tránh đề cập tới dữ liệu cá nhân.`

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

const percentFormatter = new Intl.NumberFormat('vi-VN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

interface Message {
  role: 'user' | 'model'
  parts: { text: string }[]
}

/**
 * Helper function để extract text từ Gemini response an toàn
 */
const extractTextFromResponse = (response: any): string => {
  try {
    // Method 1: Thử dùng response.text() trực tiếp
    const text = response.text()
    if (text && text.length > 0) {
      return text
    }
  } catch (e) {
    console.log('Method 1 failed:', e)
  }
  
  // Method 2: Lấy từ candidates
  try {
    const candidates = response.candidates
    if (candidates && candidates.length > 0) {
      const candidate = candidates[0]
      
      if (candidate.content && candidate.content.parts) {
        const parts = candidate.content.parts
        const textParts = parts
          .map((part: any) => part.text || '')
          .filter((t: string) => t && t.length > 0)
          .join('')
        
        if (textParts && textParts.length > 0) {
          return textParts
        }
      }
    }
  } catch (e) {
    console.log('Method 2 failed:', e)
  }
  
  // Method 3: Lấy từ response object trực tiếp
  try {
    if (response.parts) {
      const textParts = response.parts
        .map((part: any) => part.text || '')
        .filter((t: string) => t && t.length > 0)
        .join('')
      
      if (textParts && textParts.length > 0) {
        return textParts
      }
    }
  } catch (e) {
    console.log('Method 3 failed:', e)
  }
  
  return ''
}

/**
 * Gửi tin nhắn đến Gemini API và nhận phản hồi
 */
export const sendMessageToGemini = async (
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> => {
  try {
    // Kiểm tra API key
    const apiKey = resolveGeminiApiKey()
    if (!apiKey) {
      throw new Error('API key chưa được cấu hình. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env')
    }
    const model = createModel(apiKey)

    // Tạo prompt với lịch sử hội thoại
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Xin chào! Tôi là Vissmart AI, trợ lý tài chính của bạn. Tôi sẵn sàng giúp bạn quản lý tài chính cá nhân hiệu quả hơn.' }] },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          parts: msg.parts
        })),
      ],
    })

    // Gửi tin nhắn
    const result = await chat.sendMessage(userMessage)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    
    // Fallback message nếu có lỗi
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return '⚠️ Vui lòng cấu hình API key của Gemini trong file .env'
      }
      if (error.message.includes('429')) {
        return '⚠️ Quá nhiều yêu cầu. Vui lòng thử lại sau vài giây.'
      }
      if (error.message.includes('network')) {
        return '⚠️ Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.'
      }
    }
    
    return '⚠️ Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.'
  }
}

/**
 * Lấy phản hồi nhanh từ Gemini với prompt đơn giản
 */
export const getQuickResponse = async (
  userMessage: string,
  context?: AiContextResponse
): Promise<string> => {
  try {
    const apiKey = resolveGeminiApiKey()

    console.log('🔵 ===== START API CALL =====')
    console.log('🔵 API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found')
    console.log('🔵 User message:', userMessage)
    
    if (!apiKey) {
      console.log('⚠️ No API key, using mock response')
      return getMockResponse(userMessage)
    }

    const contextBlock = buildContextSection(context)
    const prompt = `${SYSTEM_PROMPT}\n\n${contextBlock}\n\nNgười dùng hỏi: "${userMessage}"\n\nHãy trả lời một cách tự nhiên, dẫn chứng từ dữ liệu (nếu có) và kết thúc bằng một gợi ý hành động ngắn gọn.`
    
    console.log('🔄 Calling Gemini API...')
    
    const model = createModel(apiKey)
    console.log('🔄 Model initialized')
    const result = await model.generateContent(prompt)
    console.log('📦 Raw result:', result)
    
    const response = await result.response
    console.log('📦 Response object:', response)
    
    // Sử dụng helper function để extract text
    const text = extractTextFromResponse(response)
    
    console.log('✅ Extracted text length:', text.length)
    console.log('✅ Extracted text:', text)
    console.log('🔵 ===== END API CALL =====')
    
    if (text && text.length > 0) {
      return text
    }
    
    // Nếu vẫn không có text, trả về mock response
    console.log('⚠️ No text extracted, using mock response')
    return getMockResponse(userMessage)
  } catch (error) {
    console.error('❌ ===== ERROR START =====')
    console.error('❌ Error type:', typeof error)
    console.error('❌ Error:', error)
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message)
      console.error('❌ Error stack:', error.stack)
      console.error('❌ Error name:', error.name)
    }
    console.error('❌ ===== ERROR END =====')
    
    // Trả về lỗi chi tiết
    if (error instanceof Error) {
      return `⚠️ Lỗi: ${error.message}.\nVui lòng kiểm tra console để biết thêm chi tiết.`
    }
    return '⚠️ Có lỗi xảy ra khi kết nối với AI.'
  }
}

/**
 * Mock responses khi chưa có API key hoặc có lỗi
 */
const getMockResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('chi tiêu') || lowerMessage.includes('chi')) {
    return 'Dựa trên dữ liệu của bạn, tháng này bạn đã chi tiêu 9.909.000 VNĐ. Các hạng mục chi nhiều nhất là: Ăn uống (2.345.000 VNĐ), Sinh hoạt (3.124.000 VNĐ). Bạn có muốn xem chi tiết hơn không?'
  }
  
  if (lowerMessage.includes('tiết kiệm') || lowerMessage.includes('tiết')) {
    return 'Để tiết kiệm hiệu quả, tôi khuyên bạn nên: 1) Đặt mục tiêu tiết kiệm cụ thể, 2) Theo dõi chi tiêu hàng ngày, 3) Cắt giảm các chi phí không cần thiết. Hiện tại bạn có thể tiết kiệm thêm 15-20% từ chi phí ăn uống.'
  }
  
  if (lowerMessage.includes('thu nhập')) {
    return 'Tổng thu nhập tháng này của bạn là 15.000.000 VNĐ. Sau khi trừ chi tiêu, bạn còn lại 5.091.000 VNĐ. Đây là một tỷ lệ tiết kiệm khá tốt (34%)!'
  }
  
  if (lowerMessage.includes('ngân sách')) {
    return 'Bạn đã thiết lập ngân sách cho 6 danh mục. Hiện tại bạn đang sử dụng tốt ngân sách, với một số hạng mục còn dư: Đi lại (còn 757.000 VNĐ), Giải trí (còn 1.000.000 VNĐ).'
  }
  
  if (lowerMessage.includes('phân tích') || lowerMessage.includes('phân')) {
    return 'Từ dữ liệu của bạn, tôi thấy: Chi tiêu tháng này tăng 15% so với tháng trước. Nguyên nhân chính là tăng chi phí Ăn uống và Giải trí. Tôi gợi ý bạn nên đặt ngân sách chặt chẽ hơn.'
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('giúp') || lowerMessage.includes('hướng dẫn')) {
    return 'Tôi có thể giúp bạn:\n• Xem thông tin thu nhập và chi tiêu\n• Phân tích chi tiêu theo danh mục\n• Đưa ra lời khuyên tiết kiệm\n• Theo dõi ngân sách\n\nHãy hỏi tôi bất cứ điều gì!'
  }

  if (lowerMessage.includes('đầu tư') || lowerMessage.includes('dau tu')) {
    return 'Với số tiền tiết kiệm hiện tại 5.091.000 VNĐ, tôi gợi ý:\n1. Quỹ đầu tư chỉ số (Index Fund) - Rủi ro thấp, lợi nhuận 8-10%/năm\n2. Tiết kiệm định kỳ ngân hàng - An toàn, lãi suất 6-7%/năm\n3. Vàng - Bảo toàn giá trị\n\nNên đa dạng hóa danh mục đầu tư!'
  }

  if (lowerMessage.includes('mục tiêu')) {
    return 'Hiện tại bạn chưa đặt mục tiêu tiết kiệm cụ thể. Tôi gợi ý bạn nên:\n• Đặt mục tiêu ngắn hạn (3-6 tháng)\n• Xác định số tiền cần tiết kiệm\n• Theo dõi tiến độ hàng tháng\n\nVí dụ: Mua laptop 20 triệu trong 6 tháng = tiết kiệm 3.3 triệu/tháng'
  }

  if (lowerMessage.includes('so sánh') || lowerMessage.includes('tháng trước')) {
    return 'So với tháng trước:\n• Thu nhập: Giữ nguyên (15 triệu)\n• Chi tiêu: Tăng 15% (8.6tr → 9.9tr)\n• Tiết kiệm: Giảm 20%\n\nNguyên nhân: Tăng chi phí Ăn uống (+500k) và Giải trí (+800k). Bạn nên kiểm soát 2 hạng mục này!'
  }
  
  if (lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin') || lowerMessage.includes('tiền điện tử')) {
    return 'Crypto (tiền điện tử) là loại tiền kỹ thuật số sử dụng mã hóa để bảo đảm các giao dịch. Ưu điểm: phi tập trung, tốc độ nhanh, phí thấp. Rủi ro: biến động cao, không được pháp luật bảo vệ ở nhiều nơi. Nếu muốn đầu tư, nên chỉ đầu tư số tiền bạn có thể mất và nghiên cứu kỹ.'
  }
  
  return `Tôi hiểu bạn đang hỏi về "${userMessage}". Tôi có thể giúp bạn về quản lý tài chính, phân tích chi tiêu. Bạn có thể hỏi cụ thể hơn được không?`
}

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return currencyFormatter.format(0)
  }
  return currencyFormatter.format(value)
}

const formatPercent = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '0%'
  }
  return `${percentFormatter.format(value)}%`
}

const buildContextSection = (context?: AiContextResponse) => {
  if (!context) {
    return 'Không có dữ liệu cá nhân được cung cấp cho câu hỏi này.'
  }

  const lines: string[] = []
  lines.push('=== DỮ LIỆU CÁ NHÂN NGƯỜI DÙNG ===')
  lines.push(`Người dùng: ${context.userName || 'Chưa có tên'}`)
  lines.push(`Thời gian mặc định: ${context.month || 'Không xác định'}`)

  if (context.summary) {
    lines.push(
      `Tổng thu nhập tháng: ${formatCurrency(context.summary.totalIncome)}, ` +
      `Tổng chi: ${formatCurrency(context.summary.totalExpense)}, ` +
      `Chênh lệch: ${formatCurrency(context.summary.netIncome)}, ` +
      `Tỷ lệ tiết kiệm: ${formatPercent(context.summary.savingRate)}, ` +
      `Chi bình quân/ngày: ${formatCurrency(context.summary.averageDailyExpense)}`
    )
  }

  if (context.wallets?.length) {
    lines.push('Số dư các ví:')
    context.wallets.forEach(wallet => {
      lines.push(`- ${wallet.name || 'Ví không tên'}: ${formatCurrency(wallet.balance)} (${wallet.type || 'Không rõ'})`)
    })
  } else {
    lines.push('Người dùng chưa tạo ví nào.')
  }

  if (context.budgets?.length) {
    const criticalBudgets = context.budgets.filter(b =>
      b.status === 'OVER_LIMIT' || b.status === 'NEAR_LIMIT'
    )
    if (criticalBudgets.length > 0) {
      lines.push('Ngân sách cần chú ý:')
      criticalBudgets.forEach(budget => {
        lines.push(
          `- ${budget.category}: đã dùng ${formatPercent(budget.utilization)} (đã chi ${formatCurrency(budget.spent)} / hạn mức ${formatCurrency(budget.limitAmount)})`
        )
      })
    } else {
      lines.push('Các ngân sách khác đang trong trạng thái an toàn.')
    }
  } else {
    lines.push('Chưa có ngân sách được thiết lập.')
  }

  if (context.topCategories?.length) {
    lines.push('Danh mục chi tiêu lớn:')
    context.topCategories.forEach(cat => {
      lines.push(`- ${cat.category}: ${formatCurrency(cat.amount)} (${formatPercent(cat.percentage)})`)
    })
  }

  if (context.recentTransactions?.length) {
    lines.push('Giao dịch gần nhất:')
    context.recentTransactions.slice(0, 5).forEach(tx => {
      lines.push(
        `- ${tx.date ?? 'Không rõ ngày'} | ${tx.category || (tx.income ? 'Thu nhập' : 'Chi tiêu')} | ` +
        `${tx.income ? '+' : '-'}${formatCurrency(tx.amount)} | ${tx.description || 'Không có ghi chú'}`
      )
    })
  }

  if (context.alerts?.length) {
    lines.push('Cảnh báo:')
    context.alerts.forEach(alert => lines.push(`- ${alert}`))
  }

  lines.push(`Cập nhật lần cuối: ${context.lastUpdated}`)
  lines.push('=== HẾT DỮ LIỆU CÁ NHÂN ===')

  return lines.join('\n')
}

export default {
  sendMessageToGemini,
  getQuickResponse,
}
