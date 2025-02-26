# services/notification_service.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random

from app import mongo  # query the DB to get user info

# A short list of “bro-science” lines
BRO_SCIENCE_PHRASES = [
    "Light weight, baby! Time to crush this workout!",
    "Ain't nothin' but a peanut – let's lift!",
    "Suns out, guns out! The mirror is waiting.",
    "Today’s forecast: 100% chance of swole.",
    "It’s PR day, bro. NO EXCUSES!"
]

def get_bro_science_message():
    return random.choice(BRO_SCIENCE_PHRASES)

def get_all_users():
    """
    Pull all users from MongoDB (or select specific ones).
    Returns a list of user documents with 'email' fields.
    """
    users_collection = mongo.db.users
    user_docs = users_collection.find()
    return list(user_docs)

def send_email_smtp(recipient_email, subject, body, sender_email, sender_password):
    """
    Sends an email via SMTP. This uses a Gmail SMTP server,
    but could be customized to a chosen provider (SendGrid, Mailgun, AWS SES, etc.).
    """
    # Creates a multipart message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = recipient_email

    # Attach plain text body
    # Could also attach an HTML version in the future
    msg.attach(MIMEText(body, "plain"))

    try:
        # Connecting to Gmail’s SMTP. 
        #  eventually Adjust for your provider:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.ehlo()
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email to {recipient_email}: {str(e)}")


def send_daily_motivational_emails():
    """
    Retrieves all users, sends each a daily motivational email
    with a random gym-bro phrase.
    """
    users = get_all_users()

    for user in users:
        recipient_email = user.get("email")
        if not recipient_email:
            continue  # skip users without email

        bro_phrase = get_bro_science_message()
        
        subject = "Your Daily Gym-Bro Motivation!"
        body = (
            f"Hey {user['username']}!\n\n"
            f"Hope you're pumped for today's workout. Here's your daily message:\n\n"
            f"\"{bro_phrase}\"\n\n"
            "Stay swole!\n-- The CPFT Team"
        )

        # stored “sender” email and password in environment variables
        sender_email = "your_send_account@gmail.com"
        sender_password = "your_app_specific_or_gmail_password"

        send_email_smtp(recipient_email, subject, body, sender_email, sender_password)
