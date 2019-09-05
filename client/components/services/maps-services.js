import axios from 'axios'


const mapsService = axios.create({
  baseURL: `${'https://cors-anywhere.herokuapp.com/'}https://maps.googleapis.com/maps/api/`,
  timeout: 10000,
  headers: {'content-type': 'application/json'}
});


export default mapsService