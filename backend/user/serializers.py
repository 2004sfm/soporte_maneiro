# apps/user/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User # Importamos el modelo User de Django

class UserSerializer(serializers.ModelSerializer):
    # Campo 'password' solo para escritura, para crear o actualizar la contraseña
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        # Campos que queremos exponer en la API
        fields = [
            'id',
            'username',
            'email',         # Puedes incluir el email si quieres
            'first_name',
            'last_name',
            'password',      # Incluimos password para la creación/actualización
            'is_staff',      # Para saber si es admin
            'is_active',     # Para saber si la cuenta está activa
            'date_joined',   # Fecha de creación de la cuenta
            'last_login'     # Último inicio de sesión
        ]
        # Campos que no se pueden modificar directamente a través del serializador
        # y que serán solo de lectura
        read_only_fields = [
            'id',
            'is_staff',
            'is_active',
            'date_joined',
            'last_login'
        ]

    # Sobreescribe el método create para manejar el hasheo de la contraseña
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # El email puede ser opcional
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

    # Sobreescribe el método update para manejar el hasheo de la contraseña si se actualiza
    def update(self, instance, validated_data):
        # Si la contraseña está presente en los datos validados, la hasheamos
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
            validated_data.pop('password') # Elimina la contraseña de los datos para que no se guarde sin hashear

        # Llama al método update original para manejar el resto de campos
        return super().update(instance, validated_data)