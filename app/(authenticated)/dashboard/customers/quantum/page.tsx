"use client"
import { useCustomer } from '@/hooks/customer';
import CustomerQuantumAnalysis from './customer-quantum-analysis';

export default function CustomerQuantumPage() {
    const {
        data: customers,
        isLoading,
        isError,
        error
    } = useCustomer();

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error.message}</span>
                </div>
            </div>
        );
    }

    return customers && <CustomerQuantumAnalysis customers={customers} />;
}
