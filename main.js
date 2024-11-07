const todoForm = document.getElementById("todoForm");
const titleElement = document.getElementById("title");
const descriptionElement = document.getElementById("description");

const btnReset = document.getElementById("reset-btn");
const btnAdd = document.getElementById("add-btn");

const tbody = document.getElementById("tbody");

let todoSaved = JSON.parse(localStorage.getItem("todos") || "[]");

let todoEditing = {
  id: null,
};

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (todoEditing.id) {
    // edit
    const todo = {
      ...todoEditing,
      title: titleElement.value,
      description: descriptionElement.value,
    };
    if (!validationTodo(todo)) return;
    todoSaved = todoSaved.map((item) => {
      if (item.id === todoEditing.id) {
        return todo;
      }
      return item;
    });
    handleViewTodo(todoSaved);
  } else {
    //add
    const todo = {
      id: generateRandomId(4),
      title: titleElement.value,
      description: descriptionElement.value,
      status: false,
    };
    if (!validationTodo(todo)) return;
    todoSaved.push(todo);
  }

  handleViewTodo(todoSaved);
  resetForm();
});

function generateRandomId(n, prefix = "todo-") {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = prefix;
  for (let i = 0; i < n; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

function validationTodo(todo) {
  if (!todo.title || !todo.description) {
    alert("Bạn cần điền đầy đủ dữ liệu");
    return false;
  }
  return true;
}

function handleViewTodo(todos = []) {
  tbody.innerText = "";
  todos.length > 0
    ? todos.forEach((item) => {
        let trElement = document.createElement("tr");
        trElement.innerHTML = `
        <th scope="row">${item.id}</th>
                    <td>
                        <p class='${
                          item.status ? "completed" : "pending"
                        }' onclick="tonggleStatus('${item.id}')">
                        ${item.title} - ${
          item.status
            ? '<i class=" icon bx bx-check"></i>'
            : '<i class=" icon bx bx-x" ></i>'
        }
                        </p>
                    </td>
                    <td>${item.description}</td>
                    <td>
                        <button class="btn btn-warning" onclick="updateTodo('${
                          item.id
                        }')">UpDate</button>

                    <button class="btn btn-danger" onclick="removeTodo('${
                      item.id
                    }')">Delete</button>
                        
                    </td>
    `;
        tbody.appendChild(trElement);
      })
    : (tbody.innerHTML = `
    <tr>
                    <td colspan="4">Nothing todo</td>
                </tr>
  `);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function tonggleStatus(id) {
  todoSaved = todoSaved.map((item) => {
    if (item.id === id) {
      item.status = !item.status;
    }
    return item;
  });
  handleViewTodo(todoSaved);
}

function removeTodo(id) {
  if (window.confirm("Bạn có chắc muốn xóa ?")) {
    todoSaved = todoSaved.filter((item) => item.id !== id);
    handleViewTodo(todoSaved);
  }
}

function resetForm() {
  todoForm.reset();
  todoEditing = {
    id: null,
  };
  btnAdd.innerText = "Add";
}

function removeAll() {
  if (window.confirm("Bạn có chắc muốn xóa hết?")) {
    todoSaved = [];
    localStorage.setItem("todos", []);
    handleViewTodo();
  }
}
// ham edit todo

function updateTodo(id) {
  todoEditing = todoSaved.find((item) => item.id === id);
  btnAdd.innerText = "Update";
  console.log(todoEditing);
  titleElement.value = todoEditing.title;
  descriptionElement.value = todoEditing.description;
}

btnReset.addEventListener("click", resetForm);
handleViewTodo(todoSaved);
