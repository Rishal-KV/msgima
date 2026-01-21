"use client"

import type { ColumnDef } from "@tanstack/react-table"

export type UserPayment = {
    _id: string
    name: string
    email: string
    phone: string
    profileUrl?: string
    dob?: string
    syncStatus: "PENDING" | "SUCCESS" | "FAILED"
}

export const columns: ColumnDef<UserPayment>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "profileUrl",
        header: "Portfolio",
        cell: ({ row }) => {
            const url = row.getValue("profileUrl") as string
            if (!url) return <span className="text-muted-foreground">-</span>;
            return <a href={url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Link</a>
        }
    },
    {
        accessorKey: "syncStatus",
        header: "Sync Status",
    },
]
