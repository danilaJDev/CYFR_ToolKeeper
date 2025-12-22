import type {LucideIcon} from "lucide-react";
import {ArrowLeftRight, LayoutDashboard, MapPin, PanelsTopLeft, Settings, Users, Wrench} from "lucide-react";

export type NavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
};

export const navItems: NavItem[] = [
    {label: "Обзор", href: "/dashboard", icon: LayoutDashboard},
    {label: "Инструменты", href: "/assets", icon: Wrench, badge: "128"},
    {label: "Выдачи", href: "/transfers", icon: ArrowLeftRight},
    {label: "Локации", href: "/locations", icon: MapPin},
    {label: "Команда", href: "/team", icon: Users},
    {label: "Настройки", href: "/settings", icon: Settings},
    {label: "UI Kit", href: "/ui", icon: PanelsTopLeft}
];