from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'blogs', BlogPostViewSet)

urlpatterns = [
    path('', include(router.urls)),  # CRUD operations for blogs
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path("user/", get_current_user, name="current-user"),

]
