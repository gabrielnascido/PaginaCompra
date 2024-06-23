function cadastrar() {
    // Obtenha os valores dos campos
    var nome = document.getElementById('nome_cad').value;
    var email = document.getElementById('email_cad').value;
    var cpf = document.getElementById('cpf_cad').value;
    var cep = document.getElementById('cep_cad').value;
    var rua = document.getElementById('rua_cad').value;
    var numero = document.getElementById('numero_cad').value;
    var bairro = document.getElementById('bairro_cad').value;
    var cidade = document.getElementById('cidade_cad').value;
    var uf = document.getElementById('uf_cad').value;
    var dataNascimento = document.getElementById('data_cad').value;
    var senha = document.getElementById('senha_cad').value;
    var confirmacaoSenha = document.getElementById('senha_conf').value;

    // Limpe as mensagens de erro anteriores

    // Validação: Nome, E-mail, CPF, CEP, Rua, Bairro, Cidade, UF, Número, Data de Nascimento, Senha não devem estar vazios
    if (
        nome === '' || email === '' || cpf === '' || cep === '' || rua === '' || numero === '' ||
        bairro === '' || cidade === '' || uf === '' || dataNascimento === '' || senha === ''
    ) {
        mostarModalMensagem("ERRO", "Preencha todos os campos obrigatórios.");
        return;
    }

    // Validação: E-mail deve estar no formato correto
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostarModalMensagem("ERRO", "E-mail inválido.");
        return;
    }

    // Validação: CEP deve conter apenas números
    if (! /^\d+$/.test(cep)) {
        mostarModalMensagem("ERRO", "CEP deve conter apenas números.");
        return;
    }

    // Validação: Número deve conter apenas números
    if (! /^\d+$/.test(numero)) {
        mostarModalMensagem("ERRO", "Número deve conter apenas números.");
        return;
    }

    // Validação: CPF deve conter apenas números e ser válido
    if (! /^\d{11}$/.test(cpf) || !validarCPF(cpf)) {
        mostarModalMensagem("ERRO", "CPF inválido.");
        return;
    }

    // Validação: senha e confirmação de senha devem ser iguais
    if (senha !== confirmacaoSenha) {
        mostarModalMensagem("ERRO", "Senha e confirmação de senha não conferem.");
        return;
    }


    // Validação: Data de Nascimento deve ser uma data válida e o usuário deve ter 18 anos ou mais
    if (!validarDataNascimento(dataNascimento)) {
        mostarModalMensagem("ERRO", "Data de Nascimento inválida. Você deve ter pelo menos 18 anos.");
        return;
    }

    // Validação: Senha deve ter no mínimo 8 dígitos
    if (senha.length < 8) {
        mostarModalMensagem("ERRO", "A senha deve ter pelo menos 8 dígitos.");
        return;
    }

    // Cria um objeto representando o usuário
    var usuario = {
        nome: nome,
        email: email,
        cpf: cpf,
        cep: cep,
        rua: rua,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        dataNascimento: dataNascimento,
        senha: senha
    };

    // Armazena o objeto do usuário no Local Storage
    localStorage.setItem(email, JSON.stringify(usuario));
    mostarModalMensagem("SUCESSO", "Usuário cadastrado com sucesso! :D <p> Boas compras!")

    //loga o usuario
    localStorage.setItem('usuarioLogado', email);
    exibirInformacoesUsuario(usuario);
}

