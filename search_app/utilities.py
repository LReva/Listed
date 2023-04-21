# from .models import Search
from difflib import SequenceMatcher
from django.http import JsonResponse
import json
import requests


def find_similar_names(match_name, data_dict):
    """Compares a full name against a dict with keys of id, name and aliases and returns a list of ids of only those names 
    that are 90% or higher match to the full name.
    
    Returns:
        list: A list of ids that are 90% or higher match to the full name.
    """
    matching_ids = []
    for item in data_dict:
        # Compare name and aliases of each item to the input name
        match_ratio = 0
        if item['aliases'] != None:
            for alias in item['aliases'] + [item['name']]:
                ratio = SequenceMatcher(None, match_name.lower(), alias.lower()).ratio()
                if ratio > match_ratio:
                    match_ratio = ratio
            # If match ratio is greater than 0.9, add the item ID to the list of matching IDs
            if match_ratio >= 0.9:
                matching_ids.append(item['uid'])
        else:
            match_ratio = SequenceMatcher(None, match_name.lower(), item['name'].lower()).ratio()
            if match_ratio >= 0.9:
              matching_ids.append(item['uid'])
    return matching_ids


def strip_after_dash_if_comma(s):
    """Strips every word after a dash from the string if the part after the dash has a comma."""
    index = s.find('-')
    if index != -1:
        part_after_dash = s[index+1:].strip()
        if ',' in part_after_dash:
            s = s[:index].strip()
    return s


def search_database(request):
    first_name = request.data['first_name']
    last_name = request.data['last_name']
    full_name = request.data['full_name']
    dob = request.data['dob']
    database = request.data['database']
    if database == "FBI":
        name_to_pass = ""
        if len(full_name) > 0:
            name_to_pass = full_name
        else:
            name_to_pass = first_name + " " + last_name
        endpoint = f'https://api.fbi.gov/wanted/v1/list?title={name_to_pass}'
        response = requests.get(endpoint)
        data = json.loads(response.content)
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
        return JsonResponse({"data": data_matches})