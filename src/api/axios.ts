import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://192.168.1.110:8080/api', // URL del backend
    timeout: 10000, // Timeout in millisecondi
    headers: { 'Content-Type': 'application/json' }
});

export default instance;
