"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const ec2 = require("aws-cdk-lib/aws-ec2");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-volume-1');
new ec2.Volume(stack, 'TestVolume', {
    availabilityZone: 'us-east-1a',
    size: cdk.Size.gibibytes(1),
    volumeType: ec2.EbsDeviceVolumeType.GP3,
    throughput: 200,
});
new integ.IntegTest(app, 'VolumeTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudm9sdW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcudm9sdW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLG9EQUFvRDtBQUNwRCwyQ0FBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBRXpELElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO0lBQ2xDLGdCQUFnQixFQUFFLFlBQVk7SUFDOUIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMzQixVQUFVLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEdBQUc7SUFDdkMsVUFBVSxFQUFFLEdBQUc7Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUU7SUFDckMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWVjMi12b2x1bWUtMScpO1xuXG5uZXcgZWMyLlZvbHVtZShzdGFjaywgJ1Rlc3RWb2x1bWUnLCB7XG4gIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDEpLFxuICB2b2x1bWVUeXBlOiBlYzIuRWJzRGV2aWNlVm9sdW1lVHlwZS5HUDMsXG4gIHRocm91Z2hwdXQ6IDIwMCxcbn0pO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ1ZvbHVtZVRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==