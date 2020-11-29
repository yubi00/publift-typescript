import { IFileData } from '../interfaces/data';

export const groupBy = <T extends IFileData, K>(
  objectArray: T[],
  property: K
): any[] => {
  return [
    ...Object.values(
      objectArray.reduce(function (acc: any, obj: T | any) {
        let key: any = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {})
    )
  ];
};

export const avg = (sum: number, count: number): number => {
  return Math.floor(sum / count);
};

export const ratio = (num_1: number, num_2: number): string => {
  for (let num: number = num_2; num > 1; num--) {
    if (num_1 % num == 0 && num_2 % num == 0) {
      num_1 = num_1 / num;
      num_2 = num_2 / num;
    }
  }
  return `${num_1}:${num_2}`;
};
