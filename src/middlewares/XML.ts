import {NextFunction, Request, Response} from "express";

export class XML {
    public static XMLMiddleware(req: Request, res: Response, next: NextFunction) {
        res.set("Content-Type", "application/xml")
        next()
    }
}