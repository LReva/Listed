from django.utils import timezone
from .models import Search_Type, Database, Search, Searched_Databases, Individual, Match_Identification, Result_Match_History
from .helpers import strip_after_dash_if_comma, find_similar_names, get_country_code, find_name_variations, get_nationality, check_for_photo
import json
import requests


def get_matching_search_type(type):
    matching_type = Search_Type.objects.get(name = type)
    return matching_type

# would be eventually used to load database lists to the webpage based on search types
def get_all_databases():
    all_databases = Database.objects.all()
    return all_databases


def get_matching_database(name):
    matching_database = Database.objects.get(name = name)
    return matching_database


def get_all_match_identifications():
    all_match_identifications = Match_Identification.objects.all()
    return all_match_identifications


def fbi_search(full_name, first_name, last_name, database):
    name_to_pass = ""
    if len(full_name) > 0:
        name_to_pass = full_name
    else:
        name_to_pass = first_name + " " + last_name
    endpoint = f'https://api.fbi.gov/wanted/v1/list?title={name_to_pass}'
    response = requests.get(endpoint)
    data = json.loads(response.content)
    if data['items'] == []:
        return {"data": "None", 
                "database": database}
    else:
        all_hits_generalized = [{"uid": potential_match['uid'],
                                    "name":strip_after_dash_if_comma(potential_match['title']),
                                "aliases":potential_match['aliases']} 
                                for potential_match in data['items']]
        likely_matches = find_similar_names(name_to_pass, all_hits_generalized)
        data_matches = [    {"uid": match['uid'],
                            "name": match['title'].title(),
                            "aliases":match['aliases'],
                            "sex": match['sex'],
                            "caution": match['caution'].replace("<p>", "").replace("</p>",""),
                            "DOB": match['dates_of_birth_used'],
                            "race": match['race'],
                            "nationality": match['nationality'],
                            "eyes": match['eyes'],
                            "hair": match['hair'],
                            "scars_and_marks": match['scars_and_marks'],
                            "photo": match['images'][0]["thumb"],
                            "sorce": match['@id']} 
                            for match in data['items'] if match['uid'] in likely_matches]
        return {"data": data_matches, 
                "database": database}


def interpol_search(full_name, first_name, last_name, database):
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
        endpoint_one = f"https://ws-public.interpol.int/notices/v1/red?name={name[1]}&forename={name[0]}"
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
                                    "nationality": [get_nationality(nationality) for nationality in details_data['nationalities']],
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
                                        "nationality": [get_nationality(nationality) for nationality in details_un_data['nationalities']],
                                        "eyes": "not available",
                                        "hair": "not available",
                                        "scars_and_marks": "not available",
                                        "photo": check_for_photo(details_un_data),
                                        "source": details_data['_links']['self']['href']
                                        }
                        data_matches.append(potential_match)
                        data_matches_ids.append(details_un_data['entity_id'])
    if data_matches == []:   
        return {"data": "None",
                "database": database}
    else:
        return {"data": data_matches,
                "database": database}


def search_database(request):
    type = request.data['type']
    database = request.data['database']
    matching_type = get_matching_search_type(type)
    # new_search = Search.objects.create(user = request.user, search_type = matching_type, search_time = timezone.localtime())
    # new_search.save()
    # if database == "Search all":
    #     #below should be refactored once OFAC is available
    #     fbi_database = get_matching_database(name = "FBI")
    #     interpol_database = get_matching_database(name = "Interpol")
    #     new_search_fbi = Searched_Databases.objects.create(database = fbi_database, search = new_search)
    #     new_search_fbi.save()
    #     new_search_interpol = Searched_Databases.objects.create(database = interpol_database, search = new_search)
    #     new_search_interpol.save()
    # else:
    #     matching_database = get_matching_database(database)
    #     new_search_database = Searched_Databases.objects.create(database = matching_database, search = new_search)
    #     new_search_database.save()
    if type == "Individual":
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        full_name = request.data['full_name']
        dob = request.data['dob']
        if dob == "":
            dob = None
        country = request.data["country"]
        # new_individual_entry = Individual.objects.create(first_name = first_name,
        #                                                  last_name = last_name,
        #                                                  full_name = full_name,
        #                                                  country = country,
        #                                                  dob = dob, 
        #                                                  search = new_search)
        # new_individual_entry.save()
        if database == "FBI":
            return {"data": [fbi_search(full_name, first_name, last_name, database = "FBI")],
                    "search_params": {"first_name": first_name,
                    "last_name": last_name,
                    "full_name": full_name,
                    "DOB": dob,
                    "country": country}}
        elif database == "Interpol":
            return {"data":[interpol_search(full_name, first_name, last_name, database = "Interpol")],
                    "search_params": {"first_name": first_name,
                    "last_name": last_name,
                    "full_name": full_name,
                    "DOB": dob,
                    "country": country}}
        elif database == "Search all":
            all_data =  [fbi_search(full_name, first_name, last_name, database = "FBI")]
            all_data.append(interpol_search(full_name, first_name, last_name, database = "Interpol"))
            return {"data": all_data,
                    "search_params": {"first_name": first_name,
                    "last_name": last_name,
                    "full_name": full_name,
                    "DOB": dob,
                    "country": country}}