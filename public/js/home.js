
        function changeFontSize(change) {
            const body = document.body;
            let currentFontSize = parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'));
            body.style.fontSize = (currentFontSize + change) + 'px';
        }

        function increaseFontSize() {
            changeFontSize(2); // Increase font size by 2px
        }

        function decreaseFontSize() {
            changeFontSize(-2); // Decrease font size by 2px
        }
  function increaseFontSize() {
    document.body.style.fontSize = "larger";
  }

  function decreaseFontSize() {
    document.body.style.fontSize = "smaller";
  }

    function sendUserMessage() {
        let userInput = document.getElementById('userInput').value;
        if (userInput.trim() === '') return;

        appendUserMessage(userInput);
        fetchBotResponse(userInput);
        document.getElementById('userInput').value = '';
    }

    function appendBotMessage(message) {
        let chatBox = document.getElementById('chatBox');
        let botMessage = `<div class="chat-message bot-message"><p>${message}</p></div>`;
        chatBox.innerHTML += botMessage;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendUserMessage(message) {
        let chatBox = document.getElementById('chatBox');
        let userMessage = `<div class="chat-message user-message"><p>${message}</p></div>`;
        chatBox.innerHTML += userMessage;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function fetchBotResponse(userInput) {
        fetch('/get_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_input: userInput })
        })
        .then(response => response.json())
        .then(data => {
            let botResponse = data.response.join("<br>"); // Join responses with line break if multiple
            appendBotMessage(botResponse);
        })
        .catch(error => console.error('Error fetching bot response:', error));
    }

    document.getElementById('userInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

