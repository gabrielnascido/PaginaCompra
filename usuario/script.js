function cadastrar() {
    // Obtenha os valores dos campos
    var nome = document.getElementById('nome_cad').value;
    var email = document.getElementById('email_cad').value;
    var cpf = document.getElementById('cpf_cad').value;
    var cep = document.getElementById('cep_cad').value;
    var rua = document.getElementById('rua_cad').value;
    var bairro = document.getElementById('bairro_cad').value;
    var cidade = document.getElementById('cidade_cad').value;
    var uf = document.getElementById('uf_cad').value;
    var dataNascimento = document.getElementById('data_cad').value;
    var senha = document.getElementById('senha_cad').value;

    // Limpe as mensagens de erro anteriores

    // Validação: Nome, E-mail, CPF, CEP, Rua, Bairro, Cidade, UF, Número, Data de Nascimento, Senha não devem estar vazios
    if (
        nome === '' || email === '' || cpf === '' || cep === '' || rua === '' ||
        bairro === '' || cidade === '' || uf === '' || dataNascimento === '' || senha === ''
    ) {
        alert('Preenchea todos os campos obrigatórios.');
        return;
    }

    // Validação: E-mail deve estar no formato correto
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('E-mail inválido.');
        return;
    }

    // Validação: CEP deve conter apenas números
    if (! /^\d+$/.test(cep)) {
        alert('CEP deve conter apenas números.');
        return;
    }

    // Validação: CPF deve conter apenas números e ser válido
    if (! /^\d{11}$/.test(cpf) || !validarCPF(cpf)) {
        alert('CPF inválido.');
        return;
    }

    // Validação: Data de Nascimento deve ser uma data válida e o usuário deve ter 18 anos ou mais
    if (!validarDataNascimento(dataNascimento)) {
        alert('Data de Nascimento inválida. Você deve ter pelo menos 18 anos.');
        return;
    }

    // Validação: Senha deve ter no mínimo 8 dígitos
    if (senha.length < 8) {
        alert('A senha deve ter pelo menos 8 digitos.');
        return;
    }

    // Cria um objeto representando o usuário
    var usuario = {
        nome: nome,
        email: email,
        cpf: cpf,
        cep: cep,
        rua: rua,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        dataNascimento: dataNascimento,
        senha: senha
    };

    // Armazena o objeto do usuário no Local Storage
    localStorage.setItem(email, JSON.stringify(usuario));

    // Exibe uma mensagem para o usuário
    alert('Cadastro realizado com sucesso!');
}

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
            alert('Senha incorreta. Tente novamente.');
        }
    } else {
        alert('Usuário não encontrado. Por favor, cadastre-se.');
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
