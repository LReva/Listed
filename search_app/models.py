from django.db import models
from user_app.models import User


class Search_Type(models.Model):
   name = models.CharField(max_length=10, blank=False, null=False, unique=True)
   

class Database(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False, unique=True)
    search_type = models.ForeignKey(Search_Type, on_delete=models.PROTECT, null=False, blank=False)

    def __str__(self):
      return f"{self.name}" 
  

class Search(models.Model):
   user = models.ForeignKey(User, on_delete=models.PROTECT)
   search_time = models.DateTimeField(auto_now_add=True, null=False, blank=False)
   search_type = models.ForeignKey(Search_Type, on_delete=models.PROTECT, null=False, blank=False)
   

class Searched_Databases(models.Model):
   database = models.ForeignKey(Database, on_delete=models.RESTRICT, null=False, blank=False)
   search = models.ForeignKey(Search, on_delete=models.CASCADE, null=False, blank=False)


class Individual(models.Model):
   first_name = models.CharField(max_length=50, blank=True, unique=False, null=True)
   last_name = models.CharField(max_length=50, blank=True, unique=False, null=True)
   full_name = models.CharField(max_length=50, blank=True, unique=False, null=True)
   country = models.CharField(max_length=50, blank=True, unique=False, null=True)
   dob = models.DateField(null=True, blank=True)
   search = models.ForeignKey(Search, on_delete=models.CASCADE, null=False, blank=False)


class Entity(models.Model):
   entity_name = models.CharField(max_length=50, blank=False, unique=False, null=False)
   country = models.CharField(max_length=50, blank=True, unique=False, null=True)
   address = models.CharField(max_length=100, blank=True, unique=False, null=True)
   entity_legal_id = models.CharField(max_length=100, blank=True, unique=False, null=True)
   search = models.ForeignKey(Search, on_delete=models.CASCADE, null=False, blank=False)


class Match_Identification(models.Model):
   name = models.CharField(max_length=50, blank=False, unique=False, null=False)


class Result_Match_History(models.Model):
   name = models.CharField(max_length=50, blank=False, unique=False, null=False)
   search_type = models.ForeignKey(Search_Type, on_delete=models.PROTECT, null=False, blank=False)
   link = models.CharField(max_length=250, blank=False, unique=False, null=False)
   database = models.ForeignKey(Database, on_delete=models.RESTRICT, null=False, blank=False)
   match = models.ForeignKey(Match_Identification, on_delete=models.PROTECT, null=False, blank=False)
   search = models.ForeignKey(Search, on_delete=models.CASCADE, null=False, blank=False)