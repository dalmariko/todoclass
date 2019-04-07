'use strict';


class TodoList {
    constructor(settings) {
        this._settings = Object.assign(TodoList.getDefaultSettings(), settings);
    }

    init() {

        this._todoContainer=document.querySelector(this._settings.todoContainer);

        this._openForm=document.querySelector(this._settings.openForm);

        this._form = document.forms[this._settings.formName];
        this._name = this._form[this._settings.formInfoName];
        this._date = this._form[this._settings.formDate];
        this._descriptions = this._form[this._settings.formDescriptions];

        this._headerToDo=document.querySelector(this._settings.headerTodo);

        this._overlay=document.querySelector('.overlay');
        this._modal=document.querySelector('.addModal');
        this._exitBtn = document.querySelector('.exitBtn');

        this._dataTascksInfo=document.querySelector('.dataTascksInfo');

        this._setEvents();

        return this;
    }



    editingTodoItem() {

    }

    defaultToDoLocalStorage(e){
        let todos=localStorage.getItem('todoList') ? TodoList.getLogalStorage():TodoList.toLocalStorage([]);
        this.generate(todos);
    }

    newTodo(e) {

        e.preventDefault();
        let temp =  !localStorage.getItem('todoList') ? TodoList.toLocalStorage([]) : TodoList.getLogalStorage();

        let todo = {
            id: temp.length,
            name: this._name.value,
            date: this._date.value,
            descriptions: this._descriptions.value,
            status:'pending',
            rewrite: false,
        };
        this._form.reset();

        this._overlay.classList.add('noActive');
        this._modal.classList.add('noActive');

        temp.push(todo);

        TodoList.toLocalStorage(temp);
        temp.length!==0?this.generate(temp):'';

    }

    sortTodo(e){
        e.preventDefault();

        let todos = TodoList.getLogalStorage();

            if (e.target.classList.contains('up')) {
                let param = e.target.closest('.name')?'name':'date';
                TodoList.sorteg(todos,param,{asc:false});
            }

           if (e.target.classList.contains('down')) {
                let param = e.target.closest('.name')?'name':'date';
                TodoList.sorteg(todos,param);
            }
    }

    openModal(e){
        e.preventDefault();
        if(e.target.classList.contains('openModal')){
            this._overlay.classList.remove('noActive');
            this._modal.classList.remove('noActive');
        }
    }

    closeModal(e){
        e.preventDefault();
        if (e.keyCode == 27 || e.target.closest('.exitBtn')){
            this._overlay.classList.add('noActive');
            this._modal.classList.add('noActive');
        }
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

        let tasck = e.target.closest('.dataInfo');
        let id = tasck.dataset.id;

        this.contorlStatus(id,status)

    }

    changeStatus(id,status){
        !localStorage.getItem('todoList') ? TodoList.toLocalStorage([]) : '';
        let temp = TodoList.getLogalStorage();

     for(let todo=0;todo<temp.length;todo++){
         if(temp[todo].id == id){
             temp[todo].status=status;
             break;
         }
     }
     TodoList.toLocalStorage(temp);

     }

    contorlStatus(id,status){
        switch (status) {
            case 'pending':
                document.querySelector(`[data-id="${id}"]`).className = '';
                document.querySelector(`[data-id="${id}"]`).classList.add('dataInfo', 'pending');
                this.changeStatus(id,status);
                break;
            case 'work':
                document.querySelector(`[data-id="${id}"]`).className = '';
                document.querySelector(`[data-id="${id}"]`).classList.add('dataInfo', 'inWork');
                this.changeStatus(id,status);
                break;
            case 'complite':
                document.querySelector(`[data-id="${id}"]`).className = '';
                document.querySelector(`[data-id="${id}"]`).classList.add('dataInfo', 'complite');
                this.changeStatus(id,status);
                break;
            case 'refactor':
                document.querySelector(`[data-id="${id}"]`).className = '';
                document.querySelector(`[data-id="${id}"]`).classList.add('dataInfo', 'refactor');
                this.changeStatus(id,status);
                break;
        }
    }

    _setEvents() {
        document.addEventListener("DOMContentLoaded",e=>this.defaultToDoLocalStorage(e));
        document.body.addEventListener('keyup',e=>this.closeModal(e));

        this._form.addEventListener('submit', e => this.newTodo(e));
        this._headerToDo.addEventListener('click',e => this.sortTodo(e));
        this._openForm.addEventListener('click',e=>this.openModal(e));
        this._exitBtn.addEventListener('click',e=>this.closeModal(e));

        this._dataTascksInfo.addEventListener('click',e=>this.status(e));
    }


    static sorteg(todos, param = 'name', {asc = true}={}) {
        todos.sort((a, b) => {
            return asc ?  (a[param].localeCompare(b[param])) : (b[param].localeCompare(a[param]))
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
                <button class="pen">Pending</button>
                <button class="work">In Work</button>
                <button class="comp">Complite</button>
                <button class="refac">Refactor</button>
            </div>
        </div>
        `;
         this._todoContainer.insertAdjacentHTML('beforeend', template);
    }

     generate(todos) {
         this._todoContainer.innerHTML = '';
       todos.forEach((item,id) => {
                   this.addTemplate(item);
                   this.contorlStatus(id,item.status);
       });
    }

    static getDefaultSettings() {
        return {
            todoContainer: '.dataTascksInfo',
            formName: 'addNewTodo',
            formInfoName: 'name',
            formDate: 'date',
            formDescriptions: 'descriptions',
            headerTodo:'.headerToDo',
            openForm:'.newTodo',
        }
    }

}


new TodoList().init();