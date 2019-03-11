function save() {
    localStorage.setItem("toDoList", JSON.stringify(toDoList));
}

function load() {
    let parsedData = JSON.parse(localStorage.toDoList);
    toDoList = ListCollection.constructFromData(parsedData);
}

function generateID() {
    return `${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 10000)}-${Date.now()}`
}


class ListCollection {
    constructor() {
        this.listCollection = [];
    }
    
    static constructFromData(data) {
        let c = new ListCollection();
        for (let i = 0; i < data.length; i++) {
            c.listCollection.push(TaskList.constructFromData(data[i].name, data[i].id, data[i].taskList));
        }
        return c;
    }
    
    addList() {
        let newID = generateID();
        this.listCollection.push(new TaskList(newID));
        $(".boxOfLists").append(
            `<div class="listBox" id="${newID}">
                <span contenteditable="true"
                onkeyup="toDoList.listCollection[${this.listCollection.length - 1}].rename()">
                    New List
                </span>
                <button onclick="toDoList.listCollection[${this.listCollection.length - 1}].addTask()">
                    Add Task
                </button>
            </div>`
        );
        save();
    }
    
    deleteList(listIndex) {
    
    }
}

class TaskList {
    constructor(id) {
        this.name = "New List";
        this.id = id;
        this.taskList = [];
    }
    
    static constructFromData(name, id, taskList) {
        let x = new TaskList(id);
        x.name = name;
        for (let i = 0; i < taskList.length; i++) {
            x.taskList = Task.constructFromData(taskList[i].name, taskList[i].id, taskList[i].complete)
        }
        return x;
    }
    
    addTask() {
        let newID = generateID();
        this.taskList.push(new Task(newID));
        $(`#${this.id}`).append(
            `<div class="taskBox" id="${newID}">
                <span contenteditable="true"
                onkeyup="toDoList.listCollection[${toDoList.listCollection.indexOf(this)}].taskList[${this.taskList.length - 1}].rename()">
                    New Task
                </span>
            </div>`
        );
        save();
    }
    
    deleteTask(taskIndex) {
    
    }
    
    clearCompleted() {
    
    }
    
    rename() {
        this.name = $(`#${this.id}:first-child`).html();
        save();
    }
}

class Task {
    constructor(id) {
        this.name = `New Task`;
        this.id = id;
        this.complete = false;
    }
    
    static constructFromData(name, id, complete) {
        let x = new Task(id);
        x.name = name;
        x.complete = complete;
        return x;
    }
    
    toggleComplete() {
        this.complete = !this.complete;
    }
    
    rename() {
        this.name = $(`#${this.id}:first-child`).html();
        save();
    }
    
    removeTask() {
    
    }
}

let toDoList = new ListCollection();