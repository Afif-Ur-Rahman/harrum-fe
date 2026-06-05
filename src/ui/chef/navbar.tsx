"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { ClipboardList, Utensils, CircleUser } from "lucide-react";

const SECTIONS = [
  {
    label: "Work",
    items: [
      { href: "/chef/orders", label: "Orders", icon: ClipboardList },
      { href: "/chef/menu", label: "Menu", icon: Utensils },
    ],
  },
  {
    label: "Account",
    items: [{ href: "/chef/profile", label: "Profile", icon: CircleUser }],
  },
];

export default function ChefSidebar() {
  return <AppSidebar sections={SECTIONS} homeHref="/chef/orders" roleName="Chef" />;
}
