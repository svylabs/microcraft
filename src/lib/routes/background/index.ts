import axios from 'axios';
import express from 'express';
import { getDatastore } from '../../database';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();

export const backgroundTasksRouter = express.Router();

enum FileType {
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    GIF = 'image/gif',
    SVG = 'image/svg+xml',
};

const MAX_RETRIES = 3;

const PUBLIC_IMAGE_STORAGE_BUCKET = process.env.PUBLIC_IMAGE_STORAGE_BUCKET || 'public-images-microcraft';

const downloadImage = async (image_url: string) => {
    let img = image_url;
    if (!image_url.startsWith('data:')) {
        const response = await axios.get(image_url, { responseType: 'arraybuffer' });
        console.log(`Image download status: ${response.status}`);
        if (response.status == 200) {
            const fileType = response.headers['Content-Type'] || response.headers['content-type'];
            const type = Object.values(FileType).find(type => type === fileType)
            console.log(`File type: ${JSON.stringify(fileType)} - ${type}`);
            return {
                fileBuffer: response.data,
                fileType: Object.values(FileType).find(type => type === fileType) || FileType.JPEG,
            };
        }
    }
    // download the image
    if (img.startsWith('data:')) {
        const splitData = img.split(';base64,');
        const base64Image = splitData.pop();
        const base64Type = splitData.pop()?.split(':').pop();
        if (!base64Image) {
            throw new Error('Invalid base64 image');
        }
        const buffer = Buffer.from(base64Image, 'base64');
        return {fileBuffer: buffer, fileType: Object.values(FileType).find(type => type === base64Type) || FileType.JPEG};
    }
    
    throw new Error('Failed to download image');
}

const compressImage = async (image: Buffer, desiredKB: number) => {
    // compress the image
}

async function uploadImageToStorage(fileBuffer: Buffer, targetFileName: string, fileType: FileType) {
    const bucket = storage.bucket(PUBLIC_IMAGE_STORAGE_BUCKET);
    const file = bucket.file(targetFileName);

    // Create a new blob in the bucket and upload the file data.
    const blobStream = file.createWriteStream({
        resumable: false,
        metadata: {
            contentType: fileType,  // Change this to the appropriate content type.
        },
    });

    blobStream.on('error', (err) => {
        console.error('BlobStream error:', err);
    });

    blobStream.on('finish', () => {
        console.log(`File ${targetFileName} uploaded.`);
    });

    blobStream.end(fileBuffer);
}

const updateDatabaseRecord = async (db_record_to_update: any, image_name: string) => {
    // update the image url in the database
    const datastore = getDatastore();
    const key = datastore.key([db_record_to_update.kind, db_record_to_update.id]);
    const [record] = await datastore.get(key);
    if (!record) {
        throw new Error('Record not found');
    }
    record.image_url = `https://storage.googleapis.com/${PUBLIC_IMAGE_STORAGE_BUCKET}/${image_name}`;
    await datastore.update({ key, data: record });
}

backgroundTasksRouter.post('/image-handler', async (req, res) => {
    console.log('Image handler called');
    const { image_url, image_id, db_record_to_update, retry } = req.body;
    // download the image
    console.log(`Downloading image: ${image_id} for ${db_record_to_update.kind}/${db_record_to_update.id}`);
    const image = await downloadImage(image_url);
    // compress the image
    // upload the image to cloud storage
    console.log(`Storing image: ${image_id} for ${db_record_to_update.kind}/${db_record_to_update.id}`);
    const image_name = `${image_id}.${image.fileType.split('/')[1]}`;
    await uploadImageToStorage(image.fileBuffer, image_name, image.fileType);
    // update the image url in the database
    
    console.log(`Updating: ${image_name} for ${db_record_to_update.kind}/${db_record_to_update.id}`);
    await updateDatabaseRecord(db_record_to_update, image_name);
    return { status: 'success' }
})