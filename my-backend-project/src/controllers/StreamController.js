const StreamService = require('../services/StreamService');
const fs = require('fs');
const path = require('path');


const streamSong = async(req,res)=>{
    try{
    const songID = req.params.id;

    const relativePath = await StreamService.getSongPathById(songID);
    const absolutePath = path.join(__dirname, '../../', relativePath);

    if(!fs.existsSync(absolutePath)){
        return res.status(404).send('Song not found');
    
    }
    const stat = fs.statSync(absolutePath);
    const fileSize = stat.size;
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      
    res.writeHead(200, head);

    const fileStream = fs.createReadStream(absolutePath);
    fileStream.pipe(res);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
      }

}
module.exports = {streamSong};