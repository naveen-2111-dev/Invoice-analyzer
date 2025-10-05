export async function Logout() {
    const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Logout failed");
    return res.json();
}