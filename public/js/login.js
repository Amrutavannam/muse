const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "";
const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
        localStorage.setItem("userEmail", email);
        window.location.href = "dashboard.html";
    }

});