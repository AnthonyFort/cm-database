# Generated by Django 4.2.5 on 2023-10-05 15:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_past_services'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='past_services',
        ),
    ]