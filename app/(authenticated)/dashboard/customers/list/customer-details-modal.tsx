import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCustomerDetails } from "@/hooks/customer";
import { Customer } from "@/lib/types/customer";


interface CustomerDetailsProps {
    customer: Customer;
}

export function CustomerDetailsModal({ customer, }: CustomerDetailsProps) {
    const { data: details, isLoading: loading } = useCustomerDetails(customer.id as string);

    return (

        <>
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Overview Section */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-medium text-gray-500">Lifetime Value</h3>
                                <p className="text-2xl font-bold">${details?.lifetimeValue?.toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-500">Average Order Value</h3>
                                <p className="text-2xl font-bold">${details?.averageOrderValue?.toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-500">Total Orders</h3>
                                <p className="text-2xl font-bold">{details?.ordersCount}</p>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Contact Information</h3>
                                <div className="space-y-2">
                                    <p>Name: {details?.firstName} {details?.lastName}</p>
                                    <p>Email: {details?.email}</p>
                                    <p>Phone: {details?.phone || 'Not provided'}</p>
                                    {details?.addresses?.[0] && (
                                        <div>
                                            <p className="font-medium">Primary Address:</p>
                                            <p>{details.addresses[0].address1}</p>
                                            <p>{details.addresses[0].city}, {details.addresses[0].province}</p>
                                            <p>{details.addresses[0].country}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Account Details</h3>
                                <div className="space-y-2">
                                    <p>Customer Since: {new Date(details?.createdAt).toLocaleDateString()}</p>
                                    <p>Account Status: {details?.state}</p>
                                    <p>Marketing Consent: {details?.emailMarketingConsent?.state}</p>
                                    <p>Tax Exempt: {details?.taxExempt ? 'Yes' : 'No'}</p>
                                    <p>Tags: {details?.tags || 'None'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Recent Orders</h3>
                            <div className="divide-y">
                                {details?.recentOrders?.map((order: any) => (
                                    <div key={order.id} className="py-3 grid grid-cols-4 gap-4">
                                        <div>
                                            <p className="font-medium">Order #{order.orderNumber}</p>
                                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">${order.totalPrice}</p>
                                            <p className="text-sm text-gray-500">{order.itemCount} items</p>
                                        </div>
                                        <div>
                                            <p className={`inline-px-2 py-1 rounded-full text-sm ${order.fulfillmentStatus === 'fulfilled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.fulfillmentStatus}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`inline-px-2 py-1 rounded-full text-sm ${order.financialStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {order.financialStatus}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Products Purchased */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Frequently Purchased Products</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {details?.topProducts?.map((product: any) => (
                                    <div key={product.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium">{product.title}</p>
                                            <p className="text-sm text-gray-500">Purchased {product.purchaseCount} times</p>
                                        </div>
                                        <p className="font-medium">${product.totalSpent}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Customer Behavior</h3>
                                <div className="space-y-2">
                                    <p>Average Days Between Orders: {details?.averageOrderGap}</p>
                                    <p>Last Seen: {details?.lastSeen ? new Date(details.lastSeen).toLocaleDateString() : 'Never'}</p>
                                    <p>Preferred Product Categories: {details?.preferredCategories?.join(', ') || 'None'}</p>
                                    <p>Returns: {details?.returnsCount || 0}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Risk Analysis</h3>
                                <div className="space-y-2">
                                    <p>Risk Score: {customer.riskScore}</p>
                                    <p>Payment Reliability: {details?.paymentReliability || 'Good'}</p>
                                    <p>Churn Probability: {details?.churnProbability}%</p>
                                    <p>Lifetime Value Trend: {details?.lifetimeValueTrend || 'Stable'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </>
    );
}
