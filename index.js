const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const path = require("path");
const app = express();

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

///////////////////////Middleware route to serve the home page////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
app.use(express.static('public'));
app.get('/', (req, res, next) => {

    const options = {
        root: path.join(__dirname + '/public/')
    };

    res.sendFile('index.html', options, (err) => {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('Sent:', fileName);
            next();
        }
    });
});
//////////////////////////////////////////////////////////////////////////////////////
///////////////////////Middleware route to serve the home page////////////////////////
const messages = [];

const hackers = [];

const users = [
    { "username": "rey", "password": "123456789", "token": undefined, "admin": true },
    { "username": "user1", "password": "123456", "token": undefined, "admin": false },
    { "username": "user2", "password": "1234", "token": undefined, "admin": false }
];

const ret = {};

ret.homePage = `
    <p>
        <label for="input-username">Username: </label>
        <input type="text" name="username" id="input-username" />
    </p>
    <p>
        <label for="input-password">Password: </label>
        <input type="password" name="password" id="input-password" />
    </p>
    <button class="submit" type="button" id="btn-login">Entrar</button>`;

ret.userErrorPage = `
    <h1>Usuário não encontrado</h1>
    <button id="btn-home" class="submit" type="button">Voltar</button>`;

ret.tokenErrorPage = `
    <h1>Token Inválido</h1>
    <button id="btn-home" class="submit" type="button">Voltar</button>`;

ret.messageSent = `
    <h1>Mensagem Enviada!<br />Responderemos em breve</h1>
    <button id="btn-home" class="submit" type="submit">Voltar</button>`;

app.get("/home", (req, res) => res.send(ret.homePage));

app.post("/login", (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    const userFilter = users.filter(data => data.username === username && data.password === password);
    const user = userFilter[0];

    if (!user) {
        res.send(ret.userErrorPage);
        return false;
    }

    res.cookie('username', username, { maxAge: 900000, httpOnly: true });

    if (user.admin) {
        let adminResultMessages = ''

        for (let i = 0; i < messages.length; i++) {
            adminResultMessages += `
                <tr>
                    <td>${messages[i].username}</td>
                    <td>${messages[i].message}</td>
                </tr>`
        }

        const adminResultPage = `
            <h1>Página do administrador</h1>
            <h2>Seja bem-vindo <span class="user">${username}</span ></h2>
            <button id="logout" type="button">Sair</button>  
            <table>
                <thead>
                    <tr>
                        <th>Usuário</th>
                        <th>Mensagem</th>
                    </tr>
                </thead>
                <tbody>
                ${adminResultMessages}
                </tbody>
            </table>`;

        return res.send(adminResultPage);
    } else {

        const userResultPage = `
            <h1>Página do usuário</h1>
            <h2>Seja bem-vindo <span class="user">${username}</span ></h2>
            <button id="logout" type="button">Sair</button>              
            <p class="textarea-content">
                <label for="input-message">Mensagem: </label>
                <textarea id="input-message" rows="10" cols="30" name="message"></textarea>
            </p>
            <button id="send-message" class="submit" type="button">Enviar</button>`;

        return res.send(userResultPage);
    }
});

app.post("/message", (req, res) => {
    // res.setHeader('Content-Type', 'text/html');

    const usernameCookie = req.cookies.username;
    if (!usernameCookie) {
        res.status(403).send('ret.tokenErrorPage')
        // res.send(e)
    }

    const username = req.body.username;
    const message = req.body.message;
    const newMessage = { username, message }

    const userFilter = users.filter(data => data.username === username);
    const user = userFilter[0];

    messages.push(newMessage);
    return res.send(ret.messageSent);
});

app.post("/logout", (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    const username = req.body.username;

    const userFilter = users.filter(data => data.username === username);
    const user = userFilter[0];

    if (!user) {
        hackers.push(username);
        res.send(ret.tokenErrorPage);
        return false;
    }

    // const findUserToken = users.findIndex(value => value === user);
    // users[findUserToken].token = undefined
    return res.send(ret.homePage);
});

app.listen(80);