import { object, string } from 'yup';

export const createAlbumSchema = {
    body: object({
        name: string().required(),
        location: string(),
        date: string()
    })
};
