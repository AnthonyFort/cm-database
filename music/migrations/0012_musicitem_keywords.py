# Generated by Django 4.2.5 on 2023-10-05 11:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('keywords', '0001_initial'),
        ('music', '0011_rename_user_id_musicitem_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='musicitem',
            name='keywords',
            field=models.ManyToManyField(related_name='music', to='keywords.keyword'),
        ),
    ]
