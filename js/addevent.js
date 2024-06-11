let dateTimeCount = 1;

function addDateTimeField() {
  dateTimeCount++;
  const newDateTimeDiv = document.createElement('div');
  newDateTimeDiv.className = 'mb-3';
  newDateTimeDiv.innerHTML = `
    <label for="eventDateTime${dateTimeCount}" class="form-label">Event Times</label>
    <input type="datetime-local" class="form-control" id="eventDateTime${dateTimeCount}" name="eventDateTime[]">
    <button type="button" class="btn btn-danger" onclick="removeDateTimeField(this)">
      <i class="fas fa-times"></i> <!-- X icon -->
    </button>
  `;
  document.getElementById('dateTimeFields').appendChild(newDateTimeDiv);
}

function removeDateTimeField(button) {
  const dateTimeField = button.parentNode;
  dateTimeField.parentNode.removeChild(dateTimeField);
}