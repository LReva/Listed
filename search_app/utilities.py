# from .models import Search
from difflib import SequenceMatcher
from django.http import JsonResponse
import json
import requests


def find_similar_names(match_name, name_list):
    """Compares a full name against a list of other full names and returns only those full names 
    from the list that are 90% or higher match to the full name.
    
    Args:
        name (str): The full name to compare against.
        name_list (list): A list of full names to compare to.
    
    Returns:
        list: A list of full names that are 90% or higher match to the full name.
    """
    matches = []
    for name in name_list:
        match_ratio = SequenceMatcher(None, match_name.lower(), name.lower()).ratio()
        if match_ratio >= 0.9:
            matches.append(name)
    return matches


def strip_words(words_list):
    """Strips every word after a dash from each string in a list.
    
    Args:
        words_list (list): A list of strings.
    
    Returns:
        list: A list of strings with every word after a dash removed.
    """
    result = []
    for s in words_list:
        index = s.find('-')
        if index != -1:
            result.append(s[:index].strip())
        else:
            result.append(s.strip())
    return result


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
        all_names = [potential_match['title'] for potential_match in data['items']]
        all_names_stripped_of_location = strip_words(all_names)
        likely_match = find_similar_names(name_to_pass, all_names_stripped_of_location)
        print(likely_match)

        return JsonResponse({"data": data})