# Listed
Sanctions Screening/Due Dilligence App

About the Project

The aim of this project is to develop a simple tool to easily verify if an individual or entity is sanctioned or appear on FBI/Interpol lists and assess potential risks. To achieve this, at least two public APIs such as Interpol, OFAC or FBI will be used, which will enable cross-referencing individuals and/or entities against sanctioned lists, FBI wanted lists, and Interpol notices.

How will it work?

The user will provide the name of the entity or individual along with other pertinent details such as date of birth or address. These details will be utilized to send API requests to Interpol, OFAC, and FBI to determine if the individual or entity is listed in their public databases. The system will then provide the user with comprehensive information regarding the searched party if found. The system will also save the search results to the database, allowing the system to automatically cross-reference any new searches with previous ones. 

The project will additionally implement:
  - two CRUD-ing resources (users, search history)
  - User Authentication

Sources:
  - https://www.fbi.gov/wanted/api
  - https://interpol.api.bund.dev/
  - https://ofac-api.com/documentation/v3/index.html 
