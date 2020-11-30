import { Request, Response, Router } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { getData } from '../utils/getData';
import { groupBy, avg, ratio } from '../utils/queries';
import { formatDate } from '../utils/dates';
import {
  StoreType,
  FileDataResponse,
  CreateFileDataResponse,
  PageViewsResponse,
  UserSessionsRatioResponse,
  WeeklyMaxSessionsResponse
} from '../interfaces/data';

export const store: StoreType = {};

const router: Router = Router();

const upload: multer.Multer = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb: multer.FileFilterCallback | any): void {
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error('Please upload a csv file'));
    }
    cb(undefined, true);
  }
});

router.post('/api', (req, res) => {
  res.send(req.body.name);
});

router.post(
  '/api/uploads',
  upload.single('file'),
  (req: Request, res: CreateFileDataResponse) => {
    try {
      const id = uuid();
      if (!store[id]) {
        store[id] = req.file.buffer;
      }
      res.status(200).send({
        status: true,
        data: {
          id,
          file: req.file.buffer
        }
      });
    } catch (error) {
      res.status(400).send({
        status: false,
        error: 'Couldnot upload file'
      });
    }
  }
);

router.get('/api/pageviews', async (req: Request, res: PageViewsResponse) => {
  try {
    const files = Object.keys(store);
    const data = await getData(store[files[0]]);

    const dataByDate = groupBy(data, 'Date');

    const avgPageViewByDate = dataByDate.map((data) => {
      const sum = data.reduce(
        (sum: number, curr: any) => sum + parseInt(curr.Pageviews),
        0
      );
      return {
        Date: data[0].Date,
        AveragePageViews: avg(sum, data.length)
      };
    });

    res.status(200).send({
      status: true,
      data: avgPageViewByDate
    });
  } catch (err) {
    res.status(404).send({ status: false, error: err.message });
  }
});

router.get(
  '/api/userssessionsratio',
  async (req: Request, res: UserSessionsRatioResponse) => {
    try {
      const files = Object.keys(store);
      const data = await getData(store[files[0]]);
      const dataByDate = groupBy(data, 'Date');

      const usersSessionsRatio = dataByDate.map((data) => {
        const users = data.reduce(
          (sum: number, curr: any) => sum + parseInt(curr.Users),
          0
        );
        const sessions = data.reduce(
          (sum: number, curr: any) => sum + parseInt(curr.Sessions),
          0
        );

        return {
          Date: data[0].Date,
          Users: users,
          Sessions: sessions,
          UsersSessionsRatio: ratio(users, sessions)
        };
      });

      res.status(200).send({
        status: true,
        data: usersSessionsRatio
      });
    } catch (err) {
      res.status(404).send({ status: false, error: err.message });
    }
  }
);

router.get(
  '/api/weeklymaxsessions',
  async (req: Request, res: WeeklyMaxSessionsResponse) => {
    try {
      const files = Object.keys(store);
      const data = await getData(store[files[0]]);
      const dataByTrafficType = groupBy(data, 'Traffic Type');

      const result = dataByTrafficType.map((data) => {
        return data.map((subdata: any) => {
          return {
            Date: subdata.Date,
            TrafficType: subdata['Traffic Type'],
            Sessions: subdata.Sessions,
            WeekNumber: moment(formatDate(subdata.Date)).isoWeekday(0).isoWeek() //Sunday as the first day of the week by setting 0
          };
        });
      });

      const groupedbyWeekNo = result.map((data) => {
        const groupedData = groupBy(data, 'WeekNumber');
        return groupedData;
      });

      const weeklyMaxSessions = groupedbyWeekNo.map((data) => {
        return {
          TrafficType: data[0][0].TrafficType,
          MaxSessionsWeekly: data.map((subdata: any) => {
            return {
              WeekNumber: subdata[0].WeekNumber,
              maxSessions: Math.max.apply(
                Math,
                subdata.map(function (o: any) {
                  return o.Sessions;
                })
              )
            };
          })
        };
      });

      res.status(200).send({
        status: true,
        data: weeklyMaxSessions
      });
    } catch (err) {
      res.status(404).send({ status: false, error: err.message });
    }
  }
);

router.get('/api/:id', async (req: Request, res: FileDataResponse) => {
  const id = req.params.id;
  const files = Object.keys(store);
  try {
    if (files.length === 0) throw new Error('No files yet');

    const fileExist = files.some((file) => file === id);
    if (!fileExist) throw new Error('file doesnot exist');

    const data = await getData(store[id]);

    res.status(200).send({
      status: true,
      data
    });
  } catch (err) {
    res.status(404).send({ status: false, error: err.message });
  }
});

router.get('*', (req: Request, res: Response) => {
  res.status(404).send({
    status: false,
    error: 'Error 404 Page not found'
  });
});

export default router;
