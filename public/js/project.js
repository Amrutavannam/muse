const params = new URLSearchParams(window.location.search);

const projectId = params.get("id");

async function loadProject() {

    const response = await fetch(
        `http://localhost:3000/project/${projectId}`
    );

    const project = await response.json();

    window.currentProject = project;

    document.title = `${project.title} | MUSE`;

    document.querySelector("h1").innerHTML =
        `🌙 <span class="text-gradient">${project.title}</span>`;

    document.getElementById("title").value = project.title;
    document.getElementById("vision").value = project.vision;
    document.getElementById("thoughts").value = project.thoughts;
    document.getElementById("github").value = project.github || "";
    document.getElementById("reference").value = project.reference_link || "";

}
loadProject();
const form = document.getElementById("editProjectForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const response = await fetch(

        `http://localhost:3000/project/${projectId}`,

        {

            method: "PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            title: document.getElementById("title").value,

            vision: document.getElementById("vision").value,

            thoughts: document.getElementById("thoughts").value,

            github: document.getElementById("github").value,

            reference_link: document.getElementById("reference").value

        })

        }

    );

    const data = await response.json();

    alert(data.message);

});
const deleteBtn = document.getElementById("deleteBtn");

deleteBtn.addEventListener("click", async () => {

    const confirmDelete = confirm(
        "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    const response = await fetch(

        `http://localhost:3000/project/${projectId}`,

        {

            method: "DELETE"

        }

    );

    const data = await response.json();

    alert(data.message);

    window.location.href = "dashboard.html";

});
document
.getElementById("askAI")
.addEventListener("click", async () => {

    const prompt =
        document.getElementById("aiPrompt").value;

    const response = await fetch(
        "http://localhost:3000/ai",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

    title: window.currentProject.title,

    vision: window.currentProject.vision,

    thoughts: window.currentProject.thoughts,

    status: window.currentProject.status,

    project_type: window.currentProject.project_type,

    prompt

})

        });
document.getElementById("aiResponse").innerHTML ="✨ Muse is thinking..."
    const data = await response.json();

    document.getElementById("aiResponse").innerHTML =
data.reply;

});