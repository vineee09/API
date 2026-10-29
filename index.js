const express = require("express")
const mysql =  require ("mysql2/promise")
const app = express()

app.use(express.json())

const games = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "games"
})

app.get("/jogos", async (req, res) => {
    const [jogos] = await games.execute("SELECT * FROM jogos")
    return res.json(jogos)
})

app.post("/jogos", async (req,res) => {
    const{nome, desenvolvedora, sinopse} = req.body

    if(!nome || !desenvolvedora || !sinopse) {
        return res.status(400).json({error: "Informações incompleta"})
    }

    if(nome.length <= 3){
        return res.status(400).json({error: "Nome precisava ter mais de 2 caracteres"})
    }
    const[resultado] = await games.execute(
        "INSERT INTO jogos(nome, desenvolvedora, sinopse) VALUES (?,?,?)",
        [nome, desenvolvedora, sinopse]
    )

    return res.status(201).json({id: resultado.insertId, nome, desenvolvedora, sinopse})
})
app.put("/jogos/:id", async (req, res) => {
    const { nome, desenvolvedora, sinopse } = req.body

    if (!nome || !desenvolvedora || !sinopse) {
        return res.status(400).json({ error: "Nome, desenvolvedora e sinopse sao obrigatorios" })
    }

    const id = req.params.id

    const [resultado] = await games.execute(
        "UPDATE jogos SET nome = ?, desenvolvedora = ?, sinopse = ? WHERE id = ?",
        [nome, desenvolvedora, sinopse, id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: "Jogo nao encontrado" })
    }

    return res.json({ id, nome, desenvolvedora, sinopse })
})

app.delete("/jogos/:id", async (req, res) => {
    const id = req.params.id
    const [resultado] = await games.execute("DELETE FROM jogos WHERE id = ?", [id])

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: "Jogo não encontrado" })
    }

    return res.status(200).json({ mensagem: "Jogo deletado com sucesso" })
})

app.post("/generos", async (req, res) =>{
    const{nome, descricao} = req.body

    if(!nome || !descricao){
        return res.status(400).json({error: "Nome e descrição são obrigátorios"})
    }

    const [resultado] = await games.execute("INSERT INTO generos (nome, descricao) VALUES (?, ?)", [nome, descricao])
    return res.status(201).json({ id: resultado.insertId, nome, descricao})
})

app.get("/generos", async (req, res) => {
    try {
        const [generos] = await games.execute("SELECT * FROM generos")
        return res.json(generos)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Erro interno do servidor" })
    }
})




app.listen(3000, () => console.log("API rodando papai")) 