"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const kms = require("aws-cdk-lib/aws-kms");
const logs = require("aws-cdk-lib/aws-logs");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const ecs = require("aws-cdk-lib/aws-ecs");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-exec-command');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const kmsKey = new kms.Key(stack, 'KmsKey');
const logGroup = new logs.LogGroup(stack, 'LogGroup', {
    encryptionKey: kmsKey,
});
const execBucket = new s3.Bucket(stack, 'EcsExecBucket', {
    encryptionKey: kmsKey,
});
const cluster = new ecs.Cluster(stack, 'Ec2Cluster', {
    vpc,
    executeCommandConfiguration: {
        kmsKey,
        logConfiguration: {
            cloudWatchLogGroup: logGroup,
            cloudWatchEncryptionEnabled: true,
            s3Bucket: execBucket,
            s3EncryptionEnabled: true,
            s3KeyPrefix: 'exec-output',
        },
        logging: ecs.ExecuteCommandLogging.OVERRIDE,
    },
});
cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
});
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('web', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 256,
});
new ecs.Ec2Service(stack, 'Ec2Service', {
    cluster,
    taskDefinition,
    enableExecuteCommand: true,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZXhlYy1jb21tYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZXhlYy1jb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2Q0FBNkM7QUFDN0MseUNBQXlDO0FBQ3pDLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBRS9ELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFckQsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUU1QyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtJQUNwRCxhQUFhLEVBQUUsTUFBTTtDQUN0QixDQUFDLENBQUM7QUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtJQUN2RCxhQUFhLEVBQUUsTUFBTTtDQUN0QixDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNuRCxHQUFHO0lBQ0gsMkJBQTJCLEVBQUU7UUFDM0IsTUFBTTtRQUNOLGdCQUFnQixFQUFFO1lBQ2hCLGtCQUFrQixFQUFFLFFBQVE7WUFDNUIsMkJBQTJCLEVBQUUsSUFBSTtZQUNqQyxRQUFRLEVBQUUsVUFBVTtZQUNwQixtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLFdBQVcsRUFBRSxhQUFhO1NBQzNCO1FBQ0QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRO0tBQzVDO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRTtJQUM3QyxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztDQUMvQyxDQUFDLENBQUM7QUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFbkUsY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7SUFDakMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO0lBQ2xFLGNBQWMsRUFBRSxHQUFHO0NBQ3BCLENBQUMsQ0FBQztBQUVILElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO0lBQ3RDLE9BQU87SUFDUCxjQUFjO0lBQ2Qsb0JBQW9CLEVBQUUsSUFBSTtDQUMzQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sb2dzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1lY3MtaW50ZWctZXhlYy1jb21tYW5kJyk7XG5cbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJywgeyBtYXhBenM6IDIgfSk7XG5cbmNvbnN0IGttc0tleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS21zS2V5Jyk7XG5cbmNvbnN0IGxvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcsIHtcbiAgZW5jcnlwdGlvbktleToga21zS2V5LFxufSk7XG5cbmNvbnN0IGV4ZWNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRWNzRXhlY0J1Y2tldCcsIHtcbiAgZW5jcnlwdGlvbktleToga21zS2V5LFxufSk7XG5cbmNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFYzJDbHVzdGVyJywge1xuICB2cGMsXG4gIGV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjoge1xuICAgIGttc0tleSxcbiAgICBsb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICBjbG91ZFdhdGNoTG9nR3JvdXA6IGxvZ0dyb3VwLFxuICAgICAgY2xvdWRXYXRjaEVuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgczNCdWNrZXQ6IGV4ZWNCdWNrZXQsXG4gICAgICBzM0VuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgczNLZXlQcmVmaXg6ICdleGVjLW91dHB1dCcsXG4gICAgfSxcbiAgICBsb2dnaW5nOiBlY3MuRXhlY3V0ZUNvbW1hbmRMb2dnaW5nLk9WRVJSSURFLFxuICB9LFxufSk7XG5jbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbn0pO1xuXG5jb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbnRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gIG1lbW9yeUxpbWl0TWlCOiAyNTYsXG59KTtcblxubmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgY2x1c3RlcixcbiAgdGFza0RlZmluaXRpb24sXG4gIGVuYWJsZUV4ZWN1dGVDb21tYW5kOiB0cnVlLFxufSk7XG5cbmFwcC5zeW50aCgpOyJdfQ==