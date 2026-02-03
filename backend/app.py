from app import create_app

app = create_app()

@app.route('/user', methods=['POST'])
def handle_user():
    data = request.get_json()
    
    if data and data.get("command") == "create":
        # Extract the user data
        user_id = data.get("id")
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        
        # TODO: Still needs to pass data to database, for now just returns success message
        return jsonify({"message": "User created successfully", "user": username}), 201
    
    return jsonify({"error": "Invalid command or data"}), 400

if __name__ == "__main__":
    app.run(debug=True)
