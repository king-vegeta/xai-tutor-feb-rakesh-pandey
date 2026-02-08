export interface Person {
  name: string;
  email: string;
  avatar?: string;
}

export interface Attachment {
  filename: string;
  size: string;
  url: string;
}

export interface Email {
  id: string;
  sender: Person;
  recipient: Person;
  subject: string;
  preview: string;
  body: string;
  date: string;
  is_read: boolean;
  is_archived: boolean;
  attachments: Attachment[];
}

export interface EmailCreatePayload {
  recipient: { name: string; email: string };
  subject: string;
  body: string;
  attachments?: Attachment[];
}

export interface EmailUpdatePayload {
  is_read?: boolean;
  is_archived?: boolean;
  subject?: string;
  body?: string;
}

export type FilterType = "all" | "unread" | "archived";
