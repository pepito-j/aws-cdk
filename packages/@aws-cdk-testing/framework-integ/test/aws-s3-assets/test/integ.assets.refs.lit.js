"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const assets = require("aws-cdk-lib/aws-s3-assets");
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /// !show
        const asset = new assets.Asset(this, 'SampleAsset', {
            path: path.join(__dirname, 'sample-asset-directory'),
        });
        new cdk.CfnOutput(this, 'S3BucketName', { value: asset.s3BucketName });
        new cdk.CfnOutput(this, 'S3ObjectKey', { value: asset.s3ObjectKey });
        new cdk.CfnOutput(this, 'S3HttpURL', { value: asset.httpUrl });
        new cdk.CfnOutput(this, 'S3ObjectURL', { value: asset.s3ObjectUrl });
        /// !hide
        // we need at least one resource
        asset.grantRead(new iam.User(this, 'MyUser'));
    }
}
const app = new cdk.App();
new TestStack(app, 'aws-cdk-asset-refs');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLnJlZnMubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXNzZXRzLnJlZnMubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsb0RBQW9EO0FBRXBELE1BQU0sU0FBVSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9CLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixTQUFTO1FBQ1QsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDbEQsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHdCQUF3QixDQUFDO1NBQ3JELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLFNBQVM7UUFFVCxnQ0FBZ0M7UUFDaEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDekMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBhc3NldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWFzc2V0cyc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLy8gIXNob3dcbiAgICBjb25zdCBhc3NldCA9IG5ldyBhc3NldHMuQXNzZXQodGhpcywgJ1NhbXBsZUFzc2V0Jywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3NhbXBsZS1hc3NldC1kaXJlY3RvcnknKSxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdTM0J1Y2tldE5hbWUnLCB7IHZhbHVlOiBhc3NldC5zM0J1Y2tldE5hbWUgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1MzT2JqZWN0S2V5JywgeyB2YWx1ZTogYXNzZXQuczNPYmplY3RLZXkgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1MzSHR0cFVSTCcsIHsgdmFsdWU6IGFzc2V0Lmh0dHBVcmwgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1MzT2JqZWN0VVJMJywgeyB2YWx1ZTogYXNzZXQuczNPYmplY3RVcmwgfSk7XG4gICAgLy8vICFoaWRlXG5cbiAgICAvLyB3ZSBuZWVkIGF0IGxlYXN0IG9uZSByZXNvdXJjZVxuICAgIGFzc2V0LmdyYW50UmVhZChuZXcgaWFtLlVzZXIodGhpcywgJ015VXNlcicpKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLWFzc2V0LXJlZnMnKTtcbmFwcC5zeW50aCgpO1xuIl19