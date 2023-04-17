from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login, logout
from .models import User
from django.core.serializers import serialize
from django.shortcuts import redirect
import json


def home_page(request):
    react_page = open('static/index.html')
    return HttpResponse(react_page)


@api_view(["POST"])
def sign_up(request):
    first_name = request.data['first_name']
    last_name = request.data['last_name']
    email = request.data['email']
    password = request.data['password']
    super_user = False
    staff = False
    if 'super' in request.data:
        super_user = request.data['super']
    if 'staff' in request.data:
        staff = request.data['staff']
    try:
        new_user = User.objects.create_user(
            first_name = first_name,
            last_name = last_name,
            username = email,
            email=email,
            password = password,
            is_superuser = super_user,
            is_staff = staff
        )
        new_user.save()      
        return JsonResponse({'success':True})
    except Exception:
        return JsonResponse({"success":False})
    

@api_view(['POST'])
def log_in(request):
    email = request.data['email']
    password = request.data['password']
    user = authenticate(username=email, password=password)
    if user is not None and user.is_active:
        try:
            login(request._request, user)
            print(user)
            return JsonResponse({'email': user.email,
                                  'first_name': user.first_name,
                                  'last_name': user.last_name})
        except Exception:
            print(Exception.__str__())
            return JsonResponse({'login':False})
    return JsonResponse({'login':False})


@api_view(["GET"])
def current_user(request):
    if request.user.is_authenticated:
        user_info = serialize("json", [request.user], fields = ['email',
                                                                'first_name',
                                                                'last_name'])
        user_info_workable = json.loads(user_info)
        print(user_info)
        return JsonResponse(user_info_workable[0]['fields'])
    else:
        return JsonResponse({'user': None})
    

@api_view(['POST'])
def log_out(request):
    try:
        logout(request)
        return JsonResponse({'logout': True})
    except Exception:
        return JsonResponse({'logout':False})