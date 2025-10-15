def validate_email(email):
    import re
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.(com)$"
    return re.match(pattern, email) is not None

def validate_password(password):
    return len(password) >= 6