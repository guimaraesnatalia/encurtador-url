import { URLModel } from '../database/model/URL'
import { Request, response, Response } from 'express'
import shortId from 'shortid'
import { config } from '../config/Constants'

export class URLController {
    public async shorten(req: Request, res: Response): Promise<void>{
        const{ originURL } = req.body
        const url = await URLModel.findOne({originURL})
        if (url) {
            response.json(url)
            return
        } 
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`
        const newURL = await URLModel.create({hash, shortURL, originURL})

        res.json({originURL, hash, shortURL})
    }

    public async redirect(req: Request, res: Response): Promise<void>{
        const { hash } = req.params
        const url = {
            originURL: 'www.github.com',
            hash: '3M1s86Z3C',
            shortURL: 'http://localhost:5000/3M1s86Z3C',
        }

        res.redirect(url.originURL)
    }
}
