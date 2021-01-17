const popup = {
  showAlert(message) {
    return alert(message);
  },

  showConfirm(message) {
    return confirm(message);
  },

  showPrompt(message) {
    return prompt(message);
  },
};

export default popup;
