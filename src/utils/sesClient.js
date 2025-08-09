
const {SESClient} = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "us-east-1";
// Create SES service object.
const sesClient = new SESClient({ region: REGION,credentials:{accessKeyId:process.env.aws_access_key, secretAccessKey:process.env.aws_secret_key} 
});

module.exports = {sesClient};