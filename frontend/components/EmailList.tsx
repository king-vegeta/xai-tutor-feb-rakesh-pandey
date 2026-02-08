"use client";

import React from "react";
import { Email, FilterType } from "@/lib/types";

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (email: Email) => void;
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  searchQuery: string;
  onArchive: (id: string) => void;
}

/* ──── helpers ──── */

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-red-500 to-orange-600",
  "from-teal-500 to-emerald-600",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ──── component ──── */

export default function EmailList({
  emails,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
  searchQuery,
  onArchive,
}: EmailListProps) {
  /* local search filter */
  const filteredEmails = emails.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.sender.name.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.preview.toLowerCase().includes(q)
    );
  });

  const tabs: { label: string; value: FilterType }[] = [
    { label: "All Mails", value: "all" },
    { label: "Unread", value: "unread" },
    { label: "Archive", value: "archived" },
  ];

  return (
    <div className="flex flex-col w-[340px] min-w-[340px] border-r border-gray-200 bg-white h-full">
      {/* Filter tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={`flex-1 py-3 text-[13px] font-medium transition-colors relative ${
              filter === tab.value
                ? "text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {filter === tab.value && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            No emails found
          </div>
        )}
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelect(email)}
            className={`group flex gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-50 transition-colors ${
              selectedId === email.id
                ? "bg-orange-50/70 border-l-2 border-l-orange-500"
                : "hover:bg-gray-50 border-l-2 border-l-transparent"
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor(
                  email.sender.name
                )} flex items-center justify-center text-white text-xs font-bold`}
              >
                {getInitials(email.sender.name)}
              </div>
              {/* Unread indicator */}
              {!email.is_read && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`text-[13px] truncate ${
                    !email.is_read
                      ? "font-semibold text-gray-900"
                      : "font-medium text-gray-700"
                  }`}
                >
                  {email.sender.name}
                </span>
                <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                  {formatDate(email.date)}
                </span>
              </div>
              <p
                className={`text-[13px] truncate mb-0.5 ${
                  !email.is_read
                    ? "font-medium text-gray-800"
                    : "text-gray-600"
                }`}
              >
                {email.subject}
              </p>
              <p className="text-[12px] text-gray-400 truncate">
                {email.preview}
              </p>
            </div>

            {/* Hover actions */}
            <div className="flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(email.id);
                }}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                title="Archive"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                title="Forward"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                title="More"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
