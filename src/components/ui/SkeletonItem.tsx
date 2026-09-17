import React from "react";

export function SkeletonItem() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#e2ece8] bg-white shadow-xs animate-pulse">
      <div className="h-[155px] w-full bg-[#e6efeb]" />
      <div className="flex flex-1 flex-col p-3 space-y-2">
        <div className="h-4 w-3/4 bg-[#e6efeb] rounded-md" />
        <div className="h-3 w-1/2 bg-[#e6efeb] rounded-md" />
        <div className="h-3 w-full bg-[#f0f5f3] rounded-md mt-1" />
        <div className="h-3 w-4/5 bg-[#f0f5f3] rounded-md" />
        <div className="mt-auto pt-2 border-t border-[#f0f4f2] flex items-center justify-between">
          <div className="h-3 w-16 bg-[#e6efeb] rounded-md" />
          <div className="h-3 w-14 bg-[#e6efeb] rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonItem;
