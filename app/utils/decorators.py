from flask_jwt_extended import get_jwt
from functools import wraps
from flask import jsonify

# def role_required(role):
#     def wrapper(fn):
#         @wraps(fn)
#         def decorator(*args,**kwargs):
#             claims=get_jwt()
#             if claims.get('role')!=role:
#                 return jsonify({"msg":f"Only {role}s are allowed to access this route"}), 403
#             return fn(*args,**kwargs)
#         return decorator
#     return wrapper


def role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args,**kwargs):
            claims=get_jwt()
            if claims.get('role') not in roles:
                return jsonify({"msg":f"Access denied. Allowed roles: {', '.join(roles)}"}), 403
            return fn(*args,**kwargs)
        return decorator
    return wrapper