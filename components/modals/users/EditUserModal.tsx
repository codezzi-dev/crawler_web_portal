"use client";

import { useState, useEffect } from "react";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { Select } from "@/components/ui/custom-ui/CustomSelect";
import { useUpdateUser, type UserItem, type UserRole, type UserStatus } from "@/api/users";

interface EditUserModalProps {
  user: UserItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditUserModal({
  user,
  open,
  onOpenChange,
  onSuccess,
}: EditUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");

  const updateMutation = useUpdateUser();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "USER");
      setStatus(user.status || "ACTIVE");
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateMutation.mutate(
      {
        id: user.id,
        payload: {
          name,
          email,
          role,
          status,
        },
      },
      {
        onSuccess: () => {
          toast.success("User profile updated");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update user");
        },
      },
    );
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit User Profile"
      subtitle={`Modify attributes for ${user?.email || "User"}`}
      icon={UserCheck}
      size="md"
      onSubmit={handleSubmit}
      secondaryActions={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      }
      primaryActions={
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <Input
        label="Full Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        label="Email Address"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <Select
          label="System Role"
          options={[
            { label: "USER — Crawler Client", value: "USER" },
            { label: "ORG_ADMIN — Organization Admin", value: "ORG_ADMIN" },
            { label: "SP_ADMIN — Service Provider Admin", value: "SP_ADMIN" },
          ]}
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        />

        <Select
          label="Account Status"
          options={[
            { label: "ACTIVE — Operational", value: "ACTIVE" },
            { label: "SUSPENDED — Block Access", value: "SUSPENDED" },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value as UserStatus)}
        />
      </div>
    </AppModal>
  );
}
