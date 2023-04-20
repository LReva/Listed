from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    first_name = models.CharField(blank=False, null=False, unique=False)
    last_name= models.CharField(blank=False, null=False, unique=False)
    email = models.EmailField(blank=False, null=False, unique=True)
    USERNAME_FIELD="email"
    REQUIRED_FIELDS = [first_name, last_name]

    def __str__(self):
      return f"{self.last_name} | {self.email}"  