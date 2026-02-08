"""
Migration: Create emails table
Version: 002
Description: Creates the emails table with full email fields and seed data
"""

import sqlite3
import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import DATABASE_PATH

MIGRATION_NAME = "002_create_emails_table"

SEED_EMAILS = [
    {
        "id": "1",
        "sender_name": "Jane Doe",
        "sender_email": "jane.doe@business.com",
        "sender_avatar": "",
        "recipient_name": "Richard Brown",
        "recipient_email": "richard@example.com",
        "subject": "Proposal for Partnership 🎉",
        "preview": "Hi Richard, Hope this email finds you well. I'm reaching out to explore a potential partnership...",
        "body": "Hi Richard,\n\nHope this message finds you well! I'm reaching out to explore a potential partnership between our companies. At Jane Corp, we've developed solutions that could complement your offerings at Brown Organisation Corp.\n\nI've attached a proposal detailing how we envision our collaboration, including key benefits, timelines, and implementation strategies. I believe this partnership could unlock exciting opportunities for both of us!\n\nLet me know your thoughts or a convenient time to discuss this further. I'm happy to schedule a call or meeting at your earliest convenience. Looking forward to hearing from you!\n\nWarm regards,\nJane Doe",
        "date": "2024-12-10T09:00:00",
        "is_read": 0,
        "is_archived": 0,
        "attachments": json.dumps([
            {"filename": "Proposal Partnership.pdf", "size": "1.5 MB", "url": "/files/proposal.pdf"}
        ]),
    },
    {
        "id": "2",
        "sender_name": "Mike Johnson",
        "sender_email": "mike.j@techcorp.io",
        "sender_avatar": "",
        "recipient_name": "Richard Brown",
        "recipient_email": "richard@example.com",
        "subject": "Q4 Revenue Report 📊",
        "preview": "Hey Richard, Attached is the Q4 revenue report as discussed in our last meeting...",
        "body": "Hey Richard,\n\nAttached is the Q4 revenue report as discussed in our last meeting. The numbers are looking strong — we've seen a 15% increase in revenue compared to Q3.\n\nKey highlights:\n• Total revenue: $2.4M (up 15% QoQ)\n• New customer acquisition: 342 accounts\n• Churn rate decreased to 2.1%\n• Enterprise deals closed: 8\n\nI'd love to walk you through the details in our next sync. Let me know when works best for you.\n\nBest,\nMike Johnson",
        "date": "2024-12-09T14:30:00",
        "is_read": 0,
        "is_archived": 0,
        "attachments": json.dumps([
            {"filename": "Q4_Revenue_Report.xlsx", "size": "2.3 MB", "url": "/files/q4-report.xlsx"}
        ]),
    },
    {
        "id": "3",
        "sender_name": "Sarah Williams",
        "sender_email": "sarah.w@designstudio.com",
        "sender_avatar": "",
        "recipient_name": "Richard Brown",
        "recipient_email": "richard@example.com",
        "subject": "New Brand Guidelines Ready ✨",
        "preview": "Hi Richard, The new brand guidelines are finalized and ready for your review...",
        "body": "Hi Richard,\n\nThe new brand guidelines are finalized and ready for your review. We've updated the color palette, typography system, and logo usage rules based on our last feedback session.\n\nPlease take a look at the attached document and let me know if you have any questions or need any revisions. We're aiming to roll these out company-wide by January 15th.\n\nThanks for your patience throughout this process!\n\nBest regards,\nSarah Williams",
        "date": "2024-12-09T11:15:00",
        "is_read": 1,
        "is_archived": 0,
        "attachments": json.dumps([
            {"filename": "Brand_Guidelines_v3.pdf", "size": "4.7 MB", "url": "/files/brand-guidelines.pdf"}
        ]),
    },
    {
        "id": "4",
        "sender_name": "Alex Chen",
        "sender_email": "alex.chen@startup.co",
        "sender_avatar": "",
        "recipient_name": "Richard Brown",
        "recipient_email": "richard@example.com",
        "subject": "Meeting Tomorrow at 2 PM 📅",
        "preview": "Hi Richard, Just confirming our meeting tomorrow at 2 PM to discuss the product roadmap...",
        "body": "Hi Richard,\n\nJust confirming our meeting tomorrow at 2 PM to discuss the product roadmap for Q1 2025. I've prepared a few topics I'd like to cover:\n\n1. Feature prioritization for the next sprint\n2. Resource allocation for the mobile app\n3. Timeline for the API v2 launch\n4. Customer feedback integration strategy\n\nPlease bring any additional items you'd like to discuss. See you tomorrow!\n\nCheers,\nAlex Chen",
        "date": "2024-12-08T16:45:00",
        "is_read": 1,
        "is_archived": 0,
        "attachments": json.dumps([]),
    },
    {
        "id": "5",
        "sender_name": "Emily Parker",
        "sender_email": "emily.p@marketing.io",
        "sender_avatar": "",
        "recipient_name": "Richard Brown",
        "recipient_email": "richard@example.com",
        "subject": "Campaign Results Are In! 🚀",
        "preview": "Richard! The holiday campaign results just came in and they're incredible...",
        "body": "Richard!\n\nThe holiday campaign results just came in and they're incredible! Here's a quick summary:\n\n• Email open rate: 34.2% (industry avg: 21%)\n• Click-through rate: 8.7%\n• Conversion rate: 3.2%\n• Total revenue generated: $156,000\n• ROI: 420%\n\nThis is our best-performing campaign of the year. I'll prepare a detailed report for the leadership meeting next week.\n\nLet's celebrate! 🎉\n\nBest,\nEmily Parker",
        "date": "2024-12-08T10:00:00",
        "is_read": 0,
        "is_archived": 0,
        "attachments": json.dumps([
            {"filename": "Campaign_Results_Dec.pdf", "size": "890 KB", "url": "/files/campaign-results.pdf"}
        ]),
    },
    {
        "id": "6",
        "sender_name": "David Kim",
        "sender_email": "david.kim@analytics.com",
        "sender_avatar": "",
        "recipient_name": "Richard Brown",
        "recipient_email": "richard@example.com",
        "subject": "Data Pipeline Update 🔧",
        "preview": "Hi Richard, Quick update on the data pipeline migration. We've completed phase 2...",
        "body": "Hi Richard,\n\nQuick update on the data pipeline migration. We've completed phase 2 and are on track for the final phase next week.\n\nCompleted:\n✅ Database schema migration\n✅ ETL process optimization\n✅ Real-time streaming setup\n\nRemaining:\n🔄 Load testing and performance tuning\n🔄 Documentation and runbooks\n🔄 Production deployment\n\nETA for full completion: December 20th. No blockers at this time.\n\nLet me know if you have any questions.\n\nThanks,\nDavid Kim",
        "date": "2024-12-07T09:30:00",
        "is_read": 1,
        "is_archived": 0,
        "attachments": json.dumps([]),
    },
    {
        "id": "7",
        "sender_name": "Lisa Thompson",
        "sender_email": "lisa.t@hr.company.com",
        "sender_avatar": "",
        "recipient_name": "Richard Brown",
        "recipient_email": "richard@example.com",
        "subject": "Team Offsite Planning 🏔️",
        "preview": "Hey Richard, I'm coordinating the Q1 team offsite and wanted to get your input on dates...",
        "body": "Hey Richard,\n\nI'm coordinating the Q1 team offsite and wanted to get your input on dates and activities. Here are the options:\n\nDates:\n• January 20-22 (Mon-Wed)\n• January 27-29 (Mon-Wed)\n• February 3-5 (Mon-Wed)\n\nVenue options:\n• Mountain View Resort (Lake Tahoe)\n• Bay Area Innovation Center (San Francisco)\n• Coastal Retreat (Santa Cruz)\n\nPlease vote for your preferred dates and venue by end of this week. We have 45 team members confirmed so far.\n\nThanks!\nLisa Thompson",
        "date": "2024-12-06T15:20:00",
        "is_read": 0,
        "is_archived": 0,
        "attachments": json.dumps([
            {"filename": "Offsite_Options.pdf", "size": "1.2 MB", "url": "/files/offsite-options.pdf"}
        ]),
    },
    {
        "id": "8",
        "sender_name": "Robert Martinez",
        "sender_email": "robert.m@legal.firm.com",
        "sender_avatar": "",
        "recipient_name": "Richard Brown",
        "recipient_email": "richard@example.com",
        "subject": "Contract Review Completed ✅",
        "preview": "Dear Richard, We've completed our review of the vendor contract. Please find our annotated version...",
        "body": "Dear Richard,\n\nWe've completed our review of the vendor contract with TechSupply Inc. Please find our annotated version attached with the following key recommendations:\n\n1. Payment terms: Changed from Net-60 to Net-30\n2. Liability clause: Added mutual indemnification\n3. Termination: Added 30-day notice period\n4. Data protection: Enhanced GDPR compliance language\n5. SLA requirements: Added 99.9% uptime guarantee\n\nPlease review and let us know if you'd like to discuss any of these changes before we send it back.\n\nBest regards,\nRobert Martinez, Esq.",
        "date": "2024-12-05T11:00:00",
        "is_read": 1,
        "is_archived": 1,
        "attachments": json.dumps([
            {"filename": "Contract_Review_Annotated.pdf", "size": "3.1 MB", "url": "/files/contract-review.pdf"}
        ]),
    },
]


