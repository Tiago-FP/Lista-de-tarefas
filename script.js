// ============================================================================
// 1. SELEÇÃO DOS ELEMENTOS DA PÁGINA (DOM)
// Aqui conectamos variáveis do JavaScript aos elementos criados no index.html
// ============================================================================
const formTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const mensagemVazia = document.getElementById('mensagem-vazia');
const contadorTarefas = document.getElementById('contador-tarefas');
const porcentagemProgresso = document.getElementById('porcentagem-progresso');
const barraPreenchimento = document.getElementById('barra-preenchimento');

// ============================================================================
// 2. ESTADO DA APLICAÇÃO (DADOS)
// Tentamos carregar as tarefas salvas no navegador (localStorage).
// Se não existir nada salvo ainda, começamos com uma lista vazia: []
// ============================================================================
let tarefas = JSON.parse(localStorage.getItem('minhas_tarefas')) || [];

// ============================================================================
// 3. FUNÇÕES PRINCIPAIS
// ============================================================================

/**
 * Salva a lista atual de tarefas na memória do navegador (localStorage)
 */
function salvarNoNavegador() {
    localStorage.setItem('minhas_tarefas', JSON.stringify(tarefas));
}

/**
 * Adiciona uma nova tarefa na lista
 */
function adicionarTarefa(texto) {
    const novaTarefa = {
        id: Date.now(),       // Cria um código único usando o horário atual
        texto: texto,         // O nome da atividade digitada
        concluida: false      // Toda tarefa começa como "não concluída"
    };

    tarefas.push(novaTarefa);
    salvarNoNavegador();
    renderizarTarefas();
}

/**
 * Alterna o estado da tarefa entre concluída (true) e pendente (false)
 */
function alternarConclusao(id) {
    tarefas = tarefas.map(function (tarefa) {
        if (tarefa.id === id) {
            return {
                id: tarefa.id,
                texto: tarefa.texto,
                concluida: !tarefa.concluida // Inverte o valor (true vira false, false vira true)
            };
        }
        return tarefa;
    });

    salvarNoNavegador();
    renderizarTarefas();
}

/**
 * Remove uma tarefa da lista pelo seu identificador (id)
 */
function removerTarefa(id) {
    tarefas = tarefas.filter(function (tarefa) {
        return tarefa.id !== id; // Mantém apenas as tarefas com ID diferente do que queremos excluir
    });

    salvarNoNavegador();
    renderizarTarefas();
}

/**
 * Atualiza a barra de progresso e os contadores no topo da página
 */
function atualizarProgresso() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100);

    contadorTarefas.textContent = `${concluidas} de ${total} concluídas`;
    porcentagemProgresso.textContent = `${percentual}%`;
    barraPreenchimento.style.width = `${percentual}%`;
}

/**
 * Atualiza a tela (HTML) para refletir a lista de tarefas atual
 */
function renderizarTarefas() {
    // Limpa a lista visual antes de recriar os itens
    listaTarefas.innerHTML = '';

    // Mostra ou esconde a mensagem de "Nenhuma tarefa"
    if (tarefas.length === 0) {
        mensagemVazia.classList.remove('escondido');
    } else {
        mensagemVazia.classList.add('escondido');
    }

    // Atualiza o contador e a barra de progresso
    atualizarProgresso();

    // Para cada tarefa na memória, cria um item visual <li> na tela
    tarefas.forEach(function (tarefa) {
        const itemLista = document.createElement('li');
        itemLista.className = 'item-tarefa';

        // Se a tarefa estiver concluída, adicionamos a classe CSS 'concluida'
        if (tarefa.concluida) {
            itemLista.classList.add('concluida');
        }

        // Área clicável com checkbox + texto da tarefa
        const conteudo = document.createElement('label');
        conteudo.className = 'conteudo-tarefa';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox-tarefa';
        checkbox.checked = tarefa.concluida;
        checkbox.addEventListener('change', function () {
            alternarConclusao(tarefa.id);
        });

        const textoSpan = document.createElement('span');
        textoSpan.className = 'texto-tarefa';
        textoSpan.textContent = tarefa.texto;

        conteudo.appendChild(checkbox);
        conteudo.appendChild(textoSpan);

        // Área da direita: Etiqueta de Status (Pendente / Concluída) + Botão de Excluir
        const acoesDiv = document.createElement('div');
        acoesDiv.className = 'acoes-tarefa';

        const badgeStatus = document.createElement('span');
        badgeStatus.className = 'badge-status';
        badgeStatus.textContent = tarefa.concluida ? '✓ Concluída' : '⏳ Pendente';

        const botaoRemover = document.createElement('button');
        botaoRemover.className = 'btn-remover';
        botaoRemover.textContent = 'Excluir';
        botaoRemover.addEventListener('click', function () {
            removerTarefa(tarefa.id);
        });

        acoesDiv.appendChild(badgeStatus);
        acoesDiv.appendChild(botaoRemover);

        // Monta o item e adiciona na lista da página
        itemLista.appendChild(conteudo);
        itemLista.appendChild(acoesDiv);
        listaTarefas.appendChild(itemLista);
    });
}

// ============================================================================
// 4. EVENTOS (INTERAÇÃO DO USUÁRIO)
// ============================================================================

// Quando o usuário envia o formulário (clicando em "Adicionar" ou apertando Enter)
formTarefa.addEventListener('submit', function (evento) {
    evento.preventDefault(); // Evita que a página recarregue

    const textoDigitado = inputTarefa.value.trim();

    if (textoDigitado !== '') {
        adicionarTarefa(textoDigitado);
        inputTarefa.value = ''; // Limpa o campo de texto
        inputTarefa.focus();    // Devolve o cursor para o campo
    }
});

// Desenha as tarefas salvas assim que a página é aberta pela primeira vez
renderizarTarefas();
