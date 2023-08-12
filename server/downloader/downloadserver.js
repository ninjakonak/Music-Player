const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

const corsOptions ={
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))


app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');

});

app.get('/download', (req,res) => {
    var URL = req.query.URL;
    
    var stream = ytdl(URL);
    stream.on('info', (info) => {
        var newTitle = "";
        for(var x = 0; x < info.videoDetails.title.length; x++){
            if(info.videoDetails.title[x] != ','){

                if(info.videoDetails.title[x] == 'İ'){
                    newTitle += "I";
                }
                else if (info.videoDetails.title[x] == 'Ş'){
                    newTitle += "S"
                }
                else if (info.videoDetails.title[x] == 'ş'){
                    newTitle += "s"
                }
                else if (info.videoDetails.title[x] == 'ç'){
                    newTitle += "c";
                }
                else if (info.videoDetails.title[x] == 'Ü'){
                    newTitle += "U";
                }
                else if (info.videoDetails.title[x] == 'Ğ'){
                    newTitle += "G";
                }
                else if (info.videoDetails.title[x] == 'ğ'){
                    newTitle += "g";
                }
                else if (info.videoDetails.title[x] == 'ü'){
                    newTitle += "u";
                }
                else if (info.videoDetails.title[x] == 'ö'){
                    newTitle += "o";
                }
                else if (info.videoDetails.title[x] == 'Ö'){
                    newTitle += "O";
                }
                else{
                    newTitle += info.videoDetails.title[x];
                }

                
            }

        }
        res.header('Content-Disposition', 'attachment; filename=' + newTitle + ".mp3");        
    });
    
    ytdl(URL, {
        format: 'mp3',
        filter: 'audioonly'
    }).pipe(res);
    
});