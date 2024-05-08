import {PrismaClient} from '@prisma/client'
import {Data} from "node-cache";
import {DatabaseI} from "../types/DatabaseI";
import {Image} from "../types/Image";

export class Database implements DatabaseI {
    private readonly DatabaseObject: PrismaClient
    private ready: boolean = false

    public constructor() {
        this.DatabaseObject = new PrismaClient()
    }

    public async connect(): Promise<string | void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.DatabaseObject.$connect()
                this.ready = true
                resolve()
            } catch (e) {
                return reject(e)
            }
        })
    }

    public async saveImage(image: Image): Promise<Image> {
        return new Promise(async (resolve, reject) => {
            await this.DatabaseObject.images.create({
                data: image
            }).then((r: Image) => {
                return resolve(r)
            }).catch((e => {
                reject(e)
            }))
        })
    }

    public async findImageById(imageId: string): Promise<Image> {
        return new Promise(async (resolve, reject) => {
            await this.DatabaseObject.images.findUnique({
                where: {
                    id: imageId
                }
            }).then((r: Image | null) => {
                if (!r) {
                    return reject({
                        id: "0",
                        timestamp: new Date(),
                        src: "None"
                    })
                } else {
                    return resolve(r)
                }
            }).catch((e => {
                reject(e)
            }))
        })
    }

    public async removeImageById(imageId: string): Promise<Image> {
        return new Promise(async (resolve, reject) => {
            await this.DatabaseObject.images.delete({
                where: {
                    id: imageId
                }
            }).then((r: Image) => {
                return resolve(r)
            }).catch((e => {
                reject(e)
            }))
        })
    }
}