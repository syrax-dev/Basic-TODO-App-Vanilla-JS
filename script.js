// Select DOM Elements
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");

// Try to load saved todos from Localstorage
const saved = localStorage.getItem("todos");
const todos = saved ? JSON.parse(saved) : [];

function saveTodos() {
  // Save current todos to array to LocalStorage!
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Create a DOM node for a todo object and append it to list
function createTodoNode(todo, index) {
  const li = document.createElement("li");
  // Checkbox toggle to completion
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = !!todo.completed;
  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;

    textSpan.style.textDecoration = todo.completed ? "line-through" : "";
    saveTodos();
  });

  // Text of todo
  const textSpan = document.createElement("span");
  textSpan.textContent = todo.text;
  textSpan.style.margin = "0 8px";
  if (todo.completed) {
    textSpan.style.textDecoration = "line-through";
  }
  //Add double-click eventlistener to edit todo
  textSpan.addEventListener("dblclick", () => {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = todo.text;
    editInput.className = "edit-input";

    // Replace span with input
    li.replaceChild(editInput, textSpan);
    editInput.focus();

    function saveEdit() {
      const newText = editInput.value.trim();
      if (newText) {
        todo.text = newText;
        textSpan.textContent = newText;
        saveTodos();
      }
      li.replaceChild(textSpan, editInput);
    }

    // Save on Enter
    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveEdit();
      }
      if (e.key === "Escape") {
        li.replaceChild(textSpan, editInput); // cancel edit
      }
    });

    // Save when clicking outside
    editInput.addEventListener("blur", saveEdit);
  });

  // Delete todo
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.classList.add("delete-btn");

  delBtn.addEventListener("click", () => {
    todos.splice(index, 1);
    render();
    saveTodos();
  });

  // List Visuals
  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(delBtn);
  return li;
}

// Renders the whole ToDo list from Todos array
function render() {
  list.innerHTML = "";

  // Recreate each item
  todos.forEach((todo, index) => {
    const node = createTodoNode(todo, index);
    list.appendChild(node);
  });
}

function addTodo() {
  const text = input.value.trim();
  if (!text) {
    return;
  }
  // Push a new todo object
  todos.push({ text, completed: false });
  input.value = "";
  render();
  saveTodos();
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

addBtn.addEventListener("click", addTodo);
render();
