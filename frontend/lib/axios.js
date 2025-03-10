import axios from 'axios';
 const baseurl=axios.create( {
    // eslint-disable-next-line no-undef
    baseURL:'http://localhost:3500/api',
    withCredentials:true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default baseurl;