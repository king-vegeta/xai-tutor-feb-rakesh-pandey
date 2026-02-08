"use client";

import React, { useState } from "react";
import { Email } from "@/lib/types";

interface ReplyComposerProps {
  email: Email;
  onSend: (body: string, recipientEmail: string, recipientName: string, subject: string) => void;
}

export default function ReplyComposer({ email, onSend }: ReplyComposerProps) {
  const [body, setBody] = useState("");
  const [expanded, setExpanded] = useState(true);

  const handleSend = () => {
    if (!body.trim()) return;
    onSend(
      body,
      email.sender.email,
      email.sender.name,
      `Re: ${email.subject}`
    );
    setBody("");
  };

  if (!expanded) {
    return (
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6" />
          </svg>
          Reply to {email.sender.name}
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-white flex-shrink-0">
      {/* To field */}
      <div className="flex items-center gap-2 px-6 py-2.5 border-b border-gray-100">
        <span className="text-xs text-gray-400 font-medium">To:</span>
        <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2.5 py-1">
          <span className="text-xs font-medium text-gray-700">
            {email.sender.name}
          </span>
          <span className="text-[11px] text-gray-400">
            &lt;{email.sender.email}&gt;
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setExpanded(false)}
            className="p-1 rounded hover:bg-gray-100 text-gray-400"
            title="Collapse"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <button
            className="p-1 rounded hover:bg-gray-100 text-gray-400"
            title="Expand"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body textarea */}
      <div className="px-6 py-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your reply..."
          rows={4}
          className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none leading-relaxed"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-2.5 border-t border-gray-100">
        <div className="flex items-center gap-1">
          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!body.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send Now
          </button>
          {/* Schedule */}
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Schedule send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Attach */}
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Attach file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          {/* Emoji */}
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Emoji">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </button>
          {/* Template */}
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Template">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </button>
          {/* More */}
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="More options">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
