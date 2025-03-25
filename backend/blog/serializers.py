from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')  # ✅ Prevents needing "author" in request

    class Meta:
        model = BlogPost
        fields = '__all__'  # Ensures all fields are serialized but "author" is readonly
