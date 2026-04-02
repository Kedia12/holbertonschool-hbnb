from flask_jwt_extended import get_jwt

def require_admin():
    claims = get_jwt()
    if not claims.get("is_admin"):
        return {"error": "Admin privileges required"}, 403
    return None
