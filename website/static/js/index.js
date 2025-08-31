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
            isComplete:false
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
function taskItem(task,index) {
    this.taskId = 'task#'+index
    this.item = document.createElement('div')
    this.item.classList.add('task')
    this.item.innerHTML = `
    
        <input type="checkbox" id="${this.taskId}">
        <label for="${this.taskId}" class="text">${task.text}</label>
        <button class="btn btn-del">
            x
        </button>
    
    `

    this.update = () =>{
        taskList.append(this.item)
    }

    this.delete = ()=>{
        task.isComplete = null
        this.item.classList.add('hide')
        console.table(newData.tasks)
    }

    this.btn = this.item.querySelector('.btn-del')
    this.btn.addEventListener('click',()=>this.delete())

    this.checkbox = this.item.querySelector('input')
    this.checkbox.addEventListener('change',()=>{
        task.isComplete = this.checkbox.checked
    })

    this.checkbox.checked = task.isComplete
}

function updateTask(state='all'){
    taskList.innerHTML = "";
    console.log(newData)
    newData.tasks = newData.tasks.filter((task)=> task.isComplete !== null)
    let updatingTask = newData.tasks
    if(state == 'complete'){
        updatingTask = newData.tasks.filter((task)=> task.isComplete === true)
    }
    if(state == 'uncomplete'){
        updatingTask = newData.tasks.filter((task)=> task.isComplete === false)
    }
    updatingTask.forEach((task,index)=>{
        item = new taskItem(task,index)
        item.update()
    })

    console.table(newData.tasks)
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

