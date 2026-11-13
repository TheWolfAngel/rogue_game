// ========================================
// JOURNAL DE JEU
// ========================================
export function addMessage(message, type) {
    const messages = document.getElementById("messages");
    const newMessage = document.createElement("p");
    newMessage.textContent = message;
    newMessage.classList.add("message-" + type);
    messages.appendChild(newMessage);
    // Garder le journal positionne sur le dernier message
    messages.scrollTop = messages.scrollHeight;
}