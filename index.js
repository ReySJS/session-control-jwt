const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const path = require("path");
const app = express();
const crypto = require('crypto');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
const users =
    [{
        "name": "Reinan",
        "username": "rey",
        "password": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
        "userType": "admin"
    },
    {
        "name": "User1",
        "username": "user1",
        "password": "481f6cc0511143ccdd7e2d1b1b94faf0a700a8b49cd13922a70b5ae28acaa8c5",
        "userType": "user"
    }];

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
    <h1>Usuário não autenticado</h1>
    <button id="btn-home" class="submit" type="button">Voltar</button>`;

app.get("/home", (req, res) => res.send(ret.homePage));

function getUsers() {
    let listOfUsers = ''

    for (let i = 0; i < users.length; i++) {
        listOfUsers += `
                <tr>
                    <td>${users[i].name}</td>
                    <td>${users[i].username}</td>
                    <td>${users[i].userType}</td>
                </tr>`
    }

    return listOfUsers
}


app.post("/login", (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    const username = req.body.username
    const password = crypto
        .createHash("sha256")
        .update(req.body.password)
        .digest("hex");

    const userFinded = users.filter((data) => data.username === username && data.password === password)

    if (!userFinded[0]) {
        res.send(ret.userErrorPage);
        return
    }

    if (userFinded[0].userType === "admin") {


        const adminResultPage = `
            <h1>Página do administrador</h1>
            <h2>Seja bem-vindo <span class="user">${username}</span ></h2>
            <button id="logout" type="button">Sair</button>  
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Nome de Usuário</th>
                        <th>Tipo de Usuário</th>
                    </tr>
                </thead>
                <tbody id="table-users">
                ${getUsers()}
                </tbody>
            </table>

            <div class="newuser-content">
                <p>
                <label for="newuser-name">Nome</label>
                <input id="newuser-name" name="newuser-name" type="text" />
                </p>
                <p>
                    <label for="newuser-username">Nome de Usuário</label>
                    <input id="newuser-username" name="newuser-username" type="text" />
                </p>
                <p>
                    <label for="newuser-password">Senha</label>
                    <input id="newuser-password" name="newuser-password" type="password" />
                </p>
                <p>
                    <label for="newuser-type">Tipo</label>
                    <select name="newuser-type" id="newuser-type">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </p>
            </div>
            <button type="button" class="submit" id="submit-newuser">Cadastrar</button>`;

        return res.send(adminResultPage);

    } else {
        const userResultPage = `
            <h1>Página do usuário</h1>
            <h2>Seja bem-vindo <span class="user">${username}</span ></h2>
            <button id="logout" type="button">Sair</button>              
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Nome de Usuário</th>
                        <th>Tipo de Usuário</th>
                    </tr>
                </thead>
                <tbody id="table-users">
                ${getUsers()}
                </tbody>
            </table>`;

        return res.send(userResultPage);
    }
});

app.post("/signup", (req, res) => {


    // if (!usernameCookie) {
    //     res.status(403).send('ret.tokenErrorPage')
    // }

    const newUser = {
        "name": req.body.name,
        "username": req.body.username,
        "password": crypto
            .createHash("sha256")
            .update(req.body.password)
            .digest("hex"),
        "userType": req.body.userType
    }

    users.push(newUser)
    res.send(getUsers());
});

app.post("/logout", (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    const username = req.body.username;

    const userFilter = users.filter(data => data.username === username);
    const user = userFilter[0];

    if (!user) {
        res.send(ret.tokenErrorPage);
        return false;
    }

    // const findUserToken = users.findIndex(value => value === user);
    // users[findUserToken].token = undefined
    return res.send(ret.homePage);
});

app.listen(80);