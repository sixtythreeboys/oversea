import { Body, Controller, Get, Query, Post, Res } from '@nestjs/common';
import { OverseaService } from './oversea.service';
import { Response } from 'express';
import CONFIG from '../../config';
import { enqueue } from 'src/common/util/delayingQueue';

@Controller('oversea')
export class OverseaController {
  constructor(private readonly oversea: OverseaService) {}

  @Get('test')
  async test(@Res() res: Response, @Query() params: any) {
    console.log('this is test');
    for (let i = 1; i < 1000; i++) {
      enqueue(() => {
        console.log(i);
      });
    }
    res.send('test');
  }
  @Get('test2')
  async test2(@Res() res: Response, @Query() params: any) {
    res.send('datas');
  }

  @Get('list')
  async list(
    @Res() res: Response,
    @Query('period') period: string,
    @Query('avlsScal') avlsScal: string,
  ) {
    this.oversea
      .list_v1(parseInt(period), parseInt(avlsScal))
      .then((e: { status; data }) => {
        const { status, data } = e;
        res.status(status).send(data);
      })
      .catch((e: { status; data }) => {
        const { status, data } = e;
        res.status(status).send(data);
      });
  }

  @Get('list2')
  async list2(
    @Res() res: Response,
    @Query('period') period: string,
    @Query('avlsScal') avlsScal: string,
  ) {
    this.oversea.list_v2(parseInt(period), parseInt(avlsScal));
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
        .getDetail_v1({
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