//Função para buscar o CEP
function buscarCEP() {
    var cep = document.getElementById('cep_cad').value;

    if (!/^\d+$/.test(cep)) {
        mostarModalMensagem("ERRO", "CEP deve conter apenas números.");
        return;
    }

    var xhr = new XMLHttpRequest();
    var targetUrl = 'https://viacep.com.br/ws/' + cep + '/json/';
    xhr.open('GET', targetUrl, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            var resposta = JSON.parse(xhr.responseText);
            document.getElementById('rua_cad').value = resposta.logradouro;
            document.getElementById('bairro_cad').value = resposta.bairro;
            document.getElementById('cidade_cad').value = resposta.localidade;
            document.getElementById('uf_cad').value = resposta.uf;
            document.getElementById('modalMensagem').style.display = 'none';


            document.getElementById('rua_cad').readOnly = true;
            document.getElementById('bairro_cad').readOnly = true;
            document.getElementById('cidade_cad').readOnly = true;
            document.getElementById('uf_cad').readOnly = true;
            document.getElementById('rua_cad').style.backgroundColor = '#f0f0f0';
            document.getElementById('bairro_cad').style.backgroundColor = '#f0f0f0';
            document.getElementById('cidade_cad').style.backgroundColor = '#f0f0f0';
            document.getElementById('uf_cad').style.backgroundColor = '#f0f0f0';
            

            mostarModalMensagem("SUCESSO", "CEP encontrado com sucesso <p> Por gentileza, não esqueça de completar com o número do endereço! ;)",);

            document.getElementById('numero_cad').focus();

        } if (document.getElementById('rua__cad').value == 'undefined'){
            mostarModalMensagem("ERRO", "CEP não encontrado. Por gentileza, informe os dados manualmente ou verifique o CEP informado.");
            document.getElementById('rua_cad').readOnly = false;
            document.getElementById('bairro_cad').readOnly = false;
            document.getElementById('cidade_cad').readOnly = false;
            document.getElementById('uf_cad').readOnly = false;

            document.getElementById('rua_cad').style.backgroundColor = '#ffffff';
            document.getElementById('bairro_cad').style.backgroundColor = '#ffffff';
            document.getElementById('cidade_cad').style.backgroundColor = '#ffffff';
            document.getElementById('uf_cad').style.backgroundColor = '#ffffff';
            
            document.getElementById('rua_cad').value = '';
            document.getElementById('bairro_cad').value = '';
            document.getElementById('cidade_cad').value = '';
            document.getElementById('uf_cad').value = '';
        }
    };

    // Adiciona tratamento para erros de rede ou CORS
    xhr.onerror = function () {
        mostarModalMensagem("ERRO", "CEP não encontrado. Por gentileza, informe os dados manualmente ou verifique o CEP informado.");
        document.getElementById('rua_cad').readOnly = false;
        document.getElementById('bairro_cad').readOnly = false;
        document.getElementById('cidade_cad').readOnly = false;
        document.getElementById('uf_cad').readOnly = false;

        document.getElementById('rua_cad').style.backgroundColor = '#ffffff';
        document.getElementById('bairro_cad').style.backgroundColor = '#ffffff';
        document.getElementById('cidade_cad').style.backgroundColor = '#ffffff';
        document.getElementById('uf_cad').style.backgroundColor = '#ffffff';
        
        document.getElementById('rua_cad').value = '';
        document.getElementById('bairro_cad').value = '';
        document.getElementById('cidade_cad').value = '';
        document.getElementById('uf_cad').value = '';
    };

    xhr.send();
}

//adiciona para que a função buscar cep seja chamada ao sair do campo
document.getElementById('cep_cad').addEventListener('blur', buscarCEP);

//adiciona para que a função buscar cep seja chamada ao sair do campo
document.getElementById('cep_cad').addEventListener('blur', buscarCEP);


// Função para validar Data de Nascimento
function validarDataNascimento(dataNascimento) {
    // Converta a data de nascimento para um objeto Date
    var dataNascimentoObj = new Date(dataNascimento);

    // Crie uma nova data representando hoje
    var hoje = new Date();

    // Subtraia 18 anos da data atual
    var dataMenos18Anos = new Date();
    dataMenos18Anos.setFullYear(hoje.getFullYear() - 18);

    // Compare as datas
    if (dataNascimentoObj > dataMenos18Anos) {
        return false; // A pessoa não tem pelo menos 18 anos
    }

    return true; // A pessoa tem pelo menos 18 anos
}

