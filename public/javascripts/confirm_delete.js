//All buttons with the class deleteCompleteAll
//trigger a confirmation alert in which the user can proceed or not.
var deleteButton = document.querySelectorAll('.deleteCompleteAll');

deleteButton.forEach(function (button) {

    button.addEventListener('click', function (event) {
        var confirmDelete = confirm('Are your sure you want to delete all completed tasks?');

        if(!confirmDelete){
            event.preventDefault();
        }
})

});