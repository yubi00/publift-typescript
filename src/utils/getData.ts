import csvToJson from 'csvtojson';
import { IFileData } from '../interfaces/data';

export const getData = async (file: Buffer): Promise<IFileData[]> => {
  if (!file) throw new Error('No data found');
  const data: IFileData[] = await csvToJson().fromString(file.toString());
  return data;
};
