const route = (event) => {
  event = event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
};

window.route = route;
