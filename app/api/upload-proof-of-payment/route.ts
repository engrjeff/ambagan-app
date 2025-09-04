import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const file = body.file;
    const projectName = body.projectName;
    const userId = body.userId;
    const dueDate = body.dueDate;
    const contributor = body.contributor;

    const folder = `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/projects/${userId}/${projectName}/${dueDate}/${contributor}`;

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const publicId = [
      slugify(projectName.toLowerCase()),
      userId,
      contributor,
    ].join('-');

    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp: Math.floor(Date.now() / 1000),
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    const result = await cloudinary.uploader.upload(file, {
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      signature,
      folder,
      public_id: publicId,
      timestamp: paramsToSign.timestamp,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });

    const url = result.url;

    return NextResponse.json({ url });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}
