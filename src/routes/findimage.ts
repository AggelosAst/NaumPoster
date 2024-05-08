import express, {NextFunction, Request, Response, Router} from "express";
import {Database} from "../libs/Database";
import {Image} from "../types/Image";

const router: Router = express.Router({
    caseSensitive: true
})

router.post("/findimage", async function (req: Request, res: Response, next: NextFunction): Promise<any> {
    const imageId : string | undefined = req.body["image"]
    if (!imageId) {
        return res.status(400).json({
            message: "Image is not part of the body",
            error: "IMAGE_MISSING"
        })
    }
    await Database.Instance.findImageById(imageId).then((image: Image | undefined) => {
        if (!image) {
            return res.status(404).json({
                message: "Image not found",
                error: "CANT_INDEX"
            })
        }
        return res.status(200).json(image);
    })
})

export {router}