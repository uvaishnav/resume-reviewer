const API_URL = process.env.REACT_APP_API_URL;

export const register = async(userDetails) =>{
    const url = `${API_URL}/api/register`
    const config = {
        method :'POST',
        headers :{
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(userDetails)
    }

    const response = await fetch(url,config)
    console.log(response.status)
    const message = await response.text()
    return message
}

export const login = async(username,password)=>{
    const url = `${API_URL}/api/login`
    const config = {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({username,password})
    }

    const response = await fetch(url,config)
    // const jsonData = await response.json()
    const resultData = await response.json()

    if(resultData.jwtToken){
        localStorage.setItem('user', JSON.stringify(resultData))
    }
    return resultData
}

export const logout = () => {
    localStorage.removeItem('user')
}

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'))
}