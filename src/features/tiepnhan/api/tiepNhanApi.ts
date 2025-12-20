import type { TiepNhanRequest, TiepNhanResponse } from "../model/tiepNhanTypes"

type ApiConfig = {
  baseUrl: string
  token?: string
}

const defaultConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_TIEPNHAN_API_BASE_URL ?? "",
  token: import.meta.env.VITE_TIEPNHAN_API_TOKEN,
}

export class TiepNhanApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = "TiepNhanApiError"
    this.status = status
  }
}

function resolveConfig(overrides?: Partial<ApiConfig>): ApiConfig {
  const baseUrl = overrides?.baseUrl ?? defaultConfig.baseUrl
  if (!baseUrl) {
    throw new TiepNhanApiError("Missing VITE_TIEPNHAN_API_BASE_URL", 500)
  }
  return {
    baseUrl,
    token: overrides?.token ?? defaultConfig.token,
  }
}

function buildHeaders(token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function parseResponse(response: Response): Promise<TiepNhanResponse> {
  const payload = await response.json().catch(() => {
    throw new TiepNhanApiError("Không đọc được phản hồi từ máy chủ", response.status)
  })

  if (!response.ok) {
    const status = response.status
    const message = payload?.message || response.statusText || "Yêu cầu thất bại"
    if (status === 401 || status === 403) {
      throw new TiepNhanApiError("Phiên đăng nhập đã hết hạn hoặc không hợp lệ", status)
    }
    throw new TiepNhanApiError(message, status)
  }

  return payload as TiepNhanResponse
}

export const tiepNhanApi = {
  async createTiepNhan(data: TiepNhanRequest, config?: Partial<ApiConfig>): Promise<TiepNhanResponse> {
    const resolved = resolveConfig(config)
    const response = await fetch(`${resolved.baseUrl}/api/hosokhams/createhosokham`, {
      method: "POST",
      headers: buildHeaders(resolved.token),
      body: JSON.stringify(data),
    })

    const result = await parseResponse(response)
    if (!result.is_succeeded || result.code !== 200) {
      throw new TiepNhanApiError(result.message || `API error! code: ${result.code}`, result.code)
    }
    return result
  },
}
