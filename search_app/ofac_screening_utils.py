import json
import requests
from dotenv import load_dotenv
import os
from .helpers import verify_query_params

load_dotenv()

#program descriptions for the future
programs = {
    "SDGT": "Specially Designated Global Terrorists",
    "IRAQ2": "Anti-Terrorism Designation"
}

# def ofac_search(full_name, first_name, last_name, dob, country, database, type):
def ofac_search(full_name, first_name, last_name, database, type):
    name_to_match = verify_query_params(full_name, first_name, last_name)
    data_matches = []
    data = {
        "apiKey": os.environ['OFAC'],
        "minScore": 100,
        "source": ["SDN", "NONSDN", "DPL", "UN", "UK", "EU", "DFAT"],
        "cases": [
            {
                "name": name_to_match
            }
        ],
        "type": [type],
        # "includeAlias": True,
        # "informalName": True
    }
    print(data)
    url ="https://search.ofac-api.com/v3"
    response = requests.post(url, json=data)
    response_content = json.loads(response.content)
    print(response_content)
    matches = response_content['matches'][name_to_match]
    if matches == []:   
        return {"data": "None",
                "database": database,
                "type": type}
    else:
        data_matches = []
        for match in matches:
            potential_match =  {"uid": match['uid'],
                "name": match['fullName'].title(),
                "aliases": None if match['akas'] == [] else ", ".join([alias['firstName'].title() + " " + alias['lastName'].title() for alias in match['akas']]),
                "address": None if match['addresses'] == [] else ", ".join([ address['country'] + " " + address['city'] for address in match['addresses']]),
                "caution": match['source'],
                "DOB": match['dob'],
                "programs": match['programs'],
                "additional_sanctions": " ,".join(match['additionalSanctions']),
                "citizenship": ", ".join(match['citizenship']),
                "passports": None if match['passports'] == [] else ", ".join([passport['passport'] + " " + passport['passportCountry'] for passport in match['passports']]),
                "source":  match['fullName'].title()}
            data_matches.append(potential_match)
        print(data_matches)
        return {"data": data_matches,
                "database": database,
                "type": type}