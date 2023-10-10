import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface VpcProps {}

export class Vpc extends Construct {
  readonly vpc: cdk.aws_ec2.IVpc;

  constructor(scope: Construct, id: string, props?: VpcProps) {
    super(scope, id);

    this.vpc = new cdk.aws_ec2.Vpc(this, "Default", {
      ipAddresses: cdk.aws_ec2.IpAddresses.cidr("10.10.10.0/24"),
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
          cidrMask: 27,
          mapPublicIpOnLaunch: true,
        },
      ],
      gatewayEndpoints: {
        S3: {
          service: cdk.aws_ec2.GatewayVpcEndpointAwsService.S3,
        },
      },
    });

    const instanceConnectEndpointSg = new cdk.aws_ec2.SecurityGroup(
      this,
      "InstanceConnectEndpointSg",
      {
        vpc: this.vpc,
      }
    );
    new cdk.aws_ec2.CfnInstanceConnectEndpoint(
      this,
      "InstanceConnectEndpoint",
      {
        subnetId: this.vpc.publicSubnets[0].subnetId,
        securityGroupIds: [instanceConnectEndpointSg.securityGroupId],
      }
    );
  }
}
