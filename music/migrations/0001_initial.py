# Generated by Django 4.2.5 on 2023-10-05 08:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MusicItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('composer', models.CharField(max_length=50)),
                ('related_readings', models.CharField(max_length=100)),
                ('sheet_music_url', models.URLField()),
                ('recording', models.URLField()),
                ('past_performances', models.PositiveIntegerField()),
                ('comments', models.CharField(max_length=200)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='music', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
