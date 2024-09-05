from django.urls import path
from .views import (
    signup_client,
    signup_freelancer,
    login,
    job_category_list_create,
    job_category_detail,
    skill_list_create,
    skill_detail,
    job_category_freelancers,
    skill_freelancers,
    job_create,
    job_detail,
    job_apply,
    job_applications_list,
    search_view,
    update_freelancer_profile,
    update_client_profile,
    job_list,
    job_list_filtered,
)

urlpatterns = [
    # User authentication and signup
    path('signup/client/', signup_client, name='signup_client'),
    path('signup/freelancer/', signup_freelancer, name='signup_freelancer'),
    path('login/', login, name='login'),

    # Profile management
    path('profile/freelancer/', update_freelancer_profile, name='update_freelancer_profile'),
    path('profile/client/', update_client_profile, name='update_client_profile'),

    # Job Categories
    path('categories/', job_category_list_create, name='job_category_list_create'),
    path('categories/<int:pk>/', job_category_detail, name='job_category_detail'),
    path('categories/<int:pk>/freelancers/', job_category_freelancers, name='job_category_freelancers'),

    # Skills
    path('skills/', skill_list_create, name='skill_list_create'),
    path('skills/<int:pk>/', skill_detail, name='skill_detail'),
    path('skills/<int:pk>/freelancers/', skill_freelancers, name='skill_freelancers'),

    # Job-related URLs
    path('jobs/', job_create, name='job_create'),
    path('jobs/<int:pk>/', job_detail, name='job_detail'),
    path('jobsl/', job_list, name='job_list'),
    path('jobsl/filtered/', job_list_filtered, name='job_list_filtered'),

    # Job application-related URLs
    path('jobs/<int:job_pk>/apply/', job_apply, name='job_apply'),
    path('jobs/<int:job_pk>/applications/', job_applications_list, name='job_applications_list'),

    # Search functionality
    path('search/', search_view, name='search'),

    

]






