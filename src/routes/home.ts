import express, {Request, Response, NextFunction, Router} from "express";
const router: Router = express.Router({
    caseSensitive: true
})

router.get("/gallery", async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    return res.status(200).sendFile("index.html", {
        root: "./src/webpages"
    })
})

export { router }