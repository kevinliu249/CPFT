# Main entry point that runs the app and starts the server.

import os
from flask import Flask, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from .services.notification_service import send_daily_motivational_emails
from controllers.user_controller import user_controller
from controllers.survey_controller import survey_controller
from controllers.fitness_plan_controller import fitness_plan_controller
from controllers.workout_controller import workout_controller
from controllers.exercise_search_controller import exercise_search_controller
from services.auth_service import auth_bp
from services.metrics_service import metrics_bp
from services.login import login_bp
from config import Config
from flask_jwt_extended import JWTManager

app = Flask(__name__, static_folder="frontend/build", static_url_path='')
app.config.from_object(Config)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

app.config['JWT_SECRET_KEY'] = '12345'  # Use a strong secret key in real life
jwt = JWTManager(app)

# Enable CORS for your frontend domain (React app)
CORS(app)  # Allow requests only from React app on localhost:3000

# Initialize PyMongo
mongo = PyMongo(app)
app.mongo = mongo

# Register the controller for user routes
app.register_blueprint(user_controller)
app.register_blueprint(survey_controller)
app.register_blueprint(fitness_plan_controller)
app.register_blueprint(workout_controller)
app.register_blueprint(exercise_search_controller)
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(metrics_bp, url_prefix='/api')
app.register_blueprint(login_bp, url_prefix='/api')

# --- WRAPPER FUNCTION ---
# Wrap to send_daily_motivational_emails in a function that enters the app context.
def send_emails_with_context():
    with app.app_context():
        send_daily_motivational_emails()

# Set up scheduler
scheduler = BackgroundScheduler()
# Schedule to run once a day at 9:30 PM (21:30)
scheduler.add_job(
    func=send_emails_with_context,  # Calls the wrapper instead of send_daily_motivational_emails directly, calling directly failed. 
    trigger='cron',
    hour=21,
    minute=50
)
scheduler.start()

# Shuts down app properly
if __name__ == '__main__':
    try:
        app.run(debug=True)
    finally:
        # Ensure the scheduler shuts down when the app does
        scheduler.shutdown()
