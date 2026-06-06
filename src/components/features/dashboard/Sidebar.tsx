"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  TrendingUp,
  Route,
  Bell,
  ShieldCheck,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview",        href: "/dashboard",            icon: LayoutDashboard },
  { label: "Stablecoin SDK",  href: "/dashboard/sdk",        icon: Coins           },
  { label: "FX Intelligence", href: "/dashboard/fx",         icon: TrendingUp      },
  { label: "Smart Routing",   href: "/dashboard/routing",    icon: Route           },
  { label: "Alerts",          href: "/dashboard/alerts",     icon: Bell            },
  { label: "Compliance",      href: "/dashboard/compliance", icon: ShieldCheck     },
  { label: "Analytics",       href: "/dashboard/analytics",  icon: BarChart3       },
] as const;

/**
 * Dashboard sidebar navigation.
 * Active state derived from pathname — no client state needed.
 * Settings separated at the bottom — distinct from primary navigation.
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-white lg:flex">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-5">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Ledger
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                active
                  ? "bg-foreground/5 text-foreground"
                  : "text-muted hover:bg-foreground/[0.03] hover:text-foreground",
              ].join(" ")}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Settings pinned at bottom */}
      <div className="border-t border-border p-3">
        <Link
          href="/dashboard/settings"
          className={[
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
            pathname.startsWith("/dashboard/settings")
              ? "bg-foreground/5 text-foreground"
              : "text-muted hover:bg-foreground/[0.03] hover:text-foreground",
          ].join(" ")}
        >
          <Settings size={16} strokeWidth={1.5} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
