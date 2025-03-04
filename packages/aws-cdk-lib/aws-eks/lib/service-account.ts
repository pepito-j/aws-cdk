import { AddToPrincipalPolicyResult, IPrincipal, IRole, OpenIdConnectPrincipal, PolicyStatement, PrincipalPolicyFragment, Role } from '../../aws-iam';
import { CfnJson, Names } from '../../core';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { KubernetesManifest } from './k8s-manifest';

/**
 * Options for `ServiceAccount`
 */
export interface ServiceAccountOptions {
  /**
   * The name of the service account.
   *
   * The name of a ServiceAccount object must be a valid DNS subdomain name.
   * https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
   * @default - If no name is given, it will use the id of the resource.
   */
  readonly name?: string;

  /**
   * The namespace of the service account.
   *
   * All namespace names must be valid RFC 1123 DNS labels.
   * https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#namespaces-and-dns
   * @default "default"
   */
  readonly namespace?: string;

  /**
   * Additional annotations of the service account.
   *
   * @default - no additional annotations
   */
  readonly annotations?: {[key:string]: string};

  /**
   * Additional labels of the service account.
   *
   * @default - no additional labels
   */
  readonly labels?: {[key:string]: string};
}

/**
 * Properties for defining service accounts
 */
export interface ServiceAccountProps extends ServiceAccountOptions {
  /**
   * The cluster to apply the patch to.
   */
  readonly cluster: ICluster;
}

/**
 * Service Account
 */
export class ServiceAccount extends Construct implements IPrincipal {
  /**
   * The role which is linked to the service account.
   */
  public readonly role: IRole;

  public readonly assumeRoleAction: string;
  public readonly grantPrincipal: IPrincipal;
  public readonly policyFragment: PrincipalPolicyFragment;

  /**
   * The name of the service account.
   */
  public readonly serviceAccountName: string;

  /**
   * The namespace where the service account is located in.
   */
  public readonly serviceAccountNamespace: string;

  constructor(scope: Construct, id: string, props: ServiceAccountProps) {
    super(scope, id);

    const { cluster } = props;
    this.serviceAccountName = props.name ?? Names.uniqueId(this).toLowerCase();
    this.serviceAccountNamespace = props.namespace ?? 'default';

    // From K8s docs: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
    if (!this.isValidDnsSubdomainName(this.serviceAccountName)) {
      throw RangeError('The name of a ServiceAccount object must be a valid DNS subdomain name.');
    }

    // From K8s docs: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#namespaces-and-dns
    if (!this.isValidDnsLabelName(this.serviceAccountNamespace)) {
      throw RangeError('All namespace names must be valid RFC 1123 DNS labels.');
    }

    /* Add conditions to the role to improve security. This prevents other pods in the same namespace to assume the role.
    * See documentation: https://docs.aws.amazon.com/eks/latest/userguide/create-service-account-iam-policy-and-role.html
    */
    const conditions = new CfnJson(this, 'ConditionJson', {
      value: {
        [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:aud`]: 'sts.amazonaws.com',
        [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:sub`]: `system:serviceaccount:${this.serviceAccountNamespace}:${this.serviceAccountName}`,
      },
    });
    const principal = new OpenIdConnectPrincipal(cluster.openIdConnectProvider).withConditions({
      StringEquals: conditions,
    });
    this.role = new Role(this, 'Role', { assumedBy: principal });

    this.assumeRoleAction = this.role.assumeRoleAction;
    this.grantPrincipal = this.role.grantPrincipal;
    this.policyFragment = this.role.policyFragment;

    // Note that we cannot use `cluster.addManifest` here because that would create the manifest
    // constrct in the scope of the cluster stack, which might be a different stack than this one.
    // This means that the cluster stack would depend on this stack because of the role,
    // and since this stack inherintely depends on the cluster stack, we will have a circular dependency.
    new KubernetesManifest(this, `manifest-${id}ServiceAccountResource`, {
      cluster,
      manifest: [{
        apiVersion: 'v1',
        kind: 'ServiceAccount',
        metadata: {
          name: this.serviceAccountName,
          namespace: this.serviceAccountNamespace,
          labels: {
            'app.kubernetes.io/name': this.serviceAccountName,
            ...props.labels,
          },
          annotations: {
            'eks.amazonaws.com/role-arn': this.role.roleArn,
            ...props.annotations,
          },
        },
      }],
    });

  }

  /**
   * @deprecated use `addToPrincipalPolicy()`
   */
  public addToPolicy(statement: PolicyStatement): boolean {
    return this.addToPrincipalPolicy(statement).statementAdded;
  }

  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    return this.role.addToPrincipalPolicy(statement);
  }

  /**
   * If the value is a DNS subdomain name as defined in RFC 1123, from K8s docs.
   *
   * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
   */
  private isValidDnsSubdomainName(value: string): boolean {
    return value.length <= 253 && /^[a-z0-9]+[a-z0-9-.]*[a-z0-9]+$/.test(value);
  }

  /**
   * If the value follows DNS label standard as defined in RFC 1123, from K8s docs.
   *
   * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
   */
  private isValidDnsLabelName(value: string): boolean {
    return value.length <= 63 && /^[a-z0-9]+[a-z0-9-]*[a-z0-9]+$/.test(value);
  }
}
