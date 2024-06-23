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
    var tabelaSacola = document.getElementById('sacolaDiv');
    var mensagem = document.getElementById('mensagem');
    var divlimparSacola = document.getElementsByClassName('divLimparSacola')[0];
    var precoTotal = 0;

    // Limpa o corpo da tabela antes de atualizar
    corpoTabela.innerHTML = '';

    // Verifica se há itens na Sacola e, se houver, popula a tabela com os itens da Sacola
    if (sacola.length > 0) {
        tabelaSacola.style.display = 'table';
        divlimparSacola.style.display = 'block';
        mensagem.style.display = 'none';

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
        divlimparSacola.style.display = 'none';
        tabelaSacola.style.display = 'none';
        mensagem.style.backgroundColor = 'darkgray';
        mensagem.style.display = 'block';
        mensagem.innerHTML = 'Ainda não foram adicionado itens na sacola.';

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
            mostarModalMensagem("PERGUNTA", "Tem certeza que deseja excluir o item?", function () {
                apagarItem(nome)
            });
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
                    precoTotalElement.textContent = "R$ " + precoTotalComDesconto.toFixed(2);
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
    mostarModalMensagem("PERGUNTA", "Tem certeza que deseja excluir o item?", function () {
        localStorage.removeItem('sacola') &&
            atualizarSacola();
        fecharSacola();
        mostrarSacola();
        //atualizar os cupons, deixando a flag de usada false novamente
        for (var i = 0; i < cupons.length; i++) {
            cupons[i].usado = false;
        }
    });
}

function exibirErroCupom(mensagem) {
    var erroCupom = document.getElementById('erroCupom');
    if (mensagem == "") {
        erroCupom.style.display = 'none';
        return;
    }
    erroCupom.textContent = mensagem;
    erroCupom.style.display = 'block';
}

function exibirSucessoCupom(mensagem) {
    var sucessoCupom = document.getElementById('sucessoCupom');
    if (mensagem == "") {
        sucessoCupom.style.display = 'none';
        return;
    }
    sucessoCupom.innerHTML = mensagem;
    sucessoCupom.style.display = 'block';
}

function fecharModalMensagem() {
    document.getElementById('modalMensagem').style.display = 'none';
}

