from django.shortcuts import render
from rest_framework.generics import (
  GenericAPIView, RetrieveUpdateDestroyAPIView
)
from lib.views import UserListCreateAPIView

from rest_framework.permissions import IsAuthenticated
from lib.permissions import IsOwnerOrReadOnly

from .models import Service

from .serializers.common import ServiceSerializer

from rest_framework.response import Response

class PastServiceView(GenericAPIView):
  queryset=Service.objects.all()
  serializer_class=ServiceSerializer

class PastServiceListView(PastServiceView, UserListCreateAPIView):
  permission_classes = [IsAuthenticated]
  
class PastServiceDetaillView(PastServiceView, RetrieveUpdateDestroyAPIView):
  permission_classes = [IsOwnerOrReadOnly]

  def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
  