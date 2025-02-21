document.addEventListener('DOMContentLoaded', () => {
    const scriptCanvas = document.querySelector('.script-canvas');
    const navContainer = document.querySelector('.script-nav-container');
    const jsonFilePath = 'https://mis-ghostjm.github.io/Scripts-beta-test/scripts.json'; // Update with actual path if needed
    const customerInput = document.getElementById('customer');
    const agentInput = document.getElementById('user');

    // Fetch JSON and generate modules and nav buttons
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            generateNavButtons(data);
            generateScriptModules(data);
            initializeSyncInputs(); // Ensure sync after loading
        })
        .catch(error => console.error('Failed to load scripts:', error));

    function generateNavButtons(scripts) {
        const uniqueIds = [...new Set(scripts.map(script => script.id))];
        navContainer.innerHTML = '';

        uniqueIds.sort((a, b) => (a === 'opening' ? -1 : b === 'opening' ? 1 : 0));

        uniqueIds.forEach(id => {
            const button = document.createElement('button');
            button.id = `${id}-nav`;
            button.classList.add('nav-btn');
            if (id === 'opening') button.classList.add('active');
            button.textContent = id.charAt(0).toUpperCase() + id.slice(1);

            button.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                toggleScriptModule(id);
            });

            navContainer.appendChild(button);
        });
    }

    function toggleScriptModule(id) {
        document.querySelectorAll('.script-module').forEach(module => {
            module.classList.remove('active');
        });

        const activeModule = document.getElementById(id);
        if (activeModule) {
            activeModule.classList.add('active');
        }
    }

    function generateScriptModules(scripts) {
        const modules = {};

        // Group script titles under unique script-module IDs
        scripts.forEach(script => {
            if (!modules[script.id]) {
                const moduleDiv = document.createElement('div');
                moduleDiv.classList.add('script-module');
                if (script.id === 'opening') moduleDiv.classList.add('active');
                moduleDiv.id = script.id;
                modules[script.id] = moduleDiv;
            }

            const titleDiv = document.createElement('div');
            titleDiv.classList.add(`script-title-${script.category}`);
            if (script.id === 'opening') titleDiv.classList.add('active');
            titleDiv.innerHTML = `
                <h4>${script.title}</h4>
                <p>${script.description}</p>
            `;

            const cardSubDiv = document.createElement('div');
            cardSubDiv.classList.add('script-card-sub');
            if (script.id === 'opening') cardSubDiv.classList.add('active');

            script.cards.forEach(card => {
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('card-module');
                cardDiv.innerHTML = convertToEditable(card.content);
                cardSubDiv.appendChild(cardDiv);
            });

            modules[script.id].appendChild(titleDiv);
            modules[script.id].appendChild(cardSubDiv);
        });

        // Append all modules to the script canvas
        Object.values(modules).forEach(module => scriptCanvas.appendChild(module));
    }

    // Convert placeholders [Cx Name] into editable spans
    function convertToEditable(content) {
        return content.replace(/\[(.+?)\]/g, (match, p1) => {
            return `<span class="manual-edit" data-default-text="${match}">${match}</span>`;
        });
    }

    // Initialize sync after content is loaded
    function initializeSyncInputs() {
        syncEditableFields(customerInput, '[Cx Name]');
        syncEditableFields(agentInput, '[Agent Name]');
        observeResets();
        updateEditableFromInput(customerInput, '[Cx Name]');
        updateEditableFromInput(agentInput, '[Agent Name]');
        updateInputFromEditable(customerInput, '[Cx Name]');
        updateInputFromEditable(agentInput, '[Agent Name]');
    }

    function syncEditableFields(input, defaultText) {
        const fields = document.querySelectorAll(`.manual-edit[data-default-text="${defaultText}"]`);

        input.addEventListener('input', () => {
            fields.forEach(field => field.textContent = input.value.trim() || defaultText);
        });

        fields.forEach(field => {
            field.addEventListener('input', () => {
                input.value = field.textContent.trim();
            });

            field.addEventListener('blur', () => {
                if (field.textContent.trim() === '' || field.textContent.trim() === defaultText) {
                    input.value = '';
                    field.textContent = defaultText;
                }
            });
        });
    }

    function updateEditableFromInput(input, defaultText) {
        const fields = document.querySelectorAll(`.manual-edit[data-default-text="${defaultText}"]`);
        fields.forEach(field => field.textContent = input.value.trim() || defaultText);
    }

    function updateInputFromEditable(input, defaultText) {
        const fields = document.querySelectorAll(`.manual-edit[data-default-text="${defaultText}"]`);
        fields.forEach(field => {
            field.addEventListener('input', () => {
                input.value = field.textContent.trim();
            });

            field.addEventListener('blur', () => {
                if (field.textContent.trim() === '' || field.textContent.trim() === defaultText) {
                    input.value = '';
                    field.textContent = defaultText;
                }
            });
        });
    }

    function observeResets() {
        const resetObserver = new MutationObserver(() => {
            document.querySelectorAll('.manual-edit').forEach(field => {
                const defaultText = field.getAttribute('data-default-text');
                if (field.textContent.trim() === defaultText) {
                    if (defaultText === '[Cx Name]') customerInput.value = '';
                    if (defaultText === '[Agent Name]') agentInput.value = '';
                }
            });
        });

        document.querySelectorAll('.manual-edit').forEach(field => {
            resetObserver.observe(field, { childList: true, subtree: true });
        });
    }
});
