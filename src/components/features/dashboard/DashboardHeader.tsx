"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "@/components/features/alerts/NotificationDropdown";

interface Alert {
  id: string;
  type: string;
  asset: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface DashboardHeaderProps {
  userName: string;
  orgName: string;
  alerts: Alert[];
  unreadCount: number;
}

/**
 * Dashboard top header bar.
 * Shows org name, notification bell (with unread badge), and user menu.
 */
export default function DashboardHeader({
  userName,
  orgName,
  alerts,
  unreadCount,
}: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-6">
      <p className="text-sm font-medium text-foreground">{orgName}</p>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <NotificationDropdown alerts={alerts} unreadCount={unreadCount} />

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
            aria-label="User menu"
          >
            <User size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-border bg-white p-1.5 shadow-md">
              <div className="px-3 py-2">
                <p className="truncate text-xs font-medium text-foreground">
                  {userName}
                </p>
              </div>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
