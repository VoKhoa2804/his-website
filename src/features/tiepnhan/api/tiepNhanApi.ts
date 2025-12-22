import { api } from "@/api"
import type { TiepNhanRequest, TiepNhanResponse } from "../model/tiepNhanTypes"

type ApiConfig = {
  baseUrl: string
}

const defaultConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_TIEPNHAN_API_BASE_URL ?? "",
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
  return { baseUrl }
}

export const tiepNhanApi = {
  async createTiepNhan(data: TiepNhanRequest, config?: Partial<ApiConfig>): Promise<TiepNhanResponse> {
    const resolved = resolveConfig(config)
    const result = await api.post<TiepNhanResponse>("/api/hosokhams/createhosokham", data, {
      baseURL: resolved.baseUrl,
    })

    if (!result.is_succeeded || result.code !== 200) {
      throw new TiepNhanApiError(result.message || `API error! code: ${result.code}`, result.code)
    }
    return result
  },
}
