'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Mail, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

interface AdminSidebarProps {
  adminEmail?: string;
}

export default function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    {
      href: '/admin',
      label: 'لوحة المؤشرات',
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: '/admin/invitations',
      label: 'إدارة الدعوات',
      icon: Mail,
      exact: false
    },
    {
      href: '/admin/settings',
      label: 'إعدادات المنصة',
      icon: Settings,
      exact: false
    }
  ];

  const isActive = (linkHref: string, exact: boolean) => {
    if (exact) return pathname === linkHref;
    return pathname.startsWith(linkHref);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/admin-login';
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. Mobile Top Navigation Bar */}
      {/* ========================================================= */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#1E160D] text-white px-4 py-3 border-b border-[#3D2C1C] flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="القائمة"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <img 
              src="/assets/branding/daawati-logo.jpg" 
              alt="Daawati" 
              className="w-7 h-7 rounded-lg object-cover border border-[#DFBA73]/50" 
            />
            <span className="font-extrabold text-base tracking-tight text-[#FAF0D7]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
              دعوتي • الإدارة
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#DFBA73] text-xs font-bold flex items-center gap-1 transition-colors"
            title="معاينة الموقع"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">الموقع</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-200 text-xs transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ========================================================= */}
      {/* 2. Sidebar (Fixed on Desktop, Slide-over Drawer on Mobile) */}
      {/* ========================================================= */}
      <aside 
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 bg-[#1A1209] text-white flex flex-col justify-between border-l border-[#2E2012] shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-[#2E2012] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-[#8C6D38] via-[#DFBA73] to-[#8C6D38] shadow-sm">
                <img 
                  src="/assets/branding/daawati-logo.jpg" 
                  alt="Daawati Logo" 
                  className="w-10 h-10 rounded-[14px] object-cover" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-[#FAF0D7] tracking-tight leading-tight" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                  دعوتي Daawati
                </span>
                <span className="text-[10px] text-[#C5A059] font-bold tracking-wider mt-0.5">
                  لوحة الإدارة والتحكم ⚜️
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-stone-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-[#8C6D38] to-[#5C4520] text-white shadow-md shadow-[#8C6D38]/30'
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-[#FAF0D7]' : 'text-[#C5A059]'}`} />
                    <span>{link.label}</span>
                  </div>
                  {active && <ChevronLeft className="w-4 h-4 text-[#FAF0D7]" />}
                </Link>
              );
            })}
          </nav>

          {/* Quick Shortcuts */}
          <div className="px-4 py-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-[11px] font-bold text-stone-400 block">روابط سريعة</span>
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between text-xs font-bold text-[#DFBA73] hover:text-[#FAF0D7] transition-colors"
              >
                <span>معاينة واجهة الموقع</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Admin Info & Logout */}
        <div className="p-4 border-t border-[#2E2012] bg-[#140E07]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-stone-200 truncate">
                {adminEmail || 'مدير النظام'}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                متصل الآن
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-red-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
