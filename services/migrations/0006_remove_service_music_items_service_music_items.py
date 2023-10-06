# Generated by Django 4.2.5 on 2023-10-06 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0014_alter_musicitem_keywords_and_more'),
        ('services', '0005_service_music_items'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='service',
            name='music_items',
        ),
        migrations.AddField(
            model_name='service',
            name='music_items',
            field=models.ManyToManyField(related_name='performances', to='music.musicitem'),
        ),
    ]