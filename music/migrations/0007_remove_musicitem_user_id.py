# Generated by Django 4.2.5 on 2023-10-05 10:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0006_rename_user_musicitem_user_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='musicitem',
            name='user_id',
        ),
    ]