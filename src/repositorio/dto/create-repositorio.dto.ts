import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateRepositorioDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @MinLength(1)
    docente: string;
    
    @IsString()
    @MinLength(1)
    materia: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    seccion?: number; //lo puedo crear

    @IsString()
    @IsOptional()
    anotacion?: string; //lo puedo crear

    @IsString()
    @IsOptional()
    comentario?: string //lo puedo crear
    
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    archivoComprimido?: string[] //lo puedo crear

    @IsString()
    @IsOptional()
    cu?: string;

    @IsIn(['tarea','proyecto','clase','asesoria'])
    tt: string;

}
