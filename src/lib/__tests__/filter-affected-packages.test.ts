import { filterAffectedPackages } from '../filter-affected-packages';
const mockedAffectedPackages = require('../__mocks__/affected-packages.json');

describe('Find changed projects', () => {
  describe('findChangedProjects', () => {
    it('should return all changed packages without filterPath', () => {
      const result = filterAffectedPackages(mockedAffectedPackages);

      const expected: ChangedPackage[] = [
        {
          directory: 'packages/config',
          dockerRepository: 'config',
          packageName: '@toca/config',
        },
        {
          directory: 'apps/b2b-order-flow',
          dockerRepository: 'b2b-order-flow',
          packageName: '@toca/b2b-order-flow',
        },
        {
          directory: 'apps/b2x-login',
          dockerRepository: 'b2x-login',
          packageName: '@toca/b2x-login',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('should return changed packages by filterPath', () => {
      const result = filterAffectedPackages(mockedAffectedPackages, 'apps/');

      const expected: ChangedPackage[] = [
        {
          directory: 'apps/b2b-order-flow',
          dockerRepository: 'b2b-order-flow',
          packageName: '@toca/b2b-order-flow',
        },
        {
          directory: 'apps/b2x-login',
          dockerRepository: 'b2x-login',
          packageName: '@toca/b2x-login',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('should only return changed packages with specific path', () => {
      const result = filterAffectedPackages(
        mockedAffectedPackages,
        'apps/b2b-order-flow',
      );

      const expected: ChangedPackage[] = [
        {
          directory: 'apps/b2b-order-flow',
          dockerRepository: 'b2b-order-flow',
          packageName: '@toca/b2b-order-flow',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('should return an empty list if affectedPackages is empty', () => {
      const result = filterAffectedPackages(
        { packages: [], tasks: [] },
        'apps/b2b-order-flow',
      );

      expect(result).toEqual([]);
    });
  });
});
