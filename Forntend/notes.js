const add_btn = document.getElementById("add_task_btn");
const view_btn = document.getElementById("view_task_btn");

const add_from = document.getElementById("add_from");
const view_from = document.getElementById("view_from");

const API ="http://127.0.0.1:8000"

// btn switch

add_btn.addEventListener("click", function () {

    add_from.hidden = false;
    view_from.hidden = true;

    add_btn.classList.add("active");
    view_btn.classList.remove("active");

});


view_btn.addEventListener("click", function () {

    add_from.hidden = true;
    view_from.hidden = false;

    add_btn.classList.remove("active");
    view_btn.classList.add("active");

});

// add input



add_from.addEventListener("submit", async function (event) {

    event.preventDefault();

    const storedUserId = sessionStorage.getItem("user_id");

    if (storedUserId === null) {
        showmessage("Please login first");
        return;
    }

    const user_id = Number(storedUserId);

    if (!Number.isInteger(user_id) || user_id <= 0) {
        showmessage("Invalid user ID. Please login again.");
        return;
    }

    const date = document.getElementById("add_date").value;
    const title = document.getElementById("add_title").value.trim();
    const dicription = document.getElementById("add_Discription").value.trim();
    const priority = document.getElementById("add_Priority").value;

    try {

        const response = await fetch(`${API}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user_id,
                date: date,
                titel: title,
                discription: dicription,
                priority: priority
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("API ERROR:", data.detail);
            throw new Error(JSON.stringify(data.detail));
        }

        add_from.reset();

        showmessage("Task added successfully");

    } catch (error) {
        console.error(error);
        showmessage(error.message || "API not working");
    }

});


function showmessage(message) {
    alert(message);
}


view_from.addEventListener("submit", async function (event) {
    event.preventDefault();

    const result = document.getElementById("task-results");
    const date = document.getElementById("view_date").value;

    result.innerHTML = "";

    if (!date) {
        showmessage("Please select a date");
        return;
    }

    try {
        const response = await fetch(`${API}/notes/${date}`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        console.log("Received notes:", data.notes);

        if (data.notes.length === 0) {
            result.textContent = "No tasks found.";
            return;
        }

        data.notes.forEach(function (note) {
            const card = document.createElement("div");
            card.classList.add("note-card");

            const title = document.createElement("h3");
            title.textContent = note.titel;

            const description = document.createElement("p");
            description.textContent = note.discription;

            const priority = document.createElement("p");
            priority.textContent = `Priority: ${note.priority}`;

            const noteDate = document.createElement("p");
            noteDate.textContent = `Date: ${note.date}`;

            card.append(title, description, priority, noteDate);
            result.appendChild(card);
        });

    } catch (error) {
        console.error("GET ERROR:", error);
        showmessage(error.message);
    }
});



const delete_btn = document.getElementById("delete_btn");

delete_btn.addEventListener("click", async function (event) {
    event.preventDefault();

    const date = document.getElementById("view_date").value;
    const user_id = Number(sessionStorage.getItem("user_id"));

    if (!date || !user_id) {
        alert("Please select a date and login again.");
        return;
    }

    try {
        const response = await fetch(`${API}/delete_notes`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user_id,
                date: date
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Delete failed");
        }

        alert(`${data.deleted_count} task(s) deleted successfully`);

    } catch (error) {
        console.error("DELETE ERROR:", error);
        alert(error.message);
    }
});