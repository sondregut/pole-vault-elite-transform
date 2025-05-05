
import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionWithIconProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

const SectionWithIcon = ({ icon: Icon, title, children }: SectionWithIconProps) => {
  return (
    <div className="mb-8">
      <h4 className="text-xl font-semibold mb-3 flex items-center">
        <div className="w-12 h-12 bg-[#EBF1FF] rounded-full flex items-center justify-center mr-3">
          <Icon className="text-[#3176FF]" />
        </div>
        {title}
      </h4>
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default SectionWithIcon;
