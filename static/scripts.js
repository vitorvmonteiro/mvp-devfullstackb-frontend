// Define a URL base da API para se comunicar com o backend
const API_BASE_URL = 'http://127.0.0.1:5000/api/incidentes';

// Função para carregar o histórico de incidentes
async function carregarHistorico() {
    try {
        // Requisição GET para o back-end
        const resposta = await fetch(API_BASE_URL);
        if (!resposta.ok) {
            throw new Error('Erro ao carregar o histórico de incidentes.');
        }

        // Converte a resposta para JSON
        const incidentes = await resposta.json();

        // Seleciona o corpo da tabela de histórico
        const tabelaHistorico = document.querySelector('#tabela-historico');
        tabelaHistorico.innerHTML = ''; // Limpa a tabela antes de preencher

        // Adiciona cada incidente como uma linha na tabela
        incidentes.forEach(incidente => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${incidente.id}</td>
                <td>${incidente.ambiente}</td>
                <td>${incidente.cluster}</td>
                <td>${incidente.servico}</td>
                <td>${incidente.criticidade}</td>
                <td>${incidente.descricao}</td>
                <td>${incidente.data_hora}</td>
                <td>
                    <button class="btn-tratar" data-id="${incidente.id}">Tratar</button>
                </td>
            `;
            tabelaHistorico.appendChild(linha);
        });
    } catch (erro) {
        console.error("Erro ao carregar o histórico:", erro);
    }
}

// Captura o formulário e adiciona um evento ao botão de envio
document.querySelector("#formulario-incidente").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    // Captura os dados do formulário
    const ambiente = document.querySelector("#ambiente").value;
    const cluster = document.querySelector("#cluster").value;
    const servico = document.querySelector("#servico").value;
    const criticidade = document.querySelector("#criticidade").value;
    const descricao = document.querySelector("#descricao").value;
    const dataHora = document.querySelector("#data-hora").value;

    // Cria um objeto com os dados do incidente
    const incidente = {
        ambiente,
        cluster,
        servico,
        criticidade,
        descricao,
        data_hora: dataHora // Nome alinhado com o back-end
    };

    try {
        // Envia os dados para o back-end usando fetch
        const resposta = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(incidente),
        });

        if (resposta.ok) {
            // Caso o back-end responda com sucesso
            const dados = await resposta.json();
            console.log("Incidente salvo:", dados);
            carregarHistorico(); // Atualiza a tabela com os incidentes
        } else {
            console.error("Erro ao salvar o incidente:", resposta.statusText);
        }
    } catch (erro) {
        console.error("Erro na comunicação com o servidor:", erro);
    }
});

// Adiciona evento para tratar (deletar) um incidente
document.querySelector('#tabela-historico').addEventListener('click', async (event) => {
    if (event.target.classList.contains('btn-tratar')) {
        const id = event.target.dataset.id; // Pega o ID do incidente

        try {
            // Envia a requisição DELETE para o back-end
            const resposta = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });

            if (resposta.ok) {
                console.log(`Incidente ${id} tratado com sucesso!`);
                carregarHistorico(); // Atualiza o histórico na tabela
            } else {
                console.error('Erro ao tratar o incidente.');
            }
        } catch (erro) {
            console.error('Erro na comunicação com o servidor:', erro);
        }
    }
});

// Carregar o histórico ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico();
});
