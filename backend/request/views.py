from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Request
from .serializers import RequestSerializer
from .filters import RequestFilter

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all().order_by('-created_at')
    permission_classes = [permissions.AllowAny]
    serializer_class = RequestSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RequestFilter
