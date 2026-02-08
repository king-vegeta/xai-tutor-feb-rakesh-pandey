from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import uuid
from datetime import datetime, timezone

from app.database import get_db

router = APIRouter(prefix="/emails", tags=["emails"])


# --------------- Pydantic Models ---------------

class Person(BaseModel):
    name: str
    email: str


class Attachment(BaseModel):
    filename: str
    size: str
    url: str


class EmailCreate(BaseModel):
    recipient: Person
    subject: str
    body: str
    attachments: list[Attachment] = []


class EmailUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_archived: Optional[bool] = None
    subject: Optional[str] = None
    body: Optional[str] = None


# --------------- Helpers ---------------

def _row_to_email(row) -> dict:
    """Convert a sqlite3.Row to a dict matching the API contract."""
    return {
        "id": row["id"],
        "sender": {
            "name": row["sender_name"],
            "email": row["sender_email"],
            "avatar": row["sender_avatar"] or "",
        },
        "recipient": {
            "name": row["recipient_name"],
            "email": row["recipient_email"],
        },
        "subject": row["subject"],
        "preview": row["preview"],
        "body": row["body"],
        "date": row["date"],
        "is_read": bool(row["is_read"]),
        "is_archived": bool(row["is_archived"]),
        "attachments": json.loads(row["attachments"]) if row["attachments"] else [],
    }


# --------------- Routes ---------------

@router.get("")
def list_emails(filter: str = "all"):
    """Fetch all emails with optional filter."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()

            if filter == "unread":
                cursor.execute(
                    "SELECT * FROM emails WHERE is_read = 0 ORDER BY date DESC"
                )
            elif filter == "archived":
                cursor.execute(
                    "SELECT * FROM emails WHERE is_archived = 1 ORDER BY date DESC"
                )
            else:
                cursor.execute("SELECT * FROM emails ORDER BY date DESC")

            rows = cursor.fetchall()
            return [_row_to_email(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{email_id}")
def get_email(email_id: str):
    """Fetch a single email by ID."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
            row = cursor.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Email not found")
            return _row_to_email(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("", status_code=201)
def create_email(email: EmailCreate):
    """Create / send a new email."""
    try:
        new_id = str(uuid.uuid4())[:8]
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
        preview = email.body[:80] + "..." if len(email.body) > 80 else email.body
        attachments_json = json.dumps(
            [a.model_dump() for a in email.attachments]
        )

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO emails
                   (id, sender_name, sender_email, sender_avatar,
                    recipient_name, recipient_email,
                    subject, preview, body, date, is_read, is_archived, attachments)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    new_id,
                    "Richard Brown",
                    "richard@example.com",
                    "",
                    email.recipient.name,
                    email.recipient.email,
                    email.subject,
                    preview,
                    email.body,
                    now,
                    1,   # sent emails are read
                    0,
                    attachments_json,
                ),
            )

        return {
            "id": new_id,
            "sender": {
                "name": "Richard Brown",
                "email": "richard@example.com",
                "avatar": "",
            },
            "recipient": {
                "name": email.recipient.name,
                "email": email.recipient.email,
            },
            "subject": email.subject,
            "preview": preview,
            "body": email.body,
            "date": now,
            "is_read": True,
            "is_archived": False,
            "attachments": [a.model_dump() for a in email.attachments],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{email_id}")
def update_email(email_id: str, updates: EmailUpdate):
    """Update an existing email (mark as read, archive, etc.)."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
            row = cursor.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Email not found")

            fields: list[str] = []
            values: list = []

            if updates.is_read is not None:
                fields.append("is_read = ?")
                values.append(int(updates.is_read))
            if updates.is_archived is not None:
                fields.append("is_archived = ?")
                values.append(int(updates.is_archived))
            if updates.subject is not None:
                fields.append("subject = ?")
                values.append(updates.subject)
            if updates.body is not None:
                fields.append("body = ?")
                values.append(updates.body)

            if fields:
                values.append(email_id)
                cursor.execute(
                    f"UPDATE emails SET {', '.join(fields)} WHERE id = ?",
                    values,
                )

            cursor.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
            updated_row = cursor.fetchone()
            return _row_to_email(updated_row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{email_id}", status_code=204)
def delete_email(email_id: str):
    """Delete an email."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM emails WHERE id = ?", (email_id,))
            if cursor.fetchone() is None:
                raise HTTPException(status_code=404, detail="Email not found")
            cursor.execute("DELETE FROM emails WHERE id = ?", (email_id,))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
