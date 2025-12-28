import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTokenUsageToUserTable1766925349000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'totalTokensUsed',
        type: 'bigint',
        default: 0,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'lastTokenResetAt',
        type: 'datetime',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'lastTokenResetAt');
    await queryRunner.dropColumn('users', 'totalTokensUsed');
  }
}