def upgrade():
    """Apply the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("SELECT 1 FROM _migrations WHERE name = ?", (MIGRATION_NAME,))
    if cursor.fetchone():
        print(f"Migration {MIGRATION_NAME} already applied. Skipping.")
        conn.close()
        return

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS emails (
            id TEXT PRIMARY KEY,
            sender_name TEXT NOT NULL,
            sender_email TEXT NOT NULL,
            sender_avatar TEXT DEFAULT '',
            recipient_name TEXT NOT NULL,
            recipient_email TEXT NOT NULL,
            subject TEXT NOT NULL,
            preview TEXT NOT NULL DEFAULT '',
            body TEXT NOT NULL DEFAULT '',
            date TEXT NOT NULL,
            is_read INTEGER NOT NULL DEFAULT 0,
            is_archived INTEGER NOT NULL DEFAULT 0,
            attachments TEXT NOT NULL DEFAULT '[]'
        )
    """)

    for email in SEED_EMAILS:
        cursor.execute(
            """INSERT INTO emails
               (id, sender_name, sender_email, sender_avatar,
                recipient_name, recipient_email, subject, preview, body,
                date, is_read, is_archived, attachments)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                email["id"], email["sender_name"], email["sender_email"],
                email["sender_avatar"], email["recipient_name"],
                email["recipient_email"], email["subject"], email["preview"],
                email["body"], email["date"], email["is_read"],
                email["is_archived"], email["attachments"],
            ),
        )

    cursor.execute("INSERT INTO _migrations (name) VALUES (?)", (MIGRATION_NAME,))
    conn.commit()
    conn.close()
    print(f"Migration {MIGRATION_NAME} applied successfully.")


def downgrade():
    """Revert the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS emails")
    cursor.execute("DELETE FROM _migrations WHERE name = ?", (MIGRATION_NAME,))
    conn.commit()
    conn.close()
    print(f"Migration {MIGRATION_NAME} reverted successfully.")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Run database migration")
    parser.add_argument("action", choices=["upgrade", "downgrade"])
    args = parser.parse_args()
    if args.action == "upgrade":
        upgrade()
    elif args.action == "downgrade":
        downgrade()
