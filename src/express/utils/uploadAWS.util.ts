const path = require("path");
const {uuid} = require("uuidv4")
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION
})
const s3 = new aws.S3()
const upload = multer({
    storage: multerS3({
        s3,
        bucket: "alpostel",
        acl: 'public-read',
        key(req: Request, file:{originalname: string} , cb:(vl: null, newName: string) => string){
            
            cb(null, uuid() + path.extname(file.originalname))
        }
    })
})
export {upload, s3}
