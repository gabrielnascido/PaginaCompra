function enviarContato() {

    // Obtenha os valores dos campos
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var assunto = document.getElementById('assunto').value;
    var mensagem = document.getElementById('mensagem').value;
    
    // Validação: Nome, E-mail, Assunto e Mensagem são obrigatórios
    if (!nome || !email || !assunto || !mensagem) {
        mostarModalMensagem("ERRO", "Todos os campos são obrigatórios.");
        return;
    }

    // Validação: E-mail deve estar no formato correto
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostarModalMensagem("ERRO", "E-mail inválido.");
        return;
    }

    //enivar mensagem
    mostarModalMensagem("SUCESSO", "Mensagem enviada com sucesso! <p> Em breve entraremos em contato.");
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('assunto').value = '';
    document.getElementById('mensagem').value = '';    
}

function mostarModalMensagem(titulo, mensagem, callbackYes = null, callbackNo = null) {
    var modalMensagem = document.getElementById('modalMensagem');
    var mensagemModal = document.getElementById('mensagemModal');
    var tituloModal = document.getElementById('tituloModal');
    var confirmYes = document.getElementById("btnConfirm");
    var confirmNo = document.getElementById("btnCancel");

    confirmYes.style.display = 'none';
    confirmNo.style.display = 'none';

    modalMensagem.style.display = 'block';
    mensagemModal.innerHTML = mensagem;
    mensagemModal.style.fontWeight = 'bold';

    modalMensagem.style.zIndex = 10;

    switch (titulo) {
        case "ERRO":
            tituloModal.innerHTML = '<i class="fa-solid fa-exclamation-triangle fa-2xl" style="color: #black;"></i>';
            break;
        case "SUCESSO":
            tituloModal.innerHTML = '<i class="fa-solid fa-check fa-2xl" style="color: #black;"></i>';
            break;
        case "INFO":
            tituloModal.innerHTML = '<i class="fa-solid fa-info fa-2xl" style="color: #black;"></i>';
            break;
        case "PERGUNTA":
            tituloModal.innerHTML = '<i class="fa-solid fa-question fa-2xl" style="color: #black;"></i>';
            confirmYes.style.display = 'block';
            confirmNo.style.display = 'block';

            confirmYes.addEventListener("click", function () {
                if (typeof callbackYes === "function") {
                    callbackYes();  // Chamada do callback apenas no clique do botão
                }
                modalMensagem.style.display = "none";
            });

            confirmNo.addEventListener("click", function () {
                if (typeof callbackNo === "function") {
                    callbackNo();  // Chamada do callback apenas no clique do botão
                }
                modalMensagem.style.display = "none";
            });
            break;
        default:
            break;
    }
}


function fecharModalMensagem() {
    document.getElementById('modalMensagem').style.display = 'none';
}