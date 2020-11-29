import { Response } from 'express';

type TypedResponse<T> = Omit<Response, 'send' | 'json' | 'status'> & {
  send(data: T): TypedResponse<T>;
} & {
  json(data: T): TypedResponse<T>;
} & { status(code: number): TypedResponse<T> };

export interface IFileData {
  Date: string;
  Traffic_Type: string;
  Users: string;
  Sessions: string;
  Pages_Sessions: string;
  Avg: ISessionDuration;
  Pageviews: string;
}

export interface ISessionDuration {
  Session_Duration: string;
}

export interface IFileDataResponse {
  status: boolean;
  data?: IFileData[];
  error?: string;
}

export type FileDataResponse = TypedResponse<IFileDataResponse>;

export interface IUserSessionsRatio {
  Date: string;
  Users: number;
  Sessions: number;
  UsersSessionsRatio: string;
}

export interface IUserSessionsDataResponse {
  status: boolean;
  data?: IUserSessionsRatio[];
  error?: string;
}

export type UserSessionsRatioResponse = TypedResponse<IUserSessionsDataResponse>;

export interface IMaxSessions {
  WeekNumber: number;
  maxSessions: number;
}

export interface IWeeklyMaxSessions {
  TrafficType: string;
  MaxSessionsWeekly: IMaxSessions[];
}

export interface IWeeklyMaxSessionsResponse {
  status: boolean;
  data?: IWeeklyMaxSessions[];
  error?: string;
}

export type WeeklyMaxSessionsResponse = TypedResponse<IWeeklyMaxSessionsResponse>;

export interface IPageViews {
  Date: string;
  AveragePageViews: number;
}

export interface IPageViewsResponse {
  status: boolean;
  data?: IPageViews[];
  error?: string;
}

export type PageViewsResponse = TypedResponse<IPageViewsResponse>;

export interface IFile {
  id: string;
  file: Buffer;
}

export interface ICreateFileDataResponse {
  status: boolean;
  data?: IFile;
  error?: string;
}

export type CreateFileDataResponse = TypedResponse<ICreateFileDataResponse>;
