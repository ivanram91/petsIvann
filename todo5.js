const todos = [];

window.onload = () => {

    const form = document.getElementById("todo-form");
    form.onsubmit = (n) => {
        n.preventDefault();

        const todo = document.getElementById("todo");
        const todoText = todo.value;
        todo.value = '';

        console.log(todoText);

        todos.push(todoText);
        const todoList = document.getElementById("todo-List");

        const templates  = todos.map (t => '<li>' + 'Ten la certeza de que ' + t + ' estará mejor.' + '</li>');
            todoList.innerHTML = templates.join('');

            alert('En breve recibirás una llamada de nuestros especialistas, por favor mantento atento.')
 
          
        
    }
        }