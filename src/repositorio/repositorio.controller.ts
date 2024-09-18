import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { RepositorioService } from './repositorio.service';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { PaginacionDto } from 'src/common/dtos/paginacion.dto';

@Controller('repositorio')
export class RepositorioController {
  constructor(private readonly repositorioService: RepositorioService) {}

  @Post()
  create(@Body() createRepositorioDto: CreateRepositorioDto) {
    return this.repositorioService.create(createRepositorioDto);
  }

  @Get()
  findAll( @Query() paginacionDto: PaginacionDto) {
    // console.log(paginacionDto);
    return this.repositorioService.findAll( paginacionDto );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repositorioService.findOnePlain(id);
  }

  // @Get(':id')
  // findOne(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.repositorioService.findOne(id);
  // }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateRepositorioDto: UpdateRepositorioDto
  ) {
    return this.repositorioService.update( id, updateRepositorioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.repositorioService.remove(id);
  }
}
