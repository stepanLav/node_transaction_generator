import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { PolkaswapUser } from "./PolkaswapUser";
import { AssetList } from "./AssetList";

@Entity()
export class Balances {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    balance: string;

    @CreateDateColumn()
    createdDate: Date;

    @ManyToOne(() => PolkaswapUser, user => user.balances)
    user: PolkaswapUser;

    @ManyToOne(() => AssetList, token => token.assetId)
    assetId: AssetList;

}