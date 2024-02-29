import {PutObjectCommand, S3Client, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY } from './config.js'
import fs from 'fs'; //modulo para poder trabajar con archivos
import { getSignedUrl} from '@aws-sdk/s3-request-presigner'

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials:{
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
})

export async function uploadFile(file){
    const stream = fs.createReadStream(file.tempFilePath);

    const uploadParam= {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    }

    const command = new PutObjectCommand(uploadParam)
    const result = await client.send(command)
    return result;
}

export async function getFiles(){
    const  command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME,
    })
    return await client.send(command);
}

export async function getFile(filename){
    const  command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })
    const result = await client.send(command)
    return result;
}

export async function dowloadFile(filename){
    const  command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })
    const result = await client.send(command)
    result.Body.pipe(fs.createWriteStream('./images/image.png')) //tiene la informacion del archivo que estamos buscando
}

export async function getFileUrl(filename){
    const  command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })

    return await getSignedUrl(client, command, {expiresIn: 3600})
   
}
