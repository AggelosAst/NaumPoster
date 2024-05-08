import morgan from "morgan"
import express, {Express} from "express";
import cors from "cors"

// -- ROUTES -- \\
import {router as homePage} from "../routes/home"
import {router as upload} from "../routes/upload";
import {router as getImages } from "../routes/getimages";
import {router as findImage } from "../routes/findimage";


import {ServerOptions} from "../types/serverOptions";


// -- Server -- \\

export class Server {
    private readonly port: number
    private readonly app: Express

    /**
     * Constructor function for the Server class.
     *
     * @param {ServerOptions} options - The options for the server.
     */
    public constructor(options: ServerOptions) {
        this.port = options.port;
        this.app = express();
        this.app.use(morgan("dev"));
        this.app.disable("x-powered-by");
        this.app.use(cors({
            origin: ["http://127.0.0.1", "http://localhost"],
            optionsSuccessStatus: 200,
            methods: ["GET", "POST", "PUT"]
        }))
        this.app.use(express.json())
        this.app.use("/public", express.static("./src/public", {
            cacheControl: true,
            etag: true,
            lastModified: true,
        }))

        // -- Set Routes -- \\

        this.app.use(homePage);
        this.app.use(upload)
        this.app.use(getImages)
        this.app.use(findImage)
    }

    /**
     * Starts the server and listens on the specified port.
     *
     * @return {boolean|string} Returns true if the server started successfully,
     * or an error message if there was an exception.
     */
    public startServer(): boolean | string {
        try {
            this.app.listen(this.port)
            return true
        } catch (e: any) {
            return e
        }
    }
}