const config = require('config.json');
const jwt = require('jsonwebtoken');
const users = [{ id: 1, username: 'john', password: 'doe'}];
const axios = require('axios');

module.exports = {
    login,
    webhook,
    encode,
    getAll
};

async function login({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) throw 'Username or password is incorrect';

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });

    return {
        ...omitPassword(user),
        token
    };
}

async function getAll() {
    return users.map(u => omitPassword(u));
}

async function webhook(url){    
    var dataUrl = JSON.stringify(url);
    //check the url encoded in base 64
    if(dataUrl.indexOf("http://localhost:8181/notification") !== -1)
    {
        const res = await axios.post('http://localhost:8181/notification', url); 
        return "{ 'message' : 'Webhook set' }";
    }
    else
    {
        return "{ 'message' : 'Address wrong' }";      
    }
}

async function encode(message){
    const res = await axios.post('http://localhost:8181/notification', message);  
    return res.data ;
}

// helper functions
function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}