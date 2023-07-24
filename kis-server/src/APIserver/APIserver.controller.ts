import { Body, Controller, Get, Query, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { KISApiService } from 'src/KIS/KIS.API.service';
import { HHDFS76240000 } from 'src/KIS/KIS.type';
import CONFIG from 'config';

@Controller('api')
export class APIController {
  constructor(private readonly apiService: KISApiService) {}

  @Get('test')
  async test(@Res() res: Response, @Query() params: any) {
    try {
      res.status(200).send(true);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  @Post('HHDFS76240000')
  async HHDFS76240000(
    @Res() res: Response,
    @Body('params') params: object,
    @Body('period') period: number,
  ) {
    try {
      period =
        period && period !== 0
          ? period
          : CONFIG.KIS.urls.해외주식_기간별시세.defaultLength;
      const data = await this.apiService.HHDFS76240000(
        params as HHDFS76240000,
        period,
      );
      res.status(200).send(data);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}
