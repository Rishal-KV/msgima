import { useEffect, useState, useCallback } from "react"
import { columns, type UserPayment } from "@/components/users/columns"
import { DataTable } from "@/components/ui/data-table"
import { AddUserForm } from "@/components/users/add-user-form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from "axios"

export default function UserPage() {
    const [data, setData] = useState<UserPayment[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("ALL")
    const limit = 10

    const fetchData = useCallback(async (currentPage: number, currentSearch: string, currentStatus: string) => {
        setLoading(true)
        try {
            const statusQuery = currentStatus === "ALL" ? "" : `&status=${currentStatus}`
            const searchQuery = currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""
            const response = await axios.get(`http://localhost:8000/api/v1/user?page=${currentPage}&limit=${limit}${searchQuery}${statusQuery}`)
            if (response.data.success) {
                setData(response.data.data)
                if (response.data.meta) {
                    setTotalPages(response.data.meta.totalPages)
                }
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setLoading(false)
        }
    }, [limit])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData(page, search, status)
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [fetchData, page, search, status])

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const handleStatusChange = (value: string) => {
        setStatus(value)
        setPage(1)
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                <div className="flex items-center space-x-2">
                    <AddUserForm onSuccess={() => fetchData(page, search, status)} />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex-1 max-w-sm">
                    <Input
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full"
                    />
                </div>
                <div className="w-[180px]">
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="SUCCESS">Success</SelectItem>
                            <SelectItem value="FAILED">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <DataTable
                    data={data}
                    columns={columns}
                    loading={loading}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}
