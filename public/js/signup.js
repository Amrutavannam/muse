const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "";
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const fullname = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check passwords
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/signup`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullname,
                email,
                password
            })

        });

        const data = await response.json();

if (response.ok) {

    localStorage.setItem("userEmail", email);

    alert(data.message);

    signupForm.reset();

    window.location.href = "/dashboard";

} else {

    alert(data.message);

}

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

});