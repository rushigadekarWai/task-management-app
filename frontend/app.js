document.addEventListener('DOMContentLoaded', function () {
  fetchTasks();
});

// Function to fetch tasks from the server and display them in the table
function fetchTasks() {
  fetch('http://localhost:3000/api/tasks')  // Assuming the endpoint to get tasks is '/tasks'
      .then(response => response.json())
      .then(data => {
          const taskTableBody = document.getElementById('task-table-body');
          taskTableBody.innerHTML = '';  // Clear the table before adding new rows

          data.forEach(task => {
              const taskRow = document.createElement('tr');
              
              taskRow.innerHTML = `
              <td><span class="task-owner">${task.task_owner}</span></td>
              <td>${task.task_name}</td>
              <td>${task.task_description}</td>
              <td><span class="badge ${getStatusBadge(task.status)}">${task.status}</span></td>
              <td>${task.start_date}</td>
              <td>${task.due_date}</td>
              <td>${task.assigned_to}</td>
              <td>
                  <button class="btn btn-outline-info btn-sm" onclick="editTask(${task.id})">Edit</button>

                  <button class="btn btn-outline-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
              </td>
           `;
              
              taskTableBody.appendChild(taskRow);
          });
      })
      .catch(error => {
          console.error('Error fetching tasks:', error);
      });
}

// Function to get the badge class for task status
function getStatusBadge(status) {
  switch(status) {
      case 'Completed': return 'bg-success';
      case 'In Progress': return 'bg-warning';
      case 'Open': return 'bg-danger';
      default: return '';
  }
}

// Function to handle Edit button click
function editTask(taskId) {
  fetch(`http://localhost:3000/api/tasks/${taskId}`)
      .then(response => response.json())
      .then(task => {
          // Assign task values to the form fields
          document.getElementById('task-owner').value = task.task_owner;
          document.getElementById('task-name').value = task.task_name;
          document.getElementById('task-description').value = task.task_description;

          // Convert start_date and due_date to the required format (yyyy-MM-dd)
          const startDate = new Date(task.start_date).toISOString().split('T')[0];
          const dueDate = new Date(task.due_date).toISOString().split('T')[0];

          // Assign the converted date values to the date input fields
          document.getElementById('start-date').value = startDate;
          document.getElementById('due-date').value = dueDate;

          document.getElementById('assigned-to').value = task.assigned_to;
          document.getElementById('priority').value = task.priority;
          document.getElementById('status').value = task.status;
          document.getElementById('task-id').value = task.id;  // Hidden field for task ID

          // Show the modal (Bootstrap method)
          const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
          editTaskModal.show();
      })
      .catch(error => {
          console.error('Error fetching task for editing:', error);
      });
}




// Function to handle form submission for updating task
// Function to handle form submission for updating task
function updateTask(event) {
  event.preventDefault();

  // Get task ID from hidden input field
  const taskId = document.getElementById('task-id').value;

  // Create updated task object
  const updatedTask = {
      task_owner: document.getElementById('task-owner').value,
      task_name: document.getElementById('task-name').value,
      task_description: document.getElementById('task-description').value,
      start_date: document.getElementById('start-date').value,
      due_date: document.getElementById('due-date').value,
      assigned_to: document.getElementById('assigned-to').value,
      priority: document.getElementById('priority').value,
      status: document.getElementById('status').value,
      reminder: document.getElementById('reminder').value
  };

  // Validation to ensure all required fields are filled
  if (!updatedTask.task_owner || !updatedTask.task_name || !updatedTask.task_description || !updatedTask.start_date || !updatedTask.due_date) {
      alert('Please fill out all required fields!');
      return;
  }

  // Send PUT request to update task
  fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error updating task: ' + response.statusText);
      }
      return response.json();
  })
  .then(data => {
      console.log('Task updated:', data);
      fetchTasks();  // Refresh the task list

      // Hide the modal after updating the task
      const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
      editTaskModal.hide();

      // Clear form fields after updating
      clearForm();

      // Reset modal state to ensure the close button works
      document.getElementById('editTaskModal').classList.remove('show');
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop').remove();
  })
  .catch(error => {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
  });
}




// Function to clear the form fields
function clearForm() {
    document.getElementById('task-owner').value = '';
    document.getElementById('task-name').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('assigned-to').value = '';
    document.getElementById('priority').value = '';
    document.getElementById('status').value = '';
    document.getElementById('reminder').value = '';
    document.getElementById('task-id').value = '';  // Reset the hidden field for task ID
}




// -----------------------------delete ---------------------

// Function to handle the delete button click
function deleteTask(taskId) {
  // Confirm the deletion with the user
  if (confirm('Are you sure you want to delete this task?')) {
    fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Task deleted:', data);

      // Show success alert
      showAlert('Task deleted successfully!', 'success');
      
      // Refresh the task list
      fetchTasks();
    })
    .catch(error => {
      console.error('Error deleting task:', error);
      
      // Show error alert
      showAlert('Error deleting task. Please try again.', 'danger');
    });
  }
}

// Function to show alert messages (success or error)
function showAlert(message, type) {
  // Create a new alert div
  const alertDiv = document.createElement('div');
  
  // Set the message text
  alertDiv.textContent = message;

  // Set the styles for the alert
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '20px';
  alertDiv.style.right = '20px';
  alertDiv.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';  // Green for success, red for error
  alertDiv.style.color = '#ffffff';
  alertDiv.style.padding = '15px 25px';
  alertDiv.style.borderRadius = '8px';
  alertDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  alertDiv.style.fontSize = '16px';
  alertDiv.style.fontWeight = '500';
  alertDiv.style.zIndex = '1000';
  alertDiv.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in, visibility 0s 0.3s';
  alertDiv.style.transform = 'translateY(-20px)';
  alertDiv.style.opacity = '0';

  // Get the current number of alerts and adjust the top position so they don't overlap
  const currentAlerts = document.querySelectorAll('.alert');
  const alertSpacing = 20;  // Space between alerts
  alertDiv.style.top = `${20 + currentAlerts.length * (alertDiv.offsetHeight + alertSpacing)}px`;  // Adjust based on previous alerts

  // Append the alert to the body
  document.body.appendChild(alertDiv);

  // 🌟 Fast entry animation
  setTimeout(() => {
    alertDiv.style.opacity = '1';         // Fade in quickly
    alertDiv.style.transform = 'translateY(0)';  // Slide down quickly
  }, 10);

  // 🕑 Slow exit animation
  setTimeout(() => {
    alertDiv.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';  // Slower exit transition
    alertDiv.style.opacity = '0';         // Fade out slowly
    alertDiv.style.transform = 'translateY(-20px)';  // Move up slowly
    setTimeout(() => {
      alertDiv.remove();
    }, 1200);  // Wait for the slower fade-out to finish
  }, 2000);  // Keep the alert visible for 3 seconds
}


