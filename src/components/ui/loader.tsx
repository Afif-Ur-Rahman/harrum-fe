import { Loader2 } from "lucide-react";


const Loader = ({ label = "" , labelColor = "text-black", loaderColor = "text-black"}) => {
  return (
    <div className="flex items-center justify-center h-50">
      <div className="flex items-center space-x-2">
        <Loader2 className={`w-6 h-6 animate-spin ${loaderColor}`} />
        <span className={`${labelColor} font-medium`}>Loading {label}...</span>
      </div>
    </div>
  );
};

export default Loader;
