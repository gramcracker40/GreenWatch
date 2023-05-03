"""
Contains the blocklist of the application. Meaning any JWT's that are created are
stored here in this file when logged out or they become expired. open it read them 
into a set and close it so we can write to them whenever the application expires and
during the runtime. 

"""

def initialize_blocklist():
    blocked_jwt_file = open("blocklist.txt", "r")
    BLOCKLIST = set(blocked_jwt_file.readlines())
    blocked_jwt_file.close()

    return BLOCKLIST


def add_blocked_jwt(jwt):
    blocked_jwt_file = open("blocklist.txt", "a")
    blocked_jwt_file.write(f"{jwt}\n")
    blocked_jwt_file.close()

    BLOCKLIST.add(jwt)


BLOCKLIST = initialize_blocklist()