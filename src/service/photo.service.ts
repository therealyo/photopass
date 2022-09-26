import { BucketParams } from '../@types/BucketParams';
import { Photo } from '../models/Photo';
import { getPresignedUrl } from './presignedUrl.service';
import { PhoneNumber } from '../models/PhoneNumber';
import { User } from '../models/User';
import { Album } from '../models/Album';

class PhotoService {
    getParams(key: string): BucketParams {
        return {
            Bucket: process.env.BUCKET_NAME!,
            Key: key,
            Expires: 3600,
            ACL: 'public-read'
        };
    }

    async savePhotos(user: User, albumName: string, amount: number, numbers: PhoneNumber[]): Promise<string[]> {
        const root = `albums/${user.login}/${albumName}`;
        const links = [] as string[];
        const photos = [] as Photo[];
        const albumId = await Album.getAlbumId(albumName, user.userId!);
        let photosUntilWaterMark = await User.photosUntilWaterMark(user);

        for (let i = 0; i < amount; i++) {
            let needWaterMark = false;
            if (photosUntilWaterMark < 0) {
                photosUntilWaterMark += 1;
            } else {
                needWaterMark = true;
            }
            const photo = new Photo(albumId, needWaterMark, numbers);
            await photo.setName();
            photos.push(photo);
            const params = this.getParams(`albums/${root}/${photo.name}.jpg`);
            links.push(await getPresignedUrl('putObject', params));
        }

        const phoneNumbers = numbers.map((num) => {
            return new PhoneNumber(num.countryCode, num.phoneNumber, user.userId!);
        });

        await PhoneNumber.save(phoneNumbers);
        await Photo.save(photos);
        return links;
    }

    async removeWatermark(photoName: string): Promise<string> {
        await Photo.removeWatermark(photoName);
        return `removed watermark from ${photoName}`;
    }
}

export default new PhotoService();
