export const IGNORE_LIST = ['//'];

export function filterAffectedPackages(
  affectedPackages: TurboAffectedPackages,
  filterPath?: string,
): ChangedPackage[] {
  return affectedPackages.tasks
    .filter(
      (task) =>
        !IGNORE_LIST.includes(task.package) &&
        task.directory.includes(filterPath ?? ''),
    )
    .map((task) => ({
      packageName: task.package,
      directory: task.directory,
      dockerRepository: task.directory.split('/').pop() ?? '',
    }));
}
