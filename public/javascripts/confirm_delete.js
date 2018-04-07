//All buttons with the class deleteCompleteAll
//trigger a confirmation alert in which the user can proceed or not.

var deleteButton = document.querySelectorAll('.delete-button');

deleteButton.forEach(function (button) {
    var name = button.getAttributeNode('title').value;
    button.addEventListener('click', function (event) {

        var confirmDelete = confirm('Are you sure you want to delete the task: ' + name + '?');

        if(!confirmDelete){
            event.preventDefault();
        }
})

});

