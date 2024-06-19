document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('select-ordenacao').addEventListener('change', function () {
        ordenarProdutos(this.value);
    });

    var listaProdutos = document.getElementById('produtos').querySelector('ul');

    function ordenarProdutos(criterio) {
        var produtos = Array.from(listaProdutos.getElementsByTagName('li'));

        if (criterio.includes('price')) {
            ordenarPorPreco(produtos, criterio);
        } else {
            ordenarPorNome(produtos, criterio);
        }
    }

    function ordenarPorPreco(produtos, criterio) {
        produtos.sort(function (a, b) {
            var valorA = parseFloat(a.querySelector('.valor-produto').textContent.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
            var valorB = parseFloat(b.querySelector('.valor-produto').textContent.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());

            if (criterio.includes('asc')) {
                return valorA - valorB;
            } else {
                return valorB - valorA;
            }
        });

        limparEAdicionarProdutos(produtos);
    }

    function ordenarPorNome(produtos, criterio) {
        produtos.sort(function (a, b) {
            var valorA = a.querySelector('.nome-produto').textContent.trim().toLowerCase();
            var valorB = b.querySelector('.nome-produto').textContent.trim().toLowerCase();

            if (criterio.includes('asc')) {
                return valorA.localeCompare(valorB);
            } else {
                return valorB.localeCompare(valorA);
            }
        });

        limparEAdicionarProdutos(produtos);
    }

    function limparEAdicionarProdutos(produtos) {
        listaProdutos.innerHTML = '';
        produtos.forEach(function (produto) {
            listaProdutos.appendChild(produto);
        });
    }
});

//------------------------------------------------------------------------------------------------------------------------------

function mostrarModal(elementoProduto) {
    var modal = document.getElementById('myModal');
    modal.style.display = 'block';

    // Obtém os elementos dentro da div produto
    var imagem = elementoProduto.querySelector('.imagem-produto img').src;
    var nome = elementoProduto.querySelector('.nome-produto').textContent;
    var descricao = elementoProduto.querySelector('.descricao-produto').textContent;
    var preco = elementoProduto.querySelector('.valor-produto').textContent;

    // Preenche as informações do produto no modal
    var modalImage = document.getElementById('modalImage');
    var modalProductName = document.getElementById('modalProductName');
    var modalProductDescription = document.getElementById('modalProductDescription');
    var modalProductPrice = document.getElementById('modalProductPrice');

    modalImage.src = imagem;
    modalProductName.textContent = nome;
    modalProductDescription.textContent = descricao;
    modalProductPrice.textContent = preco;

    var btnComprar = document.getElementById('btnComprar');
    btnComprar.onclick = function () {
        adicionarAoSacola(elementoProduto);
        fecharModal();
    };
}

function fecharModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

//------------------------------------------------------------------------------------------------------------------------------

// Função para mostrar o Sacola
function mostrarSacola() {
    atualizarSacola();
    document.getElementById('modalSacola').style.display = 'block';
}

// Função para fechar o Sacola
function fecharSacola() {
    document.getElementById('modalSacola').style.display = 'none';
}

function adicionarAoSacola(elementoProduto) {
    // Obtém os elementos dentro da div produto
    var nome = elementoProduto.querySelector('.nome-produto');
    var preco = elementoProduto.querySelector('.valor-produto');

    if (nome && preco) {
        nome = nome.textContent.trim();
        preco = parseFloat(preco.textContent.replace('R$', '').trim());

        if (!isNaN(preco)) {
            var quantidade = 1; // Ajuste conforme necessário
            adicionarAoSacolaLocalStorage(nome, preco, quantidade);
        } else {
            console.error('Erro ao obter o preço do produto.');
        }
    } else {
        console.error('Nome ou preço do produto não encontrados.');
    }
}

// Função para adicionar um item à tabela na Sacola
function adicionarAoSacolaLocalStorage(nome, preco, quantidade) {
    // Verifica se a Sacola já existe no localStorage
    var sacola = JSON.parse(localStorage.getItem('sacola')) || [];

    // Verifica se o item já está na Sacola
    var itemExistente = sacola.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        sacola.push({ nome, preco, quantidade });
    }

    // Atualiza o localStorage
    localStorage.setItem('sacola', JSON.stringify(sacola));

    // Atualiza a tabela na Sacola
    atualizarSacola();
}

// Função para atualizar o Sacola no modal
function atualizarSacola() {
    exibirErroCupom("");
    exibirSucessoCupom(""); 

    var sacola = JSON.parse(localStorage.getItem('sacola')) || [];
    var corpoTabela = document.getElementById('corpoTabelaSacola');
    var precoTotalElement = document.getElementById('precoTotal');
    var precoTotal = 0;

    // Limpa o corpo da tabela antes de atualizar
    corpoTabela.innerHTML = '';

    // Verifica se há itens na Sacola e, se houver, popula a tabela com os itens da Sacola
    if (sacola.length > 0) {
        sacola.forEach(item => {
            var precoItem = item.preco * item.quantidade;
            precoTotal += precoItem;

            var linha = document.createElement('tr');
            linha.innerHTML = `
                <td><span title="Clique aqui para excluir o item" class="fas fa-trash" onclick="apagarItem('${item.nome}')"></span></td>
                <td>${item.nome}</td>
                <td>R$ ${item.preco.toFixed(2)}</td>
                <td><input class="inputQtd" type="number" value="${item.quantidade}" onchange="atualizarQuantidade('${item.nome}', this.value)"></td>
                <td>R$ ${precoItem.toFixed(2)}</td>
            `;

            corpoTabela.appendChild(linha);
        });
    } else {
        var linha = document.createElement('tr');
        linha.innerHTML = '<td colspan="5">Nenhum item na Sacola</td>';

        corpoTabela.appendChild(linha);
    }

    precoTotalElement.textContent = `R$ ${precoTotal.toFixed(2)}`;

       //atualizar os cupons, deixando a flag de usada false novamente
    for (var i = 0; i < cupons.length; i++) {
        if (cupons[i].usado == true) {
                    cupons[i].usado = false
                    aplicarDesconto()
        }
    }
}

