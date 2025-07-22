$(document).ready(function () {
    
  // Initialize the delete button with a confirmation dialog
  $('.delete-pokemones').on('click', function (e) {
    e.preventDefault();
    const form = $(this).closest('form');
    if (confirm('Estas seguro que quieres eliminar este pokemon?')) {
      form.submit();
    }
  });

});