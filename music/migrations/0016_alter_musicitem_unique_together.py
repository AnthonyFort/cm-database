# Generated by Django 4.2.5 on 2023-10-06 11:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0015_remove_musicitem_past_performances'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='musicitem',
            unique_together={('title', 'composer')},
        ),
    ]
