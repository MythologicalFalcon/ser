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

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.textContent = message;

    const timestampElement = document.createElement('span');
    const now = new Date();
    const timestamp = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    timestampElement.textContent = timestamp;

    messageElement.style.backgroundColor = '#f4f4f4';
    messageElement.style.padding = '10px';
    messageElement.style.marginBottom = '10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.position = 'relative';

    timestampElement.style.fontSize = '12px';
    timestampElement.style.position = 'absolute';
    timestampElement.style.bottom = '5px';
    timestampElement.style.right = '5px';

    messageElement.appendChild(timestampElement);

    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;

}

document.getElementById('sendButton').addEventListener('click', sendMessage);

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (message.trim() !== '') {
        // Add message to Firestore
        chatCollection.add({
            text: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear input field
        messageInput.value = '';
    }
}

