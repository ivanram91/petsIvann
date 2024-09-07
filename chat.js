let assistantData;
let socket;
let sessionId;
const chatButton = document.createElement("a");

function createChatWidget(containerId) {
  const chatContainer = document.getElementById(containerId);
  chatContainer.classList.add("chat-container");
  
  if (!chatContainer) {
    console.error("El contenedor especificado no se encontró en la página.");
    return;
  }

  chatButton.classList.add("chat-button", "show");

  const chatButtonText = document.createElement("div");
  chatButtonText.innerHTML = "¿Hola, tienes una pregunta?</br>Yo te puedo ayudar";

  const chatBtnImg = document.createElement("img");
  chatBtnImg.src = "/content/assets/" + assistantData.avatar + ".svg";

  chatButton.width = 70;
  chatBtnImg.height = 70;

  chatButton.appendChild(chatButtonText);
  chatButton.appendChild(chatBtnImg);

  const widget = document.createElement("div");
  widget.classList.add("widget", "hidden");
  
  const header = document.createElement("div");
  header.classList.add("header");

  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = "/content/assets/" + assistantData.avatar + ".svg";

  const avatarName = document.createElement("div");
  avatarName.classList.add("avatar-name");
  avatarName.innerText = "Hola, te atiende " + assistantData.name;
  
  const closeButton = document.createElement("a");
  closeButton.classList.add("close-button");
  
  const imgBtnClose = document.createElement("i");
  imgBtnClose.classList.add("fi", "fi-rs-circle-xmark");

  imgBtnClose.addEventListener("click", function() {
    chatButton.classList.toggle("show");
    widget.classList.toggle("show");
  })

  closeButton.appendChild(imgBtnClose);

  chatButton.addEventListener("click", function() {
    chatButton.classList.toggle("show");
    widget.classList.toggle("show");
  })

  header.appendChild(avatar);
  header.appendChild(avatarName);
  header.appendChild(closeButton);

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("messages-window");
  messageContainer.id = "messages-window";
    
  const contenedor = document.createElement("div");
  contenedor.id = "contenedor";
  contenedor.classList.add("contenedor");

  messageContainer.append(contenedor);
  
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("input-container");

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.id = "textInput";
  inputElement.classList.add("text-input");
  inputElement.placeholder = "Escribe tu mensaje";

  const inputButton = document.createElement("a");
  inputButton.classList.add("input-btn");

  const imgBtn = document.createElement("i");
  imgBtn.classList.add("fi", "fi-rs-paper-plane");

  inputButton.addEventListener("click", function() {
    prepareMessage();
  });

  inputButton.appendChild(imgBtn);
  inputContainer.append(inputElement);
  inputContainer.append(inputButton);

  inputElement.addEventListener("keypress", async function(e) {
    if (e.key === "Enter") {
      prepareMessage();
    }
  });
  
  widget.appendChild(header);
  widget.appendChild(messageContainer);
  widget.appendChild(inputContainer);

  chatContainer.appendChild(chatButton);
  chatContainer.appendChild(widget);

  loadScript("/scripts/socket.io.4.7.5.min.js", () => {
      loadScript("/scripts/momentjs.2.29.4.min.js", () => {
        moment();
      });

      socket = io();

      socket.on('connect', () => {
        const userId = sessionId;
        socket.emit('authenticate', userId);
      });

      socket.on('mensaje_desde_servidor', (data) => {
        const messageElementR = document.createElement("div");
        messageElementR.classList.add("bot-message");
        
        const botAvatarMsg = document.createElement("img");
        botAvatarMsg.src = "/content/assets/" +  assistantData.avatar + ".svg";

        const msgContainer = document.createElement("div");
        msgContainer.classList.add("bot");

        const botTextMsg = document.createElement("div");
        botTextMsg.innerHTML = data.message;
        botTextMsg.classList.add("bot-text");
        let horaR = moment().format("DD-MM HH:mm");

        const timestampR = document.createElement("div");
        timestampR.classList.add("timestamp");
        timestampR.innerHTML = horaR;

        msgContainer.appendChild(botTextMsg);
        msgContainer.appendChild(timestampR);

        messageElementR.appendChild(botAvatarMsg);
        messageElementR.appendChild(msgContainer);

        contenedor.appendChild(messageElementR);

        const messageContainer = document.getElementById("messages-window");

        inputElement.value = "";
        messageContainer.scrollTop = messageContainer.scrollHeight;
      });

      socket.on("disconnect", () => {});
  });
}

function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  script.onerror = () => {
    console.error(`Error al cargar el script ${src}`);
  };
  document.head.appendChild(script);
}

