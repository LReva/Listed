from rest_framework.decorators import api_view
from django.http import JsonResponse
from .utilities import search_database, edit_match, set_positive_match, delete_match


# Create your views here.
@api_view(['POST', 'PUT', 'GET'])
def search_pages(request):
    if request.method == "POST":
        return JsonResponse(search_database(request))
    elif request.method == "PUT" and "comment" in request.data:
        return edit_match(request)
    elif request.method == "PUT":
        return set_positive_match(request)
    elif request.method == "DELETE":
        return delete_match(request)