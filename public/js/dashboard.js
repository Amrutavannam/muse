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
        
        <div class="project-card">

            <h3>${project.title}</h3>

            <p>${project.vision}</p>

            <span>${project.status}</span>

            <button onclick="editProject(${project.id})">

                ✏ Edit

            </button>

        </div>

        `;

    });

}

loadProjects();