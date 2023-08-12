import * as player from "./player.js"

var websocketClient;

//websocketClient = new WebSocket("ws://localhost:12345");
export var connectToWebsocketClient = async () => {
    websocketClient = new WebSocket("ws://localhost:12345");

    websocketClient.addEventListener("message", (event) => {
        //let playlists = document.getElementById("playlists");
        let receivedData = JSON.parse(event.data);

        if(receivedData.request == "playlists"){
            manageDirectories(receivedData);
        }
        if(receivedData.request == "playlist-content"){
            player.showMusicFiles(receivedData);
        }
        
    });

    websocketClient.addEventListener("open", () => {
        sendRequest(JSON.stringify({request:"playlists",data:"playlists"}))
    });
}



var manageDirectories = (receivedData) => {
    let directories = receivedData.data;
    var musicContainer = document.getElementById("music-container");
    var playlist_element = document.getElementById("playlists")
    var file_container = document.getElementById("music-files")
    
        
    for(var playlistIndex = 0; playlistIndex < directories.length; playlistIndex++){
        var li = document.createElement("li");
        
        li.appendChild(document.createTextNode(directories[playlistIndex]));
        li.setAttribute("class", "playlist");
        li.setAttribute("id", directories[playlistIndex]);
        

        li.addEventListener("click", (event) => {
            if(event.target.attributes.class.nodeValue != "playlist-selected"){
                playlist_element.childNodes.forEach((node) => {
                    if(node.attributes == undefined) return;
                    if(node.attributes.class.nodeValue == "playlist-selected"){
                        node.setAttribute("class","playlist")
                    }
                    
                    event.target.setAttribute("class","playlist-selected")
                    
                    
                })
                musicContainer.attributes.class.nodeValue = "open";
                file_container.textContent = '';
                sendRequest(JSON.stringify({request:"playlist-content",data:"playlists\\" + event.target.attributes.id.nodeValue})); 
            }
            else{
                musicContainer.attributes.class.nodeValue = "closed";
                event.target.setAttribute("class","playlist")
                file_container.textContent = '';
            }


        })

        playlist_element.appendChild(li);
    }
}

export var sendRequest = (request) => {
    websocketClient.send(request);
}



