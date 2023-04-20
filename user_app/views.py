from rest_framework.decorators import api_view
from .utilities import sign_up, log_in, log_out, current_user


@api_view(['POST', 'PUT', 'GET'])
def user_pages(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            return log_out(request)
        else:
            return sign_up(request.data)
        
    elif request.method == 'PUT':
        return log_in(request)
    
    elif request.method == 'GET':
        return current_user(request)