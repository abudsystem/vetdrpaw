import React from "react";
import { CheckCircle2 } from "lucide-react";

export interface ServiceSection {
    category: string;
    items: string[];
}

export const ServiceCard = ({ section }: { section: ServiceSection }) => {
    return (
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 group">
            <div className="px-8 py-10">
                <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight group-hover:text-teal-600 transition-colors duration-300">
                    {section.category}
                </h3>
                <div className="w-12 h-1 bg-teal-500/30 rounded-full mb-8 group-hover:w-20 group-hover:bg-teal-500 transition-all duration-500" />

                <ul className="space-y-4">
                    {section.items.map((item) => (
                        <li key={item} className="flex items-start group/item">
                            <span className="flex-shrink-0 mt-1">
                                <CheckCircle2 className="w-5 h-5 text-teal-500 transition-transform group-hover/item:scale-110" />
                            </span>
                            <span className="ml-3 text-gray-600 font-medium leading-relaxed group-hover/item:text-gray-900 transition-colors">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
    );
};