// Função para apagar um item da Sacola
function apagarItem(nome) {
    var sacola = JSON.parse(localStorage.getItem('sacola')) || [];

    // Filtra a Sacola para excluir o item com o nome correspondente
    sacola = sacola.filter(item => item.nome !== nome);

    // Atualiza o localStorage
    localStorage.setItem('sacola', JSON.stringify(sacola));

    // Atualiza a tabela na Sacola
    atualizarSacola();
}

// Função para atualizar a quantidade de um item na Sacola
function atualizarQuantidade(nome, novaQuantidade) {
    var sacola = JSON.parse(localStorage.getItem('sacola')) || [];

    // Encontra o item com o nome correspondente e atualiza a quantidade
    var item = sacola.find(item => item.nome === nome);
    if (item) {
        if (novaQuantidade <= 0) {
            confirm('Tem certeza que deseja excluir o item?') &&
                apagarItem(nome);
            return;
        } else {
            item.quantidade = parseInt(novaQuantidade);
        }
    }

    // Atualiza o localStorage
    localStorage.setItem('sacola', JSON.stringify(sacola));

    // Atualiza a tabela na Sacola
    atualizarSacola();
}


//criar uma classe para criar os cupons
class Cupom {
    constructor(nome, valor) {
        this.nome = nome;
        this.valor = valor;
        this.usado = false;
    }
}

//criando os cupons
var cupom1 = new Cupom('UTFPR', 0.85);

//criando o array de cupons
var cupons = [cupom1];

// Função para aplicar o desconto, conforme cupom inseirido, no Sacola. Verificar se o cupom ja foi utilizado
function aplicarDesconto() {

    exibirErroCupom("");
    exibirSucessoCupom("");
    //verificando se o Sacola esta vazio
    var Sacola = JSON.parse(localStorage.getItem('sacola')) || [];
    if (Sacola.length == 0) {
        exibirErroCupom("Não é possível adicionar produto, pois a sacola está vazia");
    }
    else {
        //verificando se o cupom existe e ja foi utilizado
        var cupom = document.getElementById('cupom').value;
        for (var i = 0; i < cupons.length; i++) {
            if (cupons[i].nome == cupom) {
                var cupomExiste = false;
                for (var i = 0; i < cupons.length; i++) {
                    if (cupons[i].nome == cupom) {
                        cupomExiste = true;
                    }
                    var cupomUsado = false;
                    if (cupons[i].usado == true) {
                        cupomUsado = true;
                    } else {
                        cupons[i].usado = true;
                        cupomUsado = false;
                    }
                }
            } else {
                cupomExiste = false;
            }
        }

        //verificando se o cupom foi utilizado
        if (cupomUsado == true) {
            exibirErroCupom("Cupom já utilizado");
        }
        else if (cupomExiste == true) {
            var precoTotalElement = document.getElementById('precoTotal');
            precoTotal = parseFloat(precoTotalElement.textContent.replace('R$', '').trim());
            for (var i = 0; i < cupons.length; i++) {
                if (cupons[i].nome == cupom) {
                    precoTotalComDesconto = precoTotal * cupons[i].valor;
                    precoTotalElement.textContent = `R$ ${precoTotalComDesconto.toFixed(2)}`;
                    exibirSucessoCupom("Cupom aplicado com sucesso. <br> Desconto no valor total da compra de R$" + precoTotal.toFixed(2) + " por R$" + precoTotalComDesconto.toFixed(2) + "");
                    cupons[i].usado = true;
                }
            }
        }
        else {
            exibirErroCupom("Cupom não existe");
        }
    }
}

function limparSacola() {
    confirm('Tem certeza que deseja limpar o Sacola?') &&
        localStorage.removeItem('sacola') &&
        atualizarSacola();
    fecharSacola();
    mostrarSacola();
    //atualizar os cupons, deixando a flag de usada false novamente
    for (var i = 0; i < cupons.length; i++) {
        cupons[i].usado = false;
    }
}

function exibirErroCupom(mensagem) {
    var erroCupom = document.getElementById('erroCupom');
    erroCupom.textContent = mensagem;
    erroCupom.style.display = 'block';
}

function exibirSucessoCupom(mensagem) {
    var sucessoCupom = document.getElementById('sucessoCupom');
    sucessoCupom.innerHTML = mensagem;
    sucessoCupom.style.display = 'block';
}

function finalizarCompra() {
    var usuario = verificarStatusUsuario();
    if (usuario == null) {
        alert("Você precisa estar logado para finalizar a compra");
        return false
    }

    var Sacola = JSON.parse(localStorage.getItem('sacola')) || [];
    if (Sacola.length == 0) {
        alert("Não é possível adicionar produto, pois a sacola está vazia");
    }
    else {
        alert("Compra realizada com sucesso");
        localStorage.removeItem('sacola');
        atualizarSacola();
        fecharSacola();
        //atualizar os cupons, deixando a flag de usada false novamente
        for (var i = 0; i < cupons.length; i++) {
            cupons[i].usado = false;
        }
    }
}

function verificarStatusUsuario() {
    var emailLogado = localStorage.getItem('usuarioLogado');

    if (emailLogado) {
        // Usuário está logado
        var usuario = JSON.parse(localStorage.getItem(emailLogado));
        return usuario;
    } else {
        // Usuário não está logado
        return null;
    }
}