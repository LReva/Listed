# from .models import Search
from .helpers import strip_after_dash_if_comma, find_similar_names, get_country_code, find_name_variations, get_nationality, check_for_photo
import json
import requests


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
                            "name": match['title'],
                            "aliases":match['aliases'],
                            "sex": match['sex'],
                            "caution": match['caution'].replace("<p>", "").replace("</p>",""),
                            "DOB": match['dates_of_birth_used'],
                            "race": match['race'],
                            "nationality": match['nationality'],
                            "eyes": match['eyes'],
                            "hair": match['hair'],
                            "scars_and_marks": match['scars_and_marks'],
                            "photo": match['images'][0]["thumb"]} 
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
                                    "photo": check_for_photo(details_data)}
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
                                        "photo": check_for_photo(details_un_data)
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
    first_name = request.data['first_name']
    last_name = request.data['last_name']
    full_name = request.data['full_name']
    dob = request.data['dob']
    database = request.data['database']
    country = request.data["country"]
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