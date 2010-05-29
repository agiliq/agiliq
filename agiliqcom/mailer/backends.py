from django.core.mail.backends.base import BaseEmailBackend

from mailer import send_mail

class DbBackend(BaseEmailBackend):
    def send_messages(self, email_messages):
        for email in email_messages:
            send_mail(subject=email.subject, message=email.body, from_email=email.from_email,
                    recipient_list=email.recipients(), priority="medium",
                    fail_silently=False, auth_user=None, auth_password=None)
        

