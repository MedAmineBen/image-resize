import express from 'express'; 
import sharp from 'sharp';
import path from 'path';
import logger from './utilities/logger';
import {promises as fsPromises} from 'fs';

const app = express();
const port = 3000;

console.log(__dirname);

app.get('/api/images', logger, async(req, res) => {
    const endFile = req.hostname.replace('-3000', '');
    const width = req.query.width;
    const height = req.query.height;
    const inputFile = path.join(__dirname, `../images/full/${req.query.filename}.jpg`);
    const outputFile = path.join(__dirname, `../images/thumbnails/${req.query.filename}-${width}x${height}.jpg`);
    try {
        if (!req.query.filename){
            throw new Error('does not exist');
        }
        await sharp(inputFile) 
            .resize(Number(width), Number(height))
            .toFile(outputFile);
        res.send(`<img src=https://${endFile}/files/images/thumbnails/${req.query.filename}-${width}x${height}.jpg>`);
    } catch (err){
        console.log('encountered an error');
        res.send(`please add your filename and your desired resolution as this format: 
                  path?filename=xxx&width=xxx&height=xxx`)
        }
});

app.get('/', logger, (req, res) => {
    res.send("please visit /api/images  with your all parameters set");
});


app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});


export default app;
