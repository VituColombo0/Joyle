/**
 * JOYLE DEEP TECH — Validação e Envio do Formulário de Contato
 *
 * Validação client-side com exibição de erros inline.
 * Envia via Formspree.
 */

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');
const errorBanner = document.getElementById('formError');

if (form) {
    // ── Validadores ──────────────────────────────────────────────────────────
    const validators = {
        name: (v) => {
            if (!v.trim()) return 'O nome é obrigatório.';
            if (v.trim().length < 2) return 'O nome deve ter pelo menos 2 caracteres.';
            return null;
        },
        email: (v) => {
            if (!v.trim()) return 'O e-mail é obrigatório.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Por favor, insira um e-mail válido.';
            return null;
        },
        subject: (v) => {
            if (!v.trim()) return 'O assunto é obrigatório.';
            return null;
        },
        message: (v) => {
            if (!v.trim()) return 'A mensagem é obrigatória.';
            if (v.trim().length < 10) return 'A mensagem deve ter pelo menos 10 caracteres.';
            return null;
        },
    };

    // ── Exibir / Limpar Erro ─────────────────────────────────────────────────
    function showError(field, message) {
        const input = form.querySelector(`#${field}`);
        const errorEl = input ? input.parentElement.querySelector('.form-error') : null;
        if (input) input.classList.add('is-error');
        if (errorEl) errorEl.textContent = message;
    }

    function clearError(field) {
        const input = form.querySelector(`#${field}`);
        const errorEl = input ? input.parentElement.querySelector('.form-error') : null;
        if (input) input.classList.remove('is-error');
        if (errorEl) errorEl.textContent = '';
    }

    // ── Validação ao sair do campo (blur) ────────────────────────────────────
    ['name', 'email', 'subject', 'message'].forEach((field) => {
        const input = form.querySelector(`#${field}`);
        if (!input) return;

        input.addEventListener('blur', () => {
            const error = validators[field](input.value);
            if (error) showError(field, error);
            else clearError(field);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('is-error')) {
                const error = validators[field](input.value);
                if (!error) clearError(field);
            }
        });
    });

    // ── Envio do Formulário ──────────────────────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar todos os campos
        let isValid = true;
        const fields = ['name', 'email', 'subject', 'message'];

        fields.forEach((field) => {
            const input = form.querySelector(`#${field}`);
            if (!input) return;
            const error = validators[field](input.value);
            if (error) {
                showError(field, error);
                isValid = false;
            } else {
                clearError(field);
            }
        });

        if (!isValid) return;

        // Mostrar estado de carregamento
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form),
            });

            // Tentar capturar a resposta detalhada do servidor
            let data = {};
            try {
                const responseText = await response.text();
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('A resposta do servidor não é um JSON válido. Verifique se o caminho do script está correto.');
            }

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            // Sucesso:
            form.reset();
            if (successMsg) {
                successMsg.removeAttribute('hidden');
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Reabilitar após alguns segundos (caso o usuário queira enviar novamente)
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                if (successMsg) successMsg.setAttribute('hidden', '');
            }, 6000);

        } catch (err) {
            console.error('Erro detalhado no envio do formulário:', err);
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            // Mostrar banner de erro
            if (errorBanner) {
                errorBanner.removeAttribute('hidden');
                errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                setTimeout(() => errorBanner.setAttribute('hidden', ''), 8000);
            }
        }
    });
}
