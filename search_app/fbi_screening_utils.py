from .helpers import strip_after_dash_if_comma, find_similar_names
import json
import requests


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
                            "aliases": None if match['aliases'] == None else ", ".join(match['aliases']),
                            "sex": match['sex'],
                            "caution": match['caution'].replace("<p>", "").replace("</p>","") if match['caution'] else None,
                            "DOB":  None if match['dates_of_birth_used'] == None else ", ".join(match['dates_of_birth_used']),
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