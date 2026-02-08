"use client";

import React from "react";
import { Email } from "@/lib/types";

interface EmailDetailProps {
  email: Email;
  onMarkRead: (id: string, read: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

/* ──── helpers ──── */

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
}

function fileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="text-orange-500"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

/* ──── component ──── */

export default function EmailDetail({
  email,
  onMarkRead,
  onArchive,
  onDelete,
}: EmailDetailProps) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {getInitials(email.sender.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                {email.sender.name}
              </span>
              <span className="text-xs text-gray-400">
                &lt;{email.sender.email}&gt;
              </span>
            </div>
            <p className="text-xs text-gray-400">
              To: {email.recipient.name} &lt;{email.recipient.email}&gt;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-3">
            {formatFullDate(email.date)}
          </span>
          {/* Action icons */}
          <button
            onClick={() => onMarkRead(email.id, !email.is_read)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title={email.is_read ? "Mark as unread" : "Mark as read"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={email.is_read ? "none" : "currentColor"} stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
          </button>
          <button
            onClick={() => onArchive(email.id)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Archive"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="21 8 21 21 3 21 3 8" />
              <rect x="1" y="3" width="22" height="5" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          </button>
          <button
            onClick={() => {}}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Forward"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(email.id)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="More options"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Subject */}
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          {email.subject}
        </h2>

        {/* Body content */}
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {email.body}
        </div>

        {/* Attachments */}
        {email.attachments.length > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Attachments ({email.attachments.length})
            </p>
            <div className="flex flex-wrap gap-3">
              {email.attachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors group"
                >
                  {fileIcon()}
                  <div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                      {att.filename}
                    </p>
                    <p className="text-xs text-gray-400">{att.size}</p>
                  </div>
                  <button className="ml-3 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
