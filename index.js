const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const firebase = require('firebase-admin');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

function getItems(){
    const ref = firebaseApp.database().ref('/user/user_1');
    return ref.once('value').then(snapshot => snapshot.val());
}

app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    getItems().then(user => {
        console.log(user);
        response.render('index', { user });
    });
});

 exports.app = functions.https.onRequest(app);