import { ClipboardList, FolderUp, LucideIcon } from "lucide-react";

export interface SidebarComponentType {
    id: number;
    title: string;
    icon: LucideIcon;
    url: string;
}

export const SidebarComponents: SidebarComponentType[] = [
    {
        id: 1,
        title: "Upload",
        icon: FolderUp,
        url: "/upload"
    },
    {
        id: 2,
        title: "Reports",
        icon: ClipboardList,
        url: "/reports"
    },
]