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
    var ref = firebaseApp.database().ref('/product/');
    return ref.orderByChild('productStatus').equalTo('active')
        .once('value').then(snapshot => snapshot.val());
}

app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    getItems().then(product => {
        console.log(product);
        response.render('index', { product });
    });
});

 exports.app = functions.https.onRequest(app);