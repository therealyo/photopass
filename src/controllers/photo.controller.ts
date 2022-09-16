import { Request, Response, NextFunction } from 'express';
import photoService from '../service/photo.service';

class PhotoController {
    async savePhotos(req: Request, res: Response, next: NextFunction) {
        try {
            const { albumName } = req.params;
            const { amount, numbers, user } = req.body;

            const links = await photoService.savePhotos(
                user,
                albumName,
                amount,
                numbers
            );

            return res.status(200).json({
                status: 200,
                data: links
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new PhotoController();
