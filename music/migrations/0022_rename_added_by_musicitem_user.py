# Generated by Django 4.2.6 on 2023-10-15 16:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0021_rename_user_musicitem_added_by'),
    ]

    operations = [
        migrations.RenameField(
            model_name='musicitem',
            old_name='added_by',
            new_name='user',
        ),
    ]
