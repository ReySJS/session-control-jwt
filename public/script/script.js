$(document).ready(() => {


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////Login////////////////////////////////////////
    $("#main").on("click", "#btn-login", () => {

        const username = $("#input-username").val()
        const password = $("#input-password").val()

        fetch('/login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    $("#login-status").html("Não reconhecemos esta combinação de nome de usuário e senha")
                    return
                } else {
                    return response.text()
                }
            })
            .then(res => $("#main").html(res))
            .catch(error => console.log(error))

    })
    /////////////////////////////////////Login////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////Home Screen//////////////////////////////////////
    $("#main").on("click", "#btn-home", () => {

        fetch('/home', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.text())
            .then(res => $("#main").html(res))
            .catch(error => console.log(error));
    })
    /////////////////////////////////Home Screen//////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////New User///////////////////////////////////////
    $("#main").on("click", "#submit-newuser", () => {

        fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": $("#newuser-name").val(),
                "username": $("#newuser-username").val(),
                "password": $("#newuser-password").val(),
                "userType": $("#newuser-type").val()
            })
        })
            .then(response => response.text())
            .then(res => $("#table-users").html(res))
            .catch(error => console.log(error));

        $(".input-user").val('')
    })
    ///////////////////////////////////New User///////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////Logout///////////////////////////////////////
    $("#main").on("click", "#logout", () => {

        fetch('/logout', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.text())
            .then(res => $("#main").html(res))
            .catch(error => console.log(error));
    })
    /////////////////////////////////////Logout///////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
})