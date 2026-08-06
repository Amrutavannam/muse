const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "";
let selectedStatus = "Idea";
let selectedType = "Personal";

// ---------- STATUS ----------

const statusCards = document.querySelectorAll("#statusGrid .status-card");

statusCards.forEach(card=>{

card.addEventListener("click",()=>{

statusCards.forEach(c=>c.classList.remove("active"));

card.classList.add("active");

selectedStatus = card.dataset.status;

});

});

// ---------- TYPE ----------

const typeCards = document.querySelectorAll("#typeGrid .status-card");

typeCards.forEach(card=>{

card.addEventListener("click",()=>{

typeCards.forEach(c=>c.classList.remove("active"));

card.classList.add("active");

selectedType = card.dataset.type;

});

});

// ---------- IMAGE ----------

const uploadBox = document.getElementById("uploadBox");

const imageInput = document.getElementById("coverImage");

uploadBox.addEventListener("click",()=>{

imageInput.click();

});

imageInput.addEventListener("change",()=>{

if(imageInput.files.length>0){

uploadBox.classList.add("selected");

uploadBox.querySelector("p").innerHTML=
`
<b>${imageInput.files[0].name}</b><br><br>Ready to upload ✔
`;

}

});

const form = document.getElementById("projectForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const project = {

        user_email: localStorage.getItem("userEmail"),

        title: document.getElementById("title").value,

        vision: document.getElementById("vision").value,

        thoughts: document.getElementById("thoughts").value,

        status: selectedStatus,

        project_type: selectedType,

        github: document.getElementById("github").value,

        reference_link: document.getElementById("reference").value

    };

    const response = await fetch(`${API_URL}/projects`,
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(project)

        });

    const data = await response.json();

    alert(data.message);

    window.location.href = "dashboard.html";

});