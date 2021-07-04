import path from 'path';
import express from 'express';
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
const users = {}
users.rey = { "name": "Reinan", "username": "rey", "password": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", "userType": "admin" }
users.user1 = { "name": "User1", "username": "user1", "password": "8d23cf6c86e834a7aa6eded54c26ce2bb2e74903538c61bdd5d2197997ab2f72", "userType": "user" }

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

const ret = {};

ret.homePage = `
    <p class="input-content">
        <label for="input-username">Usuário:</label>
        <input type="text" name="username" id="input-username" />
    </p>
    <p class="input-content">
        <label for="input-password">Senha:</label>
        <input type="password" name="password" id="input-password" />
    </p>
    <button class="submit" type="button" id="btn-login">Entrar</button>
    <p id="login-status"></p>`;

const authMiddleware = async (req, res, next) => {
    const token = req.cookies["session-id"];

    console.log(token)

    try {
        const payload = await jwt.verify(token)
        const userFilter = users.filter(data => data.username === payload.username)
        const user = userFilter[0]

        if (!user) {
            return res.send(401)
        }

        req.auth = user

        next()
    } catch (error) {
        res.send(401, error)
    }
}

app.get("/home", (req, res) => res.send(ret.homePage));

app.get("/login", (req, res) => {

    const [, hash] = req.headers.authorization.split(' ')
    const [username, password] = Buffer.from(hash, 'base64').toString().split(':')

    const passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    res.setHeader('Content-Type', 'text/html');

    if (!users[username]) {
        return res.send(401, "Usuário não cadastrado")
    }

    if(users[username].password !== passwordHash) {
        return res.send(401, "Senha inválida")
    }


    // if (!user) {
    //     return res.send(401, null)
    // }

    const token = jwt.sign({ username: user.username, type: user.userType })

    if (user.userType === "admin") {


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

app.post("/signup", authMiddleware, (req, res) => {

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

app.get("/logout", authMiddleware, (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    return res.send(ret.homePage);
});

app.listen(80);