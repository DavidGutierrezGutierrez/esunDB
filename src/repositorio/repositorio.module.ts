import { Module } from '@nestjs/common';
import { RepositorioService } from './repositorio.service';
import { RepositorioController } from './repositorio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repositorio } from './entities/repositorio.entity';

@Module({
  controllers: [RepositorioController],
  providers: [RepositorioService],
  imports: [
    TypeOrmModule.forFeature([ Repositorio ])
  ]
})
export class RepositorioModule {}
