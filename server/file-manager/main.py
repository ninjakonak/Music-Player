import asyncio
import websockets
import os
import json

def getRootDir():
    root = os.path.abspath(os.curdir).split("\\")

    while root[-1] != "Music-Player":
        root.pop(-1)

    ROOT_DIR = ""

    for n in root:
        ROOT_DIR += "{}\\".format(n)

    return ROOT_DIR

def getContents(path):
    contents = []

    for content in os.listdir(path):
        contents.append(content)

    return contents

async def evaluateRequest(client_socket, new_request):
    data = ""
    
    if(new_request["request"] == "playlists"):
        data = getContents(project_directory + new_request["data"])
        
    if(new_request["request"] == "playlist-content"):
        data = getContents(project_directory + new_request["data"])

    if(new_request["request"] == "download"):
        pass

    info = json.dumps({"request":new_request["request"], "data":data})

    await client_socket.send(info)
        
async def new_client_connected(client_socket, path):
    print("new client connected")
    while True:
        try:
            new_request = json.loads(await client_socket.recv())
            await evaluateRequest(client_socket, new_request)
            
        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected.  Do cleanup")
            break 

async def start_server():
    

    await websockets.serve(new_client_connected, "localhost", 12345)

if __name__ == "__main__":
    global project_directory 
    project_directory = getRootDir()
    

    event_loop = asyncio.get_event_loop()
    event_loop.run_until_complete(start_server())
    event_loop.run_forever()