
const register_tab = document.getElementById("register_tab")
const login_tab = document.getElementById("login_tab")
const delete_tab = document.getElementById("delete_bt")

const login_form = document.getElementById("login_form")
const  register_form = document.getElementById("register_form")

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