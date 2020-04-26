'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const superagent = require('superagent');
const PORT = process.env.PORT || 4000;
const app = express();
const methodOverride=require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));

app.set('view engine', 'ejs');
app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
    throw new Error(err);
})


function Digimon(data) {
    this.name = data.name;
    this.img = data.img;
    this.level = data.level;
}

app.get('/', homePage);
function homePage(request, response) {

    superagent(
        `https://digimon-api.herokuapp.com/api/digimon/name/{name}`
    )
        .then(response, () => {
            const dataDigimon = new Digimon(data);
            response.status(200).json(dataDigimon);
            app.redirect('/favorite'), { datashow: show };

        })
        .catch(error, errorHandler);
}

app.get('/favorite', favoritePage);
function favoritePage(request, response) {
    const database = 'SELECT FROM digtable names,img,level';
    client.query(database).then((result) => {
        response.status(200).json(result.rows[0]);
    })

        .then((res) => {
            const datasave = new Digimon(data);
            const SQL = 'INSERT INTO digtable (names,img,level) VALUS($1,$2,$3)'
            const savedata = [datasave.names, datasave.img, datasave.level];
            client.query(SQL, savedata).then(result => {
                response.status(200).json(datasave);
                app.render('pages/favorite');
            })

        })
        .catch(error, errorHandler);
}


app.get('/details', detailspage);
function detailspage(request, response) {
    const database2 = 'SELECT * FROM digtable ';
    client.query(databas).then((result) => {
        app.render('pages/details');
    })
}

app.put('/update', update);
function update(request, response) {
    const SQL = 'UPDATE digtable SET names=$1,img=$2,level=$3';
    client.query(SQL).then((result) => {
        app.render('pages/details');
    })
}

app.delete('/update', deletes);
    function deletes(request, response) {
        const SQL = 'DELET FROM digtable WHERE id=$1';
        client.query(SQL).then((result) => {
            app.render('pages/details');
        })
    }



function errorHandler(error, request, response) {
                response.status(500).send(error);
            }

client.connect().then(app.listen(()=>PORT, console.log(`server listen to port${PORT}`)));