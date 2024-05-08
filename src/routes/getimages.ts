import express, {NextFunction, Request, Response, Router} from "express";
import {Database} from "../libs/Database";
import {Image} from "../types/Image";

const router: Router = express.Router({
    caseSensitive: true
})

router.get("/getimages", async function (req: Request, res: Response, next: NextFunction): Promise<any> {
    await Database.Instance.getAllImages().then((images: Image[]) => {
        return res.status(200).json(images)
    }).catch(e => {
        return res.status(500).json({message: e.message})
    })
})

export {router}