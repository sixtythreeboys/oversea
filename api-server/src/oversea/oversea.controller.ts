import { Body, Controller, Get, Query, Post, Res } from '@nestjs/common';
import { OverseaService } from './oversea.service';
import { Response } from 'express';
import CONFIG from '../../config';

@Controller('oversea')
export class OverseaController {
  constructor(private readonly oversea: OverseaService) {}

  @Get('test')
  async test(@Res() res: Response, @Query() params: any) {
    try {
      //APIS.HHDFS76200200({ SYMB: 'AAPL' });
      res.status(200).send(true);
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
        period: period ?? 0,
        avlsScal: avlsScal ?? 0,
      });
      res.status(200).send(resData);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  @Get('pirce-by-period')
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
      period =
        period || period === 0
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
          const data = e as any;
          res.status(200).send(data);
        })
        .catch((e) => {
          const data = e;
          res.status(500).send(data);
        });
    } else {
      res.status(500).send({ err: '잘못된 인자' });
    }
  }
}
