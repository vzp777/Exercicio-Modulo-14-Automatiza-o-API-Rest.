/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract'
describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
         cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

    it('Deve validar contrato de usuários', () => {
     cy.request('produtos').then(response => {
          return contrato.validateAsync(response.body)
      })
  });

       it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
          }).then((listagemResponse) => {
            expect(listagemResponse.status).to.equal(200);
            expect(listagemResponse.body).to.have.property('produtos');
          })
        })

    it('Deve cadastrar um usuário com sucesso', () => {
     let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`
     cy.request({
      method:'POST',
      url: 'produtos',
      body:{
        "nome": produto,
        "preco": 200,
        "descricao": "Produto novo",
        "quantidade": 100
      },
      headers: {authorization: token}
     
    }).then((Response) =>{
        expect(Response.status).to.equal(201)
        expect(Response.body.message).to.equal('Cadastro realizado com sucesso')

 })
});
    

    it('Deve validar um usuário com email inválido', () => {
     cy.cadastrarProduto(token, 'Produto EBAC Novo 1', 250, "Descrição do produto novo", 180)
     .then((response) => {
         expect(response.status).to.equal(400)
         expect(response.body.message).to.equal('Já existe produto com esse nome')
     })
});
    
it('Deve editar um produto previamente cadastrado', () => {
    let produto1 = `Corinthians ${Math.floor(Math.random() * 100000000)}`
    cy.cadastrarProduto(token, produto1, 250, "Descrição do produto novo", 180)
    .then(response => {
        let id = response.body._id
    }).then((cadastroResponse) => {
      expect(cadastroResponse.status).to.equal(201);
      const id = cadastroResponse.body._id;
      failOnStatusCode: false
      cy.request({
        method: 'PUT',
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          nome: produto1,
          preco: 100,
          descricao: 'Produto editado',
          quantidade: 100
        }
      }).then((edicaoResponse) => {
        expect(edicaoResponse.status).to.equal(200);
        expect(edicaoResponse.body.message).to.equal('Registro alterado com sucesso');
      });
    });
  });
  
          

it('Deve deletar um usuário previamente cadastrado', () => {
     let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`
     cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 180)
     .then(response => {
         let id = response.body._id
         cy.request({
             method: 'DELETE',
             url: `produtos/${id}`,
             headers: {authorization: token}
         }).then(response =>{
             expect(response.body.message).to.equal('Registro excluído com sucesso')
             expect(response.status).to.equal(200)
         })
     })
 });
});
    
    



