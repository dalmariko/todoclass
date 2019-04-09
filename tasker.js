'use strict';


class TodoList {
    constructor(settings) {
        this._settings = Object.assign(TodoList.getDefaultSettings(), settings);
    }

    init() {

        this._todoContainer = document.querySelector(this._settings.todoContainer);

        this._openForm = document.querySelector(this._settings.openForm);

        this._form = document.forms[this._settings.formName];
        this._name = this._form[this._settings.formInfoName];
        this._date = this._form[this._settings.formDate];
        this._descriptions = this._form[this._settings.formDescriptions];

        this._addItemBtn = document.querySelector(this._settings.addItemBtn);
        this._rewriteItemBtn = document.querySelector(this._settings.rewriteItemBtn);

        this._headerToDo = document.querySelector(this._settings.headerTodo);

        this._overlay = document.querySelector(this._settings.overlay);
        this._modal = document.querySelector(this._settings.addModal);
        this._exitBtn = document.querySelector(this._settings.exitBtn);

        this._dataTascksInfo = document.querySelector(this._settings.tasksContainer);

        this._setEvents();

        return this;
    }


    defaultToDoLocalStorage(e) {
        let todos = localStorage.getItem('todoList') ? TodoList.getLogalStorage() : TodoList.toLocalStorage([]);
        this.generate(todos);
    }

    newTodo(e) {
        e.preventDefault();


        let temp = !localStorage.getItem('todoList') ? TodoList.toLocalStorage([]) : TodoList.getLogalStorage();

        let todo = {
            id: temp.length,
            name: this._name.value,
            date: this._date.value,
            descriptions: this._descriptions.value,
            status: 'pending',
            rewrite: false,
        };
        this._form.reset();

        this.closeModal();

        temp.push(todo);

        TodoList.toLocalStorage(temp);
        temp.length !== 0 ? this.generate(temp) : '';

    }

    sortTodo(e) {
        e.preventDefault();
        let todos = TodoList.getLogalStorage();

        if (e.target.classList.contains('up')) {
            let param = e.target.closest('.name') ? 'name' : 'date';
            this.sorteg(todos, param, {asc: false});
        }

        if (e.target.classList.contains('down')) {
            let param = e.target.closest('.name') ? 'name' : 'date';
            this.sorteg(todos, param);
        }
    }

    eventOpenModal(e) {
        e.preventDefault();
        if (e.target.classList.contains('openModal')) {
            this._addItemBtn.disabled = false;
            this._rewriteItemBtn.disabled = true;
            this.openModal();
        }
    }

    eventCloseModal(e) {
        e.preventDefault();
        if (e.keyCode == 27 || e.target.closest('.exitBtn')) {
            this.closeModal();
        }
    }

    openModal() {
        this._overlay.classList.remove('noActive');
        this._modal.classList.remove('noActive');
    }

    closeModal() {
        this._overlay.classList.add('noActive');
        this._modal.classList.add('noActive');
    }

    status(e) {
        e.preventDefault();

        let status = '';

        switch (true) {
            case e.target.classList.contains('pen'):
                status = 'pending';
                break;
            case e.target.classList.contains('work'):
                status = 'work';
                break;
            case e.target.classList.contains('comp'):
                status = 'complite';
                break;
            case e.target.classList.contains('refac'):
                status = 'refactor';
                break;
        }

        let task = e.target.closest('.dataInfo');
        let id = task.dataset.id * 1;

        this.contorlStatus(id, status)

    }

    changeStatus(id, status) {
        !localStorage.getItem('todoList') ? TodoList.toLocalStorage([]) : '';
        let temp = TodoList.getLogalStorage();

        for (let todo = 0; todo < temp.length; todo++) {
            if (temp[todo].id * 1 === id) {
                temp[todo].status = status;
                break;
            }
        }
        TodoList.toLocalStorage(temp);

    }

    contorlStatus(id, status) {
        switch (status) {
            case 'pending':
                document.querySelector(`[data-id="${id}"]`).className = '';
                document.querySelector(`[data-id="${id}"]`).classList.add('dataInfo', 'pending');
                this.changeStatus(id, status);
                break;
            case 'work':
                document.querySelector(`[data-id="${id}"]`).className = '';
                document.querySelector(`[data-id="${id}"]`).classList.add('dataInfo', 'inWork');
                this.changeStatus(id, status);
                break;
            case 'complite':
                document.querySelector(`[data-id="${id}"]`).className = '';
                document.querySelector(`[data-id="${id}"]`).classList.add('dataInfo', 'complite');
                document.querySelector(`[data-id="${id}"] .refac`).disabled = true;
                this.changeStatus(id, status);
                break;
            case 'refactor':
                document.querySelector(`[data-id="${id}"]`).className = '';
                document.querySelector(`[data-id="${id}"]`).classList.add('dataInfo', 'refactor');
                this.changeStatus(id, status);
                break;
        }
    }

