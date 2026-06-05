import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { SubPrice, SubscriptionItem } from "@/types/subscription";
import { Check, X } from "lucide-react";

type UserCardProps = {
  handlePlanAction: (plan: {
    plan: string;
    limits: number;
    features: string[];
    expireDate: string;
    currency: string;
  }) => void;
  subscriptions: SubscriptionItem[];
  subPrices: SubPrice[];
  loading: boolean;
  handleCancel: (id: string) => void;
};
export const UserCard = ({
  handlePlanAction,
  subscriptions,
  subPrices,
  loading,
  handleCancel,
}: UserCardProps) => {
  const activeSubscription = subscriptions.find((s) => s.status === "active");
  const plans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      description: "Perfect for individuals getting started",
      features: [
        { label: "Up to 1 waiter", included: true },
        { label: "Up to 1 cheif", included: true },
        { label: "Up to 1 accountant", included: true },
        { label: "Basic support", included: true },
      ],
      button: { label: "Get Started", variant: "outline" },
      highlight: false,
    },
    {
      name: "Pro",
      price: subPrices.find((p) => p.plan === "pro")?.price || "$49",
      period: "/month",
      description: "Best for growing teams and businesses",
      features: [
        { label: "Unlimited menu", included: true },
        { label: "Unlimited waiter", included: true },
        { label: "Unlimited cheif", included: true },
        { label: "Unlimited accountant", included: true },
        { label: "Priority support", included: true },
        { label: "Team collaboration", included: true },
      ],
      button: { label: "Upgrade Now", variant: "primary" },
      highlight: true,
      highlightLabel: "Most Popular",
    },
    {
      name: "Premium",
      price: subPrices.find((p) => p.plan === "premium")?.price || "$99",
      period: "/year",
      description: "For large organizations with advanced needs",
      features: [
        { label: "Unlimited menu", included: true },
        { label: "unlimited waiter", included: true },
        { label: "unlimited accountant", included: true },
        { label: "Unlimited storage", included: true },
        { label: "24/7 premium support", included: true },
        { label: "Team collaboration", included: false },
      ],
      button: { label: "Upgrade Now", variant: "outline" },
      highlight: false,
    },
  ];

  const handleButtonClick = async (plan: (typeof plans)[0]) => {
    const planName = plan.name.toLowerCase();

    if (planName === "basic") {
      return;
    }

    if (
      activeSubscription?.plan === planName &&
      activeSubscription.status === "active"
    ) {
      if (activeSubscription._id) {
        await handleCancel(activeSubscription._id);
      }
      return;
    }

    if (!activeSubscription || activeSubscription.plan === "basic") {
      await handlePlanAction({
        plan: planName,
        limits: plan.name === "Pro" ? 100 : Infinity,
        features: plan.features.filter((f) => f.included).map((f) => f.label),
        expireDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        ).toISOString(),
        currency: "USD",
      });
    }
  };

  const getButtonLabel = (plan: (typeof plans)[0]) => {
    const planName = plan.name.toLowerCase();

    if (planName === "basic") {
      return activeSubscription?.plan === "basic"
        ? "Current Plan"
        : "Free Plan";
    }

    if (
      activeSubscription?.plan === planName &&
      activeSubscription.status === "active"
    ) {
      return "Cancel";
    }

    return plan.button.label;
  };

  const isButtonDisabled = (plan: (typeof plans)[0]) => {
    const planName = plan.name.toLowerCase();

    if (planName === "basic") {
      return true;
    }

    if (loading) {
      return true;
    }

    if (
      activeSubscription &&
      activeSubscription.plan !== "basic" &&
      activeSubscription.plan !== planName &&
      activeSubscription.status === "active"
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`rounded-lg relative transition-all duration-200 ${
            plan.highlight
              ? "ring-opacity-50 scale-105 ring-2 ring-primary border-stone-200"
              : "border-stone-200"
          } bg-white text-card-foreground`}
        >
          {plan.highlight && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="inline-flex pt-3.5 items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-primary text-primary-foreground px-3 py-1">
                {plan.highlightLabel}
              </div>
            </div>
          )}
          <CardHeader className="flex flex-col space-y-1.5 p-6 text-center">
            <CardTitle className="tracking-tight text-xl font-bold text-stone-900">
              {plan.name}
            </CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold text-stone-900">
                {plan.price}
              </span>
              <span className="text-stone-500">{plan.period}</span>
            </div>
            <p className="text-sm text-stone-600 mt-2">{plan.description}</p>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li className="flex items-center gap-2" key={feature.label}>
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-stone-400" />
                  )}
                  <span
                    className={`text-sm ${feature.included ? "text-stone-900" : "text-stone-500"}`}
                  >
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleButtonClick(plan)}
              disabled={isButtonDisabled(plan)}
              className={`inline-flex items-center justify-center border align-middle select-none font-sans font-normal text-center h-10 px-4 py-2 w-full mt-6 whitespace-nowrap rounded-lg text-sm shadow-sm transition ${
                isButtonDisabled(plan)
                  ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
                  : activeSubscription?.plan === plan.name.toLowerCase() &&
                      activeSubscription.status === "active"
                    ? "bg-red-600 hover:bg-red-700 text-white border-red-700"
                    : plan.button.variant === "primary"
                      ? "bg-stone-800 hover:bg-stone-700 text-stone-50 border-stone-900"
                      : "bg-transparent text-stone-700 border-stone-300 hover:border-stone-600 hover:opacity-60"
              }`}
            >
              {getButtonLabel(plan)}
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
