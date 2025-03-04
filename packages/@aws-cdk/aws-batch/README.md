# AWS Batch Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

AWS Batch is a batch processing tool for efficiently running hundreds of thousands computing jobs in AWS. Batch can dynamically provision different types of compute resources based on the resource requirements of submitted jobs.

AWS Batch simplifies the planning, scheduling, and executions of your batch workloads across a full range of compute services like [Amazon EC2](https://aws.amazon.com/ec2/) and [Spot Resources](https://aws.amazon.com/ec2/spot/).

Batch achieves this by utilizing queue processing of batch job requests. To successfully submit a job for execution, you need the following resources:

1. [Job Definition](#job-definition) - *Group various job properties (container image, resource requirements, env variables...) into a single definition. These definitions are used at job submission time.*
2. [Compute Environment](#compute-environment) - *the execution runtime of submitted batch jobs*
3. [Job Queue](#job-queue) - *the queue where batch jobs can be submitted to via AWS SDK/CLI*

For more information on **AWS Batch** visit the [AWS Docs for Batch](https://docs.aws.amazon.com/batch/index.html).

## Compute Environment

At the core of AWS Batch is the compute environment. All batch jobs are processed within a compute environment, which uses resource like OnDemand/Spot EC2 instances or Fargate.

In **MANAGED** mode, AWS will handle the provisioning of compute resources to accommodate the demand. Otherwise, in **UNMANAGED** mode, you will need to manage the provisioning of those resources.

Below is an example of each available type of compute environment:

```ts
declare const vpc: ec2.Vpc;

// default is managed
const awsManagedEnvironment = new batch.ComputeEnvironment(this, 'AWS-Managed-Compute-Env', {
  computeResources: {
    vpc,
  }
});

const customerManagedEnvironment = new batch.ComputeEnvironment(this, 'Customer-Managed-Compute-Env', {
  managed: false, // unmanaged environment
});
```

### Spot-Based Compute Environment

It is possible to have AWS Batch submit spotfleet requests for obtaining compute resources. Below is an example of how this can be done:

```ts
const vpc = new ec2.Vpc(this, 'VPC');

const spotEnvironment = new batch.ComputeEnvironment(this, 'MySpotEnvironment', {
  computeResources: {
    type: batch.ComputeResourceType.SPOT,
    bidPercentage: 75, // Bids for resources at 75% of the on-demand price
    vpc,
  },
});
```

### Compute Environments and Security Groups

Compute Environments implement the `IConnectable` interface, which means you can use
connections on other CDK resources to manipulate the security groups and allow access.

For example, allowing a Compute Environment to access an EFS filesystem:

```ts
import * as efs from 'aws-cdk-lib/aws-efs';

declare const fileSystem: efs.FileSystem;
declare const computeEnvironment: batch.ComputeEnvironment;

fileSystem.connections.allowDefaultPortFrom(computeEnvironment);
```

### Fargate Compute Environment

It is possible to have AWS Batch submit jobs to be run on Fargate compute resources. Below is an example of how this can be done:

```ts
const vpc = new ec2.Vpc(this, 'VPC');

const fargateSpotEnvironment = new batch.ComputeEnvironment(this, 'MyFargateEnvironment', {
  computeResources: {
    type: batch.ComputeResourceType.FARGATE_SPOT,
    vpc,
  },
});
```

### Understanding Progressive Allocation Strategies

AWS Batch uses an [allocation strategy](https://docs.aws.amazon.com/batch/latest/userguide/allocation-strategies.html) to determine what compute resource will efficiently handle incoming job requests. By default, **BEST_FIT** will pick an available compute instance based on vCPU requirements. If none exist, the job will wait until resources become available. However, with this strategy, you may have jobs waiting in the queue unnecessarily despite having more powerful instances available. Below is an example of how that situation might look like:

```plaintext
Compute Environment:

1. m5.xlarge => 4 vCPU
2. m5.2xlarge => 8 vCPU
```

```plaintext
Job Queue:
---------
| A | B |
---------

Job Requirements:
A => 4 vCPU - ALLOCATED TO m5.xlarge
B => 2 vCPU - WAITING
```

In this situation, Batch will allocate **Job A** to compute resource #1 because it is the most cost efficient resource that matches the vCPU requirement. However, with this `BEST_FIT` strategy, **Job B** will not be allocated to our other available compute resource even though it is strong enough to handle it. Instead, it will wait until the first job is finished processing or wait a similar `m5.xlarge` resource to be provisioned.

The alternative would be to use the `BEST_FIT_PROGRESSIVE` strategy in order for the remaining job to be handled in larger containers regardless of vCPU requirement and costs.

### Launch template support

Simply define your Launch Template:

```ts
const myLaunchTemplate = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
  launchTemplateName: 'extra-storage-template',
  launchTemplateData: {
    blockDeviceMappings: [
      {
        deviceName: '/dev/xvdcz',
        ebs: {
          encrypted: true,
          volumeSize: 100,
          volumeType: 'gp2',
        },
      },
    ],
  },
});
```

And provide `launchTemplateName`:

```ts
declare const vpc: ec2.Vpc;
declare const myLaunchTemplate: ec2.CfnLaunchTemplate;

const myComputeEnv = new batch.ComputeEnvironment(this, 'ComputeEnv', {
  computeResources: {
    launchTemplate: {
      launchTemplateName: myLaunchTemplate.launchTemplateName as string, //or simply use an existing template name
    },
    vpc,
  },
  computeEnvironmentName: 'MyStorageCapableComputeEnvironment',
});
```

Or provide `launchTemplateId` instead:

```ts
declare const vpc: ec2.Vpc;
declare const myLaunchTemplate: ec2.CfnLaunchTemplate;

const myComputeEnv = new batch.ComputeEnvironment(this, 'ComputeEnv', {
  computeResources: {
    launchTemplate: {
      launchTemplateId: myLaunchTemplate.ref as string,
    },
    vpc,
  },
  computeEnvironmentName: 'MyStorageCapableComputeEnvironment',
});
```

Note that if your launch template explicitly specifies network interfaces,
for example to use an Elastic Fabric Adapter, you must use those security groups rather
than allow the `ComputeEnvironment` to define them.  This is done by setting
`useNetworkInterfaceSecurityGroups` in the launch template property of the environment.
For example:

```ts
declare const vpc: ec2.Vpc;

const efaSecurityGroup = new ec2.SecurityGroup(this, 'EFASecurityGroup', {
  vpc,
});

const launchTemplateEFA = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
  launchTemplateName: 'LaunchTemplateName',
  launchTemplateData: {
    networkInterfaces: [{
      deviceIndex: 0,
      subnetId: vpc.privateSubnets[0].subnetId,
      interfaceType: 'efa',
      groups: [efaSecurityGroup.securityGroupId],
    }],
  },
});

const computeEnvironmentEFA = new batch.ComputeEnvironment(this, 'EFAComputeEnv', {
  managed: true,
  computeResources: {
    vpc,
    launchTemplate: {
      launchTemplateName: launchTemplateEFA.launchTemplateName as string,
      useNetworkInterfaceSecurityGroups: true,
    },
  },
});
```

### Importing an existing Compute Environment

To import an existing batch compute environment, call `ComputeEnvironment.fromComputeEnvironmentArn()`.

Below is an example:

```ts
const computeEnv = batch.ComputeEnvironment.fromComputeEnvironmentArn(this, 'imported-compute-env', 'arn:aws:batch:us-east-1:555555555555:compute-environment/My-Compute-Env');
```

### Change the baseline AMI of the compute resources

Occasionally, you will need to deviate from the default processing AMI.

ECS Optimized Amazon Linux 2 example:

```ts
declare const vpc: ec2.Vpc;
const myComputeEnv = new batch.ComputeEnvironment(this, 'ComputeEnv', {
  computeResources: {
    image: new ecs.EcsOptimizedAmi({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    }),
    vpc,
  }
});
```

Custom based AMI example:

```ts
declare const vpc: ec2.Vpc;
const myComputeEnv = new batch.ComputeEnvironment(this, 'ComputeEnv', {
  computeResources: {
    image: ec2.MachineImage.genericLinux({
      "[aws-region]": "[ami-ID]",
    }),
    vpc,
  }
});
```

## Job Queue

Jobs are always submitted to a specific queue. This means that you have to create a queue before you can start submitting jobs. Each queue is mapped to at least one (and no more than three) compute environment. When the job is scheduled for execution, AWS Batch will select the compute environment based on ordinal priority and available capacity in each environment.

```ts
declare const computeEnvironment: batch.ComputeEnvironment;
const jobQueue = new batch.JobQueue(this, 'JobQueue', {
  computeEnvironments: [
    {
      // Defines a collection of compute resources to handle assigned batch jobs
      computeEnvironment,
      // Order determines the allocation order for jobs (i.e. Lower means higher preference for job assignment)
      order: 1,
    },
  ],
});
```

### Priorty-Based Queue Example

Sometimes you might have jobs that are more important than others, and when submitted, should take precedence over the existing jobs. To achieve this, you can create a priority based execution strategy, by assigning each queue its own priority:

```ts
declare const sharedComputeEnvs: batch.ComputeEnvironment;
const highPrioQueue = new batch.JobQueue(this, 'JobQueue', {
  computeEnvironments: [{
    computeEnvironment: sharedComputeEnvs,
    order: 1,
  }],
  priority: 2,
});

const lowPrioQueue = new batch.JobQueue(this, 'JobQueue', {
  computeEnvironments: [{
    computeEnvironment: sharedComputeEnvs,
    order: 1,
  }],
  priority: 1,
});
```

By making sure to use the same compute environments between both job queues, we will give precedence to the `highPrioQueue` for the assigning of jobs to available compute environments.

### Importing an existing Job Queue

To import an existing batch job queue, call `JobQueue.fromJobQueueArn()`.

Below is an example:

```ts
const jobQueue = batch.JobQueue.fromJobQueueArn(this, 'imported-job-queue', 'arn:aws:batch:us-east-1:555555555555:job-queue/High-Prio-Queue');
```

## Job Definition

A Batch Job definition helps AWS Batch understand important details about how to run your application in the scope of a Batch Job. This involves key information like resource requirements, what containers to run, how the compute environment should be prepared, and more. Below is a simple example of how to create a job definition:

```ts
import * as ecr from 'aws-cdk-lib/aws-ecr';

const repo = ecr.Repository.fromRepositoryName(this, 'batch-job-repo', 'todo-list');

new batch.JobDefinition(this, 'batch-job-def-from-ecr', {
  container: {
    image: new ecs.EcrImage(repo, 'latest'),
  },
});
```

### Using a local Docker project

Below is an example of how you can create a Batch Job Definition from a local Docker application.

```ts
new batch.JobDefinition(this, 'batch-job-def-from-local', {
  container: {
    // todo-list is a directory containing a Dockerfile to build the application
    image: ecs.ContainerImage.fromAsset('../todo-list'),
  },
});
```

### Providing custom log configuration

You can provide custom log driver and its configuration for the container.

```ts
import * as ssm from 'aws-cdk-lib/aws-ssm';

new batch.JobDefinition(this, 'job-def', {
  container: {
    image: ecs.EcrImage.fromRegistry('docker/whalesay'),
    logConfiguration: {
      logDriver: batch.LogDriver.AWSLOGS,
      options: { 'awslogs-region': 'us-east-1' },
      secretOptions: [
        batch.ExposedSecret.fromParametersStore('xyz', ssm.StringParameter.fromStringParameterName(this, 'parameter', 'xyz')),
      ],
    },
  },
});
```

### Using the secret on secrets manager

You can set the environment variables from secrets manager.

```ts
const dbSecret = new secretsmanager.Secret(this, 'secret');

new batch.JobDefinition(this, 'batch-job-def-secrets', {
  container: {
    image: ecs.EcrImage.fromRegistry('docker/whalesay'),
    secrets: {
      PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
    },
  },
});
```

It is common practice to invoke other AWS services from within AWS Batch jobs (e.g. using the AWS SDK). For this reason, the AWS_ACCOUNT and AWS_REGION environments are always provided by default to the JobDefinition construct with the values inferred from the current context. You can always overwrite them by setting these environment variables explicitly though.

### Importing an existing Job Definition

#### From ARN

To import an existing batch job definition from its ARN, call `JobDefinition.fromJobDefinitionArn()`.

Below is an example:

```ts
const job = batch.JobDefinition.fromJobDefinitionArn(this, 'imported-job-definition', 'arn:aws:batch:us-east-1:555555555555:job-definition/my-job-definition');
```

#### From Name

To import an existing batch job definition from its name, call `JobDefinition.fromJobDefinitionName()`.
If name is specified without a revision then the latest active revision is used.

Below is an example:

```ts
// Without revision
const job1 = batch.JobDefinition.fromJobDefinitionName(this, 'imported-job-definition', 'my-job-definition');

// With revision
const job2 = batch.JobDefinition.fromJobDefinitionName(this, 'imported-job-definition', 'my-job-definition:3');
```
