import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import { json, userId } from './http';

const s3 = new S3Client({});
const Bucket = process.env.UPLOAD_BUCKET!;
const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const user = userId(event);
    const body = event.body ? JSON.parse(event.body) : null;
    const type = String(body?.contentType ?? '');

    if (!body?.fileName || !allowed.has(type)) {
      return json(400, { message: 'Only JPEG, PNG and WebP are supported' });
    }

    const ext =
      String(body.fileName)
        .split('.')
        .pop()
        ?.replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 8) || 'bin';
    const key = `users/${user}/${randomUUID()}.${ext}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket,
        Key: key,
        ContentType: type,
      }),
      { expiresIn: 300 },
    );

    return json(200, { uploadUrl, key, expiresIn: 300 });
  } catch (error) {
    console.error(error);
    return json(500, { message: 'Could not create upload URL' });
  }
};
