function openTooltip(event) {
  const tooltip = event.target.closest('.tooltip');
  tooltip.classList.add('active');

  // Проверка и коррекция положения tooltip__window
  const tooltipWindow = tooltip.querySelector('.tooltip__window');
  const tooltipWindowRect = tooltipWindow.getBoundingClientRect();

  if (tooltipWindowRect.right > window.innerWidth) {
    tooltipWindow.style.right = 0;
    tooltipWindow.style.left = 'auto';
    tooltipWindow.style.transform = 'none';
  }
}

function closeTooltip(event) {
  const tooltip = event.target.closest('.tooltip');
  tooltip.classList.remove('active');
}

document.querySelectorAll('.tooltip').forEach((icon) => {
  icon.addEventListener('mouseover', openTooltip);
  icon.addEventListener('mouseout', closeTooltip);

  icon.setAttribute('tabindex', '0');

  icon.addEventListener('focus', openTooltip);
  icon.addEventListener('blur', closeTooltip);
});

// Функция для закрытия всех подсказок
function closeAllTooltips() {
  const tooltips = document.querySelectorAll('.tooltip');
  tooltips.forEach((tooltip) => {
    tooltip.classList.remove('active');
  });
}

// Закрытие всех подсказок при клике вне подсказки
document.addEventListener('click', (event) => {
  if (!event.target.closest('.tooltip')) {
    closeAllTooltips();
  }
});

// Обработчик события resize для обновления позиций tooltip__window
window.addEventListener('resize', () => {
  document.querySelectorAll('.tooltip.active').forEach((tooltip) => {
    const tooltipWindow = tooltip.querySelector('.tooltip__window');
    const tooltipWindowRect = tooltipWindow.getBoundingClientRect();

    if (tooltipWindowRect.right > window.innerWidth) {
      tooltipWindow.style.right = 0;
      tooltipWindow.style.left = 'auto';
      tooltipWindow.style.transform = 'none';
    }
  });
});
