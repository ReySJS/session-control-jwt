$(document).ready(() => {


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////Login////////////////////////////////////////
    $("#main").on("click", "#btn-login", () => {

        const user = {
            "username": $("#input-username").val(),
            "password": $("#input-password").val()
        }

        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(response => response.text())
            .then(res => $("#main").html(res))
            .catch(error => console.log(error));

        // getUsers()
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
    /////////////////////////////////Send Message/////////////////////////////////////
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

        // getUsers()
    })
    /////////////////////////////////Send Message/////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////Send Message/////////////////////////////////////
    $("#main").on("click", "#logout", () => {

        fetch('/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "username": $(".user").html() })
        })
            .then(response => response.text())
            .then(res => $("#main").html(res))
            .catch(error => console.log(error));
    })
    /////////////////////////////////Send Message/////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
})