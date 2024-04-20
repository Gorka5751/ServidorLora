
const applicationId = "heltec-to-ttn";
const applicationIdTtgo = "ttgo-to-ttn";
const storageType = "uplink_message";
const token = "NNSXS.BQVHDSSLWVZVF2KQWO54AFYVPSH62SGF6PAIVBQ.PXLGU4ZLOU3R4XG5WUOZ4UME52DJO7U4CJABSWPGZKCE6WVX2ELQ";
const tokenTtgo = "NNSXS.3WJ6F4CLCUTKLLTXI64DP75H2MMVD2SKWKZ3HCQ.7H2X5QNAKMIP6AKR3S44P6NB45ZEYPUK7O7TUYG2APSFIRQE3LQQ";
const axios = require('axios');
const express = require('express');
const path = require('path');
const { json } = require('stream/consumers');
// Create an Express application
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));


// Define a route to handle GET requests to the root URL
app.get('/', (req, res) => {
    // Envía el archivo HTML usando res.sendFile()
    res.sendFile(path.join(__dirname, 'index.html'));
  });


  app.get('/data', async (req, res) => {
      // Obtener la fecha actual
  let fechaActual = new Date();

  // Restar 5 minutos
   fechaActual.setMinutes(fechaActual.getMinutes() - 100);

   // Formatear la fecha en formato ISO 8601
   let fechaModificada = fechaActual.toISOString(); 

    const url = `https://eu1.cloud.thethings.network/api/v3/as/applications/${applicationId}/packages/storage/${storageType}`;
    const params = new URLSearchParams({
        limit: '1',
        after: fechaModificada,
        //field_mask: 'up.uplink_message.decoded_payload'
    });

    try {
        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'text/event-stream',
                'Authorization': `Bearer ${token}`
            }
        });
       

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Obtén el valor de temperatura_C del JSON
        //const temperaturaC = data.result.uplink_message.decoded_payload.temperatura_C;
        //const pressiohPa = data.result.uplink_message.decoded_payload.presion_hPa;

        // Envía el JSON como respuesta
        res.json(data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/data-ttgo', async (req, res) => {

  // Obtener la fecha actual
let fechaActual = new Date();

// Restar 5 minutos
fechaActual.setMinutes(fechaActual.getMinutes() - 2);

// Formatear la fecha en formato ISO 8601
let fechaModificada = fechaActual.toISOString();


  const url = `https://eu1.cloud.thethings.network/api/v3/as/applications/${applicationIdTtgo}/packages/storage/${storageType}`;
  const params = new URLSearchParams({
      limit: '1',
      after: fechaModificada,
      //field_mask: 'up.uplink_message.decoded_payload'
  });

  try {
      const response = await fetch(`${url}?${params}`, {
          method: 'GET',
          headers: {
              'Accept': 'text/event-stream',
              'Authorization': `Bearer ${tokenTtgo}`
          }
      });
     

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Obtén el valor de temperatura_C del JSON
      //const missatge = data.result.uplink_message.decoded_payload.dades;
      //const rssi = data.result.uplink_message.rx_metadata[0].rssi;
      // Envía el JSON como respuesta
      res.json(data);

  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
  });


app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Aquí puedes realizar la lógica de autenticación
    // Por ejemplo, verificar si el usuario y la contraseña son correctos
  
    if (username === 'gorka5751' && password === 'Gorka2002') {
      // Si las credenciales son correctas, redirigir al usuario a la página de inicio
      res.redirect('/home');
    } else {
      // Si las credenciales son incorrectas, mostrar un mensaje de error o redirigir a otra página de inicio de sesión
      res.send('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
    }
  });
  






// Define the port number
const PORT = 3000;

// Start the server and make it listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});













//Functions


async function sendPostRequest() {
  try {

      const data = await getDataTTN();

      const config = {
          headers: {
              'Content-Type': 'application/json'
          }
      };

      const response = await axios.post('http://thingsboard.cloud/api/v1/zwnrrzAQpnWv70zhwspB/telemetry', data, config);
      console.log('Petición POST enviada con éxito:', response.data);
  } catch (error) {
      console.error('Error al enviar la petición POST:', error);
  }
}



async function getDataTTN(){
  // Obtener la fecha actual
let fechaActual = new Date();

// Restar 5 minutos
fechaActual.setMinutes(fechaActual.getMinutes() - 100);

// Formatear la fecha en formato ISO 8601
let fechaModificada = fechaActual.toISOString();


const url = `https://eu1.cloud.thethings.network/api/v3/as/applications/${applicationId}/packages/storage/${storageType}`;
const params = new URLSearchParams({
    limit: '1',
    after: fechaModificada,
    //field_mask: 'up.uplink_message.decoded_payload'
});

try {
    const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
            'Accept': 'text/event-stream',
            'Authorization': `Bearer ${token}`
        }
    });
   

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Obtén el valor de temperatura_C del JSON
    const resultat = {
      temperature: data.result.uplink_message.decoded_payload.temperatura_C,
      rssi: data.result.uplink_message.rx_metadata[0].rssi,
      pressure: data.result.uplink_message.decoded_payload.presion_hPa,
    }
    return resultat;


} catch (error) {
    console.error('Error:', error);
}
}
// Intervalo en milisegundos (por ejemplo, cada 2 minuts)
const intervalo = 120000;

// Enviar la petición POST inicialmente y luego cada cierto intervalo de tiempo
sendPostRequest();
setInterval(sendPostRequest, intervalo);