function prepareMessage() {
  const inputElement = document.getElementById("textInput");
  const messageText = inputElement.value.trim();
  inputElement.value = "";

    if (messageText !== "") {
      const messageElement = document.createElement("div");
      messageElement.classList.add("user-message");
      let hora = moment().format("DD-MM HH:mm");

      const msgText = document.createElement("span");
      msgText.classList.add("user");
      msgText.innerHTML = messageText;

      const timestamp = document.createElement("span");
      timestamp.classList.add("timestamp");
      timestamp.innerHTML = hora;

      messageElement.appendChild(msgText);
      messageElement.appendChild(timestamp);

      contenedor.appendChild(messageElement);

      sendMessage(messageText).then(function(t) {
        const messageElementR = document.createElement("div");
        messageElementR.classList.add("bot-message");
        
        const botAvatarMsg = document.createElement("img");
        botAvatarMsg.src = "/content/assets/" +  assistantData.avatar + ".svg";

        const msgContainer = document.createElement("div");
        msgContainer.classList.add("bot");

        const botTextMsg = document.createElement("div");
        botTextMsg.innerHTML = t.response;
        botTextMsg.classList.add("bot-text");
        let horaR = moment().format("DD-MM HH:mm");

        const timestampR = document.createElement("div");
        timestampR.classList.add("timestamp");
        timestampR.innerHTML = horaR;

        msgContainer.appendChild(botTextMsg);
        msgContainer.appendChild(timestampR);

        messageElementR.appendChild(botAvatarMsg);
        messageElementR.appendChild(msgContainer);

        contenedor.appendChild(messageElementR);

        const messageContainer = document.getElementById("messages-window");

        inputElement.value = "";
        messageContainer.scrollTop = messageContainer.scrollHeight;

        document.getElementById("messages-window").addEventListener("click", function(event) {
          if (event.target.classList.contains("quickActions")) {
            let dataValue = event.target.getAttribute("data-value");
            console.log("Botón clicado:", event.target);
            inputElement.value = dataValue;
            prepareMessage();
          }
        });
      })
      .catch(error => {
        console.error("Error: ", error);
      })
    }
}

function prepareMessageAuto(prompt) {
  const messageText = prompt;

  if (messageText !== "") {
    const messageElement = document.createElement("div");
    messageElement.classList.add("user");
    messageElement.textContent = messageText;
    messageElement.title = moment().format("DD-MM HH:mm");

    contenedor.appendChild(messageElement);

    sendMessage(messageText).then(function(t) {
      const messageElementR = document.createElement("div");
      messageElementR.classList.add("bot");
      
      const botAvatarMsg = document.createElement("img");
      botAvatarMsg.src = "/content/assets/" +  assistantData.avatar + ".svg";
      botAvatarMsg.width = 60;
      botAvatarMsg.height = 60;

      const botTextMsg = document.createElement("span");
      botTextMsg.innerHTML = t.response;
      botTextMsg.title = moment().format("DD-MM HH:mm");

      messageElementR.appendChild(botAvatarMsg);
      messageElementR.appendChild(botTextMsg);

      contenedor.appendChild(messageElementR);

      const messageContainer = document.getElementById("messages-window");

      messageContainer.scrollTop = messageContainer.scrollHeight;
      chatButton.click();

      const quickActions = document.querySelectorAll(".quickActions");
        quickActions.forEach(element => {
          element.addEventListener("click", e => {
            let dataValue = element.getAttribute("data-value");

            prepareMessageAuto(dataValue);
          })
        })
    });
  }
}

function sendMessage(texto) {
  return new Promise(function(resolve, reject) {
    const url = "/webchat/webhook";
    const data = { message: texto, uuid: uuid, sessionid: localStorage.getItem("sessionid") };

    fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      resolve(data);
    })
    .catch(error => {
      reject(error);
    });
  });
}

async function getConfigs (uuid) {
  const url = "/chat/configs/" + uuid;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(response => response.json())
  .then(async data => {
    assistantData = data;
    await getSessionId();
    createChatWidget("chat-container");
  })
  .catch(error => {
    console.error("Error: ", error);
  });
}

function getSessionId () {
  sessionId = localStorage.getItem("sessionid");
  
  if(!sessionId) {
    return new Promise((resolve, reject) => {
      let url = "/chat/sessionid";
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("sessionid", data.sessionId);
        resolve();
      })
      .catch(error => {
        console.error("Error: ", error);
        reject();
      });
    })
  }
}

const uuid = document.currentScript.getAttribute("data-uuid");

getConfigs(uuid);
