import { Injectable } from '@angular/core';
import { Agent, AuthStatus, IAddAgent, OS } from './types';

type AgentField = keyof Agent;

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private data: Agent[] = [];
    private readonly SIZE = 10000;

    constructor() {
        const os = [OS.Windows, OS.Linux, OS.Macos];
        const groups = [
            'servers',
            'workstations',
            'mail_servers',
            'dns_servers'
        ];
        const tags = ['important', 'old', 'need_upgrade', 'need_move'];

        for (let i = 0; i < this.SIZE; i++) {
            const obj: Agent = {
                id: i,
                name: `Агент ${i}`,
                os: os[Math.floor(Math.random() * os.length)],
                authorization_status:
                    Math.random() > 0.5
                        ? AuthStatus.Authorized
                        : AuthStatus.Unauthorized,
                connected: Math.random() > 0.5,
                created_datetime: new Date().toISOString(),
                last_connected_datetime: new Date().toISOString(),
                group: groups[Math.floor(Math.random() * groups.length)],
                tags: [tags[Math.floor(Math.random() * tags.length)]]
            };

            this.data.push(obj);
        }
    }

    fetch(
        page = 0,
        pageSize = 50,
        offset = 0,
        filters: Record<string, string[] | string | boolean | number> = {},
        sort: { field: string; order: 'asc' | 'desc' } = {
            field: 'id',
            order: 'asc'
        }
    ) {
        const filtered = this.data.filter(item => {
            return Object.keys(filters).every(filterField => {
                const filterValue = filters[filterField];

                if (filterField === 'data') {
                    return JSON.stringify(item)
                        .toLocaleLowerCase()
                        .includes((filterValue as string).toLowerCase());
                }

                if (filterField === 'tags') {
                    return ([filterValue] as string[]).some(tag =>
                        item.tags.includes(tag)
                    );
                }

                const value = item[filterField as AgentField];

                if (typeof value === 'string') {
                    return new RegExp(
                        (filterValue as string).toLowerCase(),
                        'm'
                    ).test(value.toLowerCase());
                }

                if (typeof value === 'number') {
                    return new RegExp(filterValue as string, 'm').test(
                        value.toString()
                    );
                }

                if (typeof value === 'boolean') {
                    return new RegExp(
                        (filterValue as string).toLowerCase(),
                        'm'
                    ).test(value.toString().toLowerCase());
                }

                return value === filters[filterField];
            });
        });

        const sorted = filtered.sort((a, b) => {
            //strange TS error when comparing the value type with 'number'
            if (sort.field === 'id') {
                return a.id - b.id;
            }

            return a[sort.field as keyof Agent]
                .toString()
                .localeCompare(b[sort.field as keyof Agent].toString(), 'en');
        });

        if (sort.order === 'desc') {
            sorted.reverse();
        }

        return sorted
            .slice(offset)
            .slice(page * pageSize, (page + 1) * pageSize);
    }

    addAgent(agentPart: IAddAgent) {
        const newAgent: Agent = {
            id: this.data[this.data.length - 1].id + 1,
            name: agentPart.name,
            os: agentPart.os,
            created_datetime: new Date().toISOString(),
            last_connected_datetime: new Date().toISOString(),
            tags: agentPart.tags,
            group: agentPart.group,
            connected: true,
            authorization_status: AuthStatus.Authorized
        };

        this.data.push(newAgent);
    }

    deleteAgent(id: number) {
        this.data = this.data.filter(agent => agent.id !== id);
    }
}
