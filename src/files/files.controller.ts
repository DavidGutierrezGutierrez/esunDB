import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('repositorio')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { filesize: 1000 },
    storage: diskStorage({
      destination: './static/uploads'
    })
  }) )
  uploadRepositorioFile( 
    @UploadedFile() file: Express.Multer.File 
  ){

    //siguientes lineas identificaran si no viene el archivo entonces mandará una excepción
    if (!file){
      throw new BadRequestException('Asegurate de que el archivo sea un archivo comprimido');
    }

    return {
      fileName: file.originalname
    };
  }
  
}
