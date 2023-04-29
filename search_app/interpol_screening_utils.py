from .helpers import find_name_variations, get_nationality, check_for_photo
import json
import requests


def interpol_search(full_name, first_name, last_name, database, type):
    data_matches = []
    data_matches_ids = []
    if first_name and last_name:
        name_list = [[first_name, last_name]]
    elif len(full_name) > 3:
        name_list = find_name_variations(full_name)
    elif not first_name and not full_name and last_name:
        name_list = [["", last_name]]
    all_possible_last_names = full_name.split(" ")
    all_possible_last_names.append(last_name)
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