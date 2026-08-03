const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  path: string,
  options: { method?: string; token?: string; body?: unknown } = {},
): Promise<T> {
  const { method = 'GET', token, body } = options
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(
      `Não foi possível conectar à API em ${API_BASE_URL}. Verifique se ela está rodando.`,
    )
  }

  if (!response.ok) {
    let message = `A API retornou um erro (${response.status}).`
    try {
      const errorBody = (await response.json()) as {
        message?: string
        error?: string
      }
      message = errorBody.message ?? errorBody.error ?? message
    } catch {}
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export type ChatFaqRef = {
  id: number
  question: string
  category: string
}

export type ChatApiResponse =
  | { matched: true; answer: string; faq: ChatFaqRef }
  | { matched: false; answer: null; message: string }

export function askQuestion(question: string): Promise<ChatApiResponse> {
  return request<ChatApiResponse>('/chat', {
    method: 'POST',
    body: { question },
  })
}

export type LoginResponse = { token: string }

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export type Faq = {
  id: number
  question: string
  answer: string
  category: string
  createdAt: string
}

export type CreateFaqInput = {
  question: string
  answer: string
  category: string
}
export type UpdateFaqInput = Partial<CreateFaqInput>

export function listFaqs(token: string): Promise<Faq[]> {
  return request<Faq[]>('/faq', { token })
}

export function createFaq(token: string, input: CreateFaqInput): Promise<Faq> {
  return request<Faq>('/faq', { method: 'POST', token, body: input })
}

export function updateFaq(
  token: string,
  id: number,
  input: UpdateFaqInput,
): Promise<Faq> {
  return request<Faq>(`/faq/${id}`, { method: 'PATCH', token, body: input })
}

export function deleteFaq(token: string, id: number): Promise<void> {
  return request<void>(`/faq/${id}`, { method: 'DELETE', token })
}

export type AnalyticsTopQuestion = {
  faqId: number
  question: string
  category: string
  count: number
}

export type AnalyticsUnanswered = {
  question: string
  count: number
  lastAskedAt: string
}

export type AnalyticsByCategory = { category: string; count: number }

export type AnalyticsTimelinePoint = { date: string; count: number }

export type AnalyticsDashboard = {
  totalInteractions: number
  totalMatched: number
  totalUnmatched: number
  matchRate: number
  topQuestions: AnalyticsTopQuestion[]
  unanswered: AnalyticsUnanswered[]
  byCategory: AnalyticsByCategory[]
  timeline: AnalyticsTimelinePoint[]
}

export type AnalyticsParams = {
  topLimit?: number
  unansweredLimit?: number
  timelineDays?: number
}

export function getAnalytics(
  token: string,
  params: AnalyticsParams = {},
): Promise<AnalyticsDashboard> {
  const search = new URLSearchParams()
  if (params.topLimit != null) search.set('topLimit', String(params.topLimit))
  if (params.unansweredLimit != null)
    search.set('unansweredLimit', String(params.unansweredLimit))
  if (params.timelineDays != null)
    search.set('timelineDays', String(params.timelineDays))
  const qs = search.toString()
  return request<AnalyticsDashboard>(`/analytics${qs ? `?${qs}` : ''}`, {
    token,
  })
}
