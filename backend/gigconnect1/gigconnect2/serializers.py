from rest_framework import serializers
from django.contrib.auth.models import User
from .models import JobCategory, Skill, ClientProfile, FreelancerProfile, Job, JobApplication
from .models import User
from .models import FreelancerProfile
from .models import ClientProfile



# Serializer for User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role', User.Role.ADMIN)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.role = role
        user.save()
        return user

# Serializer for User Login
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

# Serializer for JobCategory
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class JobCategorySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'skills']

# Serializer for FreelancerProfile
class FreelancerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True
    )
    skills = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all()
    )
    job_categories = serializers.SerializerMethodField()

    class Meta:
        model = FreelancerProfile
        fields = ['id', 'user', 'user_id', 'bio', 'skills', 'job_categories']

    def get_job_categories(self, obj):
        # Fetch job categories based on skills
        job_categories = JobCategory.objects.filter(skills__in=obj.skills.all()).distinct()
        return JobCategorySerializer(job_categories, many=True).data

    def update(self, instance, validated_data):
        # Update skills if provided in the request
        skills_data = self.context['request'].data.get('skills', [])
        if skills_data:
            instance.skills.set(skills_data)  # Assuming skills_data contains IDs
        return super().update(instance, validated_data)

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'pay', 'category', 'required_skills', 'client']
        read_only_fields = ['client']

    def create(self, validated_data):
        required_skills = validated_data.pop('required_skills', [])
        job = Job.objects.create(**validated_data)
        job.required_skills.set(required_skills)
        return job

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['freelancer', 'created_at']

    def create(self, validated_data):
        validated_data['freelancer'] = self.context['request'].user
        return super().create(validated_data)
    



class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = ['company_name', 'website']

    def validate(self, data):
        if 'company_name' not in data or not data['company_name']:
            raise serializers.ValidationError("Company name is required.")
        return data