    rewriteTask(e) {
        e.preventDefault();

        if (e.target.classList.contains('refac')) {

            this._addItemBtn.disabled = true;
            this._rewriteItemBtn.disabled = false;

            let task = e.target.closest('.dataInfo');
            let id = task.dataset.id * 1;
            let temp = TodoList.getLogalStorage();
            let todo = {};
            for (let task = 0; task < temp.length; task++) {
                if (temp[task].id * 1 === id) {
                    todo = temp[task];
                    break;
                }
            }

            this.openModal();

            this._name.value = todo.name;
            this._date.value = todo.date;
            this._descriptions.value = todo.descriptions;


            this._rewriteItemBtn.addEventListener('click', e => {
                e.preventDefault();
                if (e.target.closest('.rewriteItemBtn')) {
                    let rewrite = {
                        id: id,
                        name: this._name.value,
                        date: this._date.value,
                        descriptions: this._descriptions.value,
                        status: 'pending',
                        rewrite: true,
                    };
                    this.closeModal();
                    temp.splice(id, 1, rewrite);
                    TodoList.toLocalStorage(temp);
                    this.generate(temp);
                }
            });

        }
    }

    rewriteCheck(task, id) {
        if (task.rewrite === true) {
            document.querySelector(`#refactorLogo${id}`).addEventListener("load", function () {
                let doc = this.getSVGDocument();
                let svg = doc.querySelector("svg");
                svg.setAttribute("fill", "#a30001");
            });
        }
    }

    _setEvents() {
        document.addEventListener("DOMContentLoaded", e => this.defaultToDoLocalStorage(e));
        document.body.addEventListener('keyup', e => this.eventCloseModal(e));

        this._addItemBtn.addEventListener('click', e => this.newTodo(e));


        this._headerToDo.addEventListener('click', e => this.sortTodo(e));

        this._openForm.addEventListener('click', e => this.eventOpenModal(e));
        this._exitBtn.addEventListener('click', e => this.eventCloseModal(e));

        this._dataTascksInfo.addEventListener('click', e => this.status(e));
        this._dataTascksInfo.addEventListener('click', e => this.rewriteTask(e));
    }


    sorteg(todos, param = 'name', {asc = true}={}) {
        todos.sort((a, b) => {
            return asc ? (a[param].localeCompare(b[param])) : (b[param].localeCompare(a[param]))
        });
        this.generate(todos);
    };

    static toLocalStorage(todos) {
        localStorage.setItem('todoList', JSON.stringify(todos))
    }

    static getLogalStorage() {
        return JSON.parse(localStorage.getItem('todoList'));
    }

    addTemplate(item) {
        const template = `
            <div class="dataInfo" data-id="${item.id}">
            <div class="name"><p>${item.name}</p></div>
            <div class="date"><p>${item.date}</p></div>
            <div class="descr"><p>${item.descriptions}</p></div>
            <div class="options">
                <button class="pen"><object type="image/svg+xml" data="images/pendingLogo.svg" class="pendingLogo"></object>
</button>
                <button class="work"><object type="image/svg+xml" data="images/worckLogo.svg" class="worckLogo"></object>
</button>
                <button class="comp"><object type="image/svg+xml" data="images/compliteLogo.svg" class="compliteLogo"></object>
</button>
                <button class="refac">
                    <object type="image/svg+xml" id="refactorLogo${item.id}" data="images/refactorLogo.svg" class="refactorLogo"></object>
                </button>
            </div>
        </div>
        `;
        this._todoContainer.insertAdjacentHTML('beforeend', template);
    }

    generate(todos) {
        this._todoContainer.innerHTML = '';
        if (todos.length !== 0) {
            todos.forEach((item, id) => {
                this.addTemplate(item);
                this.rewriteCheck(item, id);
                this.contorlStatus(item.id, item.status);
            })
        }
    }

    static getDefaultSettings() {
        return {
            todoContainer: '.dataTascksInfo',
            formName: 'addNewTodo',
            formInfoName: 'name',
            formDate: 'date',
            formDescriptions: 'descriptions',
            headerTodo: '.headerToDo',
            openForm: '.newTodo',
            addItemBtn: '.addItemBtn',
            rewriteItemBtn: '.rewriteItemBtn',
            overlay: '.overlay',
            addModal: '.addModal',
            exitBtn: '.exitBtn',
            tasksContainer: '.dataTascksInfo',
        }
    }

}


new TodoList().init();

