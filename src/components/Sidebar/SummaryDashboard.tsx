/**
 * SummaryDashboard - Right sidebar showing financial summary
 *
 * TODO: Implement this component to show:
 * - Credit Balance card (top) with amount and trend icon
 * - Recent transactions list (Bill & Taxes, Car Energy, Design Course, etc.)
 * - Profit and Loss section with amount and "On track" status
 * - Spent this month section with chart
 *
 * Design reference:
 * - Green background for balance card
 * - Transaction items with icon, name, date, and amount
 * - Line chart for spending trend
 */
export default function SummaryDashboard() {
    return (
        <div className="flex flex-col gap-4 h-full">
            {/* TODO: Credit Balance Card */}
            <div className="bg-emerald-700 text-white rounded-xl p-4">
                <p className="text-sm opacity-80">Credit Balance</p>
                <p className="text-3xl font-bold">$25,215</p>
                {/* TODO: Add trend icon/chart */}
            </div>

            {/* TODO: Recent Transactions */}
            <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Recent</p>
                <ul className="space-y-3">
                    {/* TODO: Map over transactions data */}
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-gray-100 rounded-full" />
                            <div>
                                <p className="text-sm font-medium">Bill & Taxes</p>
                                <p className="text-xs text-gray-400">Today, 16:36</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-red-500">-$154.50</span>
                    </li>
                    {/* Add more transaction items */}
                </ul>
            </div>

            {/* TODO: Profit and Loss Section */}
            <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Profit and Loss</p>
                <p className="text-2xl font-bold">$682.5</p>
                <span className="text-emerald-600 text-sm">● On track</span>
            </div>

            {/* TODO: Spent this month with chart */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Spent this month</p>
                    <span className="text-xs text-emerald-600">+2.45%</span>
                </div>
                <p className="text-2xl font-bold">$682.5</p>
                <span className="text-emerald-600 text-sm">● On track</span>
                {/* TODO: Add line chart component */}
                <div className="h-16 bg-gray-50 rounded mt-2 flex items-end justify-center text-gray-300 text-xs">
                    [Chart placeholder]
                </div>
            </div>
        </div>
    );
}
