const taskList = document.querySelector('.list-task')
const inputTask = document.querySelector('#input-task')
const addTask = document.querySelector('#addTask')
const delAll = document.querySelector('#delAll')
const navLinks = document.querySelectorAll('.nav-link')
const toggler = document.querySelector('#toggler-mode')


let newData;

loadTask();


document.querySelector('#cancel , .modal-overlay , #addTask').addEventListener('click',(e)=>{
    if(e.target === document.querySelector('.modal-overlay') || e.target === document.querySelector('#cancel') || e.target === document.querySelector('#addTask')){
        $('.modal-overlay').fadeOut()
        inputTask.value = ''
    }
})


function darkModeActive(){
    if (newData.darkMode == true){
        $('body').addClass('dark')
    }
}


// updateTask(taskCategory);

taskCategory = 'all'
navLinks.forEach((link) => {
    link.addEventListener('click',(e)=>{
        toggleNav(e.target)
        taskCategory = `${e.target.innerHTML}`
        updateTask(taskCategory);
    })
});

function toggleNav(e){
    navLinks.forEach((link)=>link.classList.remove('active'))
    e.classList.add('active')
}


// add task
function createTask(){
    inputValue = inputTask.value.trim();
    if (inputValue.length > 0 && inputValue.length < 100){
        newTask = {
            text:inputValue,
            isCompleted:false
        }
        newData.tasks.push(newTask);
        inputValue.value = '';
    }
}

addTask.addEventListener('click',()=>{
    createTask();
    updateTask(taskCategory);
    saveTask(newData);
})


// create task item
function createTaskItem(task,index) {
    taskId = 'task#'+index
    taskItem = document.createElement('div')
    taskItem.classList.add('task')
    taskItem.innerHTML = `
    
        <input type="checkbox" id="${taskId}">
        <label for="${taskId}" class="text">${task.text}</label>
        <button class="btn btn-del">
            x
        </button>
    
    `

    let checkbox = taskItem.querySelector('input')
    checkbox.addEventListener('change',()=>{
        task.isCompleted = checkbox.checked
        updateTask(taskCategory)
        saveTask(newData);
    })
    checkbox.checked = task.isCompleted

    let btnDel = taskItem.querySelector('.btn-del')
    btnDel.addEventListener('click',()=>{
        deleteTask(index);
        updateTask(taskCategory);
    })

    taskList.append(taskItem)
}


// update task
function updateTask(state){
    taskList.innerHTML = '';
    let taskUpdating = newData.tasks;
    if (state == 'complete'){
        taskUpdating = newData.tasks.filter((task)=> task.isCompleted===true)
    }else if (state == 'uncomplete'){
        taskUpdating = newData.tasks.filter((task)=> task.isCompleted===false)
    }
    taskUpdating.forEach(function(task,index){
        createTaskItem(task,index);
    })
}


// delete task
function deleteTask(index){
    newData.tasks = newData.tasks.filter((_,i)=> i!==index);
    updateTask(taskCategory);
    saveTask(newData);
}

// delete all task
function deleteAllTask(){
    delAll.addEventListener('click',()=>{
        newData.tasks = [];
        updateTask(taskCategory);
        saveTask(newData);
    })
}


// load task
async function loadTask() {
    try{
        const res = await fetch(`${window.origin}/load`);

        if(!res.ok){
            throw new Error('no response found')
        }

        const data = await res.json();
        newData = data
        darkModeActive();
        toggler.addEventListener('click',()=>{
            newData.darkMode = document.body.classList.contains('dark');
            saveTask(newData);
        })

        
        deleteAllTask();
        updateTask(taskCategory);


    }catch(error){
        console.error(error)
    }
}


// save task
function saveTask(data) {
    fetch(`${window.origin}/save`,{
        method:'POST',
        headers:{'Content-type':"application/json"},
        body:JSON.stringify(data)
    })
    .then(res => res.json())
}

