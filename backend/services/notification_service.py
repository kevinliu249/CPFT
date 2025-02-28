# services/notification_service.py

import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app

BRO_SCIENCE_PHRASES = [
    "Light weight, baby! Time to crush this workout!",
    "Ain't nothin' but a peanut – let's lift!",
    "Suns out, guns out! The mirror is waiting.",
    "Today’s forecast: 100% chance of swole.",
    "It’s PR day, bro. NO EXCUSES!",
    "Sweat is just your muscles crying tears of joy!",
    "If it ain't heavy, it ain't worth lifting. Go big or go home!",
    "Time to pray at the alter of GAINZ! Make Swoley Jesus proud!"
]

def get_bro_science_message():
    return random.choice(BRO_SCIENCE_PHRASES)

def get_all_users():
    """
    Pulls all users from the DB.
    """
    db = current_app.mongo.db  # Access Mongo client through current_app
    user_docs = db.users.find()
    return list(user_docs)

def send_email_smtp(recipient_email, subject, body, sender_email, sender_password):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.ehlo()
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email to {recipient_email}: {str(e)}")

def send_daily_motivational_emails():
    users = get_all_users()
    for user in users:
        recipient_email = user.get("email")
        if not recipient_email:
            continue

        bro_phrase = get_bro_science_message()
        subject = "Your Daily Gym-Bro Motivation!"
        body = (
            f"Hey {user['username']}!\n\n"
            f"Hope you're pumped for today's workout. Here's your daily message:\n\n"
            f"\"{bro_phrase}\"\n\n"
            "Stay swole!\n-- The CPFT Team"
        )
        sender_email = "cpftnotifications@gmail.com"
        sender_password = "uist acpv rgoc fzdw"

        send_email_smtp(recipient_email, subject, body, sender_email, sender_password)
