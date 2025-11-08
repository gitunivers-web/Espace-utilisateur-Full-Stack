import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, Account, Card, Transaction, Loan, UserWithoutPassword } from "@shared/schema";

const API_BASE = "/api";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || "Une erreur est survenue");
  }

  return response.json();
}

export function useUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: () => fetchApi("/user"),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<User>) =>
      fetchApi<User>("/user", {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useAccounts() {
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: () => fetchApi("/accounts"),
  });
}

export function useAccount(id: string | undefined) {
  return useQuery<Account>({
    queryKey: ["account", id],
    queryFn: () => fetchApi(`/accounts/${id}`),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (account: Partial<Account>) =>
      fetchApi<Account>("/accounts", {
        method: "POST",
        body: JSON.stringify(account),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useCards() {
  return useQuery<Card[]>({
    queryKey: ["cards"],
    queryFn: () => fetchApi("/cards"),
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (card: Partial<Card>) =>
      fetchApi<Card>("/cards", {
        method: "POST",
        body: JSON.stringify(card),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Card> }) =>
      fetchApi<Card>(`/cards/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useTransactions(accountId: string | undefined) {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", accountId],
    queryFn: () => fetchApi(`/transactions/${accountId}`),
    enabled: !!accountId,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: Partial<Transaction>) =>
      fetchApi<Transaction>("/transactions", {
        method: "POST",
        body: JSON.stringify(transaction),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useLoans() {
  return useQuery<Loan[]>({
    queryKey: ["loans"],
    queryFn: () => fetchApi("/loans"),
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loan: Partial<Loan>) =>
      fetchApi<Loan>("/loans", {
        method: "POST",
        body: JSON.stringify(loan),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Loan> }) =>
      fetchApi<Loan>(`/loans/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transfer: {
      fromAccountId: string;
      toAccountNumber: string;
      amount: string;
      description: string;
    }) =>
      fetchApi<{ transaction: Transaction }>("/transfers", {
        method: "POST",
        body: JSON.stringify(transfer),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export interface MonthlyStats {
  month: string;
  revenus: number;
  dépenses: number;
}

export function useMonthlyStats() {
  return useQuery<MonthlyStats[]>({
    queryKey: ["stats", "monthly"],
    queryFn: () => fetchApi("/stats/monthly"),
  });
}

export function useAuth() {
  return useQuery<{ user: UserWithoutPassword }>({
    queryKey: ["auth", "me"],
    queryFn: () => fetchApi("/auth/me"),
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      fetchApi<{ user: UserWithoutPassword }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data);
      queryClient.invalidateQueries();
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      fullName: string;
      email: string;
      password: string;
      phone?: string;
    }) =>
      fetchApi<{ user: UserWithoutPassword }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data);
      queryClient.invalidateQueries();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchApi<{ success: boolean }>("/auth/logout", {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
  });
}
