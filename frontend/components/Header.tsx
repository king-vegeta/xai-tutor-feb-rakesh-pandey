"use client";

import React from "react";

interface HeaderProps {
  onNewMessage: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({
  onNewMessage,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-[56px] px-6 bg-white border-b border-gray-200 flex-shrink-0">
      {/* Left: page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-800">Emails</h1>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
          1-8 of 8
        </span>
      </div>

      {/* Right: search + new message */}
      <div className="flex items-center gap-3">
        {/* Search email input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search Email"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 w-[220px] text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* New message button */}
        <button
          onClick={onNewMessage}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Message
        </button>
      </div>
    </header>
  );
}
