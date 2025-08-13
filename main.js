document.addEventListener('DOMContentLoaded', () => {

    let blobs = {};
    let listaAtual = [];

    // codigo para preenchimento de dados automatico com CEP usando API
    function limpa_formulário_cep() {
        $("#endereco").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#estado").val("");
    }

    $("#cep").blur(function () {
        var cep = $(this).val().replace(/\D/g, '');

        if (cep != "") {
            var validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                $("#endereco").val("...");
                $("#bairro").val("...");
                $("#cidade").val("...");
                $("#estado").val("...");

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {
                        $("#endereco").val(dados.logradouro);
                        $("#bairro").val(dados.bairro);
                        $("#cidade").val(dados.localidade);
                        $("#estado").val(dados.uf);
                        $("#numero").focus();
                    }
                    else {
                        limpa_formulário_cep();
                        alert("CEP não encontrado.");
                    }
                });
            }
            else {
                // cep é inválido
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        }
        else {
            // cep sem valor
            limpa_formulário_cep();
        }
    });

    // validacao dos formularios de Dados e Produtos
    function inicializaValidacaoDeFormularios() {

        const btnSubmit = document.getElementById('btn-salvar-fornecedor');

        // geracao + download json
        const gerarEBaixarJson = async () => {
            const dadosFornecedor = {
                razaoSocial: $("#razao-social").val(),
                nomeFantasia: $("#nome-fantasia").val(),
                cnpj: $("#cnpj").val(),
                inscricaoEstadual: $("#insc-estadual").val(),
                inscricaoMunicipal: $("#insc-municipal").val(),
                nomeContato: $("#contato").val(),
                telefoneContato: $("#telefone").val(),
                emailContato: $("#email").val()
            };

            const produtos = [];
            $('#secao-produtos .produto-entrada').each(function (index) {
                const produtoObj = {
                    indice: index + 1,
                    descricaoProduto: $(this).find('input[id^="produto"]').val(),
                    unidadeMedida: $(this).find('input[id^="medida"]').val(),
                    qtdeEstoque: parseFloat($(this).find('.produto-estoque').val() || 0),
                    valorUnitario: parseFloat($(this).find('.produto-unitario').val().replace(/\./g, '').replace(',', '.') || 0),
                    valorTotal: parseFloat($(this).find('.produto-total').val().replace('R$', '').replace(/\./g, '').replace(',', '.') || 0)
                };
                produtos.push(produtoObj);
            });

            const dadosListaAnexos = JSON.parse(sessionStorage.getItem('listaDeAnexos'));
            console.log(dadosListaAnexos)
            const anexos = dadosListaAnexos.map((meta, index) => {
                return {
                    indice: index + 1, 
                    nomeArquivo: meta.nomeArquivo,
                    blobArquivo: meta.id
                };
            });

            const jsonFinal = {
                ...dadosFornecedor,
                produtos,
                anexos
            };

            const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonFinal, null, 4));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataString);
            downloadAnchorNode.setAttribute("download", "fornecedor.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };

        const handleSubmit = (e) => {
            e.preventDefault();

            // limpeza dos erros
            document.querySelectorAll('.error-text').forEach(e => e.remove());
            document.querySelectorAll('.validar').forEach(campo => campo.classList.remove('is-invalid'));

            const camposValidos = checaCampos();
            const itensValidos = checaQtdItens();

            if (camposValidos && itensValidos) {
                alert('Formulário válido! Iniciando download do arquivo JSON.');
                gerarEBaixarJson();
            } else {
                alert('Existem campos obrigatórios não preenchidos. Por favor, corrija-os.');
            }
        };

        btnSubmit.addEventListener('click', handleSubmit);

        // gera erro para campos que não estão regulares
        const criaErro = ($campo, msg) => {
            const div = document.createElement('div');
            div.innerHTML = msg;
            div.classList.add('error-text', 'text-danger', 'mt-1');
            div.style.fontSize = '0.875em';
            $campo.insertAdjacentElement('afterend', div);
            $campo.classList.add('is-invalid');
        };

        // checa se os campos obrigatorios estao preenchidos
        const checaCampos = () => {
            let ehValido = true;
            const camposOpcionais = ['Endereço', 'Bairro', 'Município', 'Estado', 'Inscrição Municipal', 'Inscrição Estadual', 'Valor Total'];

            for (const campo of document.querySelectorAll('.validar')) {
                const label = document.querySelector(`label[for="${campo.id}"]`);
                const nomeDoCampo = label ? label.childNodes[0].textContent.trim() : 'O campo';

                if (!camposOpcionais.includes(nomeDoCampo) && !campo.value.trim()) {
                    criaErro(campo, `O campo '${nomeDoCampo}' não pode estar em branco.`);
                    ehValido = false;
                }
            }
            return ehValido;
        };

        // checa se tem pelo menos 1 produto e 1 anexo
        const checaQtdItens = () => {
            let ehValido = true;

            const qtdProdutos = $('#secao-produtos .produto-entrada').length;
            if (qtdProdutos < 1) {
                const $divErro = $('<div></div>')
                    .addClass('error-text text-danger mt-3 mb-0')
                    .css('font-size', '1em')
                    .text('É obrigatório adicionar pelo menos 1 produto.');

                $('#secao-produtos').append($divErro)
                ehValido = false;
            }

            const qtdAnexos = $('#anexo-dados .anexo-entrada').length;
            if (qtdAnexos < 1) {
                const $divErro = $('<div></div>')
                    .addClass('error-text text-danger mt-3 mb-0')
                    .css('font-size', '1em')
                    .text('É obrigatório adicionar pelo menos 1 anexo.');

                $('#secao-anexos').append($divErro)
                ehValido = false;
            }

            return ehValido;
        };
    }

    // inicializa funcao de validacao dos formularios
    inicializaValidacaoDeFormularios();

    // PRODUTOS
    let contadorProdutos = 0;

    $(function () {

        //adicionar produtos
        $('#btn-adicionar-produto').on('click', function () {
            contadorProdutos++;

            const novoProduto = `<div id="produto-exemplo-${contadorProdutos}" class="d-flex gap-3 produto-entrada">
                    <div class="col-auto d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" cursor="pointer"
                            class="bi bi-trash3-fill btn-apagar-produto" viewBox="0 0 16 16">
                            <path
                                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                    </div>
                    <div id="produto-dados" class="p-2 mb-3 border border-2 rounded-3">
                        <h3 class="fs-5 mb-3">Produto ${contadorProdutos}</h3>
                        <div class="row align-items-center">
                            <div class="col-md-2 text-center">
                                <img class="img-fluid" src="docs/assets/18184239_771u_10wl_210528.jpg" alt="Produto">
                            </div>
                            <form id="formulario-produtos" action="." method="get" class="col-md-10">
                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <label for="produto" class="form-label lh-1">Produto</label>
                                        <input type="text" id="produto" class="form-control validar">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="medida" class="form-label lh-1">UND. Medida</label>
                                        <input type="text" id="medida" class="form-control validar">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="estoque" class="form-label lh-1">QDTDE. em Estoque</label>
                                        <input type="text" id="estoque" class="form-control validar produto-estoque">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="unitario" class="form-label lh-1">Valor Unitário</label>
                                        <input type="text" id="unitario" class="form-control validar produto-unitario">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="total" class="form-label lh-1">Valor Total</label>
                                        <input type="text" id="total" disabled
                                            class="form-control validar produto-total">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>`

            $(this).before(novoProduto);

            document.getElementById('placeholder-produto').classList.add('d-none');
        });

        // reordenar produtos
        function reordenarIndicesProdutos() {
            const $produtosRestantes = $('#secao-produtos').find('.produto-entrada');
            $produtosRestantes.each(function (indice) {
                const novoNumero = indice + 1;
                const $produtoAtual = $(this);
                $produtoAtual.find('h3').text('Produto ' + novoNumero);
                $produtoAtual.attr('id', 'produto-entrada-' + novoNumero);
            });
        }

        // apagar produto
        $('#secao-produtos').on('click', '.btn-apagar-produto', function () {
            const confirmarEscolha = confirm('Tem certeza que deseja apagar este produto?');

            if (confirmarEscolha) {
                const $produtoParaApagar = $(this).closest('.produto-entrada');
                $produtoParaApagar.remove();
                contadorProdutos--;

                reordenarIndicesProdutos();

                if ($('#secao-produtos').find('.produto-entrada').length < 1) {
                    document.getElementById('placeholder-produto').classList.remove('d-none');
                }
            }
        });

        // calcular valor total
        $('#secao-produtos').on('input', '.produto-estoque, .produto-unitario', function () {
            const produtoEntrada = $(this).closest('.produto-entrada');

            const estoqueInput = produtoEntrada.find('.produto-estoque');
            const valorUnitarioInput = produtoEntrada.find('.produto-unitario');
            const valorTotalInput = produtoEntrada.find('.produto-total');

            const quantidadeString = estoqueInput.val();
            const valorUnitarioString = valorUnitarioInput.val().replace(/\./g, '').replace(',', '.');

            if (quantidadeString && valorUnitarioString) {
                const quantidade = parseFloat(quantidadeString);
                const precoUnitario = parseFloat(valorUnitarioString);
                const totalCalculado = quantidade * precoUnitario;
                valorTotalInput.val(totalCalculado.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }));
            } else {
                valorTotalInput.val('');
            }
        });
    });

    // ANEXOS
    let contadorAnexos = 0;

    $(function () {

        $('#btn-incluir-anexo').on('click', function () {
            $('#input-anexo').val('');
            $('#input-anexo').click();
        });

        $('#input-anexo').on('change', function (event) {
            const arquivosSelecionados = event.target.files;
            if (arquivosSelecionados.length > 0) {
                const arquivo = arquivosSelecionados[0]
                processarEGuardarArquivo(arquivo);
            }
        })

        // armazenar anexo
        function processarEGuardarArquivo(arquivo) {
            contadorAnexos++;
            const id = crypto.randomUUID();

            blobs[id] = arquivo;
            console.log(`Blob do arquivo '${arquivo.name}' guardado na memória com ID: ${id} e indice: ${contadorAnexos}`);

            const dados = {
                id: id,
                indice: contadorAnexos,
                nomeArquivo: arquivo.name
            };

            listaAtual.push(dados);
            sessionStorage.setItem('listaDeAnexos', JSON.stringify(listaAtual));
            console.log('Metadados salvos no Session Storage:', listaAtual);
            adicionarAnexoNaTabela(dados);
        }

        // adicionar anexo html
        function adicionarAnexoNaTabela(dados) {
            const novoAnexo = `
                <div id="listagem-anexo-${contadorAnexos}" data-filename="${dados.nomeArquivo}" class="row gx-5 mt-3 anexo-entrada">
                    <div class="col-auto d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" cursor="pointer" class="bi bi-trash3-fill btn-apagar-anexo" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2757F5" cursor="pointer" class="bi bi-eye-fill" viewBox="0 0 16 16" style="margin-left: 1rem;">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>
                    </div>
                    <h3 class="col fs-5 mb-0">Documento anexo ${contadorAnexos} - ${dados.nomeArquivo}</h3>
                </div>
            `;

            $('#anexo-dados').append(novoAnexo);

            document.getElementById('placeholder-anexo').classList.add('d-none');
        }

        // reordenar anexos
        function reordenarIndicesAnexos() {
            const $AnexosRestantes = $('#anexo-dados').find('.anexo-entrada');
            $AnexosRestantes.each(function (indice) {
                const novoNumero = indice + 1;
                const nomeArquivo = $(this).data('filename')
                $(this).find('h3').text(`Documento anexo ${novoNumero} - ${nomeArquivo}`);
                $(this).attr('id', 'listagem-anexo-' + novoNumero);
            });
        }

        // apagar anexo
        $('#anexo-dados').on('click', '.btn-apagar-anexo', function () {
            const confirmarEscolha = confirm('Tem certeza que deseja apagar este anexo?');

            if (confirmarEscolha) {
                const $anexoParaApagar = $(this).closest('.anexo-entrada');
                const idAnexo = $anexoParaApagar.attr('id').split('-').pop();

                $anexoParaApagar.remove();
                contadorAnexos--;

                const itemASerRemovidoBlob = listaAtual.find(item => item.indice == idAnexo)
                delete blobs[itemASerRemovidoBlob.id];

                listaAtual = listaAtual.filter(item => item.indice != idAnexo);

                sessionStorage.setItem('listaDeAnexos', JSON.stringify(listaAtual));

                reordenarIndicesAnexos();

                if ($('#anexo-dados').find('.anexo-entrada').length < 1) {
                    document.getElementById('placeholder-anexo').classList.remove('d-none');
                }
            }
        });

        // download anexos
        $('#anexo-dados').on('click', '.bi-eye-fill', function () {
            const $anexoParaBaixar = $(this).closest('.anexo-entrada');
            const idAnexo = $anexoParaBaixar.attr('id').split('-').pop();
            const itemASerBaixadoBlob = listaAtual.find(item => item.indice == idAnexo)
            const arquivoBlob = blobs[itemASerBaixadoBlob.id];

            const url = URL.createObjectURL(arquivoBlob);

            const link = document.createElement('a');
            link.href = url;

            link.download = itemASerBaixadoBlob.nomeArquivo;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
});