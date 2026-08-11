# Core - Sistema CRUD e Utilitários Reutilizáveis

Este diretório contém implementações reutilizáveis de operações CRUD, formatação de IDs, processamento de mídias e outros recursos que podem ser utilizados por todos os módulos da aplicação.

## Estrutura

```
core/
├── base/                       # Sistema CRUD Avançado
│   ├── interfaces/            # Interfaces base
│   ├── implementations/       # Implementações concretas
│   ├── decorators/           # Decoradores para facilitar o uso
│   └── utils/                # Utilitários relacionados a CRUD
│
├── storage/                    # Sistema de Armazenamento
│   ├── interfaces/            # Contratos para armazenamento
│   ├── implementations/       # Implementações (local, etc)
│   └── decorators/           # Decoradores para uploads
│
├── core.module.ts             # Módulo principal que exporta recursos
└── index.ts                   # Arquivo barril para facilitar importações
```

## Como Usar

### 1. Criando um Novo Módulo com CRUD

Para criar um novo módulo com CRUD completo, siga os passos:

1. Defina o Schema do Mongoose
2. Crie DTOs para criação e atualização
3. Estenda as classes base para Repository, Service e Controller

Exemplo:

**1. Schema (exemplo para Produtos)**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  preco: number;

  @Prop()
  descricao: string;

  @Prop({ type: String })
  imagem: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

**2. DTOs**

```typescript
// create-product.dto.ts
export class CreateProductDto {
  nome: string;
  preco: number;
  descricao?: string;
  imagem?: string;
}

// update-product.dto.ts
export class UpdateProductDto {
  nome?: string;
  preco?: number;
  descricao?: string;
  imagem?: string;
}
```

**3. Repository**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryImpl } from '../../core/base/implementations/base.repository';
import { Product } from '../schemas/product.schema';

@Injectable()
export class ProductsRepository extends BaseRepositoryImpl<Product> {
  constructor(
    @InjectModel(Product.name) productModel: Model<Product>,
  ) {
    super(productModel, 'Product');
  }
}
```

**4. Service**

```typescript
import { Injectable } from '@nestjs/common';
import { BaseServiceImpl } from '../../core/base/implementations/base.service';
import { Product } from '../schemas/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class ProductsService extends BaseServiceImpl<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(repository: ProductsRepository) {
    super(repository, 'Product');
  }
}
```

**5. Controller**

```typescript
import { Controller } from '@nestjs/common';
import { BaseController } from '../../core/base/implementations/base.controller';
import { Product } from '../schemas/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController extends BaseController<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(service: ProductsService) {
    super(service, 'Product');
  }
}
```

**6. Módulo**

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ProductsRepository } from './repositories/products.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### 2. Usando o Sistema de Upload

**Exemplo de uso com imagem de produto:**

```typescript
import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProcessUpload, ProcessedUpload } from '../../core/storage/decorators/upload.decorator';
import { StorageService } from '../../core/storage/interfaces/storage.interface';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject('StorageService') private readonly storageService: StorageService,
  ) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @ProcessUpload({ field: 'imagem' }) upload: ProcessedUpload,
  ) {
    // Se houver upload de imagem
    if (upload) {
      // Salvar imagem e obter URL
      const imageUrl = await this.storageService.saveBase64(
        upload.data,
        `products/${Date.now()}.jpg`,
      );
      
      // Atualizar DTO com a URL da imagem
      createProductDto.imagem = imageUrl;
    }
    
    // Criar produto
    return await this.productsService.create(createProductDto);
  }
}
```

### 3. Usando o QueryBuilder para Filtros Avançados

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { QueryBuilder } from '../../core/base/utils/query.builder';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  async search(@Query() query) {
    // Construir filtro a partir dos parâmetros da URL
    const filter = QueryBuilder.buildFilter(query);
    
    // Exemplo: /products/search?nome__contains=celular&preco__lte=1000
    // Vai buscar produtos com nome contendo "celular" e preço <= 1000
    
    return await this.productsService.findAll(filter);
  }
}
```

### 4. Usando o ResponseBuilder para Padronizar Respostas

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ResponseBuilder } from '../../core/base/utils/response.builder';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const filter = {};
    const options = { 
      skip: (page - 1) * limit,
      limit: limit 
    };
    
    const [data, total] = await Promise.all([
      this.productsService.findAll(filter, options),
      this.productsService.count(filter),
    ]);
    
    // Retorna resposta paginada padronizada
    return ResponseBuilder.paginated(data, total, page, limit);
  }
}
```

## Formatação de IDs

O sistema usa o `IdFormatter` para garantir que todos os IDs sejam manipulados de forma consistente:

```typescript
import { IdFormatter } from '../config/id-formatter.config';

// Verificar se um ID é válido
if (IdFormatter.isValid(id)) {
  // Converter string para ObjectId
  const objectId = IdFormatter.toObjectId(id);
  
  // Converter ObjectId para string
  const idString = IdFormatter.format(objectId);
}
```

## Processamento de Mídia

O sistema inclui funcionalidades para processar e otimizar imagens, vídeos e áudio:

```typescript
import { processMedia, validateMedia } from '../config/uploads.config';

// Validar se o formato é suportado
const validation = validateMedia(base64String);
if (validation.isValid) {
  // Processar e otimizar a mídia
  const processedData = await processMedia(base64String);
}
``` 