"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Sparkles, BookOpen, User } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/charms", icon: Sparkles, label: "Charms" },
  { href: "/about", icon: BookOpen, label: "About" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive ? "text-purple-400 bg-purple-400/10" : "text-white/60 hover:text-white/80"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
