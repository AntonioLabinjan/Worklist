let tasks = [];
let allMaterials = [];
let totalTasksCost = 0;

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const deadlineInput = document.getElementById("deadlineInput");

    const taskText = taskInput.value;
    const deadline = deadlineInput.value;

    if (taskText === "" || deadline === "") {
        alert("Molimo unesite ispravne podatke: tekst zadatka i rok.");
        return;
    }

    const task = {
        text: taskText,
        deadline: deadline,
        materials: [],
        prices: [],
        total: 0,
        completed: false  
    };

    tasks.push(task);
    updateTaskList();
    updateMaterialsList();
    updateTotalTasksPrice();

    taskInput.value = "";
    deadlineInput.value = "";
}

function editTask(index) {
    const task = tasks[index];
    const updatedTask = prompt("Unesite novi naziv zadatka:", task.text);
    const updatedDeadline = prompt("Unesite novi rok zadatka:", task.deadline);

    if (updatedTask === null || updatedTask === "" || updatedDeadline === null || updatedDeadline === "") {
        alert("Molimo unesite ispravne podatke za naziv i rok zadatka.");
        return;
    }

    task.text = updatedTask;
    task.deadline = updatedDeadline;
    updateTaskList();
    updateTotalTasksPrice();
}

function addMaterial(index) {
    const materialsInput = prompt("Unesite materijal:");
    const priceInput = parseFloat(prompt("Unesite cijenu materijala:"));

    if (materialsInput === null || materialsInput === "" || isNaN(priceInput) || priceInput < 0) {
        alert("Molimo unesite ispravne podatke za materijal i cijenu.");
        return;
    }

    tasks[index].materials.push(materialsInput);
    tasks[index].prices.push(priceInput);
    tasks[index].total += priceInput;
    allMaterials.push(materialsInput);
    updateTaskList();
    updateMaterialsList();
    updateTotalTasksPrice();
}

function editMaterial(index, materialIndex) {
    const task = tasks[index];
    const updatedMaterial = prompt("Unesite novi naziv materijala:", task.materials[materialIndex]);
    const updatedPrice = parseFloat(prompt("Unesite novu cijenu materijala:", task.prices[materialIndex]));

    if (updatedMaterial === null || updatedMaterial === "" || isNaN(updatedPrice) || updatedPrice < 0) {
        alert("Molimo unesite ispravne podatke za materijal i cijenu.");
        return;
    }

    const oldMaterial = task.materials[materialIndex];
    const oldPrice = task.prices[materialIndex];

    task.materials[materialIndex] = updatedMaterial;
    task.prices[materialIndex] = updatedPrice;
    task.total = task.total - oldPrice + updatedPrice;
    
    const materialIndexInAllMaterials = allMaterials.indexOf(oldMaterial);
    if (materialIndexInAllMaterials !== -1) {
        allMaterials[materialIndexInAllMaterials] = updatedMaterial;
        updateMaterialsList();
    }
    
    updateTaskList();
    updateTotalTasksPrice();
}


function removeTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    updateMaterialsList();
    updateTotalTasksPrice();
}

function updateTaskList() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskItem = document.createElement("li");
        const materialsList = task.materials.map((material, materialIndex) => `${material} (Cijena: ${task.prices[materialIndex]}) <button onclick="editMaterial(${i}, ${materialIndex})">Izmijeni materijal</button>`).join(", ");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTaskCompletion(i));

        taskItem.innerHTML = `
            <label>
                <input type="checkbox"${task.completed ? " checked" : ""}> 
                ${task.text} (Rok: ${task.deadline})<br>
                Materijali: ${materialsList}<br>
                Ukupna cijena zadatka: ${task.total} 
            </label>
            <button onclick="addMaterial(${i})">Dodaj novi materijal</button> 
            <button onclick="editTask(${i})">Izmijeni zadatak</button> 
            <button onclick="removeTask(${i})">Ukloni zadatak</button>`;
        
        taskItem.querySelector("input[type='checkbox']").addEventListener("change", () => toggleTaskCompletion(i));
        taskList.appendChild(taskItem);
    }
}


function updateMaterialsList() {
    const materialsList = document.getElementById("materialsList");
    const uniqueMaterials = [...new Set(allMaterials)];

    materialsList.innerHTML = "<strong>Svi materijali:</strong>";

    for (const material of uniqueMaterials) {
        const materialItem = document.createElement("li");
        materialItem.textContent = material;
        materialsList.appendChild(materialItem);
    }
}

function updateTotalTasksPrice() {
    totalTasksCost = tasks.reduce((total, task) => total + task.total, 0);
    const totalTasksPriceElement = document.getElementById("totalTasksPrice");
    totalTasksPriceElement.textContent = totalTasksCost;
}

function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
}
