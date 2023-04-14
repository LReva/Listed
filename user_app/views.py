from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login, logout
from .models import User
from django.core.serializers import serialize
import json

# Create your views here.

def user_sign_up(request):
    react_page = open('static/index.html')
    return HttpResponse(react_page)