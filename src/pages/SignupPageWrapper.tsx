import { SignupLoginStep } from "@/components/travel/SignupLoginStep";
import { useNavigate } from "react-router-dom";

const SignupPageWrapper = () => {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate('/dashboard');
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
            <SignupLoginStep onNext={handleNext} onBack={handleBack} />
        </div>
    );
};

export default SignupPageWrapper;
