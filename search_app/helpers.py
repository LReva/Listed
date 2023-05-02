from difflib import SequenceMatcher
from pycountry import countries


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


def get_country_code(country_name):
    """transforms country names to standardized two-letter codes (ISO 3166-1 alpha-2 codes"""
    try:
        country = countries.search_fuzzy(country_name)[0]
        return country.alpha_2
    except LookupError:
        return None
    
def get_nationality(country_code):
    """transforms two-letter codes (ISO 3166-1 alpha-2 codes to nationality names"""
    try:
        nationality = countries.get(alpha_2=country_code).name
        return nationality
    except LookupError:
        return None
    

def find_name_variations(full_name):
    """returns a list of variations of the how a full name could be divided into a first and a last name"""
    name_variations = []
    full_name_split = full_name.split()
    name_count = len(full_name_split)
    for i in range (1, name_count):
        first_name = " ".join(full_name_split[:i])
        last_name = " ".join(full_name_split[i:])
        name_variations.append([first_name, last_name])
        name_variations.append([last_name, first_name])   
    return name_variations


def check_for_photo(details_data):
    try:
        photo = details_data['_links']['thumbnail']["href"] 
    except KeyError:
        photo = "not available"
    return photo


# extra params and name variations should be included for future version
# def verify_query_params(full_name, first_name, last_name, dob, country):
def verify_query_params(full_name, first_name, last_name):
    name = ""
    if len(full_name) > 0:
        name = full_name
    elif len(last_name) > 0:
        if len(first_name) > 0:
            name = first_name + " " + last_name
        else:
            name = last_name
    # for name in names:
    #     params = []
    #     params.append({"name": name})
        # if len(dob) > 0:
        #     "dob": dob

        # if country != "Not selected":
        #     "citizenship": country
    return name