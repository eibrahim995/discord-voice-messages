import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const startReact = () => {
  const discordChatButtonsContainer = document.getElementsByClassName("expression-picker-chat-input-button")[0].parentElement
  const voiceMessagesContainer = document.getElementById("discord-voice-messages-extension") || document.createElement("div")
  voiceMessagesContainer.setAttribute("id", "discord-voice-messages-extension")
  voiceMessagesContainer.classList.add("expression-picker-chat-input-button")
  discordChatButtonsContainer.append(voiceMessagesContainer);
  const root = ReactDOM.createRoot(voiceMessagesContainer);
  root.render(
      <React.StrictMode>
        <App/>
      </React.StrictMode>
  );
}
const documentLoadedListener = () => {
  const waitForIt = setInterval(() => {
    if (document.getElementsByClassName("expression-picker-chat-input-button").length > 0){
      clearInterval(waitForIt);
      startReact();
    }
  }, 100);
}
const domChangesHandler = () => {
  let oldHref = document.location.href;
  let bodyList = document.querySelector("body")
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        documentLoadedListener();
      }
    });
  });
  const config = {
    childList: true,
    subtree: true
  };
  observer.observe(bodyList, config);
}
window.addEventListener("load", documentLoadedListener);
domChangesHandler();