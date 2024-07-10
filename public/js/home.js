
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
  