from django.utils import timezone
from django.http import JsonResponse
from .models import Search_Type, Database, Search, Searched_Databases, Individual, Match_Identification, Result_Match_History
from .helpers import strip_after_dash_if_comma, find_similar_names, find_name_variations, get_nationality, check_for_photo
import json
import requests
from datetime import datetime


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


def fbi_search(full_name, first_name, last_name, database, type):
    name_to_pass = ""
    if len(full_name) > 0:
        name_to_pass = full_name
    elif len(first_name)> 0 and len(last_name) > 0:
        name_to_pass = first_name + " " + last_name
    else:
        name_to_pass = last_name
    endpoint = f'https://api.fbi.gov/wanted/v1/list?title={name_to_pass}'
    response = requests.get(endpoint)
    data = json.loads(response.content)
    if data['items'] == []:
        return {"data": "None", 
                "database": database,
                "type": type}
    else:
        all_hits_generalized = [{"uid": potential_match['uid'],
                                "name":strip_after_dash_if_comma(potential_match['title']),
                                "aliases":potential_match['aliases']} 
                                for potential_match in data['items']]
        if len(all_hits_generalized) > 1:
            likely_matches = find_similar_names(name_to_pass, all_hits_generalized)
        else:
            likely_matches = all_hits_generalized[0]['uid']
        data_matches = [    {"uid": match['uid'],
                            "name": match['title'].title(),
                            "aliases":match['aliases'],
                            "sex": match['sex'],
                            "caution": match['caution'].replace("<p>", "").replace("</p>","") if match['caution'] else None,
                            "DOB": match['dates_of_birth_used'],
                            "race": match['race'],
                            "nationality": match['nationality'],
                            "eyes": match['eyes'],
                            "hair": match['hair'],
                            "scars_and_marks": match['scars_and_marks'],
                            "photo": match['images'][0]["thumb"],
                            "source": match['@id']} 
                            for match in data['items'] if match['uid'] in likely_matches]
        if data_matches == []:
            return {"data": "None", 
                "database": database,
                "type": type}
        else:
            return {"data": data_matches, 
                "database": database,
                "type": type}


def interpol_search(full_name, first_name, last_name, database, type):
    data_matches = []
    data_matches_ids = []
    if first_name and last_name:
        name_list = [[first_name, last_name]]
    elif len(full_name) > 3:
        name_list = find_name_variations(full_name)
    elif not first_name and not full_name and last_name:
        name_list = [["", last_name]]
    all_possible_last_names = [last_name, full_name.split(" ")]
    for name in name_list:
        if len(name[1])> 0 and len(name[0])> 0:
            endpoint_one = f"https://ws-public.interpol.int/notices/v1/red?name={name[1]}&forename={name[0]}"
        else:
            endpoint_one = f"https://ws-public.interpol.int/notices/v1/red?name={name[1]}"
        response = requests.get(endpoint_one)
        data = json.loads(response.content)
        if data['total'] > 0:
            for match in data['_embedded']['notices']:
                details_call_endpoint = match["_links"]["self"]["href"]
                details_response = requests.get(details_call_endpoint)
                details_data = json.loads(details_response.content)
                if not details_data['entity_id'] in data_matches_ids:
                    potential_match =  {"uid": details_data['entity_id'],
                                    "name": details_data['forename'].title() + " " + details_data['name'].title(),
                                    "aliases": "not available",
                                    "sex": details_data['sex_id'],
                                    "caution": [warrant['charge'] for warrant in details_data['arrest_warrants']],
                                    "DOB": details_data['date_of_birth'],
                                    "race": "not avaialble",
                                    "nationality": [get_nationality(nationality) for nationality in details_data['nationalities']] if details_data['nationalities'] != None else "Unknown",
                                    "eyes": details_data['eyes_colors_id'],
                                    "hair": details_data['hairs_id'],
                                    "scars_and_marks": details_data['distinguishing_marks'],
                                    "photo": check_for_photo(details_data),
                                    "source": details_data['_links']['self']['href']}
                    data_matches.append(potential_match)
                    data_matches_ids.append(details_data['entity_id'])
    for name in all_possible_last_names:
        if len(name) > 1:
            endpoint_un = f'https://ws-public.interpol.int/notices/v1/un?name={name}'
            un_response = requests.get(endpoint_un)
            data_un = json.loads(un_response.content)
            if data_un['total'] > 0:
                for match in data_un['_embedded']['notices']:
                    details_un_call_endpoint = match["_links"]["self"]["href"]
                    details_un_response = requests.get(details_un_call_endpoint)
                    details_un_data = json.loads(details_un_response.content)
                    if not details_un_data['entity_id'] in data_matches_ids:
                        potential_match =  {"uid": details_un_data['entity_id'],
                                        "name": details_un_data['forename'].title() + " " + details_un_data['name'].title(),
                                        "aliases": ", ".join([alias['forename'].title() + " " + alias['name'].title() for alias in details_un_data['aliases']]),
                                        "sex": details_un_data['sex_id'],
                                        "caution": details_un_data['summary'].strip("\r\n"),
                                        "DOB": details_un_data['date_of_birth'],
                                        "race": "not avaialble",
                                        "nationality": [get_nationality(nationality) for nationality in details_un_data['nationalities']] if details_un_data['nationalities'] != None else "Unknown",
                                        "eyes": "not available",
                                        "hair": "not available",
                                        "scars_and_marks": "not available",
                                        "photo": check_for_photo(details_un_data),
                                        "source": details_un_data['_links']['self']['href']
                                        }
                        data_matches.append(potential_match)
                        data_matches_ids.append(details_un_data['entity_id'])
    if data_matches == []:   
        return {"data": "None",
                "database": database,
                "type": type}
    else:
        return {"data": data_matches,
                "database": database,
                "type": type}


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
        new_search_fbi = Searched_Databases.objects.create(database = fbi_database, search = new_search)
        new_search_fbi.save()
        new_search_interpol = Searched_Databases.objects.create(database = interpol_database, search = new_search)
        new_search_interpol.save()
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
            return {"data": all_data,
                    "match_history_id": {"interpol": interpol_result.id,
                                         "fbi": fbi_result.id},
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
        match_history = list(Result_Match_History.objects.values().order_by('id'))
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
        if "ws-public.interpol.int/notices/v1/red" in link:
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