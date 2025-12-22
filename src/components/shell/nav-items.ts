import type {LucideIcon} from "lucide-react";
import {ArrowLeftRight, LayoutDashboard, MapPin, PanelsTopLeft, Settings, Users, Wrench} from "lucide-react";

export type NavItem = {
    key: "dashboard" | "assets" | "transfers" | "locations" | "team" | "settings" | "ui";
    href: string; // без локали
    icon: LucideIcon;
};

export const navItems: NavItem[] = [
    {key: "dashboard", href: "/dashboard", icon: LayoutDashboard},
    {key: "assets", href: "/assets", icon: Wrench},
    {key: "transfers", href: "/transfers", icon: ArrowLeftRight},
    {key: "locations", href: "/locations", icon: MapPin},
    {key: "team", href: "/team", icon: Users},
    {key: "settings", href: "/settings", icon: Settings},
    {key: "ui", href: "/ui", icon: PanelsTopLeft}
];