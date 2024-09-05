from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Skill(models.Model):
    name = models.CharField(max_length=100)
    freelancers = models.ManyToManyField('User', related_name='skills_set', blank=True)  # Related to User

    def __str__(self):
        return self.name
class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        FREELANCER = "FREELANCER", "Freelancer"
        CLIENT = "CLIENT", "Client"

    base_role = Role.ADMIN
    role = models.CharField(max_length=50, choices=Role.choices, default=base_role)
    # Rename related_name to avoid conflicts
    skills = models.ManyToManyField('Skill', related_name='users_with_skill', blank=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='gigconnect2_user_set', 
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='gigconnect2_user_permissions_set',  
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
        return super().save(*args, **kwargs)

class AbstractProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        abstract = True

class FreelancerProfile(AbstractProfile):
    bio = models.TextField(blank=True, null=True)
    skills = models.ManyToManyField('Skill', related_name='freelancer_profiles', blank=True)

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    company_name = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)  # Make website optional
    # Add other fields as needed

    def __str__(self):
        return f"{self.user.username}'s Client Profile"
class JobCategory(models.Model):
    name = models.CharField(max_length=100)
    skills = models.ManyToManyField(Skill, related_name='job_categories')  # Many-to-Many with Skill

    def __str__(self):
        return self.name
    



class Job(models.Model):
    LEVEL_CHOICES = [
        ('Entry', 'Entry'),
        ('Intermediate', 'Intermediate'),
        ('Expert', 'Expert'),
    ]

    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    category = models.ForeignKey('JobCategory', on_delete=models.SET_NULL, null=True, related_name='jobs')
    required_skills = models.ManyToManyField('Skill', related_name='jobs')
    pay = models.DecimalField(max_digits=10, decimal_places=2)
    level_of_expertise = models.CharField(max_length=15, choices=LEVEL_CHOICES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

# Model for Job Application
class JobApplication(models.Model):
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField()
    proposed_pay = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_completion_time = models.PositiveIntegerField(help_text="Estimated time to complete the job in days")
    attachments = models.FileField(upload_to='job_applications/attachments/', blank=True, null=True)
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.freelancer.username} - {self.job.title}"
