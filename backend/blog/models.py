from django.db import models
from django.contrib.auth.models import User
import markdown

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    theme = models.CharField(max_length=50, default="default")

    def render_markdown(self):
        return markdown.markdown(self.content)

    def __str__(self):
        return self.title
