import type {LucideIcon} from "lucide-react";
import {ArrowLeftRight, LayoutDashboard, MapPin, PanelsTopLeft, Settings, Users, Wrench} from "lucide-react";

export type NavItem = {
    key: "Обзор" | "Активы" | "Перемещения" | "Локации" | "Команда" | "Настройки" | "UI";
    href: string; // без локали
    icon: LucideIcon;
};

export const navItems: NavItem[] = [
    {key: "Обзор", href: "/dashboard", icon: LayoutDashboard},
    {key: "Активы", href: "/assets", icon: Wrench},
    {key: "Перемещения", href: "/transfers", icon: ArrowLeftRight},
    {key: "Локации", href: "/locations", icon: MapPin},
    {key: "Команда", href: "/team", icon: Users},
    {key: "Настройки", href: "/settings", icon: Settings},
    {key: "UI", href: "/ui", icon: PanelsTopLeft}
];
