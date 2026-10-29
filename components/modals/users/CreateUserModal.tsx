"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { Select } from "@/components/ui/custom-ui/CustomSelect";
import { useCreateUser, type UserRole, type UserStatus } from "@/api/users";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateUserModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");

  const createMutation = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }

    createMutation.mutate(
      {
        name,
        email,
        password: password || undefined,
        role,
        status,
      },
      {
        onSuccess: () => {
          toast.success("User account created successfully");
          onOpenChange(false);
          setName("");
          setEmail("");
          setPassword("");
          setRole("USER");
          setStatus("ACTIVE");
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create user");
        },
      },
    );
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create User Account"
      subtitle="Provision credentials and assign system roles"
      icon={UserPlus}
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
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create User"}
        </Button>
      }
    >
      <Input
        label="Full Name"
        required
        placeholder="e.g. John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        label="Email Address"
        type="email"
        required
        placeholder="client@organization.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Initial Password"
        type="password"
        placeholder="Leave blank for system temporary token"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
