import { Body, Controller, Get, Query, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('api')
export class APIController {
  constructor() {}

  @Get('test')
  async test(@Res() res: Response, @Query() params: any) {
    try {
      res.status(200).send(true);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  @Get('HHDFS76240000')
  async detail(
    @Res() res: Response,
    @Query('EXCD') EXCD: string,
    @Query('종목코드') 종목코드: string,
    @Query('기간분류코드') 기간분류코드: string,
    @Query('period') period: string | number,
  ) {}
}
