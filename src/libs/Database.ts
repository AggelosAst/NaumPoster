import {PrismaClient} from '@prisma/client'
import {Data} from "node-cache";
import {DatabaseI} from "../types/DatabaseI";
import {Image} from "../types/Image";

export class Database implements DatabaseI {
    private readonly DatabaseObject: PrismaClient
    private ready: boolean = false
    public static Instance : Database

    public constructor() {
        this.DatabaseObject = new PrismaClient()
        Database.Instance = this
    }

    public async connect(): Promise<string | void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.DatabaseObject.$connect()
                this.ready = true
                resolve()
            } catch (e: any) {
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
            }).catch(((e: any) => {
                reject(e)
            }))
        })
    }

    public async getAllImages(): Promise<Image[]> {
        return new Promise(async (resolve, reject) => {
            await this.DatabaseObject.images.findMany({
                select: {
                    timestamp: true,
                    src: true,
                    id: true
                }
            }).then((images: Image[]) => {
                return resolve(images)
            }).catch((e: any) => {
                reject(e)
            })
        })
    }

    public async findImageById(imageId: string): Promise<Image | undefined> {
        return new Promise(async (resolve, reject) => {
            await this.DatabaseObject.images.findUnique({
                where: {
                    id: imageId
                }
            }).then((r: Image | null) => {
                if (!r) {
                    return resolve(undefined)
                } else {
                    return resolve(r)
                }
            }).catch(((e: any) => {
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
            }).catch(((e: any) => {
                reject(e)
            }))
        })
    }
}