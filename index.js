const express = require('express');
const cors = require ('cors');
const {Sequelize, DataTypes} = require('sequelize');

//CONFIGURANDO CONEXÃO COM BANCO DE DADOS.
const sequelize = new Sequelize('db_api', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

// ORM MAPEANDO CLASSE PARA TABELA NO BANCO DE DADOS.

const Cliente = sequelize.define('Cliente',{
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

const Moto = sequelize.define('Moto', {
    modelo: { type: DataTypes.STRING, allowNull: false },
    marca: { type: DataTypes.STRING, allowNull: false },
    cor: { type: DataTypes.STRING, allowNull: false },
    ano: { type: DataTypes.INTEGER, allowNull: false }
})

const Carro = sequelize.define('Carro', {
    marca: { type: DataTypes.STRING, allowNull: false },
    modelo: { type: DataTypes.STRING, allowNull: false },
    cor: { type: DataTypes.STRING, allowNull: false },
    ano: { type: DataTypes.INTEGER, allowNull: false }
})

//CONFIGURANDO  SERVIDOR EXPRESS.
const app = express()
app.use(cors()) // PERMITE O SERVIDOR O FRONT-END ACESSAR A API
app.use(express.json())// PERMITE O SEVIDOR ENTENDER JSON.

const port = 3000

//DEFININDO ROTAS.
//Rota para buscar todos os clientes no banco de dados.
app.get('/clientes', async(req, res) => {
    const todosOsClientes = await Cliente.findAll()
    res.json(todosOsClientes)
})

//Rota para cadastrar um cliente e inserir no banco de dados.
app.post('/clientes', async(req, res) =>{
    try{
        const { nome, email, telefone} = req.body
        const novoCliente = await Cliente.create({nome, email, telefone})
        
        res.status(201).json({
            mensagem: 'cliente cadastrado com sucesso.',
        Cliente: novoCliente
        })
    } catch (erro){
        res.status(400).json({
            mensagem: 'erro ao cadastrar cliente. verifique se o e-mail já existe'
            })
        }

})

//Rotas para motos
app.get('/motos', async (req, res) => {
    const todasAsMotos = await Moto.findAll();
    res.json(todasAsMotos);
});

app.post('/motos', async (req, res) => {
    try {
        const { modelo, marca, cor, ano } = req.body;
        const novaMoto = await Moto.create({ modelo, marca, cor, ano });
        res.status(201).json({ mensagem: 'Moto cadastrada com sucesso.', moto: novaMoto });
    } catch (erro) {
        res.status(400).json({ mensagem: 'Erro ao cadastrar moto.' });
    }
});

//Rotas para carros
app.get('/carros', async(req, res) => {
    const todosOsCarros = await Carro.findAll();
    res.json(todosOsCarros);


});


app.post('/carros', async(req, res) => {
    try {
        const { marca, modelo, cor, ano } = req.body;
        const novoCarro = await Carro.create({ marca, modelo, cor, ano });
        res.status(201).json({ mensagem: 'Carro cadastrado com sucesso.', carro: novoCarro });
    } catch (erro) {
        res.status(400).json({ mensagem: 'Erro ao cadastrar carro.'})
    }


});
        
// INICIAR API E CONECTAR AO BANCO DE DADOS.

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`😁 servidor rodando em http://loaclhost:${port}`)
        console.log('👍 Banco de dados sincronizado')

    })
}).catch((erro) => {
    console.error('😭 Erro ao conectar ao sincronizar com o banco de dados', erro)
})