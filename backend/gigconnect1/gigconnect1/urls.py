from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls), # Include the app-specific URLs
    path('api/', include('gigconnect2.urls')),  # Include the same URLs for job categories and skills
]
