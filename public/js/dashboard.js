const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "";
const userEmail = localStorage.getItem("userEmail");

async function loadProfile() {

    const response = await fetch(`${API_URL}/profile`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: userEmail
            })
        }
    );

    const user = await response.json();


    document.getElementById("userName").textContent = user.fullname;
    console.log(user);
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    if(profileName){
        profileName.textContent = user.fullname;
    }

    if(profileEmail){
        profileEmail.textContent = user.email;
    }

}

async function loadProjects() {

    const response = await fetch(`${API_URL}/projects/${userEmail}`
    );

    const projects = await response.json();

    const projectCount = document.getElementById("projectCount");
const ideaCount = document.getElementById("ideaCount");
const completedCount = document.getElementById("completedCount");

if (projectCount && ideaCount && completedCount) {

    projectCount.textContent = projects.length;

    ideaCount.textContent =
        projects.filter(p => p.status === "Idea").length;

    completedCount.textContent =
        projects.filter(p => p.status === "Completed").length;

}

    const container = document.getElementById("projectsContainer");

    container.innerHTML = "";

    projects.forEach(project => {

        container.innerHTML += `

<div
class="project-card"
onclick="editProject(${project.id})">

    <h3>🌙 ${project.title}</h3>

    <p>${project.vision}</p>

    <div class="project-meta">

        <span class="badge">
        ${project.status}
        </span>

        <span class="badge">
        ${project.project_type}
        </span>

    </div>

    <div class="continue">

        Continue Building

        <span>→</span>

    </div>

</div>

`;

}); 
}
loadProjects();
loadProfile();
function editProject(id){

    window.location.href = `/project?id=${id}`;

}
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const keyword = this.value.toLowerCase();

    const cards = document.querySelectorAll(".project-card");

    cards.forEach(card => {

        const text = card.textContent.toLowerCase();

        if (text.includes(keyword)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("userEmail");

    window.location.href = "/index";

});