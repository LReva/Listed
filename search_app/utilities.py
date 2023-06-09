from django.utils import timezone
from django.http import JsonResponse
from django.db.models import Q
from .models import Search_Type, Database, Search, Searched_Databases, Individual, Match_Identification, Result_Match_History
from .helpers import get_nationality, check_for_photo
from .fbi_screening_utils import fbi_search
from .interpol_screening_utils import interpol_search
from .ofac_screening_utils import ofac_search
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()


def get_matching_search_type(type):
    matching_type = Search_Type.objects.get(name = type)
    return matching_type


def get_all_databases():
    all_databases = Database.objects.all()
    return all_databases


def get_matching_database(name):
    matching_database = Database.objects.get(name = name)
    return matching_database


def get_all_match_identifications():
    all_match_identifications = Match_Identification.objects.all()
    return all_match_identifications


def search_database(request):
    type = request.data['type']
    database = request.data['database']
    matching_type = get_matching_search_type(type)
    matching_database = None
    new_search = Search.objects.create(user = request.user, search_type = matching_type, search_time = timezone.localtime())
    new_search.save()
    match_identification = Match_Identification.objects.get(id=2)
    if database == "Search all":
        #below should be refactored once OFAC is available
        fbi_database = get_matching_database(name = "FBI")
        interpol_database = get_matching_database(name = "Interpol")
        ofac_database = get_matching_database(name = "OFAC")
        new_search_fbi = Searched_Databases.objects.create(database = fbi_database, search = new_search)
        new_search_fbi.save()
        new_search_interpol = Searched_Databases.objects.create(database = interpol_database, search = new_search)
        new_search_interpol.save()
        new_search_ofac = Searched_Databases.objects.create(database = ofac_database, search = new_search)
        new_search_ofac.save()
    else:
        matching_database = get_matching_database(database)
        new_search_database = Searched_Databases.objects.create(database = matching_database, search = new_search)
        new_search_database.save()
    if type == "Individual":
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        full_name = request.data['full_name']
        dob = request.data['dob']
        if dob == "":
            dob = None
        else:
            dob_obj = datetime.strptime(dob, "%m/%d/%Y")
            dob = datetime.strftime(dob_obj, "%Y-%m-%d")
        country = request.data["country"]
        new_individual_entry = Individual.objects.create(first_name = first_name,
                                                         last_name = last_name,
                                                         full_name = full_name,
                                                         country = country,
                                                         dob = dob, 
                                                         search = new_search)
        new_individual_entry.save()
        if database == "FBI":
            fbi_result = Result_Match_History.objects.create(name = full_name.title() if full_name else first_name.title() + " " + last_name.title() if first_name else last_name.title(),
                                                            search_type = matching_type,
                                                            database = matching_database if matching_database is not None else fbi_database,
                                                            match = match_identification,
                                                            search = new_search)
            fbi_result.save()
            return {"data": [fbi_search(full_name, first_name, last_name, database = "FBI", type=type)],
                    "match_history_id": {"fbi": fbi_result.id},
                    "search_params": {
                                    "first_name": first_name,
                                    "last_name": last_name,
                                    "full_name": full_name,
                                    "DOB": dob,
                                    "country": country
                                    }
                    }
        if database == "OFAC":
            ofac_result = Result_Match_History.objects.create(name = full_name.title() if full_name else first_name.title() + " " + last_name.title() if first_name else last_name.title(),
                                                            search_type = matching_type,
                                                            database = matching_database if matching_database is not None else ofac_database,
                                                            match = match_identification,
                                                            search = new_search)
            ofac_result.save()
            return {"data": [ofac_search(full_name, first_name, last_name, database = "OFAC", type=type)],
                    "match_history_id": {"fbi": ofac_result.id},
                    "search_params": {
                                    "first_name": first_name,
                                    "last_name": last_name,
                                    "full_name": full_name,
                                    "DOB": dob,
                                    "country": country
                                    }
                    }
        elif database == "Interpol":
            interpol_result = Result_Match_History.objects.create(name = full_name.title() if full_name else first_name.title() + " " + last_name.title() if first_name else last_name.title(),
                                                search_type = matching_type,
                                                database = matching_database if matching_database is not None else interpol_database,
                                                match = match_identification,
                                                search = new_search)
            interpol_result.save()
            return {"data":[interpol_search(full_name, first_name, last_name, database = "Interpol", type=type)],
                    "match_history_id": {"interpol": interpol_result.id},
                    "search_params": {
                                    "first_name": first_name,
                                    "last_name": last_name,
                                    "full_name": full_name,
                                    "DOB": dob,
                                    "country": country
                                    }
                    }
        elif database == "Search all":
            all_data =  [fbi_search(full_name, first_name, last_name, database = "FBI", type=type)]
            all_data.append(interpol_search(full_name, first_name, last_name, database = "Interpol", type=type))
            all_data.append(ofac_search(full_name, first_name, last_name, database = "OFAC", type=type))
            interpol_result = Result_Match_History.objects.create(name = full_name if full_name else first_name + " " + last_name if first_name else last_name,
                                            search_type = matching_type,
                                            database = Database.objects.get(id = 1),
                                            match = match_identification,
                                            search = new_search)
            interpol_result.save()
            fbi_result = Result_Match_History.objects.create(name = full_name if full_name else first_name + " " + last_name if first_name else last_name,
                                            search_type = matching_type,
                                            database = Database.objects.get(id = 2),
                                            match = match_identification,
                                            search = new_search)
            fbi_result.save()
            ofac_result = Result_Match_History.objects.create(name = full_name if full_name else first_name + " " + last_name if first_name else last_name,
                                            search_type = matching_type,
                                            database = Database.objects.get(id = 3),
                                            match = match_identification,
                                            search = new_search)
            ofac_result.save()
            return {"data": all_data,
                    "match_history_id": {"interpol": interpol_result.id,
                                         "fbi": fbi_result.id,
                                         "ofac": ofac_result.id},
                    "search_params": {
                                    "first_name": first_name,
                                    "last_name": last_name,
                                    "full_name": full_name,
                                    "DOB": dob,
                                    "country": country
                                    }
                    }
        

