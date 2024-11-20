"""
email_client.py

This module handles the sending of emails. It provides functionalities 
to send emails with retry logic and to construct email messages with 
HTML content.
"""

import smtplib
import os
from time import sleep
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from tenacity import retry, stop_after_attempt, after_log
import logging

# Configure logging
logging.basicConfig(filename='email.log', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@retry(stop=stop_after_attempt(3), after=after_log(logger, logging.DEBUG))
async def send_mail(sender, app_password, reciever, message):
    """
    Send an email using the provided SMTP server.
    
    Args:
        sender (str): Sender's email address.
        app_password (str): Sender's email password.
        reciever (str): Recipient's email address.
        message (str): Email message content.
        
    Returns:
        None
    """
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login(sender, app_password)
    server.sendmail(sender, reciever, message)
    server.quit()
    
async def mailSender(**data):
    """
    Send an email using the provided SMTP server.
    
    Args:
        data (dict): A dictionary containing the email data.
        
    Returns:
        None
    """

    try:
        sender = data.get('sender', None) or 'chinonsodomnic@gmail.com'
        reciever = data.get( 'to', None)
        subject = data.get('subject', None)
        uri = data.get('uri', None)
        token = data.get('token', None)
        if sender is None or reciever is None:
            logger.debug(f"Sender with job id={data.get('id', None)} or reciever is None")
            raise ValueError("Sender or reciever is None")

        # Load environmental variables
        load_dotenv()

        # Get the environmental variable which has the password or use argument password
        app_password = os.getenv("GTP")
        # Prepare the email message
        message = MIMEMultipart()
        message['From'] = sender
        message['To'] = reciever
        message['Subject'] = subject or "Email communication"

        html_content = f"""<html>
                            <body>
                                <h1 style="color: blue;">Delivery - Business Application</h1>
                                <br>
                                <h3> Click the link <a href="{uri}?token={token}">here</a> to reset your password</h3>
                            </body>
                            </html>
                        """
        message.attach(MIMEText(html_content, "html"))

        # Send the email
        await send_mail(sender, app_password, reciever, message.as_string())
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        raise e
