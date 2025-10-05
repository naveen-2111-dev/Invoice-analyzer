
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
const adminEmail = process.env.NEXT_ADMIN_EMAIL;

export async function getAdminProfile() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("admin-token");

        if (!token) {
            return { isAdminLogin: false };
        }

        const decoded = jwt.verify(token.value, SECRET_KEY!);
        const decodedJson = JSON.parse(JSON.stringify(decoded));

        if (decodedJson.email && decodedJson.email === adminEmail) {
            return { isAdminLogin: true };
        } else {
            return { isAdminLogin: false };
        }
    } catch (error) {
        console.error("Token verification failed:", error);
        return { isAdminLogin: false };
    }
}
