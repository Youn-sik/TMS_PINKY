import {base_url} from'server.json'
export default function auth() {
    var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
    if(value === null) {
        history.push('/sign-in')
    } else {
        axios.get(base_url+'/auth?token='+value[2])
        .then((res) => {
            if(res.data.auth === false) {
                history.push('/sign-in')
            } else {
                console.log('is auth')
            }
        })
    }
}