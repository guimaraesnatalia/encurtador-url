import { URLModel } from '../database/model/URL'
import { Request, response, Response } from 'express'
import shortId from 'shortid'
import { config } from '../config/Constants'

export class URLController {
    public async shorten(req: Request, res: Response): Promise<void>{
        const{ originURL, customURL } = req.body
        let url = await URLModel.findOne({originURL})
        let hash = customURL
        const urlHash = await URLModel.findOne({hash})

        if (url) {
            res.status(409).json({error: "URL already exists", url})
            return
        }else if(urlHash){
            url = urlHash
            res.status(409).json({error: "Custom URL already exists", url})
            return
        }

        if ( customURL == '' ){
            hash = shortId.generate()
        }

        const shortURL = `${config.API_URL}/${hash}`
        const newURL = await URLModel.create({hash, shortURL, originURL})

        res.json(newURL)
    }

    public async redirect(req: Request, res: Response): Promise<void>{
        const { hash } = req.params
        const url = await URLModel.findOne({ hash })
        if (url){
            console.log(url)
            res.redirect(url.originURL)
            return
        }
        res.status(400).json({error: "URL not found"})
    }
}
