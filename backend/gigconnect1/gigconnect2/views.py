from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserLoginSerializer, JobCategorySerializer, SkillSerializer, FreelancerProfileSerializer, JobSerializer, JobApplicationSerializer, ClientProfileSerializer
from django.contrib.auth import authenticate
from .models import User, JobCategory, Skill, Job, JobApplication
from .models import User, FreelancerProfile, ClientProfile
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

@api_view(['POST', 'GET'])
def signup_client(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.role = User.Role.CLIENT
            user.set_password(request.data['password'])
            user.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'GET':
        # This will return all users with the 'CLIENT' role
        clients = User.objects.filter(role=User.Role.CLIENT)
        serializer = UserSerializer(clients, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def signup_freelancer(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.role = User.Role.FREELANCER
        user.set_password(request.data['password'])
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            profile_complete = False
            if user.role == User.Role.FREELANCER:
                profile, _ = FreelancerProfile.objects.get_or_create(user=user)
                profile_complete = bool(profile.bio and profile.skills.exists())
            elif user.role == User.Role.CLIENT:
                profile, _ = ClientProfile.objects.get_or_create(user=user)
                profile_complete = bool(profile.company_name)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'role': user.role,
                'profile_complete': profile_complete
            })
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def job_category_list_create(request):
    if request.method == 'GET':
        job_categories = JobCategory.objects.all()
        serializer = JobCategorySerializer(job_categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Ensure only Admin can create a job category
        if request.user.role != User.Role.ADMIN:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = JobCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def job_category_detail(request, pk):
    try:
        job_category = JobCategory.objects.get(pk=pk)
    except JobCategory.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        skills = job_category.skills.all()
        freelancers = User.objects.filter(role=User.Role.FREELANCER, skills__in=skills).distinct()

        response_data = {
            'job_category': JobCategorySerializer(job_category).data,
            'skills': SkillSerializer(skills, many=True).data,
            'freelancers': UserSerializer(freelancers, many=True).data
        }

        return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def skill_list_create(request):
    if request.method == 'GET':
        skills = Skill.objects.all()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Ensure only Admin can create a skill
        if request.user.role != User.Role.ADMIN:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def skill_detail(request, pk):
    try:
        skill = Skill.objects.get(pk=pk)
    except Skill.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    freelancers = User.objects.filter(role=User.Role.FREELANCER, skills=skill).distinct()

    response_data = {
        'skill': SkillSerializer(skill).data,
        'freelancers': UserSerializer(freelancers, many=True).data
    }

    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
def job_category_skills(request, pk):
    try:
        job_category = JobCategory.objects.get(pk=pk)
    except JobCategory.DoesNotExist:
        return Response({'detail': 'Job category not found'}, status=status.HTTP_404_NOT_FOUND)

    skills = job_category.skills.all()
    serializer = SkillSerializer(skills, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def job_category_freelancers(request, pk):
    try:
        job_category = JobCategory.objects.get(pk=pk)
    except JobCategory.DoesNotExist:
        return Response({'detail': 'Job category not found'}, status=status.HTTP_404_NOT_FOUND)

    # Get all skills related to the job category
    skills = job_category.skills.all()

    # Get freelancers who have any of these skills
    freelancers = FreelancerProfile.objects.filter(skills__in=skills).distinct()

    # Serialize the freelancers
    serializer = FreelancerProfileSerializer(freelancers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def skill_freelancers(request, pk):
    """
    Retrieve freelancers who possess the specified skill.

    :param request: The HTTP request object.
    :param pk: The primary key of the Skill object.
    :return: A Response object containing the list of freelancers.
    """
    try:
        # Get the skill based on the primary key
        skill = Skill.objects.get(pk=pk)
    except Skill.DoesNotExist:
        # Return a 404 error if the skill is not found
        return Response({'detail': 'Skill not found'}, status=status.HTTP_404_NOT_FOUND)

    # Retrieve freelancers who have the specified skill
    freelancers = User.objects.filter(role=User.Role.FREELANCER, skills=skill).distinct()

    # Serialize the freelancers' data
    serializer = UserSerializer(freelancers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


""" JOB APPLICATIONS VIEWS"""

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def job_create(request):
    if request.method == 'POST':
        # Get all job categories
        job_categories = JobCategory.objects.all()
        job_category_serializer = JobCategorySerializer(job_categories, many=True)

        # If a category is provided in the request, get related skills
        category_id = request.data.get('category')
        if category_id:
            try:
                category = JobCategory.objects.get(id=category_id)
                related_skills = category.skills.all()
                skill_serializer = SkillSerializer(related_skills, many=True)
            except JobCategory.DoesNotExist:
                return Response({'detail': 'Invalid job category'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            skill_serializer = SkillSerializer(Skill.objects.all(), many=True)

        # Create the job
        serializer = JobSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(client=request.user)
            return Response({
                'job': serializer.data,
                'categories': job_category_serializer.data,
                'skills': skill_serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])

def job_list(request):
    jobs = Job.objects.all().order_by('-created_at')
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)

# You can also add filtering options:
@api_view(['GET'])

def job_list_filtered(request):
    jobs = Job.objects.all()

    category = request.query_params.get('category')
    if category:
        jobs = jobs.filter(category__id=category)

    skill = request.query_params.get('skill')
    if skill:
        jobs = jobs.filter(required_skills__id=skill)

    min_pay = request.query_params.get('minPay')
    max_pay = request.query_params.get('maxPay')
    if min_pay:
        jobs = jobs.filter(pay__gte=min_pay)
    if max_pay:
        jobs = jobs.filter(pay__lte=max_pay)

    jobs = jobs.order_by('-created_at')

    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)



# View for retrieving, updating, and deleting a specific job
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def job_detail(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        if request.user != job.client:
            return Response({'detail': 'You do not have permission to edit this job.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = JobSerializer(job, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if request.user != job.client:
            return Response({'detail': 'You do not have permission to delete this job.'}, status=status.HTTP_403_FORBIDDEN)

        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# View for applying to a job
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def job_apply(request, job_pk):
    try:
        job = Job.objects.get(pk=job_pk)
    except Job.DoesNotExist:
        return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the freelancer has already applied for the job
    if JobApplication.objects.filter(job=job, freelancer=request.user).exists():
        return Response({'detail': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = JobApplicationSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(job=job)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View for listing all job applications for a specific job
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_applications_list(request, job_pk):
    try:
        job = Job.objects.get(pk=job_pk)
    except Job.DoesNotExist:
        return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.user != job.client:
        return Response({'detail': 'You do not have permission to view applications for this job.'}, status=status.HTTP_403_FORBIDDEN)

    applications = JobApplication.objects.filter(job=job)
    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


""" SEARCH FUNCTIONALITY"""

@api_view(['GET', 'POST'])
def search_view(request):
    if request.method == 'GET':
        # Extract search keyword from query parameters
        keyword = request.query_params.get('q', None)
    elif request.method == 'POST':
        # Extract search keyword from request data
        keyword = request.data.get('q', None)
    else:
        return Response({'detail': 'Method not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    if not keyword:
        return Response({'detail': 'Please provide a search keyword.'}, status=status.HTTP_400_BAD_REQUEST)

    # Search in Jobs
    jobs = Job.objects.filter(
        Q(title__icontains=keyword) |
        Q(description__icontains=keyword) |
        Q(category__name__icontains=keyword) |
        Q(required_skills__name__icontains=keyword)
    ).distinct()
    job_serializer = JobSerializer(jobs, many=True)

    # Search in Skills
    skills = Skill.objects.filter(
        Q(name__icontains=keyword)
    ).distinct()
    skill_serializer = SkillSerializer(skills, many=True)

    # Search in Freelancers (Users with the role 'FREELANCER')
    freelancers = User.objects.filter(
        Q(role=User.Role.FREELANCER),
        Q(username__icontains=keyword) |
        Q(skills__name__icontains=keyword) |
        Q(freelancerprofile__bio__icontains=keyword)
    ).distinct()
    freelancer_serializer = UserSerializer(freelancers, many=True)

    # Search in Job Categories
    job_categories = JobCategory.objects.filter(
        Q(name__icontains=keyword)
    ).distinct()
    job_category_serializer = JobCategorySerializer(job_categories, many=True)

    # Combine results
    results = {
        'jobs': job_serializer.data,
        'skills': skill_serializer.data,
        'freelancers': freelancer_serializer.data,
        'job_categories': job_category_serializer.data,
    }

    return Response(results, status=status.HTTP_200_OK)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def update_client_profile(request):
    # Ensure the user is authenticated
    if request.user.is_anonymous:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    # Get or create the client profile for the authenticated user
    profile, created = ClientProfile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        # Serialize and return the profile data
        serializer = ClientProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        # Update the profile with the provided data
        serializer = ClientProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def update_freelancer_profile(request):
    # Ensure the user is authenticated
    if request.user.is_anonymous:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    # Get or create the freelancer profile for the authenticated user
    profile, created = FreelancerProfile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        # Serialize and return the profile data
        serializer = FreelancerProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        # Update the profile with the provided data
        serializer = FreelancerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])

def freelancer_list(request):
    # Get all users with the FREELANCER role
    freelancers = User.objects.filter(role=User.Role.FREELANCER)

    # Filter by skill if provided in query params
    skill_id = request.query_params.get('skill')
    if skill_id:
        try:
            skill = Skill.objects.get(id=skill_id)
            freelancers = freelancers.filter(skills=skill)
        except Skill.DoesNotExist:
            return Response({'detail': 'Skill not found'}, status=status.HTTP_404_NOT_FOUND)

    # You can add more filters here as needed

    # Serialize the freelancers
    serializer = UserSerializer(freelancers, many=True)

    # Get associated FreelancerProfiles
    freelancer_profiles = FreelancerProfile.objects.filter(user__in=freelancers)
    profile_serializer = FreelancerProfileSerializer(freelancer_profiles, many=True)

    # Combine user data with profile data
    combined_data = []
    for user, profile in zip(serializer.data, profile_serializer.data):
        combined_data.append({**user, 'profile': profile})

    return Response(combined_data)

@api_view(['GET'])

def skill_list(request):
    skills = Skill.objects.all()
    serializer = SkillSerializer(skills, many=True)
    return Response(serializer.data)