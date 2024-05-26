const API_URL = 'http://localhost:9000/api'

export const register = async(userDetails) =>{
    const url = `${API_URL}/register`
    const options = {
        method :'POST',
        headers :{
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(userDetails)
    }

    const response = await fetch(url,options)
    console.log(response.status)
    const message = await response.text()
    return message
}

export const login = async(username,password)=>{
    const url = `${API_URL}/login`
    const options = {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Accept' : 'application/json',
        },
        body : JSON.stringify({username,password})
    }

    const response = await fetch(url,options)
    const jsonData = await response.json()

    if(jsonData.jwtToken){
        localStorage.setItem('user', JSON.stringify(jsonData))
    }
    return jsonData
}

export const logout = () => {
    localStorage.removeItem('user')
}

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'))
}