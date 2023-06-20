import { Body, Controller, Get, Query, Post, Res } from '@nestjs/common';
import { OverseaService } from './oversea.service';
import { Response } from 'express';
import CONFIG from '../../config';
import { getToday } from 'src/common/util/dateUtils';

@Controller('oversea')
export class OverseaController {
  constructor(private readonly oversea: OverseaService) {}

  @Get('test')
  async test(@Res() res: Response, @Query() params: any) {
    try {
      const resData = await this.oversea.list({
        period: '0',
        avlsScal: '0',
      });
      res.status(200).send(resData);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  @Get('list')
  async list(
    @Res() res: Response,
    @Query('period') period: string,
    @Query('avlsScal') avlsScal: string,
  ) {
    try {
      const resData = await this.oversea.list({
        period,
        avlsScal,
      });
      res.status(200).send(resData);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  @Get('price-by-period')
  async detail(
    @Res() res: Response,
    @Query('EXCD') EXCD: string,
    @Query('종목코드') 종목코드: string,
    @Query('기간분류코드') 기간분류코드: string,
    @Query('period') period: string | number,
  ) {
    function checkInputValidation(): boolean {
      EXCD = EXCD ? EXCD : 'NAS';
      if ([종목코드].includes(undefined)) {
        return false;
      }
      기간분류코드 = 기간분류코드 ? 기간분류코드.toUpperCase() : 'D';
      if (!['D', 'W', 'M'].includes(기간분류코드)) {
        return false;
      }
      period = period
        ? parseInt(period as string)
        : CONFIG.KIS.urls.해외주식_기간별시세.defaultLength;
      if (Number.isNaN(period)) {
        return false;
      }
      return true;
    }
    if (checkInputValidation()) {
      this.oversea
        .getDetail({
          EXCD,
          종목코드,
          기간분류코드,
          period,
        })
        .then((e) => {
          const { status, data } = e as any;
          res.status(status).send(data);
        })
        .catch((e) => {
          const { status, data } = e;
          res.status(status).send(data);
        });
    } else {
      res.status(500).send({ err: '잘못된 인자' });
    }
  }
}
