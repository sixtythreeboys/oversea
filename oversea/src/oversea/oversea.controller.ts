import { Body, Controller, Get, Query, Post, Res } from '@nestjs/common';
import { OverseaService } from './oversea.service';
import { Response } from 'express';

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

  @Get('list')
  async list(
    @Res() res: Response,
    @Query('period') period: string,
    @Query('gradient') gradient: '1' | '-1',
  ) {
    this.oversea
      .service1_1(parseInt(period), gradient)
      .then((e: { status; data }) => {
        const { status, data } = e;
        res.status(status).send(data);
      })
      .catch((e: { status; data }) => {
        const { status, data } = e;
        res.status(status).send(data);
      });
  }
  @Get('detail')
  async detail(
    @Res() res: Response,
    @Query('tr_key') tr_key: string,
    @Query('period') period: string,
  ) {
    this.oversea
      .getDetail(tr_key, parseInt(period))
      .then((e) => {
        const { status, data } = e;
        res.status(status).send(data);
      })
      .catch((e) => {
        const { status, data } = e;
        res.status(status).send(data);
      });
  }
}
