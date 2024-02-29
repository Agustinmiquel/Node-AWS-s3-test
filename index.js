import fileupload from "express-fileupload";
import { dowloadFile, getFile, getFileUrl, getFiles, uploadFile } from './s3.js'
import express from "express";

const app = express();

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));

app.get('/', (req, res) => {
    res.json({message: 'Hello world!'});
})

app.get('/files', async (req, res) => {
    const result = await getFiles();
    res.json(result.Contents);
})

app.get('/files/:fileName', async (req, res) => {
    const result = await getFileUrl(req.params.fileName)
    res.json({
        url: result
    });
})

app.get('/dowloadFile/:fileName', async (req, res) => {
     await dowloadFile(req.params.fileName)
    res.json({message:'Archivo descargado'});
})

app.post('/files', async (req, res) => {
    const result = await uploadFile(req.files.file)
    res.json({result});
})

app.listen(3000);
console.log(`Server listening on ${3000}`);

