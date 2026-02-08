"use client";

import React, { useState } from "react";

interface NewMessageModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (recipientName: string, recipientEmail: string, subject: string, body: string) => void;
}

export default function NewMessageModal({
  open,
  onClose,
  onSend,
}: NewMessageModalProps) {
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  if (!open) return null;

  const handleSend = () => {
    if (!recipientEmail.trim() || !subject.trim() || !body.trim()) return;
    onSend(recipientName || recipientEmail.split("@")[0], recipientEmail, subject, body);
    setRecipientName("");
    setRecipientEmail("");
    setSubject("");
    setBody("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">New Message</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400 font-medium w-12">To:</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 border-b border-gray-100 focus:border-orange-400 focus:outline-none py-1.5"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400 font-medium w-12">Name:</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Recipient name"
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 border-b border-gray-100 focus:border-orange-400 focus:outline-none py-1.5"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400 font-medium w-12">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 border-b border-gray-100 focus:border-orange-400 focus:outline-none py-1.5"
            />
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            rows={8}
            className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none leading-relaxed mt-2 border border-gray-100 rounded-lg p-3"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" title="Attach file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" title="Emoji">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSend}
              disabled={!recipientEmail.trim() || !subject.trim() || !body.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
