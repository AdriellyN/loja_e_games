import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "../entities/usuario.entity";
import { ILike, Repository } from "typeorm";
import { Bcrypt } from "../../auth/bcrypt/bcrypt";
import { differenceInYears, parseISO } from "date-fns";



@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) { }

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find();
    };

    async findById(id: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: {
                id
            }
        });
        if (!usuario)
            throw new HttpException(
                'Usuário não encontrado!', HttpStatus.NOT_FOUND);

        return usuario;
    };

    async findByNome(nome: string): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            where: {
                nome: ILike(`%${nome}%`),
            }
        })
    };

    // Método auxiliar para calcular idade do usuário.
    async findByUsuario(usuario: string): Promise<Usuario | undefined> {
        return await this.usuarioRepository.findOne({
            where: {
                usuario: usuario
            },
        });
    };

    async calcularIdade(dataNascimento: string): Promise<number> {
        const dataNasc = parseISO(dataNascimento);
        let idade = differenceInYears(new Date(), dataNasc);
        return idade;
    }

    async create(usuario: Usuario): Promise<Usuario> {
        const idadeUsuario = await this.calcularIdade(usuario.dataNascimento)

        if (idadeUsuario < 18) {
            throw new HttpException("Você deve ter 18 anos ou mais para realizar o cadastro!", HttpStatus.FORBIDDEN)
        } else {
            const buscaUsuario = await this.findByUsuario(usuario.usuario)
            if (buscaUsuario)
                throw new HttpException("O Usuário já existe!", HttpStatus.BAD_REQUEST)
            usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        }
        return await this.usuarioRepository.save(usuario);
    }

    async update(usuario: Usuario): Promise<Usuario> {

        await this.findById(usuario.id);

        const buscaUsuario = await this.findByUsuario(usuario.usuario)

        if (buscaUsuario && buscaUsuario.id !== usuario.id)
            throw new HttpException("Usuário (email) já cadastrado!", HttpStatus.BAD_REQUEST)
        
        const idadeUsuario = await this.calcularIdade(usuario.dataNascimento)
        if (idadeUsuario < 18)
            throw new HttpException("Você deve ter 18 anos ou mais para realizar o cadastro!", HttpStatus.FORBIDDEN)
        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);

        return await this.usuarioRepository.save(usuario);
    }


}