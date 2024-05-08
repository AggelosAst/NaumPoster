import xml2js from "xml2js"

export class XMLBuilder {
    private readonly rawData: object

    public constructor(data: object) {
        this.rawData = data
    }

    public constructXML(): string {
        return new xml2js.Builder({
            renderOpts: {
                pretty: true
            }
        }).buildObject(this.rawData)
    }
}