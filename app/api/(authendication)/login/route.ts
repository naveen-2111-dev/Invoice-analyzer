import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { email, password, token } = await request.json();

    if (!token) {
        return NextResponse.json({ success: false, message: "Token not provided" }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const params = new URLSearchParams();
    params.append("secret", secretKey as string);
    params.append("response", token);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });

    const Verification = await res.json();

    if (!Verification.success || Verification.score < 0.5) {
        return NextResponse.json({ success: false, score: Verification.score }, { status: 400 });
    }

    if (email !== process.env.NEXT_ADMIN_EMAIL) {
        return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    if (password !== process.env.NEXT_ADMIN_PASSWORD) {
        return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const authToken = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
    const cookiesStore = await cookies();

    cookiesStore.set("admin-token", authToken, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({ success: true, score: Verification.score, token: authToken }, { status: 200 });
}