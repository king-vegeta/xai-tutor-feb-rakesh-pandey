"use client";

import React from "react";

/* ──────────────────── icon helpers (inline SVGs) ──────────────────── */

const Icon = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span className={`inline-flex items-center justify-center ${className}`}>
    {children}
  </span>
);

/* ──────────────────── sidebar types ──────────────────── */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/* ──────────────────── component ──────────────────── */

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  if (collapsed) {
    return (
      <aside className="flex flex-col w-[60px] min-w-[60px] bg-white border-r border-gray-200 h-full py-4 items-center">
        {/* Logo */}
        <button
          onClick={onToggle}
          className="mb-6 w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          title="Expand sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col w-[250px] min-w-[250px] bg-white border-r border-gray-200 h-full">
      {/* Top: Logo + collapse */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <span className="font-semibold text-[15px] text-gray-800 tracking-tight">
            CRM Dashboard
          </span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          title="Collapse sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Search shortcut */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-400 border border-gray-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span>Search</span>
          <span className="ml-auto text-[11px] bg-white border border-gray-200 rounded px-1.5 py-0.5">
            ⌘K
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 mt-1">
        <div className="mb-1">
          <SidebarItem icon={<DashboardIcon />} label="Dashboard" />
          <SidebarItem icon={<NotificationIcon />} label="Notifications" badge={12} />
          <SidebarItem icon={<TaskIcon />} label="Tasks" />
          <SidebarItem icon={<CalendarIcon />} label="Calendar" />
          <SidebarItem icon={<WidgetIcon />} label="Widgets" />
        </div>

        {/* Marketing section */}
        <div className="mt-4 mb-1">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Marketing
          </p>
          <SidebarItem icon={<ProductIcon />} label="Product" />
          <SidebarItem icon={<EmailIcon />} label="Emails" active />
          <SidebarItem icon={<IntegrationIcon />} label="Integration" />
          <SidebarItem icon={<ContactsIcon />} label="Contacts" />
        </div>

        {/* Favorite section */}
        <div className="mt-4 mb-1">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Favorite
          </p>
          <SidebarItem icon={<span className="w-2.5 h-2.5 rounded-sm bg-red-500" />} label="Opportunity Stages" />
          <SidebarItem icon={<span className="w-2.5 h-2.5 rounded-sm bg-green-500" />} label="Key Metrics" />
          <SidebarItem icon={<span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />} label="Product Plan" />
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 px-3 pt-2 pb-1">
        <SidebarItem icon={<SettingsIcon />} label="Settings" />
        <SidebarItem icon={<HelpIcon />} label="Help & Center" />
      </div>

      {/* User profile */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            RB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              Richard Brown
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              richard@example.com
            </p>
          </div>
        </div>
        {/* Storage indicator */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span>Storage</span>
            <span>6.2 GB of 10 GB</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: "62%" }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────── sidebar list item ──────────────────── */

function SidebarItem({
  icon,
  label,
  active = false,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] cursor-pointer transition-colors ${
        active
          ? "bg-orange-50 text-orange-600 font-medium"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0">{icon}</Icon>
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span className="text-[11px] bg-red-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-medium">
          {badge}
        </span>
      )}
    </div>
  );
}

/* ──────────────────── inline icon components ──────────────────── */

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function NotificationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
function TaskIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function WidgetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ProductIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  );
}
function IntegrationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 7h3a5 5 0 010 10h-3M9 17H6a5 5 0 010-10h3M8 12h8" />
    </svg>
  );
}
function ContactsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  );
}
