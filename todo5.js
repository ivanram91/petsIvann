const todos = [];

window.onload = () => {

    const form = document.getElementById("todo-form");
    form.onsubmit = (n) => {
        n.preventDefault();

        const todo = document.getElementById("todo");
        const todoText = todo.value;
        todo.value = '';

        const todo1 = document.getElementById("todo1");
        const todoText1 = todo1.value;
        todo1.value = '';

        const todo2 = document.getElementById("todo2");
        const todoText2 = todo2.value;
        todo2.value = '';

        const todo3 = document.getElementById("todo3");
        const todoText3 = todo3.value;
        todo3.value = '';

        const todo4 = document.getElementById("selll");
        const todoText4 = todo4.value;
        todo4.value = '';

        console.log(todoText);

        todos.push(todoText);
        const todoList = document.getElementById("todo-List");

        const templates  = todos.map (t => '<li>' + '¡ Ten la certeza de que ' + t + ' estará mejor !' + '</li>');
            todoList.innerHTML = templates.join('');

            alert('Es posible que recibas una llamada de nuestros especialistas, por favor mantento atento, Gracias.')
 
          
        
    }
        }
