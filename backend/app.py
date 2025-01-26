# Main entry point that runs the app and starts the server.

from flask import Flask
from flask_pymongo import PyMongo
from controllers.user_controller import user_controller
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Initialize PyMongo
mongo = PyMongo(app)

# Register the controller for user routes
app.register_blueprint(user_controller)

if __name__ == '__main__':
    app.run(debug=True)