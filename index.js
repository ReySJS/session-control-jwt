import path from 'path';
import express from 'express';
import fs from 'fs';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import * as jwt from './jwt.js'

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

///////////////////////Middleware route to serve the home page////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
app.use(express.static('public'));

//////////////////////////////////////////////////////////////////////////////////////
///////////////////////Middleware route to serve the home page////////////////////////
let users = {}
users.rey = { "name": "Reinan", "username": "rey", "password": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", "userType": "admin" }
users.user1 = { "name": "User1", "username": "user1", "password": "8d23cf6c86e834a7aa6eded54c26ce2bb2e74903538c61bdd5d2197997ab2f72", "userType": "user" }


function getUsers() {

    let userList = ''

    for (let i = 0; i < Object.keys(users).length; i++) {
        userList += `
                    <tr>
                        <td>${users[Object.keys(users)[i]].name}</td>
                        <td>${users[Object.keys(users)[i]].username}</td>
                        <td>${users[Object.keys(users)[i]].userType}</td>
                    </tr>`
    }

    return userList
}

const ret = {};

ret.homePage = `
    <div class="login-content">
    <p class="input-content">
        <label for="input-username">Usuário:</label>
        <input type="text" name="username" id="input-username" />
    </p>
    <p class="input-content">
        <label for="input-password">Senha:</label>
        <input type="password" name="password" id="input-password" />
    </p>
    <button class="submit" type="button" id="btn-login">Entrar</button>
    <p id="login-status"></p>
    </div>`;

const authMiddleware = async (req, res, next) => {
    const token = req.cookies["session-id"];

    try {
        const payload = await jwt.verify(token)
        const user = await users[payload.username]


        if (!user) {
            return res.status(401).send("Falha na autenticação do usuário")
        }

        req.auth = {
            name: user.name,
            username: user.username,
            userType: user.userType
        }

        next()
    } catch (error) {

        fs.readFile('data/log.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const buffer = JSON.parse(data);
                buffer.error.push(error);
                fs.writeFile('data/log.json', JSON.stringify(buffer), (err) => { });
            }
        });

        res.cookie("session-id").status(401).send("Falha na autenticação do usuário")

    }
}
// app.use(authMiddleware)

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

app.get("/home", (req, res) => res.send(ret.homePage));

app.get("/login", (req, res) => {

    const [, hash] = req.headers.authorization.split(' ')
    const [username, password] = Buffer.from(hash, 'base64').toString().split(':')

    const passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    const user = users[username]

    if (!user) {
        return res.status(401).send("Usuário não cadastrado")
    }

    if (user.password !== passwordHash) {
        return res.status(401).send("Senha inválida")
    }

    const token = jwt.sign({ username: user.username, type: user.userType })
    res.cookie("session-id", token)

    if (user.userType === "admin") {

        const adminResultPage = `
            <div class="admin-content">
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
                    <input id="newuser-name" class="input-user" name="newuser-name" type="text" />
                    </p>
                    <p>
                        <label for="newuser-username">Nome de Usuário</label>
                        <input id="newuser-username" class="input-user" name="newuser-username" type="text" />
                    </p>
                    <p>
                        <label for="newuser-password">Senha</label>
                        <input id="newuser-password" class="input-user" name="newuser-password" type="password" />
                    </p>
                    <p>
                        <label for="newuser-type">Tipo</label>
                        <select name="newuser-type" id="newuser-type">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </p>
                </div>
                <button type="button" class="submit" id="submit-newuser">Cadastrar</button>
                <p id="signup-status"></p>
                </div>`;

        return res.send(adminResultPage);

    } else {
        const userResultPage = `
            <div class="user-content">
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
                </table>
            </div>`;

        return res.send(userResultPage);
    }
});

app.post("/signup", authMiddleware, (req, res) => {

    if (!req.body.username || !req.body.name || !req.body.password || !req.body.userType) {
        return res.status(406).send("Insira os dados para cadastrar o novo usuário")
    }

    users[req.body.username] = {
        "name": req.body.name,
        "username": req.body.username,
        "password": crypto
            .createHash("sha256")
            .update(req.body.password)
            .digest("hex"),
        "userType": req.body.userType
    }

    res.send(getUsers());
});

app.post("/logout", (req, res) => {

    return res.cookie("session-id").redirect('/');
});

app.get("/me", authMiddleware, (req, res) => {
    res.send(req.auth)
})

app.listen(80);