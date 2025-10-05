"use client";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { TreeDeciduous } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";

const Login = () => {

    const router = useRouter();

    const [state, setState] = useState({
        email: "",
        password: ""
    })
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("click");

        if (!executeRecaptcha) {
            toast.error("Recaptcha not yet available");
            return;
        }

        const token = await executeRecaptcha("login");

        const payload = ({
            email: state.email,
            password: state.password,
            token
        });

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                toast.success("Login successful");
                router.push("/");
            }
            else
                toast.error("Recaptcha verification failed");
        } else {
            const error = await response.json();
            toast.error(`Login failed: ${error.message}`);
        }
    }

    console.log(state);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-200">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center gap-2">
                            <h1>ABC india pvt. ltd.</h1>
                            <TreeDeciduous />
                        </div>
                    </CardTitle>
                    <CardDescription>
                        Enter Admin email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    onChange={(e) => setState({ ...state, email: e.target.value })}
                                    value={state.email}
                                    autoComplete="email"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    onChange={(e) => setState({ ...state, password: e.target.value })}
                                    value={state.password}
                                    required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full cursor-pointer" onClick={handleLogin}>
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login