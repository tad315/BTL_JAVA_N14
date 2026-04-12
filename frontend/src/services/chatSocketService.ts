type ConnectionState = 'connecting' | 'connected' | 'disconnected'

interface ChatSocketRequest {
  requestId: string
  userId: number
  message: string
}

interface ChatSocketResponse {
  requestId: string
  message?: string
  error?: string
  timestamp?: string
}

type StatusListener = (status: ConnectionState) => void

const WS_URL = 'ws://localhost:8080/ws/chat'
const RECONNECT_DELAY_MS = 2000

class ChatSocketService {
  private socket: WebSocket | null = null
  private connectPromise: Promise<void> | null = null
  private reconnectTimer: number | null = null
  private manuallyClosed = false
  private status: ConnectionState = 'disconnected'
  private statusListeners = new Set<StatusListener>()
  private pendingRequests = new Map<
    string,
    { resolve: (message: string) => void; reject: (error: Error) => void }
  >()

  subscribeStatus(listener: StatusListener) {
    this.statusListeners.add(listener)
    listener(this.status)

    return () => {
      this.statusListeners.delete(listener)
    }
  }

  async sendMessage(message: string, userId = 1): Promise<string> {
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      throw new Error('Tin nhắn không được để trống.')
    }

    await this.ensureConnected()

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Không thể kết nối đến máy chủ chat.')
    }

    const requestId = this.createRequestId()
    const payload: ChatSocketRequest = {
      requestId,
      userId,
      message: trimmedMessage,
    }

    return new Promise<string>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject })

      try {
        this.socket?.send(JSON.stringify(payload))
      } catch (error) {
        this.pendingRequests.delete(requestId)
        reject(error instanceof Error ? error : new Error('Gửi tin nhắn thất bại.'))
      }
    })
  }

  private async ensureConnected(): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return
    }

    if (this.connectPromise) {
      return this.connectPromise
    }

    this.manuallyClosed = false
    this.setStatus('connecting')

    this.connectPromise = new Promise<void>((resolve, reject) => {
      const socket = new WebSocket(WS_URL)
      this.socket = socket

      socket.onopen = () => {
        this.setStatus('connected')
        this.connectPromise = null
        resolve()
      }

      socket.onmessage = (event) => {
        this.handleMessage(event.data)
      }

      socket.onerror = () => {
        if (this.connectPromise) {
          this.connectPromise = null
          reject(new Error('Không thể kết nối đến máy chủ chat.'))
        }
      }

      socket.onclose = () => {
        this.socket = null
        this.connectPromise = null
        this.setStatus('disconnected')
        this.rejectPendingRequests(new Error('Kết nối chat đã bị ngắt.'))

        if (!this.manuallyClosed) {
          this.scheduleReconnect()
        }
      }
    })

    return this.connectPromise
  }

  private handleMessage(rawMessage: string) {
    let response: ChatSocketResponse

    try {
      response = JSON.parse(rawMessage) as ChatSocketResponse
    } catch {
      return
    }

    const pendingRequest = this.pendingRequests.get(response.requestId)

    if (!pendingRequest) {
      return
    }

    this.pendingRequests.delete(response.requestId)

    if (response.error) {
      pendingRequest.reject(new Error(response.error))
      return
    }

    pendingRequest.resolve(response.message ?? '')
  }

  private scheduleReconnect() {
    if (this.reconnectTimer !== null) {
      return
    }

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null
      this.ensureConnected().catch(() => {
        this.scheduleReconnect()
      })
    }, RECONNECT_DELAY_MS)
  }

  private rejectPendingRequests(error: Error) {
    this.pendingRequests.forEach(({ reject }) => reject(error))
    this.pendingRequests.clear()
  }

  private setStatus(status: ConnectionState) {
    this.status = status
    this.statusListeners.forEach((listener) => listener(status))
  }

  private createRequestId() {
    return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
}

const chatSocketService = new ChatSocketService()

export type { ConnectionState }
export default chatSocketService
