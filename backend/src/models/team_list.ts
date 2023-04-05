// src/models/team_list.ts

import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils"

@Entity()
export class TeamList extends BaseEntity {
    @Column({ type: 'varchar' })
    ip_address: string | null;

    @Column({ type: 'varchar' })
    role: string | null;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "team_list")
    }
}