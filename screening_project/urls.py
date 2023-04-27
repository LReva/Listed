"""
URL configuration for screening_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include

def index_page(request):
    react_page = open('static/index.html')
    return HttpResponse(react_page)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", index_page),
    path("about-us/", index_page),
    path("log-in/", index_page),
    path("screening/", index_page),
    path("sign-up/", index_page),
    path("screening-result/", index_page),
    path("screening-history/", index_page),
    path("view-match/", index_page),
    path('users', include('user_app.urls')),
    path("search", include('search_app.urls')),
    path("match", include('search_app.urls'))
]
