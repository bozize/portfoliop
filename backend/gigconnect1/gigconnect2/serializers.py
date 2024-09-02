from rest_framework import serializers
from django.contrib.auth.models import User
from .models import JobCategory, Skill, ClientProfile, FreelancerProfile, Job, JobApplication
from .models import User


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
    skills = SkillSerializer(many=True, read_only=True)
    skills_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        source='skills',
        write_only=True,
        many=True
    )
    job_categories = serializers.SerializerMethodField()

    class Meta:
        model = FreelancerProfile
        fields = ['id', 'user', 'user_id', 'bio', 'skills', 'skills_ids', 'job_categories']

    def get_job_categories(self, obj):
        # Get the job categories related to the freelancer's skills
        job_categories = JobCategory.objects.filter(skills__in=obj.skills.all()).distinct()
        return JobCategorySerializer(job_categories, many=True).data
    


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['client', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['freelancer', 'created_at']

    def create(self, validated_data):
        validated_data['freelancer'] = self.context['request'].user
        return super().create(validated_data)