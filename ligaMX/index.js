const fs = require('fs');
const url = require('url');
const slugify = require('slugify');

const express = require('express');
const { json } = require('body-parser');
const { parse } = require('path');
const path = require('path');
const app = express();

//Leo el archivo de manera asincrona para que lo carge solo una vez
const indexTemplate = fs.readFileSync(
  `${__dirname}/templates/index.html`,
  'utf-8'
);
const equipo_temp = fs.readFileSync(
  `${__dirname}/templates/template_Equipo.html`,
  'utf-8'
);

const equipo_info = fs.readFileSync(
  `${__dirname}/templates/equipo.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const changeTemplate = (temp, ele) => {
  let output = temp.replace(/%EQUIPO%/g, ele.nombre);
  output = output.replace(/%ID%/g, ele.id);
  output = output.replace(/%TITULOS%/g, ele.titulos);
  output = output.replace(/%FUNDACION%/g, ele.fundacion);
  output = output.replace(/%ESCUDO%/g, ele.img);
  output = output.replace(/COLOR/g, ele.color);
  output = output.replace(/%CIUDAD%/g, ele.ciudad);
  output = output.replace(/%ESTADIO%/g, ele.estadio);
  output = output.replace(/%APODO%/g, ele.apodo);
  output = output.replace(/%INFORMACION%/g, ele.info);
  output = output.replace(/%GOLEADOR%/g, ele.goleador);
  return output;
};

app.get('/', (req, res) => {
  res.writeHead(200),
    {
      'Content-type': 'text/html',
    };
  const outputHTML = dataObj
    .map((ele) => changeTemplate(equipo_temp, ele))
    .join('');
  let output = indexTemplate.replace(/%EQUIPOS DE LA LIGA MX%/, outputHTML);

  res.end(output);
});

//PENDIENTE ENCONTRAR URL
app.get('/equipo', (req, res) => {
  //PARSEAR UNA URL
  const { query, pathname } = url.parse(req.url, true);
  const equipo = query.id;

  res.writeHead(200),
    {
      'Content-type': 'text/html',
    };

  const outputHTML = dataObj[equipo];
  const output = changeTemplate(equipo_info, outputHTML);

  res.end(output);
});

app.listen(3000, (req, res) => {
  console.log('Listening on port 3000');
});
