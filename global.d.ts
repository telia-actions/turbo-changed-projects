interface TurboAffectedPackages {
  packages: string[];
  tasks: Array<{
    taskId: string;
    task: string;
    package: string;
    hash: string;
    command: string;
    outputs: string[];
    logFile: string;
    directory: string;
    dependencies: string[];
    dependents: string[];
  }>;
}

interface ChangedPackage {
  packageName: string;
  directory: string;
  dockerRepository: string;
}
