
const register_tab = document.getElementById("register_tab")
const login_tab = document.getElementById("login_tab")
const delete_tab = document.getElementById("delete_bt")

const login_form = document.getElementById("login_form")
const  register_form = document.getElementById("register_form")

const API ="http://127.0.0.1:8000"

login_tab.addEventListener("click", function () {
    login_form.hidden = false;
    register_form.hidden = true;
    delete_tab.hidden = false;

    login_tab.classList.add("active");
    register_tab.classList.remove("active");
});

register_tab.addEventListener("click", function () {
    login_form.hidden = true;
    register_form.hidden = false;
    delete_tab.hidden = true;

    login_tab.classList.remove("active");
    register_tab.classList.add("active");
});


// register

register_form.addEventListener("submit",async function (event) {
    event.preventDefault();

    const name = document.getElementById("register_name").value.trim();
    const password = document.getElementById("register_password").value;
    
    try {
        const respons = await fetch(`${API}/register`,{
            method : "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
                {
                    name,
                    password
                }
            )
        });

        const data = await respons.json();

        if(!respons.ok){
            throw new Error((data.detail||"registyraion failed"))
        }

        register_form.rest();
        showMessage("registerion succesfull")

        
    } catch (error) {
        showMessage(error.message || "cannot connect to server")
    };
});


// login

login_form.addEventListener("submit",async function (event) {
    event.preventDefault();

    const name = document.getElementById("login_name").value.trim();
    const password = document.getElementById("login_password").value;

    try {
         const respons = await fetch(`${API}/login`,{
        method :"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name,
            password
        })
    });

    const data = await respons.json();

    if(!respons.ok){
        throw new Error(
            data.detail ||"api now work"
        )
    }

    const userId = data.user_id;

    if(userId== null){
        throw new Error("user id")
    }

    sessionStorage.setItem(userId,String(userId))

    window.location.href="/Forntend/notes.html";

        
    } catch (error) {
        showMessage(error.message||"login not work")
    }

})


// dete user

delete_tab.addEventListener("click",async function (event) {
    event.preventDefault()
    
     const name = document.getElementById("login_name").value.trim();
     const password = document.getElementById("login_password").value;

     if(!name || !password){
        alert("Enter password or name")
     }

     try {
        const respons = await fetch(`${API}/delete_user`,{
            method :"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password
            })
        })

        const data = await respons.json();

        if(!respons.ok){
            throw new Error("api not work")
        }

        sessionStorage.clear();
        window.location.href = "Forntend/login.html"
        
     } catch (error) {
        showMessage(error.message||"delete not work")
     }
    
})