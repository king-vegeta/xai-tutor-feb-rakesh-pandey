"use client";

import { useEffect, useState, useCallback } from "react";
import { Email, FilterType } from "@/lib/types";
import {
  fetchEmails,
  updateEmail,
  createEmail,
  deleteEmail,
} from "@/lib/api";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EmailList from "@/components/EmailList";
import EmailDetail from "@/components/EmailDetail";
import ReplyComposer from "@/components/ReplyComposer";
import NewMessageModal from "@/components/NewMessageModal";

export default function Home() {
  /* ────── state ────── */
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ────── data fetching ────── */
  const loadEmails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEmails(filter);
      setEmails(data);

      // Keep selected email updated if still in list
      if (selectedEmail) {
        const updated = data.find((e) => e.id === selectedEmail.id);
        if (updated) setSelectedEmail(updated);
        else if (data.length > 0) setSelectedEmail(data[0]);
        else setSelectedEmail(null);
      } else if (data.length > 0) {
        setSelectedEmail(data[0]);
      }
    } catch (err) {
      console.error("Failed to load emails:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  /* ────── handlers ────── */
  const handleSelectEmail = async (email: Email) => {
    setSelectedEmail(email);
    // auto-mark as read
    if (!email.is_read) {
      try {
        const updated = await updateEmail(email.id, { is_read: true });
        setEmails((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
        setSelectedEmail(updated);
      } catch (err) {
        console.error("Failed to mark email as read:", err);
      }
    }
  };

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      const updated = await updateEmail(id, { is_read: read });
      setEmails((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );
      if (selectedEmail?.id === id) setSelectedEmail(updated);
    } catch (err) {
      console.error("Failed to update email:", err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const email = emails.find((e) => e.id === id);
      const updated = await updateEmail(id, {
        is_archived: !email?.is_archived,
      });
      // Refresh list for the current filter
      await loadEmails();
      if (selectedEmail?.id === id) {
        setSelectedEmail(updated);
      }
    } catch (err) {
      console.error("Failed to archive email:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmail(id);
      setEmails((prev) => prev.filter((e) => e.id !== id));
      if (selectedEmail?.id === id) {
        const remaining = emails.filter((e) => e.id !== id);
        setSelectedEmail(remaining[0] || null);
      }
    } catch (err) {
      console.error("Failed to delete email:", err);
    }
  };

  const handleReply = async (
    body: string,
    recipientEmail: string,
    recipientName: string,
    subject: string
  ) => {
    try {
      await createEmail({
        recipient: { name: recipientName, email: recipientEmail },
        subject,
        body,
      });
      await loadEmails();
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  const handleNewMessage = async (
    recipientName: string,
    recipientEmail: string,
    subject: string,
    body: string
  ) => {
    try {
      await createEmail({
        recipient: { name: recipientName, email: recipientEmail },
        subject,
        body,
      });
      await loadEmails();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  /* ────── render ────── */
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onNewMessage={() => setNewMessageOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email list */}
          <EmailList
            emails={emails}
            selectedId={selectedEmail?.id ?? null}
            onSelect={handleSelectEmail}
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onArchive={handleArchive}
          />

          {/* Email detail + reply */}
          {loading && !selectedEmail ? (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <svg
                  className="animate-spin"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <p className="text-sm">Loading emails…</p>
              </div>
            </div>
          ) : selectedEmail ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <EmailDetail
                email={selectedEmail}
                onMarkRead={handleMarkRead}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
              <ReplyComposer email={selectedEmail} onSend={handleReply} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="mx-auto mb-3 text-gray-300"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 7L2 7" />
                </svg>
                <p className="text-sm text-gray-400">
                  Select an email to read
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New message modal */}
      <NewMessageModal
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
        onSend={handleNewMessage}
      />
    </div>
  );
}
