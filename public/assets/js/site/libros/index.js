$(document).ready(function () {
    
  // Initialize the delete button with a confirmation dialog
  $('.delete-items').on('click', function (e) {
    e.preventDefault();
    const form = $(this).closest('form');
    if (confirm('Estas seguro que quieres eliminar este libro?')) {
      form.submit();
    }
  });

});