import { Body, Controller, Get, Query, Post, Res } from '@nestjs/common';
import { OverseaService } from './oversea.service';
import { Response } from 'express';

@Controller('oversea')
export class OverseaController {
  constructor(private readonly oversea: OverseaService) {}

  @Get('test')
  async test(@Res() res: Response, @Query() params: any) {
    this.oversea
      .getList1(params)
      .then((e: { status; data }) => {
        const { status, data } = e;
        res.status(status).send(data);
      })
      .catch((e: { status; data }) => {
        const { status, data } = e;
        res.status(status).send(data);
      });
  }

  @Get('test2')
  async test2(@Res() res: Response, @Query() params: any) {
    this.oversea
      .HHDFS76240000(
        {
          SYMB: 'SE',
        } as any,
        105,
      )
      .then((e: { status; data }) => console.log(e.data));
  }

  @Get('service1_1')
  async service1_1(
    @Res() res: Response,
    @Query('datelength') datelength: string,
    @Query('target') target: 'UP' | 'DOWN',
    @Query('temp') temp: string,
  ) {
    this.oversea
      .service1_1(parseInt(datelength), target, parseInt(temp))
      .then((e: { status; data }) => {
        const { status, data } = e;
        res.status(status).send(data);
      })
      .catch((e: { status; data }) => {
        const { status, data } = e;
        res.status(status).send(data);
      });
  }
}
