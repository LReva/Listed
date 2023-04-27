from rest_framework.decorators import api_view
from django.http import JsonResponse
from .utilities import search_database, edit_match, set_positive_match, delete_match, get_match_details, load_history


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def search_pages(request):
    if request.method == 'POST' and "match_link" in request.data:
        return get_match_details(request)   
    elif request.method == "POST":
        return JsonResponse(search_database(request))
    elif request.method == "PUT" and "comments" in request.data:
        return edit_match(request)
    elif request.method == "PUT":
        return set_positive_match(request)
    elif request.method == "DELETE":
        return delete_match(request) 
    elif request.method == 'GET':
        return load_history(request)