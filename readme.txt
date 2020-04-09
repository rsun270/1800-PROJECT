# GymFinder
GymFinder is an application that helps users find nearby gyms.

## Features
- User accounts/authentication

GymFinder allows you to submit a postal code and find nearby gyms sorted
by:

    - Distance
    - Price

You may also select gym amenities as filters:

    - Pool
    - Female-Only
    - Free parking
    - 24/7
    - Trainers
    - Multiple locations

## API Usage
Google Geocoding API was used in order to return latitude and longitude
coordinates given a postal code. This allowed us to calculate distance using
the haversine formula.



