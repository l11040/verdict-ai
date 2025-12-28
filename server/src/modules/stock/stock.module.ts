import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from '../../entities/stock.entity';
import { StockInfo } from '../../entities/stock-info.entity';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockRepository } from './repositories/stock.repository';
import { StockInfoRepository } from './repositories/stock-info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, StockInfo])],
  providers: [StockService, StockRepository, StockInfoRepository],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
