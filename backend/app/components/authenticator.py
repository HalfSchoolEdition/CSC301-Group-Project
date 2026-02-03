from flask import session
from .status_response import StatusCode, Response
from .user import User

class Authenticator():
    
    def signup(email, password):
        if not email or not password:
            return Response("Email and password required", StatusCode.BAD_REQUEST)

        user = User.create_user(email, password)
        if not user:
            return Response("User already exists", StatusCode.BAD_REQUEST)

        return Response("User created", StatusCode.CREATED)

    def login(email, password):
        if not email or not password:
            return Response("Email and password required", StatusCode.BAD_REQUEST)
        
        user = User.get_user(email, password)
        if not user:
            return Response("Invalid credentials", StatusCode.UNAUTHORIZED)
        
        session["user_id"] = user.id
        return Response("Login Success", StatusCode.OK)

    def logout():
        session.pop("user_id", None)
        return Response("Logged out", StatusCode.OK)