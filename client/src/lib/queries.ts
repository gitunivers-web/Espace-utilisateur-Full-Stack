import { useQuery, useMutation, UseQueryResult } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./queryClient";
import type { LoanType, LoanApplication, CreateLoanApplication } from "@shared/schema";

export interface LoanSimulation {
  amount: number;
  durationMonths: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  estimatedRate: number;
  taeg: number;
}

export function useLoanTypes(category?: string): UseQueryResult<LoanType[], Error> {
  return useQuery({
    queryKey: category ? ["/api/loan-types", category] : ["/api/loan-types"],
    queryFn: async () => {
      const url = category ? `/api/loan-types?category=${category}` : "/api/loan-types";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch loan types");
      return res.json();
    },
  });
}

export function useLoanType(id: string): UseQueryResult<LoanType, Error> {
  return useQuery({
    queryKey: ["/api/loan-types", id],
    enabled: !!id,
  });
}

export function useLoanSimulation() {
  return useMutation({
    mutationFn: async (params: { loanTypeId: string; amount: number; durationMonths: number }) => {
      const response = await fetch("/api/loan-simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error("Simulation failed");
      return (await response.json()) as LoanSimulation;
    },
  });
}

export function useLoanApplications(): UseQueryResult<LoanApplication[], Error> {
  return useQuery({
    queryKey: ["/api/loan-applications"],
  });
}

export function useCreateLoanApplication() {
  return useMutation({
    mutationFn: async (data: CreateLoanApplication) => {
      const response = await fetch("/api/loan-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create application");
      }
      return (await response.json()) as LoanApplication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
    },
  });
}
