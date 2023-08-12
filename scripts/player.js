import {sendUrl} from "./downloader.js"
import * as fileManager from "./websocket.js";

const audio = new Audio();
var audio_repeat = false;
var start_button = document.getElementById("start-button")
var stop_button = document.getElementById("stop-button")
var skip_button = document.getElementById("skip-button")
var mix_button = document.getElementById("mix-button")
var downloadButton = document.getElementById("download-button")
var downloadInput = document.getElementById("download-input")
var slider = document.getElementById("myRange");

var mixed = true;

var music_files_to_play = []
var music_files_copy = []
var playlist_to_play_from = "";
var last_index = 0;

document.addEventListener("DOMContentLoaded", () => {
   fileManager.connectToWebsocketClient();

})

var startMusicLoop = (startFile = null) => {
    let playlists = document.getElementById("playlists");

    playlists.childNodes.forEach((node) => {
        
        if(node.attributes == undefined){
            return;
        }
        if(node.attributes.class.value == "playlist-selected"){
            playlist_to_play_from = node.attributes.id.value;
        }
        
        
    });

    let file_container = document.getElementById("music-files")

    music_files_to_play = [];
    music_files_copy = [];

    file_container.childNodes.forEach((node) => {
        music_files_to_play.push(node.attributes.id.value);
        music_files_copy.push(node.attributes.id.value);
    });

   if(startFile == null){

        let index = Math.floor(Math.random() * music_files_to_play.length);
        let file = music_files_to_play[index];

        music_files_to_play.splice(index, 1);

        audio_repeat = true;
        audio.src = "../playlists/" + playlist_to_play_from + "/" + file;
   }
   else{
        let startFileIndex;

        for(var index = 0; index < music_files_to_play.length; index++){
            if(music_files_to_play[index] == startFile){
                startFileIndex = index;
            }
        }
        music_files_to_play.splice(startFileIndex, 1);

        audio_repeat = true;
        audio.src = "../playlists/" + playlist_to_play_from + "/" + startFile;
   }
   audio.play()
}

var getSelectedPlaylist = () => {
    let selected_playlist = null;

    playlists.childNodes.forEach((node) => {
        
        if(node.attributes == undefined){
            return;
        }
        if(node.attributes.class.value == "playlist-selected"){
            selected_playlist = node.attributes.id.value
        }
        
        
    });

    return selected_playlist;
}

var skipMusic = () => {
    if(audio_repeat == false) return;

    if(music_files_to_play.length == 0){
        audio_repeat = false;
    }
    let index;
    let file;

    if(mixed){
        index = Math.floor(Math.random() * music_files_to_play.length);
        file = music_files_to_play[index];
        music_files_to_play.splice(index, 1);
    }
    else{
        index = last_index + 1;
        file = music_files_copy[index];
        if(index >= music_files_to_play.length){
            audio_repeat = false
            return;
        } 
    }
    last_index = index;

    audio.src = "../playlists/" + playlist_to_play_from + "/" + file;
    audio.play();
}

start_button.addEventListener("click", () => {
    if(audio_repeat && audio.paused){
        audio.play();
    }

    if(playlist_to_play_from == getSelectedPlaylist()) return;

    startMusicLoop();
})

stop_button.addEventListener("click", () => {
    if(audio_repeat){
        audio.pause();
    }
})

skip_button.addEventListener("click", () => {
    skipMusic();
})

mix_button.addEventListener("click", () => {
    mixed ? mixed = false : mixed = true;
    
    if(mixed){
        mix_button.innerHTML = "mixed"
    }
    else{
        mix_button.innerHTML = "not-mixed"
    }
})

slider.oninput = function() {
    audio.volume = this.value / 100
}

export var showMusicFiles = (receivedData) => {
    var files = receivedData.data;
    var file_container = document.getElementById("music-files")

    for(var fileIndex  = 0; fileIndex < files.length; fileIndex++){
        var li = document.createElement("li");
        
        li.appendChild(document.createTextNode(files[fileIndex]));
        li.setAttribute("class", "music-file");
        li.setAttribute("id", files[fileIndex]);

        li.addEventListener("click", (event) =>{
            let fileName = event.target.attributes.id.value;
            let x = 0;
            let index = 0;
            music_files_copy.forEach((file) => {
                if(file == fileName){
                    index = x;
                    return;
                }
                x++
            })

            last_index = index;
            startMusicLoop(fileName);
        })

        file_container.appendChild(li);
    }
}

audio.addEventListener("ended", () => {
    skipMusic();
})

downloadButton.addEventListener("click", () => {
    sendUrl(downloadInput.value)
})

