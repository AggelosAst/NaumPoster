import {Image} from "./Image";

export interface DatabaseI {
    connect(): Promise<string | void>;
    saveImage(image: Image): Promise<Image>
    removeImageById(imageId: string): Promise<Image>;
    findImageById(imageId: string): Promise<Image | undefined>;
    getAllImages(): Promise<Image[]>;
}