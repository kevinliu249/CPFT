import os
class Config:
    # Configurate Mongo_URI to Database named "CPFT" in local MongoDB server
    SECRET_KEY = os.getenv("SECRET_KEY", "12345")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "123456")
    MONGO_URI = "mongodb+srv://liukev:password1234@cluster0.w51pk.mongodb.net/CPFT"
