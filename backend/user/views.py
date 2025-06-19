# apps/user/views.py

from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer
# No necesitamos importar UserCreationSerializer si usamos el mismo para crear/actualizar
# Solo si fueran lógicas muy diferentes, lo cual no es el caso en un serializer sencillo

from rest_framework.authtoken.views import ObtainAuthToken # Para el login
from rest_framework.authtoken.models import Token
from rest_framework.response import Response # Para personalizar la respuesta del login


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer # Usamos el mismo serializador para todas las operaciones
    permission_classes = [permissions.AllowAny]

    # def get_permissions(self):
    #     """
    #     Define los permisos basados en la acción (create, list, retrieve, update, destroy).
    #     """
    #     if self.action == 'create':
    #         permission_classes = [permissions.AllowAny]
    #     elif self.action in ['list', 'retrieve']:
    #         permission_classes = [permissions.IsAuthenticated]
    #     else:
    #         permission_classes = [permissions.IsAuthenticated]
    #     return [permission() for permission in permission_classes]

class CustomAuthToken(ObtainAuthToken):
    """
    Vista personalizada para obtener un token de autenticación.
    Extiende ObtainAuthToken para personalizar la respuesta.
    """
    def post(self, request, *args, **kwargs):
        # Llama al serializador base de ObtainAuthToken para validar credenciales
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Obtiene o crea el token para el usuario
        token, created = Token.objects.get_or_create(user=user)

        # Devuelve la respuesta con el token y algunos datos del usuario
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email,     # Incluir email si lo deseas en el login
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        })