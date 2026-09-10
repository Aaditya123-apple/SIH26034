const ACCESS_TOKEN_KEY = "legal-metrology-access-token"

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}
