const form = document.getElementById('novoItem')
const lista = document.getElementById('lista')
const itens = JSON.parse(localStorage.getItem("itens")) || [] //a const itens deve consultar e pegar itens do localStorage e caso não encontre deve criar uma array vazia (|| indica ou). Json.parse transforma uma string (que no caso é o local storage em um arquivo js)

itens.forEach(elemento => { //quando a página for carregada a função forEach (laço de repetição que faz uma ação para cada item do array) irá chamar a função criaElemento com o parametro elemento(que corresponde a const item atual, que é um objeto que salva o nome e a quantidade)
    criaElemento(elemento)
});

form.addEventListener('submit', (evento) => { //o parametro evento (pode ser qualquer nome) está ligado ao addEventListener. É um parametro pré definido e se relaciona com a ação passada (se é um click, ou submit, que é o caso). No caso a ação é o submit, que está vinculado a um formulário, assim sempre que eu submeto os dados o parametro evento irá trazer várias informações sobre a ação
    evento.preventDefault() //impede o evento padrão da página, que recarrega a página quando clico em um botão submit    
    const nome = evento.target.elements['nome']; ////Parametros da função (no caso estou buscando o nome do item que foi digitado e a quantidade):  evento (elementos ligados ao HTML da ação de submit). target(é onde está sendo executado o addEventListener, que no caso é o formulário "adicionar"). elements (são os elementos contidos dentro do formulário que no caso são as inputs, que são nomeadas pela suas classes ou id)['nome'] ou ['quantidade'](que é o indice que estou buscando, que é o nome da classe)
    const quantidade = evento.target.elements['quantidade']

    const existe = itens.find(elemento => elemento.nome === nome.value) // Const criada para verificar se o item que for digitado é igual a um dos itens que ja éstão salvos. itens é const que tem os valores (nome e quantidade) criados. find é uma função de array que busca uma informação dentro dele. Vou buscar dentro dos elementos (elemento) na seguinte condição: elemento.nome (pega o item nome dentro do elemento, tendo em vista que ele é um objetos e uma das suas chaves é o nome) tem que ser igual (===) a const nome (definida acima) no seu value

    const itemAtual = { //nesta const está sendo criado um objeto que irá salvar todos os dados digitados pelo usuario nas inputs
        "nome": nome.value,
        "quantidade": quantidade.value
    }

    if (existe) { //if criado para verficar se o item já existe ou não na lista. Com isso será criado um Id único para cada elemento e assim vai permitir a comparação. A condição existe se refere a const criada acima. Ela é booleana e se for true entra na primeira condição. Se for false entra no else
        itemAtual.id = existe.id //Se verdadeira, ele vai receber o mesmo id da const existe
        atualizaElemento(itemAtual)//Essa função irá atualizar os valores á digitados, incrementando a quantidade

        itens[existe.findIndex(elemento => elemento.id === id)] = itemAtual //Ele irá sobescrever o localStorage com o novo valor do item digitado
    } else {
        itemAtual.id = itens[itens.length-1]? itens[itens.length-1].id+1 : 0 //se falso, será criado um operador ternário, que é uma forma de escrever de maneira resumida um if. No caso itens[itens.length-1] é a condição, pois se o array estiver vazio, o seu length será 0, e se retirar 1 dele o resultado será negativo e dará erro. Depois do ? é caso seja verdadeiro (caso a const itens no indice que corresponde o seu tamanho,menos 1, pois o tamanho vai ter um numero a mais, pois os indices começam em 0), será pego o seu id atual e somado mais 1. Depois do : é caso seja falso (será colocado como indice 0)

        criaElemento(itemAtual) //itemAtual é a const que recebe o objeto acima 
        itens.push(itemAtual) //O localStorage só salva um dado por vez. Para isso é necessário criar uma array de objetos que irá salvando todos os dados digitados. No caso, para cada elementto digitado (nome e quantidade) será adicionado (push) na array itens (criada no escopo global) o objeto (const itemAtual) que possui estas duas informações (nome e quantidade) 
    }

    localStorage.setItem("itens", JSON.stringify(itens)) //localStorage.setItem salva as informações no navegador, assim cada vez que se atualizar a pagina os valores digitados não são perdidos. Ele é um objeto, por isso precisa de uma chave e um valor. O primeiro parametro é a chave e o segundo é o seu valor,que é uma array de objetos que irá salvando os dados do objeto. JSON.stringify transforma um objeto em uma string, e só assim que o localStorage consegue ler o arquivo

    nome.value = "" //criado para que quando clicar em adicionar ele apague os valores do input
    quantidade.value = ""
})

function criaElemento(item) {
    const novoItem = document.createElement('li') //createElement cria uma nova tag Html
    novoItem.classList.add('item')

    const numeroItem = document.createElement('strong')
    numeroItem.innerHTML = item.quantidade
    numeroItem.dataset.id = item.id //usado para criar um novo dataset no HTML (identico processo ao classlist)

    novoItem.appendChild(numeroItem) //appendChild permite colocar um elemento Html dentro do outro. No caso a tag strong (numeroItem) deve ficar dentro da tag li(novoItem)
    novoItem.innerHTML += item.nome //innerHtml cria uma tag novo, sem vínculo com nenhuma anterior

    novoItem.appendChild(botaoDeleta(item.id)) //item.id é o id da array, pois ele foi passado como parametro (item) na função criaElemento e na linha 29 ele recebe como parametro itemAtual, que é a array onde estão os dados do localStorage

    lista.appendChild(novoItem)
}

function atualizaElemento (item){
   document.querySelector("[data-id='"+item.id+"']").innerHTML = item.quantidade  //está buscando pelo id que se deseja. Entre chaves: data-id, pois no HTML está marcado deste jeito (data, pois é do tipo data e id pois foi este nome criadona function criaElemento). +item.id, para que ela vá buscando dinamicamente o número atribuido (item é o parametro, que está se referindo a const itemAtual, que é um array de objetos). InnerHtml, pois após achar o elemento eu desejo adicionar no HTML esta informação, que é o item (é o novo valor de um item que já consta na lista) quantidade atualizado
}

function botaoDeleta(id){ //função para criar botão de deletar
    const elementoBotao = document.createElement("button")
    elementoBotao.innerHTML = "X"

    elementoBotao.addEventListener('click', function(){ //criado um novo addEventListener, pois este tipo de evento não é carregado automaticamente quando a página é clicada em elementos criados dinamicamente. Neste caso não posso usar o arrow function, pois ela não carrega o this (onde foi clicado) da função. Por isso foi necessário declarar uma função
        deletaElemento(this.parentNode, id); //this é onde foi clicado, ele carrega todos os "nós" (propriedades) do elemento HTML e this parentNode ele está carregando o pai daquele elemento, que no caso é o parametro id, que se refere a 
    })
    return elementoBotao
}

function deletaElemento(tag, id){ //O paramentro tag vai receber acima, linha 64, como valor o this.parentNode, que traz todos os nos do elemento pai
    tag.remove()

    itens.splice(itens.findIndex(elemento => elemento.id ===id),1) //itens é a array que se deseja manipular. splice é uma função de arrays que é usada para cortar (eliminar) itens de um array. findIndex é utilizado para procurar um indice dentro de um array (construido desta maneira: 1º elemento que indica os elementos de uma array, que pode ter qualquer nome, 2º => marcação padronizada, 3º o que se procura, ou seja, o id de cada elemento, 4º compara-se com que se deseja, que no caso é o id do item que foi clicado (itemAtual.id)

    localStorage.setItem("itens", JSON.stringify(itens))
}