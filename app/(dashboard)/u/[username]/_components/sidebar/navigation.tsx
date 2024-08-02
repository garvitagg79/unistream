"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Fullscreen, KeyRound, MessageSquare, Users } from "lucide-react";
import { NavItem, NavItemSkeleton } from "./nav-item";

export const Navigation = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return (
      <ul className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <NavItemSkeleton key={i} />
        ))}
      </ul>
    );
  }

  const username = user.username;

  const routes = [
    {
      label: "Stream",
      href: `/u/${username}`,
      icon: Fullscreen,
    },
    {
      label: "Keys",
      href: `/u/${username}/keys`,
      icon: KeyRound,
    },
    {
      label: "Chat",
      href: `/u/${username}/chat`,
      icon: MessageSquare,
    },
    {
      label: "Community",
      href: `/u/${username}/community`,
      icon: Users,
    },
  ];

  return (
    <ul className="space-y-2 px-2 pt-4 lg:pt-0">
      {routes.map((route) => {
        return (
          <NavItem
            key={route.href}
            label={route.label}
            icon={route.icon}
            href={route.href}
            isActive={pathname === route.href}
          />
        );
      })}
    </ul>
  );
};
