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
    job_list_create,
    job_detail,
    job_apply,
    job_applications_list,
    search_view,
)

urlpatterns = [
    path('signup/client/', signup_client, name='signup_client'),
    path('signup/freelancer/', signup_freelancer, name='signup_freelancer'),
    path('login/', login, name='login'),
    path('categories/', job_category_list_create, name='job_category_list_create'),
    path('categories/<int:pk>/', job_category_detail, name='job_category_detail'),
    path('categories/<int:pk>/freelancers/', job_category_freelancers, name='job_category_freelancers'),
    path('skills/', skill_list_create, name='skill_list_create'),
    path('skills/<int:pk>/', skill_detail, name='skill_detail'),
    path('skills/<int:pk>/freelancers/', skill_freelancers, name='skill_freelancers'),

    # Job-related URLs
    path('jobs/', job_list_create, name='job_list_create'),
    path('jobs/<int:pk>/', job_detail, name='job_detail'),

    # Job application-related URLs
    path('jobs/<int:job_pk>/apply/', job_apply, name='job_apply'),
    path('jobs/<int:job_pk>/applications/', job_applications_list, name='job_applications_list'),
    path('search/', search_view, name='search'),
]





