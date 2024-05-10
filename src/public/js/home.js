class SearchEngine {
    imageCache = undefined
    indexedImageIds = {}  /* Record<string, string> = {} */
    async getAllImages() {
        return new Promise(async (resolve, reject) => {
            let response
            try {
                response = await axios.get("http://127.0.0.1/getimages")
                if (response.status === 200) {
                    this.imageCache = response.data
                    resolve(true)
                }
            } catch (e) {
                alert(`Couldn't get all images. Check console for more.`)
            }
        })
    }

    async getImageById(id) {
        return new Promise(async (resolve, reject) => {
            let response
            try {
                response = await axios.post("http://127.0.0.1/findimage", {
                    image: id
                })
                if (response.status === 200) {
                    resolve(response.data)
                }
            } catch (e) {
                const responseData = e.response.data
                const errorMsg = responseData.message
                const error = responseData.error
                if (error === "CANT_INDEX") {
                    alert(`Couldn't find image with id ${id} (${errorMsg})`)
                } else {
                    alert(`Unknown Error: ${error}`)
                }
            }
        })
    }

    getRandomInt(min, max) {
        return window.crypto.getRandomValues(new Uint32Array(1))[0] % (max - min + 1) + min;
    }

    getRandomImage() {
        const randomIndex = this.getRandomInt(0, this.imageCache.length - 1)
        return this.imageCache[randomIndex]
    }

    createImageElement(src, takenAt, id) {
        const imagesContainer = document.querySelector(".images")
        if (this.indexedImageIds[id]) { /* If the image is already indexed, don't create another image element  */
            return
        }
        const image = document.createElement("img")
        image.src = src
        image.id = id
        image.classList.add("card-img", "mb-2", "naum", "user-select-none")
        image.addEventListener("mousedown", () => window.open(src, "_blank"))
        const colDiv = document.createElement("div")
        colDiv.classList.add("col", "col-lg-4")
        const cardDiv = document.createElement("div")
        cardDiv.classList.add("card")
        colDiv.appendChild(cardDiv)
        const cardBody = document.createElement("div")
        cardBody.classList.add("card-body")
        cardBody.appendChild(image)
        const takenAtTitle = document.createElement("h6")
        takenAtTitle.classList.add("card-text", "fs-5", "text-start", "text-muted", "text-center", "user-select-none")
        takenAtTitle.textContent = "Taken At"
        const takenAtValue = document.createElement("h6")
        takenAtValue.classList.add("card-text", "fs-5", "text-start", "text-muted", "text-center", "user-select-none")
        takenAtValue.textContent = luxon.DateTime.fromISO(takenAt).toHTTP()
        const downloadButton = document.createElement("button")
        downloadButton.classList.add("btn", "bg-primary", "text-white", "w-100")
        downloadButton.textContent = "Download"
        downloadButton.addEventListener("click", () => window.open(src, "_blank"))
        cardBody.append(image, takenAtTitle, takenAtValue, downloadButton)
        cardDiv.appendChild(cardBody)
        imagesContainer.appendChild(colDiv)
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const preloader = document.querySelector(".cock")
    const gh = document.querySelector(".bi-github")
    const SE = new SearchEngine()
    preloader.style.opacity = 1
    await SE.getAllImages()
    preloader.style.opacity = 0
    const searchInput = document.querySelector("#search");
    const randomImage = SE.getRandomImage()
    searchInput.placeholder = `${!randomImage ? "ALL for every image" : `${randomImage.id} or ALL for every image`}`
    searchInput.addEventListener("keydown", async (k) => {
        if (k.keyCode === 13) {
            k.preventDefault();
            if (searchInput.value === "") {
                if (!SE.indexedImageIds[randomImage.id]) {
                    console.log("[CACHE]: Un-cached image D:")
                    SE.createImageElement(randomImage.src, randomImage.timestamp, randomImage.id)
                    SE.indexedImageIds[randomImage.id] = {
                        id: randomImage.id,
                        timestamp: randomImage.timestamp,
                        src: randomImage.src /* VERY EXPENSIVE!!! But it won't happen a lot. */
                    }
                }
            } else if (searchInput.value === "ALL") {
                for (let image in SE.imageCache) {
                    const accessor = SE.imageCache[image]
                    SE.createImageElement(accessor.src, accessor.timestamp, accessor.id)
                    SE.indexedImageIds[image.id] = {
                        id: image.id,
                        timestamp: image.timestamp,
                        src: image.src /* VERY EXPENSIVE!!! But it won't happen a lot. */
                    }
                }
            } else {
                const cachedInstance = SE.indexedImageIds[searchInput.value]
                if (cachedInstance) {
                    console.log(`[CACHE]: Cached image :D`)
                    SE.createImageElement(cachedInstance.src, cachedInstance.timestamp, cachedInstance.id)
                } else {
                    console.log("[CACHE]: Un-cached image D:")
                    await SE.getImageById(searchInput.value).then(image => {
                        console.log(image)
                        SE.createImageElement(image.src, image.timestamp, image.id)
                        SE.indexedImageIds[image.id] = {
                            id: image.id,
                            timestamp: image.timestamp,
                            src: image.src /* VERY EXPENSIVE!!! But it won't happen a lot. */
                        }
                    })
                }
            }
        }
    })
    gh.addEventListener("mouseup", () => { /* MouseUp because full click */
        window.open("https://github.com/AggelosAst/NaumPoster", "_self")
    })
})