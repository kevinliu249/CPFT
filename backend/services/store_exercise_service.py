# stores exercise data
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)

# MongoDB Connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/cpft"
mongo = PyMongo(app)