function validarCPF(cpf) {
    if (cpf.length != 11) {
        return false;
    } else {
        var numeros = cpf.substring(0, 9);
        var digitos = cpf.substring(9);
        var soma = 0;
        for (var i = 10; i > 1; i--) {
            soma += numeros.charAt(10 - i) * i;
        }
        var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        // validação do primeiro dígito
        if (resultado != digitos.charAt(0)) {
            return false;
        }
        soma = 0;
        numeros = cpf.substring(0, 10);
        for (var k = 11; k > 1; k--) {
            soma += numeros.charAt(11 - k) * k;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        // validação do segundo dígito
        if (resultado != digitos.charAt(1)) {
            return false;
        }
        return true;
    }
}

// Função para exibir as informações do usuário e alterar a visibilidade dos elementos
function exibirInformacoesUsuario(usuario) {
    // Esconde o formulário de login
    document.getElementById('login').style.display = 'none';
    document.getElementById('cadastro').style.display = 'none';

    // Exibe a seção de informações do usuário
    document.getElementById('userInfoSection').style.display = 'block';

    // Preenche os campos de informações do usuário
    document.getElementById('userInfoNome').textContent = usuario.nome;
    document.getElementById('userInfoEmail').textContent = usuario.email;
    document.getElementById('userInfoCPF').textContent = usuario.cpf;
    document.getElementById('userInfoCEP').textContent = usuario.cep;
    document.getElementById('userInfoRua').textContent = usuario.rua;
    document.getElementById('userInfoNumero').textContent = usuario.numero;
    document.getElementById('userInfoBairro').textContent = usuario.bairro;
    document.getElementById('userInfoCidade').textContent = usuario.cidade;
    document.getElementById('userInfoUF').textContent = usuario.uf;
    // Verifica se a data de nascimento está presente antes de tentar definir o textContent
    if (usuario && usuario.dataNascimento) {
        let data = new Date(usuario.dataNascimento);
        document.getElementById('userInfoDataNascimento').textContent = data.toLocaleDateString();
    } else {
        // Se a data de nascimento não estiver presente, deixe o campo vazio ou forneça uma mensagem alternativa
        document.getElementById('userInfoDataNascimento').textContent = 'Data de Nascimento não informada';
    }
}

// Função para realizar o logout
function fazerLogout() {
    // Remove o email do usuário logado do Local Storage
    localStorage.removeItem('usuarioLogado');

    // Exibe o formulário de login
    document.getElementById('login').style.display = 'block';

    // Esconde a seção de informações do usuário
    document.getElementById('userInfoSection').style.display = 'none';
}

// Função para realizar o login
function login() {
    var email = document.getElementById('email_login').value;
    var senha = document.getElementById('senha_login').value;

    // Verifica se o usuário está cadastrado
    if (localStorage.getItem(email)) {
        var usuario = JSON.parse(localStorage.getItem(email));

        // Verifica se a senha está correta
        if (senha === usuario.senha) {
            // Armazena o email do usuário logado
            localStorage.setItem('usuarioLogado', email);

            // Exibe as informações do usuário
            exibirInformacoesUsuario(usuario);
        } else {
            mostarModalMensagem("ERRO", "Senha incorreta. Tente novamente.");
        }
    } else {
        mostarModalMensagem("ERRO", "Usuário não encontrado. Por favor, cadastre-se.");
    }
}

// Função para verificar o status do usuário ao carregar a página
function verificarStatusUsuario() {
    var emailLogado = localStorage.getItem('usuarioLogado');

    if (emailLogado) {
        // Usuário está logado
        var usuario = JSON.parse(localStorage.getItem(emailLogado));
        exibirInformacoesUsuario(usuario);
    } else {
        // Usuário não está logado
        document.getElementById('login').style.display = 'block';
        document.getElementById('userInfoSection').style.display = 'none';
    }
}

// Chamada da função para verificar o status do usuário ao carregar a página
verificarStatusUsuario();


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