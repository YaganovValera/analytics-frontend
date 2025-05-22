// src/api/auth.ts
export async function login(username: string, password: string) {
    const res = await fetch("/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
  
    if (!res.ok) throw new Error("Login failed")
  
    const data = await res.json()
    localStorage.setItem("access_token", data.access_token)
    localStorage.setItem("refresh_token", data.refresh_token)
    return data
  }
  