import { useEffect, useState } from "react"
import { columns, type UserPayment } from "@/components/users/columns"
import { DataTable } from "@/components/ui/data-table"
import { AddUserForm } from "@/components/users/add-user-form"
import axios from "axios"

export default function UserPage() {
    const [data, setData] = useState<UserPayment[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await axios.get("http://localhost:8000/api/v1/user")
            if (response.data.success) {
                setData(response.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                <div className="flex items-center space-x-2">
                    <AddUserForm onSuccess={fetchData} />
                </div>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <DataTable data={data} columns={columns} />
            </div>
        </>
    )
}
