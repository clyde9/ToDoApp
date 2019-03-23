function save() {
    localStorage.setItem("toDoList", JSON.stringify(toDoList));
}

function load() {
    let parsedData = JSON.parse(localStorage.toDoList);
    toDoList = ListCollection.constructFromData(parsedData);
    rebuild();
}

function generateID() {
    return `${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 10000)}-${Date.now()}`
}

function rebuild() {
    $(`.boxOfLists`).empty();
    for (let i = 0; i < toDoList.listCollection.length; i++) {
        $(".boxOfLists").append(
            `<div class="listBox" id="${toDoList.listCollection[i].id}">` +
            `<div class="listHead">` +
            `<span class="listName" contenteditable="true" onkeyup="toDoList.listCollection[${i}].rename()">` +
            `${toDoList.listCollection[i].name}` +
            `</span>` +
            `<button onclick="toDoList.listCollection[${i}].addTask()">` +
            `Add Task` +
            `</button>` +
            `<button onclick="toDoList.deleteList(${i})">` +
            `Delete List` +
            `</button>` +
            `</div>` +
            `</div>`
        );
        for (let j = 0; j < toDoList.listCollection[i].taskList.length; j++) {
            $(`#${toDoList.listCollection[i].id}`).append(
                `<div class="taskBox" id="${toDoList.listCollection[i].taskList[j].id}">` +
                `<span class="taskName" contenteditable="true" onkeyup="toDoList.listCollection[${i}].taskList[${j}].rename()">` +
                `${toDoList.listCollection[i].taskList[j].name}` +
                `</span>` +
                `<input type="checkbox" onclick="toDoList.listCollection[${i}].taskList[${j}].toggleComplete()"/>` +
                `<button onclick="toDoList.listCollection[${i}].deleteTask(${j})">` +
                `Delete Task` +
                `</button>` +
                `</div>`
            );
            toDoList.listCollection[i].taskList[j].checkComplete();
        }
    }
}

class ListCollection {
    constructor() {
        this.listCollection = [];
    }
    
    static constructFromData(data) {
        let c = new ListCollection();
        for (let i = 0; i < data.listCollection.length; i++) {
            c.listCollection.push(TaskList.constructFromData(
                data.listCollection[i].name,
                data.listCollection[i].id,
                data.listCollection[i].taskList));
        }
        return c;
    }
    
    addList() {
        let newID = generateID();
        this.listCollection.push(new TaskList(newID));
        save();
        rebuild();
        
    }
    
    deleteList(listIndex) {
        this.listCollection.splice(listIndex, 1);
        save();
        rebuild();
    }
    
    clearCompleted() {
        for (let i = 0; i < this.listCollection.length; i++) {
            for (let j = this.listCollection[i].taskList.length - 1; j >= 0; j--) {
                if (this.listCollection[i].taskList[j].complete) {
                    this.listCollection[i].taskList.splice(j, 1);
                }
            }
        }
        save();
        rebuild();
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
            x.taskList.push(Task.constructFromData(
                taskList[i].name,
                taskList[i].id,
                taskList[i].complete));
        }
        return x;
    }
    
    addTask() {
        let newID = generateID();
        this.taskList.push(new Task(newID));
        save();
        rebuild();
    }
    
    deleteTask(taskIndex) {
        this.taskList.splice(taskIndex, 1);
        save();
        rebuild();
    }
    
    rename() {
        this.name = $(`#${this.id} > div > span`).html();
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
        if (this.complete) {
            $(`#${this.id} > span`).css('text-decoration', 'line-through');
        } else {
            $(`#${this.id} > span`).css('text-decoration', 'none');
        }
    }
    
    checkComplete() {
        if (this.complete) {
            $(`#${this.id} > span`).css('text-decoration', 'line-through');
            $(`#${this.id} > input`).attr('checked', true);
        }
    }
    
    rename() {
        this.name = $(`#${this.id} > span`).html();
        save();
    }
    
}

let toDoList = new ListCollection();
load();