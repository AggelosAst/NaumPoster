# Naum Uploader

## A very infefficient (yet functional) image uploader and viewer using base64 encoded image format

Its **pretty much** advised to not use such techniques for image hosts as base64 image strings can get **VERY** large in size, therefore result in longer bandwith etc.


## Disclaimer; This was made in an attempt to discover the outcomes of using base64 encoded images instead of saving them locally as .png/.jpg files.

# Features:

1. Images/Videos/Gifs are rendered as .WEBP/.mp4 files. .WEBP files Images support both lossless and lossy compression. 
2. Supports **ONLY** links of discord attachments for uploading
3. Uses **XML** for the **/upload** api as a flexible way as it contains schemas.
4. Uses **JSON** for the **/getimages** api as a response for the uploaded images as XML doesnt support characters included in base64 strings. [Supported Characters](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references)
~~5~~. *Not a featuure*, *but*, this approach makes it so your images are * " invisible "* to the naked eye and are saved in a database not wasily viewable.
  
