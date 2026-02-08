import {
  Email,
  EmailCreatePayload,
  EmailUpdatePayload,
  FilterType,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API Error ${res.status}: ${errorBody}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function fetchEmails(filter: FilterType = "all"): Promise<Email[]> {
  const res = await fetch(`${API_BASE}/emails?filter=${filter}`);
  return handleResponse<Email[]>(res);
}

export async function fetchEmail(id: string): Promise<Email> {
  const res = await fetch(`${API_BASE}/emails/${id}`);
  return handleResponse<Email>(res);
}

export async function createEmail(payload: EmailCreatePayload): Promise<Email> {
  const res = await fetch(`${API_BASE}/emails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Email>(res);
}

export async function updateEmail(
  id: string,
  payload: EmailUpdatePayload
): Promise<Email> {
  const res = await fetch(`${API_BASE}/emails/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Email>(res);
}

export async function deleteEmail(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/emails/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(res);
}
