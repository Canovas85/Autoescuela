
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Profesor
 * 
 */
export type Profesor = $Result.DefaultSelection<Prisma.$ProfesorPayload>
/**
 * Model Alumno
 * 
 */
export type Alumno = $Result.DefaultSelection<Prisma.$AlumnoPayload>
/**
 * Model Vehiculo
 * 
 */
export type Vehiculo = $Result.DefaultSelection<Prisma.$VehiculoPayload>
/**
 * Model ClasePractica
 * 
 */
export type ClasePractica = $Result.DefaultSelection<Prisma.$ClasePracticaPayload>
/**
 * Model Examen
 * 
 */
export type Examen = $Result.DefaultSelection<Prisma.$ExamenPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Rol: {
  ADMIN: 'ADMIN',
  PROFESOR: 'PROFESOR',
  ALUMNO: 'ALUMNO'
};

export type Rol = (typeof Rol)[keyof typeof Rol]

}

export type Rol = $Enums.Rol

export const Rol: typeof $Enums.Rol

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Usuarios
 * const usuarios = await prisma.usuario.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Usuarios
   * const usuarios = await prisma.usuario.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profesor`: Exposes CRUD operations for the **Profesor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profesors
    * const profesors = await prisma.profesor.findMany()
    * ```
    */
  get profesor(): Prisma.ProfesorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.alumno`: Exposes CRUD operations for the **Alumno** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Alumnos
    * const alumnos = await prisma.alumno.findMany()
    * ```
    */
  get alumno(): Prisma.AlumnoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehiculo`: Exposes CRUD operations for the **Vehiculo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vehiculos
    * const vehiculos = await prisma.vehiculo.findMany()
    * ```
    */
  get vehiculo(): Prisma.VehiculoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clasePractica`: Exposes CRUD operations for the **ClasePractica** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClasePracticas
    * const clasePracticas = await prisma.clasePractica.findMany()
    * ```
    */
  get clasePractica(): Prisma.ClasePracticaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.examen`: Exposes CRUD operations for the **Examen** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Examen
    * const examen = await prisma.examen.findMany()
    * ```
    */
  get examen(): Prisma.ExamenDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Usuario: 'Usuario',
    Profesor: 'Profesor',
    Alumno: 'Alumno',
    Vehiculo: 'Vehiculo',
    ClasePractica: 'ClasePractica',
    Examen: 'Examen'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "usuario" | "profesor" | "alumno" | "vehiculo" | "clasePractica" | "examen"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsuarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Profesor: {
        payload: Prisma.$ProfesorPayload<ExtArgs>
        fields: Prisma.ProfesorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfesorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfesorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload>
          }
          findFirst: {
            args: Prisma.ProfesorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfesorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload>
          }
          findMany: {
            args: Prisma.ProfesorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload>[]
          }
          create: {
            args: Prisma.ProfesorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload>
          }
          createMany: {
            args: Prisma.ProfesorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfesorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload>[]
          }
          delete: {
            args: Prisma.ProfesorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload>
          }
          update: {
            args: Prisma.ProfesorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload>
          }
          deleteMany: {
            args: Prisma.ProfesorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfesorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfesorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload>[]
          }
          upsert: {
            args: Prisma.ProfesorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfesorPayload>
          }
          aggregate: {
            args: Prisma.ProfesorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfesor>
          }
          groupBy: {
            args: Prisma.ProfesorGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfesorGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfesorCountArgs<ExtArgs>
            result: $Utils.Optional<ProfesorCountAggregateOutputType> | number
          }
        }
      }
      Alumno: {
        payload: Prisma.$AlumnoPayload<ExtArgs>
        fields: Prisma.AlumnoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlumnoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlumnoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          findFirst: {
            args: Prisma.AlumnoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlumnoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          findMany: {
            args: Prisma.AlumnoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>[]
          }
          create: {
            args: Prisma.AlumnoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          createMany: {
            args: Prisma.AlumnoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlumnoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>[]
          }
          delete: {
            args: Prisma.AlumnoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          update: {
            args: Prisma.AlumnoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          deleteMany: {
            args: Prisma.AlumnoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlumnoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AlumnoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>[]
          }
          upsert: {
            args: Prisma.AlumnoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          aggregate: {
            args: Prisma.AlumnoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlumno>
          }
          groupBy: {
            args: Prisma.AlumnoGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlumnoGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlumnoCountArgs<ExtArgs>
            result: $Utils.Optional<AlumnoCountAggregateOutputType> | number
          }
        }
      }
      Vehiculo: {
        payload: Prisma.$VehiculoPayload<ExtArgs>
        fields: Prisma.VehiculoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VehiculoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VehiculoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload>
          }
          findFirst: {
            args: Prisma.VehiculoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VehiculoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload>
          }
          findMany: {
            args: Prisma.VehiculoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload>[]
          }
          create: {
            args: Prisma.VehiculoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload>
          }
          createMany: {
            args: Prisma.VehiculoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VehiculoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload>[]
          }
          delete: {
            args: Prisma.VehiculoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload>
          }
          update: {
            args: Prisma.VehiculoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload>
          }
          deleteMany: {
            args: Prisma.VehiculoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VehiculoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VehiculoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload>[]
          }
          upsert: {
            args: Prisma.VehiculoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiculoPayload>
          }
          aggregate: {
            args: Prisma.VehiculoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehiculo>
          }
          groupBy: {
            args: Prisma.VehiculoGroupByArgs<ExtArgs>
            result: $Utils.Optional<VehiculoGroupByOutputType>[]
          }
          count: {
            args: Prisma.VehiculoCountArgs<ExtArgs>
            result: $Utils.Optional<VehiculoCountAggregateOutputType> | number
          }
        }
      }
      ClasePractica: {
        payload: Prisma.$ClasePracticaPayload<ExtArgs>
        fields: Prisma.ClasePracticaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClasePracticaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClasePracticaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload>
          }
          findFirst: {
            args: Prisma.ClasePracticaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClasePracticaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload>
          }
          findMany: {
            args: Prisma.ClasePracticaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload>[]
          }
          create: {
            args: Prisma.ClasePracticaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload>
          }
          createMany: {
            args: Prisma.ClasePracticaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClasePracticaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload>[]
          }
          delete: {
            args: Prisma.ClasePracticaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload>
          }
          update: {
            args: Prisma.ClasePracticaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload>
          }
          deleteMany: {
            args: Prisma.ClasePracticaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClasePracticaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClasePracticaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload>[]
          }
          upsert: {
            args: Prisma.ClasePracticaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClasePracticaPayload>
          }
          aggregate: {
            args: Prisma.ClasePracticaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClasePractica>
          }
          groupBy: {
            args: Prisma.ClasePracticaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClasePracticaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClasePracticaCountArgs<ExtArgs>
            result: $Utils.Optional<ClasePracticaCountAggregateOutputType> | number
          }
        }
      }
      Examen: {
        payload: Prisma.$ExamenPayload<ExtArgs>
        fields: Prisma.ExamenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload>
          }
          findFirst: {
            args: Prisma.ExamenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload>
          }
          findMany: {
            args: Prisma.ExamenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload>[]
          }
          create: {
            args: Prisma.ExamenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload>
          }
          createMany: {
            args: Prisma.ExamenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload>[]
          }
          delete: {
            args: Prisma.ExamenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload>
          }
          update: {
            args: Prisma.ExamenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload>
          }
          deleteMany: {
            args: Prisma.ExamenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExamenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload>[]
          }
          upsert: {
            args: Prisma.ExamenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamenPayload>
          }
          aggregate: {
            args: Prisma.ExamenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExamen>
          }
          groupBy: {
            args: Prisma.ExamenGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamenGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamenCountArgs<ExtArgs>
            result: $Utils.Optional<ExamenCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    usuario?: UsuarioOmit
    profesor?: ProfesorOmit
    alumno?: AlumnoOmit
    vehiculo?: VehiculoOmit
    clasePractica?: ClasePracticaOmit
    examen?: ExamenOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProfesorCountOutputType
   */

  export type ProfesorCountOutputType = {
    alumnosAsignados: number
    clases: number
  }

  export type ProfesorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumnosAsignados?: boolean | ProfesorCountOutputTypeCountAlumnosAsignadosArgs
    clases?: boolean | ProfesorCountOutputTypeCountClasesArgs
  }

  // Custom InputTypes
  /**
   * ProfesorCountOutputType without action
   */
  export type ProfesorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfesorCountOutputType
     */
    select?: ProfesorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfesorCountOutputType without action
   */
  export type ProfesorCountOutputTypeCountAlumnosAsignadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlumnoWhereInput
  }

  /**
   * ProfesorCountOutputType without action
   */
  export type ProfesorCountOutputTypeCountClasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClasePracticaWhereInput
  }


  /**
   * Count Type AlumnoCountOutputType
   */

  export type AlumnoCountOutputType = {
    clases: number
    examenes: number
  }

  export type AlumnoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clases?: boolean | AlumnoCountOutputTypeCountClasesArgs
    examenes?: boolean | AlumnoCountOutputTypeCountExamenesArgs
  }

  // Custom InputTypes
  /**
   * AlumnoCountOutputType without action
   */
  export type AlumnoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlumnoCountOutputType
     */
    select?: AlumnoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AlumnoCountOutputType without action
   */
  export type AlumnoCountOutputTypeCountClasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClasePracticaWhereInput
  }

  /**
   * AlumnoCountOutputType without action
   */
  export type AlumnoCountOutputTypeCountExamenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamenWhereInput
  }


  /**
   * Count Type VehiculoCountOutputType
   */

  export type VehiculoCountOutputType = {
    clases: number
  }

  export type VehiculoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clases?: boolean | VehiculoCountOutputTypeCountClasesArgs
  }

  // Custom InputTypes
  /**
   * VehiculoCountOutputType without action
   */
  export type VehiculoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiculoCountOutputType
     */
    select?: VehiculoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VehiculoCountOutputType without action
   */
  export type VehiculoCountOutputTypeCountClasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClasePracticaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    email: string | null
    passwordHash: string | null
    rol: $Enums.Rol | null
    fechaCreacion: Date | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    email: string | null
    passwordHash: string | null
    rol: $Enums.Rol | null
    fechaCreacion: Date | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    nombre: number
    email: number
    passwordHash: number
    rol: number
    fechaCreacion: number
    _all: number
  }


  export type UsuarioMinAggregateInputType = {
    id?: true
    nombre?: true
    email?: true
    passwordHash?: true
    rol?: true
    fechaCreacion?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    nombre?: true
    email?: true
    passwordHash?: true
    rol?: true
    fechaCreacion?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    nombre?: true
    email?: true
    passwordHash?: true
    rol?: true
    fechaCreacion?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: string
    nombre: string
    email: string
    passwordHash: string
    rol: $Enums.Rol
    fechaCreacion: Date
    _count: UsuarioCountAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    email?: boolean
    passwordHash?: boolean
    rol?: boolean
    fechaCreacion?: boolean
    alumno?: boolean | Usuario$alumnoArgs<ExtArgs>
    profesor?: boolean | Usuario$profesorArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    email?: boolean
    passwordHash?: boolean
    rol?: boolean
    fechaCreacion?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    email?: boolean
    passwordHash?: boolean
    rol?: boolean
    fechaCreacion?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    id?: boolean
    nombre?: boolean
    email?: boolean
    passwordHash?: boolean
    rol?: boolean
    fechaCreacion?: boolean
  }

  export type UsuarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "email" | "passwordHash" | "rol" | "fechaCreacion", ExtArgs["result"]["usuario"]>
  export type UsuarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | Usuario$alumnoArgs<ExtArgs>
    profesor?: boolean | Usuario$profesorArgs<ExtArgs>
  }
  export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UsuarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {
      alumno: Prisma.$AlumnoPayload<ExtArgs> | null
      profesor: Prisma.$ProfesorPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      email: string
      passwordHash: string
      rol: $Enums.Rol
      fechaCreacion: Date
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {UsuarioUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(args: SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    alumno<T extends Usuario$alumnoArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$alumnoArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    profesor<T extends Usuario$profesorArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$profesorArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */
  interface UsuarioFieldRefs {
    readonly id: FieldRef<"Usuario", 'String'>
    readonly nombre: FieldRef<"Usuario", 'String'>
    readonly email: FieldRef<"Usuario", 'String'>
    readonly passwordHash: FieldRef<"Usuario", 'String'>
    readonly rol: FieldRef<"Usuario", 'Rol'>
    readonly fechaCreacion: FieldRef<"Usuario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario updateManyAndReturn
   */
  export type UsuarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to delete.
     */
    limit?: number
  }

  /**
   * Usuario.alumno
   */
  export type Usuario$alumnoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    where?: AlumnoWhereInput
  }

  /**
   * Usuario.profesor
   */
  export type Usuario$profesorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    where?: ProfesorWhereInput
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
  }


  /**
   * Model Profesor
   */

  export type AggregateProfesor = {
    _count: ProfesorCountAggregateOutputType | null
    _min: ProfesorMinAggregateOutputType | null
    _max: ProfesorMaxAggregateOutputType | null
  }

  export type ProfesorMinAggregateOutputType = {
    id: string | null
    licenciaConducir: string | null
    telefono: string | null
    activo: boolean | null
  }

  export type ProfesorMaxAggregateOutputType = {
    id: string | null
    licenciaConducir: string | null
    telefono: string | null
    activo: boolean | null
  }

  export type ProfesorCountAggregateOutputType = {
    id: number
    licenciaConducir: number
    telefono: number
    activo: number
    _all: number
  }


  export type ProfesorMinAggregateInputType = {
    id?: true
    licenciaConducir?: true
    telefono?: true
    activo?: true
  }

  export type ProfesorMaxAggregateInputType = {
    id?: true
    licenciaConducir?: true
    telefono?: true
    activo?: true
  }

  export type ProfesorCountAggregateInputType = {
    id?: true
    licenciaConducir?: true
    telefono?: true
    activo?: true
    _all?: true
  }

  export type ProfesorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profesor to aggregate.
     */
    where?: ProfesorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profesors to fetch.
     */
    orderBy?: ProfesorOrderByWithRelationInput | ProfesorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfesorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profesors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profesors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profesors
    **/
    _count?: true | ProfesorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfesorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfesorMaxAggregateInputType
  }

  export type GetProfesorAggregateType<T extends ProfesorAggregateArgs> = {
        [P in keyof T & keyof AggregateProfesor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfesor[P]>
      : GetScalarType<T[P], AggregateProfesor[P]>
  }




  export type ProfesorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfesorWhereInput
    orderBy?: ProfesorOrderByWithAggregationInput | ProfesorOrderByWithAggregationInput[]
    by: ProfesorScalarFieldEnum[] | ProfesorScalarFieldEnum
    having?: ProfesorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfesorCountAggregateInputType | true
    _min?: ProfesorMinAggregateInputType
    _max?: ProfesorMaxAggregateInputType
  }

  export type ProfesorGroupByOutputType = {
    id: string
    licenciaConducir: string
    telefono: string
    activo: boolean
    _count: ProfesorCountAggregateOutputType | null
    _min: ProfesorMinAggregateOutputType | null
    _max: ProfesorMaxAggregateOutputType | null
  }

  type GetProfesorGroupByPayload<T extends ProfesorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfesorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfesorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfesorGroupByOutputType[P]>
            : GetScalarType<T[P], ProfesorGroupByOutputType[P]>
        }
      >
    >


  export type ProfesorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    licenciaConducir?: boolean
    telefono?: boolean
    activo?: boolean
    alumnosAsignados?: boolean | Profesor$alumnosAsignadosArgs<ExtArgs>
    clases?: boolean | Profesor$clasesArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    _count?: boolean | ProfesorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profesor"]>

  export type ProfesorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    licenciaConducir?: boolean
    telefono?: boolean
    activo?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profesor"]>

  export type ProfesorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    licenciaConducir?: boolean
    telefono?: boolean
    activo?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profesor"]>

  export type ProfesorSelectScalar = {
    id?: boolean
    licenciaConducir?: boolean
    telefono?: boolean
    activo?: boolean
  }

  export type ProfesorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "licenciaConducir" | "telefono" | "activo", ExtArgs["result"]["profesor"]>
  export type ProfesorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumnosAsignados?: boolean | Profesor$alumnosAsignadosArgs<ExtArgs>
    clases?: boolean | Profesor$clasesArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    _count?: boolean | ProfesorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProfesorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type ProfesorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $ProfesorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profesor"
    objects: {
      alumnosAsignados: Prisma.$AlumnoPayload<ExtArgs>[]
      clases: Prisma.$ClasePracticaPayload<ExtArgs>[]
      usuario: Prisma.$UsuarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      licenciaConducir: string
      telefono: string
      activo: boolean
    }, ExtArgs["result"]["profesor"]>
    composites: {}
  }

  type ProfesorGetPayload<S extends boolean | null | undefined | ProfesorDefaultArgs> = $Result.GetResult<Prisma.$ProfesorPayload, S>

  type ProfesorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfesorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfesorCountAggregateInputType | true
    }

  export interface ProfesorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profesor'], meta: { name: 'Profesor' } }
    /**
     * Find zero or one Profesor that matches the filter.
     * @param {ProfesorFindUniqueArgs} args - Arguments to find a Profesor
     * @example
     * // Get one Profesor
     * const profesor = await prisma.profesor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfesorFindUniqueArgs>(args: SelectSubset<T, ProfesorFindUniqueArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profesor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfesorFindUniqueOrThrowArgs} args - Arguments to find a Profesor
     * @example
     * // Get one Profesor
     * const profesor = await prisma.profesor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfesorFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfesorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profesor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfesorFindFirstArgs} args - Arguments to find a Profesor
     * @example
     * // Get one Profesor
     * const profesor = await prisma.profesor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfesorFindFirstArgs>(args?: SelectSubset<T, ProfesorFindFirstArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profesor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfesorFindFirstOrThrowArgs} args - Arguments to find a Profesor
     * @example
     * // Get one Profesor
     * const profesor = await prisma.profesor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfesorFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfesorFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profesors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfesorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profesors
     * const profesors = await prisma.profesor.findMany()
     * 
     * // Get first 10 Profesors
     * const profesors = await prisma.profesor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profesorWithIdOnly = await prisma.profesor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfesorFindManyArgs>(args?: SelectSubset<T, ProfesorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profesor.
     * @param {ProfesorCreateArgs} args - Arguments to create a Profesor.
     * @example
     * // Create one Profesor
     * const Profesor = await prisma.profesor.create({
     *   data: {
     *     // ... data to create a Profesor
     *   }
     * })
     * 
     */
    create<T extends ProfesorCreateArgs>(args: SelectSubset<T, ProfesorCreateArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profesors.
     * @param {ProfesorCreateManyArgs} args - Arguments to create many Profesors.
     * @example
     * // Create many Profesors
     * const profesor = await prisma.profesor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfesorCreateManyArgs>(args?: SelectSubset<T, ProfesorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profesors and returns the data saved in the database.
     * @param {ProfesorCreateManyAndReturnArgs} args - Arguments to create many Profesors.
     * @example
     * // Create many Profesors
     * const profesor = await prisma.profesor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profesors and only return the `id`
     * const profesorWithIdOnly = await prisma.profesor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfesorCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfesorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profesor.
     * @param {ProfesorDeleteArgs} args - Arguments to delete one Profesor.
     * @example
     * // Delete one Profesor
     * const Profesor = await prisma.profesor.delete({
     *   where: {
     *     // ... filter to delete one Profesor
     *   }
     * })
     * 
     */
    delete<T extends ProfesorDeleteArgs>(args: SelectSubset<T, ProfesorDeleteArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profesor.
     * @param {ProfesorUpdateArgs} args - Arguments to update one Profesor.
     * @example
     * // Update one Profesor
     * const profesor = await prisma.profesor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfesorUpdateArgs>(args: SelectSubset<T, ProfesorUpdateArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profesors.
     * @param {ProfesorDeleteManyArgs} args - Arguments to filter Profesors to delete.
     * @example
     * // Delete a few Profesors
     * const { count } = await prisma.profesor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfesorDeleteManyArgs>(args?: SelectSubset<T, ProfesorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profesors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfesorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profesors
     * const profesor = await prisma.profesor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfesorUpdateManyArgs>(args: SelectSubset<T, ProfesorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profesors and returns the data updated in the database.
     * @param {ProfesorUpdateManyAndReturnArgs} args - Arguments to update many Profesors.
     * @example
     * // Update many Profesors
     * const profesor = await prisma.profesor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profesors and only return the `id`
     * const profesorWithIdOnly = await prisma.profesor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfesorUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfesorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profesor.
     * @param {ProfesorUpsertArgs} args - Arguments to update or create a Profesor.
     * @example
     * // Update or create a Profesor
     * const profesor = await prisma.profesor.upsert({
     *   create: {
     *     // ... data to create a Profesor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profesor we want to update
     *   }
     * })
     */
    upsert<T extends ProfesorUpsertArgs>(args: SelectSubset<T, ProfesorUpsertArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profesors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfesorCountArgs} args - Arguments to filter Profesors to count.
     * @example
     * // Count the number of Profesors
     * const count = await prisma.profesor.count({
     *   where: {
     *     // ... the filter for the Profesors we want to count
     *   }
     * })
    **/
    count<T extends ProfesorCountArgs>(
      args?: Subset<T, ProfesorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfesorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profesor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfesorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfesorAggregateArgs>(args: Subset<T, ProfesorAggregateArgs>): Prisma.PrismaPromise<GetProfesorAggregateType<T>>

    /**
     * Group by Profesor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfesorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfesorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfesorGroupByArgs['orderBy'] }
        : { orderBy?: ProfesorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfesorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfesorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profesor model
   */
  readonly fields: ProfesorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profesor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfesorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    alumnosAsignados<T extends Profesor$alumnosAsignadosArgs<ExtArgs> = {}>(args?: Subset<T, Profesor$alumnosAsignadosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    clases<T extends Profesor$clasesArgs<ExtArgs> = {}>(args?: Subset<T, Profesor$clasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Profesor model
   */
  interface ProfesorFieldRefs {
    readonly id: FieldRef<"Profesor", 'String'>
    readonly licenciaConducir: FieldRef<"Profesor", 'String'>
    readonly telefono: FieldRef<"Profesor", 'String'>
    readonly activo: FieldRef<"Profesor", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Profesor findUnique
   */
  export type ProfesorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    /**
     * Filter, which Profesor to fetch.
     */
    where: ProfesorWhereUniqueInput
  }

  /**
   * Profesor findUniqueOrThrow
   */
  export type ProfesorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    /**
     * Filter, which Profesor to fetch.
     */
    where: ProfesorWhereUniqueInput
  }

  /**
   * Profesor findFirst
   */
  export type ProfesorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    /**
     * Filter, which Profesor to fetch.
     */
    where?: ProfesorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profesors to fetch.
     */
    orderBy?: ProfesorOrderByWithRelationInput | ProfesorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profesors.
     */
    cursor?: ProfesorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profesors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profesors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profesors.
     */
    distinct?: ProfesorScalarFieldEnum | ProfesorScalarFieldEnum[]
  }

  /**
   * Profesor findFirstOrThrow
   */
  export type ProfesorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    /**
     * Filter, which Profesor to fetch.
     */
    where?: ProfesorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profesors to fetch.
     */
    orderBy?: ProfesorOrderByWithRelationInput | ProfesorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profesors.
     */
    cursor?: ProfesorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profesors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profesors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profesors.
     */
    distinct?: ProfesorScalarFieldEnum | ProfesorScalarFieldEnum[]
  }

  /**
   * Profesor findMany
   */
  export type ProfesorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    /**
     * Filter, which Profesors to fetch.
     */
    where?: ProfesorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profesors to fetch.
     */
    orderBy?: ProfesorOrderByWithRelationInput | ProfesorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profesors.
     */
    cursor?: ProfesorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profesors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profesors.
     */
    skip?: number
    distinct?: ProfesorScalarFieldEnum | ProfesorScalarFieldEnum[]
  }

  /**
   * Profesor create
   */
  export type ProfesorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    /**
     * The data needed to create a Profesor.
     */
    data: XOR<ProfesorCreateInput, ProfesorUncheckedCreateInput>
  }

  /**
   * Profesor createMany
   */
  export type ProfesorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profesors.
     */
    data: ProfesorCreateManyInput | ProfesorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profesor createManyAndReturn
   */
  export type ProfesorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * The data used to create many Profesors.
     */
    data: ProfesorCreateManyInput | ProfesorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Profesor update
   */
  export type ProfesorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    /**
     * The data needed to update a Profesor.
     */
    data: XOR<ProfesorUpdateInput, ProfesorUncheckedUpdateInput>
    /**
     * Choose, which Profesor to update.
     */
    where: ProfesorWhereUniqueInput
  }

  /**
   * Profesor updateMany
   */
  export type ProfesorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profesors.
     */
    data: XOR<ProfesorUpdateManyMutationInput, ProfesorUncheckedUpdateManyInput>
    /**
     * Filter which Profesors to update
     */
    where?: ProfesorWhereInput
    /**
     * Limit how many Profesors to update.
     */
    limit?: number
  }

  /**
   * Profesor updateManyAndReturn
   */
  export type ProfesorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * The data used to update Profesors.
     */
    data: XOR<ProfesorUpdateManyMutationInput, ProfesorUncheckedUpdateManyInput>
    /**
     * Filter which Profesors to update
     */
    where?: ProfesorWhereInput
    /**
     * Limit how many Profesors to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Profesor upsert
   */
  export type ProfesorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    /**
     * The filter to search for the Profesor to update in case it exists.
     */
    where: ProfesorWhereUniqueInput
    /**
     * In case the Profesor found by the `where` argument doesn't exist, create a new Profesor with this data.
     */
    create: XOR<ProfesorCreateInput, ProfesorUncheckedCreateInput>
    /**
     * In case the Profesor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfesorUpdateInput, ProfesorUncheckedUpdateInput>
  }

  /**
   * Profesor delete
   */
  export type ProfesorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    /**
     * Filter which Profesor to delete.
     */
    where: ProfesorWhereUniqueInput
  }

  /**
   * Profesor deleteMany
   */
  export type ProfesorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profesors to delete
     */
    where?: ProfesorWhereInput
    /**
     * Limit how many Profesors to delete.
     */
    limit?: number
  }

  /**
   * Profesor.alumnosAsignados
   */
  export type Profesor$alumnosAsignadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    where?: AlumnoWhereInput
    orderBy?: AlumnoOrderByWithRelationInput | AlumnoOrderByWithRelationInput[]
    cursor?: AlumnoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlumnoScalarFieldEnum | AlumnoScalarFieldEnum[]
  }

  /**
   * Profesor.clases
   */
  export type Profesor$clasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    where?: ClasePracticaWhereInput
    orderBy?: ClasePracticaOrderByWithRelationInput | ClasePracticaOrderByWithRelationInput[]
    cursor?: ClasePracticaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClasePracticaScalarFieldEnum | ClasePracticaScalarFieldEnum[]
  }

  /**
   * Profesor without action
   */
  export type ProfesorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
  }


  /**
   * Model Alumno
   */

  export type AggregateAlumno = {
    _count: AlumnoCountAggregateOutputType | null
    _avg: AlumnoAvgAggregateOutputType | null
    _sum: AlumnoSumAggregateOutputType | null
    _min: AlumnoMinAggregateOutputType | null
    _max: AlumnoMaxAggregateOutputType | null
  }

  export type AlumnoAvgAggregateOutputType = {
    horasPracticasCompletadas: number | null
  }

  export type AlumnoSumAggregateOutputType = {
    horasPracticasCompletadas: number | null
  }

  export type AlumnoMinAggregateOutputType = {
    id: string | null
    tipoLicenciaObjetivo: string | null
    horasPracticasCompletadas: number | null
    profesorAsignadoId: string | null
  }

  export type AlumnoMaxAggregateOutputType = {
    id: string | null
    tipoLicenciaObjetivo: string | null
    horasPracticasCompletadas: number | null
    profesorAsignadoId: string | null
  }

  export type AlumnoCountAggregateOutputType = {
    id: number
    tipoLicenciaObjetivo: number
    horasPracticasCompletadas: number
    profesorAsignadoId: number
    _all: number
  }


  export type AlumnoAvgAggregateInputType = {
    horasPracticasCompletadas?: true
  }

  export type AlumnoSumAggregateInputType = {
    horasPracticasCompletadas?: true
  }

  export type AlumnoMinAggregateInputType = {
    id?: true
    tipoLicenciaObjetivo?: true
    horasPracticasCompletadas?: true
    profesorAsignadoId?: true
  }

  export type AlumnoMaxAggregateInputType = {
    id?: true
    tipoLicenciaObjetivo?: true
    horasPracticasCompletadas?: true
    profesorAsignadoId?: true
  }

  export type AlumnoCountAggregateInputType = {
    id?: true
    tipoLicenciaObjetivo?: true
    horasPracticasCompletadas?: true
    profesorAsignadoId?: true
    _all?: true
  }

  export type AlumnoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alumno to aggregate.
     */
    where?: AlumnoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alumnos to fetch.
     */
    orderBy?: AlumnoOrderByWithRelationInput | AlumnoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlumnoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alumnos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alumnos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Alumnos
    **/
    _count?: true | AlumnoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlumnoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlumnoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlumnoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlumnoMaxAggregateInputType
  }

  export type GetAlumnoAggregateType<T extends AlumnoAggregateArgs> = {
        [P in keyof T & keyof AggregateAlumno]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlumno[P]>
      : GetScalarType<T[P], AggregateAlumno[P]>
  }




  export type AlumnoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlumnoWhereInput
    orderBy?: AlumnoOrderByWithAggregationInput | AlumnoOrderByWithAggregationInput[]
    by: AlumnoScalarFieldEnum[] | AlumnoScalarFieldEnum
    having?: AlumnoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlumnoCountAggregateInputType | true
    _avg?: AlumnoAvgAggregateInputType
    _sum?: AlumnoSumAggregateInputType
    _min?: AlumnoMinAggregateInputType
    _max?: AlumnoMaxAggregateInputType
  }

  export type AlumnoGroupByOutputType = {
    id: string
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas: number
    profesorAsignadoId: string | null
    _count: AlumnoCountAggregateOutputType | null
    _avg: AlumnoAvgAggregateOutputType | null
    _sum: AlumnoSumAggregateOutputType | null
    _min: AlumnoMinAggregateOutputType | null
    _max: AlumnoMaxAggregateOutputType | null
  }

  type GetAlumnoGroupByPayload<T extends AlumnoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlumnoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlumnoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlumnoGroupByOutputType[P]>
            : GetScalarType<T[P], AlumnoGroupByOutputType[P]>
        }
      >
    >


  export type AlumnoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipoLicenciaObjetivo?: boolean
    horasPracticasCompletadas?: boolean
    profesorAsignadoId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    profesorAsignado?: boolean | Alumno$profesorAsignadoArgs<ExtArgs>
    clases?: boolean | Alumno$clasesArgs<ExtArgs>
    examenes?: boolean | Alumno$examenesArgs<ExtArgs>
    _count?: boolean | AlumnoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["alumno"]>

  export type AlumnoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipoLicenciaObjetivo?: boolean
    horasPracticasCompletadas?: boolean
    profesorAsignadoId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    profesorAsignado?: boolean | Alumno$profesorAsignadoArgs<ExtArgs>
  }, ExtArgs["result"]["alumno"]>

  export type AlumnoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipoLicenciaObjetivo?: boolean
    horasPracticasCompletadas?: boolean
    profesorAsignadoId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    profesorAsignado?: boolean | Alumno$profesorAsignadoArgs<ExtArgs>
  }, ExtArgs["result"]["alumno"]>

  export type AlumnoSelectScalar = {
    id?: boolean
    tipoLicenciaObjetivo?: boolean
    horasPracticasCompletadas?: boolean
    profesorAsignadoId?: boolean
  }

  export type AlumnoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tipoLicenciaObjetivo" | "horasPracticasCompletadas" | "profesorAsignadoId", ExtArgs["result"]["alumno"]>
  export type AlumnoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    profesorAsignado?: boolean | Alumno$profesorAsignadoArgs<ExtArgs>
    clases?: boolean | Alumno$clasesArgs<ExtArgs>
    examenes?: boolean | Alumno$examenesArgs<ExtArgs>
    _count?: boolean | AlumnoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AlumnoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    profesorAsignado?: boolean | Alumno$profesorAsignadoArgs<ExtArgs>
  }
  export type AlumnoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    profesorAsignado?: boolean | Alumno$profesorAsignadoArgs<ExtArgs>
  }

  export type $AlumnoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Alumno"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs>
      profesorAsignado: Prisma.$ProfesorPayload<ExtArgs> | null
      clases: Prisma.$ClasePracticaPayload<ExtArgs>[]
      examenes: Prisma.$ExamenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tipoLicenciaObjetivo: string
      horasPracticasCompletadas: number
      profesorAsignadoId: string | null
    }, ExtArgs["result"]["alumno"]>
    composites: {}
  }

  type AlumnoGetPayload<S extends boolean | null | undefined | AlumnoDefaultArgs> = $Result.GetResult<Prisma.$AlumnoPayload, S>

  type AlumnoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AlumnoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AlumnoCountAggregateInputType | true
    }

  export interface AlumnoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Alumno'], meta: { name: 'Alumno' } }
    /**
     * Find zero or one Alumno that matches the filter.
     * @param {AlumnoFindUniqueArgs} args - Arguments to find a Alumno
     * @example
     * // Get one Alumno
     * const alumno = await prisma.alumno.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlumnoFindUniqueArgs>(args: SelectSubset<T, AlumnoFindUniqueArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Alumno that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlumnoFindUniqueOrThrowArgs} args - Arguments to find a Alumno
     * @example
     * // Get one Alumno
     * const alumno = await prisma.alumno.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlumnoFindUniqueOrThrowArgs>(args: SelectSubset<T, AlumnoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Alumno that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoFindFirstArgs} args - Arguments to find a Alumno
     * @example
     * // Get one Alumno
     * const alumno = await prisma.alumno.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlumnoFindFirstArgs>(args?: SelectSubset<T, AlumnoFindFirstArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Alumno that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoFindFirstOrThrowArgs} args - Arguments to find a Alumno
     * @example
     * // Get one Alumno
     * const alumno = await prisma.alumno.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlumnoFindFirstOrThrowArgs>(args?: SelectSubset<T, AlumnoFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Alumnos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Alumnos
     * const alumnos = await prisma.alumno.findMany()
     * 
     * // Get first 10 Alumnos
     * const alumnos = await prisma.alumno.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alumnoWithIdOnly = await prisma.alumno.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlumnoFindManyArgs>(args?: SelectSubset<T, AlumnoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Alumno.
     * @param {AlumnoCreateArgs} args - Arguments to create a Alumno.
     * @example
     * // Create one Alumno
     * const Alumno = await prisma.alumno.create({
     *   data: {
     *     // ... data to create a Alumno
     *   }
     * })
     * 
     */
    create<T extends AlumnoCreateArgs>(args: SelectSubset<T, AlumnoCreateArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Alumnos.
     * @param {AlumnoCreateManyArgs} args - Arguments to create many Alumnos.
     * @example
     * // Create many Alumnos
     * const alumno = await prisma.alumno.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlumnoCreateManyArgs>(args?: SelectSubset<T, AlumnoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Alumnos and returns the data saved in the database.
     * @param {AlumnoCreateManyAndReturnArgs} args - Arguments to create many Alumnos.
     * @example
     * // Create many Alumnos
     * const alumno = await prisma.alumno.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Alumnos and only return the `id`
     * const alumnoWithIdOnly = await prisma.alumno.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlumnoCreateManyAndReturnArgs>(args?: SelectSubset<T, AlumnoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Alumno.
     * @param {AlumnoDeleteArgs} args - Arguments to delete one Alumno.
     * @example
     * // Delete one Alumno
     * const Alumno = await prisma.alumno.delete({
     *   where: {
     *     // ... filter to delete one Alumno
     *   }
     * })
     * 
     */
    delete<T extends AlumnoDeleteArgs>(args: SelectSubset<T, AlumnoDeleteArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Alumno.
     * @param {AlumnoUpdateArgs} args - Arguments to update one Alumno.
     * @example
     * // Update one Alumno
     * const alumno = await prisma.alumno.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlumnoUpdateArgs>(args: SelectSubset<T, AlumnoUpdateArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Alumnos.
     * @param {AlumnoDeleteManyArgs} args - Arguments to filter Alumnos to delete.
     * @example
     * // Delete a few Alumnos
     * const { count } = await prisma.alumno.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlumnoDeleteManyArgs>(args?: SelectSubset<T, AlumnoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alumnos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Alumnos
     * const alumno = await prisma.alumno.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlumnoUpdateManyArgs>(args: SelectSubset<T, AlumnoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alumnos and returns the data updated in the database.
     * @param {AlumnoUpdateManyAndReturnArgs} args - Arguments to update many Alumnos.
     * @example
     * // Update many Alumnos
     * const alumno = await prisma.alumno.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Alumnos and only return the `id`
     * const alumnoWithIdOnly = await prisma.alumno.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AlumnoUpdateManyAndReturnArgs>(args: SelectSubset<T, AlumnoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Alumno.
     * @param {AlumnoUpsertArgs} args - Arguments to update or create a Alumno.
     * @example
     * // Update or create a Alumno
     * const alumno = await prisma.alumno.upsert({
     *   create: {
     *     // ... data to create a Alumno
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Alumno we want to update
     *   }
     * })
     */
    upsert<T extends AlumnoUpsertArgs>(args: SelectSubset<T, AlumnoUpsertArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Alumnos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoCountArgs} args - Arguments to filter Alumnos to count.
     * @example
     * // Count the number of Alumnos
     * const count = await prisma.alumno.count({
     *   where: {
     *     // ... the filter for the Alumnos we want to count
     *   }
     * })
    **/
    count<T extends AlumnoCountArgs>(
      args?: Subset<T, AlumnoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlumnoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Alumno.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlumnoAggregateArgs>(args: Subset<T, AlumnoAggregateArgs>): Prisma.PrismaPromise<GetAlumnoAggregateType<T>>

    /**
     * Group by Alumno.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlumnoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlumnoGroupByArgs['orderBy'] }
        : { orderBy?: AlumnoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlumnoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlumnoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Alumno model
   */
  readonly fields: AlumnoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Alumno.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlumnoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    profesorAsignado<T extends Alumno$profesorAsignadoArgs<ExtArgs> = {}>(args?: Subset<T, Alumno$profesorAsignadoArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    clases<T extends Alumno$clasesArgs<ExtArgs> = {}>(args?: Subset<T, Alumno$clasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    examenes<T extends Alumno$examenesArgs<ExtArgs> = {}>(args?: Subset<T, Alumno$examenesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Alumno model
   */
  interface AlumnoFieldRefs {
    readonly id: FieldRef<"Alumno", 'String'>
    readonly tipoLicenciaObjetivo: FieldRef<"Alumno", 'String'>
    readonly horasPracticasCompletadas: FieldRef<"Alumno", 'Int'>
    readonly profesorAsignadoId: FieldRef<"Alumno", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Alumno findUnique
   */
  export type AlumnoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumno to fetch.
     */
    where: AlumnoWhereUniqueInput
  }

  /**
   * Alumno findUniqueOrThrow
   */
  export type AlumnoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumno to fetch.
     */
    where: AlumnoWhereUniqueInput
  }

  /**
   * Alumno findFirst
   */
  export type AlumnoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumno to fetch.
     */
    where?: AlumnoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alumnos to fetch.
     */
    orderBy?: AlumnoOrderByWithRelationInput | AlumnoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alumnos.
     */
    cursor?: AlumnoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alumnos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alumnos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alumnos.
     */
    distinct?: AlumnoScalarFieldEnum | AlumnoScalarFieldEnum[]
  }

  /**
   * Alumno findFirstOrThrow
   */
  export type AlumnoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumno to fetch.
     */
    where?: AlumnoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alumnos to fetch.
     */
    orderBy?: AlumnoOrderByWithRelationInput | AlumnoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alumnos.
     */
    cursor?: AlumnoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alumnos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alumnos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alumnos.
     */
    distinct?: AlumnoScalarFieldEnum | AlumnoScalarFieldEnum[]
  }

  /**
   * Alumno findMany
   */
  export type AlumnoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumnos to fetch.
     */
    where?: AlumnoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alumnos to fetch.
     */
    orderBy?: AlumnoOrderByWithRelationInput | AlumnoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Alumnos.
     */
    cursor?: AlumnoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alumnos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alumnos.
     */
    skip?: number
    distinct?: AlumnoScalarFieldEnum | AlumnoScalarFieldEnum[]
  }

  /**
   * Alumno create
   */
  export type AlumnoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * The data needed to create a Alumno.
     */
    data: XOR<AlumnoCreateInput, AlumnoUncheckedCreateInput>
  }

  /**
   * Alumno createMany
   */
  export type AlumnoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Alumnos.
     */
    data: AlumnoCreateManyInput | AlumnoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Alumno createManyAndReturn
   */
  export type AlumnoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * The data used to create many Alumnos.
     */
    data: AlumnoCreateManyInput | AlumnoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Alumno update
   */
  export type AlumnoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * The data needed to update a Alumno.
     */
    data: XOR<AlumnoUpdateInput, AlumnoUncheckedUpdateInput>
    /**
     * Choose, which Alumno to update.
     */
    where: AlumnoWhereUniqueInput
  }

  /**
   * Alumno updateMany
   */
  export type AlumnoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Alumnos.
     */
    data: XOR<AlumnoUpdateManyMutationInput, AlumnoUncheckedUpdateManyInput>
    /**
     * Filter which Alumnos to update
     */
    where?: AlumnoWhereInput
    /**
     * Limit how many Alumnos to update.
     */
    limit?: number
  }

  /**
   * Alumno updateManyAndReturn
   */
  export type AlumnoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * The data used to update Alumnos.
     */
    data: XOR<AlumnoUpdateManyMutationInput, AlumnoUncheckedUpdateManyInput>
    /**
     * Filter which Alumnos to update
     */
    where?: AlumnoWhereInput
    /**
     * Limit how many Alumnos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Alumno upsert
   */
  export type AlumnoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * The filter to search for the Alumno to update in case it exists.
     */
    where: AlumnoWhereUniqueInput
    /**
     * In case the Alumno found by the `where` argument doesn't exist, create a new Alumno with this data.
     */
    create: XOR<AlumnoCreateInput, AlumnoUncheckedCreateInput>
    /**
     * In case the Alumno was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlumnoUpdateInput, AlumnoUncheckedUpdateInput>
  }

  /**
   * Alumno delete
   */
  export type AlumnoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter which Alumno to delete.
     */
    where: AlumnoWhereUniqueInput
  }

  /**
   * Alumno deleteMany
   */
  export type AlumnoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alumnos to delete
     */
    where?: AlumnoWhereInput
    /**
     * Limit how many Alumnos to delete.
     */
    limit?: number
  }

  /**
   * Alumno.profesorAsignado
   */
  export type Alumno$profesorAsignadoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profesor
     */
    select?: ProfesorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profesor
     */
    omit?: ProfesorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfesorInclude<ExtArgs> | null
    where?: ProfesorWhereInput
  }

  /**
   * Alumno.clases
   */
  export type Alumno$clasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    where?: ClasePracticaWhereInput
    orderBy?: ClasePracticaOrderByWithRelationInput | ClasePracticaOrderByWithRelationInput[]
    cursor?: ClasePracticaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClasePracticaScalarFieldEnum | ClasePracticaScalarFieldEnum[]
  }

  /**
   * Alumno.examenes
   */
  export type Alumno$examenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    where?: ExamenWhereInput
    orderBy?: ExamenOrderByWithRelationInput | ExamenOrderByWithRelationInput[]
    cursor?: ExamenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamenScalarFieldEnum | ExamenScalarFieldEnum[]
  }

  /**
   * Alumno without action
   */
  export type AlumnoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alumno
     */
    omit?: AlumnoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
  }


  /**
   * Model Vehiculo
   */

  export type AggregateVehiculo = {
    _count: VehiculoCountAggregateOutputType | null
    _min: VehiculoMinAggregateOutputType | null
    _max: VehiculoMaxAggregateOutputType | null
  }

  export type VehiculoMinAggregateOutputType = {
    id: string | null
    matricula: string | null
    marca: string | null
    modelo: string | null
    tipoPermiso: string | null
    activo: boolean | null
  }

  export type VehiculoMaxAggregateOutputType = {
    id: string | null
    matricula: string | null
    marca: string | null
    modelo: string | null
    tipoPermiso: string | null
    activo: boolean | null
  }

  export type VehiculoCountAggregateOutputType = {
    id: number
    matricula: number
    marca: number
    modelo: number
    tipoPermiso: number
    activo: number
    _all: number
  }


  export type VehiculoMinAggregateInputType = {
    id?: true
    matricula?: true
    marca?: true
    modelo?: true
    tipoPermiso?: true
    activo?: true
  }

  export type VehiculoMaxAggregateInputType = {
    id?: true
    matricula?: true
    marca?: true
    modelo?: true
    tipoPermiso?: true
    activo?: true
  }

  export type VehiculoCountAggregateInputType = {
    id?: true
    matricula?: true
    marca?: true
    modelo?: true
    tipoPermiso?: true
    activo?: true
    _all?: true
  }

  export type VehiculoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehiculo to aggregate.
     */
    where?: VehiculoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehiculos to fetch.
     */
    orderBy?: VehiculoOrderByWithRelationInput | VehiculoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VehiculoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehiculos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehiculos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vehiculos
    **/
    _count?: true | VehiculoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehiculoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehiculoMaxAggregateInputType
  }

  export type GetVehiculoAggregateType<T extends VehiculoAggregateArgs> = {
        [P in keyof T & keyof AggregateVehiculo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehiculo[P]>
      : GetScalarType<T[P], AggregateVehiculo[P]>
  }




  export type VehiculoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehiculoWhereInput
    orderBy?: VehiculoOrderByWithAggregationInput | VehiculoOrderByWithAggregationInput[]
    by: VehiculoScalarFieldEnum[] | VehiculoScalarFieldEnum
    having?: VehiculoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehiculoCountAggregateInputType | true
    _min?: VehiculoMinAggregateInputType
    _max?: VehiculoMaxAggregateInputType
  }

  export type VehiculoGroupByOutputType = {
    id: string
    matricula: string
    marca: string | null
    modelo: string | null
    tipoPermiso: string
    activo: boolean
    _count: VehiculoCountAggregateOutputType | null
    _min: VehiculoMinAggregateOutputType | null
    _max: VehiculoMaxAggregateOutputType | null
  }

  type GetVehiculoGroupByPayload<T extends VehiculoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehiculoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehiculoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehiculoGroupByOutputType[P]>
            : GetScalarType<T[P], VehiculoGroupByOutputType[P]>
        }
      >
    >


  export type VehiculoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matricula?: boolean
    marca?: boolean
    modelo?: boolean
    tipoPermiso?: boolean
    activo?: boolean
    clases?: boolean | Vehiculo$clasesArgs<ExtArgs>
    _count?: boolean | VehiculoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehiculo"]>

  export type VehiculoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matricula?: boolean
    marca?: boolean
    modelo?: boolean
    tipoPermiso?: boolean
    activo?: boolean
  }, ExtArgs["result"]["vehiculo"]>

  export type VehiculoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matricula?: boolean
    marca?: boolean
    modelo?: boolean
    tipoPermiso?: boolean
    activo?: boolean
  }, ExtArgs["result"]["vehiculo"]>

  export type VehiculoSelectScalar = {
    id?: boolean
    matricula?: boolean
    marca?: boolean
    modelo?: boolean
    tipoPermiso?: boolean
    activo?: boolean
  }

  export type VehiculoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matricula" | "marca" | "modelo" | "tipoPermiso" | "activo", ExtArgs["result"]["vehiculo"]>
  export type VehiculoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clases?: boolean | Vehiculo$clasesArgs<ExtArgs>
    _count?: boolean | VehiculoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VehiculoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type VehiculoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VehiculoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vehiculo"
    objects: {
      clases: Prisma.$ClasePracticaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matricula: string
      marca: string | null
      modelo: string | null
      tipoPermiso: string
      activo: boolean
    }, ExtArgs["result"]["vehiculo"]>
    composites: {}
  }

  type VehiculoGetPayload<S extends boolean | null | undefined | VehiculoDefaultArgs> = $Result.GetResult<Prisma.$VehiculoPayload, S>

  type VehiculoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VehiculoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VehiculoCountAggregateInputType | true
    }

  export interface VehiculoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vehiculo'], meta: { name: 'Vehiculo' } }
    /**
     * Find zero or one Vehiculo that matches the filter.
     * @param {VehiculoFindUniqueArgs} args - Arguments to find a Vehiculo
     * @example
     * // Get one Vehiculo
     * const vehiculo = await prisma.vehiculo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VehiculoFindUniqueArgs>(args: SelectSubset<T, VehiculoFindUniqueArgs<ExtArgs>>): Prisma__VehiculoClient<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vehiculo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VehiculoFindUniqueOrThrowArgs} args - Arguments to find a Vehiculo
     * @example
     * // Get one Vehiculo
     * const vehiculo = await prisma.vehiculo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VehiculoFindUniqueOrThrowArgs>(args: SelectSubset<T, VehiculoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VehiculoClient<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehiculo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiculoFindFirstArgs} args - Arguments to find a Vehiculo
     * @example
     * // Get one Vehiculo
     * const vehiculo = await prisma.vehiculo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VehiculoFindFirstArgs>(args?: SelectSubset<T, VehiculoFindFirstArgs<ExtArgs>>): Prisma__VehiculoClient<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehiculo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiculoFindFirstOrThrowArgs} args - Arguments to find a Vehiculo
     * @example
     * // Get one Vehiculo
     * const vehiculo = await prisma.vehiculo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VehiculoFindFirstOrThrowArgs>(args?: SelectSubset<T, VehiculoFindFirstOrThrowArgs<ExtArgs>>): Prisma__VehiculoClient<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vehiculos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiculoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vehiculos
     * const vehiculos = await prisma.vehiculo.findMany()
     * 
     * // Get first 10 Vehiculos
     * const vehiculos = await prisma.vehiculo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehiculoWithIdOnly = await prisma.vehiculo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VehiculoFindManyArgs>(args?: SelectSubset<T, VehiculoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vehiculo.
     * @param {VehiculoCreateArgs} args - Arguments to create a Vehiculo.
     * @example
     * // Create one Vehiculo
     * const Vehiculo = await prisma.vehiculo.create({
     *   data: {
     *     // ... data to create a Vehiculo
     *   }
     * })
     * 
     */
    create<T extends VehiculoCreateArgs>(args: SelectSubset<T, VehiculoCreateArgs<ExtArgs>>): Prisma__VehiculoClient<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vehiculos.
     * @param {VehiculoCreateManyArgs} args - Arguments to create many Vehiculos.
     * @example
     * // Create many Vehiculos
     * const vehiculo = await prisma.vehiculo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VehiculoCreateManyArgs>(args?: SelectSubset<T, VehiculoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vehiculos and returns the data saved in the database.
     * @param {VehiculoCreateManyAndReturnArgs} args - Arguments to create many Vehiculos.
     * @example
     * // Create many Vehiculos
     * const vehiculo = await prisma.vehiculo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vehiculos and only return the `id`
     * const vehiculoWithIdOnly = await prisma.vehiculo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VehiculoCreateManyAndReturnArgs>(args?: SelectSubset<T, VehiculoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vehiculo.
     * @param {VehiculoDeleteArgs} args - Arguments to delete one Vehiculo.
     * @example
     * // Delete one Vehiculo
     * const Vehiculo = await prisma.vehiculo.delete({
     *   where: {
     *     // ... filter to delete one Vehiculo
     *   }
     * })
     * 
     */
    delete<T extends VehiculoDeleteArgs>(args: SelectSubset<T, VehiculoDeleteArgs<ExtArgs>>): Prisma__VehiculoClient<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vehiculo.
     * @param {VehiculoUpdateArgs} args - Arguments to update one Vehiculo.
     * @example
     * // Update one Vehiculo
     * const vehiculo = await prisma.vehiculo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VehiculoUpdateArgs>(args: SelectSubset<T, VehiculoUpdateArgs<ExtArgs>>): Prisma__VehiculoClient<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vehiculos.
     * @param {VehiculoDeleteManyArgs} args - Arguments to filter Vehiculos to delete.
     * @example
     * // Delete a few Vehiculos
     * const { count } = await prisma.vehiculo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VehiculoDeleteManyArgs>(args?: SelectSubset<T, VehiculoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehiculos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiculoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vehiculos
     * const vehiculo = await prisma.vehiculo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VehiculoUpdateManyArgs>(args: SelectSubset<T, VehiculoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehiculos and returns the data updated in the database.
     * @param {VehiculoUpdateManyAndReturnArgs} args - Arguments to update many Vehiculos.
     * @example
     * // Update many Vehiculos
     * const vehiculo = await prisma.vehiculo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vehiculos and only return the `id`
     * const vehiculoWithIdOnly = await prisma.vehiculo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VehiculoUpdateManyAndReturnArgs>(args: SelectSubset<T, VehiculoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vehiculo.
     * @param {VehiculoUpsertArgs} args - Arguments to update or create a Vehiculo.
     * @example
     * // Update or create a Vehiculo
     * const vehiculo = await prisma.vehiculo.upsert({
     *   create: {
     *     // ... data to create a Vehiculo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vehiculo we want to update
     *   }
     * })
     */
    upsert<T extends VehiculoUpsertArgs>(args: SelectSubset<T, VehiculoUpsertArgs<ExtArgs>>): Prisma__VehiculoClient<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vehiculos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiculoCountArgs} args - Arguments to filter Vehiculos to count.
     * @example
     * // Count the number of Vehiculos
     * const count = await prisma.vehiculo.count({
     *   where: {
     *     // ... the filter for the Vehiculos we want to count
     *   }
     * })
    **/
    count<T extends VehiculoCountArgs>(
      args?: Subset<T, VehiculoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehiculoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vehiculo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiculoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehiculoAggregateArgs>(args: Subset<T, VehiculoAggregateArgs>): Prisma.PrismaPromise<GetVehiculoAggregateType<T>>

    /**
     * Group by Vehiculo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiculoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VehiculoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VehiculoGroupByArgs['orderBy'] }
        : { orderBy?: VehiculoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VehiculoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehiculoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vehiculo model
   */
  readonly fields: VehiculoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vehiculo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VehiculoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clases<T extends Vehiculo$clasesArgs<ExtArgs> = {}>(args?: Subset<T, Vehiculo$clasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vehiculo model
   */
  interface VehiculoFieldRefs {
    readonly id: FieldRef<"Vehiculo", 'String'>
    readonly matricula: FieldRef<"Vehiculo", 'String'>
    readonly marca: FieldRef<"Vehiculo", 'String'>
    readonly modelo: FieldRef<"Vehiculo", 'String'>
    readonly tipoPermiso: FieldRef<"Vehiculo", 'String'>
    readonly activo: FieldRef<"Vehiculo", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Vehiculo findUnique
   */
  export type VehiculoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
    /**
     * Filter, which Vehiculo to fetch.
     */
    where: VehiculoWhereUniqueInput
  }

  /**
   * Vehiculo findUniqueOrThrow
   */
  export type VehiculoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
    /**
     * Filter, which Vehiculo to fetch.
     */
    where: VehiculoWhereUniqueInput
  }

  /**
   * Vehiculo findFirst
   */
  export type VehiculoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
    /**
     * Filter, which Vehiculo to fetch.
     */
    where?: VehiculoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehiculos to fetch.
     */
    orderBy?: VehiculoOrderByWithRelationInput | VehiculoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehiculos.
     */
    cursor?: VehiculoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehiculos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehiculos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehiculos.
     */
    distinct?: VehiculoScalarFieldEnum | VehiculoScalarFieldEnum[]
  }

  /**
   * Vehiculo findFirstOrThrow
   */
  export type VehiculoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
    /**
     * Filter, which Vehiculo to fetch.
     */
    where?: VehiculoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehiculos to fetch.
     */
    orderBy?: VehiculoOrderByWithRelationInput | VehiculoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehiculos.
     */
    cursor?: VehiculoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehiculos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehiculos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehiculos.
     */
    distinct?: VehiculoScalarFieldEnum | VehiculoScalarFieldEnum[]
  }

  /**
   * Vehiculo findMany
   */
  export type VehiculoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
    /**
     * Filter, which Vehiculos to fetch.
     */
    where?: VehiculoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehiculos to fetch.
     */
    orderBy?: VehiculoOrderByWithRelationInput | VehiculoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vehiculos.
     */
    cursor?: VehiculoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehiculos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehiculos.
     */
    skip?: number
    distinct?: VehiculoScalarFieldEnum | VehiculoScalarFieldEnum[]
  }

  /**
   * Vehiculo create
   */
  export type VehiculoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
    /**
     * The data needed to create a Vehiculo.
     */
    data: XOR<VehiculoCreateInput, VehiculoUncheckedCreateInput>
  }

  /**
   * Vehiculo createMany
   */
  export type VehiculoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vehiculos.
     */
    data: VehiculoCreateManyInput | VehiculoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vehiculo createManyAndReturn
   */
  export type VehiculoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * The data used to create many Vehiculos.
     */
    data: VehiculoCreateManyInput | VehiculoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vehiculo update
   */
  export type VehiculoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
    /**
     * The data needed to update a Vehiculo.
     */
    data: XOR<VehiculoUpdateInput, VehiculoUncheckedUpdateInput>
    /**
     * Choose, which Vehiculo to update.
     */
    where: VehiculoWhereUniqueInput
  }

  /**
   * Vehiculo updateMany
   */
  export type VehiculoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vehiculos.
     */
    data: XOR<VehiculoUpdateManyMutationInput, VehiculoUncheckedUpdateManyInput>
    /**
     * Filter which Vehiculos to update
     */
    where?: VehiculoWhereInput
    /**
     * Limit how many Vehiculos to update.
     */
    limit?: number
  }

  /**
   * Vehiculo updateManyAndReturn
   */
  export type VehiculoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * The data used to update Vehiculos.
     */
    data: XOR<VehiculoUpdateManyMutationInput, VehiculoUncheckedUpdateManyInput>
    /**
     * Filter which Vehiculos to update
     */
    where?: VehiculoWhereInput
    /**
     * Limit how many Vehiculos to update.
     */
    limit?: number
  }

  /**
   * Vehiculo upsert
   */
  export type VehiculoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
    /**
     * The filter to search for the Vehiculo to update in case it exists.
     */
    where: VehiculoWhereUniqueInput
    /**
     * In case the Vehiculo found by the `where` argument doesn't exist, create a new Vehiculo with this data.
     */
    create: XOR<VehiculoCreateInput, VehiculoUncheckedCreateInput>
    /**
     * In case the Vehiculo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VehiculoUpdateInput, VehiculoUncheckedUpdateInput>
  }

  /**
   * Vehiculo delete
   */
  export type VehiculoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
    /**
     * Filter which Vehiculo to delete.
     */
    where: VehiculoWhereUniqueInput
  }

  /**
   * Vehiculo deleteMany
   */
  export type VehiculoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehiculos to delete
     */
    where?: VehiculoWhereInput
    /**
     * Limit how many Vehiculos to delete.
     */
    limit?: number
  }

  /**
   * Vehiculo.clases
   */
  export type Vehiculo$clasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    where?: ClasePracticaWhereInput
    orderBy?: ClasePracticaOrderByWithRelationInput | ClasePracticaOrderByWithRelationInput[]
    cursor?: ClasePracticaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClasePracticaScalarFieldEnum | ClasePracticaScalarFieldEnum[]
  }

  /**
   * Vehiculo without action
   */
  export type VehiculoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehiculo
     */
    select?: VehiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehiculo
     */
    omit?: VehiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehiculoInclude<ExtArgs> | null
  }


  /**
   * Model ClasePractica
   */

  export type AggregateClasePractica = {
    _count: ClasePracticaCountAggregateOutputType | null
    _avg: ClasePracticaAvgAggregateOutputType | null
    _sum: ClasePracticaSumAggregateOutputType | null
    _min: ClasePracticaMinAggregateOutputType | null
    _max: ClasePracticaMaxAggregateOutputType | null
  }

  export type ClasePracticaAvgAggregateOutputType = {
    duracion: number | null
  }

  export type ClasePracticaSumAggregateOutputType = {
    duracion: number | null
  }

  export type ClasePracticaMinAggregateOutputType = {
    id: string | null
    alumnoId: string | null
    profesorId: string | null
    vehiculoId: string | null
    fecha: Date | null
    duracion: number | null
    estado: string | null
  }

  export type ClasePracticaMaxAggregateOutputType = {
    id: string | null
    alumnoId: string | null
    profesorId: string | null
    vehiculoId: string | null
    fecha: Date | null
    duracion: number | null
    estado: string | null
  }

  export type ClasePracticaCountAggregateOutputType = {
    id: number
    alumnoId: number
    profesorId: number
    vehiculoId: number
    fecha: number
    duracion: number
    estado: number
    _all: number
  }


  export type ClasePracticaAvgAggregateInputType = {
    duracion?: true
  }

  export type ClasePracticaSumAggregateInputType = {
    duracion?: true
  }

  export type ClasePracticaMinAggregateInputType = {
    id?: true
    alumnoId?: true
    profesorId?: true
    vehiculoId?: true
    fecha?: true
    duracion?: true
    estado?: true
  }

  export type ClasePracticaMaxAggregateInputType = {
    id?: true
    alumnoId?: true
    profesorId?: true
    vehiculoId?: true
    fecha?: true
    duracion?: true
    estado?: true
  }

  export type ClasePracticaCountAggregateInputType = {
    id?: true
    alumnoId?: true
    profesorId?: true
    vehiculoId?: true
    fecha?: true
    duracion?: true
    estado?: true
    _all?: true
  }

  export type ClasePracticaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClasePractica to aggregate.
     */
    where?: ClasePracticaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClasePracticas to fetch.
     */
    orderBy?: ClasePracticaOrderByWithRelationInput | ClasePracticaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClasePracticaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClasePracticas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClasePracticas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClasePracticas
    **/
    _count?: true | ClasePracticaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClasePracticaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClasePracticaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClasePracticaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClasePracticaMaxAggregateInputType
  }

  export type GetClasePracticaAggregateType<T extends ClasePracticaAggregateArgs> = {
        [P in keyof T & keyof AggregateClasePractica]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClasePractica[P]>
      : GetScalarType<T[P], AggregateClasePractica[P]>
  }




  export type ClasePracticaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClasePracticaWhereInput
    orderBy?: ClasePracticaOrderByWithAggregationInput | ClasePracticaOrderByWithAggregationInput[]
    by: ClasePracticaScalarFieldEnum[] | ClasePracticaScalarFieldEnum
    having?: ClasePracticaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClasePracticaCountAggregateInputType | true
    _avg?: ClasePracticaAvgAggregateInputType
    _sum?: ClasePracticaSumAggregateInputType
    _min?: ClasePracticaMinAggregateInputType
    _max?: ClasePracticaMaxAggregateInputType
  }

  export type ClasePracticaGroupByOutputType = {
    id: string
    alumnoId: string
    profesorId: string
    vehiculoId: string
    fecha: Date
    duracion: number
    estado: string
    _count: ClasePracticaCountAggregateOutputType | null
    _avg: ClasePracticaAvgAggregateOutputType | null
    _sum: ClasePracticaSumAggregateOutputType | null
    _min: ClasePracticaMinAggregateOutputType | null
    _max: ClasePracticaMaxAggregateOutputType | null
  }

  type GetClasePracticaGroupByPayload<T extends ClasePracticaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClasePracticaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClasePracticaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClasePracticaGroupByOutputType[P]>
            : GetScalarType<T[P], ClasePracticaGroupByOutputType[P]>
        }
      >
    >


  export type ClasePracticaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumnoId?: boolean
    profesorId?: boolean
    vehiculoId?: boolean
    fecha?: boolean
    duracion?: boolean
    estado?: boolean
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
    profesor?: boolean | ProfesorDefaultArgs<ExtArgs>
    vehiculo?: boolean | VehiculoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clasePractica"]>

  export type ClasePracticaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumnoId?: boolean
    profesorId?: boolean
    vehiculoId?: boolean
    fecha?: boolean
    duracion?: boolean
    estado?: boolean
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
    profesor?: boolean | ProfesorDefaultArgs<ExtArgs>
    vehiculo?: boolean | VehiculoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clasePractica"]>

  export type ClasePracticaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumnoId?: boolean
    profesorId?: boolean
    vehiculoId?: boolean
    fecha?: boolean
    duracion?: boolean
    estado?: boolean
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
    profesor?: boolean | ProfesorDefaultArgs<ExtArgs>
    vehiculo?: boolean | VehiculoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clasePractica"]>

  export type ClasePracticaSelectScalar = {
    id?: boolean
    alumnoId?: boolean
    profesorId?: boolean
    vehiculoId?: boolean
    fecha?: boolean
    duracion?: boolean
    estado?: boolean
  }

  export type ClasePracticaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "alumnoId" | "profesorId" | "vehiculoId" | "fecha" | "duracion" | "estado", ExtArgs["result"]["clasePractica"]>
  export type ClasePracticaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
    profesor?: boolean | ProfesorDefaultArgs<ExtArgs>
    vehiculo?: boolean | VehiculoDefaultArgs<ExtArgs>
  }
  export type ClasePracticaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
    profesor?: boolean | ProfesorDefaultArgs<ExtArgs>
    vehiculo?: boolean | VehiculoDefaultArgs<ExtArgs>
  }
  export type ClasePracticaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
    profesor?: boolean | ProfesorDefaultArgs<ExtArgs>
    vehiculo?: boolean | VehiculoDefaultArgs<ExtArgs>
  }

  export type $ClasePracticaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClasePractica"
    objects: {
      alumno: Prisma.$AlumnoPayload<ExtArgs>
      profesor: Prisma.$ProfesorPayload<ExtArgs>
      vehiculo: Prisma.$VehiculoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      alumnoId: string
      profesorId: string
      vehiculoId: string
      fecha: Date
      duracion: number
      estado: string
    }, ExtArgs["result"]["clasePractica"]>
    composites: {}
  }

  type ClasePracticaGetPayload<S extends boolean | null | undefined | ClasePracticaDefaultArgs> = $Result.GetResult<Prisma.$ClasePracticaPayload, S>

  type ClasePracticaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClasePracticaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClasePracticaCountAggregateInputType | true
    }

  export interface ClasePracticaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClasePractica'], meta: { name: 'ClasePractica' } }
    /**
     * Find zero or one ClasePractica that matches the filter.
     * @param {ClasePracticaFindUniqueArgs} args - Arguments to find a ClasePractica
     * @example
     * // Get one ClasePractica
     * const clasePractica = await prisma.clasePractica.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClasePracticaFindUniqueArgs>(args: SelectSubset<T, ClasePracticaFindUniqueArgs<ExtArgs>>): Prisma__ClasePracticaClient<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClasePractica that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClasePracticaFindUniqueOrThrowArgs} args - Arguments to find a ClasePractica
     * @example
     * // Get one ClasePractica
     * const clasePractica = await prisma.clasePractica.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClasePracticaFindUniqueOrThrowArgs>(args: SelectSubset<T, ClasePracticaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClasePracticaClient<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClasePractica that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClasePracticaFindFirstArgs} args - Arguments to find a ClasePractica
     * @example
     * // Get one ClasePractica
     * const clasePractica = await prisma.clasePractica.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClasePracticaFindFirstArgs>(args?: SelectSubset<T, ClasePracticaFindFirstArgs<ExtArgs>>): Prisma__ClasePracticaClient<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClasePractica that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClasePracticaFindFirstOrThrowArgs} args - Arguments to find a ClasePractica
     * @example
     * // Get one ClasePractica
     * const clasePractica = await prisma.clasePractica.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClasePracticaFindFirstOrThrowArgs>(args?: SelectSubset<T, ClasePracticaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClasePracticaClient<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClasePracticas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClasePracticaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClasePracticas
     * const clasePracticas = await prisma.clasePractica.findMany()
     * 
     * // Get first 10 ClasePracticas
     * const clasePracticas = await prisma.clasePractica.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clasePracticaWithIdOnly = await prisma.clasePractica.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClasePracticaFindManyArgs>(args?: SelectSubset<T, ClasePracticaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClasePractica.
     * @param {ClasePracticaCreateArgs} args - Arguments to create a ClasePractica.
     * @example
     * // Create one ClasePractica
     * const ClasePractica = await prisma.clasePractica.create({
     *   data: {
     *     // ... data to create a ClasePractica
     *   }
     * })
     * 
     */
    create<T extends ClasePracticaCreateArgs>(args: SelectSubset<T, ClasePracticaCreateArgs<ExtArgs>>): Prisma__ClasePracticaClient<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClasePracticas.
     * @param {ClasePracticaCreateManyArgs} args - Arguments to create many ClasePracticas.
     * @example
     * // Create many ClasePracticas
     * const clasePractica = await prisma.clasePractica.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClasePracticaCreateManyArgs>(args?: SelectSubset<T, ClasePracticaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClasePracticas and returns the data saved in the database.
     * @param {ClasePracticaCreateManyAndReturnArgs} args - Arguments to create many ClasePracticas.
     * @example
     * // Create many ClasePracticas
     * const clasePractica = await prisma.clasePractica.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClasePracticas and only return the `id`
     * const clasePracticaWithIdOnly = await prisma.clasePractica.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClasePracticaCreateManyAndReturnArgs>(args?: SelectSubset<T, ClasePracticaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClasePractica.
     * @param {ClasePracticaDeleteArgs} args - Arguments to delete one ClasePractica.
     * @example
     * // Delete one ClasePractica
     * const ClasePractica = await prisma.clasePractica.delete({
     *   where: {
     *     // ... filter to delete one ClasePractica
     *   }
     * })
     * 
     */
    delete<T extends ClasePracticaDeleteArgs>(args: SelectSubset<T, ClasePracticaDeleteArgs<ExtArgs>>): Prisma__ClasePracticaClient<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClasePractica.
     * @param {ClasePracticaUpdateArgs} args - Arguments to update one ClasePractica.
     * @example
     * // Update one ClasePractica
     * const clasePractica = await prisma.clasePractica.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClasePracticaUpdateArgs>(args: SelectSubset<T, ClasePracticaUpdateArgs<ExtArgs>>): Prisma__ClasePracticaClient<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClasePracticas.
     * @param {ClasePracticaDeleteManyArgs} args - Arguments to filter ClasePracticas to delete.
     * @example
     * // Delete a few ClasePracticas
     * const { count } = await prisma.clasePractica.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClasePracticaDeleteManyArgs>(args?: SelectSubset<T, ClasePracticaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClasePracticas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClasePracticaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClasePracticas
     * const clasePractica = await prisma.clasePractica.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClasePracticaUpdateManyArgs>(args: SelectSubset<T, ClasePracticaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClasePracticas and returns the data updated in the database.
     * @param {ClasePracticaUpdateManyAndReturnArgs} args - Arguments to update many ClasePracticas.
     * @example
     * // Update many ClasePracticas
     * const clasePractica = await prisma.clasePractica.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClasePracticas and only return the `id`
     * const clasePracticaWithIdOnly = await prisma.clasePractica.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClasePracticaUpdateManyAndReturnArgs>(args: SelectSubset<T, ClasePracticaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClasePractica.
     * @param {ClasePracticaUpsertArgs} args - Arguments to update or create a ClasePractica.
     * @example
     * // Update or create a ClasePractica
     * const clasePractica = await prisma.clasePractica.upsert({
     *   create: {
     *     // ... data to create a ClasePractica
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClasePractica we want to update
     *   }
     * })
     */
    upsert<T extends ClasePracticaUpsertArgs>(args: SelectSubset<T, ClasePracticaUpsertArgs<ExtArgs>>): Prisma__ClasePracticaClient<$Result.GetResult<Prisma.$ClasePracticaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClasePracticas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClasePracticaCountArgs} args - Arguments to filter ClasePracticas to count.
     * @example
     * // Count the number of ClasePracticas
     * const count = await prisma.clasePractica.count({
     *   where: {
     *     // ... the filter for the ClasePracticas we want to count
     *   }
     * })
    **/
    count<T extends ClasePracticaCountArgs>(
      args?: Subset<T, ClasePracticaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClasePracticaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClasePractica.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClasePracticaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClasePracticaAggregateArgs>(args: Subset<T, ClasePracticaAggregateArgs>): Prisma.PrismaPromise<GetClasePracticaAggregateType<T>>

    /**
     * Group by ClasePractica.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClasePracticaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClasePracticaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClasePracticaGroupByArgs['orderBy'] }
        : { orderBy?: ClasePracticaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClasePracticaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClasePracticaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClasePractica model
   */
  readonly fields: ClasePracticaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClasePractica.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClasePracticaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    alumno<T extends AlumnoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AlumnoDefaultArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    profesor<T extends ProfesorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfesorDefaultArgs<ExtArgs>>): Prisma__ProfesorClient<$Result.GetResult<Prisma.$ProfesorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    vehiculo<T extends VehiculoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehiculoDefaultArgs<ExtArgs>>): Prisma__VehiculoClient<$Result.GetResult<Prisma.$VehiculoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClasePractica model
   */
  interface ClasePracticaFieldRefs {
    readonly id: FieldRef<"ClasePractica", 'String'>
    readonly alumnoId: FieldRef<"ClasePractica", 'String'>
    readonly profesorId: FieldRef<"ClasePractica", 'String'>
    readonly vehiculoId: FieldRef<"ClasePractica", 'String'>
    readonly fecha: FieldRef<"ClasePractica", 'DateTime'>
    readonly duracion: FieldRef<"ClasePractica", 'Int'>
    readonly estado: FieldRef<"ClasePractica", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ClasePractica findUnique
   */
  export type ClasePracticaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    /**
     * Filter, which ClasePractica to fetch.
     */
    where: ClasePracticaWhereUniqueInput
  }

  /**
   * ClasePractica findUniqueOrThrow
   */
  export type ClasePracticaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    /**
     * Filter, which ClasePractica to fetch.
     */
    where: ClasePracticaWhereUniqueInput
  }

  /**
   * ClasePractica findFirst
   */
  export type ClasePracticaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    /**
     * Filter, which ClasePractica to fetch.
     */
    where?: ClasePracticaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClasePracticas to fetch.
     */
    orderBy?: ClasePracticaOrderByWithRelationInput | ClasePracticaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClasePracticas.
     */
    cursor?: ClasePracticaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClasePracticas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClasePracticas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClasePracticas.
     */
    distinct?: ClasePracticaScalarFieldEnum | ClasePracticaScalarFieldEnum[]
  }

  /**
   * ClasePractica findFirstOrThrow
   */
  export type ClasePracticaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    /**
     * Filter, which ClasePractica to fetch.
     */
    where?: ClasePracticaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClasePracticas to fetch.
     */
    orderBy?: ClasePracticaOrderByWithRelationInput | ClasePracticaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClasePracticas.
     */
    cursor?: ClasePracticaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClasePracticas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClasePracticas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClasePracticas.
     */
    distinct?: ClasePracticaScalarFieldEnum | ClasePracticaScalarFieldEnum[]
  }

  /**
   * ClasePractica findMany
   */
  export type ClasePracticaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    /**
     * Filter, which ClasePracticas to fetch.
     */
    where?: ClasePracticaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClasePracticas to fetch.
     */
    orderBy?: ClasePracticaOrderByWithRelationInput | ClasePracticaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClasePracticas.
     */
    cursor?: ClasePracticaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClasePracticas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClasePracticas.
     */
    skip?: number
    distinct?: ClasePracticaScalarFieldEnum | ClasePracticaScalarFieldEnum[]
  }

  /**
   * ClasePractica create
   */
  export type ClasePracticaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    /**
     * The data needed to create a ClasePractica.
     */
    data: XOR<ClasePracticaCreateInput, ClasePracticaUncheckedCreateInput>
  }

  /**
   * ClasePractica createMany
   */
  export type ClasePracticaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClasePracticas.
     */
    data: ClasePracticaCreateManyInput | ClasePracticaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClasePractica createManyAndReturn
   */
  export type ClasePracticaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * The data used to create many ClasePracticas.
     */
    data: ClasePracticaCreateManyInput | ClasePracticaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClasePractica update
   */
  export type ClasePracticaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    /**
     * The data needed to update a ClasePractica.
     */
    data: XOR<ClasePracticaUpdateInput, ClasePracticaUncheckedUpdateInput>
    /**
     * Choose, which ClasePractica to update.
     */
    where: ClasePracticaWhereUniqueInput
  }

  /**
   * ClasePractica updateMany
   */
  export type ClasePracticaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClasePracticas.
     */
    data: XOR<ClasePracticaUpdateManyMutationInput, ClasePracticaUncheckedUpdateManyInput>
    /**
     * Filter which ClasePracticas to update
     */
    where?: ClasePracticaWhereInput
    /**
     * Limit how many ClasePracticas to update.
     */
    limit?: number
  }

  /**
   * ClasePractica updateManyAndReturn
   */
  export type ClasePracticaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * The data used to update ClasePracticas.
     */
    data: XOR<ClasePracticaUpdateManyMutationInput, ClasePracticaUncheckedUpdateManyInput>
    /**
     * Filter which ClasePracticas to update
     */
    where?: ClasePracticaWhereInput
    /**
     * Limit how many ClasePracticas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClasePractica upsert
   */
  export type ClasePracticaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    /**
     * The filter to search for the ClasePractica to update in case it exists.
     */
    where: ClasePracticaWhereUniqueInput
    /**
     * In case the ClasePractica found by the `where` argument doesn't exist, create a new ClasePractica with this data.
     */
    create: XOR<ClasePracticaCreateInput, ClasePracticaUncheckedCreateInput>
    /**
     * In case the ClasePractica was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClasePracticaUpdateInput, ClasePracticaUncheckedUpdateInput>
  }

  /**
   * ClasePractica delete
   */
  export type ClasePracticaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
    /**
     * Filter which ClasePractica to delete.
     */
    where: ClasePracticaWhereUniqueInput
  }

  /**
   * ClasePractica deleteMany
   */
  export type ClasePracticaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClasePracticas to delete
     */
    where?: ClasePracticaWhereInput
    /**
     * Limit how many ClasePracticas to delete.
     */
    limit?: number
  }

  /**
   * ClasePractica without action
   */
  export type ClasePracticaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClasePractica
     */
    select?: ClasePracticaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClasePractica
     */
    omit?: ClasePracticaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClasePracticaInclude<ExtArgs> | null
  }


  /**
   * Model Examen
   */

  export type AggregateExamen = {
    _count: ExamenCountAggregateOutputType | null
    _min: ExamenMinAggregateOutputType | null
    _max: ExamenMaxAggregateOutputType | null
  }

  export type ExamenMinAggregateOutputType = {
    id: string | null
    alumnoId: string | null
    tipo: string | null
    fecha: Date | null
    estado: string | null
  }

  export type ExamenMaxAggregateOutputType = {
    id: string | null
    alumnoId: string | null
    tipo: string | null
    fecha: Date | null
    estado: string | null
  }

  export type ExamenCountAggregateOutputType = {
    id: number
    alumnoId: number
    tipo: number
    fecha: number
    estado: number
    _all: number
  }


  export type ExamenMinAggregateInputType = {
    id?: true
    alumnoId?: true
    tipo?: true
    fecha?: true
    estado?: true
  }

  export type ExamenMaxAggregateInputType = {
    id?: true
    alumnoId?: true
    tipo?: true
    fecha?: true
    estado?: true
  }

  export type ExamenCountAggregateInputType = {
    id?: true
    alumnoId?: true
    tipo?: true
    fecha?: true
    estado?: true
    _all?: true
  }

  export type ExamenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Examen to aggregate.
     */
    where?: ExamenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Examen to fetch.
     */
    orderBy?: ExamenOrderByWithRelationInput | ExamenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Examen from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Examen.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Examen
    **/
    _count?: true | ExamenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamenMaxAggregateInputType
  }

  export type GetExamenAggregateType<T extends ExamenAggregateArgs> = {
        [P in keyof T & keyof AggregateExamen]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExamen[P]>
      : GetScalarType<T[P], AggregateExamen[P]>
  }




  export type ExamenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamenWhereInput
    orderBy?: ExamenOrderByWithAggregationInput | ExamenOrderByWithAggregationInput[]
    by: ExamenScalarFieldEnum[] | ExamenScalarFieldEnum
    having?: ExamenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamenCountAggregateInputType | true
    _min?: ExamenMinAggregateInputType
    _max?: ExamenMaxAggregateInputType
  }

  export type ExamenGroupByOutputType = {
    id: string
    alumnoId: string
    tipo: string
    fecha: Date
    estado: string
    _count: ExamenCountAggregateOutputType | null
    _min: ExamenMinAggregateOutputType | null
    _max: ExamenMaxAggregateOutputType | null
  }

  type GetExamenGroupByPayload<T extends ExamenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamenGroupByOutputType[P]>
            : GetScalarType<T[P], ExamenGroupByOutputType[P]>
        }
      >
    >


  export type ExamenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumnoId?: boolean
    tipo?: boolean
    fecha?: boolean
    estado?: boolean
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examen"]>

  export type ExamenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumnoId?: boolean
    tipo?: boolean
    fecha?: boolean
    estado?: boolean
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examen"]>

  export type ExamenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumnoId?: boolean
    tipo?: boolean
    fecha?: boolean
    estado?: boolean
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examen"]>

  export type ExamenSelectScalar = {
    id?: boolean
    alumnoId?: boolean
    tipo?: boolean
    fecha?: boolean
    estado?: boolean
  }

  export type ExamenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "alumnoId" | "tipo" | "fecha" | "estado", ExtArgs["result"]["examen"]>
  export type ExamenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }
  export type ExamenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }
  export type ExamenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }

  export type $ExamenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Examen"
    objects: {
      alumno: Prisma.$AlumnoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      alumnoId: string
      tipo: string
      fecha: Date
      estado: string
    }, ExtArgs["result"]["examen"]>
    composites: {}
  }

  type ExamenGetPayload<S extends boolean | null | undefined | ExamenDefaultArgs> = $Result.GetResult<Prisma.$ExamenPayload, S>

  type ExamenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExamenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExamenCountAggregateInputType | true
    }

  export interface ExamenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Examen'], meta: { name: 'Examen' } }
    /**
     * Find zero or one Examen that matches the filter.
     * @param {ExamenFindUniqueArgs} args - Arguments to find a Examen
     * @example
     * // Get one Examen
     * const examen = await prisma.examen.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamenFindUniqueArgs>(args: SelectSubset<T, ExamenFindUniqueArgs<ExtArgs>>): Prisma__ExamenClient<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Examen that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExamenFindUniqueOrThrowArgs} args - Arguments to find a Examen
     * @example
     * // Get one Examen
     * const examen = await prisma.examen.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamenFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamenClient<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Examen that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamenFindFirstArgs} args - Arguments to find a Examen
     * @example
     * // Get one Examen
     * const examen = await prisma.examen.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamenFindFirstArgs>(args?: SelectSubset<T, ExamenFindFirstArgs<ExtArgs>>): Prisma__ExamenClient<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Examen that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamenFindFirstOrThrowArgs} args - Arguments to find a Examen
     * @example
     * // Get one Examen
     * const examen = await prisma.examen.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamenFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamenFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamenClient<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Examen that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Examen
     * const examen = await prisma.examen.findMany()
     * 
     * // Get first 10 Examen
     * const examen = await prisma.examen.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examenWithIdOnly = await prisma.examen.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamenFindManyArgs>(args?: SelectSubset<T, ExamenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Examen.
     * @param {ExamenCreateArgs} args - Arguments to create a Examen.
     * @example
     * // Create one Examen
     * const Examen = await prisma.examen.create({
     *   data: {
     *     // ... data to create a Examen
     *   }
     * })
     * 
     */
    create<T extends ExamenCreateArgs>(args: SelectSubset<T, ExamenCreateArgs<ExtArgs>>): Prisma__ExamenClient<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Examen.
     * @param {ExamenCreateManyArgs} args - Arguments to create many Examen.
     * @example
     * // Create many Examen
     * const examen = await prisma.examen.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamenCreateManyArgs>(args?: SelectSubset<T, ExamenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Examen and returns the data saved in the database.
     * @param {ExamenCreateManyAndReturnArgs} args - Arguments to create many Examen.
     * @example
     * // Create many Examen
     * const examen = await prisma.examen.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Examen and only return the `id`
     * const examenWithIdOnly = await prisma.examen.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamenCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Examen.
     * @param {ExamenDeleteArgs} args - Arguments to delete one Examen.
     * @example
     * // Delete one Examen
     * const Examen = await prisma.examen.delete({
     *   where: {
     *     // ... filter to delete one Examen
     *   }
     * })
     * 
     */
    delete<T extends ExamenDeleteArgs>(args: SelectSubset<T, ExamenDeleteArgs<ExtArgs>>): Prisma__ExamenClient<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Examen.
     * @param {ExamenUpdateArgs} args - Arguments to update one Examen.
     * @example
     * // Update one Examen
     * const examen = await prisma.examen.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamenUpdateArgs>(args: SelectSubset<T, ExamenUpdateArgs<ExtArgs>>): Prisma__ExamenClient<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Examen.
     * @param {ExamenDeleteManyArgs} args - Arguments to filter Examen to delete.
     * @example
     * // Delete a few Examen
     * const { count } = await prisma.examen.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamenDeleteManyArgs>(args?: SelectSubset<T, ExamenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Examen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Examen
     * const examen = await prisma.examen.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamenUpdateManyArgs>(args: SelectSubset<T, ExamenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Examen and returns the data updated in the database.
     * @param {ExamenUpdateManyAndReturnArgs} args - Arguments to update many Examen.
     * @example
     * // Update many Examen
     * const examen = await prisma.examen.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Examen and only return the `id`
     * const examenWithIdOnly = await prisma.examen.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExamenUpdateManyAndReturnArgs>(args: SelectSubset<T, ExamenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Examen.
     * @param {ExamenUpsertArgs} args - Arguments to update or create a Examen.
     * @example
     * // Update or create a Examen
     * const examen = await prisma.examen.upsert({
     *   create: {
     *     // ... data to create a Examen
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Examen we want to update
     *   }
     * })
     */
    upsert<T extends ExamenUpsertArgs>(args: SelectSubset<T, ExamenUpsertArgs<ExtArgs>>): Prisma__ExamenClient<$Result.GetResult<Prisma.$ExamenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Examen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamenCountArgs} args - Arguments to filter Examen to count.
     * @example
     * // Count the number of Examen
     * const count = await prisma.examen.count({
     *   where: {
     *     // ... the filter for the Examen we want to count
     *   }
     * })
    **/
    count<T extends ExamenCountArgs>(
      args?: Subset<T, ExamenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Examen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExamenAggregateArgs>(args: Subset<T, ExamenAggregateArgs>): Prisma.PrismaPromise<GetExamenAggregateType<T>>

    /**
     * Group by Examen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExamenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamenGroupByArgs['orderBy'] }
        : { orderBy?: ExamenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExamenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Examen model
   */
  readonly fields: ExamenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Examen.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    alumno<T extends AlumnoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AlumnoDefaultArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Examen model
   */
  interface ExamenFieldRefs {
    readonly id: FieldRef<"Examen", 'String'>
    readonly alumnoId: FieldRef<"Examen", 'String'>
    readonly tipo: FieldRef<"Examen", 'String'>
    readonly fecha: FieldRef<"Examen", 'DateTime'>
    readonly estado: FieldRef<"Examen", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Examen findUnique
   */
  export type ExamenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    /**
     * Filter, which Examen to fetch.
     */
    where: ExamenWhereUniqueInput
  }

  /**
   * Examen findUniqueOrThrow
   */
  export type ExamenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    /**
     * Filter, which Examen to fetch.
     */
    where: ExamenWhereUniqueInput
  }

  /**
   * Examen findFirst
   */
  export type ExamenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    /**
     * Filter, which Examen to fetch.
     */
    where?: ExamenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Examen to fetch.
     */
    orderBy?: ExamenOrderByWithRelationInput | ExamenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Examen.
     */
    cursor?: ExamenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Examen from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Examen.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Examen.
     */
    distinct?: ExamenScalarFieldEnum | ExamenScalarFieldEnum[]
  }

  /**
   * Examen findFirstOrThrow
   */
  export type ExamenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    /**
     * Filter, which Examen to fetch.
     */
    where?: ExamenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Examen to fetch.
     */
    orderBy?: ExamenOrderByWithRelationInput | ExamenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Examen.
     */
    cursor?: ExamenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Examen from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Examen.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Examen.
     */
    distinct?: ExamenScalarFieldEnum | ExamenScalarFieldEnum[]
  }

  /**
   * Examen findMany
   */
  export type ExamenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    /**
     * Filter, which Examen to fetch.
     */
    where?: ExamenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Examen to fetch.
     */
    orderBy?: ExamenOrderByWithRelationInput | ExamenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Examen.
     */
    cursor?: ExamenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Examen from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Examen.
     */
    skip?: number
    distinct?: ExamenScalarFieldEnum | ExamenScalarFieldEnum[]
  }

  /**
   * Examen create
   */
  export type ExamenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    /**
     * The data needed to create a Examen.
     */
    data: XOR<ExamenCreateInput, ExamenUncheckedCreateInput>
  }

  /**
   * Examen createMany
   */
  export type ExamenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Examen.
     */
    data: ExamenCreateManyInput | ExamenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Examen createManyAndReturn
   */
  export type ExamenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * The data used to create many Examen.
     */
    data: ExamenCreateManyInput | ExamenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Examen update
   */
  export type ExamenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    /**
     * The data needed to update a Examen.
     */
    data: XOR<ExamenUpdateInput, ExamenUncheckedUpdateInput>
    /**
     * Choose, which Examen to update.
     */
    where: ExamenWhereUniqueInput
  }

  /**
   * Examen updateMany
   */
  export type ExamenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Examen.
     */
    data: XOR<ExamenUpdateManyMutationInput, ExamenUncheckedUpdateManyInput>
    /**
     * Filter which Examen to update
     */
    where?: ExamenWhereInput
    /**
     * Limit how many Examen to update.
     */
    limit?: number
  }

  /**
   * Examen updateManyAndReturn
   */
  export type ExamenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * The data used to update Examen.
     */
    data: XOR<ExamenUpdateManyMutationInput, ExamenUncheckedUpdateManyInput>
    /**
     * Filter which Examen to update
     */
    where?: ExamenWhereInput
    /**
     * Limit how many Examen to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Examen upsert
   */
  export type ExamenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    /**
     * The filter to search for the Examen to update in case it exists.
     */
    where: ExamenWhereUniqueInput
    /**
     * In case the Examen found by the `where` argument doesn't exist, create a new Examen with this data.
     */
    create: XOR<ExamenCreateInput, ExamenUncheckedCreateInput>
    /**
     * In case the Examen was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamenUpdateInput, ExamenUncheckedUpdateInput>
  }

  /**
   * Examen delete
   */
  export type ExamenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
    /**
     * Filter which Examen to delete.
     */
    where: ExamenWhereUniqueInput
  }

  /**
   * Examen deleteMany
   */
  export type ExamenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Examen to delete
     */
    where?: ExamenWhereInput
    /**
     * Limit how many Examen to delete.
     */
    limit?: number
  }

  /**
   * Examen without action
   */
  export type ExamenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Examen
     */
    select?: ExamenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Examen
     */
    omit?: ExamenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamenInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsuarioScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    email: 'email',
    passwordHash: 'passwordHash',
    rol: 'rol',
    fechaCreacion: 'fechaCreacion'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const ProfesorScalarFieldEnum: {
    id: 'id',
    licenciaConducir: 'licenciaConducir',
    telefono: 'telefono',
    activo: 'activo'
  };

  export type ProfesorScalarFieldEnum = (typeof ProfesorScalarFieldEnum)[keyof typeof ProfesorScalarFieldEnum]


  export const AlumnoScalarFieldEnum: {
    id: 'id',
    tipoLicenciaObjetivo: 'tipoLicenciaObjetivo',
    horasPracticasCompletadas: 'horasPracticasCompletadas',
    profesorAsignadoId: 'profesorAsignadoId'
  };

  export type AlumnoScalarFieldEnum = (typeof AlumnoScalarFieldEnum)[keyof typeof AlumnoScalarFieldEnum]


  export const VehiculoScalarFieldEnum: {
    id: 'id',
    matricula: 'matricula',
    marca: 'marca',
    modelo: 'modelo',
    tipoPermiso: 'tipoPermiso',
    activo: 'activo'
  };

  export type VehiculoScalarFieldEnum = (typeof VehiculoScalarFieldEnum)[keyof typeof VehiculoScalarFieldEnum]


  export const ClasePracticaScalarFieldEnum: {
    id: 'id',
    alumnoId: 'alumnoId',
    profesorId: 'profesorId',
    vehiculoId: 'vehiculoId',
    fecha: 'fecha',
    duracion: 'duracion',
    estado: 'estado'
  };

  export type ClasePracticaScalarFieldEnum = (typeof ClasePracticaScalarFieldEnum)[keyof typeof ClasePracticaScalarFieldEnum]


  export const ExamenScalarFieldEnum: {
    id: 'id',
    alumnoId: 'alumnoId',
    tipo: 'tipo',
    fecha: 'fecha',
    estado: 'estado'
  };

  export type ExamenScalarFieldEnum = (typeof ExamenScalarFieldEnum)[keyof typeof ExamenScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Rol'
   */
  export type EnumRolFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Rol'>
    


  /**
   * Reference to a field of type 'Rol[]'
   */
  export type ListEnumRolFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Rol[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    id?: StringFilter<"Usuario"> | string
    nombre?: StringFilter<"Usuario"> | string
    email?: StringFilter<"Usuario"> | string
    passwordHash?: StringFilter<"Usuario"> | string
    rol?: EnumRolFilter<"Usuario"> | $Enums.Rol
    fechaCreacion?: DateTimeFilter<"Usuario"> | Date | string
    alumno?: XOR<AlumnoNullableScalarRelationFilter, AlumnoWhereInput> | null
    profesor?: XOR<ProfesorNullableScalarRelationFilter, ProfesorWhereInput> | null
  }

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    rol?: SortOrder
    fechaCreacion?: SortOrder
    alumno?: AlumnoOrderByWithRelationInput
    profesor?: ProfesorOrderByWithRelationInput
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    nombre?: StringFilter<"Usuario"> | string
    passwordHash?: StringFilter<"Usuario"> | string
    rol?: EnumRolFilter<"Usuario"> | $Enums.Rol
    fechaCreacion?: DateTimeFilter<"Usuario"> | Date | string
    alumno?: XOR<AlumnoNullableScalarRelationFilter, AlumnoWhereInput> | null
    profesor?: XOR<ProfesorNullableScalarRelationFilter, ProfesorWhereInput> | null
  }, "id" | "email">

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    rol?: SortOrder
    fechaCreacion?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Usuario"> | string
    nombre?: StringWithAggregatesFilter<"Usuario"> | string
    email?: StringWithAggregatesFilter<"Usuario"> | string
    passwordHash?: StringWithAggregatesFilter<"Usuario"> | string
    rol?: EnumRolWithAggregatesFilter<"Usuario"> | $Enums.Rol
    fechaCreacion?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
  }

  export type ProfesorWhereInput = {
    AND?: ProfesorWhereInput | ProfesorWhereInput[]
    OR?: ProfesorWhereInput[]
    NOT?: ProfesorWhereInput | ProfesorWhereInput[]
    id?: StringFilter<"Profesor"> | string
    licenciaConducir?: StringFilter<"Profesor"> | string
    telefono?: StringFilter<"Profesor"> | string
    activo?: BoolFilter<"Profesor"> | boolean
    alumnosAsignados?: AlumnoListRelationFilter
    clases?: ClasePracticaListRelationFilter
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }

  export type ProfesorOrderByWithRelationInput = {
    id?: SortOrder
    licenciaConducir?: SortOrder
    telefono?: SortOrder
    activo?: SortOrder
    alumnosAsignados?: AlumnoOrderByRelationAggregateInput
    clases?: ClasePracticaOrderByRelationAggregateInput
    usuario?: UsuarioOrderByWithRelationInput
  }

  export type ProfesorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfesorWhereInput | ProfesorWhereInput[]
    OR?: ProfesorWhereInput[]
    NOT?: ProfesorWhereInput | ProfesorWhereInput[]
    licenciaConducir?: StringFilter<"Profesor"> | string
    telefono?: StringFilter<"Profesor"> | string
    activo?: BoolFilter<"Profesor"> | boolean
    alumnosAsignados?: AlumnoListRelationFilter
    clases?: ClasePracticaListRelationFilter
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }, "id">

  export type ProfesorOrderByWithAggregationInput = {
    id?: SortOrder
    licenciaConducir?: SortOrder
    telefono?: SortOrder
    activo?: SortOrder
    _count?: ProfesorCountOrderByAggregateInput
    _max?: ProfesorMaxOrderByAggregateInput
    _min?: ProfesorMinOrderByAggregateInput
  }

  export type ProfesorScalarWhereWithAggregatesInput = {
    AND?: ProfesorScalarWhereWithAggregatesInput | ProfesorScalarWhereWithAggregatesInput[]
    OR?: ProfesorScalarWhereWithAggregatesInput[]
    NOT?: ProfesorScalarWhereWithAggregatesInput | ProfesorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Profesor"> | string
    licenciaConducir?: StringWithAggregatesFilter<"Profesor"> | string
    telefono?: StringWithAggregatesFilter<"Profesor"> | string
    activo?: BoolWithAggregatesFilter<"Profesor"> | boolean
  }

  export type AlumnoWhereInput = {
    AND?: AlumnoWhereInput | AlumnoWhereInput[]
    OR?: AlumnoWhereInput[]
    NOT?: AlumnoWhereInput | AlumnoWhereInput[]
    id?: StringFilter<"Alumno"> | string
    tipoLicenciaObjetivo?: StringFilter<"Alumno"> | string
    horasPracticasCompletadas?: IntFilter<"Alumno"> | number
    profesorAsignadoId?: StringNullableFilter<"Alumno"> | string | null
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    profesorAsignado?: XOR<ProfesorNullableScalarRelationFilter, ProfesorWhereInput> | null
    clases?: ClasePracticaListRelationFilter
    examenes?: ExamenListRelationFilter
  }

  export type AlumnoOrderByWithRelationInput = {
    id?: SortOrder
    tipoLicenciaObjetivo?: SortOrder
    horasPracticasCompletadas?: SortOrder
    profesorAsignadoId?: SortOrderInput | SortOrder
    usuario?: UsuarioOrderByWithRelationInput
    profesorAsignado?: ProfesorOrderByWithRelationInput
    clases?: ClasePracticaOrderByRelationAggregateInput
    examenes?: ExamenOrderByRelationAggregateInput
  }

  export type AlumnoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AlumnoWhereInput | AlumnoWhereInput[]
    OR?: AlumnoWhereInput[]
    NOT?: AlumnoWhereInput | AlumnoWhereInput[]
    tipoLicenciaObjetivo?: StringFilter<"Alumno"> | string
    horasPracticasCompletadas?: IntFilter<"Alumno"> | number
    profesorAsignadoId?: StringNullableFilter<"Alumno"> | string | null
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    profesorAsignado?: XOR<ProfesorNullableScalarRelationFilter, ProfesorWhereInput> | null
    clases?: ClasePracticaListRelationFilter
    examenes?: ExamenListRelationFilter
  }, "id">

  export type AlumnoOrderByWithAggregationInput = {
    id?: SortOrder
    tipoLicenciaObjetivo?: SortOrder
    horasPracticasCompletadas?: SortOrder
    profesorAsignadoId?: SortOrderInput | SortOrder
    _count?: AlumnoCountOrderByAggregateInput
    _avg?: AlumnoAvgOrderByAggregateInput
    _max?: AlumnoMaxOrderByAggregateInput
    _min?: AlumnoMinOrderByAggregateInput
    _sum?: AlumnoSumOrderByAggregateInput
  }

  export type AlumnoScalarWhereWithAggregatesInput = {
    AND?: AlumnoScalarWhereWithAggregatesInput | AlumnoScalarWhereWithAggregatesInput[]
    OR?: AlumnoScalarWhereWithAggregatesInput[]
    NOT?: AlumnoScalarWhereWithAggregatesInput | AlumnoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Alumno"> | string
    tipoLicenciaObjetivo?: StringWithAggregatesFilter<"Alumno"> | string
    horasPracticasCompletadas?: IntWithAggregatesFilter<"Alumno"> | number
    profesorAsignadoId?: StringNullableWithAggregatesFilter<"Alumno"> | string | null
  }

  export type VehiculoWhereInput = {
    AND?: VehiculoWhereInput | VehiculoWhereInput[]
    OR?: VehiculoWhereInput[]
    NOT?: VehiculoWhereInput | VehiculoWhereInput[]
    id?: StringFilter<"Vehiculo"> | string
    matricula?: StringFilter<"Vehiculo"> | string
    marca?: StringNullableFilter<"Vehiculo"> | string | null
    modelo?: StringNullableFilter<"Vehiculo"> | string | null
    tipoPermiso?: StringFilter<"Vehiculo"> | string
    activo?: BoolFilter<"Vehiculo"> | boolean
    clases?: ClasePracticaListRelationFilter
  }

  export type VehiculoOrderByWithRelationInput = {
    id?: SortOrder
    matricula?: SortOrder
    marca?: SortOrderInput | SortOrder
    modelo?: SortOrderInput | SortOrder
    tipoPermiso?: SortOrder
    activo?: SortOrder
    clases?: ClasePracticaOrderByRelationAggregateInput
  }

  export type VehiculoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    matricula?: string
    AND?: VehiculoWhereInput | VehiculoWhereInput[]
    OR?: VehiculoWhereInput[]
    NOT?: VehiculoWhereInput | VehiculoWhereInput[]
    marca?: StringNullableFilter<"Vehiculo"> | string | null
    modelo?: StringNullableFilter<"Vehiculo"> | string | null
    tipoPermiso?: StringFilter<"Vehiculo"> | string
    activo?: BoolFilter<"Vehiculo"> | boolean
    clases?: ClasePracticaListRelationFilter
  }, "id" | "matricula">

  export type VehiculoOrderByWithAggregationInput = {
    id?: SortOrder
    matricula?: SortOrder
    marca?: SortOrderInput | SortOrder
    modelo?: SortOrderInput | SortOrder
    tipoPermiso?: SortOrder
    activo?: SortOrder
    _count?: VehiculoCountOrderByAggregateInput
    _max?: VehiculoMaxOrderByAggregateInput
    _min?: VehiculoMinOrderByAggregateInput
  }

  export type VehiculoScalarWhereWithAggregatesInput = {
    AND?: VehiculoScalarWhereWithAggregatesInput | VehiculoScalarWhereWithAggregatesInput[]
    OR?: VehiculoScalarWhereWithAggregatesInput[]
    NOT?: VehiculoScalarWhereWithAggregatesInput | VehiculoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vehiculo"> | string
    matricula?: StringWithAggregatesFilter<"Vehiculo"> | string
    marca?: StringNullableWithAggregatesFilter<"Vehiculo"> | string | null
    modelo?: StringNullableWithAggregatesFilter<"Vehiculo"> | string | null
    tipoPermiso?: StringWithAggregatesFilter<"Vehiculo"> | string
    activo?: BoolWithAggregatesFilter<"Vehiculo"> | boolean
  }

  export type ClasePracticaWhereInput = {
    AND?: ClasePracticaWhereInput | ClasePracticaWhereInput[]
    OR?: ClasePracticaWhereInput[]
    NOT?: ClasePracticaWhereInput | ClasePracticaWhereInput[]
    id?: StringFilter<"ClasePractica"> | string
    alumnoId?: StringFilter<"ClasePractica"> | string
    profesorId?: StringFilter<"ClasePractica"> | string
    vehiculoId?: StringFilter<"ClasePractica"> | string
    fecha?: DateTimeFilter<"ClasePractica"> | Date | string
    duracion?: IntFilter<"ClasePractica"> | number
    estado?: StringFilter<"ClasePractica"> | string
    alumno?: XOR<AlumnoScalarRelationFilter, AlumnoWhereInput>
    profesor?: XOR<ProfesorScalarRelationFilter, ProfesorWhereInput>
    vehiculo?: XOR<VehiculoScalarRelationFilter, VehiculoWhereInput>
  }

  export type ClasePracticaOrderByWithRelationInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    profesorId?: SortOrder
    vehiculoId?: SortOrder
    fecha?: SortOrder
    duracion?: SortOrder
    estado?: SortOrder
    alumno?: AlumnoOrderByWithRelationInput
    profesor?: ProfesorOrderByWithRelationInput
    vehiculo?: VehiculoOrderByWithRelationInput
  }

  export type ClasePracticaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClasePracticaWhereInput | ClasePracticaWhereInput[]
    OR?: ClasePracticaWhereInput[]
    NOT?: ClasePracticaWhereInput | ClasePracticaWhereInput[]
    alumnoId?: StringFilter<"ClasePractica"> | string
    profesorId?: StringFilter<"ClasePractica"> | string
    vehiculoId?: StringFilter<"ClasePractica"> | string
    fecha?: DateTimeFilter<"ClasePractica"> | Date | string
    duracion?: IntFilter<"ClasePractica"> | number
    estado?: StringFilter<"ClasePractica"> | string
    alumno?: XOR<AlumnoScalarRelationFilter, AlumnoWhereInput>
    profesor?: XOR<ProfesorScalarRelationFilter, ProfesorWhereInput>
    vehiculo?: XOR<VehiculoScalarRelationFilter, VehiculoWhereInput>
  }, "id">

  export type ClasePracticaOrderByWithAggregationInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    profesorId?: SortOrder
    vehiculoId?: SortOrder
    fecha?: SortOrder
    duracion?: SortOrder
    estado?: SortOrder
    _count?: ClasePracticaCountOrderByAggregateInput
    _avg?: ClasePracticaAvgOrderByAggregateInput
    _max?: ClasePracticaMaxOrderByAggregateInput
    _min?: ClasePracticaMinOrderByAggregateInput
    _sum?: ClasePracticaSumOrderByAggregateInput
  }

  export type ClasePracticaScalarWhereWithAggregatesInput = {
    AND?: ClasePracticaScalarWhereWithAggregatesInput | ClasePracticaScalarWhereWithAggregatesInput[]
    OR?: ClasePracticaScalarWhereWithAggregatesInput[]
    NOT?: ClasePracticaScalarWhereWithAggregatesInput | ClasePracticaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClasePractica"> | string
    alumnoId?: StringWithAggregatesFilter<"ClasePractica"> | string
    profesorId?: StringWithAggregatesFilter<"ClasePractica"> | string
    vehiculoId?: StringWithAggregatesFilter<"ClasePractica"> | string
    fecha?: DateTimeWithAggregatesFilter<"ClasePractica"> | Date | string
    duracion?: IntWithAggregatesFilter<"ClasePractica"> | number
    estado?: StringWithAggregatesFilter<"ClasePractica"> | string
  }

  export type ExamenWhereInput = {
    AND?: ExamenWhereInput | ExamenWhereInput[]
    OR?: ExamenWhereInput[]
    NOT?: ExamenWhereInput | ExamenWhereInput[]
    id?: StringFilter<"Examen"> | string
    alumnoId?: StringFilter<"Examen"> | string
    tipo?: StringFilter<"Examen"> | string
    fecha?: DateTimeFilter<"Examen"> | Date | string
    estado?: StringFilter<"Examen"> | string
    alumno?: XOR<AlumnoScalarRelationFilter, AlumnoWhereInput>
  }

  export type ExamenOrderByWithRelationInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    tipo?: SortOrder
    fecha?: SortOrder
    estado?: SortOrder
    alumno?: AlumnoOrderByWithRelationInput
  }

  export type ExamenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExamenWhereInput | ExamenWhereInput[]
    OR?: ExamenWhereInput[]
    NOT?: ExamenWhereInput | ExamenWhereInput[]
    alumnoId?: StringFilter<"Examen"> | string
    tipo?: StringFilter<"Examen"> | string
    fecha?: DateTimeFilter<"Examen"> | Date | string
    estado?: StringFilter<"Examen"> | string
    alumno?: XOR<AlumnoScalarRelationFilter, AlumnoWhereInput>
  }, "id">

  export type ExamenOrderByWithAggregationInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    tipo?: SortOrder
    fecha?: SortOrder
    estado?: SortOrder
    _count?: ExamenCountOrderByAggregateInput
    _max?: ExamenMaxOrderByAggregateInput
    _min?: ExamenMinOrderByAggregateInput
  }

  export type ExamenScalarWhereWithAggregatesInput = {
    AND?: ExamenScalarWhereWithAggregatesInput | ExamenScalarWhereWithAggregatesInput[]
    OR?: ExamenScalarWhereWithAggregatesInput[]
    NOT?: ExamenScalarWhereWithAggregatesInput | ExamenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Examen"> | string
    alumnoId?: StringWithAggregatesFilter<"Examen"> | string
    tipo?: StringWithAggregatesFilter<"Examen"> | string
    fecha?: DateTimeWithAggregatesFilter<"Examen"> | Date | string
    estado?: StringWithAggregatesFilter<"Examen"> | string
  }

  export type UsuarioCreateInput = {
    id?: string
    nombre: string
    email: string
    passwordHash: string
    rol: $Enums.Rol
    fechaCreacion?: Date | string
    alumno?: AlumnoCreateNestedOneWithoutUsuarioInput
    profesor?: ProfesorCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateInput = {
    id?: string
    nombre: string
    email: string
    passwordHash: string
    rol: $Enums.Rol
    fechaCreacion?: Date | string
    alumno?: AlumnoUncheckedCreateNestedOneWithoutUsuarioInput
    profesor?: ProfesorUncheckedCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    alumno?: AlumnoUpdateOneWithoutUsuarioNestedInput
    profesor?: ProfesorUpdateOneWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    alumno?: AlumnoUncheckedUpdateOneWithoutUsuarioNestedInput
    profesor?: ProfesorUncheckedUpdateOneWithoutUsuarioNestedInput
  }

  export type UsuarioCreateManyInput = {
    id?: string
    nombre: string
    email: string
    passwordHash: string
    rol: $Enums.Rol
    fechaCreacion?: Date | string
  }

  export type UsuarioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfesorCreateInput = {
    licenciaConducir: string
    telefono: string
    activo?: boolean
    alumnosAsignados?: AlumnoCreateNestedManyWithoutProfesorAsignadoInput
    clases?: ClasePracticaCreateNestedManyWithoutProfesorInput
    usuario: UsuarioCreateNestedOneWithoutProfesorInput
  }

  export type ProfesorUncheckedCreateInput = {
    id: string
    licenciaConducir: string
    telefono: string
    activo?: boolean
    alumnosAsignados?: AlumnoUncheckedCreateNestedManyWithoutProfesorAsignadoInput
    clases?: ClasePracticaUncheckedCreateNestedManyWithoutProfesorInput
  }

  export type ProfesorUpdateInput = {
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    alumnosAsignados?: AlumnoUpdateManyWithoutProfesorAsignadoNestedInput
    clases?: ClasePracticaUpdateManyWithoutProfesorNestedInput
    usuario?: UsuarioUpdateOneRequiredWithoutProfesorNestedInput
  }

  export type ProfesorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    alumnosAsignados?: AlumnoUncheckedUpdateManyWithoutProfesorAsignadoNestedInput
    clases?: ClasePracticaUncheckedUpdateManyWithoutProfesorNestedInput
  }

  export type ProfesorCreateManyInput = {
    id: string
    licenciaConducir: string
    telefono: string
    activo?: boolean
  }

  export type ProfesorUpdateManyMutationInput = {
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfesorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AlumnoCreateInput = {
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    usuario: UsuarioCreateNestedOneWithoutAlumnoInput
    profesorAsignado?: ProfesorCreateNestedOneWithoutAlumnosAsignadosInput
    clases?: ClasePracticaCreateNestedManyWithoutAlumnoInput
    examenes?: ExamenCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateInput = {
    id: string
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    profesorAsignadoId?: string | null
    clases?: ClasePracticaUncheckedCreateNestedManyWithoutAlumnoInput
    examenes?: ExamenUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUpdateInput = {
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    usuario?: UsuarioUpdateOneRequiredWithoutAlumnoNestedInput
    profesorAsignado?: ProfesorUpdateOneWithoutAlumnosAsignadosNestedInput
    clases?: ClasePracticaUpdateManyWithoutAlumnoNestedInput
    examenes?: ExamenUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    profesorAsignadoId?: NullableStringFieldUpdateOperationsInput | string | null
    clases?: ClasePracticaUncheckedUpdateManyWithoutAlumnoNestedInput
    examenes?: ExamenUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoCreateManyInput = {
    id: string
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    profesorAsignadoId?: string | null
  }

  export type AlumnoUpdateManyMutationInput = {
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
  }

  export type AlumnoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    profesorAsignadoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VehiculoCreateInput = {
    id?: string
    matricula: string
    marca?: string | null
    modelo?: string | null
    tipoPermiso: string
    activo?: boolean
    clases?: ClasePracticaCreateNestedManyWithoutVehiculoInput
  }

  export type VehiculoUncheckedCreateInput = {
    id?: string
    matricula: string
    marca?: string | null
    modelo?: string | null
    tipoPermiso: string
    activo?: boolean
    clases?: ClasePracticaUncheckedCreateNestedManyWithoutVehiculoInput
  }

  export type VehiculoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matricula?: StringFieldUpdateOperationsInput | string
    marca?: NullableStringFieldUpdateOperationsInput | string | null
    modelo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoPermiso?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    clases?: ClasePracticaUpdateManyWithoutVehiculoNestedInput
  }

  export type VehiculoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matricula?: StringFieldUpdateOperationsInput | string
    marca?: NullableStringFieldUpdateOperationsInput | string | null
    modelo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoPermiso?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    clases?: ClasePracticaUncheckedUpdateManyWithoutVehiculoNestedInput
  }

  export type VehiculoCreateManyInput = {
    id?: string
    matricula: string
    marca?: string | null
    modelo?: string | null
    tipoPermiso: string
    activo?: boolean
  }

  export type VehiculoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    matricula?: StringFieldUpdateOperationsInput | string
    marca?: NullableStringFieldUpdateOperationsInput | string | null
    modelo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoPermiso?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VehiculoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matricula?: StringFieldUpdateOperationsInput | string
    marca?: NullableStringFieldUpdateOperationsInput | string | null
    modelo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoPermiso?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ClasePracticaCreateInput = {
    id?: string
    fecha: Date | string
    duracion: number
    estado: string
    alumno: AlumnoCreateNestedOneWithoutClasesInput
    profesor: ProfesorCreateNestedOneWithoutClasesInput
    vehiculo: VehiculoCreateNestedOneWithoutClasesInput
  }

  export type ClasePracticaUncheckedCreateInput = {
    id?: string
    alumnoId: string
    profesorId: string
    vehiculoId: string
    fecha: Date | string
    duracion: number
    estado: string
  }

  export type ClasePracticaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    alumno?: AlumnoUpdateOneRequiredWithoutClasesNestedInput
    profesor?: ProfesorUpdateOneRequiredWithoutClasesNestedInput
    vehiculo?: VehiculoUpdateOneRequiredWithoutClasesNestedInput
  }

  export type ClasePracticaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    alumnoId?: StringFieldUpdateOperationsInput | string
    profesorId?: StringFieldUpdateOperationsInput | string
    vehiculoId?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ClasePracticaCreateManyInput = {
    id?: string
    alumnoId: string
    profesorId: string
    vehiculoId: string
    fecha: Date | string
    duracion: number
    estado: string
  }

  export type ClasePracticaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ClasePracticaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    alumnoId?: StringFieldUpdateOperationsInput | string
    profesorId?: StringFieldUpdateOperationsInput | string
    vehiculoId?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ExamenCreateInput = {
    id?: string
    tipo: string
    fecha: Date | string
    estado: string
    alumno: AlumnoCreateNestedOneWithoutExamenesInput
  }

  export type ExamenUncheckedCreateInput = {
    id?: string
    alumnoId: string
    tipo: string
    fecha: Date | string
    estado: string
  }

  export type ExamenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
    alumno?: AlumnoUpdateOneRequiredWithoutExamenesNestedInput
  }

  export type ExamenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    alumnoId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ExamenCreateManyInput = {
    id?: string
    alumnoId: string
    tipo: string
    fecha: Date | string
    estado: string
  }

  export type ExamenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ExamenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    alumnoId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRolFilter<$PrismaModel = never> = {
    equals?: $Enums.Rol | EnumRolFieldRefInput<$PrismaModel>
    in?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>
    not?: NestedEnumRolFilter<$PrismaModel> | $Enums.Rol
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AlumnoNullableScalarRelationFilter = {
    is?: AlumnoWhereInput | null
    isNot?: AlumnoWhereInput | null
  }

  export type ProfesorNullableScalarRelationFilter = {
    is?: ProfesorWhereInput | null
    isNot?: ProfesorWhereInput | null
  }

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    rol?: SortOrder
    fechaCreacion?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    rol?: SortOrder
    fechaCreacion?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    rol?: SortOrder
    fechaCreacion?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Rol | EnumRolFieldRefInput<$PrismaModel>
    in?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>
    not?: NestedEnumRolWithAggregatesFilter<$PrismaModel> | $Enums.Rol
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRolFilter<$PrismaModel>
    _max?: NestedEnumRolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AlumnoListRelationFilter = {
    every?: AlumnoWhereInput
    some?: AlumnoWhereInput
    none?: AlumnoWhereInput
  }

  export type ClasePracticaListRelationFilter = {
    every?: ClasePracticaWhereInput
    some?: ClasePracticaWhereInput
    none?: ClasePracticaWhereInput
  }

  export type UsuarioScalarRelationFilter = {
    is?: UsuarioWhereInput
    isNot?: UsuarioWhereInput
  }

  export type AlumnoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClasePracticaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfesorCountOrderByAggregateInput = {
    id?: SortOrder
    licenciaConducir?: SortOrder
    telefono?: SortOrder
    activo?: SortOrder
  }

  export type ProfesorMaxOrderByAggregateInput = {
    id?: SortOrder
    licenciaConducir?: SortOrder
    telefono?: SortOrder
    activo?: SortOrder
  }

  export type ProfesorMinOrderByAggregateInput = {
    id?: SortOrder
    licenciaConducir?: SortOrder
    telefono?: SortOrder
    activo?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type ExamenListRelationFilter = {
    every?: ExamenWhereInput
    some?: ExamenWhereInput
    none?: ExamenWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ExamenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlumnoCountOrderByAggregateInput = {
    id?: SortOrder
    tipoLicenciaObjetivo?: SortOrder
    horasPracticasCompletadas?: SortOrder
    profesorAsignadoId?: SortOrder
  }

  export type AlumnoAvgOrderByAggregateInput = {
    horasPracticasCompletadas?: SortOrder
  }

  export type AlumnoMaxOrderByAggregateInput = {
    id?: SortOrder
    tipoLicenciaObjetivo?: SortOrder
    horasPracticasCompletadas?: SortOrder
    profesorAsignadoId?: SortOrder
  }

  export type AlumnoMinOrderByAggregateInput = {
    id?: SortOrder
    tipoLicenciaObjetivo?: SortOrder
    horasPracticasCompletadas?: SortOrder
    profesorAsignadoId?: SortOrder
  }

  export type AlumnoSumOrderByAggregateInput = {
    horasPracticasCompletadas?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type VehiculoCountOrderByAggregateInput = {
    id?: SortOrder
    matricula?: SortOrder
    marca?: SortOrder
    modelo?: SortOrder
    tipoPermiso?: SortOrder
    activo?: SortOrder
  }

  export type VehiculoMaxOrderByAggregateInput = {
    id?: SortOrder
    matricula?: SortOrder
    marca?: SortOrder
    modelo?: SortOrder
    tipoPermiso?: SortOrder
    activo?: SortOrder
  }

  export type VehiculoMinOrderByAggregateInput = {
    id?: SortOrder
    matricula?: SortOrder
    marca?: SortOrder
    modelo?: SortOrder
    tipoPermiso?: SortOrder
    activo?: SortOrder
  }

  export type AlumnoScalarRelationFilter = {
    is?: AlumnoWhereInput
    isNot?: AlumnoWhereInput
  }

  export type ProfesorScalarRelationFilter = {
    is?: ProfesorWhereInput
    isNot?: ProfesorWhereInput
  }

  export type VehiculoScalarRelationFilter = {
    is?: VehiculoWhereInput
    isNot?: VehiculoWhereInput
  }

  export type ClasePracticaCountOrderByAggregateInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    profesorId?: SortOrder
    vehiculoId?: SortOrder
    fecha?: SortOrder
    duracion?: SortOrder
    estado?: SortOrder
  }

  export type ClasePracticaAvgOrderByAggregateInput = {
    duracion?: SortOrder
  }

  export type ClasePracticaMaxOrderByAggregateInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    profesorId?: SortOrder
    vehiculoId?: SortOrder
    fecha?: SortOrder
    duracion?: SortOrder
    estado?: SortOrder
  }

  export type ClasePracticaMinOrderByAggregateInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    profesorId?: SortOrder
    vehiculoId?: SortOrder
    fecha?: SortOrder
    duracion?: SortOrder
    estado?: SortOrder
  }

  export type ClasePracticaSumOrderByAggregateInput = {
    duracion?: SortOrder
  }

  export type ExamenCountOrderByAggregateInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    tipo?: SortOrder
    fecha?: SortOrder
    estado?: SortOrder
  }

  export type ExamenMaxOrderByAggregateInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    tipo?: SortOrder
    fecha?: SortOrder
    estado?: SortOrder
  }

  export type ExamenMinOrderByAggregateInput = {
    id?: SortOrder
    alumnoId?: SortOrder
    tipo?: SortOrder
    fecha?: SortOrder
    estado?: SortOrder
  }

  export type AlumnoCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<AlumnoCreateWithoutUsuarioInput, AlumnoUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutUsuarioInput
    connect?: AlumnoWhereUniqueInput
  }

  export type ProfesorCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<ProfesorCreateWithoutUsuarioInput, ProfesorUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: ProfesorCreateOrConnectWithoutUsuarioInput
    connect?: ProfesorWhereUniqueInput
  }

  export type AlumnoUncheckedCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<AlumnoCreateWithoutUsuarioInput, AlumnoUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutUsuarioInput
    connect?: AlumnoWhereUniqueInput
  }

  export type ProfesorUncheckedCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<ProfesorCreateWithoutUsuarioInput, ProfesorUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: ProfesorCreateOrConnectWithoutUsuarioInput
    connect?: ProfesorWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRolFieldUpdateOperationsInput = {
    set?: $Enums.Rol
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AlumnoUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<AlumnoCreateWithoutUsuarioInput, AlumnoUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutUsuarioInput
    upsert?: AlumnoUpsertWithoutUsuarioInput
    disconnect?: AlumnoWhereInput | boolean
    delete?: AlumnoWhereInput | boolean
    connect?: AlumnoWhereUniqueInput
    update?: XOR<XOR<AlumnoUpdateToOneWithWhereWithoutUsuarioInput, AlumnoUpdateWithoutUsuarioInput>, AlumnoUncheckedUpdateWithoutUsuarioInput>
  }

  export type ProfesorUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<ProfesorCreateWithoutUsuarioInput, ProfesorUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: ProfesorCreateOrConnectWithoutUsuarioInput
    upsert?: ProfesorUpsertWithoutUsuarioInput
    disconnect?: ProfesorWhereInput | boolean
    delete?: ProfesorWhereInput | boolean
    connect?: ProfesorWhereUniqueInput
    update?: XOR<XOR<ProfesorUpdateToOneWithWhereWithoutUsuarioInput, ProfesorUpdateWithoutUsuarioInput>, ProfesorUncheckedUpdateWithoutUsuarioInput>
  }

  export type AlumnoUncheckedUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<AlumnoCreateWithoutUsuarioInput, AlumnoUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutUsuarioInput
    upsert?: AlumnoUpsertWithoutUsuarioInput
    disconnect?: AlumnoWhereInput | boolean
    delete?: AlumnoWhereInput | boolean
    connect?: AlumnoWhereUniqueInput
    update?: XOR<XOR<AlumnoUpdateToOneWithWhereWithoutUsuarioInput, AlumnoUpdateWithoutUsuarioInput>, AlumnoUncheckedUpdateWithoutUsuarioInput>
  }

  export type ProfesorUncheckedUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<ProfesorCreateWithoutUsuarioInput, ProfesorUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: ProfesorCreateOrConnectWithoutUsuarioInput
    upsert?: ProfesorUpsertWithoutUsuarioInput
    disconnect?: ProfesorWhereInput | boolean
    delete?: ProfesorWhereInput | boolean
    connect?: ProfesorWhereUniqueInput
    update?: XOR<XOR<ProfesorUpdateToOneWithWhereWithoutUsuarioInput, ProfesorUpdateWithoutUsuarioInput>, ProfesorUncheckedUpdateWithoutUsuarioInput>
  }

  export type AlumnoCreateNestedManyWithoutProfesorAsignadoInput = {
    create?: XOR<AlumnoCreateWithoutProfesorAsignadoInput, AlumnoUncheckedCreateWithoutProfesorAsignadoInput> | AlumnoCreateWithoutProfesorAsignadoInput[] | AlumnoUncheckedCreateWithoutProfesorAsignadoInput[]
    connectOrCreate?: AlumnoCreateOrConnectWithoutProfesorAsignadoInput | AlumnoCreateOrConnectWithoutProfesorAsignadoInput[]
    createMany?: AlumnoCreateManyProfesorAsignadoInputEnvelope
    connect?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
  }

  export type ClasePracticaCreateNestedManyWithoutProfesorInput = {
    create?: XOR<ClasePracticaCreateWithoutProfesorInput, ClasePracticaUncheckedCreateWithoutProfesorInput> | ClasePracticaCreateWithoutProfesorInput[] | ClasePracticaUncheckedCreateWithoutProfesorInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutProfesorInput | ClasePracticaCreateOrConnectWithoutProfesorInput[]
    createMany?: ClasePracticaCreateManyProfesorInputEnvelope
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
  }

  export type UsuarioCreateNestedOneWithoutProfesorInput = {
    create?: XOR<UsuarioCreateWithoutProfesorInput, UsuarioUncheckedCreateWithoutProfesorInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutProfesorInput
    connect?: UsuarioWhereUniqueInput
  }

  export type AlumnoUncheckedCreateNestedManyWithoutProfesorAsignadoInput = {
    create?: XOR<AlumnoCreateWithoutProfesorAsignadoInput, AlumnoUncheckedCreateWithoutProfesorAsignadoInput> | AlumnoCreateWithoutProfesorAsignadoInput[] | AlumnoUncheckedCreateWithoutProfesorAsignadoInput[]
    connectOrCreate?: AlumnoCreateOrConnectWithoutProfesorAsignadoInput | AlumnoCreateOrConnectWithoutProfesorAsignadoInput[]
    createMany?: AlumnoCreateManyProfesorAsignadoInputEnvelope
    connect?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
  }

  export type ClasePracticaUncheckedCreateNestedManyWithoutProfesorInput = {
    create?: XOR<ClasePracticaCreateWithoutProfesorInput, ClasePracticaUncheckedCreateWithoutProfesorInput> | ClasePracticaCreateWithoutProfesorInput[] | ClasePracticaUncheckedCreateWithoutProfesorInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutProfesorInput | ClasePracticaCreateOrConnectWithoutProfesorInput[]
    createMany?: ClasePracticaCreateManyProfesorInputEnvelope
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AlumnoUpdateManyWithoutProfesorAsignadoNestedInput = {
    create?: XOR<AlumnoCreateWithoutProfesorAsignadoInput, AlumnoUncheckedCreateWithoutProfesorAsignadoInput> | AlumnoCreateWithoutProfesorAsignadoInput[] | AlumnoUncheckedCreateWithoutProfesorAsignadoInput[]
    connectOrCreate?: AlumnoCreateOrConnectWithoutProfesorAsignadoInput | AlumnoCreateOrConnectWithoutProfesorAsignadoInput[]
    upsert?: AlumnoUpsertWithWhereUniqueWithoutProfesorAsignadoInput | AlumnoUpsertWithWhereUniqueWithoutProfesorAsignadoInput[]
    createMany?: AlumnoCreateManyProfesorAsignadoInputEnvelope
    set?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
    disconnect?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
    delete?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
    connect?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
    update?: AlumnoUpdateWithWhereUniqueWithoutProfesorAsignadoInput | AlumnoUpdateWithWhereUniqueWithoutProfesorAsignadoInput[]
    updateMany?: AlumnoUpdateManyWithWhereWithoutProfesorAsignadoInput | AlumnoUpdateManyWithWhereWithoutProfesorAsignadoInput[]
    deleteMany?: AlumnoScalarWhereInput | AlumnoScalarWhereInput[]
  }

  export type ClasePracticaUpdateManyWithoutProfesorNestedInput = {
    create?: XOR<ClasePracticaCreateWithoutProfesorInput, ClasePracticaUncheckedCreateWithoutProfesorInput> | ClasePracticaCreateWithoutProfesorInput[] | ClasePracticaUncheckedCreateWithoutProfesorInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutProfesorInput | ClasePracticaCreateOrConnectWithoutProfesorInput[]
    upsert?: ClasePracticaUpsertWithWhereUniqueWithoutProfesorInput | ClasePracticaUpsertWithWhereUniqueWithoutProfesorInput[]
    createMany?: ClasePracticaCreateManyProfesorInputEnvelope
    set?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    disconnect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    delete?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    update?: ClasePracticaUpdateWithWhereUniqueWithoutProfesorInput | ClasePracticaUpdateWithWhereUniqueWithoutProfesorInput[]
    updateMany?: ClasePracticaUpdateManyWithWhereWithoutProfesorInput | ClasePracticaUpdateManyWithWhereWithoutProfesorInput[]
    deleteMany?: ClasePracticaScalarWhereInput | ClasePracticaScalarWhereInput[]
  }

  export type UsuarioUpdateOneRequiredWithoutProfesorNestedInput = {
    create?: XOR<UsuarioCreateWithoutProfesorInput, UsuarioUncheckedCreateWithoutProfesorInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutProfesorInput
    upsert?: UsuarioUpsertWithoutProfesorInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutProfesorInput, UsuarioUpdateWithoutProfesorInput>, UsuarioUncheckedUpdateWithoutProfesorInput>
  }

  export type AlumnoUncheckedUpdateManyWithoutProfesorAsignadoNestedInput = {
    create?: XOR<AlumnoCreateWithoutProfesorAsignadoInput, AlumnoUncheckedCreateWithoutProfesorAsignadoInput> | AlumnoCreateWithoutProfesorAsignadoInput[] | AlumnoUncheckedCreateWithoutProfesorAsignadoInput[]
    connectOrCreate?: AlumnoCreateOrConnectWithoutProfesorAsignadoInput | AlumnoCreateOrConnectWithoutProfesorAsignadoInput[]
    upsert?: AlumnoUpsertWithWhereUniqueWithoutProfesorAsignadoInput | AlumnoUpsertWithWhereUniqueWithoutProfesorAsignadoInput[]
    createMany?: AlumnoCreateManyProfesorAsignadoInputEnvelope
    set?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
    disconnect?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
    delete?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
    connect?: AlumnoWhereUniqueInput | AlumnoWhereUniqueInput[]
    update?: AlumnoUpdateWithWhereUniqueWithoutProfesorAsignadoInput | AlumnoUpdateWithWhereUniqueWithoutProfesorAsignadoInput[]
    updateMany?: AlumnoUpdateManyWithWhereWithoutProfesorAsignadoInput | AlumnoUpdateManyWithWhereWithoutProfesorAsignadoInput[]
    deleteMany?: AlumnoScalarWhereInput | AlumnoScalarWhereInput[]
  }

  export type ClasePracticaUncheckedUpdateManyWithoutProfesorNestedInput = {
    create?: XOR<ClasePracticaCreateWithoutProfesorInput, ClasePracticaUncheckedCreateWithoutProfesorInput> | ClasePracticaCreateWithoutProfesorInput[] | ClasePracticaUncheckedCreateWithoutProfesorInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutProfesorInput | ClasePracticaCreateOrConnectWithoutProfesorInput[]
    upsert?: ClasePracticaUpsertWithWhereUniqueWithoutProfesorInput | ClasePracticaUpsertWithWhereUniqueWithoutProfesorInput[]
    createMany?: ClasePracticaCreateManyProfesorInputEnvelope
    set?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    disconnect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    delete?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    update?: ClasePracticaUpdateWithWhereUniqueWithoutProfesorInput | ClasePracticaUpdateWithWhereUniqueWithoutProfesorInput[]
    updateMany?: ClasePracticaUpdateManyWithWhereWithoutProfesorInput | ClasePracticaUpdateManyWithWhereWithoutProfesorInput[]
    deleteMany?: ClasePracticaScalarWhereInput | ClasePracticaScalarWhereInput[]
  }

  export type UsuarioCreateNestedOneWithoutAlumnoInput = {
    create?: XOR<UsuarioCreateWithoutAlumnoInput, UsuarioUncheckedCreateWithoutAlumnoInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutAlumnoInput
    connect?: UsuarioWhereUniqueInput
  }

  export type ProfesorCreateNestedOneWithoutAlumnosAsignadosInput = {
    create?: XOR<ProfesorCreateWithoutAlumnosAsignadosInput, ProfesorUncheckedCreateWithoutAlumnosAsignadosInput>
    connectOrCreate?: ProfesorCreateOrConnectWithoutAlumnosAsignadosInput
    connect?: ProfesorWhereUniqueInput
  }

  export type ClasePracticaCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<ClasePracticaCreateWithoutAlumnoInput, ClasePracticaUncheckedCreateWithoutAlumnoInput> | ClasePracticaCreateWithoutAlumnoInput[] | ClasePracticaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutAlumnoInput | ClasePracticaCreateOrConnectWithoutAlumnoInput[]
    createMany?: ClasePracticaCreateManyAlumnoInputEnvelope
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
  }

  export type ExamenCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<ExamenCreateWithoutAlumnoInput, ExamenUncheckedCreateWithoutAlumnoInput> | ExamenCreateWithoutAlumnoInput[] | ExamenUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ExamenCreateOrConnectWithoutAlumnoInput | ExamenCreateOrConnectWithoutAlumnoInput[]
    createMany?: ExamenCreateManyAlumnoInputEnvelope
    connect?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
  }

  export type ClasePracticaUncheckedCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<ClasePracticaCreateWithoutAlumnoInput, ClasePracticaUncheckedCreateWithoutAlumnoInput> | ClasePracticaCreateWithoutAlumnoInput[] | ClasePracticaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutAlumnoInput | ClasePracticaCreateOrConnectWithoutAlumnoInput[]
    createMany?: ClasePracticaCreateManyAlumnoInputEnvelope
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
  }

  export type ExamenUncheckedCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<ExamenCreateWithoutAlumnoInput, ExamenUncheckedCreateWithoutAlumnoInput> | ExamenCreateWithoutAlumnoInput[] | ExamenUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ExamenCreateOrConnectWithoutAlumnoInput | ExamenCreateOrConnectWithoutAlumnoInput[]
    createMany?: ExamenCreateManyAlumnoInputEnvelope
    connect?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UsuarioUpdateOneRequiredWithoutAlumnoNestedInput = {
    create?: XOR<UsuarioCreateWithoutAlumnoInput, UsuarioUncheckedCreateWithoutAlumnoInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutAlumnoInput
    upsert?: UsuarioUpsertWithoutAlumnoInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutAlumnoInput, UsuarioUpdateWithoutAlumnoInput>, UsuarioUncheckedUpdateWithoutAlumnoInput>
  }

  export type ProfesorUpdateOneWithoutAlumnosAsignadosNestedInput = {
    create?: XOR<ProfesorCreateWithoutAlumnosAsignadosInput, ProfesorUncheckedCreateWithoutAlumnosAsignadosInput>
    connectOrCreate?: ProfesorCreateOrConnectWithoutAlumnosAsignadosInput
    upsert?: ProfesorUpsertWithoutAlumnosAsignadosInput
    disconnect?: ProfesorWhereInput | boolean
    delete?: ProfesorWhereInput | boolean
    connect?: ProfesorWhereUniqueInput
    update?: XOR<XOR<ProfesorUpdateToOneWithWhereWithoutAlumnosAsignadosInput, ProfesorUpdateWithoutAlumnosAsignadosInput>, ProfesorUncheckedUpdateWithoutAlumnosAsignadosInput>
  }

  export type ClasePracticaUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<ClasePracticaCreateWithoutAlumnoInput, ClasePracticaUncheckedCreateWithoutAlumnoInput> | ClasePracticaCreateWithoutAlumnoInput[] | ClasePracticaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutAlumnoInput | ClasePracticaCreateOrConnectWithoutAlumnoInput[]
    upsert?: ClasePracticaUpsertWithWhereUniqueWithoutAlumnoInput | ClasePracticaUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: ClasePracticaCreateManyAlumnoInputEnvelope
    set?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    disconnect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    delete?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    update?: ClasePracticaUpdateWithWhereUniqueWithoutAlumnoInput | ClasePracticaUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: ClasePracticaUpdateManyWithWhereWithoutAlumnoInput | ClasePracticaUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: ClasePracticaScalarWhereInput | ClasePracticaScalarWhereInput[]
  }

  export type ExamenUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<ExamenCreateWithoutAlumnoInput, ExamenUncheckedCreateWithoutAlumnoInput> | ExamenCreateWithoutAlumnoInput[] | ExamenUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ExamenCreateOrConnectWithoutAlumnoInput | ExamenCreateOrConnectWithoutAlumnoInput[]
    upsert?: ExamenUpsertWithWhereUniqueWithoutAlumnoInput | ExamenUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: ExamenCreateManyAlumnoInputEnvelope
    set?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
    disconnect?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
    delete?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
    connect?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
    update?: ExamenUpdateWithWhereUniqueWithoutAlumnoInput | ExamenUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: ExamenUpdateManyWithWhereWithoutAlumnoInput | ExamenUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: ExamenScalarWhereInput | ExamenScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ClasePracticaUncheckedUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<ClasePracticaCreateWithoutAlumnoInput, ClasePracticaUncheckedCreateWithoutAlumnoInput> | ClasePracticaCreateWithoutAlumnoInput[] | ClasePracticaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutAlumnoInput | ClasePracticaCreateOrConnectWithoutAlumnoInput[]
    upsert?: ClasePracticaUpsertWithWhereUniqueWithoutAlumnoInput | ClasePracticaUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: ClasePracticaCreateManyAlumnoInputEnvelope
    set?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    disconnect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    delete?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    update?: ClasePracticaUpdateWithWhereUniqueWithoutAlumnoInput | ClasePracticaUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: ClasePracticaUpdateManyWithWhereWithoutAlumnoInput | ClasePracticaUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: ClasePracticaScalarWhereInput | ClasePracticaScalarWhereInput[]
  }

  export type ExamenUncheckedUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<ExamenCreateWithoutAlumnoInput, ExamenUncheckedCreateWithoutAlumnoInput> | ExamenCreateWithoutAlumnoInput[] | ExamenUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ExamenCreateOrConnectWithoutAlumnoInput | ExamenCreateOrConnectWithoutAlumnoInput[]
    upsert?: ExamenUpsertWithWhereUniqueWithoutAlumnoInput | ExamenUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: ExamenCreateManyAlumnoInputEnvelope
    set?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
    disconnect?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
    delete?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
    connect?: ExamenWhereUniqueInput | ExamenWhereUniqueInput[]
    update?: ExamenUpdateWithWhereUniqueWithoutAlumnoInput | ExamenUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: ExamenUpdateManyWithWhereWithoutAlumnoInput | ExamenUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: ExamenScalarWhereInput | ExamenScalarWhereInput[]
  }

  export type ClasePracticaCreateNestedManyWithoutVehiculoInput = {
    create?: XOR<ClasePracticaCreateWithoutVehiculoInput, ClasePracticaUncheckedCreateWithoutVehiculoInput> | ClasePracticaCreateWithoutVehiculoInput[] | ClasePracticaUncheckedCreateWithoutVehiculoInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutVehiculoInput | ClasePracticaCreateOrConnectWithoutVehiculoInput[]
    createMany?: ClasePracticaCreateManyVehiculoInputEnvelope
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
  }

  export type ClasePracticaUncheckedCreateNestedManyWithoutVehiculoInput = {
    create?: XOR<ClasePracticaCreateWithoutVehiculoInput, ClasePracticaUncheckedCreateWithoutVehiculoInput> | ClasePracticaCreateWithoutVehiculoInput[] | ClasePracticaUncheckedCreateWithoutVehiculoInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutVehiculoInput | ClasePracticaCreateOrConnectWithoutVehiculoInput[]
    createMany?: ClasePracticaCreateManyVehiculoInputEnvelope
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
  }

  export type ClasePracticaUpdateManyWithoutVehiculoNestedInput = {
    create?: XOR<ClasePracticaCreateWithoutVehiculoInput, ClasePracticaUncheckedCreateWithoutVehiculoInput> | ClasePracticaCreateWithoutVehiculoInput[] | ClasePracticaUncheckedCreateWithoutVehiculoInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutVehiculoInput | ClasePracticaCreateOrConnectWithoutVehiculoInput[]
    upsert?: ClasePracticaUpsertWithWhereUniqueWithoutVehiculoInput | ClasePracticaUpsertWithWhereUniqueWithoutVehiculoInput[]
    createMany?: ClasePracticaCreateManyVehiculoInputEnvelope
    set?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    disconnect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    delete?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    update?: ClasePracticaUpdateWithWhereUniqueWithoutVehiculoInput | ClasePracticaUpdateWithWhereUniqueWithoutVehiculoInput[]
    updateMany?: ClasePracticaUpdateManyWithWhereWithoutVehiculoInput | ClasePracticaUpdateManyWithWhereWithoutVehiculoInput[]
    deleteMany?: ClasePracticaScalarWhereInput | ClasePracticaScalarWhereInput[]
  }

  export type ClasePracticaUncheckedUpdateManyWithoutVehiculoNestedInput = {
    create?: XOR<ClasePracticaCreateWithoutVehiculoInput, ClasePracticaUncheckedCreateWithoutVehiculoInput> | ClasePracticaCreateWithoutVehiculoInput[] | ClasePracticaUncheckedCreateWithoutVehiculoInput[]
    connectOrCreate?: ClasePracticaCreateOrConnectWithoutVehiculoInput | ClasePracticaCreateOrConnectWithoutVehiculoInput[]
    upsert?: ClasePracticaUpsertWithWhereUniqueWithoutVehiculoInput | ClasePracticaUpsertWithWhereUniqueWithoutVehiculoInput[]
    createMany?: ClasePracticaCreateManyVehiculoInputEnvelope
    set?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    disconnect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    delete?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    connect?: ClasePracticaWhereUniqueInput | ClasePracticaWhereUniqueInput[]
    update?: ClasePracticaUpdateWithWhereUniqueWithoutVehiculoInput | ClasePracticaUpdateWithWhereUniqueWithoutVehiculoInput[]
    updateMany?: ClasePracticaUpdateManyWithWhereWithoutVehiculoInput | ClasePracticaUpdateManyWithWhereWithoutVehiculoInput[]
    deleteMany?: ClasePracticaScalarWhereInput | ClasePracticaScalarWhereInput[]
  }

  export type AlumnoCreateNestedOneWithoutClasesInput = {
    create?: XOR<AlumnoCreateWithoutClasesInput, AlumnoUncheckedCreateWithoutClasesInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutClasesInput
    connect?: AlumnoWhereUniqueInput
  }

  export type ProfesorCreateNestedOneWithoutClasesInput = {
    create?: XOR<ProfesorCreateWithoutClasesInput, ProfesorUncheckedCreateWithoutClasesInput>
    connectOrCreate?: ProfesorCreateOrConnectWithoutClasesInput
    connect?: ProfesorWhereUniqueInput
  }

  export type VehiculoCreateNestedOneWithoutClasesInput = {
    create?: XOR<VehiculoCreateWithoutClasesInput, VehiculoUncheckedCreateWithoutClasesInput>
    connectOrCreate?: VehiculoCreateOrConnectWithoutClasesInput
    connect?: VehiculoWhereUniqueInput
  }

  export type AlumnoUpdateOneRequiredWithoutClasesNestedInput = {
    create?: XOR<AlumnoCreateWithoutClasesInput, AlumnoUncheckedCreateWithoutClasesInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutClasesInput
    upsert?: AlumnoUpsertWithoutClasesInput
    connect?: AlumnoWhereUniqueInput
    update?: XOR<XOR<AlumnoUpdateToOneWithWhereWithoutClasesInput, AlumnoUpdateWithoutClasesInput>, AlumnoUncheckedUpdateWithoutClasesInput>
  }

  export type ProfesorUpdateOneRequiredWithoutClasesNestedInput = {
    create?: XOR<ProfesorCreateWithoutClasesInput, ProfesorUncheckedCreateWithoutClasesInput>
    connectOrCreate?: ProfesorCreateOrConnectWithoutClasesInput
    upsert?: ProfesorUpsertWithoutClasesInput
    connect?: ProfesorWhereUniqueInput
    update?: XOR<XOR<ProfesorUpdateToOneWithWhereWithoutClasesInput, ProfesorUpdateWithoutClasesInput>, ProfesorUncheckedUpdateWithoutClasesInput>
  }

  export type VehiculoUpdateOneRequiredWithoutClasesNestedInput = {
    create?: XOR<VehiculoCreateWithoutClasesInput, VehiculoUncheckedCreateWithoutClasesInput>
    connectOrCreate?: VehiculoCreateOrConnectWithoutClasesInput
    upsert?: VehiculoUpsertWithoutClasesInput
    connect?: VehiculoWhereUniqueInput
    update?: XOR<XOR<VehiculoUpdateToOneWithWhereWithoutClasesInput, VehiculoUpdateWithoutClasesInput>, VehiculoUncheckedUpdateWithoutClasesInput>
  }

  export type AlumnoCreateNestedOneWithoutExamenesInput = {
    create?: XOR<AlumnoCreateWithoutExamenesInput, AlumnoUncheckedCreateWithoutExamenesInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutExamenesInput
    connect?: AlumnoWhereUniqueInput
  }

  export type AlumnoUpdateOneRequiredWithoutExamenesNestedInput = {
    create?: XOR<AlumnoCreateWithoutExamenesInput, AlumnoUncheckedCreateWithoutExamenesInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutExamenesInput
    upsert?: AlumnoUpsertWithoutExamenesInput
    connect?: AlumnoWhereUniqueInput
    update?: XOR<XOR<AlumnoUpdateToOneWithWhereWithoutExamenesInput, AlumnoUpdateWithoutExamenesInput>, AlumnoUncheckedUpdateWithoutExamenesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRolFilter<$PrismaModel = never> = {
    equals?: $Enums.Rol | EnumRolFieldRefInput<$PrismaModel>
    in?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>
    not?: NestedEnumRolFilter<$PrismaModel> | $Enums.Rol
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Rol | EnumRolFieldRefInput<$PrismaModel>
    in?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>
    not?: NestedEnumRolWithAggregatesFilter<$PrismaModel> | $Enums.Rol
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRolFilter<$PrismaModel>
    _max?: NestedEnumRolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type AlumnoCreateWithoutUsuarioInput = {
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    profesorAsignado?: ProfesorCreateNestedOneWithoutAlumnosAsignadosInput
    clases?: ClasePracticaCreateNestedManyWithoutAlumnoInput
    examenes?: ExamenCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateWithoutUsuarioInput = {
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    profesorAsignadoId?: string | null
    clases?: ClasePracticaUncheckedCreateNestedManyWithoutAlumnoInput
    examenes?: ExamenUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoCreateOrConnectWithoutUsuarioInput = {
    where: AlumnoWhereUniqueInput
    create: XOR<AlumnoCreateWithoutUsuarioInput, AlumnoUncheckedCreateWithoutUsuarioInput>
  }

  export type ProfesorCreateWithoutUsuarioInput = {
    licenciaConducir: string
    telefono: string
    activo?: boolean
    alumnosAsignados?: AlumnoCreateNestedManyWithoutProfesorAsignadoInput
    clases?: ClasePracticaCreateNestedManyWithoutProfesorInput
  }

  export type ProfesorUncheckedCreateWithoutUsuarioInput = {
    licenciaConducir: string
    telefono: string
    activo?: boolean
    alumnosAsignados?: AlumnoUncheckedCreateNestedManyWithoutProfesorAsignadoInput
    clases?: ClasePracticaUncheckedCreateNestedManyWithoutProfesorInput
  }

  export type ProfesorCreateOrConnectWithoutUsuarioInput = {
    where: ProfesorWhereUniqueInput
    create: XOR<ProfesorCreateWithoutUsuarioInput, ProfesorUncheckedCreateWithoutUsuarioInput>
  }

  export type AlumnoUpsertWithoutUsuarioInput = {
    update: XOR<AlumnoUpdateWithoutUsuarioInput, AlumnoUncheckedUpdateWithoutUsuarioInput>
    create: XOR<AlumnoCreateWithoutUsuarioInput, AlumnoUncheckedCreateWithoutUsuarioInput>
    where?: AlumnoWhereInput
  }

  export type AlumnoUpdateToOneWithWhereWithoutUsuarioInput = {
    where?: AlumnoWhereInput
    data: XOR<AlumnoUpdateWithoutUsuarioInput, AlumnoUncheckedUpdateWithoutUsuarioInput>
  }

  export type AlumnoUpdateWithoutUsuarioInput = {
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    profesorAsignado?: ProfesorUpdateOneWithoutAlumnosAsignadosNestedInput
    clases?: ClasePracticaUpdateManyWithoutAlumnoNestedInput
    examenes?: ExamenUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateWithoutUsuarioInput = {
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    profesorAsignadoId?: NullableStringFieldUpdateOperationsInput | string | null
    clases?: ClasePracticaUncheckedUpdateManyWithoutAlumnoNestedInput
    examenes?: ExamenUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type ProfesorUpsertWithoutUsuarioInput = {
    update: XOR<ProfesorUpdateWithoutUsuarioInput, ProfesorUncheckedUpdateWithoutUsuarioInput>
    create: XOR<ProfesorCreateWithoutUsuarioInput, ProfesorUncheckedCreateWithoutUsuarioInput>
    where?: ProfesorWhereInput
  }

  export type ProfesorUpdateToOneWithWhereWithoutUsuarioInput = {
    where?: ProfesorWhereInput
    data: XOR<ProfesorUpdateWithoutUsuarioInput, ProfesorUncheckedUpdateWithoutUsuarioInput>
  }

  export type ProfesorUpdateWithoutUsuarioInput = {
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    alumnosAsignados?: AlumnoUpdateManyWithoutProfesorAsignadoNestedInput
    clases?: ClasePracticaUpdateManyWithoutProfesorNestedInput
  }

  export type ProfesorUncheckedUpdateWithoutUsuarioInput = {
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    alumnosAsignados?: AlumnoUncheckedUpdateManyWithoutProfesorAsignadoNestedInput
    clases?: ClasePracticaUncheckedUpdateManyWithoutProfesorNestedInput
  }

  export type AlumnoCreateWithoutProfesorAsignadoInput = {
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    usuario: UsuarioCreateNestedOneWithoutAlumnoInput
    clases?: ClasePracticaCreateNestedManyWithoutAlumnoInput
    examenes?: ExamenCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateWithoutProfesorAsignadoInput = {
    id: string
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    clases?: ClasePracticaUncheckedCreateNestedManyWithoutAlumnoInput
    examenes?: ExamenUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoCreateOrConnectWithoutProfesorAsignadoInput = {
    where: AlumnoWhereUniqueInput
    create: XOR<AlumnoCreateWithoutProfesorAsignadoInput, AlumnoUncheckedCreateWithoutProfesorAsignadoInput>
  }

  export type AlumnoCreateManyProfesorAsignadoInputEnvelope = {
    data: AlumnoCreateManyProfesorAsignadoInput | AlumnoCreateManyProfesorAsignadoInput[]
    skipDuplicates?: boolean
  }

  export type ClasePracticaCreateWithoutProfesorInput = {
    id?: string
    fecha: Date | string
    duracion: number
    estado: string
    alumno: AlumnoCreateNestedOneWithoutClasesInput
    vehiculo: VehiculoCreateNestedOneWithoutClasesInput
  }

  export type ClasePracticaUncheckedCreateWithoutProfesorInput = {
    id?: string
    alumnoId: string
    vehiculoId: string
    fecha: Date | string
    duracion: number
    estado: string
  }

  export type ClasePracticaCreateOrConnectWithoutProfesorInput = {
    where: ClasePracticaWhereUniqueInput
    create: XOR<ClasePracticaCreateWithoutProfesorInput, ClasePracticaUncheckedCreateWithoutProfesorInput>
  }

  export type ClasePracticaCreateManyProfesorInputEnvelope = {
    data: ClasePracticaCreateManyProfesorInput | ClasePracticaCreateManyProfesorInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioCreateWithoutProfesorInput = {
    id?: string
    nombre: string
    email: string
    passwordHash: string
    rol: $Enums.Rol
    fechaCreacion?: Date | string
    alumno?: AlumnoCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutProfesorInput = {
    id?: string
    nombre: string
    email: string
    passwordHash: string
    rol: $Enums.Rol
    fechaCreacion?: Date | string
    alumno?: AlumnoUncheckedCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutProfesorInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutProfesorInput, UsuarioUncheckedCreateWithoutProfesorInput>
  }

  export type AlumnoUpsertWithWhereUniqueWithoutProfesorAsignadoInput = {
    where: AlumnoWhereUniqueInput
    update: XOR<AlumnoUpdateWithoutProfesorAsignadoInput, AlumnoUncheckedUpdateWithoutProfesorAsignadoInput>
    create: XOR<AlumnoCreateWithoutProfesorAsignadoInput, AlumnoUncheckedCreateWithoutProfesorAsignadoInput>
  }

  export type AlumnoUpdateWithWhereUniqueWithoutProfesorAsignadoInput = {
    where: AlumnoWhereUniqueInput
    data: XOR<AlumnoUpdateWithoutProfesorAsignadoInput, AlumnoUncheckedUpdateWithoutProfesorAsignadoInput>
  }

  export type AlumnoUpdateManyWithWhereWithoutProfesorAsignadoInput = {
    where: AlumnoScalarWhereInput
    data: XOR<AlumnoUpdateManyMutationInput, AlumnoUncheckedUpdateManyWithoutProfesorAsignadoInput>
  }

  export type AlumnoScalarWhereInput = {
    AND?: AlumnoScalarWhereInput | AlumnoScalarWhereInput[]
    OR?: AlumnoScalarWhereInput[]
    NOT?: AlumnoScalarWhereInput | AlumnoScalarWhereInput[]
    id?: StringFilter<"Alumno"> | string
    tipoLicenciaObjetivo?: StringFilter<"Alumno"> | string
    horasPracticasCompletadas?: IntFilter<"Alumno"> | number
    profesorAsignadoId?: StringNullableFilter<"Alumno"> | string | null
  }

  export type ClasePracticaUpsertWithWhereUniqueWithoutProfesorInput = {
    where: ClasePracticaWhereUniqueInput
    update: XOR<ClasePracticaUpdateWithoutProfesorInput, ClasePracticaUncheckedUpdateWithoutProfesorInput>
    create: XOR<ClasePracticaCreateWithoutProfesorInput, ClasePracticaUncheckedCreateWithoutProfesorInput>
  }

  export type ClasePracticaUpdateWithWhereUniqueWithoutProfesorInput = {
    where: ClasePracticaWhereUniqueInput
    data: XOR<ClasePracticaUpdateWithoutProfesorInput, ClasePracticaUncheckedUpdateWithoutProfesorInput>
  }

  export type ClasePracticaUpdateManyWithWhereWithoutProfesorInput = {
    where: ClasePracticaScalarWhereInput
    data: XOR<ClasePracticaUpdateManyMutationInput, ClasePracticaUncheckedUpdateManyWithoutProfesorInput>
  }

  export type ClasePracticaScalarWhereInput = {
    AND?: ClasePracticaScalarWhereInput | ClasePracticaScalarWhereInput[]
    OR?: ClasePracticaScalarWhereInput[]
    NOT?: ClasePracticaScalarWhereInput | ClasePracticaScalarWhereInput[]
    id?: StringFilter<"ClasePractica"> | string
    alumnoId?: StringFilter<"ClasePractica"> | string
    profesorId?: StringFilter<"ClasePractica"> | string
    vehiculoId?: StringFilter<"ClasePractica"> | string
    fecha?: DateTimeFilter<"ClasePractica"> | Date | string
    duracion?: IntFilter<"ClasePractica"> | number
    estado?: StringFilter<"ClasePractica"> | string
  }

  export type UsuarioUpsertWithoutProfesorInput = {
    update: XOR<UsuarioUpdateWithoutProfesorInput, UsuarioUncheckedUpdateWithoutProfesorInput>
    create: XOR<UsuarioCreateWithoutProfesorInput, UsuarioUncheckedCreateWithoutProfesorInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutProfesorInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutProfesorInput, UsuarioUncheckedUpdateWithoutProfesorInput>
  }

  export type UsuarioUpdateWithoutProfesorInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    alumno?: AlumnoUpdateOneWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutProfesorInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    alumno?: AlumnoUncheckedUpdateOneWithoutUsuarioNestedInput
  }

  export type UsuarioCreateWithoutAlumnoInput = {
    id?: string
    nombre: string
    email: string
    passwordHash: string
    rol: $Enums.Rol
    fechaCreacion?: Date | string
    profesor?: ProfesorCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutAlumnoInput = {
    id?: string
    nombre: string
    email: string
    passwordHash: string
    rol: $Enums.Rol
    fechaCreacion?: Date | string
    profesor?: ProfesorUncheckedCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutAlumnoInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutAlumnoInput, UsuarioUncheckedCreateWithoutAlumnoInput>
  }

  export type ProfesorCreateWithoutAlumnosAsignadosInput = {
    licenciaConducir: string
    telefono: string
    activo?: boolean
    clases?: ClasePracticaCreateNestedManyWithoutProfesorInput
    usuario: UsuarioCreateNestedOneWithoutProfesorInput
  }

  export type ProfesorUncheckedCreateWithoutAlumnosAsignadosInput = {
    id: string
    licenciaConducir: string
    telefono: string
    activo?: boolean
    clases?: ClasePracticaUncheckedCreateNestedManyWithoutProfesorInput
  }

  export type ProfesorCreateOrConnectWithoutAlumnosAsignadosInput = {
    where: ProfesorWhereUniqueInput
    create: XOR<ProfesorCreateWithoutAlumnosAsignadosInput, ProfesorUncheckedCreateWithoutAlumnosAsignadosInput>
  }

  export type ClasePracticaCreateWithoutAlumnoInput = {
    id?: string
    fecha: Date | string
    duracion: number
    estado: string
    profesor: ProfesorCreateNestedOneWithoutClasesInput
    vehiculo: VehiculoCreateNestedOneWithoutClasesInput
  }

  export type ClasePracticaUncheckedCreateWithoutAlumnoInput = {
    id?: string
    profesorId: string
    vehiculoId: string
    fecha: Date | string
    duracion: number
    estado: string
  }

  export type ClasePracticaCreateOrConnectWithoutAlumnoInput = {
    where: ClasePracticaWhereUniqueInput
    create: XOR<ClasePracticaCreateWithoutAlumnoInput, ClasePracticaUncheckedCreateWithoutAlumnoInput>
  }

  export type ClasePracticaCreateManyAlumnoInputEnvelope = {
    data: ClasePracticaCreateManyAlumnoInput | ClasePracticaCreateManyAlumnoInput[]
    skipDuplicates?: boolean
  }

  export type ExamenCreateWithoutAlumnoInput = {
    id?: string
    tipo: string
    fecha: Date | string
    estado: string
  }

  export type ExamenUncheckedCreateWithoutAlumnoInput = {
    id?: string
    tipo: string
    fecha: Date | string
    estado: string
  }

  export type ExamenCreateOrConnectWithoutAlumnoInput = {
    where: ExamenWhereUniqueInput
    create: XOR<ExamenCreateWithoutAlumnoInput, ExamenUncheckedCreateWithoutAlumnoInput>
  }

  export type ExamenCreateManyAlumnoInputEnvelope = {
    data: ExamenCreateManyAlumnoInput | ExamenCreateManyAlumnoInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioUpsertWithoutAlumnoInput = {
    update: XOR<UsuarioUpdateWithoutAlumnoInput, UsuarioUncheckedUpdateWithoutAlumnoInput>
    create: XOR<UsuarioCreateWithoutAlumnoInput, UsuarioUncheckedCreateWithoutAlumnoInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutAlumnoInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutAlumnoInput, UsuarioUncheckedUpdateWithoutAlumnoInput>
  }

  export type UsuarioUpdateWithoutAlumnoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    profesor?: ProfesorUpdateOneWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutAlumnoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    profesor?: ProfesorUncheckedUpdateOneWithoutUsuarioNestedInput
  }

  export type ProfesorUpsertWithoutAlumnosAsignadosInput = {
    update: XOR<ProfesorUpdateWithoutAlumnosAsignadosInput, ProfesorUncheckedUpdateWithoutAlumnosAsignadosInput>
    create: XOR<ProfesorCreateWithoutAlumnosAsignadosInput, ProfesorUncheckedCreateWithoutAlumnosAsignadosInput>
    where?: ProfesorWhereInput
  }

  export type ProfesorUpdateToOneWithWhereWithoutAlumnosAsignadosInput = {
    where?: ProfesorWhereInput
    data: XOR<ProfesorUpdateWithoutAlumnosAsignadosInput, ProfesorUncheckedUpdateWithoutAlumnosAsignadosInput>
  }

  export type ProfesorUpdateWithoutAlumnosAsignadosInput = {
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    clases?: ClasePracticaUpdateManyWithoutProfesorNestedInput
    usuario?: UsuarioUpdateOneRequiredWithoutProfesorNestedInput
  }

  export type ProfesorUncheckedUpdateWithoutAlumnosAsignadosInput = {
    id?: StringFieldUpdateOperationsInput | string
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    clases?: ClasePracticaUncheckedUpdateManyWithoutProfesorNestedInput
  }

  export type ClasePracticaUpsertWithWhereUniqueWithoutAlumnoInput = {
    where: ClasePracticaWhereUniqueInput
    update: XOR<ClasePracticaUpdateWithoutAlumnoInput, ClasePracticaUncheckedUpdateWithoutAlumnoInput>
    create: XOR<ClasePracticaCreateWithoutAlumnoInput, ClasePracticaUncheckedCreateWithoutAlumnoInput>
  }

  export type ClasePracticaUpdateWithWhereUniqueWithoutAlumnoInput = {
    where: ClasePracticaWhereUniqueInput
    data: XOR<ClasePracticaUpdateWithoutAlumnoInput, ClasePracticaUncheckedUpdateWithoutAlumnoInput>
  }

  export type ClasePracticaUpdateManyWithWhereWithoutAlumnoInput = {
    where: ClasePracticaScalarWhereInput
    data: XOR<ClasePracticaUpdateManyMutationInput, ClasePracticaUncheckedUpdateManyWithoutAlumnoInput>
  }

  export type ExamenUpsertWithWhereUniqueWithoutAlumnoInput = {
    where: ExamenWhereUniqueInput
    update: XOR<ExamenUpdateWithoutAlumnoInput, ExamenUncheckedUpdateWithoutAlumnoInput>
    create: XOR<ExamenCreateWithoutAlumnoInput, ExamenUncheckedCreateWithoutAlumnoInput>
  }

  export type ExamenUpdateWithWhereUniqueWithoutAlumnoInput = {
    where: ExamenWhereUniqueInput
    data: XOR<ExamenUpdateWithoutAlumnoInput, ExamenUncheckedUpdateWithoutAlumnoInput>
  }

  export type ExamenUpdateManyWithWhereWithoutAlumnoInput = {
    where: ExamenScalarWhereInput
    data: XOR<ExamenUpdateManyMutationInput, ExamenUncheckedUpdateManyWithoutAlumnoInput>
  }

  export type ExamenScalarWhereInput = {
    AND?: ExamenScalarWhereInput | ExamenScalarWhereInput[]
    OR?: ExamenScalarWhereInput[]
    NOT?: ExamenScalarWhereInput | ExamenScalarWhereInput[]
    id?: StringFilter<"Examen"> | string
    alumnoId?: StringFilter<"Examen"> | string
    tipo?: StringFilter<"Examen"> | string
    fecha?: DateTimeFilter<"Examen"> | Date | string
    estado?: StringFilter<"Examen"> | string
  }

  export type ClasePracticaCreateWithoutVehiculoInput = {
    id?: string
    fecha: Date | string
    duracion: number
    estado: string
    alumno: AlumnoCreateNestedOneWithoutClasesInput
    profesor: ProfesorCreateNestedOneWithoutClasesInput
  }

  export type ClasePracticaUncheckedCreateWithoutVehiculoInput = {
    id?: string
    alumnoId: string
    profesorId: string
    fecha: Date | string
    duracion: number
    estado: string
  }

  export type ClasePracticaCreateOrConnectWithoutVehiculoInput = {
    where: ClasePracticaWhereUniqueInput
    create: XOR<ClasePracticaCreateWithoutVehiculoInput, ClasePracticaUncheckedCreateWithoutVehiculoInput>
  }

  export type ClasePracticaCreateManyVehiculoInputEnvelope = {
    data: ClasePracticaCreateManyVehiculoInput | ClasePracticaCreateManyVehiculoInput[]
    skipDuplicates?: boolean
  }

  export type ClasePracticaUpsertWithWhereUniqueWithoutVehiculoInput = {
    where: ClasePracticaWhereUniqueInput
    update: XOR<ClasePracticaUpdateWithoutVehiculoInput, ClasePracticaUncheckedUpdateWithoutVehiculoInput>
    create: XOR<ClasePracticaCreateWithoutVehiculoInput, ClasePracticaUncheckedCreateWithoutVehiculoInput>
  }

  export type ClasePracticaUpdateWithWhereUniqueWithoutVehiculoInput = {
    where: ClasePracticaWhereUniqueInput
    data: XOR<ClasePracticaUpdateWithoutVehiculoInput, ClasePracticaUncheckedUpdateWithoutVehiculoInput>
  }

  export type ClasePracticaUpdateManyWithWhereWithoutVehiculoInput = {
    where: ClasePracticaScalarWhereInput
    data: XOR<ClasePracticaUpdateManyMutationInput, ClasePracticaUncheckedUpdateManyWithoutVehiculoInput>
  }

  export type AlumnoCreateWithoutClasesInput = {
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    usuario: UsuarioCreateNestedOneWithoutAlumnoInput
    profesorAsignado?: ProfesorCreateNestedOneWithoutAlumnosAsignadosInput
    examenes?: ExamenCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateWithoutClasesInput = {
    id: string
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    profesorAsignadoId?: string | null
    examenes?: ExamenUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoCreateOrConnectWithoutClasesInput = {
    where: AlumnoWhereUniqueInput
    create: XOR<AlumnoCreateWithoutClasesInput, AlumnoUncheckedCreateWithoutClasesInput>
  }

  export type ProfesorCreateWithoutClasesInput = {
    licenciaConducir: string
    telefono: string
    activo?: boolean
    alumnosAsignados?: AlumnoCreateNestedManyWithoutProfesorAsignadoInput
    usuario: UsuarioCreateNestedOneWithoutProfesorInput
  }

  export type ProfesorUncheckedCreateWithoutClasesInput = {
    id: string
    licenciaConducir: string
    telefono: string
    activo?: boolean
    alumnosAsignados?: AlumnoUncheckedCreateNestedManyWithoutProfesorAsignadoInput
  }

  export type ProfesorCreateOrConnectWithoutClasesInput = {
    where: ProfesorWhereUniqueInput
    create: XOR<ProfesorCreateWithoutClasesInput, ProfesorUncheckedCreateWithoutClasesInput>
  }

  export type VehiculoCreateWithoutClasesInput = {
    id?: string
    matricula: string
    marca?: string | null
    modelo?: string | null
    tipoPermiso: string
    activo?: boolean
  }

  export type VehiculoUncheckedCreateWithoutClasesInput = {
    id?: string
    matricula: string
    marca?: string | null
    modelo?: string | null
    tipoPermiso: string
    activo?: boolean
  }

  export type VehiculoCreateOrConnectWithoutClasesInput = {
    where: VehiculoWhereUniqueInput
    create: XOR<VehiculoCreateWithoutClasesInput, VehiculoUncheckedCreateWithoutClasesInput>
  }

  export type AlumnoUpsertWithoutClasesInput = {
    update: XOR<AlumnoUpdateWithoutClasesInput, AlumnoUncheckedUpdateWithoutClasesInput>
    create: XOR<AlumnoCreateWithoutClasesInput, AlumnoUncheckedCreateWithoutClasesInput>
    where?: AlumnoWhereInput
  }

  export type AlumnoUpdateToOneWithWhereWithoutClasesInput = {
    where?: AlumnoWhereInput
    data: XOR<AlumnoUpdateWithoutClasesInput, AlumnoUncheckedUpdateWithoutClasesInput>
  }

  export type AlumnoUpdateWithoutClasesInput = {
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    usuario?: UsuarioUpdateOneRequiredWithoutAlumnoNestedInput
    profesorAsignado?: ProfesorUpdateOneWithoutAlumnosAsignadosNestedInput
    examenes?: ExamenUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateWithoutClasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    profesorAsignadoId?: NullableStringFieldUpdateOperationsInput | string | null
    examenes?: ExamenUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type ProfesorUpsertWithoutClasesInput = {
    update: XOR<ProfesorUpdateWithoutClasesInput, ProfesorUncheckedUpdateWithoutClasesInput>
    create: XOR<ProfesorCreateWithoutClasesInput, ProfesorUncheckedCreateWithoutClasesInput>
    where?: ProfesorWhereInput
  }

  export type ProfesorUpdateToOneWithWhereWithoutClasesInput = {
    where?: ProfesorWhereInput
    data: XOR<ProfesorUpdateWithoutClasesInput, ProfesorUncheckedUpdateWithoutClasesInput>
  }

  export type ProfesorUpdateWithoutClasesInput = {
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    alumnosAsignados?: AlumnoUpdateManyWithoutProfesorAsignadoNestedInput
    usuario?: UsuarioUpdateOneRequiredWithoutProfesorNestedInput
  }

  export type ProfesorUncheckedUpdateWithoutClasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    licenciaConducir?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    alumnosAsignados?: AlumnoUncheckedUpdateManyWithoutProfesorAsignadoNestedInput
  }

  export type VehiculoUpsertWithoutClasesInput = {
    update: XOR<VehiculoUpdateWithoutClasesInput, VehiculoUncheckedUpdateWithoutClasesInput>
    create: XOR<VehiculoCreateWithoutClasesInput, VehiculoUncheckedCreateWithoutClasesInput>
    where?: VehiculoWhereInput
  }

  export type VehiculoUpdateToOneWithWhereWithoutClasesInput = {
    where?: VehiculoWhereInput
    data: XOR<VehiculoUpdateWithoutClasesInput, VehiculoUncheckedUpdateWithoutClasesInput>
  }

  export type VehiculoUpdateWithoutClasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    matricula?: StringFieldUpdateOperationsInput | string
    marca?: NullableStringFieldUpdateOperationsInput | string | null
    modelo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoPermiso?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VehiculoUncheckedUpdateWithoutClasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    matricula?: StringFieldUpdateOperationsInput | string
    marca?: NullableStringFieldUpdateOperationsInput | string | null
    modelo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoPermiso?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AlumnoCreateWithoutExamenesInput = {
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    usuario: UsuarioCreateNestedOneWithoutAlumnoInput
    profesorAsignado?: ProfesorCreateNestedOneWithoutAlumnosAsignadosInput
    clases?: ClasePracticaCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateWithoutExamenesInput = {
    id: string
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
    profesorAsignadoId?: string | null
    clases?: ClasePracticaUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoCreateOrConnectWithoutExamenesInput = {
    where: AlumnoWhereUniqueInput
    create: XOR<AlumnoCreateWithoutExamenesInput, AlumnoUncheckedCreateWithoutExamenesInput>
  }

  export type AlumnoUpsertWithoutExamenesInput = {
    update: XOR<AlumnoUpdateWithoutExamenesInput, AlumnoUncheckedUpdateWithoutExamenesInput>
    create: XOR<AlumnoCreateWithoutExamenesInput, AlumnoUncheckedCreateWithoutExamenesInput>
    where?: AlumnoWhereInput
  }

  export type AlumnoUpdateToOneWithWhereWithoutExamenesInput = {
    where?: AlumnoWhereInput
    data: XOR<AlumnoUpdateWithoutExamenesInput, AlumnoUncheckedUpdateWithoutExamenesInput>
  }

  export type AlumnoUpdateWithoutExamenesInput = {
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    usuario?: UsuarioUpdateOneRequiredWithoutAlumnoNestedInput
    profesorAsignado?: ProfesorUpdateOneWithoutAlumnosAsignadosNestedInput
    clases?: ClasePracticaUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateWithoutExamenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    profesorAsignadoId?: NullableStringFieldUpdateOperationsInput | string | null
    clases?: ClasePracticaUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoCreateManyProfesorAsignadoInput = {
    id: string
    tipoLicenciaObjetivo: string
    horasPracticasCompletadas?: number
  }

  export type ClasePracticaCreateManyProfesorInput = {
    id?: string
    alumnoId: string
    vehiculoId: string
    fecha: Date | string
    duracion: number
    estado: string
  }

  export type AlumnoUpdateWithoutProfesorAsignadoInput = {
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    usuario?: UsuarioUpdateOneRequiredWithoutAlumnoNestedInput
    clases?: ClasePracticaUpdateManyWithoutAlumnoNestedInput
    examenes?: ExamenUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateWithoutProfesorAsignadoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
    clases?: ClasePracticaUncheckedUpdateManyWithoutAlumnoNestedInput
    examenes?: ExamenUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateManyWithoutProfesorAsignadoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoLicenciaObjetivo?: StringFieldUpdateOperationsInput | string
    horasPracticasCompletadas?: IntFieldUpdateOperationsInput | number
  }

  export type ClasePracticaUpdateWithoutProfesorInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    alumno?: AlumnoUpdateOneRequiredWithoutClasesNestedInput
    vehiculo?: VehiculoUpdateOneRequiredWithoutClasesNestedInput
  }

  export type ClasePracticaUncheckedUpdateWithoutProfesorInput = {
    id?: StringFieldUpdateOperationsInput | string
    alumnoId?: StringFieldUpdateOperationsInput | string
    vehiculoId?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ClasePracticaUncheckedUpdateManyWithoutProfesorInput = {
    id?: StringFieldUpdateOperationsInput | string
    alumnoId?: StringFieldUpdateOperationsInput | string
    vehiculoId?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ClasePracticaCreateManyAlumnoInput = {
    id?: string
    profesorId: string
    vehiculoId: string
    fecha: Date | string
    duracion: number
    estado: string
  }

  export type ExamenCreateManyAlumnoInput = {
    id?: string
    tipo: string
    fecha: Date | string
    estado: string
  }

  export type ClasePracticaUpdateWithoutAlumnoInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    profesor?: ProfesorUpdateOneRequiredWithoutClasesNestedInput
    vehiculo?: VehiculoUpdateOneRequiredWithoutClasesNestedInput
  }

  export type ClasePracticaUncheckedUpdateWithoutAlumnoInput = {
    id?: StringFieldUpdateOperationsInput | string
    profesorId?: StringFieldUpdateOperationsInput | string
    vehiculoId?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ClasePracticaUncheckedUpdateManyWithoutAlumnoInput = {
    id?: StringFieldUpdateOperationsInput | string
    profesorId?: StringFieldUpdateOperationsInput | string
    vehiculoId?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ExamenUpdateWithoutAlumnoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ExamenUncheckedUpdateWithoutAlumnoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ExamenUncheckedUpdateManyWithoutAlumnoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ClasePracticaCreateManyVehiculoInput = {
    id?: string
    alumnoId: string
    profesorId: string
    fecha: Date | string
    duracion: number
    estado: string
  }

  export type ClasePracticaUpdateWithoutVehiculoInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    alumno?: AlumnoUpdateOneRequiredWithoutClasesNestedInput
    profesor?: ProfesorUpdateOneRequiredWithoutClasesNestedInput
  }

  export type ClasePracticaUncheckedUpdateWithoutVehiculoInput = {
    id?: StringFieldUpdateOperationsInput | string
    alumnoId?: StringFieldUpdateOperationsInput | string
    profesorId?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ClasePracticaUncheckedUpdateManyWithoutVehiculoInput = {
    id?: StringFieldUpdateOperationsInput | string
    alumnoId?: StringFieldUpdateOperationsInput | string
    profesorId?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    duracion?: IntFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}