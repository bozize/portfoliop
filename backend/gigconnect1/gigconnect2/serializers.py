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
        fields = ['username', 'email', 'password', 'role', 'id']
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
    skills = serializers.PrimaryKeyRelatedField(many=True, queryset=Skill.objects.all())
    job_categories = serializers.PrimaryKeyRelatedField(many=True, queryset=JobCategory.objects.all())

    class Meta:
        model = FreelancerProfile
        fields = ['bio', 'skills', 'job_categories']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['skills'] = [skill.id for skill in instance.skills.all()]
        representation['job_categories'] = [category.id for category in instance.job_categories.all()]
        return representation

class JobSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    required_skills = serializers.StringRelatedField(many=True)
    client = serializers.StringRelatedField()

    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'pay', 'category', 'required_skills', 'client', 'created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['title'] = representation.get('title', '')
        representation['description'] = representation.get('description', '')
        representation['pay'] = representation.get('pay', 0)
        representation['category'] = representation.get('category', '')
        representation['required_skills'] = representation.get('required_skills', [])
        representation['client'] = representation.get('client', '')
        representation['created_at'] = representation.get('created_at', '')
        representation['updated_at'] = representation.get('updated_at', '')
        return representation

class JobApplicationSerializer(serializers.ModelSerializer):
       class Meta:
           model = JobApplication
           fields = '__all__'  # En



class ClientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ClientProfile
        fields = ['id', 'user', 'company_name', 'website']
        read_only_fields = ['id', 'user']

    def update(self, instance, validated_data):
        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.website = validated_data.get('website', instance.website)
        instance.save()
        return instance