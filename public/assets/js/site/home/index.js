// Script para manejar la rotación del icono de chevron en el colapso
  document.addEventListener('DOMContentLoaded', function () {
    const collapseElement = document.getElementById('collapseRegionFilter');
    const collapseIcon = document.querySelector('.collapse-icon');

    // Cambia la clase para rotar el icono
    collapseElement.addEventListener('show.bs.collapse', function () {
      collapseIcon.classList.remove('bi-chevron-down');
      collapseIcon.classList.add('bi-chevron-up');
    });

    collapseElement.addEventListener('hide.bs.collapse', function () {
      collapseIcon.classList.remove('bi-chevron-up');
      collapseIcon.classList.add('bi-chevron-down');
    });
  });