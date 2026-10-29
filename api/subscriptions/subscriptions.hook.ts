"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "./subscriptions.api";
import { subscriptionKeys } from "./subscriptions.keys";
import {
  subscriptionDetailQueryOptions,
  subscriptionsQueryOptions,
} from "./subscriptions.queries";
import type {
  CreateSubscriptionPayload,
  QuerySubscriptionsParams,
  UpdateSubscriptionPayload,
} from "./subscriptions.type";

export function useSubscriptions(params?: QuerySubscriptionsParams) {
  return useQuery(subscriptionsQueryOptions(params));
}

export function useSubscriptionDetail(id: string) {
  return useQuery(subscriptionDetailQueryOptions(id));
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) =>
      subscriptionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSubscriptionPayload;
    }) => subscriptionsApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}
