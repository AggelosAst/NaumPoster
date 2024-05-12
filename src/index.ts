import {Server} from "./libs/Server";
import {Database} from "./libs/Database";


const db: Database = new Database();
db.connect().then(_ => {
    const server: Server = new Server({
        port: 80
    })
    server.startServer()
})



