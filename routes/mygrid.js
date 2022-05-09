const { request } = require('express')
const { findOneAndRemove, update } = require('../models/mygrid')

module.exports = (app)=>{
    //importar a configuração do database
    var conexao = require('../config/database')
    //executar a conexao
    conexao()
    //importar o modelo mygrid
    var mygrid = require('../models/mygrid')

    //abrir o formulário
    app.get('/mygrid',async(req,res)=>{
        var resultado = await mygrid.find().sort({_id:-1})
        res.render('mygrid.ejs',{dados:resultado})
        //console.log(resultado)
    })

    //gravar as informações do formulário no banco de dados
    app.post('/mygrid',(req,res)=>{
        var documento = new mygrid({
            titulo:req.body.titulo,
            texto:req.body.texto
        }).save()
        .then(()=>{ res.redirect('/mygrid')})
        .catch(()=>{res.send('Não foi possível gravar')})
    })

    //abrir o formulário de exibição do documento selecionado
    app.get('/visualizar_mygrid', async(req,res)=>{
        var id = req.query.id
        var acao = req.query.acao
        var ver = await mygrid.findOne({_id:id})
        if(acao == "delete"){
            res.render("mygrid_excluir.ejs", {dados:ver})
        }else if(acao == "update"){
            res.render("mygrid_alterar.ejs", {dados:ver})
        }
    })

    //excluir o documento clicado
    app.post("/excluir_mygrid", async(req,res)=>{
        //recuperar o id na barra de endereço
        var id = req.query.id
        //localizar e excluir o documento
        var excluir = await mygrid.findOneAndRemove({_id:id})
        //voltar para a página mygrid
        res.redirect("/mygrid")
    })
        
    //alterar o documento clicado
    app.post("/alterar_mygrid", async(req,res)=>{
        //recuperar o id na barra de endereço
        var id = req.query.id
        //recuperar as informações digitadas
        var dados = req.body
        //localizar e alterar o documento
        var alterar = await mygrid.findOneAndUpdate({_id:id},{titulo:dados.titulo,texto:dados.texto})
        //voltar para a página mygrid
        res.redirect("/mygrid")
    })
    
}