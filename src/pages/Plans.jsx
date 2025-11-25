import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { plansAPI } from "../services/api";

/* Neon Check Icon */
const CheckIcon = ({ className = "neon-icon icon-sm" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
    >
        <defs>
            <linearGradient id="g-check-plan" x1="0" x2="1">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
        </defs>
        <path
            d="M20 6L9 17l-5-5"
            stroke="url(#g-check-plan)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await plansAPI.getAll();
            setPlans(response.data);
        } catch (error) {
            console.error("Failed to fetch plans:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId) => {
        setSubscribing(planId);
        try {
            await plansAPI.subscribe(planId);
            navigate("/dashboard", {
                state: { message: "Successfully subscribed!" },
            });
        } catch (error) {
            alert(error.response?.data?.message || "Subscription failed");
        } finally {
            setSubscribing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-16 px-6 relative overflow-hidden">

            {/* Floating Orbs */}
            <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 right-20 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

            {/* Header */}
            <div className="text-center mb-16 animate-slide-up">
                <h1 className="text-5xl font-extrabold gradient-text drop-shadow-xl">
                    Choose Your Plan
                </h1>
                <p className="text-gray-300 mt-3 text-lg">
                    Select a subscription that fits your workflow
                </p>
            </div>

            {/* Plans Grid */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="
                            glass-dark rounded-2xl border border-white/10 
                            shadow-2xl p-8 backdrop-blur-strong 
                            hover:scale-[1.03] hover:shadow-purple-500/40 
                            transition animate-fade-in
                        "
                    >
                        {/* Title */}
                        <h3 className="text-3xl font-bold text-indigo-200 mb-3">
                            {plan.name}
                        </h3>

                        {/* Price */}
                        <div className="mb-8">
                            <span className="text-5xl font-extrabold text-white-300 drop-shadow-md">
                                ${plan.price}
                            </span>
                            <span className="text-white-400 ml-2 text-xl">
                                / {plan.duration} days
                            </span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-4 mb-10">
                            {(plan.features || []).map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-start text-gray-200 text-lg"
                                >
                                    <CheckIcon />
                                    <span className="ml-3">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Button */}
                        <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={subscribing === plan.id}
                            className="
                                w-full py-3 rounded-lg font-semibold text-lg
                                bg-gradient-to-r from-indigo-600 to-purple-600
                                hover:from-indigo-500 hover:to-purple-500
                                shadow-lg hover:shadow-indigo-500/40
                                transition disabled:opacity-40
                                glow-on-hover btn-3d
                            "
                        >
                            {subscribing === plan.id
                                ? "Subscribing..."
                                : "Subscribe Now"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;
