import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginacionDto {

    @IsOptional()
    @IsPositive()
    @Type( () => Number )
    limite_entidades?: number;
    
    @IsOptional()
    @Min(0)
    @Type( () => Number )
    pagina?: number;
}