def set_positive_match(request):
    try:
        data = request.data
        match = Result_Match_History.objects.get(id = data['id'])
        link = match.link
        match_identification_id = Match_Identification.objects.get(id=data['match'])
        if len(link) == 0:
            match.match = match_identification_id
            match.link = data['link']
            match.save()
            return JsonResponse({"status": "ok"})
        else:
            additional_match = Result_Match_History.objects.create(name = data.name,
                                            search_type = data.search_type,
                                            database = Database.objects.get(name = data.database),
                                            match = match_identification_id,
                                            search = match.search_id)
            additional_match.save()
    except:
        return JsonResponse({"status": "error"})


def delete_match(request):
    try:
        data = request.data
        match = Result_Match_History.objects.get(id = data['id'])
        match.delete()
        return JsonResponse({"status": "ok"})
    except:
        return JsonResponse({"status": "error"})
    

def load_history(request):
    try:
        user = request.user
        match_history = Result_Match_History.objects.filter(search__user=user).values().order_by('id')
        match_history_values_loaded = []
        for item in match_history:
            search_type = Search_Type.objects.get(id = item['search_type_id']).name
            database = Database.objects.get(id = item['database_id']).name
            match = Match_Identification.objects.get(id=item['match_id']).name
            new_item = {
                "id": item['id'],
                "name" : item['name'],
                "search_type" : search_type,
                "link": item['link'],
                "database": database,
                "match": match,
                "comments": item['comments']
            }
            match_history_values_loaded.append(new_item)
        return JsonResponse({"match_history": match_history_values_loaded})
    except:
        return JsonResponse({"status": "error"})    


