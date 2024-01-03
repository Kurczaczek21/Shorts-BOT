const wrapper = document.querySelector(".wrapper");
const btnPopUp = document.querySelector(".btnLogin-popUp");
const iconClose = document.querySelector(".icon-close");

btnPopUp.addEventListener("click", () => {
  wrapper.classList.add("active-popUp");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popUp");
});

function getCookie(name) {
  var nameEQ = name + '=';
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
  }
  return null;
}

async function makeAuthorizedRequest() {
  // Get the token from the cookie
  var token = getCookie('token');
  console.log(token);

  if (!token) {
      // Token is not present, handle this case (e.g., redirect to login)
      console.error('Token is missing. Redirect to login page.');
      return;
  }

  try {
      const response = await fetch('/logged-in', {
          method: 'GET',
          headers: {
              'Authorization': token,
          },
      });

      console.log(response);
      
      if (!response.ok) {
          // Server returned an error status, handle this case
          console.error('Server returned an error:', response.status);
          // You might want to redirect to the login page or show an error message to the user
          return;
      }

      const data = await response.json();
      // Handle the successful response data as needed
      console.log(data);
  } catch (error) {
      // Handle network errors or other unexpected issues
      console.error('Error:', error);
      // You might want to redirect to the login page or show an error message to the user
  }
}

async function login() {
  // Get the username and password from the form
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Send a POST request to the server for authentication
  await fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
      if (data.token) {
          // Authentication successful, save the token and redirect
          document.cookie = `token=${data.token}; path=/`;
          makeAuthorizedRequest()
          // window.location.href = '/logged-in';
      } else {
          // Authentication failed, show an error message or handle accordingly
          alert('Authentication failed. Please check your credentials.');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}
