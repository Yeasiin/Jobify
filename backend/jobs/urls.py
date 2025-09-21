from django.urls import path, include
from .views import JobViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()

router.register('', JobViewSet)

urlpatterns = router.urls
