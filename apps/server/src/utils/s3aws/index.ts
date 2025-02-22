export const s3QuizConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET,
};

export const s3MindXConfig = {
  accessKeyId: process.env.MINDX_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MINDX_AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.MINDX_AWS_BUCKET,
};
