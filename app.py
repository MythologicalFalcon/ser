import os
from xml.dom.minidom import Document
from flask import Flask, request, render_template, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from google.auth import exceptions
from google.auth import exceptions
from google.cloud import texttospeech
import openai
import pprint
import google.generativeai as palm
import datetime

app = Flask(__name__)

# Initialize Firebase Admin SDK with error handling
# Initialize OpenAI API with your API key
openai.api_key = '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'
cred = credentials.Certificate('firebase-credentials.json')
firebase_admin.initialize_app(cred)
        
# Initialize Firestore
db = firestore.client()
messages_ref = db.collection('chat')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send-message', methods=['POST'])
def send_message():
    print("insends")
    message = request.form['message']
    response = generatePalmResponse(message)
    print("###",response)
    if firebaseStoring(message,response) == 200:
        print("stored in firebase")
    else:
        print("Error while stoting")
    return jsonify({'Reply': response})

def generatePalmResponse(userMessage):
    palm.configure(api_key='AIzaSyB-a2U5Rwv2JVN7_6sq35ZGFug3EuUPfhE')
    print("user Message is ", userMessage)
    models = [m for m in palm.list_models() if 'generateText' in m.supported_generation_methods]
    model = models[0].name
    completion = palm.generate_text(
    model=model,
    prompt=userMessage,
    temperature=0,
    # The maximum length of the response
    max_output_tokens=800,)
    print(completion.result)
    return (completion.result)

def firebaseStoring(message, response):
    try:
        # Initialize Firebase Admin SDK
        
        print("firebase connection Initialized")
        timestamp = datetime.datetime.now()
        messages_ref.add({'message': message,'response' : response,'timestamp':timestamp})
        return 200
    except Exception as e:
        print(e)
        return 500






if __name__ == '__main__':
    app.run(debug=True)
