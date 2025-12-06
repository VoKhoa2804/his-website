import { cn } from "@/shared/utils/cn"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  FieldContainer,
  FieldLabel,
  FieldDescription,
  FieldMessage,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { useState, useEffect } from "react"
import { toast } from "@/shared/ui/sonner"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { loginThunk, clearError } from "./authSlice"

export function LoginPage({
  onLoginSuccess,
  className,
  ...props
}: React.ComponentProps<"div"> & { onLoginSuccess?: () => void }) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  // Clear Redux error when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  useEffect(() => {
    if (username || password) {
      dispatch(clearError())
    }
  }, [username, password, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!username) {
      setErrors((prev) => ({ ...prev, username: "Username is required" }))
      return
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }))
      return
    }

    try {
      const result = await dispatch(loginThunk({ user_name: username, password })).unwrap()
      
      toast.success("Login successful!", {
        description: `Welcome back, ${result.user.fullName || username}`,
      })
      
      setUsername("")
      setPassword("")
      onLoginSuccess?.()
    } catch (err: any) {
      toast.error("Login failed", {
        description: err || "Please check your credentials and try again",
      })
    }
  }

  return (
     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
            <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="w-full max-w-md">
                <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your credentials below to login to your account
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                    <FieldContainer>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        />
                        {errors.username && <FieldMessage>{errors.username}</FieldMessage>}
                    </FieldContainer>

                    <FieldContainer>
                        <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                        </div>
                        <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                        {(errors.password || error) && (
                        <FieldMessage>{errors.password || error}</FieldMessage>
                        )}
                    </FieldContainer>

                    <FieldContainer>
                        <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                        </Button>
                        <Button variant="outline" type="button" className="w-full">
                        Login with Google
                        </Button>
                        <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <a href="#" className="underline hover:underline-offset-2">
                            Sign up
                        </a>
                        </FieldDescription>
                    </FieldContainer>
                    </div>
                </form>
                </CardContent>
            </Card>
            </div>
        </div>
    </div>
  )
}

