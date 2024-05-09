import axios, {AxiosError, AxiosResponse} from "axios";

export class Utilities {
    public static isDiscordImage(url: string): boolean {
        return url.includes("discordapp");
    }

    public static returnBase64ForImage(url: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            await axios.get(url, {
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:125.0) Gecko/20100101 Firefox/125.0",
                },
                responseType: "arraybuffer"
            }).then((r: AxiosResponse) => {
                const imageBase64: string = `data:image/png;base64, ${Buffer.from(r.data, 'binary').toString('base64')}`
                return resolve(imageBase64)
            }).catch((e: AxiosError) => {console.log(url)
                if (e.response) {
                    reject(`${e.response.status} | ${e.response.statusText}`);
                }
            })
        })
    }
}