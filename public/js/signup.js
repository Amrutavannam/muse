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

        const response = await fetch("http://localhost:3000/signup", {

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

        alert(data.message);

        // Clear form
        signupForm.reset();

        // Later we'll redirect automatically
        // window.location.href = "login.html";

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

});