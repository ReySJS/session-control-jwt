$(document).ready(() => {

    const url = "http://localhost:8080"


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
    $("#main").on("click", "#send-message", () => {

        const message = {
            "username": $(".user").html(),
            "message": $("#input-message").val()
        }

        fetch('/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        })
            .then(response => response.text())
            .then(res => $("#main").html(res))
            .catch(error => console.log(error));
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