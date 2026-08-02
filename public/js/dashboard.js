const userEmail = localStorage.getItem("userEmail");

async function loadProjects() {

    const response = await fetch(
        `http://localhost:3000/projects/${userEmail}`
    );

    const projects = await response.json();

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
function editProject(id){

    window.location.href = `project.html?id=${id}`;

}