const {exec} = require('child_process')
const path = require('path')
const fs = require('fs');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: 'us-west-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function init() {
    console.log('Executing script.js')
    const outDirPath = path.join(__dirname, 'output');

    const p = ecec(`cd ${outDirPath} && npm install && npm run build`);

    p.stdout.on('data', (data) => {
        console.log(data.toString())
    });

    p.stdout.on('error', (data) => {
        console.log("Error", data.toString())
    });

    p.on('close', async () => {
        console.log(`Build complete`);
        const distFolderPath = path.join(__dirname, 'output', 'dist');
        const distFolderContents = fs.readdirSync(distFolderPath, {recursive: true});

        for (const file of distFolderContents) {
            if (fs.lstatSync(file).isDirectory()) continue;

            const filePath = path.join(distFolderPath, file);
            const fileContents = fs.readFileSync(filePath, 'utf-8');
        }
        
    });
}