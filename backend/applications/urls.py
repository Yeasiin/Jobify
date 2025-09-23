from django.urls import path, include
from .views import ApplicationViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('', ApplicationViewSet, basename='application')

urlpatterns = router.urls
