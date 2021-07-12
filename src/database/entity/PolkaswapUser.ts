import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, BeforeInsert, OneToMany, Index } from "typeorm";
import { Balances } from "./Balances";

@Entity()
export class PolkaswapUser {

    @PrimaryGeneratedColumn({ type: "int" })
    user_id: number;

    @Column({ type: "text" })
    address: string;

    @Column({ type: "bytea", nullable: false })
    public_key: Buffer;

    @Column({ type: "bytea", nullable: false })
    private_key: Buffer;

    @Index()
    @Column({ type: "bool" })
    has_money: boolean;

    @Index()
    @Column({ type: "bool" })
    has_liquidity: boolean;

    @Index()
    @Column({ type: "bool" })
    has_custom_token: boolean;

    @CreateDateColumn()
    created_date: Date;

    @OneToMany(() => Balances, balances => balances.user, {
        cascade: true,
        onUpdate: 'CASCADE'
    })
    balances: Balances[];
    db_user: Uint8Array;

    @BeforeInsert()
    beforeInsertActions() {
        this.has_money = false
        this.has_liquidity = false
        this.has_custom_token = false
    }
}