import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StockService } from './stock.service';
import { FetchStockResponseDto } from './dto/fetch-stock-response.dto';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private stockService: StockService) {}

  @Post(':symbol/fetch')
  @ApiOperation({
    summary: '주식 데이터 가져오기',
    description:
      '주식 시세 데이터와 기본 정보를 함께 가져와서 DB에 저장합니다.',
  })
  @ApiParam({
    name: 'symbol',
    description: '주식 심볼 (예: AAPL, TSLA)',
    example: 'AAPL',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description:
      '시작 날짜 (YYYY-MM-DD 형식). 지정하지 않으면 오늘 기준 1년 전',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: '종료 날짜 (YYYY-MM-DD 형식). 지정하지 않으면 오늘',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: '데이터 가져오기 성공',
    schema: {
      example: {
        success: true,
        message:
          '주식 데이터를 성공적으로 가져왔습니다. 250개의 새로운 데이터가 저장되었습니다.',
        savedCount: 250,
        stockInfo: {
          symbol: 'AAPL',
          longName: 'Apple Inc.',
          marketCap: 3000000000000,
          sector: 'Technology',
          industry: 'Consumer Electronics',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (유효하지 않은 심볼, 날짜 형식 오류 등)',
    schema: {
      example: {
        statusCode: 400,
        message: '시작 날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)',
        error: 'Bad Request',
      },
    },
  })
  async fetchStockData(
    @Param('symbol') symbol: string,
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    if (!symbol || symbol.trim().length === 0) {
      throw new BadRequestException('주식 심볼이 필요합니다.');
    }

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    // 날짜 파싱
    if (startDateStr) {
      startDate = new Date(startDateStr);
      if (isNaN(startDate.getTime())) {
        throw new BadRequestException(
          '시작 날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)',
        );
      }
    }

    if (endDateStr) {
      endDate = new Date(endDateStr);
      if (isNaN(endDate.getTime())) {
        throw new BadRequestException(
          '종료 날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)',
        );
      }
    }

    const { savedCount, stockInfo } =
      await this.stockService.fetchAndSaveStockDataWithInfo(
        symbol.toUpperCase(),
        startDate,
        endDate,
      );

    const response: any = {
      success: true,
      message:
        savedCount > 0
          ? `주식 데이터를 성공적으로 가져왔습니다. ${savedCount}개의 새로운 데이터가 저장되었습니다.`
          : '요청한 기간의 데이터가 이미 모두 존재합니다.',
      savedCount,
    };

    // 기본 정보가 있으면 포함
    if (stockInfo) {
      response.stockInfo = stockInfo;
    }

    return response as FetchStockResponseDto;
  }

  @Get(':symbol/info')
  @ApiOperation({ summary: '주식 기본 정보 조회' })
  @ApiParam({
    name: 'symbol',
    description: '주식 심볼 (예: AAPL, TSLA)',
    example: 'AAPL',
  })
  @ApiResponse({
    status: 200,
    description: '주식 기본 정보 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '주식 정보를 찾을 수 없음',
  })
  async getStockInfo(@Param('symbol') symbol: string) {
    if (!symbol || symbol.trim().length === 0) {
      throw new BadRequestException('주식 심볼이 필요합니다.');
    }

    const stockInfo = await this.stockService.getStockInfo(
      symbol.toUpperCase(),
    );

    if (!stockInfo) {
      throw new BadRequestException(
        `심볼 ${symbol}에 대한 정보를 찾을 수 없습니다.`,
      );
    }

    return stockInfo;
  }

  @Post(':symbol/info/fetch')
  @ApiOperation({ summary: '주식 기본 정보 가져오기' })
  @ApiParam({
    name: 'symbol',
    description: '주식 심볼 (예: AAPL, TSLA)',
    example: 'AAPL',
  })
  @ApiResponse({
    status: 200,
    description: '주식 기본 정보 가져오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (유효하지 않은 심볼 등)',
  })
  async fetchStockInfo(@Param('symbol') symbol: string) {
    if (!symbol || symbol.trim().length === 0) {
      throw new BadRequestException('주식 심볼이 필요합니다.');
    }

    const stockInfo = await this.stockService.fetchAndSaveStockInfo(
      symbol.toUpperCase(),
    );

    return {
      success: true,
      message: '주식 기본 정보를 성공적으로 가져왔습니다.',
      data: stockInfo,
    };
  }
}