def get_match_details(request):
    try:
        data = request.data
        link = data['match_link']
        if "ws-public.interpol.int/notices/v1/un" in link:
            response = requests.get(link)
            data_un = json.loads(response.content)
            match_details =  {
                        "name": data_un['forename'].title() + " " + data_un['name'].title(),
                        "aliases": ", ".join([alias['forename'].title() + " " + alias['name'].title() for alias in data_un['aliases']]),
                        "sex": data_un['sex_id'],
                        "caution": data_un['summary'].strip("\r\n"),
                        "DOB": data_un['date_of_birth'],
                        "race": "not avaialble",
                        "nationality": [get_nationality(nationality) for nationality in data_un['nationalities']] if data_un['nationalities'] != None else "Unknown",
                        "eyes": "not available",
                        "hair": "not available",
                        "scars_and_marks": "not available",
                        "photo": check_for_photo(data_un),
                        }
        elif "ws-public.interpol.int/notices/v1/red" in link:
            response = requests.get(link)
            data_red = json.loads(response.content)
            match_details =  {
                        "name": data_red['forename'].title() + " " + data_red['name'].title(),
                        "aliases": "not available",
                        "sex": data_red['sex_id'],
                        "caution": [warrant['charge'] for warrant in data_red['arrest_warrants']],
                        "DOB": data_red['date_of_birth'],
                        "race": "not avaialble",
                        "nationality": [get_nationality(nationality) for nationality in data_red['nationalities']] if data_red['nationalities'] != None else "Unknown",
                        "eyes": data_red['eyes_colors_id'],
                        "hair": data_red['hairs_id'],
                        "scars_and_marks": data_red['distinguishing_marks'],
                        "photo": check_for_photo(data_red)
                        }
        elif "api.fbi.gov" in link:
            response = requests.get(link)
            data_fbi = json.loads(response.content)
            match_details =  {
                            "name": data_fbi['title'].title(),
                            "aliases":data_fbi['aliases'],
                            "sex": data_fbi['sex'],
                            "caution": data_fbi['caution'].replace("<p>", "").replace("</p>",""),
                            "DOB": data_fbi['dates_of_birth_used'],
                            "race": data_fbi['race'],
                            "nationality": data_fbi['nationality'],
                            "eyes": data_fbi['eyes'],
                            "hair": data_fbi['hair'],
                            "scars_and_marks": data_fbi['scars_and_marks'],
                            "photo": data_fbi['images'][0]["thumb"]}
        else:
            data = {
                "apiKey": os.environ['OFAC'],
                "minScore": 100,
                "source": ["SDN", "NONSDN", "DPL", "UN", "UK", "EU", "DFAT"],
                "cases": [
                    {
                        "name": link
                    }
                ],
            }
            print(data)
            url ="https://search.ofac-api.com/v3"
            response = requests.post(url, json=data)
            response_content = json.loads(response.content)
            print(response_content)
            match = response_content['matches'][link][0]
            match_details =  {
                "name": match['fullName'].title(),
                "aliases": None if match['akas'] == [] else ", ".join([alias['firstName'] + " " + alias['lastName'] for alias in match['akas']]),
                "address": None if match['addresses'] == [] else ", ".join([ address['country'] + " " + address['city'] for address in match['addresses']]),
                "caution": match['source'],
                "DOB": match['dob'],
                "programs": match['programs'],
                "additional_sanctions": " ,".join(match['additionalSanctions']),
                "citizenship": " ,".join(match['citizenship']),
                "passports": None if match['passports'] == [] else ", ".join([passport['passport'] + " " + passport['passportCountry'] for passport in match['passports']])}
        return JsonResponse({"data": match_details})
    except:
        return JsonResponse({"status": "error"})
    

def edit_match(request):
    try:
        data = request.data
        match = Result_Match_History.objects.get(id = data['id'])
        match.comments = data['comments']
        match.save()
        return JsonResponse({"status": "ok"})
    except:
        return JsonResponse({"status": "error"})