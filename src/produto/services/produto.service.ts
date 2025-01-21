import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { CategoriaService } from "../../categoria/services/categoria.service";
import { Produto } from "../entities/produto.entity";



@Injectable()
export class ProdutoService {

    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private categoriaService: CategoriaService
    ) { }

    async findAll(): Promise<Produto[]> {
        return this.produtoRepository.find({
            relations: {
                categoria: true
            }
        });
    }

    async findById(id: number): Promise<Produto> {

        const produto = await this.produtoRepository.findOne({
            where: {
                id
            },
            relations: {
                categoria: true
            }
        })

        if (!produto) {
            throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND)
        }
        return produto;

    }



    async listPrecoCrescente(minPreco: number): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: {
                preco: MoreThanOrEqual(minPreco)
            },
            order: {
                preco: 'ASC'
            }
        });
    }

    async listPrecoDecrescente(minPreco: number): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: {
                preco: LessThanOrEqual(minPreco)
            },
            order: {
                preco: 'DESC'
            }
        });
    }



    async findByNome(nome: string): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: {
                nome: ILike(`%${nome}%`)
            },
            relations: {
                categoria: true
            }
        });
    }

    async create(produto: Produto): Promise<Produto> {

        await this.categoriaService.findById(produto.categoria.id)

        return await this.produtoRepository.save(produto);
    }

    async update(produto: Produto): Promise<Produto> {

        await this.findById(produto.id)

        await this.categoriaService.findById(produto.categoria.id)

        return await this.produtoRepository.save(produto);
    }

    async delete(id: number): Promise<DeleteResult> {

        await this.findById(id)

        return await this.produtoRepository.delete(id)
    }
}