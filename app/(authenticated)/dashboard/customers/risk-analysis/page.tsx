"use client"

import { useCustomer } from '@/hooks/customer';
import RiskAnalytics from './risk-analysis-dashboard';

export default function RiskAnalysisPage() {

    const {
        data: customers,
        isLoading: loading,
        isError,
        error,
    } = useCustomer()
    return (
        <>
            {customers && <RiskAnalytics customers={customers} />}
        </>
    )
}
