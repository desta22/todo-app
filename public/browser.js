
function itemTemplate (item) {
    return (`
        <li id="${item._id}" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
                <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
        </li>
    `)
}
const todoInput = document.getElementById('todo_input')
const todoList = document.getElementById('todo_list')
const userInput = todoInput.value

// Initial Page Load Render
todoList.insertAdjacentHTML('beforeend', items.map((item) => {
    return itemTemplate(item)
}).join(''))

// Create Item
document.getElementById('todo_form').addEventListener('submit', function (e) {
    e.preventDefault()


    if (todoInput.value) {
        console.log(todoInput.value);
        axios
            .post('/create-item', {
                text: todoInput.value,
            })
            .then(function (response) {
                todoList.insertAdjacentHTML('beforeend', itemTemplate(response.data))
                console.log('from bowser.js: ', response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

})

document.addEventListener('click', function (e) {

    // Delete item
    if (e.target.classList.contains('delete-me')) {

        const id = e.target.getAttribute('data-id')
        let itemElement = e.target.parentElement.parentElement
        const userInput = confirm('Delete item permanently?')

        if (userInput) {
            // console.log('Delete: ', id);
            axios
                .post('/delete-item', {
                    id: id
                })
                .then(function (response) {
                    itemElement.remove()
                    console.log('from bowser.js: ', response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }

    // Edit item
    if (e.target.classList.contains('edit-me')) {

        const id = e.target.getAttribute('data-id')
        let itemTextEl = e.target.parentElement.parentElement.querySelector('.item-text')
        const userInput = prompt('Enter new text', itemTextEl.innerHTML)
        if (userInput) {
            axios
                .post('/update-item', {
                    text: userInput,
                    id: id
                })
                .then(function (response) {
                    itemTextEl.innerHTML = userInput
                    console.log('from bowser.js: ', response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }
})