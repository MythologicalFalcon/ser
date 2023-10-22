// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvL5L3SAtd_Q1T_pxU56GWttErgSdp9zc",
    authDomain: "kahuoi-test.firebaseapp.com",
    databaseURL: "https://kahuoi-test-default-rtdb.firebaseio.com",
    projectId: "kahuoi-test",
    storageBucket: "kahuoi-test.appspot.com",
    messagingSenderId: "79750544866",
    appId: "1:79750544866:web:136d8e868ea2c30ccdcdbb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// UI Logic
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Reference to the chat messages container
const chatMessages = document.getElementById('chatMessages');

// Reference to the Firestore collection
const chatCollection = db.collection('chat');

// Listen for new messages in real-time
chatCollection.orderBy('timestamp').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
            // Handle new messages
            const data = change.doc.data();
            displayMessage(data.text);
        }
    });
});

function addMessageToFirestore(message) {
    chatCollection.add({
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(() => {
            console.log('Message added successfully');
        })
        .catch((error) => {
            console.error('Error adding message: ', error);
        });
}
export function displayMessage(message, isReceived = false) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', isReceived ? 'received-message' : 'sent-message');

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message;

    const timestampElement = document.createElement('span');
    const now = new Date();
    const timestamp = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    timestampElement.textContent = timestamp;
    timestampElement.classList.add('timestamp'); // Add the timestamp class

    messageElement.appendChild(timestampElement);
    messageContainer.appendChild(messageElement);

    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// To display a received message:
//displayMessage("This is a received message.", true);


document.getElementById('sendButton').addEventListener('click', sendMessage);

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const userMessage = messageInput.value;

    if (userMessage.trim() !== '') {
        // Send the user's message to OpenAI
        const response = await sendToOpenAI(userMessage);

        // Add the user's message to Firestore
        addMessageToFirestore(userMessage);

        // Add the AI-generated response to Firestore
        addMessageToFirestore(response);

        // Clear the input field
        messageInput.value = '';
    }
}
/*
const apiKey = 'AIzaSyB-a2U5Rwv2JVN7_6sq35ZGFug3EuUPfhE'; // Replace with your actual API key
const endpoint = 'https://google-palm-ai.vercel.app/api/generate'; // Replace with the actual API endpoint

async function sendToOpenAI(userMessage) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: userMessage,
                // Add any other parameters required by the PALM model
            }),
        });

        if (response.status === 200) {
            const data = await response.json();
            return data; // Adjust to extract the desired response
        } else {
            console.error('Unexpected response status:', response.status);
            return 'An error occurred while generating a response.';
        }
    } catch (error) {
        console.error('Error sending message to PALM:', error);
        return 'An error occurred while generating a response.';
    }
}*/

async function sendToOpenAI(userMessage) {
    try {
        const { TextServiceClient } =
  require("@google-ai/generativelanguage").v1beta2;

const { GoogleAuth } = require("google-auth-library");
//import GoogleAuth from google-auth-library;

const MODEL_NAME = "models/text-bison-001";
const API_KEY = 'AIzaSyB-a2U5Rwv2JVN7_6sq35ZGFug3EuUPfhE';

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const prompt = userMessage;

client
  .generateText({
    model: MODEL_NAME,
    prompt: {
      text: prompt,
    },
  })
  .then((result) => {
    return result;
    console.log(JSON.stringify(result, null, 2));
  });
    } catch (error) {
        displayMessage(error, true);
        console.error('Error sending message to PALM:', error);
        return 'An error occurred while generating a response.';
    }
}