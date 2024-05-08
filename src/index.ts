import {Server} from "./libs/Server";
import {Database} from "./libs/Database";
import {DateTime} from "luxon";

(async () => {
    const db: Database = new Database();
    await db.connect().then(_ => {
        const server: Server = new Server({
            port: 80
        })
        server.startServer()
    })
})()


