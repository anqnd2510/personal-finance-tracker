import {
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

const OverviewCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      name: "Total Balance",
      value: `$${stats.totalBalance?.toLocaleString() || "0.00"}`,
      change: "+2.5%",
      changeType: "positive",
      icon: WalletIcon,
    },
    {
      name: "Monthly Income",
      value: `$${stats.monthlyIncome?.toLocaleString() || "0.00"}`,
      change: "+12.3%",
      changeType: "positive",
      icon: ArrowTrendingUpIcon,
    },
    {
      name: "Monthly Expenses",
      value: `$${stats.monthlyExpenses?.toLocaleString() || "0.00"}`,
      change: "-5.2%",
      changeType: "negative",
      icon: BanknotesIcon,
    },
    {
      name: "Budget Remaining",
      value: `$${stats.budgetRemaining?.toLocaleString() || "0.00"}`,
      change: "68% left",
      changeType: "neutral",
      icon: CreditCardIcon,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <card.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {card.value}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {card.changeType === "positive" && (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              )}
              {card.changeType === "negative" && (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`${
                  card.changeType === "positive"
                    ? "text-green-600"
                    : card.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {card.change}
              </span>
              {card.changeType !== "neutral" && (
                <span className="ml-1 text-gray-500">from last month</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
