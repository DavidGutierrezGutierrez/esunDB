import { Module } from '@nestjs/common';
import { RepositorioService } from './repositorio.service';
import { RepositorioController } from './repositorio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repositorio,RepositorioArchivo } from './entities/index';

@Module({
  controllers: [RepositorioController],
  providers: [RepositorioService],
  imports: [
    TypeOrmModule.forFeature([ Repositorio, RepositorioArchivo ])
  ],
  exports: [
    RepositorioService,
    TypeOrmModule,
  ],
})
export class RepositorioModule {}
