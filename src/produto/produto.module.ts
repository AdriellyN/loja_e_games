import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriaModule } from "../categoria/categoria.module";
import { CategoriaService } from "../categoria/services/categoria.service";
import { ProdutoController } from "./controllers/produto.controller";
import { ProdutoService } from "./services/produto.service";
import { Produto } from "./entities/produto.entity";


@Module({ 
    imports: [TypeOrmModule.forFeature([Produto]), CategoriaModule], 
    controllers: [ProdutoController],
    providers: [ProdutoService, CategoriaService],
    exports: [TypeOrmModule]
})
export class ProdutoModule{}