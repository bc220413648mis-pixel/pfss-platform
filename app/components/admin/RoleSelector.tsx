'use client';

import { Role } from "@prisma/client";
import { updateUserRole } from "@/lib/actions/admin-actions";
import { useState } from "react";

interface RoleSelectorProps {
  userId: string;
  initialRole: Role;
}

export default function RoleSelector({ userId, initialRole }: RoleSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (newRole: Role) => {
    setIsUpdating(true);
    try {
      await updateUserRole(userId, newRole);
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Role update failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative inline-block">
      <select 
        disabled={isUpdating}
        defaultValue={initialRole}
        onChange={(e) => handleRoleChange(e.target.value as Role)}
        className={`text-[10px] font-black px-3 py-1.5 rounded-lg border-2 appearance-none cursor-pointer outline-none transition-all ${
          isUpdating ? 'opacity-50 cursor-wait' : ''
        } ${
          initialRole === 'FOUNDER' ? 'bg-slate-900 text-white border-slate-900' :
          initialRole === 'AUDITOR' ? 'bg-blue-50 text-blue-700 border-blue-100' :
          initialRole === 'QA_ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
          'bg-slate-100 text-slate-600 border-slate-200'
        }`}
      >
        {Object.values(Role).map(r => (
          <option key={r} value={r} className="bg-white text-slate-900 font-bold">
            {r}
          </option>
        ))}
      </select>
      {isUpdating && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2">
          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}