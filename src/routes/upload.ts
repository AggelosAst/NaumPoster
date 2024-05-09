import express, {NextFunction, Request, Response, Router} from "express";
import {XMLBuilder} from "../libs/XMLBuilder";
import {Utilities} from "../libs/Utilities";
import {Database} from "../libs/Database";
import {Image} from "../types/Image";
import * as crypto from "crypto";
import {XML} from "../middlewares/XML";
import {DateTime} from "luxon"

const router: Router = express.Router({
    caseSensitive: true
})

router.post("/upload", XML.XMLMiddleware, async function (req: Request, res: Response, next: NextFunction): Promise<any> {
    const imageLink: string | undefined = req.body["image"]?.toString()
    if (!imageLink) {
        return res.status(500).send(new XMLBuilder({
            error: {
                errorMessage: "image query is missing from the request",
                expect: {
                    body: "image",
                    type: "string"
                },
                got: {}
            }
        }).constructXML())
    }
    if (!Utilities.isDiscordImage(imageLink)) {
        return res.status(400).send(new XMLBuilder({
            error: {
                errorMessage: "image data url is not a valid URL",
                expect: {
                    body: "image",
                    type: "string",
                    format: "*.discordapp"
                },
                got: {
                    body: imageLink,
                    format: "invalid"
                }
            }
        }).constructXML())
    }
    await Utilities.returnBase64ForImage(imageLink).then(async (base64: string) => {
        const image: Image = {
            id: crypto.randomUUID(),
            src: base64,
            timestamp: new Date(),
        }
        await Database.Instance.saveImage(image).then((r: Image) => {
            //@ts-ignore
            delete r.src

            r.timestamp = DateTime.fromJSDate(r.timestamp).setLocale("en").toHTTP() as any

            return res.status(201).send(new XMLBuilder(r).constructXML());
        }).catch(e => {
            return res.status(500).send(new XMLBuilder({
                error: {
                    errorMessage: "Internal Server Error",
                    error: e.message
                }
            }).constructXML());
        })
    }).catch(e => {
        return res.status(500).send(new XMLBuilder({
            error: {
                errorMessage: "Couldnt fetch image. Make sure the image is not deleted or corrupted.",
                error: e
            }
        }).constructXML());
    })
})

export {router}