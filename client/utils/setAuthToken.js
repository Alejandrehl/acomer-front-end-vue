import api from '../components/services/acomer-services'

const setAuthToken = token => {
    if (token) {
        api.defaults.headers.common['x-auth-token'] = token
    } else {
        delete api.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken