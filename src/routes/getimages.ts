import express, {NextFunction, Request, Response, Router} from "express";
import {Database} from "../libs/Database";
import {Image} from "../types/Image";
import compression from "compression"
import zlib  from "zlib"
const router: Router = express.Router({
    caseSensitive: true
})

router.use(compression({
    level: 6, /* Balanced Speed & Size (compression rate) */
    strategy: zlib.constants.Z_FILTERED /* Smh */
}))

router.get("/getimages", async function (req: Request, res: Response, next: NextFunction): Promise<any> {
    await Database.Instance.getAllImages().then((images: Image[]) => {
        return res.status(200).json(images)
    }).catch(e => {
        return res.status(500).json({message: e.message})
    })
})

export {router}