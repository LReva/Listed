from rest_framework.decorators import api_view
from .utilities import search_database


# Create your views here.
@api_view(['POST', 'PUT', 'GET'])
def search_pages(request):
    if request.method == "POST":
        return search_database(request)