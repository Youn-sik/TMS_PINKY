export default function auth() {
    var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
    if(value === null) {
        history.push('/sign-in')
    } else {
        axios.get('http://172.16.135.89:3000/auth?token='+value[2])
        .then((res) => {
            if(res.data.auth === false) {
                history.push('/sign-in')
            } else {
                console.log('is auth')
            }
        })
    }
}