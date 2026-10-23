import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PortfolioDetail, PortfolioFilter } from "../model/types";
import {
  createPortfolio,
  deletePortfolio,
  getMyPagePortfolios,
  getPortfolio,
  getPortfolios,
  likePortfolio,
  type MyPortfolioTab,
} from "./portfolioApi";

export const portfolioKeys = {
  all: ["portfolios"] as const,
  lists: ["portfolios", "list"] as const,
  list: (filter: PortfolioFilter) => ["portfolios", "list", filter] as const,
  detail: (id: number) => ["portfolios", "detail", id] as const,
  mine: (tab: MyPortfolioTab) => ["portfolios", "mine", tab] as const,
};

export function usePortfolios(filter: PortfolioFilter) {
  return useQuery({
    queryKey: portfolioKeys.list(filter),
    queryFn: () => getPortfolios(filter),
  });
}

export function usePortfolio(id: number) {
  return useQuery({
    queryKey: portfolioKeys.detail(id),
    queryFn: () => getPortfolio(id),
    enabled: Number.isFinite(id),
  });
}

export function useMyPagePortfolios(tab: MyPortfolioTab) {
  return useQuery({
    queryKey: portfolioKeys.mine(tab),
    queryFn: () => getMyPagePortfolios(tab),
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPortfolio,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portfolioKeys.all }),
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePortfolio,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portfolioKeys.all }),
  });
}

/** 좋아요 토글. 상세 캐시는 서버 응답 값으로 바로 갱신하고 목록은 다시 불러온다. */
export function useToggleLike(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (like: boolean) => likePortfolio(id, like),
    onSuccess: ({ liked, likeCount }) => {
      queryClient.setQueryData<PortfolioDetail>(portfolioKeys.detail(id), (prev) =>
        prev ? { ...prev, liked, likeCount } : prev,
      );
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists });
      queryClient.invalidateQueries({ queryKey: ["portfolios", "mine"] });
    },
  });
}
