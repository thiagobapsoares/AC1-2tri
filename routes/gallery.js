const { fstat } = require('fs')
const multer = require('multer')
const fs = require('fs')

module.exports = (app)=>{

    //importar o config database
    var database = require('../config/database')
    //importar o model gallery
    var gallery = require('../models/gallery')

    //exibir o formulario gallery.ejs
    app.get('/gallery',async(req,res)=>{
        //conectar com o database
        database()
        //executar a busca de documentos da coleção gallery
        var documentos = await gallery.find().sort({_id:-1})
        res.render('gallery.ejs',{dados:documentos})
    })

    //importar a config do multer
    var upload = require('../config/multer')
    //upload do arquivo
    app.post('/gallery',(req,res)=>{
        //upload das imagens
        upload(req,res,async (err)=>{
            if(err instanceof multer.MulterError){
                res.send("O arquivo é maior que 100kb")
            }else if(err){
                res.send('Tipo de Arquivo inválido')
            }else{
                //conectar ao database
                database()
                //gravar o nome do arquivo na coleção gallery
                var documento = await new gallery({
                arquivo:req.file.filename
                }).save()
                res.redirect('/gallery')

            }
        })
    })

    //visualizar a imagem selecionada
     app.get('/alterar_gallery', async(req,res)=>{
        //recuperar o parametro id da barra de endereço
        var id = req.query.id
        //procurar por um documento com o id
        var busca = await gallery.findOne({_id:id})
        //abrir o arquivo gallery_alterar
        res.render('gallery_alterar.ejs',{dados:busca})
    })

    //alterar a imagem gravada no documento
    app.post('/alterar_gallery',(req,res)=>{
        //upload  das imagens
        upload(req,res,async (err)=>{
            if(err instanceof multer.MulterError){
                res.send("O arquivo é maior que 100kb")
            }else if(err){
                res.send('Tipo de Arquivo inválido')
            }else{
                //conectar ao database
                database()
                //excluir o arquivo anterior
                try {
                    fs.unlinkSync('uploads/'+req.body.anterior)
                } catch (error) {
                    //console.log(error) 
                }
                //alterar o nome do arquivo na coleção gallery
                var documento = await gallery.findOneAndUpdate(
                {_id:req.query.id},
                {arquivo:req.file.filename}
                )
                res.redirect('/gallery')

            }
        })
    })

    //visualizar a imagem gravada no documento
    app.get('/excluir_gallery', async(req,res)=>{
        //recuperar o parametro id da barra de endereço
        var id = req.query.id
        //procurar por um documento com o id
        var busca = await gallery.findOne({_id:id})
        //abrir o arquivo gallery_alterar
        res.render('gallery_excluir.ejs',{dados:busca})
    })
        
    //excluir a imagem gravada no documento
    app.post("/excluir_gallery", async(req,res)=>{
        //recuperar o id na barra de endereço
        var id = req.query.id
        //excluir o arquivo anterior
        try {
            fs.unlinkSync('uploads/'+req.body.anterior)
        } catch (error) {
            //console.log(error) 
        }
        //localizar e excluir a imagem
        var excluir = await gallery.findOneAndRemove({_id:id})
        //voltar para a página mygrid
        res.redirect("/gallery")
    })
}