const params = new URLSearchParams(window.location.search);

const projectId = params.get("id");

async function loadProject() {

    const response = await fetch(
        `http://localhost:3000/project/${projectId}`
    );

    const project = await response.json();

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

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const response = await fetch(

        `http://localhost:3000/project/${projectId}`,

        {

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                title:
                document.getElementById("title").value,

                vision:
                document.getElementById("vision").value,

                thoughts:
                document.getElementById("thoughts").value,

                github:
                document.getElementById("github").value,

                reference_link:
                document.getElementById("reference").value

            })

        }

    );

    const data = await response.json();

    alert(data.message);

});