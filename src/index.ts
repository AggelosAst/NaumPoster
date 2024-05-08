import {Default} from "./types/default";
import {Server} from "./libs/Server";


const server: Server = new Server({
    port: 80
})

server.startServer()