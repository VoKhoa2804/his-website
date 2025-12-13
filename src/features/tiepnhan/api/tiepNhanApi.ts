import type { TiepNhanRequest, TiepNhanResponse } from '../model/tiepNhanTypes'

const API_BASE_URL = 'http://113.161.48.48:4003/api'
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjNiMGU5NWM1LWE4MmMtNDlhYy1iNmY4LTIwZDkxMzAzNmY3YiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJzYSIsImlkIjoiM2IwZTk1YzUtYTgyYy00OWFjLWI2ZjgtMjBkOTEzMDM2ZjdiIiwibGFzdE5hbWUiOiJBZG1pbiIsImZpcnN0TmFtZSI6IlN5c3RlbSIsImFwcE5hbWUiOiJQYXRpZW50cyIsInRva2VuS2V5IjoiZmI4ZDY4NDItNDc1Zi00NGIzLWFmMDUtM2MyZjI0OTkxZTQ3MjAyNTEyMTMxNjMzIiwicm9sZXMiOiIzNjE4YWFiMS04MzdhLTQyOTktOWQ1ZS0zZDliMjIxOTc5YzM7MzYxOGFhYjEtODM3YS00Mjk5LTlkNWUtM2Q5YjIyMTk3OWM0OzU1ZDg2OTJjLWJjZDYtNDRiOC05Y2NiLWQ4NDFhMDE1MjYzYzs4NGIxN2QxYS1iMDU4LTQ4OTYtYmYxMC1hZjk4YTdkYTBiM2U7YmExNWIzOTAtM2I5Yy00MTMxLWEzNWYtZTY3MGMyZDE1NWJhO2JhY2FmNmU5LTYzM2EtNDg1MC1iODlhLWZhMjE5OWVjMDY2ZTtiY2UwNDhjYy1kMjcwLTQ5ZTItODlhOS00NWIxYzRhNmRkYmY7ZDFhZDk3MTYtYmI1NC00Mzk3LThmZWQtZmIwODM2YzM4MTk0O2RmNTNmYmQwLTRiOWItNDI4Yi1hMmZkLWM5NjlmYjUyNmU2NztlZDJkMTBjYi1iMjA2LTQ1YzctOGU0Yi0zZTQ4N2U3ZTRiMTA7ZWQyZDEwY2ItYjIwNi00NWM3LThlNGItM2U0ODdlN2U0YjE5IiwicGVybWlzc2lvbnMiOiIrUVc3bE9sMUJEZlN0MWlkaVQ0RXozZWI1SUFKTUV3WlhHTmpnL3UvbFNGQzlJemk4NEh1UXoyTU9ud2lFQk1qU2tPZTZ6UFlYSjk1S1pIQXBPZ1Ywd2JpS2xxQUxGR0M1YVhBdmRuNHFuOHVQckVnOFJpNGRsK21tZGNYWnJIalhaaE1uZUxaK2puRnYrN2N0dFFMOWdOazFOaGEyZGNYaHEyR1hsVmlLOXZpZ3pKeTRBU0ovMFk5bHNkWnJaQ3pZWi93R0lURk9PYjJQMTlaTjdXZnlrVE5vcmhaZW9PclREQXdSazd6OWZjUy9BbVRZb3ZSOUlKNzhUSEdHaEo2akZjNkpwSVlLazM4TUdBZTgyUlBNVEtvTjZhMjQxZnU0T1QrZFZmUzZHRHlnb2VhTDRWdjFVa2MwaWZVMFVROUZnNFZQeEdBN2F1aUpIUHI4TlZ6cjFFSzRSWGcvMVYxVHVmNEdQbGJycU04SzVoSHJLWmRUMG56RDRrTVp1SVVmL3hOL1Q1SFN6d0tZMk05V1M2enVya2xoWWxtcW1tcFhuK1pNdGN0UTd4azRVajFlcnBkSklpMVhuY3BQNGxieWdteHdMNkJQc1dkd1BuMkF6d2NXYXpJaWhXcS9vRSs1SUpDQ1k5Ry9CRDFzdDU4dU15UEFsYjAvaHN6dks3T3JDVHdQcGFWSGsrUDRuNnBUdElLTXp2RnVkVE5qVkdqUWwzMUJLbWhNdHM9IiwibmJmIjoxNzY1NjE4NDMyLCJleHAiOjE3NjU2NTE0MzIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMSIsImF1ZCI6IndpSGVscGVyIn0.1aDktQkc05C21c2eMzCTq5OW_sMnVxt5tG9rOSKwLR0'

export const tiepNhanApi = {
  /**
   * Create new patient registration (Tiep Nhan)
   */
  async createTiepNhan(data: TiepNhanRequest): Promise<TiepNhanResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/kbhosos`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result: TiepNhanResponse = await response.json()
      
      // API returns is_succeeded flag instead of success
      if (!result.is_succeeded || result.code !== 200) {
        throw new Error(result.message || `API error! code: ${result.code}`)
      }

      return result
    } catch (error) {
      console.error('Error creating tiep nhan:', error)
      
      // Return error response matching API structure
      return {
        code: 500,
        is_succeeded: false,
        message: error instanceof Error ? error.message : 'Failed to create registration',
      }
    }
  },
}
