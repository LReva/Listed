from rest_framework.decorators import api_view
from .utilities import sign_up, log_in, log_out, current_user, verify_password, edit_user, delete_user


@api_view(['POST', 'PUT', 'GET', "DELETE"])
def user_pages(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            if "password" in request.data:
                return verify_password(request)
            else:
                return log_out(request)
        else:
            return sign_up(request.data)
        
    elif request.method == 'PUT':
        if "edit" in request.data:
            return edit_user(request)
        else:
            return log_in(request)
        
    elif request.method == 'GET':
        return current_user(request)
    
    elif request.method == "DELETE":
        return delete_user(request)