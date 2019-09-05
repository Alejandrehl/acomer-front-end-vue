import axios from 'axios'

var adminApi = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 
      'https://acomeradmin.cl/' :
      'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json'
    }
})

export default adminApi