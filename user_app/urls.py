from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page),
    path('sign-up/', views.sign_up),
    path('log-in/', views.log_in),
    path('log-out/', views.log_out),
    path('current-user/', views.current_user),
    path('screening/', views.home_page)
]