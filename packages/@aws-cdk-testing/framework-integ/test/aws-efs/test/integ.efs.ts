import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { FileSystem } from 'aws-cdk-lib/aws-efs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });

const fileSystem = new FileSystem(stack, 'FileSystem', {
  vpc,
});

fileSystem.addAccessPoint('AccessPoint', {
  createAcl: {
    ownerGid: '1000',
    ownerUid: '1000',
    permissions: '755',
  },
  path: '/custom-path',
  posixUser: {
    gid: '1000',
    uid: '1000',
  },
});