function mostarModalMensagem(titulo, mensagem, callbackYes = null, callbackNo = null) {
    console.log(titulo);
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
        case "BUSCA":
            tituloModal.innerHTML = '<i class="fa-solid fa-search fa-2xl" style="color: #black;"></i>';
            var input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("id", "inputBusca");
            input.setAttribute("placeholder", "Digite o nome do produto");
            input.setAttribute("style", "width: 80%;margin-bottom: 10px;margin-top: 10px;height: 30px;");
            mensagemModal.appendChild(input);
            confirmYes.style.display = 'block';

            confirmYes.addEventListener("click", function () {
                if (typeof callbackYes === "function") {
                    callbackYes();  // Chamada do callback apenas no clique do botão
                }
                modalMensagem.style.display = "none";
            });

            break;
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


function finalizarCompra() {
    var usuario = verificarStatusUsuario();
    if (usuario == null) {
        mostarModalMensagem("ERRO", "Infelizmente, não foi possível completar a ação. <br> Você precisa estar logado para finalizar a compra! :)");
        return false
    }

    var Sacola = JSON.parse(localStorage.getItem('sacola')) || [];
    if (Sacola.length == 0) {
        mostarModalMensagem("ERRO", "Não é possível finalizar a compra, pois a sacola está vazia");
    }
    else {
        mostarModalMensagem("SUCESSO", "Sua compra foi realizada com sucesso <p> Obrigado pela preferência! :)");
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

// Função para buscar produtos
function filtrarProdutos() {
    if (document.getElementById('produtoNaoEncontrado')) {
        document.getElementById('produtoNaoEncontrado').remove();
    }
    
    mostarModalMensagem("BUSCA", "Digite o nome do produto", function () {

        // Captura o valor do campo de filtro
        var filtro = document.getElementById('inputBusca').value.toUpperCase();

        // Seleciona todos os produtos
        var produtos = document.querySelectorAll('.produto');

        // Percorre cada produto e verifica se contém o filtro no nome, se não tiver nenhum, retorna mensagem de erro
        var encontrouProduto = false;
        produtos.forEach(function (produto) {
            
            var nomeProduto = produto.querySelector('.nome-produto').textContent.toUpperCase();
            if (nomeProduto.indexOf(filtro) > -1) {
                produto.style.display = '';
                encontrouProduto = true;
            } else {
                produto.style.display = 'none';
            }
        }
        );

        if (encontrouProduto == false) {
            console.log("Produto não encontrado");
            //criar h2 para dizer que nenhum produto foi encontrado
            var h2 = document.createElement("h2");
            h2.id = "produtoNaoEncontrado";
            h2.innerHTML = "Produto não encontrado";
            h2.style.textAlign = "center";
            h2.style.marginTop = "10px";
            h2.style.color = "red";
            h2.style.fontWeight = "bold";
            document.getElementById('lista-produtos').appendChild(h2);
        }
        
    });

}


// Dados dos produtos
const listaProdutos = [
    {
        imagem: "assets/iphone3.jpeg",
        nome: "IPHONE 13",
        valor: "R$ 600,00",
        descricao: "o iPhone 13 é a nova geração de smartphones da Apple, lançada em setembro de 2021. A série iPhone 13 foi anunciada com quatro modelos, repetindo a geração anterior. O iPhone 13 tem uma tela OLED de 6,1 polegadas, 91,4 cm² (~87.1% de aproveitamento frontal) e resolução de 1170 x 2532px. O celular está disponível em três capacidades de armazenamento: 128/256/512 GB 6 GB RAM"
    },
    {
        imagem: "assets/iphone2.jpeg",
        nome: "IPHONE 14",
        valor: "R$ 500,00",
        descricao: "O iPhone 14 tem o sistema de câmera dupla mais impressionante em um iPhone, para fazer fotos espetaculares em pouca e muita luz. E você ganha tranquilidade com nosso novo recurso essencial de segurança."
    },
    {
        imagem: "assets/iphone1.jpeg",
        nome: "IPHONE 13",
        valor: "R$ 600,00",
        descricao: "o iPhone 13 é a nova geração de smartphones da Apple, lançada em setembro de 2021. A série iPhone 13 foi anunciada com quatro modelos, repetindo a geração anterior. O iPhone 13 tem uma tela OLED de 6,1 polegadas, 91,4 cm² (~87.1% de aproveitamento frontal) e resolução de 1170 x 2532px. O celular está disponível em três capacidades de armazenamento: 128/256/512 GB 6 GB RAM"
    },
    {
        imagem: "assets/iphone3.jpeg",
        nome: "IPHONE 12",
        valor: "R$ 450,00",
        descricao: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur nesciunt odio sunt consequuntur amet facere, doloremque, eaque necessitatibus perspiciatis non laborum. Recusandae, repellendus aut reiciendis et quo ipsum iste facere?"
    },
    {
        imagem: "assets/iphone1.jpeg",
        nome: "IPHONE 12",
        valor: "R$ 300,00",
        descricao: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda laboriosam deserunt rem recusandae explicabo dignissimos quos sequi facere voluptates incidunt, optio molestias minus, autem nobis dolore neque possimus ducimus?"
    },
    {
        imagem: "assets/iphone2.jpeg",
        nome: "IPHONE 15",
        valor: "R$ 500,00",
        descricao: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda laboriosam deserunt rem recusandae explicabo dignissimos quos sequi facere voluptates incidunt, optio molestias minus, autem nobis dolore neque possimus ducimus?"
    },
    {
        imagem: "assets/iphone1.jpeg",
        nome: "IPHONE 15 PRO MAX",
        valor: "R$ 850,00",
        descricao: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda laboriosam deserunt rem recusandae explicabo dignissimos quos sequi facere voluptates incidunt, optio molestias minus, autem nobis dolore neque possimus ducimus?"
    },
    {
        imagem: "assets/iphone2.jpeg",
        nome: "IPHONE 15 PLUS",
        valor: "R$ 900,00",
        descricao: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda laboriosam deserunt rem recusandae explicabo dignissimos quos sequi facere voluptates incidunt, optio molestias minus, autem nobis dolore neque possimus ducimus?"
    },
    {
        imagem: "assets/iphone3.jpeg",
        nome: "IPHONE 11",
        valor: "R$ 150,00",
        descricao: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda laboriosam deserunt rem recusandae explicabo dignissimos quos sequi facere voluptates incidunt, optio molestias minus, autem nobis dolore neque possimus ducimus?"
    },
    {
        imagem: "assets/iphone1.jpeg",
        nome: "IPHONE 7",
        valor: "R$ 230,00",
        descricao: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda laboriosam deserunt rem recusandae explicabo dignissimos quos sequi facere voluptates incidunt, optio molestias minus, autem nobis dolore neque possimus ducimus?"
    },
    {
        imagem: "assets/iphone2.jpeg",
        nome: "IPHONE 13 PRO MAX",
        valor: "R$ 700,00",
        descricao: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda laboriosam deserunt rem recusandae explicabo dignissimos quos sequi facere voluptates incidunt, optio molestias minus, autem nobis dolore neque possimus ducimus?"
    },
    {
        imagem: "assets/iphone2.jpeg",
        nome: "IPHONE 12 PRO",
        valor: "R$ 600,00",
        descricao: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore assumenda laboriosam deserunt rem recusandae explicabo dignissimos quos sequi facere voluptates incidunt, optio molestias minus, autem nobis dolore neque possimus ducimus?"
    }
];

function popularProdutos() {
    const listaProdutosElemento = document.getElementById("lista-produtos");

    listaProdutos.forEach(produto => {
        // Criar o elemento <li> para cada produto
        const li = document.createElement("li");
        li.classList.add("produto");

        // Criar o conteúdo HTML para o produto
        const conteudoProduto = `
        <div class="produto" onclick="mostrarModal(this)">
                        <a href="#">
            <div class="imagem-produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            </a>
            <div class="texto-produto">
                <span class="tag-produto">OFERTA</span>
                <h3 class="nome-produto">${produto.nome}</h3>
                <h2 class="valor-produto">${produto.valor}</h2>
                <p class="descricao-produto" style="display: none" >${produto.descricao}</p>
            </div>
            </div>
        `;

        // Definir o conteúdo HTML do <li> e adicionar ao <ul>
        li.innerHTML = conteudoProduto;
        listaProdutosElemento.appendChild(li);
    });
}

// Executar a função para popular os produtos
popularProdutos();



