from django.urls import path, include
from .views import JobViewSet, CategoryListAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('', JobViewSet, basename='job')

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
]

urlpatterns += router.urls
